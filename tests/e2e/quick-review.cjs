const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { chromium, webkit } = require("@playwright/test");

const path = require("node:path");
const root = path.resolve(__dirname, "../..");
const browserName = process.argv.includes("--browser=webkit") ? "webkit" : "chromium";
const port = Number(process.env.QUICK_REVIEW_PORT || (browserName === "webkit" ? 4196 : 4195));
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
    server.once("error", (error) => { clearInterval(timer); reject(error); });
    setTimeout(() => { clearInterval(timer); reject(new Error("QUICK_REVIEW_SERVER_TIMEOUT")); }, 10000);
  });
}

async function assertIdentity(page) {
  // Required first assertion: browser target identity.
  assert.equal(await page.evaluate("document.documentElement.dataset.appId"), "jinji-web-v14r-lab");
  assert.equal(await page.title(), expectedTitle);
  assert.equal(await page.locator("html").getAttribute("data-build-marker"), expectedMarker);
}

async function readOverlay(page) {
  return page.evaluate((key) => JSON.parse(localStorage.getItem(key) || "null"), overlayKey);
}

async function openQuickRecord(page) {
  await page.locator(".mobile-quick-button").click();
  if (await page.locator('[data-action="start-quick-record-farm"]').count()) {
    await page.locator('[data-action="start-quick-record-farm"][data-farm-id="red"]').click();
  } else {
    await page.locator('[data-action="open-quick-record"]').click();
  }
}

async function chooseDeath(page, quantity) {
  await page.locator('[data-testid="quick-record-chip-mortality"]').click();
  await page.locator("#quick-record-quantity").fill(String(quantity));
  await page.locator('[data-action="apply-quick-quantity"]').click();
}

