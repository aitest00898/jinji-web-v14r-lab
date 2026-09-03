const test = require("node:test");
const assert = require("node:assert/strict");
const domain = require("../../src/domain.js");
const storage = require("../../src/storage.js");

function event(id, quantity = 1) {
  return domain.createOperationalEvent({ id, type: "mortality", date: "2026-08-31", time: "09:30", farmId: "red", houseId: "red-1", flockId: "alpha", quantity, source: "quick_record", clientOperationId: `op-${id}` }, new Date("2026-09-02T00:00:00Z"));
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

test("malformed persisted overlay rows are discarded without crashing the Lab repository", () => {
  const previousStorage = global.localStorage;
  const values = {
    "jinji-v14r-lab-runtime-overlay-v1": JSON.stringify({
      version: 1,
      events: [],
      pendingReviews: [],
      abnormalities: [],
      auditEntries: [],
      outbox: [],
      masterData: { farms: [null], houses: [], flocks: [], caretakerAssignments: [], financeIdentities: [] },
    }),
  };
  global.localStorage = {
    getItem(key) { return values[key] || null; },
    setItem() {},
    removeItem(key) { delete values[key]; },
  };
  global.JinjiDomain = domain;
  try {
    const repo = new storage.LabRepository();
    assert.deepEqual(repo.snapshot().masterData, { farms: [], houses: [], flocks: [], caretakerAssignments: [], financeIdentities: [] });
    assert.deepEqual(repo.snapshot().events, []);
  } finally {
    global.localStorage = previousStorage;
    delete global.JinjiDomain;
  }
});
