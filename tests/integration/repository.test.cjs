const test = require("node:test");
const assert = require("node:assert/strict");
const domain = require("../../src/domain.js");
const storage = require("../../src/storage.js");

function event(id, quantity = 1) {
  return domain.createOperationalEvent({ id, type: "mortality", date: "2026-08-31", time: "09:30", farmId: "red", houseId: "red-1", flockId: "alpha", quantity, source: "quick_record", clientOperationId: `op-${id}` }, new Date("2026-09-02T00:00:00Z"));
}

function installMemoryStorage(initial = {}) {
  const previousStorage = global.localStorage;
  const values = { ...initial };
  global.localStorage = {
    getItem(key) { return values[key] || null; },
    setItem(key, value) { values[key] = String(value); },
    removeItem(key) { delete values[key]; },
  };
  return { values, restore() { global.localStorage = previousStorage; } };
}

test("LabRepository uses an overlay and keeps the fixture object unchanged", () => {
  const fixture = { events: [event("fixture-event", 5)] };
  const before = JSON.stringify(fixture);
  const repo = new storage.LabRepository({ fixture });
  repo.appendEvent(event("runtime-event", 2));
  assert.equal(JSON.stringify(fixture), before);
  assert.equal(repo.snapshot().events.length, 1);
  assert.equal(repo.snapshot().events[0].id, "runtime-event");
});

test("outbox is local, idempotent, and reconnect sync does not duplicate", () => {
  const repo = new storage.LabRepository();
  const op = { clientOperationId: "same-operation", type: "create_event", eventId: "runtime-event" };
  repo.setMode("BACKEND_TEMP_DOWN");
  const first = repo.queueOperation(op);
  const second = repo.queueOperation(op);
  assert.equal(first.status, "queued");
  assert.equal(second.duplicate, true);
  assert.equal(repo.snapshot().outbox.length, 1);
  assert.equal(repo.sync({ backendAvailable: false }).status, "BACKEND_TEMP_DOWN");
  assert.equal(repo.snapshot().outbox.length, 1);
  const synced = repo.sync({ backendAvailable: true });
  assert.equal(synced.synced, 1);
  assert.equal(repo.snapshot().outbox.length, 0);
  assert.equal(repo.sync({ backendAvailable: true }).synced, 0);
  assert.deepEqual(repo.snapshot().syncedOperationIds, ["same-operation"]);
});

test("sync conflict becomes Pending Review instead of last-write-wins", () => {
  const repo = new storage.LabRepository();
  repo.queueOperation({ clientOperationId: "conflict-operation", type: "create_event", eventId: "event-a" });
  const result = repo.sync({ backendAvailable: true, conflictClientOperationIds: ["conflict-operation"] });
  assert.equal(result.conflicts, 1);
  assert.equal(repo.snapshot().pendingReviews.length, 1);
  assert.match(repo.snapshot().pendingReviews[0].detail, /last-write-wins/);
  repo.sync({ backendAvailable: true, conflictClientOperationIds: ["conflict-operation"] });
  assert.equal(repo.snapshot().pendingReviews.length, 1);
});

test("reset fixture clears runtime state but preserves append-only audit history", () => {
  const repo = new storage.LabRepository();
  repo.appendEvent(event("reset-event"), { id: "audit-reset", operation: "create" });
  repo.queueOperation({ clientOperationId: "reset-operation", type: "create_event" });
  repo.setMode("BACKEND_LONG_DOWN");
  const reset = repo.resetFixture();
  assert.equal(reset.events.length, 0);
  assert.equal(reset.auditEntries.length, 1);
  assert.equal(reset.auditEntries[0].id, "audit-reset");
  assert.equal(reset.outbox.length, 0);
  assert.equal(reset.mode, "ONLINE");
});

test("reset fixture persists append-only audit history across repository reload", () => {
  const previousStorage = global.localStorage;
  const values = {};
  global.localStorage = {
    getItem(key) { return values[key] || null; },
    setItem(key, value) { values[key] = String(value); },
    removeItem(key) { delete values[key]; },
  };
  try {
    const repo = new storage.LabRepository();
    repo.appendEvent(event("persisted-reset-event"), { id: "persisted-reset-audit", operation: "create" });
    repo.resetFixture();
    const reloaded = new storage.LabRepository();
    assert.deepEqual(reloaded.snapshot().events, []);
    assert.deepEqual(reloaded.snapshot().auditEntries.map((entry) => entry.id), ["persisted-reset-audit"]);
  } finally {
    global.localStorage = previousStorage;
  }
});

