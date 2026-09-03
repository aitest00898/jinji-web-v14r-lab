const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { chromium, webkit } = require("@playwright/test");

const root = require("node:path").resolve(__dirname, "../..");
const browserName = process.argv.includes("--browser=webkit") ? "webkit" : "chromium";
const port = Number(process.env.REMEDIATION_PORT || (browserName === "webkit" ? 4188 : 4187));
const baseUrl = `http://127.0.0.1:${port}`;
const expectedTitle = "金雞管理中心 V14R Plus r4 Desktop v7（測試版）";
const expectedMarker = "jinji-v14r-plus-r4-desktop-v7-mobile-nav";
const overlayKey = "jinji-v14r-lab-runtime-overlay-v1";

function waitForServer(server) {
  return new Promise((resolve, reject) => {
    const timer = setInterval(async () => {
      try {
        if ((await fetch(`${baseUrl}/index.html`)).ok) {
          clearInterval(timer);
          resolve();
        }
      } catch (_) {}
    }, 80);
    server.once("error", (error) => {
      clearInterval(timer);
      reject(error);
    });
    setTimeout(() => {
      clearInterval(timer);
      reject(new Error("REMEDIATION_SERVER_TIMEOUT"));
    }, 10000);
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
  const evidence = { context, unexpectedRequests: [], consoleErrors: [], pageErrors: [] };
  page.__remediationEvidence = evidence;
  page.on("request", (request) => {
    if (!request.url().startsWith(baseUrl)) evidence.unexpectedRequests.push(request.url());
  });
  page.on("console", (message) => {
    if (message.type() === "error") evidence.consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => evidence.pageErrors.push(error.message));
  await page.goto(`${baseUrl}/index.html?remediation=${browserName}-${Date.now()}`, { waitUntil: "networkidle" });
  await assertIdentity(page);
  return page;
}

async function closeSheet(page) {
  await page.locator('button.sheet-close[data-action="close-sheet"]').click();
}

async function runMasterDataXss(browser, viewport = { width: 390, height: 844 }) {
  const page = await newPage(browser, viewport);
  const payload = '<svg onload="window.__xss=true"></svg>';
  await page.evaluate(({ key, payload }) => {
    localStorage.setItem(key, JSON.stringify({
      version: 1,
      events: [],
      pendingReviews: [],
      abnormalities: [],
      auditEntries: [],
      outbox: [],
      syncedOperationIds: [],
      settings: {},
      masterData: {
        farms: [{ id: "xss-farm", name: payload, description: payload, type: payload, subtitle: payload, breed: payload, risk: payload, stock: 0, active: true, caretakers: [], houses: [], source: "lab", createdAt: "2026-08-31T00:00:00.000Z" }],
        houses: [{ id: "xss-house", farmId: "xss-farm", name: payload, code: payload, flocks: [], source: "lab", createdAt: "2026-08-31T00:00:00.000Z" }],
        flocks: [{ id: "xss-flock", houseId: "xss-house", code: payload, chickIn: "2026-08-01", initial: 1, ship: "2026-09-06", plannedShipment: "2026-09-06", stock: 1, state: "active", status: payload, source: "lab", createdAt: "2026-08-31T00:00:00.000Z" }],
        caretakerAssignments: [{ id: "xss-assignment", farmId: "xss-farm", caretakerId: "xss-caretaker", caretakerName: payload, source: "lab", createdAt: "2026-08-31T00:00:00.000Z" }],
        financeIdentities: [{ id: "xss-finance", operationalFarmId: "xss-farm", status: "unconfigured", dataState: "no_finance_data", source: "lab", createdAt: "2026-08-31T00:00:00.000Z" }],
      },
      mode: "ONLINE",
    }));
  }, { key: overlayKey, payload });
  await page.reload({ waitUntil: "networkidle" });
  await assertIdentity(page);

  async function assertSafe(expectVisibleText = false) {
    assert.equal(await page.locator("[onload], [onerror], iframe").count(), 0);
    assert.equal(await page.evaluate(() => window.__xss === true), false);
    if (expectVisibleText) assert.ok((await page.locator("body").innerText()).includes(payload));
  }

  await assertSafe();
  const desktop = viewport.width >= 1024;
  if (!desktop) {
    await page.locator('.bottom-nav [data-nav="farms"]').click();
    await assertSafe(true);
    await page.locator('[data-action="open-farm-detail"][data-farm-id="xss-farm"]').click();
    await assertSafe(true);
    await page.locator('[data-action="open-house-detail"][data-house-id="xss-house"]').click();
    await assertSafe(true);
    await page.locator('[data-action="open-flock"][data-flock-id="xss-flock"]').click();
    await assertSafe(true);
    await closeSheet(page);
    await page.locator('[data-action="open-context"]').click();
    await assertSafe(true);
    await page.locator('[data-action="select-farm-direct"][data-farm-id="xss-farm"]').click();
    await assertSafe(true);
  } else {
    await page.locator('.desktop-nav [data-nav="farms"]').click();
    await assertSafe(true);
    await page.locator('[data-action="desktop-set-farm"][data-farm-id="xss-farm"]').click();
    await assertSafe(true);
    await page.locator('[data-action="toggle-desktop-farm-menu"]').click();
    await assertSafe(true);
  }
  return page;
}

async function runMasterDataAndCrossFarm(page) {
  assert.equal(await page.locator('.bottom-nav [data-nav]').count(), 6);
  assert.equal(await page.locator('.bottom-nav [data-nav="finance"]').count(), 0);

  await page.locator('.bottom-nav [data-nav="farms"]').click();
  await page.locator('[data-testid="master-data-entry"] [data-action="open-master-data"]').click();
  assert.equal(await page.locator('[data-testid="master-data-auth"]').count(), 1);
  assert.equal(await page.locator('input[type="password"]').count(), 0);
  await page.locator('[data-testid="authorize-master-data"]').click();
  assert.match(await page.locator('[role="alert"]').innerText(), /PREPROD LAB/);

  await page.locator('[data-testid="master-admin-confirm"]').check();
  await page.locator('[data-testid="authorize-master-data"]').click();
  assert.equal(await page.locator('[data-testid="master-data-authorized"]').count(), 1);
  assert.match(await page.locator(".sheet-panel").innerText(), /fixture 本身維持唯讀/);

  await page.locator('[data-testid="master-farm-name"]').fill("Phase 3 測試場");
  await page.locator("#master-farm-type").fill("紅羽");
  await page.locator("#master-farm-description").fill("Phase 3 synthetic master data");
  await page.locator('[data-testid="create-farm"]').click();
  const newFarmId = await page.locator('[data-testid="master-farm-select"]').inputValue();
  assert.match(newFarmId, /^lab-farm-/);
  await page.locator('[data-testid="master-farm-select"] option').filter({ hasText: "Phase 3 測試場" }).waitFor({ state: "attached" });
  assert.match(await page.locator(".sheet-panel").innerText(), /Finance identity 已建立/);

  await page.locator('[data-testid="master-house-name"]').fill("Phase 3 一舍");
  await page.locator('[data-testid="master-house-code"]').fill("P3-H1");
  await page.locator('[data-testid="create-house"]').click();
  await page.waitForFunction(() => document.querySelectorAll('[data-testid="master-house-select"] option').length === 1);
  assert.equal(await page.locator('[data-testid="master-house-select"] option').count(), 1);

  await page.locator('[data-testid="master-flock-code"]').fill("P3-001");
  await page.locator('[data-testid="master-flock-initial"]').fill("100");
  await page.locator('[data-testid="master-flock-chick-in"]').fill("2026-09-01");
  await page.locator('[data-testid="master-flock-ship"]').fill("2026-09-06");
  await page.locator("#master-flock-male").fill("40");
  await page.locator("#master-flock-female").fill("60");
  await page.locator('[data-testid="create-flock"]').click();
  assert.equal(await page.locator('[data-testid="master-flock-row"]').count(), 1);
  assert.match(await page.locator('[data-testid="master-flock-row"]').innerText(), /公 40／母 60/);

  await page.locator('[data-testid="master-house-name"]').fill("Phase 3 二舍");
  await page.locator('[data-testid="master-house-code"]').fill("P3-H2");
  await page.locator('[data-testid="create-house"]').click();
  await page.waitForFunction(() => document.querySelectorAll('[data-testid="master-house-select"] option').length === 2);
  assert.equal(await page.locator('[data-testid="master-house-select"] option').count(), 2);
  await page.locator('[data-testid="master-flock-code"]').fill("P3-002");
  await page.locator('[data-testid="master-flock-initial"]').fill("50");
  await page.locator('[data-testid="master-flock-chick-in"]').fill("2026-09-02");
  await page.locator('[data-testid="master-flock-ship"]').fill("2026-09-21");
  await page.locator('#master-flock-male').fill("");
  await page.locator('#master-flock-female').fill("");
  await page.locator('[data-testid="create-flock"]').click();
  const secondFlockRows = await page.locator('[data-testid="master-flock-row"]').count();
  assert.equal(secondFlockRows, 1, await page.locator(".sheet-panel").innerText());
  assert.match(await page.locator(".sheet-panel").innerText(), /公母數未提供/);
  await page.locator('[data-testid="master-house-select"]').selectOption({ label: "Phase 3 一舍 · P3-H1" });
  assert.equal(await page.locator('[data-testid="master-flock-row"]').count(), 1);
  assert.match(await page.locator('[data-testid="master-flock-row"]').innerText(), /P3-001/);
  assert.match(await page.locator('[data-testid="master-flock-row"]').innerText(), /公 40／母 60/);
  await page.locator('[data-testid="master-house-select"]').selectOption({ label: "Phase 3 二舍 · P3-H2" });

  await page.locator('[data-testid="master-caretaker-name"]').fill("Phase 3 照顧者");
  await page.locator('[data-testid="assign-caretaker"]').click();
  assert.match(await page.locator(".sheet-panel").innerText(), /已指派照顧者：Phase 3 照顧者/);
  assert.ok((await page.locator(".master-list-row").count()) >= 5);

  const overlay = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), overlayKey);
  assert.deepEqual(Object.fromEntries(Object.entries(overlay.masterData).map(([key, rows]) => [key, rows.length])), {
    farms: 1,
    houses: 2,
    flocks: 2,
    caretakerAssignments: 1,
    financeIdentities: 1,
  });
  assert.equal(overlay.events.length, 0);
  assert.equal(overlay.outbox.length, 0);
  assert.equal(await page.evaluate(() => window.JinjiLabFixture.farms.some((farm) => farm.id.startsWith("lab-farm-"))), false);
  assert.equal(await page.evaluate(() => window.JinjiLabFixture.farms.filter((farm) => farm.id !== "all").length), 8);

  const identityId = overlay.masterData.financeIdentities[0].id;
  await closeSheet(page);
  const newFarmButton = page.locator(`[data-action="open-farm-detail"][data-farm-id="${newFarmId}"]`);
  assert.equal(await newFarmButton.count(), 1);
  assert.match(await newFarmButton.innerText(), /Phase 3 測試場/);
  assert.match(await newFarmButton.innerText(), /150/);
  await newFarmButton.click();
  const farmDetail = await page.locator(".sheet-panel").innerText();
  assert.match(farmDetail, /Phase 3 一舍/);
  assert.match(farmDetail, /Phase 3 二舍/);
  assert.equal(await page.locator('[data-testid="farm-finance-entry"]').getAttribute("data-farm-id"), identityId);
  await page.locator('[data-testid="farm-finance-entry"]').click();
  const identityDetail = await page.locator(".sheet-panel").innerText();
  assert.match(identityDetail, /尚未建立財務資料/);
  assert.match(identityDetail, /未配置/);
  assert.match(identityDetail, new RegExp(`operationalFarmId=${newFarmId}`));
  assert.doesNotMatch(identityDetail, /歷史總盈虧|已配置盈虧|費用明細/);
  await closeSheet(page);

  await page.locator('[data-action="open-context"]').click();
  await page.locator(`[data-action="select-farm-direct"][data-farm-id="${newFarmId}"]`).click();
  await page.locator('.bottom-nav [data-nav="more"]').click();
  await page.locator('[data-testid="finance-entry"]').click();
  await page.locator('[data-page="finance"]').waitFor();
  assert.match(await page.locator('[data-page="finance"]').innerText(), /尚未建立財務資料/);
  assert.equal(await page.locator('[data-testid="finance-net"]').innerText(), "—");
  assert.deepEqual(await page.locator('.finance-kpi strong').allTextContents(), ["—", "—", "—", "—"]);
  assert.equal(await page.locator('[data-testid="finance-chart-empty"]').count(), 1);
  await page.locator('[data-action="open-context"]').click();
  await page.locator('[data-action="select-farm-direct"][data-farm-id="all"]').click();

  await page.locator('.bottom-nav [data-nav="calendar"]').click();
  const septemberCell = page.locator('.calendar-cell[data-date="2026-09-01"]');
  assert.equal(await septemberCell.count(), 1, await page.locator(".calendar-title-block h1").innerText());
  await septemberCell.click();
  const calendarText = await page.locator(".calendar-detail-panel").innerText();
  assert.match(calendarText, /Phase 3 測試場/);
  assert.match(calendarText, /P3-001/);
  assert.match(calendarText, /入雛 100 隻/);
  assert.match(calendarText, /公 40 隻/);

  await page.locator('.bottom-nav [data-nav="records"]').click();
  assert.equal(await page.locator('[data-testid="records-cross-farm-analysis"]').count(), 1);
  assert.match(await page.locator('[data-testid="records-cross-farm-analysis"]').innerText(), /今日死亡最高/);
  assert.match(await page.locator(".context-hub").innerText(), /全部在養/);
  await page.locator('[data-action="records-farm-filter"][data-records-farm-id="red"]').click();
  assert.match(await page.locator('[data-testid="records-cross-farm-analysis"]').innerText(), /目前局部分析：稽核紅羽一場/);
  assert.match(await page.locator(".context-hub").innerText(), /全部在養/);
  assert.match(await page.locator(".records-scope-note").innerText(), /局部篩選不會改變/);

  await page.locator('.bottom-nav [data-nav="todo"]').click();
  assert.match(await page.locator('[data-page="todo"]').innerText(), /P3-001/);

  return { newFarmId, identityId };
}

async function runCorrection(page) {
  async function quickRecord(text) {
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

  await quickRecord("死亡5");
  await page.locator('.bottom-nav [data-nav="records"]').click();
  const candidates = page.locator('.list-row[data-action="open-event"]').filter({ hasText: "死亡 5 隻" });
  let foundLabEvent = false;
  for (let index = 0; index < await candidates.count(); index += 1) {
    await candidates.nth(index).click();
    if (await page.locator('[data-action="open-correction"]').count()) {
      foundLabEvent = true;
      break;
    }
    await closeSheet(page);
  }
  assert.equal(foundLabEvent, true);
  assert.match(await page.locator(".sheet-panel").innerText(), /原紀錄只能保留/);
  await page.locator('[data-action="open-correction"]').waitFor({ state: "visible" });
  await page.waitForTimeout(350);
  await page.locator('[data-action="open-correction"]').click({ force: true });
  const correctionText = await page.locator(".sheet-panel").innerText();
  assert.match(correctionText, /修正紀錄/);
  assert.match(correctionText, /原紀錄會保留，系統會新增一筆修正紀錄。/);
  assert.equal(await page.locator('[data-action="commit-correction"]').innerText(), "新增修正紀錄");
  await page.locator("#correction-qty").fill("2");
  await page.locator('[data-action="commit-correction"]').click();
  await page.locator('.bottom-nav [data-nav="more"]').click();
  await page.locator('[data-action="open-sheet"][data-sheet-kind="audit"]').click();
  const auditText = await page.locator(".sheet-panel").innerText();
  assert.match(auditText, /修正紀錄/);
  assert.match(auditText, /原紀錄仍保留|變更紀錄只保留事件/);
}

async function runFinanceTrace(page) {
  assert.equal(await page.locator('.bottom-nav [data-nav="finance"]').count(), 0);
  await page.locator('.bottom-nav [data-nav="more"]').click();
  assert.equal(await page.locator('[data-testid="finance-entry"]').count(), 1);
  assert.match(await page.locator('[data-testid="finance-entry"]').innerText(), /手機從更多進入/);
  await page.locator('[data-testid="finance-entry"]').click();
  await page.locator('[data-page="finance"]').waitFor();
  await page.locator('[data-finance-tab="distributions"]').click();
  await page.locator('[data-action="open-distribution-detail"][data-distribution-id="syn-distribution-01"]').click();
  assert.equal(await page.locator('[data-testid="finance-trace"]').count(), 1);
  assert.equal(await page.locator('[data-testid="finance-trace-row"]').count(), 3);
  const traceText = await page.locator('[data-testid="finance-trace"]').innerText();
  assert.match(traceText, /ProfitDistributionAllocation ID：syn-/);
  assert.match(traceText, /investorId=syn-investor-/);
  assert.match(traceText, /distributionId=syn-distribution-01/);
  assert.match(traceText, /farmId=syn-farm-a/);
  assert.match(await page.locator(".sheet-panel").innerText(), /operationalFarmId=red/);
}

async function runDesktopDiscoverability(page) {
  assert.equal(await page.locator(".desktop-sidebar").isVisible(), true);
  assert.equal(await page.locator('.desktop-nav [data-nav="finance"]').count(), 1);
  assert.match(await page.locator(".desktop-sidebar").innerText(), /財務/);
  assert.equal(await page.locator(".bottom-nav").isVisible(), false);
  await page.locator('.desktop-nav [data-nav="finance"]').click();
  await page.locator('[data-page="finance"]').waitFor();
  assert.equal(await page.locator(".desktop-finance-tabs").count(), 1);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
}

async function main() {
  const server = spawn("python3", ["-m", "http.server", String(port), "--bind", "127.0.0.1"], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
  let browser;
  const pages = [];
  try {
    await waitForServer(server);
    console.log(`REMEDIATION_SERVER_PID=${server.pid}`);
    console.log(`REMEDIATION_SERVER_ROOT=${root}`);
    console.log(`REMEDIATION_SERVER_URL=${baseUrl}/index.html`);
    const browserType = browserName === "webkit" ? webkit : chromium;
    const launchOptions = { headless: true };
    const chromePath = process.env.CHROME_PATH;
    if (browserName === "chromium" && chromePath) launchOptions.executablePath = chromePath;
    browser = await browserType.launch(launchOptions);

    const masterPage = await newPage(browser);
    pages.push(masterPage);
    pages.push(await runMasterDataXss(browser));
    pages.push(await runMasterDataXss(browser, { width: 1440, height: 900 }));
    await runMasterDataAndCrossFarm(masterPage);

    const correctionPage = await newPage(browser);
    pages.push(correctionPage);
    await runCorrection(correctionPage);

    const financePage = await newPage(browser);
    pages.push(financePage);
    await runFinanceTrace(financePage);

    const desktopPage = await newPage(browser, { width: 1440, height: 900 });
    pages.push(desktopPage);
    await runDesktopDiscoverability(desktopPage);

    for (const page of pages) {
      const evidence = page.__remediationEvidence;
      assert.deepEqual(evidence.consoleErrors, []);
      assert.deepEqual(evidence.pageErrors, []);
      assert.deepEqual(evidence.unexpectedRequests, []);
      await evidence.context.close();
    }
    console.log(`REMEDIATION_PASS=${browserName}`, JSON.stringify({
      repairs: ["R1-master-data", "R2-finance-trace", "R3-correction", "R4-records-cross-farm", "R5-finance-discoverability"],
      browsers: [browserName],
      consoleErrors: 0,
      pageErrors: 0,
      unexpectedRequests: 0,
    }));
  } finally {
    for (const page of pages) {
      try { await page.__remediationEvidence?.context.close(); } catch (_) {}
    }
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(`REMEDIATION_FAIL=${browserName}`, error.stack || error.message);
  process.exitCode = 1;
});
