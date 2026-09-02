const test = require("node:test");
const assert = require("node:assert/strict");
const domain = require("../../src/domain.js");

test("domain exposes all required model types", () => {
  assert.deepEqual(domain.MODEL_NAMES, [
    "Organization", "Farm", "House", "Flock", "OperationalEvent", "PendingReview", "Abnormality", "CalendarEvent", "FinanceEntry", "AuditEntry", "TrendThreshold", "ClickAnalytics", "DeveloperLog", "SyncOperation",
  ]);
  for (const name of domain.MODEL_NAMES) assert.equal(typeof domain[name], "function");
});

test("operational event has traceable event contract", () => {
  const event = domain.createOperationalEvent({ type: "mortality", date: "2026-08-31", time: "09:30", farmId: "red", houseId: "red-1", flockId: "alpha", quantity: 5, source: "quick_record" }, new Date("2026-09-02T00:00:00Z"));
  assert.equal(event.type, "mortality");
  assert.equal(event.quantity, 5);
  assert.equal(event.qty, 5);
  assert.equal(event.value, 5);
  assert.equal(event.unit, "隻");
  assert.equal(event.source, "quick_record");
  assert.match(event.createdAt, /^2026-09-02T00:00:00/);
  assert.ok(event.clientOperationId);
  assert.equal(event.farmId, "red");
  assert.equal(event.houseId, "red-1");
  assert.equal(event.flockId, "alpha");
});

test("quick record parser accepts one metric and routes ambiguity to Pending Review", () => {
  const valid = domain.parseQuickRecord("死亡５");
  assert.equal(valid.status, "event");
  assert.deepEqual(valid.event, { type: "mortality", quantity: 5, unit: "隻", source: "quick_record" });
  assert.equal(domain.parseQuickRecord("死亡5，淘汰1").status, "pending");
  assert.equal(domain.parseQuickRecord("<img src=x onerror=alert(1)>").status, "pending");
  assert.equal(domain.parseQuickRecord("死亡0").status, "pending");
});

test("append-only replacement reconstructs final state without deleting original", () => {
  const original = domain.createOperationalEvent({ id: "original", type: "mortality", date: "2026-08-31", time: "08:00", farmId: "red", quantity: 5 }, new Date("2026-09-02T00:00:00Z"));
  const ledger = domain.createCorrectionLedger(original, { operation: "replacement", replacement: { quantity: 2 }, source: "lab_correction" }, new Date("2026-09-02T00:01:00Z"));
  const all = [original, ledger.reversal, ...ledger.replacements];
  const reconstructed = domain.reconstructOperationalEvents(all);
  assert.equal(all.length, 3);
  assert.equal(reconstructed.length, 1);
  assert.equal(reconstructed[0].quantity, 2);
  assert.equal(reconstructed[0].correctionOf, "original");
  assert.equal(ledger.audit.oldEvent.id, "original");
  assert.deepEqual(ledger.audit.newEventIds, [reconstructed[0].id]);
  assert.equal(domain.sumEvents(all, { type: "mortality" }), 2);
});

test("calendar month logic covers leap, short, long and cross-year dates", () => {
  assert.equal(domain.calendarDaysInMonth(2024, 2), 29);
  assert.equal(domain.calendarDaysInMonth(2025, 2), 28);
  assert.equal(domain.calendarDaysInMonth(2025, 4), 30);
  assert.equal(domain.calendarDaysInMonth(2025, 1), 31);
  assert.equal(domain.calendarMonthCells(2024, 2).filter(Boolean).length, 29);
  assert.equal(domain.calendarMonthCells(2025, 2).filter(Boolean).length, 28);
});
