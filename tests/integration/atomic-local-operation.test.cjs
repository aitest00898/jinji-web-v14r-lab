const test = require("node:test");
const assert = require("node:assert/strict");
const domain = require("../../src/domain.js");
const storage = require("../../src/storage.js");

function installMemoryStorage({ failOnKey = null } = {}) {
  const previousStorage = global.localStorage;
  const values = {};
  global.localStorage = {
    getItem(key) { return values[key] || null; },
    setItem(key, value) {
      if (key === failOnKey) throw new Error("quota exceeded");
      values[key] = String(value);
    },
    removeItem(key) { delete values[key]; },
  };
  return {
    values,
    restore() { global.localStorage = previousStorage; },
  };
}

function event(id, quantity = 5) {
  return domain.createOperationalEvent({
    id,
    type: "mortality",
    date: "2026-09-03",
    time: "09:30",
    farmId: "farm-a",
    houseId: "house-a",
    flockId: "flock-a",
    quantity,
    source: "atomicity-reproduction",
    clientOperationId: `op-${id}`,
  }, new Date("2026-09-03T09:30:00Z"));
}

function operation(clientOperationId, type = "test_operation") {
  return { clientOperationId, type, source: "atomicity-reproduction" };
}

function advanceRevisionWithOtherWriter() {
  const other = new storage.LabRepository();
  other.queueOperation(operation("other-writer"));
}

test("reproduces Quick Record partial commit before atomic remediation", () => {
  const memory = installMemoryStorage();
  const previousDomain = global.JinjiDomain;
  global.JinjiDomain = domain;
  try {
    const repoA = new storage.LabRepository();
    const eventA = event("quick-record-partial");
    const auditA = domain.createAuditEntry({ id: "audit-quick-record-partial", entityId: eventA.id, source: "atomicity-reproduction" });
    repoA.appendEvent(eventA, auditA);
    advanceRevisionWithOtherWriter();

    assert.throws(() => repoA.queueOperation(operation(eventA.clientOperationId, "create_event")), /LAB_STORAGE_CONFLICT/);
    const reloaded = new storage.LabRepository().snapshot();
    assert.equal(reloaded.events.some((row) => row.id === eventA.id), true);
    assert.equal(reloaded.auditEntries.some((row) => row.id === auditA.id), true);
    assert.equal(reloaded.outbox.some((row) => row.clientOperationId === eventA.clientOperationId), false);
  } finally {
    global.JinjiDomain = previousDomain;
    memory.restore();
  }
});

test("reproduces Correction partial commit before atomic remediation", () => {
  const memory = installMemoryStorage();
  const previousDomain = global.JinjiDomain;
  global.JinjiDomain = domain;
  try {
    const original = event("correction-original");
    const ledger = domain.createCorrectionLedger(original, { replacement: { quantity: 2 }, source: "atomicity-reproduction" });
    const repoA = new storage.LabRepository();
    repoA.appendEvents([ledger.reversal, ...ledger.replacements], [ledger.audit]);
    advanceRevisionWithOtherWriter();

    assert.throws(() => repoA.queueOperation(operation(ledger.audit.id, "correct_event")), /LAB_STORAGE_CONFLICT/);
    const reloaded = new storage.LabRepository().snapshot();
    assert.equal(reloaded.events.some((row) => row.id === ledger.reversal.id), true);
    assert.equal(reloaded.events.some((row) => row.id === ledger.replacements[0].id), true);
    assert.equal(reloaded.auditEntries.some((row) => row.id === ledger.audit.id), true);
    assert.equal(reloaded.outbox.some((row) => row.clientOperationId === ledger.audit.id), false);
  } finally {
    global.JinjiDomain = previousDomain;
    memory.restore();
  }
});

