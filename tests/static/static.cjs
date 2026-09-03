const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const app = read("app.js");
const index = read("index.html");
const labFixture = require(path.join(root, "src/lab-fixture.js"));
const financeFixture = require(path.join(root, "src/finance-fixture.js"));
const domain = require(path.join(root, "src/domain.js"));
const storage = require(path.join(root, "src/storage.js"));

assert.match(index, /data-app-id="jinji-web-v14r-lab"/);
assert.match(index, /data-build-marker="jinji-v14r-plus-r4-desktop-v7-mobile-nav"/);
assert.match(index, /<title>金雞管理中心 V14R Plus r4 Desktop v7（測試版）<\/title>/);
assert.match(index, /<meta name="apple-mobile-web-app-title" content="金雞管理中心">/);
assert.match(index, /<meta name="viewport" content="width=device-width, initial-scale=1\.0, minimum-scale=1\.0, maximum-scale=1\.0, user-scalable=no, viewport-fit=cover">/);
assert.match(index, /<link rel="stylesheet" href="\.\/styles\.css">/);
assert.equal((index.match(/<style(?:\s[^>]*)?>/g) || []).length, 0, "index keeps CSS external");
assert.equal((index.match(/<script>(?![\s\S]*src=)[\s\S]*?<\/script>/g) || []).length, 0, "index keeps JavaScript external");
for (const file of ["src/domain.js", "src/storage.js", "src/admin.js", "src/ai.js", "src/lab-fixture.js", "src/finance-fixture.js"]) assert.ok(fs.existsSync(path.join(root, file)), `${file} exists`);
assert.match(index, /src\/lab-fixture\.js/);
assert.match(index, /src\/finance-fixture\.js/);
assert.match(index, /src\/admin\.js/);
assert.match(app, /const DATA = window\.JinjiLabFixture;/);

const financeMapMatch = app.match(/const FINANCE_CONTEXT_FARM_MAP = Object\.freeze\((\{[\s\S]*?\})\);/);
assert.ok(financeMapMatch, "finance/operational farm map is discoverable");
const financeFarmMap = Function('"use strict"; return (' + financeMapMatch[1] + ");")();
assert.deepEqual(financeFarmMap, {
  red: "syn-farm-a",
  black: "syn-farm-b",
  silkie: "syn-farm-c",
  new: "syn-farm-d",
  history: "syn-farm-e",
  f: "syn-farm-f",
  g: "syn-farm-g",
  h: "syn-farm-h",
});

const farms = labFixture.farms.filter((farm) => farm.id !== "all");
const houses = farms.flatMap((farm) => farm.houses);
const flocks = houses.flatMap((house) => house.flocks);
assert.equal(farms.length, 8);
assert.equal(houses.length, 15);
assert.equal(flocks.length, 13);
assert.equal(flocks.filter((flock) => flock.state === "active").length, 12);
assert.equal(flocks.find((flock) => flock.state === "closed").code, "AUDIT-HISTORY-OLD");
assert.equal(labFixture.metadata.classification, "synthetic");
assert.equal(labFixture.metadata.datasetId, "SYNTHETIC_OPERATIONAL_V1");
assert.equal(farms.filter((farm) => farm.id !== "history").every((farm) => farm.houses.length > 0 && farm.houses.some((house) => house.flocks.length > 0)), true, "every active farm has house and flock coverage");
assert.equal(farms.filter((farm) => ["f", "g", "h"].includes(farm.id)).every((farm) => farm.houses.every((house) => house.flocks.length > 0)), true, "new synthetic farms have flock coverage in every house");
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
const farmById = new Map(farms.map((farm) => [farm.id, farm]));
const houseById = new Map(houses.map((house) => [house.id, house]));
const flockIds = new Set(flocks.map((flock) => flock.id));
for (const event of labFixture.events) {
  const farm = farmById.get(event.farmId);
  assert.ok(farm, `event ${event.id} resolves to an operational farm`);
  const house = event.houseId ? farm.houses.find((candidate) => candidate.id === event.houseId) : null;
  if (event.houseId) assert.ok(house, `event ${event.id} resolves to an operational house in its farm`);
  if (event.flockId) assert.ok(house?.flocks.some((flock) => flock.id === event.flockId) && flockIds.has(event.flockId), `event ${event.id} resolves to an operational flock in its house`);
}
for (const [farmId, farmName] of Object.entries({ f: "模擬營運場 F", g: "模擬營運場 G", h: "模擬營運場 H" })) {
  const farm = farmById.get(farmId);
  assert.equal(farm.name, farmName, `${farmId} operational counterpart`);
  assert.ok(labFixture.events.some((event) => event.farmId === farmId), `${farmId} has operational events`);
  assert.ok(labFixture.pending.some((item) => item.farmId === farmId), `${farmId} has pending coverage`);
  assert.ok(labFixture.abnormalities.some((item) => item.farmId === farmId), `${farmId} has abnormality coverage`);
}
assert.deepEqual(Object.fromEntries(farms.map((farm) => [farm.id, farm.stock])), { red: 12132, black: 5420, silkie: 5940, new: 7920, history: 0, f: 7728, g: 9606, h: 6548 });
assert.equal(labFixture.farms.find((farm) => farm.id === "all").stock, 55294);
assert.equal(labFixture.events.filter((event) => event.type === "mortality" && event.date === "2026-08-31").reduce((sum, event) => sum + event.qty, 0), 6);
assert.equal(labFixture.events.filter((event) => event.type === "cull" && event.date === "2026-08-31").reduce((sum, event) => sum + event.qty, 0), 1);
assert.equal(labFixture.pending.length, 7);
assert.equal(labFixture.abnormalities.length, 7);
assert.equal(labFixture.farms.some((farm) => Object.prototype.hasOwnProperty.call(farm, "finance")), false, "operational fixture has no finance overlay");
assert.equal(Object.prototype.hasOwnProperty.call(labFixture, "history"), false, "operational fixture has no finance history series");