test("master data stays in the runtime overlay and is append-only", () => {
  const now = new Date("2026-09-03T00:00:00Z");
  const farm = domain.createFarm({ id: "farm-overlay", name: "Overlay 場" }, now);
  const house = domain.createHouse({ id: "house-overlay", farmId: farm.id, name: "Overlay 舍", code: "O1" }, now);
  const flock = domain.createFlock({ id: "flock-overlay", houseId: house.id, code: "O-001", initial: 200, chickIn: "2026-09-01", plannedShipment: "2026-09-20" }, now);
  const caretaker = domain.createCaretakerAssignment({ id: "assignment-overlay", farmId: farm.id, caretakerName: "Overlay 照顧者" }, now);
  const identity = domain.createFarmFinanceIdentity({ id: "identity-overlay", operationalFarmId: farm.id }, now);
  const fixture = { farms: [{ id: "fixture-farm", name: "Fixture 場" }], events: [] };
  const before = JSON.stringify(fixture);
  const repo = new storage.LabRepository({ fixture });
  const auditEntries = [farm, house, flock, caretaker, identity].map((entity) => domain.createAuditEntry({ entityType: entity === farm ? "Farm" : entity === house ? "House" : entity === flock ? "Flock" : entity === caretaker ? "CaretakerAssignment" : "FarmFinanceIdentity", entityId: entity.id, source: "master_data" }, now));

  repo.appendMasterDataBatch([
    { entityType: "Farm", entity: farm },
    { entityType: "House", entity: house },
    { entityType: "Flock", entity: flock },
    { entityType: "CaretakerAssignment", entity: caretaker },
    { entityType: "FarmFinanceIdentity", entity: identity },
  ], auditEntries);
  repo.appendMasterData("Farm", farm, auditEntries[0]);

  assert.equal(JSON.stringify(fixture), before);
  assert.deepEqual(Object.fromEntries(Object.entries(repo.snapshot().masterData).map(([key, rows]) => [key, rows.length])), {
    farms: 1, houses: 1, flocks: 1, caretakerAssignments: 1, financeIdentities: 1,
  });
  assert.equal(repo.snapshot().auditEntries.length, 5);
  assert.deepEqual(domain.validateMasterData(repo.snapshot().masterData), {
    farms: 1, houses: 1, flocks: 1, caretakerAssignments: 1, financeIdentities: 1,
  });
  const reset = repo.resetFixture();
  assert.deepEqual(reset.masterData, { farms: [], houses: [], flocks: [], caretakerAssignments: [], financeIdentities: [] });
});

test("master data write boundary rejects invalid relationships without partial single writes", () => {
  const memory = installMemoryStorage();
  const previousDomain = global.JinjiDomain;
  global.JinjiDomain = domain;
  try {
    const now = new Date("2026-09-03T00:00:00Z");
    const farm = domain.createFarm({ id: "boundary-farm", name: "Boundary 場" }, now);
    const identity = domain.createFarmFinanceIdentity({ id: "boundary-identity", operationalFarmId: farm.id }, now);
    const repo = new storage.LabRepository();
    repo.appendMasterDataBatch([
      { entityType: "Farm", entity: farm },
      { entityType: "FarmFinanceIdentity", entity: identity },
    ]);
    const before = repo.snapshot();
    const persistedBefore = memory.values["jinji-v14r-lab-runtime-overlay-v1"];
    const invalidHouse = domain.createHouse({ id: "boundary-invalid-house", farmId: "missing-farm", name: "孤兒舍", code: "X1" }, now);
    assert.throws(() => repo.appendMasterData("House", invalidHouse), /LAB_MASTER_DATA_RELATIONSHIP_INVALID|MASTER_DATA_CONTRACT_INVALID/);
    assert.deepEqual(repo.snapshot(), before);
    assert.equal(memory.values["jinji-v14r-lab-runtime-overlay-v1"], persistedBefore);
  } finally {
    global.JinjiDomain = previousDomain;
    memory.restore();
  }
});

