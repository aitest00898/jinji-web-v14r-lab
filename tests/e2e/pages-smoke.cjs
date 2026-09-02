const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium, webkit } = require("@playwright/test");

const pagesUrl = (process.env.PAGES_URL || "https://aitest00898.github.io/jinji-web-v14r-lab/").replace(/\/$/, "");
const expectedTitle = "金雞管理中心 V14R Plus r4 Desktop v7（測試版）";
const expectedMarker = "jinji-v14r-plus-r4-desktop-v7-mobile-nav";
const expectedSha = process.env.EXPECTED_PAGES_SHA;
const browserName = process.argv.includes("--browser=webkit") ? "webkit" : "chromium";

async function assertPageIdentity(page) {
  // Required first assertion: public browser target identity.
  assert.equal(await page.evaluate("document.documentElement.dataset.appId"), "jinji-web-v14r-lab");
  assert.equal(await page.title(), expectedTitle);
  assert.equal(await page.locator("html").getAttribute("data-build-marker"), expectedMarker);
  const buildSha = await page.locator("html").getAttribute("data-build-sha");
  assert.ok(buildSha && buildSha !== "LOCAL_UNBUILT", "Pages build SHA must be populated");
  if (expectedSha) assert.equal(buildSha, expectedSha);
  return buildSha;
}

async function runViewport(browser, viewport, label) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const unexpectedRequests = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.origin !== new URL(`${pagesUrl}/`).origin) unexpectedRequests.push(request.url());
  });
  const response = await page.goto(`${pagesUrl}/index.html?pages-smoke=${browserName}-${label}-${Date.now()}`, { waitUntil: "networkidle" });
  assert.equal(response?.status(), 200);
  const buildSha = await assertPageIdentity(page);
  const navRoot = viewport.width >= 1024 ? ".desktop-nav" : ".bottom-nav";
  const expectedNavCount = viewport.width >= 1024 ? 8 : 6;
  assert.equal(await page.locator('[data-page="today"]').count(), 1);
  assert.equal(await page.locator(`${navRoot} [data-nav]`).count(), expectedNavCount);
  assert.equal(await page.locator('[data-action="open-sheet"][data-sheet-kind="quick-actions"]').count(), 1);
  assert.equal(await page.locator('[data-action="open-sheet"][data-sheet-kind="quick-actions"]').isVisible(), true);

  for (const nav of ["today", "calendar", "farms", "records", "todo", "more"]) {
    await page.locator(`${navRoot} [data-nav="${nav}"]`).click();
    assert.equal(await page.locator(`[data-page="${nav}"]`).count(), 1);
  }
  await page.locator('[data-action="go-finance"]').click();
  assert.equal(await page.locator('[data-page="finance"]').count(), 1);
  await page.locator(`${navRoot} [data-nav="more"]`).click();
  await page.locator('[data-action="go-ai"]').click();
  assert.equal(await page.locator('[data-page="ai"]').count(), 1);

  await page.locator(`${navRoot} [data-nav="more"]`).click();
  await page.locator('[data-action="open-sheet"][data-sheet-kind="quick-actions"]').click();
  assert.equal(await page.locator('[data-action="start-quick-record-farm"]').count(), 4);
  await page.locator('[data-action="start-quick-record-farm"][data-farm-id="red"]').click();
  assert.equal(await page.locator('[data-sheet-kind="quick-record"]').count(), 1);
  await page.locator('button.sheet-close[data-action="close-sheet"]').click();

  await page.locator(`${navRoot} [data-nav="more"]`).click();
  await page.locator('[data-action="open-sheet"][data-sheet-kind="settings"]').click();
  await page.locator('[data-action="open-settings-detail"][data-settings-key="trend"]').click();
  assert.equal(await page.locator('[data-threshold-key="baselineDays"]').count(), 1);
  await page.locator('button.sheet-close[data-action="close-sheet"]').click();

  await page.locator(`${navRoot} [data-nav="more"]`).click();
  await page.locator('[data-action="open-sheet"][data-sheet-kind="developer-fallback"]').click();
  assert.equal(await page.locator('[data-action="set-lab-mode"][data-mode="AI_DOWN"]').count(), 1);
  await page.locator('button.sheet-close[data-action="close-sheet"]').click();

  assert.equal(await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) <= window.innerWidth), true);
  assert.deepEqual(consoleErrors, []);
  assert.deepEqual(pageErrors, []);
  assert.deepEqual(unexpectedRequests, []);
  await context.close();
  return { label, viewport: `${viewport.width}x${viewport.height}`, buildSha };
}

async function fetchBuildInfo() {
  const response = await fetch(`${pagesUrl}/build-info.json?pages-smoke=${Date.now()}`);
  assert.equal(response.status, 200);
  const info = await response.json();
  assert.equal(info.environment, "PREPROD LAB");
  assert.equal(info.buildMarker, expectedMarker);
  if (expectedSha) assert.equal(info.buildSha, expectedSha);
  return info;
}

async function main() {
  const buildInfo = await fetchBuildInfo();
  const browserType = browserName === "webkit" ? webkit : chromium;
  const launchOptions = { headless: true };
  const chromePath = process.env.CHROME_PATH;
  if (browserName === "chromium" && chromePath && fs.existsSync(chromePath)) launchOptions.executablePath = chromePath;
  const browser = await browserType.launch(launchOptions);
  try {
    const mobile = await runViewport(browser, { width: 390, height: 844 }, "mobile");
    const desktop = await runViewport(browser, { width: 1440, height: 900 }, "desktop");
    console.log(`PAGES_SMOKE_PASS=${browserName}`, JSON.stringify({
      url: `${pagesUrl}/`,
      server: "EXTERNAL_GITHUB_PAGES",
      buildInfo,
      mobile,
      desktop,
      consoleErrors: 0,
      pageErrors: 0,
      horizontalOverflow: 0,
      unexpectedRequests: 0,
    }));
  } finally {
    await browser.close();
  }
}

main().catch((error) => { console.error(`PAGES_SMOKE_FAIL=${browserName}`, error.stack || error.message); process.exitCode = 1; });
