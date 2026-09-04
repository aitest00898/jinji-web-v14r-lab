const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { chromium, webkit } = require("@playwright/test");

const root = require("node:path").resolve(__dirname, "../..");
const browserName = process.argv.includes("--browser=webkit") ? "webkit" : "chromium";
const port = Number(process.env.FINAL_REMEDIATION_PORT || (browserName === "webkit" ? 4194 : 4193));
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
      reject(new Error("FINAL_REMEDIATION_SERVER_TIMEOUT"));
    }, 10000);
  });
}

async function assertIdentity(page) {
  // The first browser assertion is the prototype identity marker.
  assert.equal(await page.evaluate("document.documentElement.dataset.appId"), "jinji-web-v14r-lab");
  assert.equal(await page.title(), expectedTitle);
  assert.equal(await page.locator("html").getAttribute("data-build-marker"), expectedMarker);
}

async function readOverlay(page) {
  return page.evaluate((key) => JSON.parse(localStorage.getItem(key) || "null"), overlayKey);
}

async function openMasterData(page) {
  await page.locator('.bottom-nav [data-nav="farms"]').click();
  await page.locator('[data-testid="master-data-entry"] [data-action="open-master-data"]').click();
  await page.locator('[data-testid="master-admin-confirm"]').check();
  await page.locator('[data-testid="authorize-master-data"]').click();
  await page.locator('[data-testid="master-data-authorized"]').waitFor();
}

async function cancelWithoutWrite(page, prepare, expectedText) {
  const before = await readOverlay(page);
  await prepare();
  const confirmation = page.locator('[data-testid="master-final-confirmation"]');
  await confirmation.waitFor();
  if (expectedText) assert.match(await confirmation.innerText(), expectedText);
  await page.locator('[data-testid="master-final-confirmation-cancel"]').click();
  assert.equal(await page.locator('[data-testid="master-final-confirmation"]').count(), 0);
  assert.deepEqual(await readOverlay(page), before);
}

async function confirmOperation(page, prepare, expectedText) {
  await prepare();
  const confirmation = page.locator('[data-testid="master-final-confirmation"]');
  await confirmation.waitFor();
  if (expectedText) assert.match(await confirmation.innerText(), expectedText);
  await page.locator('[data-testid="master-final-confirmation-confirm"]').click();
  await page.locator('[data-testid="master-data-authorized"]').waitFor();
}

