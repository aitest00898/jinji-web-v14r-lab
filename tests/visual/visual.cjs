const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { chromium } = require("@playwright/test");
const { PNG } = require("pngjs");
const pixelmatchModule = require("pixelmatch");

const pixelmatch = pixelmatchModule.default || pixelmatchModule;
const root = path.resolve(__dirname, "../..");
const output = path.join(root, "test-results", "visual");
const phase3BaselineRoot = path.join(__dirname, "baseline");
const labPort = Number(process.env.VISUAL_PORT || 4182);
const referenceRoot = process.env.REFERENCE_ROOT || "/Users/joe/Downloads";
const referenceFile = path.join(referenceRoot, process.env.REFERENCE_FILE || "jinji-management-center-v7.html");
const useLocalVisualReference = process.env.CI !== "true";
const hasReference = useLocalVisualReference && fs.existsSync(referenceFile);
const referencePort = Number(process.env.REFERENCE_PORT || 4183);
const labUrl = `http://127.0.0.1:${labPort}`;
const referenceUrl = `http://127.0.0.1:${referencePort}`;
const expectedTitle = "金雞管理中心 V14R Plus r4 Desktop v7（測試版）";
const expectedReferenceTitle = "金雞管理中心 V14R Plus r4 Desktop v2（測試版）";
const expectedMarker = "jinji-v14r-plus-r4-desktop-v7-mobile-nav";
const useLocalPhase3Baseline = useLocalVisualReference;
const responsiveMatrix = [
  ["mobile-320", 320, 568], ["mobile-360", 360, 800], ["mobile-390", 390, 844], ["mobile-393", 393, 852], ["mobile-430", 430, 932],
  ["tablet-768", 768, 1024], ["tablet-834", 834, 1194], ["tablet-1023", 1023, 900],
  ["desktop-1024", 1024, 768], ["desktop-1280", 1280, 800], ["desktop-1440", 1440, 900], ["desktop-1920", 1920, 1080],
];

function waitForServer(server, url, file = "index.html") {
  return new Promise((resolve, reject) => {
    const timer = setInterval(async () => {
      try {
        if ((await fetch(`${url}/${file}`)).ok) { clearInterval(timer); resolve(); }
      } catch (_) {}
    }, 80);
    server.once("error", (error) => { clearInterval(timer); reject(error); });
    setTimeout(() => { clearInterval(timer); reject(new Error("VISUAL_SERVER_TIMEOUT")); }, 10000);
  });
}

async function identity(page, title = expectedTitle) {
  // Required first assertion for every visual target: app identity.
  assert.equal(await page.evaluate("document.documentElement.dataset.appId"), "jinji-web-v14r-lab");
  assert.equal(await page.title(), title);
  assert.equal(await page.locator("html").getAttribute("data-build-marker"), expectedMarker);
}

async function freezeMotion(page) {
  await page.addStyleTag({ content: "*, *::before, *::after { animation: none !important; transition: none !important; }" });
}

async function screenshotAndCompare(labPage, referencePage, name) {
  const labPath = path.join(output, `chromium-${name}.png`);
  const legacyReferencePath = path.join(output, `reference-${name}.png`);
  const phase3ReferencePath = path.join(phase3BaselineRoot, `phase3-${name}.png`);
  const diffPath = path.join(output, `diff-${name}.png`);
  const labBuffer = await labPage.screenshot({ path: labPath, fullPage: true });
  const hasPhase3Baseline = useLocalPhase3Baseline && fs.existsSync(phase3ReferencePath);
  if (!referencePage && !hasPhase3Baseline) return { labPath, comparison: "structural-only", pixelDiff: "NOT_COMPARED" };
  const referenceBuffer = hasPhase3Baseline
    ? fs.readFileSync(phase3ReferencePath)
    : await referencePage.screenshot({ path: legacyReferencePath, fullPage: true });
  const comparisonReferencePath = hasPhase3Baseline ? phase3ReferencePath : legacyReferencePath;
  const labPng = PNG.sync.read(labBuffer);
  const referencePng = PNG.sync.read(referenceBuffer);
  assert.equal(labPng.width, referencePng.width, `${name} screenshot width`);
  assert.equal(labPng.height, referencePng.height, `${name} screenshot height`);
  const diffPng = new PNG({ width: labPng.width, height: labPng.height });
  const pixelDiff = pixelmatch(referencePng.data, labPng.data, diffPng.data, labPng.width, labPng.height, { threshold: 0.1, includeAA: true });
  fs.writeFileSync(diffPath, PNG.sync.write(diffPng));
  assert.equal(pixelDiff, 0, `${name} V7 pixel diff`);
  return { labPath, referencePath: comparisonReferencePath, diffPath, comparison: hasPhase3Baseline ? "phase3-baseline-pixel" : "V7-reference-pixel", pixelDiff };
}

