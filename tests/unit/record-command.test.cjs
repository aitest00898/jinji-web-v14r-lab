const test = require("node:test");
const assert = require("node:assert/strict");

const taxonomy = require("../../src/recording-taxonomy.js");
const commandApi = require("../../src/record-command.js");

const base = {
  id: "record-1",
  taxonomyId: "O9",
  family: "operational_event",
  type: "event",
  subtype: "mortality",
  occurredAt: "2026-09-08T01:00:00.000Z",
  createdAt: "2026-09-08T01:01:00.000Z",
  farmId: "farm-test",
  houseId: "house-test",
  flockId: "flock-test",
  sourceChannel: "web",
  rawText: "死亡5",
  clientOperationId: "client-1",
  quantity: 5,
};

test("accepts Web, Quick Record, LINE, Ambient candidate, and Pending-shaped records", () => {
  const records = [
    base,
    { ...base, sourceChannel: "web", rawText: "死亡5", clientOperationId: "quick-1" },
    { ...base, sourceChannel: "line", sourceMessageId: "line-1", clientOperationId: "line-1" },
    { ...base, quantity: undefined, taxonomyId: "O2", family: "operational_action", type: "action", subtype: "medication", content: "補充", sourceChannel: "ambient", sourceCandidateId: "candidate-1", confirmedBy: "admin-1", clientOperationId: "ambient-1" },
    { ...base, quantity: undefined, taxonomyId: "A2", family: "operational_observation", type: "observation", subtype: "cough", extent: "small", sourceChannel: "line", sourceCandidateId: "pending-1", confirmedBy: "admin-1", clientOperationId: "pending-1" },
  ];
  for (const record of records) {
    const command = commandApi.createRecordCommand(record);
    assert.equal(command.kind, "record_command");
    assert.deepEqual(command.parallelAuthoritativeDestinations, []);
    assert.doesNotThrow(() => taxonomy.validateCanonicalRecording(command.record));
  }
});

test("reconciles provenance separately from semantic similarity", () => {
  const sameSource = commandApi.reconcileRecordCommand(base, [{ ...base }]);
  assert.equal(sameSource.state, "ALREADY_RECORDED");
  const differentClients = commandApi.reconcileRecordCommand(
    { ...base, id: "line-record", sourceChannel: "line", clientOperationId: "line-client", rawText: "雞場死亡 5 隻" },
    [{ ...base, id: "web-record", clientOperationId: "web-client" }],
  );
  assert.equal(differentClients.state, "POSSIBLY_RECORDED");
  const later = commandApi.reconcileRecordCommand(
    { ...base, id: "later-record", clientOperationId: "later-client", occurredAt: "2026-09-09T01:00:00.000Z" },
    [{ ...base }],
  );
  assert.equal(later.state, "NEW_INDEPENDENT_EVENT");
});
