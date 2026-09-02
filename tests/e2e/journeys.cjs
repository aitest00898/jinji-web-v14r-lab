const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { chromium, webkit } = require("@playwright/test");

const root = path.resolve(__dirname, "../..");
const browserName = process.argv.includes("--browser=webkit") ? "webkit" : "chromium";
const port = Number(process.env.JOURNEY_PORT || (browserName === "webkit" ? 4186 : 4185));
const baseUrl = `http://127.0.0.1:${port}`;
const expectedTitle = "金雞管理中心 V14R Plus r4 Desktop v7（測試版）";
const expectedMarker = "jinji-v14r-plus-r4-desktop-v7-mobile-nav";

function waitForServer(server) {
  return new Promise((resolve, reject) => {
    const timer = setInterval(async () => {
      try {
        if ((await fetch(`${baseUrl}/index.html`)).ok) { clearInterval(timer); resolve(); }
      } catch (_) {}
    }, 80);
    server.once("error", (error) => { clearInterval(timer); reject(error); });
    setTimeout(() => { clearInterval(timer); reject(new Error("JOURNEY_SERVER_TIMEOUT")); }, 10000);
  });
}

async function assertIdentity(page) {
  // Required first assertion: browser target identity.
  assert.equal(await page.evaluate("document.documentElement.dataset.appId"), "jinji-web-v14r-lab");
  assert.equal(await page.title(), expectedTitle);
  assert.equal(await page.locator("html").getAttribute("data-build-marker"), expectedMarker);
}

async function newPage(browser, viewport = { width: 390, height: 844 }) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const unexpectedRequests = [];
  const consoleErrors = [];
  const pageErrors = [];
  page.on("request", (request) => { if (!request.url().startsWith(baseUrl)) unexpectedRequests.push(request.url()); });
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.__journeyEvidence = { context, unexpectedRequests, consoleErrors, pageErrors };
  await page.goto(`${baseUrl}/index.html?journey=${browserName}-${Date.now()}`, { waitUntil: "networkidle" });
  await assertIdentity(page);
  return page;
}

async function closeSheet(page) {
  await page.locator('button.sheet-close[data-action="close-sheet"]').click();
}

async function setMode(page, mode) {
  await page.locator('.bottom-nav [data-nav="more"]').click();
  await page.locator('[data-action="open-sheet"][data-sheet-kind="developer-fallback"]').click();
  await page.locator(`[data-action="set-lab-mode"][data-mode="${mode}"]`).click();
  await closeSheet(page);
}

async function diagnosticsText(page) {
  await page.locator('.bottom-nav [data-nav="more"]').click();
  await page.locator('[data-action="open-sheet"][data-sheet-kind="developer-diagnostics"]').click();
  return page.locator(".sheet-panel").innerText();
}

async function quickRecord(page, text) {
  await page.locator(".mobile-quick-button").click();
  if (await page.locator('[data-action="start-quick-record-farm"]').count()) {
    await page.locator('[data-action="start-quick-record-farm"][data-farm-id="red"]').click();
  } else {
    await page.locator('[data-action="open-quick-record"]').click();
  }
  await page.locator("#quick-record-input").fill(text);
  await page.locator('[data-action="preview-quick-record"]').click();
  await page.locator('[data-action="commit-lab-event"]').click();
}