const validation = domain.validateFinanceDataset(financeFixture);
assert.deepEqual(validation, {
  farms: 8,
  investors: 3,
  equityRows: 24,
  distributions: 12,
  allocations: 36,
  totals: { gross: 901000, allocated: 121250, expense: 6000, net: 115250 },
});
const finance = new storage.FinanceRepository({ dataset: financeFixture, validate: domain.validateFinanceDataset });
assert.equal(finance.listFarms().length, 8);
assert.equal(finance.listInvestors().length, 3);
assert.equal(finance.listEquities().length, 24);
assert.equal(finance.listDistributions().length, 12);
assert.equal(finance.listAllocations().length, 36);
assert.equal(finance.listSourceReferences().length, 12);
assert.deepEqual(finance.getPortfolioTotals(), { gross: 901000, allocated: 121250, expense: 6000, net: 115250 });
assert.equal(finance.getCumulativeNetSeries().at(-1).value, 115250);

const guardedSource = [app, read("src/domain.js"), read("src/storage.js"), read("src/admin.js"), read("src/ai.js"), read("src/finance-fixture.js")].join("\n");
assert.doesNotMatch(app, /farm\.finance|\.finance\b/);
assert.doesNotMatch(app, /labData\(\)\.history/);
assert.doesNotMatch(app, /(?:204000|120000|5000|115000)/);
assert.doesNotMatch(guardedSource, /https?:\/\/[^\s"']*(?:workers\.dev|api\.line\.me|cloudflareworkers\.com)/i);
assert.doesNotMatch(guardedSource, /\b(?:fetch|XMLHttpRequest|WebSocket)\s*\(/);
assert.doesNotMatch(guardedSource, /(?:LINE_CHANNEL_SECRET|CHANNEL_ACCESS_TOKEN|Authorization:\s*Bearer|wrangler\s+secret)/i);
assert.match(app, /structuredClone\(DATA\)/);
assert.match(app, /reconstructOperationalEvents\(labData\(\)\.events\)/);
assert.match(app, /escapeHtml\(state\.quickRecordDraft\)/);
assert.match(app, /data-action="commit-lab-event"/);
assert.match(app, /PREPROD LAB/);
assert.match(read("src/admin.js"), /LocalLabAdminAuthorizationAdapter/);
assert.match(read("src/domain.js"), /validateMasterData/);
assert.equal(financeFixture.farms.every((farm) => farm.id.startsWith("syn-") && farm.name.startsWith("模擬場")), true);
assert.equal(financeFixture.investors.every((investor) => investor.id.startsWith("syn-") && investor.name.startsWith("模擬投資人")), true);
assert.equal(financeFixture.distributions.every((row) => row.id.startsWith("syn-") && row.sourceDataset === "SYNTHETIC_FINANCE_V1" && row.sourceRowKey.startsWith("fixture://")), true);
assert.equal(financeFixture.allocations.every((row) => row.id.startsWith("syn-")), true);
assert.equal(financeFixture.sourceReferences.every((row) => row.id.startsWith("syn-")), true);
console.log("STATIC_PASS", JSON.stringify({
  operational: { farms: farms.length, houses: houses.length, flocks: flocks.length, active: 12, pending: labFixture.pending.length, abnormalities: labFixture.abnormalities.length },
  finance: validation,
  sourceSafety: { runtimeNetwork: 0, productionSecrets: 0, operationalFinanceOverlay: 0 },
}));