test("master data batch is atomic when any relationship is invalid", () => {
  const memory = installMemoryStorage();
  const previousDomain = global.JinjiDomain;
  global.JinjiDomain = domain;
  try {
    const now = new Date("2026-09-03T00:00:00Z");
    const farm = domain.createFarm({ id: "atomic-farm", name: "Atomic 場" }, now);
    const identity = domain.createFarmFinanceIdentity({ id: "atomic-identity", operationalFarmId: farm.id }, now);
    const invalidHouse = domain.createHouse({ id: "atomic-invalid-house", farmId: "missing-farm", name: "孤兒舍", code: "X1" }, now);
    const repo = new storage.LabRepository();
    const audits = [farm, identity, invalidHouse].map((entity) => domain.createAuditEntry({ entityType: entity === farm ? "Farm" : entity === identity ? "FarmFinanceIdentity" : "House", entityId: entity.id, source: "master_data" }, now));
    assert.throws(() => repo.appendMasterDataBatch([
      { entityType: "Farm", entity: farm },
      { entityType: "FarmFinanceIdentity", entity: identity },
      { entityType: "House", entity: invalidHouse },
    ], audits), /LAB_MASTER_DATA_RELATIONSHIP_INVALID|MASTER_DATA_CONTRACT_INVALID/);
    assert.deepEqual(repo.snapshot().masterData, { farms: [], houses: [], flocks: [], caretakerAssignments: [], financeIdentities: [] });
    assert.deepEqual(repo.snapshot().auditEntries, []);
    assert.equal(memory.values["jinji-v14r-lab-runtime-overlay-v1"], undefined);
  } finally {
    global.JinjiDomain = previousDomain;
    memory.restore();
  }
});

test("malformed persisted master-data overlay is discarded, persisted, and preserves valid runtime state", () => {
  const memory = installMemoryStorage({
    "jinji-v14r-lab-runtime-overlay-v1": JSON.stringify({
      version: 1,
      events: [{ id: "preserve-event" }],
      pendingReviews: [{ id: "preserve-pending" }],
      abnormalities: [{ id: "preserve-abnormality" }],
      auditEntries: [{ id: "preserve-audit" }],
      outbox: [{ clientOperationId: "preserve-operation" }],
      syncedOperationIds: ["preserve-synced"],
      settings: { keep: true },
      masterData: { farms: [null], houses: [], flocks: [], caretakerAssignments: [], financeIdentities: [] },
      mode: "BACKEND_TEMP_DOWN",
    }),
  });
  const previousDomain = global.JinjiDomain;
  global.JinjiDomain = domain;
  try {
    const repo = new storage.LabRepository();
    assert.deepEqual(repo.snapshot().masterData, { farms: [], houses: [], flocks: [], caretakerAssignments: [], financeIdentities: [] });
    assert.deepEqual(repo.snapshot().events, [{ id: "preserve-event" }]);
    assert.deepEqual(repo.snapshot().pendingReviews, [{ id: "preserve-pending" }]);
    assert.deepEqual(repo.snapshot().abnormalities, [{ id: "preserve-abnormality" }]);
    assert.deepEqual(repo.snapshot().auditEntries, [{ id: "preserve-audit" }]);
    assert.deepEqual(repo.snapshot().outbox, [{ clientOperationId: "preserve-operation" }]);
    assert.deepEqual(repo.snapshot().syncedOperationIds, ["preserve-synced"]);
    assert.deepEqual(repo.snapshot().settings, { keep: true });
    assert.equal(repo.snapshot().mode, "BACKEND_TEMP_DOWN");
    const persisted = JSON.parse(memory.values["jinji-v14r-lab-runtime-overlay-v1"]);
    assert.deepEqual(persisted.masterData, { farms: [], houses: [], flocks: [], caretakerAssignments: [], financeIdentities: [] });
    assert.deepEqual(persisted.events, [{ id: "preserve-event" }]);
    const reloaded = new storage.LabRepository();
    assert.deepEqual(reloaded.snapshot().masterData, { farms: [], houses: [], flocks: [], caretakerAssignments: [], financeIdentities: [] });
    assert.deepEqual(reloaded.snapshot().events, [{ id: "preserve-event" }]);
  } finally {
    global.JinjiDomain = previousDomain;
    memory.restore();
  }
});
