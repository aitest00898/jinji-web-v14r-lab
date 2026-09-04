const test = require("node:test");
const assert = require("node:assert/strict");
const domain = require("../../src/domain.js");
const storage = require("../../src/storage.js");

function event(id, quantity = 1, extra = {}) {
  return domain.createOperationalEvent({
    id,
    type: "mortality",
    date: "2026-09-03",
    time: "09:30",
    farmId: "farm-a",
    houseId: "house-a",
    flockId: "flock-a",
    quantity,
    source: "invariant-test",
    clientOperationId: `op-${id}`,
    ...extra,
  }, new Date("2026-09-03T09:30:00Z"));
}

function installMemoryStorage(initial = {}, { failWrites = false } = {}) {
  const previousStorage = global.localStorage;
  const values = { ...initial };
  global.localStorage = {
    getItem(key) { return values[key] || null; },
    setItem(key, value) {
      if (failWrites) throw new Error("quota exceeded");
      values[key] = String(value);
    },
    removeItem(key) { delete values[key]; },
  };
  return { values, restore() { global.localStorage = previousStorage; } };
}

function clearMemory(values) {
  delete values[storage.KEYS.overlay];
  delete values[storage.KEYS.mode];
}

function baselineFixture() {
  return {
    farms: [{
      id: "baseline-farm",
      name: "基線雞場",
      houses: [{
        id: "baseline-house",
        name: "基線一舍",
        code: "B1",
        flocks: [{
          id: "baseline-flock",
          code: "BASE-001",
          state: "active",
          status: "進行中",
          initial: 100,
          stock: 100,
          chickIn: "2026-08-01",
          ship: "2026-09-30",
        }],
      }],
    }],
  };
}

test("F2 existing fixture parents can accept runtime children, while unknown parents remain rejected", () => {
  const memory = installMemoryStorage();
  const previousDomain = global.JinjiDomain;
  global.JinjiDomain = domain;
  try {
    const now = new Date("2026-09-03T00:00:00Z");
    const repo = new storage.LabRepository({ fixture: baselineFixture() });
    const house = domain.createHouse({ id: "runtime-house", farmId: "baseline-farm", name: "新增一舍", code: "R1" }, now);
    const flock = domain.createFlock({ id: "runtime-flock", houseId: "runtime-house", code: "RUN-001", initial: 80, chickIn: "2026-09-01", plannedShipment: "2026-09-20" }, now);
    const caretaker = domain.createCaretakerAssignment({ id: "runtime-caretaker", farmId: "baseline-farm", caretakerName: "基線照顧者" }, now);

    repo.appendMasterData("House", house);
    repo.appendMasterData("Flock", flock);
    repo.appendMasterData("CaretakerAssignment", caretaker);
    assert.deepEqual(repo.snapshot().masterData.houses.map((row) => row.id), ["runtime-house"]);
    assert.deepEqual(repo.snapshot().masterData.flocks.map((row) => row.id), ["runtime-flock"]);
    assert.deepEqual(repo.snapshot().masterData.caretakerAssignments.map((row) => row.id), ["runtime-caretaker"]);

    const invalidHouse = domain.createHouse({ id: "orphan-house", farmId: "missing-farm", name: "孤兒舍", code: "X1" }, now);
    assert.throws(() => repo.appendMasterData("House", invalidHouse), /LAB_MASTER_DATA_RELATIONSHIP_INVALID|MASTER_DATA_CONTRACT_INVALID/);
  } finally {
    global.JinjiDomain = previousDomain;
    memory.restore();
  }
});

test("F4 storage write failures propagate and do not report a phantom success", () => {
  const failing = installMemoryStorage({}, { failWrites: true });
  const previousDomain = global.JinjiDomain;
  global.JinjiDomain = domain;
  try {
    const repo = new storage.LabRepository();
    assert.throws(() => repo.appendEvent(event("failed-write")), /LAB_STORAGE_WRITE_FAILED/);
    assert.deepEqual(repo.snapshot().events, []);
    assert.deepEqual(repo.snapshot().auditEntries, []);
  } finally {
    failing.restore();
    global.JinjiDomain = previousDomain;
  }

  const normal = installMemoryStorage();
  global.JinjiDomain = domain;
  try {
    const repo = new storage.LabRepository();
    repo.appendEvent(event("normal-write"));
    const reloaded = new storage.LabRepository();
    assert.deepEqual(reloaded.snapshot().events.map((row) => row.id), ["normal-write"]);
  } finally {
    global.JinjiDomain = previousDomain;
    normal.restore();
  }
});

