const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { chromium, webkit } = require("@playwright/test");

const root = path.resolve(__dirname, "../..");
const browserName = process.argv.includes("--browser=webkit") ? "webkit" : "chromium";
const port = Number(process.env.RECORDING_PORTAL_PORT || (browserName === "webkit" ? 4206 : 4205));
const baseUrl = `http://127.0.0.1:${port}`;
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
    setTimeout(() => { clearInterval(timer); reject(new Error("RECORDING_PORTAL_SERVER_TIMEOUT")); }, 10000);
  });
}

async function startGuided(page, area, taxonomyId, subtype) {
  await page.locator(`[data-testid="portal-${area}"]`).click();
  await page.locator(`[data-action="guided-category"][data-taxonomy-id="${taxonomyId}"]`).click();
  await page.locator(`[data-action="guided-subtype"][data-subtype="${subtype}"]`).click();
}

async function chooseScope(page, { farm = "red", house = null, flock = null, wholeFarm = false } = {}) {
  await page.locator('[data-action="guided-scope-farm"]').selectOption(farm);
  if (house) await page.locator('[data-action="guided-scope-house"]').selectOption(house);
  if (flock) await page.locator('[data-action="guided-scope-flock"]').selectOption(flock);
  if (wholeFarm) await page.locator('[data-action="guided-whole-farm"]').check();
  await page.locator('[data-action="guided-scope-next"]').click();
}

async function nextField(page, field, value = null, mode = "fill") {
  const control = page.locator(`[data-guided-field="${field}"]`);
  if (value !== null) {
    if (mode === "select") await control.selectOption(value);
    else await control.fill(String(value));
    await page.waitForTimeout(100);
  }
  await page.locator('[data-action="guided-next"]').click();
  await page.waitForTimeout(25);
}

async function gotoPortal(page, suffix) {
  await page.goto(`${baseUrl}/index.html?record-portal=${browserName}-${suffix}`, { waitUntil: "networkidle" });
  await page.locator('[data-testid="record-portal"]').waitFor();
}

async function readOverlay(page) {
  return page.evaluate((key) => JSON.parse(localStorage.getItem(key) || "null"), overlayKey);
}