async function runPrimaryJourney(page) {
  await quickRecord(page, "死亡5");
  assert.equal(await page.locator('[data-testid="mortality-value"]').innerText(), "10");
  assert.equal(await page.locator('[data-testid="stock-value"]').innerText(), "12,127");
  assert.match(await page.locator(".lab-write-notice").innerText(), /Lab：死亡 5/);

  await page.locator('[data-action="chart-tab"][data-chart-tab="events"]').click();
  assert.match(await page.locator(".plus-chart-panel").innerText(), /今日/);
  assert.match(await page.locator(".plus-chart-panel").innerText(), /累積/);
  const touchTarget = page.locator(".plus-chart-panel [data-chart-tip]").first();
  await touchTarget.dispatchEvent("pointerdown", { pointerType: "touch", clientX: 34, clientY: 180 });
  assert.equal(await page.locator("#chart-query-tooltip").isVisible(), true);
  assert.match(await page.locator("#chart-query-tooltip").innerText(), /2026-08/);

  await page.locator('.bottom-nav [data-nav="records"]').click();
  assert.equal(await page.locator('.list-row').filter({ hasText: "死亡 5 隻" }).count(), 2);
  await page.locator('[data-action="records-mode"][data-records-mode="chart"]').click();
  assert.equal(await page.locator(".mortality-dual-stats").count() > 0, true);
  await page.locator('[data-action="records-mode"][data-records-mode="list"]').click();
  const newEventRow = page.locator('.list-row').filter({ hasText: "死亡 5 隻" }).first();
  await newEventRow.click();
  const contextBeforeDetail = await page.locator(".context-hub").innerText();
  assert.match(contextBeforeDetail, /稽核紅羽一場/);
  await closeSheet(page);
  await newEventRow.click();
  await page.locator('[data-action="open-correction"]').click();
  await page.locator("#correction-qty").fill("2");
  await page.locator('[data-action="commit-correction"]').click();
  await page.locator('.bottom-nav [data-nav="records"]').click();
  assert.equal(await page.locator('.list-row').filter({ hasText: "死亡 5 隻" }).count(), 1);
  assert.equal(await page.locator('.list-row').filter({ hasText: "死亡 2 隻" }).filter({ hasText: "2026-08-31 09:30" }).count(), 1);

  await page.locator('.bottom-nav [data-nav="calendar"]').click();
  assert.equal(await page.locator(".calendar-title-block h1").innerText(), "2026 年 8 月");
  assert.equal(await page.locator('.calendar-cell[data-date="2026-08-31"]').count(), 1);
  assert.equal(await page.locator(".calendar-detail-item").filter({ hasText: "死亡 5 隻" }).count(), 1);
  for (let index = 0; index < 8; index += 1) await page.locator('[data-action="calendar-prev-month"]').click();
  assert.equal(await page.locator(".calendar-title-block h1").innerText(), "2025 年 12 月");
  for (let index = 0; index < 8; index += 1) await page.locator('[data-action="calendar-next-month"]').click();
  assert.equal(await page.locator(".calendar-title-block h1").innerText(), "2026 年 8 月");
  await page.locator('[data-action="calendar-next-month"]').click();
  await page.locator('[data-action="calendar-select-date"][data-date="2026-09-03"]').click();
  const weighDetail = await page.locator(".calendar-detail-panel").innerText();
  assert.match(weighDetail, /磅雞/);
  assert.match(weighDetail, /預計出雞 2026-09-06/);
  await page.locator('[data-action="calendar-prev-month"]').click();
  await page.locator('[data-action="calendar-prev-month"]').click();
  await page.locator('[data-action="calendar-select-date"][data-date="2026-07-20"]').click();
  const chickInDetail = await page.locator(".calendar-detail-panel").innerText();
  assert.match(chickInDetail, /公 3,600 隻/);
  assert.match(chickInDetail, /母 3,400 隻/);
  assert.match(chickInDetail, /合計 7,000 隻/);

  // Use a deliberately sparse Lab scope with water points on both adjacent
  // as-of dates so this assertion is deterministic across runner time zones.
  await page.locator('[data-testid="farm-selector"]').click();
  await page.locator('[data-action="select-farm-direct"][data-farm-id="silkie"]').click();
  await page.locator('[data-action="select-house-direct"][data-house-id="silkie-1"]').click();
  await page.locator('.bottom-nav [data-nav="more"]').click();
  await page.locator('[data-action="open-sheet"][data-sheet-kind="settings"]').click();
  await page.locator('[data-action="open-settings-detail"][data-settings-key="trend"]').click();
  await page.locator('[data-threshold-key="baselineDays"]').fill("6");
  await page.locator('[data-threshold-key="minBaselinePoints"]').fill("6");
  await page.locator('[data-action="save-trend-thresholds"]').click();
  await closeSheet(page);
  await page.locator('.bottom-nav [data-nav="records"]').click();
  await page.locator('[data-action="records-mode"][data-records-mode="chart"]').click();
  await page.locator('[data-action="records-metric"][data-records-metric="water"]').click();
  assert.match(await page.locator(".trend-alert").last().innerText(), /資料不足，不判定/);

  await page.locator('.bottom-nav [data-nav="more"]').click();
  await page.locator('[data-action="open-sheet"][data-sheet-kind="settings"]').click();
  await page.locator('[data-action="open-settings-detail"][data-settings-key="trend"]').click();
  await page.locator('[data-action="reset-trend-thresholds"]').click();
  await closeSheet(page);

  await page.locator('.bottom-nav [data-nav="more"]').click();
  await page.locator('[data-action="go-ai"]').click();
  assert.match(await page.locator(".ai-status-strip").innerText(), /AI 可用/);
}

async function runContextJourney(page) {
  await page.locator('[data-testid="farm-selector"]').click();
  await page.locator('[data-action="select-farm-direct"][data-farm-id="red"]').click();
  await page.locator('[data-action="select-house-direct"][data-house-id="red-1"]').click();
  await page.locator('[data-action="select-flock-direct"][data-flock-id="alpha"]').click();
  const selectedContext = await page.locator(".context-hub").innerText();
  assert.match(selectedContext, /紅羽一舍/);
  assert.match(selectedContext, /AUDIT-RED-ALPHA/);
  await page.locator('.bottom-nav [data-nav="records"]').click();
  const row = page.locator('.list-row[data-action="open-event"]').first();
  await row.click();
  const retainedContext = await page.locator(".context-hub").innerText();
  assert.match(retainedContext, /紅羽一舍/);
  assert.match(retainedContext, /AUDIT-RED-ALPHA/);
  await closeSheet(page);
}

