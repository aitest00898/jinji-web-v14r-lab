const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { chromium, webkit } = require("@playwright/test");

const root = require("node:path").resolve(__dirname, "../..");
const browserName = process.argv.includes("--browser=webkit") ? "webkit" : "chromium";
const port = Number(process.env.FINANCE_PORT || (browserName === "webkit" ? 4193 : 4192));
const baseUrl = `http://127.0.0.1:${port}`;
const expectedTitle = "金雞管理中心 V14R Plus r4 Desktop v7（測試版）";
const expectedMarker = "jinji-v14r-plus-r4-desktop-v7-mobile-nav";
const expectedTabs = ["總覽", "各場", "投資人／股權", "歷史分配", "費用", "投資績效", "資料來源"];

function waitForServer(server) {
  return new Promise((resolve, reject) => {
    const timer = setInterval(async () => {
      try {
        if ((await fetch(`${baseUrl}/index.html`)).ok) { clearInterval(timer); resolve(); }
      } catch (_) {}
    }, 80);
    server.once("error", (error) => { clearInterval(timer); reject(error); });
    setTimeout(() => { clearInterval(timer); reject(new Error("FINANCE_SERVER_TIMEOUT")); }, 10000);
  });
}

async function assertTabs(page, selector) {
  assert.equal(await page.locator(selector).count(), expectedTabs.length);
  assert.deepEqual(await page.locator(selector).allTextContents(), expectedTabs);
}

async function openFinance(page, desktop = false) {
  if (desktop) {
    await page.locator('.desktop-nav [data-nav="finance"]').click();
  } else {
    await page.locator('.bottom-nav [data-nav="more"]').click();
    await page.locator('[data-action="go-finance"]').click();
  }
  await page.locator('[data-page="finance"]').waitFor();
}

async function runMobile(page) {
  await openFinance(page);
  await assertTabs(page, ".finance-tab");
  const overview = page.locator('[data-page="finance"]');
  const overviewText = await overview.innerText();
  for (const value of ["901,000", "121,250", "6,000", "115,250"]) assert.match(overviewText, new RegExp(value.replace(",", ",")));
  assert.equal(await page.locator('[data-testid="finance-net"]').innerText(), "115,250");
  assert.equal(await page.locator('[data-testid="finance-chart"]').count(), 1);
  assert.match(await page.locator('[data-testid="finance-chart"]').getAttribute("aria-label"), /115,250/);

  await page.locator('[data-finance-tab="farms"]').click();
  assert.equal(await page.locator('[data-page="finance"] .list-row[data-action="open-finance-farm"]').count(), 8);
  assert.match(await page.locator('[data-page="finance"]').innerText(), /模擬場 A/);
  assert.match(await page.locator('[data-page="finance"]').innerText(), /模擬場 H/);
  await page.locator('[data-action="open-finance-farm"][data-farm-id="syn-farm-a"]').click();
  const farmSheet = await page.locator(".sheet-panel").innerText();
  assert.match(farmSheet, /歷史總盈虧/);
  assert.match(farmSheet, /模擬投資人 A/);
  await page.locator('button.sheet-close[data-action="close-sheet"]').click();

  for (const [farmId, financeName] of [["f", "模擬場 F"], ["g", "模擬場 G"], ["h", "模擬場 H"]]) {
    await page.locator('[data-testid="farm-selector"]').click();
    await page.locator(`[data-action="select-farm-direct"][data-farm-id="${farmId}"]`).click();
    await page.locator('[data-finance-tab="farms"]').click();
    assert.equal(await page.locator('[data-page="finance"] .list-row[data-action="open-finance-farm"]').count(), 1, `${farmId} finance scope maps to one farm`);
    assert.match(await page.locator('[data-page="finance"]').innerText(), new RegExp(financeName));
  }
  await page.locator('[data-testid="farm-selector"]').click();
  await page.locator('[data-action="select-farm-direct"][data-farm-id="all"]').click();

  await page.locator('[data-finance-tab="equity"]').click();
  assert.equal(await page.locator('[data-page="finance"] .list-row[data-action="open-investor-detail"]').count(), 3);
  const equityText = await page.locator('[data-page="finance"]').innerText();
  assert.match(equityText, /模擬投資人 A/);
  assert.doesNotMatch(equityText, /33\.3%/);

  await page.locator('[data-finance-tab="distributions"]').click();
  assert.equal(await page.locator('[data-page="finance"] .list-row[data-action="open-distribution-detail"]').count(), 12);
  await page.locator('[data-action="open-distribution-detail"][data-distribution-id="syn-distribution-01"]').click();
  const distributionSheet = await page.locator(".sheet-panel").innerText();
  assert.match(distributionSheet, /SYNTHETIC_FINANCE_V1/);
  assert.match(distributionSheet, /fixture:\/\/finance\/TX-01/);
  assert.match(distributionSheet, /模擬投資人 A/);
  await page.locator('button.sheet-close[data-action="close-sheet"]').click();

  await page.locator('[data-finance-tab="expenses"]').click();
  assert.match(await page.locator('[data-page="finance"]').innerText(), /分配層級費用合計/);
  assert.equal(await page.locator('[data-page="finance"] .list-row').filter({ hasText: "費用分類" }).count(), 0);
  await page.locator('[data-finance-tab="performance"]').click();
  const performanceText = await page.locator('[data-page="finance"]').innerText();
  assert.match(performanceText, /ROI/);
  assert.match(performanceText, /IRR/);
  await page.locator('[data-finance-tab="source"]').click();
  assert.equal(await page.locator('[data-page="finance"] .list-row[data-action="open-distribution-detail"]').count(), 12);
  assert.match(await page.locator('[data-page="finance"]').innerText(), /synthetic fixture/);
}

