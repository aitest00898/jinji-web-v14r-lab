const test = require("node:test");
const assert = require("node:assert/strict");
const domain = require("../../src/domain.js");

test("domain exposes all required model types", () => {
  assert.deepEqual(domain.MODEL_NAMES, [
    "Organization", "Farm", "House", "Flock", "OperationalEvent", "OperationalObservation", "PendingReview", "Abnormality", "CalendarEvent", "FinanceEntry", "Investor", "FarmInvestorEquity", "ProfitDistribution", "ProfitDistributionAllocation", "FinanceSourceReference", "AuditEntry", "TrendThreshold", "ClickAnalytics", "DeveloperLog", "SyncOperation", "CaretakerAssignment", "FarmFinanceIdentity",
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

test("quick record parser preserves qualitative observations without inventing a quantity", () => {
  const cough = domain.parseQuickRecord("咳嗽");
  assert.equal(cough.status, "observation");
  assert.equal(cough.reason, "qualitative_observation");
  assert.equal(cough.observation.text, "咳嗽");
  assert.equal(Object.prototype.hasOwnProperty.call(cough.observation, "quantity"), false);
  assert.match(cough.message, /沒有精確數字也可以記錄/);

  const observation = domain.createOperationalObservation({
    id: "observation-domain-test",
    text: "臭腳",
    date: "2026-09-03",
    time: "09:30",
    farmId: "red",
    houseId: "red-1",
    flockId: "alpha",
    source: "quick_record",
  }, new Date("2026-09-03T09:30:00Z"));
  assert.equal(observation.measurementStatus, "qualitative");
  assert.equal(Object.prototype.hasOwnProperty.call(observation, "quantity"), false);
  assert.equal(domain.reconstructOperationalObservations([observation]).length, 1);
  assert.throws(() => domain.createOperationalObservation({ text: "" }), /DOMAIN_OBSERVATION_TEXT_REQUIRED/);
});

test("quick record semantics guide required fields without turning qualitative extent into a quantity", () => {
  const missingDeathQuantity = domain.parseQuickRecord("死亡");
  assert.equal(missingDeathQuantity.status, "guided");
  assert.equal(missingDeathQuantity.reason, "quantity_missing");
  assert.equal(domain.parseQuickRecord("臭腳").needsExtent, true);
  const readyObservation = domain.parseQuickRecord("臭腳 中範圍");
  assert.equal(readyObservation.status, "observation");
  assert.equal(readyObservation.needsExtent, false);
  assert.equal(readyObservation.observation.extent, "medium");
  assert.equal(readyObservation.observation.text, "臭腳");
  const observation = domain.createOperationalObservation({
    id: "observation-extent-test",
    text: "臭腳",
    observationType: "foot_odor",
    extent: "large",
    rawText: "臭腳 大範圍",
    farmId: "red",
    houseId: "red-1",
    scopeSelection: "house",
    scopeConfirmed: true,
  });
  assert.equal(observation.extent, "large");
  assert.equal(observation.rawText, "臭腳 大範圍");
  assert.equal(Object.prototype.hasOwnProperty.call(observation, "quantity"), false);
  assert.throws(() => domain.createOperationalObservation({ text: "臭腳", extent: "many" }), /DOMAIN_OBSERVATION_EXTENT_INVALID/);
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

test("master data constructors preserve hierarchy and never invent sex counts", () => {
  const now = new Date("2026-09-03T00:00:00Z");
  const farm = domain.createFarm({ id: "farm-runtime", name: "測試新增場", type: "紅羽" }, now);
  const house = domain.createHouse({ id: "house-runtime", farmId: farm.id, name: "測試一舍", code: "T1" }, now);
  const flockWithSex = domain.createFlock({ id: "flock-runtime-a", houseId: house.id, code: "T-001", initial: 100, male: 40, female: 60, chickIn: "2026-09-01", plannedShipment: "2026-09-20" }, now);
  const flockWithoutSex = domain.createFlock({ id: "flock-runtime-b", houseId: house.id, code: "T-002", initial: 80, chickIn: "2026-09-02", plannedShipment: "2026-09-21" }, now);
  const caretaker = domain.createCaretakerAssignment({ id: "assignment-runtime", farmId: farm.id, caretakerId: "caretaker-runtime", caretakerName: "測試照顧者" }, now);
  const identity = domain.createFarmFinanceIdentity({ id: "finance-identity-runtime", operationalFarmId: farm.id }, now);

  assert.deepEqual({ male: flockWithSex.male, female: flockWithSex.female }, { male: 40, female: 60 });
  assert.equal(Object.prototype.hasOwnProperty.call(flockWithoutSex, "male"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(flockWithoutSex, "female"), false);
  assert.equal(identity.status, "unconfigured");
  assert.equal(identity.dataState, "no_finance_data");
  assert.deepEqual(domain.validateMasterData({
    farms: [farm],
    houses: [house],
    flocks: [flockWithSex, flockWithoutSex],
    caretakerAssignments: [caretaker],
    financeIdentities: [identity],
  }), { farms: 1, houses: 1, flocks: 2, caretakerAssignments: 1, financeIdentities: 1 });
  assert.throws(() => domain.createFlock({ houseId: house.id, code: "bad", initial: 100, male: 40, chickIn: "2026-09-01", plannedShipment: "2026-09-20" }), /MASTER_DATA_SEX_PAIR_REQUIRED/);
  assert.throws(() => domain.createFlock({ houseId: house.id, code: "bad", initial: 100, male: 40, female: 40, chickIn: "2026-09-01", plannedShipment: "2026-09-20" }), /MASTER_DATA_SEX_TOTAL_MISMATCH/);
});

test("flock state contract supports only active and closed", () => {
  const common = { houseId: "state-house", code: "STATE-001", initial: 100, chickIn: "2026-09-01", plannedShipment: "2026-09-20" };
  const active = domain.createFlock({ ...common, state: "active" });
  const closed = domain.createFlock({ ...common, code: "STATE-002", state: "closed" });
  assert.equal(active.state, "active");
  assert.equal(active.status, "進行中");
  assert.equal(closed.state, "closed");
  assert.equal(closed.status, "已出雞");
  assert.throws(() => domain.createFlock({ ...common, state: "paused" }), /MASTER_DATA_FLOCK_STATE_INVALID/);
});

test("calendar month logic covers leap, short, long and cross-year dates", () => {
  assert.equal(domain.calendarDaysInMonth(2024, 2), 29);
  assert.equal(domain.calendarDaysInMonth(2025, 2), 28);
  assert.equal(domain.calendarDaysInMonth(2025, 4), 30);
  assert.equal(domain.calendarDaysInMonth(2025, 1), 31);
  assert.equal(domain.calendarMonthCells(2024, 2).filter(Boolean).length, 29);
  assert.equal(domain.calendarMonthCells(2025, 2).filter(Boolean).length, 28);
});