async function main() {
  fs.mkdirSync(output, { recursive: true });
  const labServer = spawn("python3", ["-m", "http.server", String(labPort), "--bind", "127.0.0.1"], { cwd: root, stdio: "ignore" });
  const referenceServer = hasReference
    ? spawn("python3", ["-m", "http.server", String(referencePort), "--bind", "127.0.0.1"], { cwd: referenceRoot, stdio: "ignore" })
    : null;
  let browser;
  try {
    await waitForServer(labServer, labUrl);
    if (referenceServer) await waitForServer(referenceServer, referenceUrl, path.basename(referenceFile));
    console.log(`VISUAL_LAB_SERVER_PID=${labServer.pid}`);
    console.log(`VISUAL_LAB_SERVER_ROOT=${root}`);
    console.log(`VISUAL_LAB_SERVER_URL=${labUrl}/index.html`);
    console.log(`VISUAL_REFERENCE=${hasReference ? referenceFile : "NOT_AVAILABLE"}`);
    const launchOptions = { headless: true };
    const chromePath = process.env.CHROME_PATH;
    if (chromePath && fs.existsSync(chromePath)) launchOptions.executablePath = chromePath;
    browser = await chromium.launch(launchOptions);
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const labPage = await context.newPage();
    const referencePage = hasReference ? await context.newPage() : null;
    const labErrors = [];
    const referenceErrors = [];
    labPage.on("pageerror", (error) => labErrors.push(error.message));
    if (referencePage) referencePage.on("pageerror", (error) => referenceErrors.push(error.message));
    await labPage.goto(`${labUrl}/index.html?visual=mobile&test-date=2026-08-31`, { waitUntil: "networkidle" });
    await identity(labPage);
    await freezeMotion(labPage);
    if (referencePage) {
      await referencePage.goto(`${referenceUrl}/${path.basename(referenceFile)}?visual=mobile`, { waitUntil: "networkidle" });
      await identity(referencePage, expectedReferenceTitle);
      await freezeMotion(referencePage);
    }
    const mobile = await labPage.evaluate(() => ({ width: innerWidth, height: innerHeight, nav: document.querySelectorAll(".bottom-nav button").length, quick: Boolean(document.querySelector(".mobile-quick-slot")), overflow: document.documentElement.scrollWidth - innerWidth }));
    assert.equal(mobile.nav, 6);
    assert.equal(mobile.quick, true);
    assert.equal(mobile.overflow, 0);
    const mobileComparison = await screenshotAndCompare(labPage, referencePage, "390x844");

    await labPage.setViewportSize({ width: 1440, height: 900 });
    await labPage.goto(`${labUrl}/index.html?visual=desktop&test-date=2026-08-31`, { waitUntil: "networkidle" });
    await identity(labPage);
    await freezeMotion(labPage);
    if (referencePage) {
      await referencePage.setViewportSize({ width: 1440, height: 900 });
      await referencePage.goto(`${referenceUrl}/${path.basename(referenceFile)}?visual=desktop`, { waitUntil: "networkidle" });
      await identity(referencePage, expectedReferenceTitle);
      await freezeMotion(referencePage);
    }
    const desktop = await labPage.evaluate(() => ({ width: innerWidth, height: innerHeight, sidebar: Boolean(document.querySelector(".desktop-sidebar")), quick: Boolean(document.querySelector(".desktop-quick-button")), mobileQuick: Boolean(document.querySelector(".mobile-quick-slot")), overflow: document.documentElement.scrollWidth - innerWidth }));
    assert.equal(desktop.sidebar, true);
    assert.equal(desktop.quick, true);
    assert.equal(desktop.mobileQuick, false);
    assert.equal(desktop.overflow, 0);
    const desktopComparison = await screenshotAndCompare(labPage, referencePage, "1440x900");
    const matrix = {};
    for (const [name, width, height] of responsiveMatrix) {
      await labPage.setViewportSize({ width, height });
      await labPage.goto(`${labUrl}/index.html?visual=${name}&test-date=2026-08-31`, { waitUntil: "networkidle" });
      await identity(labPage);
      await freezeMotion(labPage);
      const metrics = await labPage.evaluate(() => ({ width: innerWidth, height: innerHeight, nav: document.querySelectorAll(".bottom-nav button").length, navDisplay: getComputedStyle(document.querySelector(".bottom-nav")).display, mobileQuick: Boolean(document.querySelector(".mobile-quick-slot")), mobileQuickDisplay: document.querySelector(".mobile-quick-slot") ? getComputedStyle(document.querySelector(".mobile-quick-slot")).display : "none", desktopSidebar: Boolean(document.querySelector(".desktop-sidebar")), desktopSidebarDisplay: document.querySelector(".desktop-sidebar") ? getComputedStyle(document.querySelector(".desktop-sidebar")).display : "none", desktopQuick: Boolean(document.querySelector(".desktop-quick-button")), overflow: document.documentElement.scrollWidth - innerWidth }));
      assert.equal(metrics.overflow, 0, `${name} horizontal overflow`);
      if (width < 1024) {
        assert.equal(metrics.nav, 6, `${name} nav count`);
        assert.notEqual(metrics.navDisplay, "none", `${name} nav visible`);
        assert.equal(metrics.mobileQuick, true, `${name} mobile quick exists`);
        assert.notEqual(metrics.mobileQuickDisplay, "none", `${name} mobile quick visible`);
        assert.equal(metrics.desktopSidebar, false, `${name} desktop sidebar absent`);
      } else {
        assert.equal(metrics.navDisplay, "none", `${name} bottom nav hidden`);
        assert.equal(metrics.desktopSidebar, true, `${name} desktop sidebar exists`);
        assert.notEqual(metrics.desktopSidebarDisplay, "none", `${name} desktop sidebar visible`);
        assert.equal(metrics.desktopQuick, true, `${name} desktop quick exists`);
        assert.equal(metrics.mobileQuick, false, `${name} mobile quick absent`);
      }
      matrix[name] = metrics;
    }
    assert.deepEqual(labErrors, []);
    assert.deepEqual(referenceErrors, []);
    const hasPhase3Baseline = useLocalPhase3Baseline && fs.existsSync(path.join(phase3BaselineRoot, "phase3-390x844.png")) && fs.existsSync(path.join(phase3BaselineRoot, "phase3-1440x900.png"));
    const evidence = { comparison: hasPhase3Baseline ? "phase3-baseline-pixel" : hasReference ? "V7-reference-pixel" : "structural-only", reference: hasPhase3Baseline ? phase3BaselineRoot : hasReference ? referenceFile : "NOT_AVAILABLE", mobile, desktop, matrix, mobileComparison, desktopComparison, labErrors: labErrors.length, referenceErrors: referenceErrors.length };
    fs.writeFileSync(path.join(output, "visual-diff.json"), JSON.stringify(evidence, null, 2) + "\n");
    console.log("VISUAL_PASS", JSON.stringify(evidence));
  } finally {
    if (browser) await browser.close();
    labServer.kill("SIGTERM");
    referenceServer?.kill("SIGTERM");
  }
}

main().catch((error) => { console.error("VISUAL_FAIL", error.stack || error.message); process.exitCode = 1; });