async function main() {
  const server = spawn("python3", ["-m", "http.server", String(port), "--bind", "127.0.0.1"], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
  let browser;
  let context;
  try {
    await waitForServer(server);
    console.log(`QUICK_REVIEW_SERVER_PID=${server.pid}`);
    console.log(`QUICK_REVIEW_SERVER_ROOT=${root}`);
    console.log(`QUICK_REVIEW_SERVER_URL=${baseUrl}/index.html`);
    browser = await (browserName === "webkit" ? webkit : chromium).launch({ headless: true });
    context = await browser.newContext({ viewport: { width: 390, height: 844 }, timezoneId: "Asia/Taipei" });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const unexpectedRequests = [];
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("request", (request) => { if (!request.url().startsWith(baseUrl)) unexpectedRequests.push(request.url()); });
    await page.goto(`${baseUrl}/index.html?quick-review=${browserName}&test-date=2026-09-04`, { waitUntil: "networkidle" });
    await assertIdentity(page);

    assert.equal(await page.locator('[data-action="open-sheet"][data-sheet-kind="quick-actions"]').count(), 1);
    await openQuickRecord(page);
    assert.deepEqual(await page.locator(".quick-record-chip").allTextContents(), ["死亡", "咳嗽", "臭腳", "白冠", "緊迫"]);

    // Death is a quantitative event: all missing, negative and decimal input is blocked.
    await page.locator('[data-testid="quick-record-chip-mortality"]').click();
    await page.locator('[data-action="apply-quick-quantity"]').click();
    assert.match(await page.locator('[data-testid="quick-record-quantity-step"] [role="alert"]').innerText(), /正整數/);
    await page.locator("#quick-record-quantity").fill("-1");
    await page.locator('[data-action="apply-quick-quantity"]').click();
    assert.match(await page.locator('[data-testid="quick-record-quantity-step"] [role="alert"]').innerText(), /正整數/);
    await page.locator("#quick-record-quantity").fill("1.5");
    await page.locator('[data-action="apply-quick-quantity"]').click();
    assert.match(await page.locator('[data-testid="quick-record-quantity-step"] [role="alert"]').innerText(), /正整數/);
    await page.locator("#quick-record-quantity").fill("3");
    await page.locator('[data-action="apply-quick-quantity"]').click();
    assert.equal(await page.locator('[data-action="commit-lab-event"]').count(), 1);

    // Farm-only scope must be confirmed before any business write; cancel is a no-op.
    const beforeScopeCancel = await readOverlay(page);
    await page.locator('[data-action="commit-lab-event"]').click();
    assert.match(await page.locator('[data-sheet-kind="quick-record-scope"]').innerText(), /套用整場/);
    assert.match(await page.locator('[data-sheet-kind="quick-record-scope"]').innerText(), /選擇雞舍/);
    assert.match(await page.locator('[data-sheet-kind="quick-record-scope"]').innerText(), /取消/);
    await page.locator('[data-action="cancel-quick-record-scope"]').click();
    assert.deepEqual(await readOverlay(page), beforeScopeCancel);

    // Explicit house selection keeps the flock unset instead of silently selecting one.
    await openQuickRecord(page);
    await chooseDeath(page, 3);
    await page.locator('[data-action="commit-lab-event"]').click();
    await page.locator('[data-action="select-house-for-quick-record"][data-house-id="red-1"]').click();
    assert.match(await page.locator(".sheet-panel").innerText(), /本舍，不指定批次/);
    await page.locator('[data-action="commit-lab-event"]').click();
    const eventOverlay = await readOverlay(page);
    const createdEvent = eventOverlay.events.at(-1);
    assert.equal(createdEvent.type, "mortality");
    assert.equal(createdEvent.quantity, 3);
    assert.equal(createdEvent.farmId, "red");
    assert.equal(createdEvent.houseId, "red-1");
    assert.equal(createdEvent.flockId, null);
    assert.equal(createdEvent.scopeSelection, "house");

    // Qualitative chips require an extent and never enter numeric mortality statistics.
    const mortalityCountBeforeObservation = eventOverlay.events.filter((row) => row.type === "mortality").length;
    await openQuickRecord(page);
    await page.locator('[data-testid="quick-record-chip-foot-odor"]').click();
    assert.equal(await page.locator('[data-testid="quick-record-extent-step"]').count(), 1);
    await page.locator('[data-action="quick-extent"][data-extent="large"]').click();
    assert.match(await page.locator(".sheet-panel").innerText(), /臭腳｜大範圍/);
    await page.locator('[data-action="commit-observation"]').click();
    const observationOverlay = await readOverlay(page);
    assert.equal(observationOverlay.events.filter((row) => row.type === "mortality").length, mortalityCountBeforeObservation);
    const createdObservation = observationOverlay.observations.at(-1);
    assert.equal(createdObservation.text, "臭腳");
    assert.equal(createdObservation.extent, "large");
    assert.equal(Object.prototype.hasOwnProperty.call(createdObservation, "quantity"), false);

    // Natural-language semantics guide known terms instead of silently routing them to Pending Review.
    await openQuickRecord(page);
    await page.locator("#quick-record-input").fill("死亡");
    await page.locator('[data-action="preview-quick-record"]').click();
    assert.equal(await page.locator('[data-testid="quick-record-quantity-step"]').count(), 1);
    await page.locator("#quick-record-quantity").fill("2");
    await page.locator('[data-action="apply-quick-quantity"]').click();
    await page.locator('[data-action="commit-lab-event"]').click();
    const naturalEventOverlay = await readOverlay(page);
    assert.equal(naturalEventOverlay.events.at(-1).quantity, 2);

    // Unknown semantics become a real Pending Review, then approval creates a linked observation atomically.
    await openQuickRecord(page);
    await page.locator("#quick-record-input").fill("今天狀況怪怪的");
    await page.locator('[data-action="preview-quick-record"]').click();
    assert.match(await page.locator(".sheet-panel").innerText(), /待人工確認/);
    await page.locator('[data-action="save-pending-review"]').click();
    await page.locator('.bottom-nav [data-nav="todo"]').click();
    const pendingRow = page.locator('.list-row[data-action="open-pending-item"]').filter({ hasText: "快速記錄待人工確認" });
    assert.equal(await pendingRow.count(), 1);
    await pendingRow.click();
    const pendingDetail = await page.locator(".sheet-panel").innerText();
    assert.match(pendingDetail, /今天狀況怪怪的/);
    assert.match(pendingDetail, /稽核紅羽一場 \/ 紅羽一舍/);
    assert.match(pendingDetail, /處理原因/);
    assert.match(pendingDetail, /quick_record/);
    assert.match(pendingDetail, /20\d\d-/);
    const pendingId = await page.locator('[data-action="start-pending-approval"]').getAttribute("data-pending-id");
    await page.locator('[data-action="start-pending-approval"]').click();
    assert.equal(await page.locator('[data-testid="pending-approval-raw"]').innerText(), "今天狀況怪怪的");
    await page.locator('[data-action="pending-observation-extent"][data-extent="medium"]').click();
    await page.locator('[data-action="approve-pending-review"][data-pending-id="' + pendingId + '"]').click();
    const approvedOverlay = await readOverlay(page);
    const resolution = approvedOverlay.pendingResolutions.find((row) => row.pendingReviewId === pendingId);
    assert.equal(resolution.status, "approved");
    const linkedObservation = approvedOverlay.observations.find((row) => row.pendingReviewId === pendingId);
    assert.equal(linkedObservation.text, "咳嗽");
    assert.equal(linkedObservation.extent, "medium");
    assert.equal(linkedObservation.rawText, "今天狀況怪怪的");
    assert.equal(approvedOverlay.auditEntries.some((entry) => entry.metadata?.pendingReviewId === pendingId), true);
    // ONLINE mock sync drains the outbox immediately; the synced operation id
    // proves the approval passed through the same atomic outbox boundary.
    assert.equal(approvedOverlay.syncedOperationIds.some((operationId) => operationId.startsWith("pending-approval-")), true);
    await page.locator('.bottom-nav [data-nav="todo"]').click();
    assert.equal(await page.locator('.list-row[data-action="open-pending-item"]').filter({ hasText: "快速記錄待人工確認" }).count(), 0);

    // Dynamic viewing date: the seven-day window follows the injected Asia/Taipei test date.
    await page.goto(`${baseUrl}/index.html?quick-review-date=${browserName}&test-date=2026-09-04`, { waitUntil: "networkidle" });
    await assertIdentity(page);
    assert.match(await page.locator(".today-date").innerText(), /9 月 4 日/);
    await page.locator('[data-action="chart-tab"][data-chart-tab="events"]').click();
    let dateTips = await page.locator(".plus-event-day").evaluateAll((nodes) => nodes.map((node) => node.dataset.chartTip));
    assert.equal(dateTips.some((tip) => tip.startsWith("2026-08-29")), true);
    assert.equal(dateTips.some((tip) => tip.startsWith("2026-09-04")), true);
    assert.equal(dateTips.some((tip) => tip.startsWith("2026-09-05")), false);
    await page.goto(`${baseUrl}/index.html?quick-review-date=${browserName}&test-date=2026-09-05`, { waitUntil: "networkidle" });
    assert.match(await page.locator(".today-date").innerText(), /9 月 5 日/);
    await page.locator('[data-action="chart-tab"][data-chart-tab="events"]').click();
    dateTips = await page.locator(".plus-event-day").evaluateAll((nodes) => nodes.map((node) => node.dataset.chartTip));
    assert.equal(dateTips.some((tip) => tip.startsWith("2026-08-30")), true);
    assert.equal(dateTips.some((tip) => tip.startsWith("2026-09-05")), true);
    await page.locator('.bottom-nav [data-nav="records"]').click();
    assert.equal(await page.locator(".list-row").filter({ hasText: "2026-08-31" }).count() > 0, true);

    assert.deepEqual(consoleErrors, []);
    assert.deepEqual(pageErrors, []);
    assert.deepEqual(unexpectedRequests, []);
    console.log(`QUICK_REVIEW_PASS=${browserName}`, JSON.stringify({ browser: browserName, consoleErrors: 0, pageErrors: 0, unexpectedRequests: 0, dateSemantics: "PASS", pendingApproval: "PASS" }));
  } finally {
    if (context) await context.close().catch(() => {});
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
}

main().catch((error) => { console.error(`QUICK_REVIEW_FAIL=${browserName}`, error.stack || error.message); process.exitCode = 1; });
