const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { chromium, webkit } = require("@playwright/test");

const root = require("node:path").resolve(__dirname, "../..");
const browserName = process.argv.includes("--browser=webkit") ? "webkit" : "chromium";
const port = Number(process.env.CANONICAL_STOCK_PORT || (browserName === "webkit" ? 4216 : 4215));
const baseUrl = `http://127.0.0.1:${port}`;
const workerBase = "https://worker.example.test";

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
    setTimeout(() => { clearInterval(timer); reject(new Error("CANONICAL_STOCK_SERVER_TIMEOUT")); }, 10000);
  });
}

function corsHeaders(origin) {
  return {
    "access-control-allow-origin": origin || "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "accept,content-type,authorization",
    "access-control-max-age": "60",
    "content-type": "application/json",
  };
}

function jsonResponse(route, payload, status = 200) {
  const response = {
    status,
    headers: corsHeaders(route.request().headers().origin || "*"),
  };
  if (status !== 204) response.body = JSON.stringify(payload);
  return route.fulfill(response);
}

function legacyRecords() {
  const scope = {
    farmId: "test-farm",
    houseId: "test-house",
    flockId: "test-flock",
    sourceChannel: "web",
  };
  return [
    {
      ...scope,
      id: "o4-record",
      taxonomyId: "O4",
      family: "operational_event",
      type: "event",
      subtype: "weigh",
      destination: "recording_events",
      occurredAt: "2026-09-10T01:00:00.000Z",
      createdAt: "2026-09-10T01:00:00.000Z",
      clientOperationId: "o4-client",
      averageWeight: 1.8,
      weightUnit: "kg",
      ageDays: 39,
      sex: "mixed",
    },
    {
      ...scope,
      id: "o2-original",
      taxonomyId: "O2",
      family: "operational_action",
      type: "action",
      subtype: "medication",
      destination: "operational_actions",
      occurredAt: "2026-09-10T02:00:00.000Z",
      createdAt: "2026-09-10T02:00:00.000Z",
      clientOperationId: "o2-client",
      content: "original medication",
      lifecycleStatus: "active",
    },
    {
      ...scope,
      id: "o2-correction",
      taxonomyId: "O2",
      family: "operational_action",
      type: "action",
      subtype: "medication",
      destination: "operational_actions",
      occurredAt: "2026-09-10T03:00:00.000Z",
      createdAt: "2026-09-10T03:00:00.000Z",
      clientOperationId: "o2-correction-client",
      correctionOfId: "o2-original",
      content: "corrected medication",
    },
    {
      ...scope,
      id: "a8-record",
      taxonomyId: "A8",
      family: "operational_observation",
      type: "observation",
      subtype: "foot_odor",
      destination: "abnormal_events",
      occurredAt: "2026-09-10T04:00:00.000Z",
      createdAt: "2026-09-10T04:00:00.000Z",
      clientOperationId: "a8-client",
      extent: "small",
      detail: "test detail",
    },
    {
      ...scope,
      id: "o3-original",
      taxonomyId: "O3",
      family: "operational_event",
      type: "event",
      subtype: "shipment",
      destination: "operational_events",
      occurredAt: "2026-09-10T05:00:00.000Z",
      createdAt: "2026-09-10T05:00:00.000Z",
      clientOperationId: "o3-client",
      quantity: 1,
      unit: "隻",
      sex: "male",
      totalWeight: 2,
      weightUnit: "kg",
    },
    {
      ...scope,
      id: "o3-reversal",
      taxonomyId: "O3",
      family: "operational_event",
      type: "event",
      subtype: "shipment",
      destination: "operational_events",
      occurredAt: "2026-09-10T06:00:00.000Z",
      createdAt: "2026-09-10T06:00:00.000Z",
      clientOperationId: "o3-reversal-client",
      reversalOfId: "o3-original",
      quantity: 1,
      unit: "隻",
      sex: "male",
    },
  ];
}

