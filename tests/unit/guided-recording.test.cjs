const test = require("node:test");
const assert = require("node:assert/strict");

const taxonomy = require("../../src/recording-taxonomy.js");
const guided = require("../../src/guided-recording.js");
const commandApi = require("../../src/record-command.js");

const DATE = "2026-09-08";
const CREATED_AT = "2026-09-08T01:00:00.000Z";

function stateFor(taxonomyId, subtype = null) {
  const definition = taxonomy.RECORDING_TAXONOMY.find((item) => item.id === taxonomyId);
  assert.ok(definition, `missing taxonomy ${taxonomyId}`);
  const state = guided.createState(definition.family === "operational_observation" ? "abnormal" : "operational", DATE);
  state.taxonomyId = taxonomyId;
  state.subtype = subtype || definition.canonicalSubtypes[0];
  state.scope = { farmId: "farm-test", houseId: "", flockId: "", wholeFarmConfirmed: true };
  state.step = "review";
  state.values = { date: DATE };
  if (taxonomyId === "O1") Object.assign(state, { scope: { farmId: "farm-test", houseId: "house-test", flockId: "flock-test", wholeFarmConfirmed: false } });
  if (taxonomyId === "O1") Object.assign(state.values, { maleCount: "600", femaleCount: "400", condition: "good" });
  if (taxonomyId === "O2") state.values.content = "疫苗接種";
  if (taxonomyId === "O3") Object.assign(state.values, { quantity: "100", sex: "male", totalWeight: "180" });
  if (taxonomyId === "O4") {
    Object.assign(state, { scope: { farmId: "farm-test", houseId: "house-test", flockId: "flock-test", wholeFarmConfirmed: false } });
    Object.assign(state.values, { averageWeight: "1.8", sex: "mixed", chickInDate: "2026-09-01" });
  }
  if (taxonomyId === "O5") Object.assign(state.values, { vendor: "飼料商", weight: "10", weightUnit: "kg" });
  if (taxonomyId === "O6") Object.assign(state.values, { content: "檢驗", workflowStatus: "waiting_result" });
  if (taxonomyId === "O7") state.values.workflowStatus = "pending";
  if (taxonomyId === "O8") state.values.maintenanceContent = "檢查風扇";
  if (taxonomyId === "O9") state.values.quantity = "5";
  if (definition.family === "operational_observation") state.values.extent = "small";
  if (taxonomyId === "A1") state.values.linkedMortalityEventId = "mortality-1";
  if (taxonomyId === "A12" && state.subtype === "other") state.values.detail = "設備異常";
  if (taxonomyId === "A16") state.values.evidence = "現場觀察";
  return state;
}

function build(taxonomyId, patch = {}) {
  const state = stateFor(taxonomyId);
  Object.assign(state.values, patch);
  return guided.buildRecord(state, {
    id: `guided-${taxonomyId}`,
    clientOperationId: `guided-client-${taxonomyId}`,
    createdAt: CREATED_AT,
    confirmedBy: "test-review",
  });
}

test("builds every O1-O9 and A1-A16 record through the canonical validator", () => {
  for (const definition of taxonomy.RECORDING_TAXONOMY) {
    const record = build(definition.id);
    assert.equal(record.taxonomyId, definition.id);
    assert.doesNotThrow(() => taxonomy.validateCanonicalRecording(record));
    assert.equal(commandApi.createRecordCommand(record).kind, "record_command");
  }
});

test("derives O1 total, O3 average weight, O4 age, and O6 reminder without changing source semantics", () => {
  assert.equal(build("O1").totalCount, 1000);
  assert.equal(build("O3").averageWeight, 1.8);
  assert.equal(build("O4").ageDays, 7);
  assert.equal(build("O6").reminderDueAt, "2026-09-11T01:30:00.000Z");
});

test("keeps O6 completion fields conditional but strict", () => {
  const completed = stateFor("O6");
  completed.values.workflowStatus = "completed";
  completed.values.result = "陰性";
  completed.values.completedAt = DATE;
  assert.ok(guided.fieldSequence(completed).includes("result"));
  assert.equal(guided.isRequired(completed, "result"), true);
  assert.equal(guided.isRequired(completed, "completedAt"), true);
  assert.doesNotThrow(() => guided.buildRecord(completed, { id: "o6-complete", clientOperationId: "o6-complete-client", createdAt: CREATED_AT }));
  delete completed.values.result;
  assert.throws(() => guided.buildRecord(completed, { id: "o6-missing-result", clientOperationId: "o6-missing-result-client", createdAt: CREATED_AT }), /RECORDING_REQUIRED_FIELD:result/);
});

test("does not auto-select a flock and requires explicit whole-farm confirmation", () => {
  const requirements = guided.scopeRequirements(stateFor("O2"));
  assert.equal(requirements.houseRequired, false);
  assert.equal(requirements.wholeFarmAllowed, true);
  const state = stateFor("O2");
  state.scope = { farmId: "farm-test", houseId: "house-test", flockId: "", wholeFarmConfirmed: false };
  assert.equal(state.scope.flockId, "");
  state.scope = { farmId: "farm-test", houseId: "", flockId: "", wholeFarmConfirmed: false };
  assert.throws(() => guided.buildRecord(state, { id: "farm-only", clientOperationId: "farm-only-client", createdAt: CREATED_AT }), /RECORDING/);
});

test("keeps strict schema failures closed and uses one authoritative destination", () => {
  const mortality = build("O9");
  assert.equal(commandApi.createRecordCommand(mortality).destination, "operational_events");
  assert.throws(() => commandApi.createRecordCommand({ ...mortality, quantity: 0 }), /RECORDING_NUMBER_INVALID:quantity/);
  assert.throws(() => commandApi.createRecordCommand({ ...build("A2"), quantity: 1 }), /OBSERVATION_QUANTITY_FORBIDDEN:quantity/);
  assert.deepEqual(commandApi.createRecordCommand(mortality).parallelAuthoritativeDestinations, []);
});