async function runDesktop(page) {
  await openFinance(page, true);
  await assertTabs(page, ".desktop-finance-tabs button");
  assert.equal(await page.locator(".desktop-sidebar").isVisible(), true);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  for (const [key] of [["overview"], ["farms"], ["equity"], ["distributions"], ["expenses"], ["performance"], ["source"]]) {
    await page.locator(`[data-finance-tab="${key}"]`).first().click();
    assert.equal(await page.locator('[data-page="finance"]').count(), 1);
  }
  assert.match(await page.locator('[data-page="finance"]').innerText(), /SYNTHETIC_FINANCE_V1/);
}

async function main() {
  const server = spawn("python3", ["-m", "http.server", String(port), "--bind", "127.0.0.1"], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
  let browser;
  const contexts = [];
  try {
    await waitForServer(server);
    console.log(`FINANCE_SERVER_PID=${server.pid}`);
    console.log(`FINANCE_SERVER_ROOT=${root}`);
    console.log(`FINANCE_SERVER_URL=${baseUrl}/index.html`);
    const browserType = browserName === "webkit" ? webkit : chromium;
    const launchOptions = { headless: true };
    const chromePath = process.env.CHROME_PATH;
    if (browserName === "chromium" && chromePath) launchOptions.executablePath = chromePath;
    browser = await browserType.launch(launchOptions);

    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    contexts.push(mobileContext);
    const mobile = await mobileContext.newPage();
    const mobileErrors = { console: [], page: [], requests: [] };
    mobile.on("console", (message) => { if (message.type() === "error") mobileErrors.console.push(message.text()); });
    mobile.on("pageerror", (error) => mobileErrors.page.push(error.message));
    mobile.on("request", (request) => { if (!request.url().startsWith(baseUrl)) mobileErrors.requests.push(request.url()); });
    await mobile.goto(`${baseUrl}/index.html?finance=${browserName}-mobile&test-date=2026-08-31`, { waitUntil: "networkidle" });
    // Required first assertion: browser target identity.
    assert.equal(await mobile.evaluate("document.documentElement.dataset.appId"), "jinji-web-v14r-lab");
    assert.equal(await mobile.title(), expectedTitle);
    assert.equal(await mobile.locator("html").getAttribute("data-build-marker"), expectedMarker);
    assert.equal(await mobile.locator("meta[name=viewport]").getAttribute("content"), "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover");
    await runMobile(mobile);

    const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    contexts.push(desktopContext);
    const desktop = await desktopContext.newPage();
    const desktopErrors = { console: [], page: [], requests: [] };
    desktop.on("console", (message) => { if (message.type() === "error") desktopErrors.console.push(message.text()); });
    desktop.on("pageerror", (error) => desktopErrors.page.push(error.message));
    desktop.on("request", (request) => { if (!request.url().startsWith(baseUrl)) desktopErrors.requests.push(request.url()); });
    await desktop.goto(`${baseUrl}/index.html?finance=${browserName}-desktop&test-date=2026-08-31`, { waitUntil: "networkidle" });
    assert.equal(await desktop.evaluate("document.documentElement.dataset.appId"), "jinji-web-v14r-lab");
    assert.equal(await desktop.title(), expectedTitle);
    await runDesktop(desktop);

    assert.deepEqual(mobileErrors, { console: [], page: [], requests: [] });
    assert.deepEqual(desktopErrors, { console: [], page: [], requests: [] });
    console.log(`FINANCE_E2E_PASS=${browserName}`, JSON.stringify({ mobile: "390x844", desktop: "1440x900", consoleErrors: 0, pageErrors: 0, unexpectedRequests: 0 }));
  } finally {
    for (const context of contexts) await context.close().catch(() => {});
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
}

main().catch((error) => { console.error(`FINANCE_E2E_FAIL=${browserName}`, error.stack || error.message); process.exitCode = 1; });
