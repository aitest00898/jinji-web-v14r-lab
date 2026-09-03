const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { chromium, webkit } = require("@playwright/test");

const root = path.resolve(__dirname, "../..");
const resultsDir = path.join(root, "test-results", "screenshots");
const browserName = process.argv.includes("--browser=webkit") ? "webkit" : "chromium";
const port = Number(process.env.TEST_PORT || 4181);
const baseUrl = `http://127.0.0.1:${port}`;
const expectedTitle = "金雞管理中心 V14R Plus r4 Desktop v7（測試版）";
const expectedMarker = "jinji-v14r-plus-r4-desktop-v7-mobile-nav";

function waitForServer(server) {
  return new Promise((resolve, reject) => {
    const timer = setInterval(async () => {
      try {
        const response = await fetch(`${baseUrl}/index.html`);
        if (response.ok) { clearInterval(timer); resolve(); }
      } catch (_) {}
    }, 80);
    server.once("error", (error) => { clearInterval(timer); reject(error); });
    setTimeout(() => { clearInterval(timer); reject(new Error("TEST_SERVER_TIMEOUT")); }, 10000);
  });
}

async function main() {
  fs.mkdirSync(resultsDir, { recursive: true });
  const server = spawn("python3", ["-m", "http.server", String(port), "--bind", "127.0.0.1"], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
  let browser;
  try {
    await waitForServer(server);
    console.log(`SERVER_PID=${server.pid}`);
    console.log(`SERVER_ROOT=${root}`);
    console.log(`SERVER_URL=${baseUrl}/index.html`);
    const executablePath = process.env.CHROME_PATH;
    const launchOptions = { headless: true };
    if (browserName === "chromium" && executablePath && fs.existsSync(executablePath)) launchOptions.executablePath = executablePath;
    browser = await (browserName === "webkit" ? webkit : chromium).launch(launchOptions);
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const unexpectedRequests = [];
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("request", (request) => { if (!request.url().startsWith(baseUrl)) unexpectedRequests.push(request.url()); });
    await page.goto(`${baseUrl}/index.html?e2e=${browserName}`, { waitUntil: "networkidle" });

    // Required first assertion: browser target identity.
    assert.equal(await page.evaluate("document.documentElement.dataset.appId"), "jinji-web-v14r-lab");
    assert.equal(await page.title(), expectedTitle);
    assert.equal(await page.locator("html").getAttribute("data-build-marker"), expectedMarker);
    assert.equal(await page.locator(".bottom-nav button").count(), 6);
    assert.equal(await page.locator(".mobile-quick-slot").count(), 1);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.equal(await page.locator('meta[name="viewport"]').getAttribute("content"), "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover");
    const mobileViewportBeforeFocus = await page.evaluate(() => ({
      innerWidth,
      innerHeight,
      scrollX,
      scrollY,
      visualViewport: visualViewport ? { width: visualViewport.width, height: visualViewport.height, scale: visualViewport.scale, offsetLeft: visualViewport.offsetLeft, offsetTop: visualViewport.offsetTop } : null,
    }));
    await page.locator(".mobile-quick-button").click();
    await page.locator('[data-action="start-quick-record-farm"][data-farm-id="red"]').click();
    const quickInput = page.locator("#quick-record-input");
    assert.equal(await quickInput.evaluate((element) => getComputedStyle(element).fontSize), "16px");
    await quickInput.focus();
    await page.waitForTimeout(100);
    const mobileViewportAfterFocus = await page.evaluate(() => ({
      innerWidth,
      innerHeight,
      scrollX,
      scrollY,
      visualViewport: visualViewport ? { width: visualViewport.width, height: visualViewport.height, scale: visualViewport.scale, offsetLeft: visualViewport.offsetLeft, offsetTop: visualViewport.offsetTop } : null,
    }));
    assert.deepEqual(mobileViewportAfterFocus, mobileViewportBeforeFocus, "mobile focus must not zoom or shift the browsing viewport");
    await page.locator('button.sheet-close[data-action="close-sheet"]').click();

    await page.locator(".mobile-quick-button").click();
    if (await page.locator('[data-action="start-quick-record-farm"][data-farm-id="red"]').count()) {
      await page.locator('[data-action="start-quick-record-farm"][data-farm-id="red"]').click();
    } else {
      await page.locator('[data-action="open-quick-record"]').click();
    }
    await page.locator("#quick-record-input").fill("死亡5");
    await page.locator('[data-action="preview-quick-record"]').click();
    const preview = await page.locator(".sheet-panel").innerText();
    assert.match(preview, /寫入 Lab 紀錄/);
    assert.match(preview, /稽核紅羽一場/);
    await page.locator('[data-action="commit-lab-event"]').click();
    assert.equal(await page.locator('[data-testid="mortality-value"]').innerText(), "10");
    assert.equal(await page.locator('[data-testid="stock-value"]').innerText(), "12,127");
    assert.match(await page.locator(".lab-write-notice").innerText(), /死亡 5/);

    await page.locator('.bottom-nav [data-nav="records"]').click();
    assert.equal(await page.locator('.list-row').filter({ hasText: "死亡 5 隻" }).count(), 2);
    await page.locator('.bottom-nav [data-nav="calendar"]').click();
    assert.equal(await page.locator(".calendar-title-block h1").innerText(), "2026 年 8 月");
    assert.equal(await page.locator(".calendar-detail-item").filter({ hasText: "死亡 5 隻" }).count(), 2);
    await page.locator('.bottom-nav [data-nav="more"]').click();
    await page.locator('[data-action="open-sheet"][data-sheet-kind="audit"]').click();
    assert.match(await page.locator(".sheet-panel").innerText(), /quick_record/);
    await page.locator('button.sheet-close[data-action="close-sheet"]').click();

    // Ambiguous or unsafe text becomes Pending Review and never becomes HTML.
    await page.locator(".mobile-quick-button").click();
    await page.locator('[data-action="open-quick-record"]').click();
    await page.locator("#quick-record-input").fill('<img src=x onerror="window.__xss=true">');
    await page.locator('[data-action="preview-quick-record"]').click();
    assert.equal(await page.locator(".sheet-panel img").count(), 0);
    assert.match(await page.locator(".sheet-panel").innerText(), /待人工確認/);
    await page.locator('[data-action="save-pending-review"]').click();

    // Correction is append-only: original event is reversed and replacement is visible.
    await page.locator('.bottom-nav [data-nav="records"]').click();
    const newDeath = page.locator('.list-row').filter({ hasText: "死亡 5 隻" }).first();
    await newDeath.click();
    await page.locator('[data-action="open-correction"]').waitFor({ state: "visible" });
    await page.waitForTimeout(350);
    await page.locator('[data-action="open-correction"]').click();
    await page.locator("#correction-qty").fill("2");
    await page.locator('[data-action="commit-correction"]').click();
    await page.locator('.bottom-nav [data-nav="records"]').click();
    assert.equal(await page.locator('.list-row').filter({ hasText: "死亡 5 隻" }).count(), 1);
    assert.equal(await page.locator('.list-row').filter({ hasText: "死亡 2 隻" }).filter({ hasText: "2026-08-31 09:30" }).count(), 1);

    // AI_DOWN is isolated from core navigation.
    await page.locator('.bottom-nav [data-nav="more"]').click();
    await page.locator('[data-action="open-sheet"][data-sheet-kind="developer-fallback"]').click();
    await page.locator('[data-action="set-lab-mode"][data-mode="AI_DOWN"]').click();
    await page.locator('button.sheet-close[data-action="close-sheet"]').click();
    await page.locator('[data-action="go-ai"]').click();
    assert.match(await page.locator(".ai-page").innerText(), /AI 暫時不可用/);
    await page.locator('.bottom-nav [data-nav="records"]').click();
    assert.equal(await page.locator('[data-page="records"]').count(), 1);

    await page.screenshot({ path: path.join(resultsDir, `${browserName}-390x844.png`), fullPage: true });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseUrl}/index.html?e2e=${browserName}-desktop`, { waitUntil: "networkidle" });
    assert.equal(await page.evaluate("document.documentElement.dataset.appId"), "jinji-web-v14r-lab");
    assert.equal(await page.locator(".desktop-sidebar").isVisible(), true);
    assert.equal(await page.locator(".desktop-quick-button").isVisible(), true);
    assert.equal(await page.locator(".mobile-quick-slot").isVisible(), false);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.screenshot({ path: path.join(resultsDir, `${browserName}-1440x900.png`), fullPage: true });
    assert.deepEqual(consoleErrors, []);
    assert.deepEqual(pageErrors, []);
    assert.deepEqual(unexpectedRequests, []);
    console.log(`E2E_PASS=${browserName}`, JSON.stringify({ mobile: "390x844", desktop: "1440x900", consoleErrors: consoleErrors.length, pageErrors: pageErrors.length, unexpectedRequests: unexpectedRequests.length }));
  } finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
}

main().catch((error) => { console.error(`E2E_FAIL=${browserName}`, error.stack || error.message); process.exitCode = 1; });