async function main() {
  const server = spawn("python3", ["-m", "http.server", String(port), "--bind", "127.0.0.1"], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
  let browser;
  let context;
  try {
    await waitForServer(server);
    console.log(`FINAL_REMEDIATION_SERVER_PID=${server.pid}`);
    console.log(`FINAL_REMEDIATION_SERVER_ROOT=${root}`);
    console.log(`FINAL_REMEDIATION_SERVER_URL=${baseUrl}/index.html`);
    const browserType = browserName === "webkit" ? webkit : chromium;
    const launchOptions = { headless: true };
    if (browserName === "chromium" && process.env.CHROME_PATH) launchOptions.executablePath = process.env.CHROME_PATH;
    browser = await browserType.launch(launchOptions);
    context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const unexpectedRequests = [];
    const consoleErrors = [];
    const pageErrors = [];
    page.on("request", (request) => { if (!request.url().startsWith(baseUrl)) unexpectedRequests.push(request.url()); });
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto(`${baseUrl}/index.html?final-remediation=${browserName}&test-date=2026-08-31`, { waitUntil: "networkidle" });
    await assertIdentity(page);

    await openMasterData(page);

    await page.locator('[data-testid="master-farm-name"]').fill("Final Gate 測試場");
    await page.locator("#master-farm-type").fill("紅羽");
    await page.locator("#master-farm-description").fill("final forensic remediation");
    await cancelWithoutWrite(page, () => page.locator('[data-testid="create-farm"]').click(), /Final Gate 測試場|Finance identity/);
    await page.locator('[data-testid="master-farm-name"]').fill("Final Gate 測試場");
    await page.locator("#master-farm-type").fill("紅羽");
    await page.locator("#master-farm-description").fill("final forensic remediation");
    await confirmOperation(page, () => page.locator('[data-testid="create-farm"]').click(), /Final Gate 測試場|Finance identity/);
    const farmId = await page.locator('[data-testid="master-farm-select"]').inputValue();
    assert.match(farmId, /^lab-farm-/);
    assert.match(await page.locator('[data-testid="master-farm-select"]').innerText(), /Final Gate 測試場/);

    await page.locator('[data-testid="master-house-name"]').fill("Final Gate 一舍");
    await page.locator('[data-testid="master-house-code"]').fill("FG-H1");
    await cancelWithoutWrite(page, () => page.locator('[data-testid="create-house"]').click(), /Final Gate 一舍|FG-H1/);
    await page.locator('[data-testid="master-house-name"]').fill("Final Gate 一舍");
    await page.locator('[data-testid="master-house-code"]').fill("FG-H1");
    await confirmOperation(page, () => page.locator('[data-testid="create-house"]').click(), /Final Gate 一舍|FG-H1/);
    await page.locator('[data-testid="master-house-select"] option').filter({ hasText: "Final Gate 一舍" }).waitFor({ state: "attached" });
    const houseId = await page.locator('[data-testid="master-house-select"]').inputValue();
    assert.match(houseId, /^lab-house-/);

    const fillActiveFlock = async () => {
      await page.locator('[data-testid="master-flock-code"]').fill("FINAL-ACTIVE");
      await page.locator('[data-testid="master-flock-initial"]').fill("100");
      await page.locator('[data-testid="master-flock-chick-in"]').fill("2026-09-01");
      await page.locator('[data-testid="master-flock-ship"]').fill("2026-09-06");
      await page.locator("#master-flock-male").fill("40");
      await page.locator("#master-flock-female").fill("60");
      await page.locator('[data-testid="master-flock-state"]').selectOption("active");
    };
    await fillActiveFlock();
    await cancelWithoutWrite(page, () => page.locator('[data-testid="create-flock"]').click(), /FINAL-ACTIVE|進行中|100/);
    await fillActiveFlock();
    await confirmOperation(page, () => page.locator('[data-testid="create-flock"]').click(), /FINAL-ACTIVE|進行中|公 40|母 60/);

    const fillClosedFlock = async () => {
      await page.locator('[data-testid="master-flock-code"]').fill("FINAL-CLOSED");
      await page.locator('[data-testid="master-flock-initial"]').fill("50");
      await page.locator('[data-testid="master-flock-chick-in"]').fill("2026-09-01");
      await page.locator('[data-testid="master-flock-ship"]').fill("2026-09-20");
      await page.locator("#master-flock-male").fill("");
      await page.locator("#master-flock-female").fill("");
      await page.locator('[data-testid="master-flock-state"]').selectOption("closed");
    };
    await fillClosedFlock();
    await confirmOperation(page, () => page.locator('[data-testid="create-flock"]').click(), /FINAL-CLOSED|已出雞/);
    assert.match(await page.locator('[data-testid="master-flock-row"]').allTextContents().then((rows) => rows.join("\n")), /FINAL-CLOSED[\s\S]*已出雞/);

    await page.locator('[data-testid="master-caretaker-name"]').fill("Final Gate 照顧者");
    await cancelWithoutWrite(page, () => page.locator('[data-testid="assign-caretaker"]').click(), /Final Gate 照顧者|指派/);
    await page.locator('[data-testid="master-caretaker-name"]').fill("Final Gate 照顧者");
    await confirmOperation(page, () => page.locator('[data-testid="assign-caretaker"]').click(), /Final Gate 照顧者|指派/);

    const overlay = await readOverlay(page);
    assert.deepEqual(Object.fromEntries(Object.entries(overlay.masterData).map(([key, rows]) => [key, rows.length])), {
      farms: 1,
      houses: 1,
      flocks: 2,
      caretakerAssignments: 1,
      financeIdentities: 1,
    });
    assert.equal(overlay.masterData.flocks.find((flock) => flock.code === "FINAL-ACTIVE").state, "active");
    assert.equal(overlay.masterData.flocks.find((flock) => flock.code === "FINAL-CLOSED").state, "closed");
    assert.equal(overlay.outbox.length, 0);
    assert.ok(overlay.auditEntries.length >= 6);

    await page.reload({ waitUntil: "networkidle" });
    await assertIdentity(page);
    await openMasterData(page);
    await page.locator('[data-testid="master-farm-select"]').selectOption(farmId);
    await page.locator('[data-testid="master-house-select"]').selectOption(houseId);
    assert.match(await page.locator('[data-testid="master-flock-row"]').allTextContents().then((rows) => rows.join("\n")), /FINAL-CLOSED[\s\S]*已出雞/);
    await page.locator('button.sheet-close[data-action="close-sheet"]').click();
    await page.locator('.bottom-nav [data-nav="todo"]').click();
    assert.doesNotMatch(await page.locator('[data-page="todo"]').innerText(), /FINAL-CLOSED/);
    await page.locator('.bottom-nav [data-nav="farms"]').click();
    await page.locator(`[data-action="open-farm-detail"][data-farm-id="${farmId}"]`).click();
    await page.locator(`[data-action="open-house-detail"][data-house-id="${houseId}"]`).click();
    assert.match(await page.locator(".sheet-panel").innerText(), /FINAL-CLOSED/);
    assert.match(await page.locator(".sheet-panel").innerText(), /已出雞/);

    assert.deepEqual(consoleErrors, []);
    assert.deepEqual(pageErrors, []);
    assert.deepEqual(unexpectedRequests, []);
    console.log(`FINAL_REMEDIATION_PASS=${browserName}`, JSON.stringify({
      finalConfirmation: { farm: true, house: true, flock: true, caretaker: true, cancelZeroWrite: true },
      flockState: { active: true, closed: true, persisted: true, excludedFromActiveTodo: true },
      relationshipBoundary: "covered by integration tests",
      consoleErrors: 0,
      pageErrors: 0,
      unexpectedRequests: 0,
    }));
  } finally {
    if (context) await context.close();
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(`FINAL_REMEDIATION_FAIL=${browserName}`, error.stack || error.message);
  process.exitCode = 1;
});