async function installCanonicalStub(page, stockMode, calls) {
  await page.route(`${workerBase}/**`, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const environment = url.searchParams.get("environment");
    calls.push({ method: request.method(), pathname: url.pathname, environment, url: request.url() });

    if (request.method() === "OPTIONS") return jsonResponse(route, {}, 204);
    if (url.pathname === "/api/web/auth/login") {
      return jsonResponse(route, { authenticated: true, token: "STUB_TOKEN_1234567890123456789012345678901234567", expiresAt: "2099-01-01T00:00:00.000Z", organization: { id: "org-test" } });
    }
    if (url.pathname === "/api/web/auth/session") {
      return jsonResponse(route, { authenticated: true, expiresAt: "2099-01-01T00:00:00.000Z", organization: { id: "org-test" } });
    }
    if (url.pathname === "/api/web/auth/logout") return jsonResponse(route, { authenticated: false });
    if (url.pathname === "/api/farms") {
      return jsonResponse(route, environment === "test"
        ? { farms: [{ id: "test-farm", name: "金雞測試場", environment: "test", siteName: "Test" }] }
        : { farms: [] });
    }
    if (url.pathname === "/api/houses") {
      return jsonResponse(route, environment === "test" && url.searchParams.get("farmId") === "test-farm"
        ? { houses: [{ id: "test-house", farmId: "test-farm", name: "測試1舍", farmEnvironment: "test" }] }
        : { houses: [] });
    }
    if (url.pathname === "/api/flocks") {
      return jsonResponse(route, environment === "test" && url.searchParams.get("farmId") === "test-farm"
        ? { flocks: [{ id: "test-flock", farmId: "test-farm", houseId: "test-house", batchCode: "TEST-BATCH-001", status: "active", initialCount: 1000 }] }
        : { flocks: [] });
    }
    if (url.pathname === "/api/ai/live-status") {
      const currentStock = stockMode === "missing" ? null : stockMode;
      return jsonResponse(route, {
        aiInvoked: false,
        context: {
          scope: { type: "flock", id: "test-flock" },
          scopeEntity: { id: "test-flock", environment: "test" },
          flocks: [{ id: "test-flock", currentStock, status: "active" }],
        },
      });
    }
    if (url.pathname === "/api/records") return jsonResponse(route, { environment, records: environment === "test" ? legacyRecords() : [] });
    return jsonResponse(route, { error: "unexpected_test_route" }, 404);
  });
}

async function loginAndSelectTestScope(page, expectedStock, stockMode, calls) {
  await page.goto(`${baseUrl}/index.html?api-base=${encodeURIComponent(workerBase)}&cache-bust=canonical-stock-read-1#/dashboard`, { waitUntil: "networkidle" });
  try {
    await page.locator('[data-testid="web-auth-gate"]').waitFor();
  } catch (error) {
    throw new Error(`${error.message}\nGATE_DEBUG_BODY=${(await page.locator("body").innerText()).slice(0, 2000)}\nGATE_DEBUG_CALLS=${JSON.stringify(calls)}`);
  }
  await page.locator("#web-admin-password").fill("stub-password");
  await page.locator("#web-login-form").locator("button[type=submit]").click();
  try {
    await page.locator('[data-testid="web-runtime-controls"]').waitFor();
  } catch (error) {
    throw new Error(`${error.message}\nLOGIN_DEBUG_BODY=${(await page.locator("body").innerText()).slice(0, 2000)}\nLOGIN_DEBUG_CALLS=${JSON.stringify(calls)}`);
  }
  await page.locator("#web-environment-select").selectOption("test");
  await page.locator('[data-action="open-context"]').waitFor();
  await page.locator('[data-action="open-context"]').click();
  await page.locator('[data-action="select-farm-direct"][data-farm-id="test-farm"]').waitFor();
  await page.locator('[data-action="select-farm-direct"][data-farm-id="test-farm"]').click();
  await page.locator('[data-testid="house-chips"] [data-action="select-house-direct"][data-house-id="test-house"]').click();
  await page.locator('[data-testid="flock-chips"] [data-action="select-flock-direct"][data-flock-id="test-flock"]').click();
  await page.locator('[data-testid="stock-value"]').waitFor();
  assert.equal((await page.locator('[data-testid="stock-value"]').innerText()).trim(), expectedStock);
  assert.equal(await page.locator('[data-testid="web-runtime-controls"] .web-auth-status').innerText(), "已登入 · Test scope");
  assert.equal(await page.evaluate(() => Object.values(localStorage).some((value) => String(value).includes("STUB_TOKEN") || String(value).includes("stub-password"))), false);
  assert.equal(calls.some((call) => call.method === "POST" && call.pathname === "/api/records"), false);
  assert.equal(calls.some((call) => call.pathname === "/api/ai/live-status" && call.environment === "production"), false);
  assert.equal(stockMode === "missing" ? await page.locator('[data-testid="stock-value"]').innerText() : expectedStock, expectedStock);
}