test("F5 concurrent repository writers fail explicitly instead of silently overwriting events, audits, master data, or settings", () => {
  const memory = installMemoryStorage();
  const previousDomain = global.JinjiDomain;
  global.JinjiDomain = domain;
  try {
    const auditA = domain.createAuditEntry({ id: "audit-a", entityId: "event-a", source: "invariant-test" });
    const auditB = domain.createAuditEntry({ id: "audit-b", entityId: "event-b", source: "invariant-test" });
    const repoA = new storage.LabRepository();
    const repoB = new storage.LabRepository();
    repoA.appendEvent(event("event-a"), auditA);
    assert.throws(() => repoB.appendEvent(event("event-b"), auditB), /LAB_STORAGE_CONFLICT/);
    let reloaded = new storage.LabRepository();
    assert.deepEqual(reloaded.snapshot().events.map((row) => row.id), ["event-a"]);
    assert.deepEqual(reloaded.snapshot().auditEntries.map((row) => row.id), ["audit-a"]);

    clearMemory(memory.values);
    const farmA = domain.createFarm({ id: "farm-a-runtime", name: "執行緒 A 雞場" });
    const identityA = domain.createFarmFinanceIdentity({ id: "identity-a", operationalFarmId: farmA.id });
    const farmAuditA = domain.createAuditEntry({ id: "farm-audit-a", entityType: "Farm", entityId: farmA.id, source: "invariant-test" });
    const repoMasterA = new storage.LabRepository();
    const repoMasterB = new storage.LabRepository();
    repoMasterA.appendMasterDataBatch([
      { entityType: "Farm", entity: farmA },
      { entityType: "FarmFinanceIdentity", entity: identityA },
    ], [farmAuditA]);
    const farmB = domain.createFarm({ id: "farm-b-runtime", name: "執行緒 B 雞場" });
    const identityB = domain.createFarmFinanceIdentity({ id: "identity-b", operationalFarmId: farmB.id });
    assert.throws(() => repoMasterB.appendMasterDataBatch([
      { entityType: "Farm", entity: farmB },
      { entityType: "FarmFinanceIdentity", entity: identityB },
    ]), /LAB_STORAGE_CONFLICT/);
    reloaded = new storage.LabRepository();
    assert.deepEqual(reloaded.snapshot().masterData.farms.map((row) => row.id), [farmA.id]);
    assert.deepEqual(reloaded.snapshot().auditEntries.map((row) => row.id), [farmAuditA.id]);

    clearMemory(memory.values);
    const correctionOriginal = event("correction-original", 5);
    const ledger = domain.createCorrectionLedger(correctionOriginal, { replacement: { quantity: 2 }, source: "invariant-test" });
    const repoCorrectionA = new storage.LabRepository();
    const repoQuickB = new storage.LabRepository();
    repoCorrectionA.appendEvents([ledger.reversal, ...ledger.replacements], [ledger.audit]);
    assert.throws(() => repoQuickB.appendEvent(event("quick-record-b")), /LAB_STORAGE_CONFLICT/);
    reloaded = new storage.LabRepository();
    assert.equal(reloaded.snapshot().events.some((row) => row.id === ledger.reversal.id), true);
    assert.equal(reloaded.snapshot().events.some((row) => row.id === "quick-record-b"), false);
    assert.equal(reloaded.snapshot().auditEntries.some((row) => row.id === ledger.audit.id), true);

    clearMemory(memory.values);
    const repoSettingsA = new storage.LabRepository();
    const repoEventB = new storage.LabRepository();
    repoSettingsA.setSettings({ selectedView: "records" });
    assert.throws(() => repoEventB.appendEvent(event("event-after-settings")), /LAB_STORAGE_CONFLICT/);
    reloaded = new storage.LabRepository();
    assert.deepEqual(reloaded.snapshot().settings, { selectedView: "records" });
    assert.deepEqual(reloaded.snapshot().events, []);
  } finally {
    global.JinjiDomain = previousDomain;
    memory.restore();
  }
});

test("F6 startup recovery drops malformed event rows while preserving valid runtime rows and master data", () => {
  const farm = domain.createFarm({ id: "preserved-farm", name: "保留雞場" });
  const identity = domain.createFarmFinanceIdentity({ id: "preserved-identity", operationalFarmId: farm.id });
  const validEvent = event("preserved-event", 4, { farmId: farm.id, houseId: null, flockId: null });
  const memory = installMemoryStorage({
    [storage.KEYS.overlay]: JSON.stringify({
      version: 1,
      revision: 4,
      events: [
        validEvent,
        { id: "invalid-event-type", type: "NOT_A_REAL_EVENT", quantity: 2, farmId: farm.id },
        { id: "invalid-event-quantity", type: "mortality", quantity: "NaN", farmId: farm.id },
      ],
      pendingReviews: [{ id: "preserve-pending" }],
      abnormalities: [{ id: "preserve-abnormality" }],
      auditEntries: [{ id: "preserve-audit" }],
      outbox: [{ clientOperationId: "preserve-operation" }],
      syncedOperationIds: ["preserve-synced"],
      settings: { keep: true },
      masterData: { farms: [farm], houses: [], flocks: [], caretakerAssignments: [], financeIdentities: [identity] },
      mode: "ONLINE",
    }),
  });
  const previousDomain = global.JinjiDomain;
  global.JinjiDomain = domain;
  try {
    const repo = new storage.LabRepository();
    assert.deepEqual(repo.snapshot().events.map((row) => row.id), ["preserved-event"]);
    assert.deepEqual(repo.snapshot().masterData.farms.map((row) => row.id), [farm.id]);
    assert.deepEqual(repo.snapshot().masterData.financeIdentities.map((row) => row.id), [identity.id]);
    assert.deepEqual(repo.snapshot().pendingReviews, [{ id: "preserve-pending" }]);
    const persisted = JSON.parse(memory.values[storage.KEYS.overlay]);
    assert.deepEqual(persisted.events.map((row) => row.id), ["preserved-event"]);
    assert.equal(persisted.events.some((row) => row.id === "invalid-event-type"), false);
    assert.equal(persisted.events.some((row) => row.id === "invalid-event-quantity"), false);
  } finally {
    global.JinjiDomain = previousDomain;
    memory.restore();
  }
});
