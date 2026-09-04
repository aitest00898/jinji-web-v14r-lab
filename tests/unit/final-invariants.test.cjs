const test = require("node:test");
const assert = require("node:assert/strict");
const domain = require("../../src/domain.js");

function event(id, input = {}) {
  return domain.createOperationalEvent({
    id,
    date: "2026-09-03",
    time: "09:30",
    source: "invariant-test",
    ...input,
  }, new Date("2026-09-03T09:30:00Z"));
}

test("F1 stock removal attribution conserves farm totals without allocating parents to every child", () => {
  const events = [
    event("farm-parent", { type: "mortality", quantity: 5, farmId: "farm-a" }),
    event("house-a-parent", { type: "cull", quantity: 7, farmId: "farm-a", houseId: "house-a" }),
    event("flock-a", { type: "mortality", quantity: 3, farmId: "farm-a", houseId: "house-a", flockId: "flock-a" }),
    event("flock-b", { type: "shipment", quantity: 4, farmId: "farm-a", houseId: "house-a", flockId: "flock-b" }),
    event("house-b-flock", { type: "mortality", quantity: 6, farmId: "farm-a", houseId: "house-b", flockId: "flock-c" }),
    event("other-farm", { type: "mortality", quantity: 9, farmId: "farm-b", houseId: "house-z", flockId: "flock-z" }),
    event("non-removal", { type: "feed", quantity: 100, farmId: "farm-a", houseId: "house-a", flockId: "flock-a" }),
  ];

  assert.equal(domain.stockRemovalTotal(events, { farmId: "farm-a" }), 25);
  assert.equal(domain.stockRemovalTotal(events, { farmId: "farm-a", houseId: "house-a" }), 14);
  assert.equal(domain.stockRemovalTotal(events, { farmId: "farm-a", houseId: "house-b" }), 6);
  assert.equal(domain.stockRemovalTotal(events, { farmId: "farm-a", houseId: "house-a", flockId: "flock-a" }), 3);
  assert.equal(domain.stockRemovalTotal(events, { farmId: "farm-a", houseId: "house-a", flockId: "flock-b" }), 4);
  assert.equal(domain.stockRemovalTotal(events, { farmId: "farm-a", houseId: "house-a", flockId: "missing" }), 0);
});

test("F3 closed flocks have zero current stock while preserving initial quantity", () => {
  const closed = domain.createFlock({
    id: "closed-flock",
    houseId: "house-a",
    code: "CLOSED-001",
    initial: 50,
    chickIn: "2026-08-01",
    plannedShipment: "2026-08-31",
    state: "closed",
  });
  assert.equal(closed.initial, 50);
  assert.equal(closed.stock, 0);
  assert.equal(closed.state, "closed");
  assert.equal(closed.status, "已出雞");
  assert.throws(() => domain.createFlock({
    id: "closed-flock-with-stock",
    houseId: "house-a",
    code: "CLOSED-002",
    initial: 50,
    stock: 1,
    chickIn: "2026-08-01",
    plannedShipment: "2026-08-31",
    state: "closed",
  }), /MASTER_DATA_CLOSED_FLOCK_STOCK_INVALID/);
});

test("F6 operational-event reconstruction isolates malformed rows", () => {
  const valid = event("valid-event", { type: "mortality", quantity: 2, farmId: "farm-a" });
  const reconstructed = domain.reconstructOperationalEvents([
    valid,
    { id: "bad-type", type: "not-an-event-type", quantity: 3, farmId: "farm-a" },
    { id: "bad-quantity", type: "mortality", quantity: "not-a-number", farmId: "farm-a" },
  ]);
  assert.deepEqual(reconstructed.map((row) => row.id), ["valid-event"]);
});
