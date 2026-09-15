const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const path = require("node:path");
const { chromium } = require("@playwright/test");

const root = path.resolve(__dirname, "../..");
const port = Number(process.env.CANONICAL_LIFECYCLE_READBACK_PORT || 4225);
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
    setTimeout(() => { clearInterval(timer); reject(new Error("CANONICAL_LIFECYCLE_READBACK_SERVER_TIMEOUT")); }, 10000);
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
  const response = { status, headers: corsHeaders(route.request().headers().origin || "*") };
  if (status !== 204) response.body = JSON.stringify(payload);
  return route.fulfill(response);
}

function lifecycleSummary() {
  return {
    farm: { id: "farm-1", name: "示範場", environment: "production" },
    house: { id: "house-1", name: "一舍" },
    currentFlock: { id: "flock-1", batchCode: "B-001", chickInDate: "2026-01-01", initialCount: 10, status: "closed" },
    currentCycle: { id: "flock-1", flockId: "flock-1", batchCode: "B-001", chickInDate: "2026-01-01" },
    intakeDate: "2026-01-01",
    effectiveStock: 0,
    lifecycleStatus: "READY_NEXT_INTAKE",
    lifecycleStatusLabel: "清消完成，可準備下一批入雛",
    lastEffectiveStockEventAt: "2026-01-10T00:00:00+08:00",
    cleaningStatus: "completed",
    cleaningStatusLabel: "清消完成",
    cleaningCompletedAt: "2026-01-11T00:00:00+08:00",
    readyForNextIntake: true,
    dataCompleteness: "complete",
    reason: null,
  };
}

async function main() {
  const server = spawn("python3", ["-m", "http.server", String(port), "--bind", "127.0.0.1"], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
  let browser;
  try {
    await waitForServer(server);
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, timezoneId: "Asia/Taipei" });
    const page = await context.newPage();
    const calls = [];
    const consoleErrors = [];
    const pageErrors = [];
    const unexpectedRequests = [];
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("request", (request) => {
      if (!request.url().startsWith(baseUrl) && !request.url().startsWith(workerBase)) unexpectedRequests.push(request.url());
    });
    await page.route(`${workerBase}/**`, async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      const environment = url.searchParams.get("environment");
      calls.push({ method: request.method(), pathname: url.pathname, environment });
      if (request.method() === "OPTIONS") return jsonResponse(route, {}, 204);
      if (url.pathname === "/api/web/auth/login") {
        return jsonResponse(route, {
          authenticated: true,
          token: "STUB_TOKEN_1234567890123456789012345678901234567",
          expiresAt: "2099-01-01T00:00:00.000Z",
          organization: { id: "org-test" },
        });
      }
      if (url.pathname === "/api/web/auth/session") return jsonResponse(route, { authenticated: true, organization: { id: "org-test" } });
      if (url.pathname === "/api/web/auth/logout") return jsonResponse(route, { authenticated: false });
      if (url.pathname === "/api/farms") {
        return jsonResponse(route, { farms: [{ id: "farm-1", name: "示範場", environment: "production", siteName: "Production" }] });
      }
      if (url.pathname === "/api/houses") {
        return jsonResponse(route, { houses: url.searchParams.get("farmId") === "farm-1" ? [{ id: "house-1", farmId: "farm-1", name: "一舍", farmEnvironment: "production" }] : [] });
      }
      if (url.pathname === "/api/flocks") {
        return jsonResponse(route, { flocks: url.searchParams.get("farmId") === "farm-1" ? [{ id: "flock-1", farmId: "farm-1", houseId: "house-1", batchCode: "B-001", status: "closed", initialCount: 10 }] : [] });
      }
      if (url.pathname === "/api/ai/live-status") {
        return jsonResponse(route, {
          aiInvoked: false,
          context: {
            scope: { type: "flock", id: "flock-1" },
            scopeEntity: { id: "flock-1", environment: "production" },
            flocks: [{ id: "flock-1", currentStock: 0, status: "closed" }],
          },
        });
      }
      if (url.pathname === "/api/records" && request.method() === "GET") {
        return jsonResponse(route, { environment, records: [], lifecycleSummaries: [lifecycleSummary()] });
      }
      return jsonResponse(route, { error: "unexpected_test_route" }, 404);
    });

    await page.goto(`${baseUrl}/index.html?api-base=${encodeURIComponent(workerBase)}&cache-bust=canonical-lifecycle-readback-1#/dashboard`, { waitUntil: "networkidle" });
    await page.locator('[data-testid="web-auth-gate"]').waitFor();
    await page.locator("#web-admin-password").fill("stub-password");
    await page.locator("#web-login-form button[type=submit]").click();
    await page.locator('[data-testid="web-runtime-controls"]').waitFor();
    await page.locator('[data-nav="records"]').first().click();
    await page.locator('[data-testid="canonical-lifecycle-row"]').waitFor();

    const readback = page.locator('[data-testid="canonical-lifecycle-readback"]');
    const readbackText = await readback.innerText();
    assert.match(readbackText, /一舍/);
    assert.match(readbackText, /B-001/);
    assert.match(readbackText, /目前存欄 0 隻/);
    assert.match(readbackText, /清消完成，可準備下一批入雛/);
    assert.equal(await page.locator('[data-testid="canonical-lifecycle-unavailable"]').count(), 0);
    assert.equal(calls.some((call) => call.method === "POST" && call.pathname === "/api/records"), false);
    assert.equal(calls.some((call) => call.method === "GET" && call.pathname === "/api/records" && call.environment === "production"), true);
    assert.deepEqual(consoleErrors, []);
    assert.deepEqual(pageErrors, []);
    assert.deepEqual(unexpectedRequests, []);
    console.log("CANONICAL_LIFECYCLE_READBACK_E2E_PASS", JSON.stringify({ lifecycleRows: 1, businessWrites: 0, consoleErrors: 0, pageErrors: 0, unexpectedRequests: 0 }));
  } finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error("CANONICAL_LIFECYCLE_READBACK_E2E_FAIL", error.stack || error.message);
  process.exitCode = 1;
});