async function main() {
  const server = spawn("python3", ["-m", "http.server", String(port), "--bind", "127.0.0.1"], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
  let browser;
  try {
    await waitForServer(server);
    browser = await (browserName === "webkit" ? webkit : chromium).launch({ headless: true });
    const pageErrors = [];

    for (const scenario of [
      { mode: 963, expected: "963" },
      { mode: 0, expected: "0" },
      { mode: "missing", expected: "資料不足" },
    ]) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, timezoneId: "Asia/Taipei" });
      const page = await context.newPage();
      page.on("pageerror", (error) => pageErrors.push(error.message));
      const calls = [];
      await installCanonicalStub(page, scenario.mode, calls);
      await loginAndSelectTestScope(page, scenario.expected, scenario.mode, calls);
      await page.locator('.bottom-nav [data-nav="records"]').click();
      await page.locator('[data-testid="canonical-record-status"]').waitFor();
      await page.waitForFunction(() => !document.querySelector('[data-testid="canonical-record-status"]')?.textContent.includes("正在載入"));
      const recordsPage = page.locator('[data-testid="canonical-records-page"]');
      assert.equal(await recordsPage.count(), 1);
      assert.equal(await recordsPage.locator('.list-row').count(), 6);
      const recordsText = await recordsPage.innerText();
      for (const taxonomyId of ["O4", "A8"]) assert.match(recordsText, new RegExp(taxonomyId));
      assert.ok((recordsText.match(/O2/g) || []).length >= 2);
      assert.ok((recordsText.match(/O3/g) || []).length >= 2);
      assert.match(recordsText, /已修正/);
      assert.match(recordsText, /已撤銷/);
      assert.doesNotMatch(recordsText, /讀取契約無效/);
      assert.ok(calls.some((call) => call.pathname === "/api/ai/live-status" && call.environment === "test"));
      assert.ok(calls.some((call) => call.pathname === "/api/farms" && call.environment === "test"));
      assert.ok(calls.some((call) => call.pathname === "/api/houses" && call.environment === "test"));
      assert.ok(calls.some((call) => call.pathname === "/api/flocks" && call.environment === "test"));
      assert.ok(calls.some((call) => call.pathname === "/api/records" && call.environment === "test"));
      assert.equal(calls.some((call) => call.method === "POST" && call.pathname !== "/api/web/auth/login"), false);
      await context.close();
    }

    assert.deepEqual(pageErrors, []);
    console.log(`CANONICAL_STOCK_E2E_PASS=${browserName}`, JSON.stringify({ authoritative963: true, authoritativeZero: true, missingIsUnavailable: true, testScopeOnly: true, businessWrites: 0 }));
  } finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(`CANONICAL_STOCK_E2E_FAIL=${browserName}`, error.stack || error.message);
  process.exitCode = 1;
});
