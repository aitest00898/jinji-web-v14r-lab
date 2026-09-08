const test = require("node:test");
const assert = require("node:assert/strict");
const taxonomy = require("../../src/recording-taxonomy.js");
const domain = require("../../src/domain.js");
const storage = require("../../src/storage.js");

function installMemoryStorage() {
  const previousStorage = global.localStorage;
  const values = {};
  global.localStorage = {
    getItem(key) { return values[key] || null; },
    setItem(key, value) { values[key] = String(value); },
    removeItem(key) { delete values[key]; },
  };
  return { restore() { global.localStorage = previousStorage; } };
}

test("Web Lab shares the canonical 25-category/46-subtype vocabulary", () => {
  assert.strictEqual(domain.RECORDING_TAXONOMY, taxonomy.RECORDING_TAXONOMY);
  assert.equal(taxonomy.RECORDING_TAXONOMY.length, 25);
  assert.equal(taxonomy.RECORDING_TAXONOMY.reduce((sum, item) => sum + item.canonicalSubtypes.length, 0), 46);
  assert.deepEqual(taxonomy.taxonomyDefinitionFor("O5").canonicalSubtypes, ["feed_order"]);
  assert.deepEqual(domain.recordingTaxonomyContractSnapshot(), taxonomy.recordingTaxonomyContractSnapshot());
  assert.deepEqual(taxonomy.taxonomyDefinitionFor("O6").requiredFields, ["submittedAt", "content", "workflowStatus"]);
});

test("canonical Web validation remains strict and stock-safe", () => {
  const row = {
    id: "canonical-action-1",
    taxonomyId: "O5",
    family: "operational_action",
    type: "action",
    subtype: "feed_order",
    occurredAt: "2026-09-08T01:00:00.000Z",
    createdAt: "2026-09-08T01:00:00.000Z",
    farmId: "synthetic-farm",
    sourceChannel: "web",
    rawText: "叫飼料 玉米廠 500kg",
    clientOperationId: "canonical-action-op-1",
    vendor: "玉米廠",
    weight: 500,
    weightUnit: "kg",
  };
  assert.equal(domain.validateCanonicalRecording(row), true);
  assert.equal(domain.stockEffectForCanonicalRecord(row), 0);
  assert.deepEqual(domain.deriveCanonicalFields({ subtype: "chick_in", maleCount: 6, femaleCount: 4 }), { totalCount: 10 });
  assert.deepEqual(domain.deriveCanonicalFields({ subtype: "lab_test", submittedAt: "2026-09-08T01:00:00.000Z" }), { reminderDueAt: "2026-09-11T01:00:00.000Z" });
  assert.throws(() => domain.validateCanonicalRecording({ ...row, weight: 0 }), /RECORDING_NUMBER_INVALID:weight/);
  assert.throws(() => domain.validateCanonicalRecording({ ...row, taxonomyId: "O9", family: "operational_event", type: "event", subtype: "mortality", quantity: 5, workflowStatus: "pending", vendor: undefined, weight: undefined, weightUnit: undefined }), /RECORDING_UNSUPPORTED_FIELD:workflowStatus/);
  assert.throws(() => domain.validateCanonicalRecording({ ...row, taxonomyId: "O4", family: "operational_event", type: "event", subtype: "weigh", quantity: undefined, vendor: undefined, weight: undefined, weightUnit: undefined, houseId: "house-test", flockId: "flock-test", averageWeight: 1.8, sex: "mixed", chickInDate: "2026-09-01", ageDays: 6 }), /RECORDING_DERIVED_FIELD_MISMATCH:ageDays/);
  assert.throws(() => domain.validateCanonicalRecording({ ...row, taxonomyId: "O6", family: "operational_action", type: "action", subtype: "lab_test", vendor: undefined, weight: undefined, weightUnit: undefined, submittedAt: "2026-09-08T01:00:00.000Z", content: "synthetic lab", workflowStatus: "waiting_result", reminderDueAt: "2026-09-12T01:00:00.000Z" }), /RECORDING_DERIVED_FIELD_MISMATCH:reminderDueAt/);
  assert.throws(() => domain.validateCanonicalRecording({ ...row, taxonomyId: "A2", family: "operational_observation", type: "observation", subtype: "cough", weight: undefined, weightUnit: undefined, vendor: undefined, quantity: 2, extent: "small" }), /OBSERVATION_QUANTITY_FORBIDDEN:quantity/);
});

test("canonical Web validation keeps workflow and lifecycle states singular", () => {
  const row = {
    id: "canonical-lab-1",
    taxonomyId: "O6",
    family: "operational_action",
    type: "action",
    subtype: "lab_test",
    occurredAt: "2026-09-08T01:00:00.000Z",
    createdAt: "2026-09-08T01:00:00.000Z",
    farmId: "synthetic-farm",
    sourceChannel: "web",
    rawText: "送驗 新城雞瘟",
    clientOperationId: "canonical-lab-op-1",
    submittedAt: "2026-09-08T01:00:00.000Z",
    content: "新城雞瘟",
    workflowStatus: "waiting_result",
    lifecycleStatus: "active",
  };
  assert.equal(domain.validateCanonicalRecording(row), true);
  assert.throws(() => domain.validateCanonicalRecording({ ...row, workflowStatus: "invalid" }), /RECORDING_ENUM_INVALID:workflowStatus/);
});

test("local storage can atomically retain canonical actions without changing event stock", () => {
  const memory = installMemoryStorage();
  try {
    const action = {
      id: "canonical-action-storage-1",
      taxonomyId: "O5",
      family: "operational_action",
      type: "action",
      subtype: "feed_order",
      occurredAt: "2026-09-08T01:00:00.000Z",
      createdAt: "2026-09-08T01:00:00.000Z",
      farmId: "synthetic-farm",
      sourceChannel: "web",
      rawText: "叫飼料 玉米廠 500kg",
      clientOperationId: "canonical-action-storage-op-1",
      vendor: "玉米廠",
      weight: 500,
      weightUnit: "kg",
    };
    const repo = new storage.LabRepository();
    repo.commitLocalOperation({ actions: [action], operation: { clientOperationId: action.clientOperationId, type: "create_action" } });
    const reloaded = new storage.LabRepository().snapshot();
    assert.deepEqual(reloaded.actions.map((item) => item.id), [action.id]);
    assert.deepEqual(reloaded.events, []);
    assert.equal(reloaded.outbox.length, 1);
  } finally {
    memory.restore();
  }
});