async function runOfflineJourney(browser) {
  const page = await newPage(browser);
  await setMode(page, "BACKEND_TEMP_DOWN");
  await quickRecord(page, "死亡1");
  await page.locator('.bottom-nav [data-nav="today"]').click();
  assert.equal(await page.locator('[data-testid="mortality-value"]').innerText(), "6");
  assert.equal(await page.locator('[data-testid="stock-value"]').innerText(), "12,131");
  const tempDiagnostics = await diagnosticsText(page);
  assert.match(tempDiagnostics, /BACKEND_TEMP_DOWN/);
  assert.match(tempDiagnostics, /待同步操作[\s\S]*1 筆/);
  await closeSheet(page);
  await setMode(page, "ONLINE");
  const onlineDiagnostics = await diagnosticsText(page);
  assert.match(onlineDiagnostics, /ONLINE/);
  assert.match(onlineDiagnostics, /待同步操作[\s\S]*0 筆/);
  await closeSheet(page);
  await setMode(page, "BACKEND_LONG_DOWN");
  await page.locator('.bottom-nav [data-nav="records"]').click();
  assert.equal(await page.locator('[data-page="records"]').count(), 1);
  assert.match(await page.locator(".topbar").innerText(), /BACKEND_LONG_DOWN/);
  await page.locator('.bottom-nav [data-nav="more"]').click();
  await page.locator('[data-action="open-sheet"][data-sheet-kind="developer-fallback"]').click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator('[data-action="reset-lab-fixture"]').click();
  await closeSheet(page);
  await page.locator('[data-testid="farm-selector"]').click();
  await page.locator('[data-action="select-farm-direct"][data-farm-id="all"]').click();
  await page.locator('.bottom-nav [data-nav="today"]').click();
  assert.equal(await page.locator('[data-testid="mortality-value"]').innerText(), "6");
  assert.equal(await page.locator('[data-testid="stock-value"]').innerText(), "31,412");
  return page;
}

async function runChartDesktopJourney(browser) {
  const page = await newPage(browser, { width: 1440, height: 900 });
  assert.equal(await page.locator(".desktop-sidebar").isVisible(), true);
  const target = page.locator(".plus-chart-panel [data-chart-tip]").first();
  await target.hover();
  assert.equal(await page.locator("#chart-query-tooltip").isVisible(), true);
  assert.ok((await page.locator("#chart-query-tooltip").innerText()).length > 0);
  return page;
}

async function main() {
  const server = spawn("python3", ["-m", "http.server", String(port), "--bind", "127.0.0.1"], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
  let browser;
  const pages = [];
  try {
    await waitForServer(server);
    console.log(`JOURNEY_SERVER_PID=${server.pid}`);
    console.log(`JOURNEY_SERVER_ROOT=${root}`);
    console.log(`JOURNEY_SERVER_URL=${baseUrl}/index.html`);
    const browserType = browserName === "webkit" ? webkit : chromium;
    const launchOptions = { headless: true };
    const chromePath = process.env.CHROME_PATH;
    if (browserName === "chromium" && chromePath && fs.existsSync(chromePath)) launchOptions.executablePath = chromePath;
    browser = await browserType.launch(launchOptions);
    const primary = await newPage(browser);
    pages.push(primary);
    await runPrimaryJourney(primary);
    const contextPage = await newPage(browser);
    pages.push(contextPage);
    await runContextJourney(contextPage);
    const offline = await runOfflineJourney(browser);
    pages.push(offline);
    const desktop = await runChartDesktopJourney(browser);
    pages.push(desktop);
    for (const page of pages) {
      const evidence = page.__journeyEvidence;
      assert.deepEqual(evidence.consoleErrors, []);
      assert.deepEqual(evidence.pageErrors, []);
      assert.deepEqual(evidence.unexpectedRequests, []);
      await evidence.context.close();
    }
    console.log(`JOURNEY_PASS=${browserName}`, JSON.stringify({ journeys: ["quick-record", "context-retention", "calendar", "trend-settings", "ai-available", "offline", "reset-fixture", "chart-touch", "chart-hover"], consoleErrors: 0, pageErrors: 0, unexpectedRequests: 0 }));
  } finally {
    for (const page of pages) {
      try { await page.__journeyEvidence?.context.close(); } catch (_) {}
    }
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
}

main().catch((error) => { console.error(`JOURNEY_FAIL=${browserName}`, error.stack || error.message); process.exitCode = 1; });
