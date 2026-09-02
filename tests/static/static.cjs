const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const app = read("app.js");
const index = read("index.html");

assert.match(index, /data-app-id="jinji-web-v14r-lab"/);
assert.match(index, /data-build-marker="jinji-v14r-plus-r4-desktop-v7-mobile-nav"/);
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
console.log("STATIC_PASS", JSON.stringify({ farms: farms.length, houses: houses.length, flocks: flocks.length, active: 6, pending: data.pending.length, abnormalities: data.abnormalities.length }));
