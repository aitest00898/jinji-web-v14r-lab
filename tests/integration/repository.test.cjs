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

test("reset fixture clears runtime events, audit, outbox and mode", () => {
  const repo = new storage.LabRepository();
  repo.appendEvent(event("reset-event"), { id: "audit-reset", operation: "create" });
  repo.queueOperation({ clientOperationId: "reset-operation", type: "create_event" });
  repo.setMode("BACKEND_LONG_DOWN");
  const reset = repo.resetFixture();
  assert.equal(reset.events.length, 0);
  assert.equal(reset.auditEntries.length, 0);
  assert.equal(reset.outbox.length, 0);
  assert.equal(reset.mode, "ONLINE");
});