test("reproduces Pending Review partial commit before atomic remediation", () => {
  const memory = installMemoryStorage();
  const previousDomain = global.JinjiDomain;
  global.JinjiDomain = domain;
  try {
    const review = { id: "pending-partial", title: "待確認", detail: "內容", kind: "快速記錄", source: "atomicity-reproduction" };
    const repoA = new storage.LabRepository();
    repoA.appendPending(review);
    advanceRevisionWithOtherWriter();

    assert.throws(() => repoA.queueOperation(operation("pending-operation-partial", "create_pending_review")), /LAB_STORAGE_CONFLICT/);
    const reloaded = new storage.LabRepository().snapshot();
    assert.equal(reloaded.pendingReviews.some((row) => row.id === review.id), true);
    assert.equal(reloaded.outbox.some((row) => row.clientOperationId === "pending-operation-partial"), false);
  } finally {
    global.JinjiDomain = previousDomain;
    memory.restore();
  }
});

test("reproduces Master Data partial commit before atomic remediation", () => {
  const memory = installMemoryStorage();
  const previousDomain = global.JinjiDomain;
  global.JinjiDomain = domain;
  try {
    const now = new Date("2026-09-03T00:00:00Z");
    const farm = domain.createFarm({ id: "master-partial-farm", name: "部分提交場" }, now);
    const identity = domain.createFarmFinanceIdentity({ id: "master-partial-identity", operationalFarmId: farm.id }, now);
    const audits = [
      domain.createAuditEntry({ id: "audit-master-partial-farm", entityType: "Farm", entityId: farm.id, source: "atomicity-reproduction" }, now),
      domain.createAuditEntry({ id: "audit-master-partial-identity", entityType: "FarmFinanceIdentity", entityId: identity.id, source: "atomicity-reproduction" }, now),
    ];
    const repoA = new storage.LabRepository();
    repoA.appendMasterDataBatch([
      { entityType: "Farm", entity: farm },
      { entityType: "FarmFinanceIdentity", entity: identity },
    ], audits);
    advanceRevisionWithOtherWriter();

    assert.throws(() => repoA.queueOperation(operation("master-operation-partial", "create_farm")), /LAB_STORAGE_CONFLICT/);
    const reloaded = new storage.LabRepository().snapshot();
    assert.equal(reloaded.masterData.farms.some((row) => row.id === farm.id), true);
    assert.equal(reloaded.masterData.financeIdentities.some((row) => row.id === identity.id), true);
    assert.deepEqual(reloaded.auditEntries.map((row) => row.id), audits.map((row) => row.id));
    assert.equal(reloaded.outbox.some((row) => row.clientOperationId === "master-operation-partial"), false);
  } finally {
    global.JinjiDomain = previousDomain;
    memory.restore();
  }
});

test("USER_OPERATION_ATOMIC_QUICK_RECORD commits event, audit, and outbox once", () => {
  const memory = installMemoryStorage();
  const previousDomain = global.JinjiDomain;
  global.JinjiDomain = domain;
  try {
    const repo = new storage.LabRepository();
    const eventA = event("quick-record-atomic");
    const auditA = domain.createAuditEntry({ id: "audit-quick-record-atomic", entityId: eventA.id, source: "atomicity-regression" });
    const beforeRevision = repo.snapshot().revision;
    const row = repo.commitLocalOperation({
      events: [eventA],
      auditEntries: [auditA],
      operation: operation(eventA.clientOperationId, "create_event"),
    });
    const snapshot = repo.snapshot();
    assert.equal(row.status, "queued");
    assert.equal(snapshot.revision, beforeRevision + 1);
    assert.equal(snapshot.events.some((candidate) => candidate.id === eventA.id), true);
    assert.equal(snapshot.auditEntries.some((candidate) => candidate.id === auditA.id), true);
    assert.equal(snapshot.outbox.filter((candidate) => candidate.clientOperationId === eventA.clientOperationId).length, 1);
  } finally {
    global.JinjiDomain = previousDomain;
    memory.restore();
  }
});

