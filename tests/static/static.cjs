const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const app = read("app.js");
const index = read("index.html");

assert.match(index, /data-app-id="jinji-web-v14r-lab"/);
assert.match(index, /data-build-marker="jinji-v14r-plus-r4-desktop-v7-mobile-nav"/);
assert.match(index, /<title>金雞管理中心 V14R Plus r4 Desktop v7（測試版）<\/title>/);
assert.match(index, /<meta name="apple-mobile-web-app-title" content="金雞管理中心">/);
assert.match(index, /<meta name="viewport" content="width=device-width, initial-scale=1\.0, minimum-scale=1\.0, maximum-scale=1\.0, user-scalable=no, viewport-fit=cover">/);
assert.match(index, /<link rel="stylesheet" href="\.\/styles\.css">/);
assert.equal((index.match(/<style(?:\s[^>]*)?>/g) || []).length, 0, "index keeps CSS external");
assert.equal((index.match(/<script>(?![\s\S]*src=)[\s\S]*?<\/script>/g) || []).length, 0, "index keeps JavaScript external");
for (const file of ["src/domain.js", "src/storage.js", "src/ai.js"]) assert.ok(fs.existsSync(path.join(root, file)), `${file} exists`);

const dataMatch = app.match(/const DATA = (\{[\s\S]*?\});\n\n  \/\* V14R/);
assert.ok(dataMatch, "fixture DATA is discoverable");
const data = JSON.parse(dataMatch[1]);
const farms = data.farms.filter((farm) => farm.id !== "all");
const houses = farms.flatMap((farm) => farm.houses);
const flocks = houses.flatMap((house) => house.flocks);
assert.equal(farms.length, 5);
assert.equal(houses.length, 9);
assert.equal(flocks.length, 7);
assert.equal(flocks.filter((flock) => flock.state === "active").length, 6);
assert.equal(flocks.find((flock) => flock.state === "closed").code, "AUDIT-HISTORY-OLD");
const calendarMetadataMatch = app.match(/const CALENDAR_FLOCK_META = Object\.freeze\((\{[\s\S]*?\})\);/);
assert.ok(calendarMetadataMatch, "calendar flock metadata is discoverable");
const calendarFlockMeta = Function('"use strict"; return (' + calendarMetadataMatch[1] + ");")();
const flockById = new Map(flocks.map((flock) => [flock.id, flock]));
assert.deepEqual(Object.keys(calendarFlockMeta).sort(), flocks.map((flock) => flock.id).sort(), "calendar metadata covers every fixture flock");
for (const [flockId, meta] of Object.entries(calendarFlockMeta)) {
  const flock = flockById.get(flockId);
  assert.ok(flock, `calendar metadata flock ${flockId} resolves to a fixture flock`);
  assert.equal(Number.isInteger(meta.male) && meta.male >= 0, true, `${flockId} male is a nonnegative integer`);
  assert.equal(Number.isInteger(meta.female) && meta.female >= 0, true, `${flockId} female is a nonnegative integer`);
  assert.equal(Number.isInteger(flock.initial) && flock.initial > 0, true, `${flockId} initial is a positive integer`);
  assert.equal(meta.male + meta.female, flock.initial, `${flockId} male + female equals initial`);
}
assert.deepEqual(Object.fromEntries(farms.map((farm) => [farm.id, farm.stock])), { red: 12132, black: 5420, silkie: 5940, new: 7920, history: 0 });
assert.equal(data.farms.find((farm) => farm.id === "all").stock, 31412);
assert.equal(data.events.filter((event) => event.type === "mortality" && event.date === "2026-08-31").reduce((sum, event) => sum + event.qty, 0), 6);
assert.equal(data.events.filter((event) => event.type === "cull" && event.date === "2026-08-31").reduce((sum, event) => sum + event.qty, 0), 1);
assert.equal(data.pending.length, 4);
assert.equal(data.abnormalities.length, 4);
assert.deepEqual(farms.reduce((totals, farm) => ({
  gross: totals.gross + farm.finance.gross,
  allocated: totals.allocated + farm.finance.allocated,
  expense: totals.expense + farm.finance.expense,
  net: totals.net + farm.finance.net,
}), { gross: 0, allocated: 0, expense: 0, net: 0 }), { gross: 204000, allocated: 120000, expense: 5000, net: 115000 });

assert.doesNotMatch(app, /DATA\.events\.push|DATA\.farms\.push|DATA\.pending\.push|DATA\.abnormalities\.push/);
assert.match(app, /structuredClone\(DATA\)/);
assert.match(app, /reconstructOperationalEvents\(labData\(\)\.events\)/);
assert.match(app, /escapeHtml\(state\.quickRecordDraft\)/);
assert.match(app, /data-action="commit-lab-event"/);
assert.match(app, /PREPROD LAB/);
assert.doesNotMatch([app, read("src/domain.js"), read("src/storage.js"), read("src/ai.js")].join("\n"), /https?:\/\/[^\s"']*(?:workers\.dev|api\.line\.me|cloudflareworkers\.com)/i);
assert.doesNotMatch([app, read("src/domain.js"), read("src/storage.js"), read("src/ai.js")].join("\n"), /\b(?:fetch|XMLHttpRequest|WebSocket)\s*\(/);
console.log("STATIC_PASS", JSON.stringify({ farms: farms.length, houses: houses.length, flocks: flocks.length, calendarMetadataFlocks: Object.keys(calendarFlockMeta).length, active: 6, pending: data.pending.length, abnormalities: data.abnormalities.length }));