async function main() {
  const server = spawn("python3", ["-m", "http.server", String(port), "--bind", "127.0.0.1"], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
  let browser;
  try {
    await waitForServer(server);
    browser = await (browserName === "webkit" ? webkit : chromium).launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, timezoneId: "Asia/Taipei" });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const unexpectedRequests = [];
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("request", (request) => { if (!request.url().startsWith(baseUrl)) unexpectedRequests.push(request.url()); });

    await gotoPortal(page, "initial");
    assert.equal(await page.locator("[data-testid=record-portal]").count(), 1);
    assert.equal(await page.locator("[data-testid^=portal-]").count(), 3);
    assert.equal(await page.locator(".record-portal-grid .record-portal-card").count(), 3);
    assert.equal(await page.locator(".bottom-nav").count(), 0);
    assert.equal(await page.locator(".mobile-quick-slot").count(), 0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);

    // The third portal entry enters the existing management center and browser
    // back returns to the portal instead of silently remembering a choice.
    await page.locator('[data-testid="portal-management"]').click();
    assert.equal(await page.locator('[data-page="today"]').count(), 1);
    assert.equal(await page.locator('[data-testid="stock-value"]').count(), 1);
    await page.goBack();
    await page.locator('[data-testid="record-portal"]').waitFor();

    // Selecting a house never silently selects its flock. The review surface
    // must show the missing batch explicitly.
    await startGuided(page, "operational", "O2", "medication");
    await chooseScope(page, { farm: "red", house: "red-1" });
    await nextField(page, "date");
    await nextField(page, "content", "例行用藥");
    assert.match(await page.locator('[data-testid="guided-review"]').innerText(), /雞舍[\s\S]*紅羽一舍/);
    assert.match(await page.locator('[data-testid="guided-review"]').innerText(), /批次[\s\S]*未指定/);
    await page.locator('[data-action="guided-cancel"]').click();

    // Operational O9: required quantity validation, explicit context, review,
    // one canonical command, and Records visibility.
    await startGuided(page, "operational", "O9", "mortality");
    await chooseScope(page, { farm: "red", house: "red-1", flock: "alpha" });
    await nextField(page, "date");
    await page.locator('[data-action="guided-next"]').click();
    assert.match(await page.locator('[data-testid="guided-field-step"] [role="alert"]').innerText(), /數量/);
    await nextField(page, "quantity", 5);
    await page.locator('[data-action="guided-skip-field"]').click();
    assert.match(await page.locator('[data-testid="guided-review"]').innerText(), /O9/);
    assert.match(await page.locator('[data-testid="guided-review"]').innerText(), /雞場[\s\S]*稽核紅羽一場/);
    assert.match(await page.locator('[data-testid="guided-review"]').innerText(), /批次[\s\S]*AUDIT-RED-ALPHA/);
    await page.locator('[data-action="guided-confirm"]').click();
    assert.equal(await page.locator('[data-page="records"]').count(), 1);
    assert.ok(await page.locator(".list-row").filter({ hasText: "死亡 5" }).count() >= 2, "guided mortality must be visible alongside the fixture record");
    const eventOverlay = await readOverlay(page);
    const guidedEvent = eventOverlay.events.find((row) => row.canonicalRecord?.taxonomyId === "O9");
    assert.ok(guidedEvent);
    assert.equal(guidedEvent.canonicalRecord.quantity, 5);
    assert.equal(eventOverlay.syncedOperationIds.includes(guidedEvent.clientOperationId), true);

    // A5 is qualitative: it requires an extent and never creates a numeric
    // mortality event. Farm-only scope is explicit before review.
    await gotoPortal(page, "abnormal");
    await startGuided(page, "abnormal", "A5", "eye_swelling");
    await chooseScope(page, { farm: "red", wholeFarm: true });
    await nextField(page, "date");
    await nextField(page, "extent", "medium", "select");
    await page.locator('[data-action="guided-skip-field"]').click();
    assert.match(await page.locator('[data-testid="guided-review"]').innerText(), /A5/);
    assert.match(await page.locator('[data-testid="guided-review"]').innerText(), /整場（已明確確認）/);
    await page.locator('[data-action="guided-confirm"]').click();
    assert.equal(await page.locator(".list-row").filter({ hasText: "現場觀察：外觀" }).count(), 1);
    const abnormalOverlay = await readOverlay(page);
    assert.equal(abnormalOverlay.events.filter((row) => row.canonicalRecord?.taxonomyId === "O9").length, 1);
    assert.equal(abnormalOverlay.observations.some((row) => row.canonicalRecord?.taxonomyId === "A5" && row.extent === "medium"), true);

    // O6 waiting_result creates a local deterministic follow-up and reminder;
    // no scheduler or remote endpoint is involved.
    await gotoPortal(page, "lab-test");
    await startGuided(page, "operational", "O6", "lab_test");
    await chooseScope(page, { farm: "red", wholeFarm: true });
    await nextField(page, "date");
    await nextField(page, "content", "例行檢驗");
    await nextField(page, "workflowStatus", "waiting_result", "select");
    assert.match(await page.locator('[data-testid="guided-review"]').innerText(), /送驗/);
    await page.locator('[data-action="guided-confirm"]').click();
    await page.locator('.bottom-nav [data-nav="todo"]').click();
    assert.match(await page.locator('[data-page="todo"]').innerText(), /送驗/);
    const actionOverlay = await readOverlay(page);
    const labAction = actionOverlay.actions.find((row) => row.taxonomyId === "O6");
    assert.ok(labAction);
    assert.equal(labAction.workflowStatus, "waiting_result");
    assert.equal(typeof labAction.reminderDueAt, "string");

    // Width matrix: portal cards remain readable and do not overflow at the
    // requested mobile, tablet, breakpoint, and desktop widths.
    for (const width of [320, 360, 390, 430, 768, 834, 1023, 1024, 1440]) {
      await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
      await gotoPortal(page, `width-${width}`);
      const metrics = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        cards: [...document.querySelectorAll(".record-portal-card")].map((card) => card.getBoundingClientRect().width),
      }));
      assert.ok(metrics.overflow <= 1, `portal overflow at ${width}px: ${metrics.overflow}`);
      assert.equal(metrics.cards.length, 3);
      assert.ok(metrics.cards.every((cardWidth) => cardWidth > 0), `portal card missing width at ${width}px`);
    }

    assert.deepEqual(consoleErrors, []);
    assert.deepEqual(pageErrors, []);
    assert.deepEqual(unexpectedRequests, []);
    console.log(`RECORDING_PORTAL_E2E_PASS=${browserName}`, JSON.stringify({ widths: 9, consoleErrors: 0, pageErrors: 0, unexpectedRequests: 0 }));
  } finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(`RECORDING_PORTAL_E2E_FAIL=${browserName}`, error.stack || error.message);
  process.exitCode = 1;
});