test("USER_OPERATION_ATOMIC_CORRECTION commits reversal, replacement, audit, and outbox once", () => {
  const memory = installMemoryStorage();
  const previousDomain = global.JinjiDomain;
  global.JinjiDomain = domain;
  try {
    const original = event("correction-atomic-original");
    const ledger = domain.createCorrectionLedger(original, { replacement: { quantity: 2 }, source: "atomicity-regression" });
    const repo = new storage.LabRepository();
    const beforeRevision = repo.snapshot().revision;
    repo.commitLocalOperation({
      events: [ledger.reversal, ...ledger.replacements],
      auditEntries: [ledger.audit],
      operation: operation(ledger.audit.id, "correct_event"),
    });
    const snapshot = repo.snapshot();
    assert.equal(snapshot.revision, beforeRevision + 1);
    assert.equal(snapshot.events.some((candidate) => candidate.id === ledger.reversal.id), true);
    assert.equal(snapshot.events.some((candidate) => candidate.id === ledger.replacements[0].id), true);
    assert.equal(snapshot.auditEntries.some((candidate) => candidate.id === ledger.audit.id), true);
    assert.equal(snapshot.outbox.filter((candidate) => candidate.clientOperationId === ledger.audit.id).length, 1);
  } finally {
    global.JinjiDomain = previousDomain;
    memory.restore();
  }
});

test("USER_OPERATION_ATOMIC_PENDING commits Pending Review and outbox once", () => {
  const memory = installMemoryStorage();
  const previousDomain = global.JinjiDomain;
  global.JinjiDomain = domain;
  try {
    const review = { id: "pending-atomic", title: "待確認", detail: "內容", kind: "快速記錄", source: "atomicity-regression" };
    const repo = new storage.LabRepository();
    const beforeRevision = repo.snapshot().revision;
    repo.commitLocalOperation({
      pendingReviews: [review],
      operation: operation("pending-operation-atomic", "create_pending_review"),
    });
    const snapshot = repo.snapshot();
    assert.equal(snapshot.revision, beforeRevision + 1);
    assert.equal(snapshot.pendingReviews.some((candidate) => candidate.id === review.id), true);
    assert.equal(snapshot.outbox.filter((candidate) => candidate.clientOperationId === "pending-operation-atomic").length, 1);
  } finally {
    global.JinjiDomain = previousDomain;
    memory.restore();
  }
});

test("USER_OPERATION_ATOMIC_MASTER_DATA commits entities, audits, and outbox once", () => {
  const memory = installMemoryStorage();
  const previousDomain = global.JinjiDomain;
  global.JinjiDomain = domain;
  try {
    const now = new Date("2026-09-03T00:00:00Z");
    const farm = domain.createFarm({ id: "master-atomic-farm", name: "原子場" }, now);
    const identity = domain.createFarmFinanceIdentity({ id: "master-atomic-identity", operationalFarmId: farm.id }, now);
    const audits = [
      domain.createAuditEntry({ id: "audit-master-atomic-farm", entityType: "Farm", entityId: farm.id, source: "atomicity-regression" }, now),
      domain.createAuditEntry({ id: "audit-master-atomic-identity", entityType: "FarmFinanceIdentity", entityId: identity.id, source: "atomicity-regression" }, now),
    ];
    const repo = new storage.LabRepository();
    const beforeRevision = repo.snapshot().revision;
    repo.commitLocalOperation({
      masterData: [
        { entityType: "Farm", entity: farm },
        { entityType: "FarmFinanceIdentity", entity: identity },
      ],
      auditEntries: audits,
      operation: operation("master-operation-atomic", "create_farm"),
    });
    const snapshot = repo.snapshot();
    assert.equal(snapshot.revision, beforeRevision + 1);
    assert.equal(snapshot.masterData.farms.some((candidate) => candidate.id === farm.id), true);
    assert.equal(snapshot.masterData.financeIdentities.some((candidate) => candidate.id === identity.id), true);
    assert.deepEqual(snapshot.auditEntries.map((entry) => entry.id), audits.map((entry) => entry.id));
    assert.equal(snapshot.outbox.filter((candidate) => candidate.clientOperationId === "master-operation-atomic").length, 1);
  } finally {
    global.JinjiDomain = previousDomain;
    memory.restore();
  }
});

