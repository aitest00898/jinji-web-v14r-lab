const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const domain = require(path.join(root, "src/domain.js"));
const storage = require(path.join(root, "src/storage.js"));
const fixture = require(path.join(root, "src/finance-fixture.js"));

const expectedTotals = { gross: 901000, allocated: 121250, expense: 6000, net: 115250 };
const expectedInvestorTotals = {
  "syn-investor-a": 41753.33333333333,
  "syn-investor-b": 38193.33333333333,
  "syn-investor-c": 35303.33333333334,
};
const repo = new storage.FinanceRepository({ dataset: fixture, validate: domain.validateFinanceDataset });
const closeEnough = (left, right) => Math.abs(left - right) <= domain.FINANCE_EPSILON;

assert.deepEqual(domain.validateFinanceDataset(fixture), {
  farms: 8,
  investors: 3,
  equityRows: 24,
  distributions: 12,
  allocations: 36,
  totals: expectedTotals,
});
assert.deepEqual(repo.getPortfolioTotals(), expectedTotals);
assert.equal(repo.listFarms().length, 8);
assert.equal(repo.listInvestors().length, 3);
assert.equal(repo.listEquities().length, 24);
assert.equal(repo.listDistributions().length, 12);
assert.equal(repo.listAllocations().length, 36);
assert.deepEqual(repo.listFarms().map((farm) => farm.name), ["模擬場 A", "模擬場 B", "模擬場 C", "模擬場 D", "模擬場 E", "模擬場 F", "模擬場 G", "模擬場 H"]);
assert.deepEqual(repo.listInvestors().map((investor) => investor.name), ["模擬投資人 A", "模擬投資人 B", "模擬投資人 C"]);

for (const investor of repo.listInvestors()) {
  assert.equal(closeEnough(investor.allocationTotal, expectedInvestorTotals[investor.id]), true, `${investor.id} allocation total`);
  assert.equal(investor.farms.length, 8);
  assert.equal(investor.positiveDistributionCount + investor.negativeDistributionCount, 12);
  assert.ok(investor.latestAllocation);
}
assert.equal(repo.getDistributionAllocations("syn-distribution-02").length, 3);
assert.equal(repo.getDistributionAllocations("syn-distribution-04").reduce((sum, row) => sum + row.amount, 0), -6600);
assert.equal(repo.getInvestorAllocations("syn-investor-a").length, 12);
assert.equal(repo.listDistributions({ farmId: "syn-farm-b" }).length, 2);
assert.equal(repo.listDistributions({ fromDate: "2035-08-01", toDate: "2035-10-31" }).length, 3);
assert.equal(repo.listDistributions({ investorId: "syn-investor-a" }).length, 12);
assert.equal(repo.listDistributions({ farmId: "syn-farm-a", investorId: "syn-investor-b" }).length, 2);
assert.equal(repo.getDistribution("syn-distribution-12").sourceRowKey, "fixture://finance/TX-12");

const series = repo.getCumulativeNetSeries();
assert.equal(series.length, 12);
assert.equal(series[0].distributionId, "syn-distribution-01");
assert.equal(series.at(-1).distributionId, "syn-distribution-12");
assert.equal(closeEnough(series.at(-1).runningTotal, expectedTotals.net), true);
assert.equal(series.some((row) => row.netIncome < 0), true);
assert.equal(repo.getExpenseSeries().reduce((sum, row) => sum + row.expense, 0), expectedTotals.expense);
assert.equal(repo.listSourceReferences().length, 12);
assert.equal(repo.listSourceReferences().every((row) => row.id.startsWith("syn-")), true);
assert.equal(repo.listSourceReferences().every((row) => row.classification === "synthetic" && row.sourceDataset.startsWith("SYNTHETIC_")), true);

const output = repo.getDataset();
output.farms[0].name = "mutated outside repository";
output.distributions[0].netIncome = 0;
assert.equal(repo.getFarm("syn-farm-a").name, "模擬場 A");
assert.equal(repo.getDistribution("syn-distribution-01").netIncome, 14400);

const zeroHistoryDataset = JSON.parse(JSON.stringify(fixture));
zeroHistoryDataset.farms.push({ id: "syn-farm-zero", name: "模擬場 Zero", farmTotalEquityFraction: 0, playerGroupEquityFraction: 0, active: true });
const zeroHistoryRepo = new storage.FinanceRepository({ dataset: zeroHistoryDataset, validate: domain.validateFinanceDataset });
assert.equal(zeroHistoryRepo.getFarm("syn-farm-zero").historyStatus, "no_history");
assert.equal(zeroHistoryRepo.getFarm("syn-farm-zero").latestDistributionDate, null);
assert.equal(zeroHistoryRepo.getCumulativeNetSeries({ farmId: "syn-farm-zero" }).length, 0);

const optionalExpenseDataset = JSON.parse(JSON.stringify(fixture));
delete optionalExpenseDataset.distributions[0].expense;
const optionalExpenseRepo = new storage.FinanceRepository({ dataset: optionalExpenseDataset, validate: domain.validateFinanceDataset });
assert.equal(optionalExpenseRepo.getDistribution("syn-distribution-01").expense, undefined);
assert.equal(optionalExpenseRepo.getSummary().totals.expense, expectedTotals.expense);

const guardedSource = ["app.js", "index.html", "src/domain.js", "src/storage.js", "src/finance-fixture.js"].map(read).join("\n");
assert.doesNotMatch(guardedSource, /farm\.finance|\.finance\b/);
assert.doesNotMatch(guardedSource, /labData\(\)\.history/);
assert.doesNotMatch(guardedSource, /(?:fetch|XMLHttpRequest|WebSocket)\s*\(/);
assert.doesNotMatch(guardedSource, /https?:\/\//i);
assert.doesNotMatch(guardedSource, /(?:LINE_CHANNEL_SECRET|CHANNEL_ACCESS_TOKEN|Authorization\s*:\s*Bearer|wrangler\s+secret|ghp_[A-Za-z0-9])/i);
assert.match(read("app.js"), /FinanceRepository/);
for (const tab of ["總覽", "各場", "投資人／股權", "歷史分配", "費用", "投資績效", "資料來源"]) assert.match(read("app.js"), new RegExp(tab));

console.log("FINANCE_PASS", JSON.stringify({
  dataset: fixture.metadata,
  counts: { farms: 8, investors: 3, equities: 24, distributions: 12, allocations: 36 },
  totals: expectedTotals,
  investorTotals: expectedInvestorTotals,
  zeroHistory: "PASS",
  optionalExpense: "PASS",
  sourceSafety: "PASS",
}));