test("pre-commit conflict writes no business row, audit, or outbox", () => {
  const memory = installMemoryStorage();
  const previousDomain = global.JinjiDomain;
  global.JinjiDomain = domain;
  try {
    const repoA = new storage.LabRepository();
    const repoB = new storage.LabRepository();
    const eventA = event("precommit-conflict-a");
    const auditA = domain.createAuditEntry({ id: "audit-precommit-conflict-a", entityId: eventA.id, source: "atomicity-regression" });
    repoB.commitLocalOperation({
      events: [event("precommit-conflict-b")],
      operation: operation("precommit-conflict-b", "create_event"),
    });
    assert.throws(() => repoA.commitLocalOperation({
      events: [eventA],
      auditEntries: [auditA],
      operation: operation(eventA.clientOperationId, "create_event"),
    }), /LAB_STORAGE_CONFLICT/);
    const snapshot = new storage.LabRepository().snapshot();
    assert.equal(snapshot.events.some((candidate) => candidate.id === eventA.id), false);
    assert.equal(snapshot.auditEntries.some((candidate) => candidate.id === auditA.id), false);
    assert.equal(snapshot.outbox.some((candidate) => candidate.clientOperationId === eventA.clientOperationId), false);
    assert.equal(snapshot.outbox.some((candidate) => candidate.clientOperationId === "precommit-conflict-b"), true);
  } finally {
    global.JinjiDomain = previousDomain;
    memory.restore();
  }
});

test("post-commit sync conflict preserves local data and outbox", () => {
  const memory = installMemoryStorage();
  const previousDomain = global.JinjiDomain;
  global.JinjiDomain = domain;
  try {
    const repoA = new storage.LabRepository();
    const eventA = event("postcommit-sync-conflict");
    const auditA = domain.createAuditEntry({ id: "audit-postcommit-sync-conflict", entityId: eventA.id, source: "atomicity-regression" });
    repoA.commitLocalOperation({
      events: [eventA],
      auditEntries: [auditA],
      operation: operation(eventA.clientOperationId, "create_event"),
    });
    const repoB = new storage.LabRepository();
    repoB.queueOperation(operation("postcommit-other-writer"));
    assert.throws(() => repoA.sync({ backendAvailable: true }), /LAB_STORAGE_CONFLICT/);
    assert.equal(repoA.snapshot().events.some((candidate) => candidate.id === eventA.id), true);
    assert.equal(repoA.snapshot().auditEntries.some((candidate) => candidate.id === auditA.id), true);
    assert.equal(repoA.snapshot().outbox.some((candidate) => candidate.clientOperationId === eventA.clientOperationId), true);
    const reloaded = new storage.LabRepository().snapshot();
    assert.equal(reloaded.events.some((candidate) => candidate.id === eventA.id), true);
    assert.equal(reloaded.auditEntries.some((candidate) => candidate.id === auditA.id), true);
    assert.equal(reloaded.outbox.some((candidate) => candidate.clientOperationId === eventA.clientOperationId), true);
  } finally {
    global.JinjiDomain = previousDomain;
    memory.restore();
  }
});

test("same clientOperationId remains idempotent for atomic local commits", () => {
  const memory = installMemoryStorage();
  const previousDomain = global.JinjiDomain;
  global.JinjiDomain = domain;
  try {
    const repo = new storage.LabRepository();
    const eventA = event("idempotent-atomic");
    const auditA = domain.createAuditEntry({ id: "audit-idempotent-atomic", entityId: eventA.id, source: "atomicity-regression" });
    const bundle = { events: [eventA], auditEntries: [auditA], operation: operation("idempotent-operation", "create_event") };
    repo.commitLocalOperation(bundle);
    const beforeDuplicate = repo.snapshot();
    const duplicate = repo.commitLocalOperation(bundle);
    const afterDuplicate = repo.snapshot();
    assert.equal(duplicate.duplicate, true);
    assert.equal(afterDuplicate.revision, beforeDuplicate.revision);
    assert.equal(afterDuplicate.events.filter((candidate) => candidate.id === eventA.id).length, 1);
    assert.equal(afterDuplicate.auditEntries.filter((candidate) => candidate.id === auditA.id).length, 1);
    assert.equal(afterDuplicate.outbox.filter((candidate) => candidate.clientOperationId === "idempotent-operation").length, 1);
  } finally {
    global.JinjiDomain = previousDomain;
    memory.restore();
  }
});

function assertAtomicStorageFailure(bundle, assertions) {
  const memory = installMemoryStorage({ failOnKey: storage.KEYS.mode });
  const previousDomain = global.JinjiDomain;
  global.JinjiDomain = domain;
  try {
    const repo = new storage.LabRepository();
    assert.throws(() => repo.commitLocalOperation(bundle), /LAB_STORAGE_WRITE_FAILED/);
    assertions(repo.snapshot());
    assert.equal(new storage.LabRepository().snapshot().revision, 0);
    assert.equal(memory.values[storage.KEYS.overlay], undefined);
  } finally {
    global.JinjiDomain = previousDomain;
    memory.restore();
  }
}

test("QUICK_RECORD_STORAGE_FAILURE_ATOMIC leaves no partial bundle", () => {
  const eventA = event("quick-record-storage-failure");
  const auditA = domain.createAuditEntry({ id: "audit-quick-record-storage-failure", entityId: eventA.id, source: "atomicity-regression" });
  assertAtomicStorageFailure({ events: [eventA], auditEntries: [auditA], operation: operation(eventA.clientOperationId, "create_event") }, (snapshot) => {
    assert.equal(snapshot.events.length, 0);
    assert.equal(snapshot.auditEntries.length, 0);
    assert.equal(snapshot.outbox.length, 0);
  });
});

test("CORRECTION_STORAGE_FAILURE_ATOMIC leaves no partial bundle", () => {
  const original = event("correction-storage-failure-original");
  const ledger = domain.createCorrectionLedger(original, { replacement: { quantity: 2 }, source: "atomicity-regression" });
  assertAtomicStorageFailure({
    events: [ledger.reversal, ...ledger.replacements],
    auditEntries: [ledger.audit],
    operation: operation(ledger.audit.id, "correct_event"),
  }, (snapshot) => {
    assert.equal(snapshot.events.length, 0);
    assert.equal(snapshot.auditEntries.length, 0);
    assert.equal(snapshot.outbox.length, 0);
  });
});

test("PENDING_STORAGE_FAILURE_ATOMIC leaves no partial bundle", () => {
  const review = { id: "pending-storage-failure", title: "待確認", detail: "內容", kind: "快速記錄", source: "atomicity-regression" };
  assertAtomicStorageFailure({ pendingReviews: [review], operation: operation("pending-storage-failure", "create_pending_review") }, (snapshot) => {
    assert.equal(snapshot.pendingReviews.length, 0);
    assert.equal(snapshot.outbox.length, 0);
  });
});

test("MASTER_DATA_STORAGE_FAILURE_ATOMIC leaves no partial bundle", () => {
  const now = new Date("2026-09-03T00:00:00Z");
  const farm = domain.createFarm({ id: "master-storage-failure-farm", name: "儲存失敗場" }, now);
  const identity = domain.createFarmFinanceIdentity({ id: "master-storage-failure-identity", operationalFarmId: farm.id }, now);
  const audits = [
    domain.createAuditEntry({ id: "audit-master-storage-failure-farm", entityType: "Farm", entityId: farm.id, source: "atomicity-regression" }, now),
    domain.createAuditEntry({ id: "audit-master-storage-failure-identity", entityType: "FarmFinanceIdentity", entityId: identity.id, source: "atomicity-regression" }, now),
  ];
  assertAtomicStorageFailure({
    masterData: [{ entityType: "Farm", entity: farm }, { entityType: "FarmFinanceIdentity", entity: identity }],
    auditEntries: audits,
    operation: operation("master-storage-failure", "create_farm"),
  }, (snapshot) => {
    assert.deepEqual(snapshot.masterData, { farms: [], houses: [], flocks: [], caretakerAssignments: [], financeIdentities: [] });
    assert.equal(snapshot.auditEntries.length, 0);
    assert.equal(snapshot.outbox.length, 0);
  });
});
