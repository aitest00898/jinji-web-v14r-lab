const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const path = require("node:path");
const { chromium } = require("@playwright/test");

const root = path.resolve(__dirname, "../..");
const port = Number(process.env.CANONICAL_MANAGER_AWARENESS_PORT || 4226);
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
    setTimeout(() => { clearInterval(timer); reject(new Error("CANONICAL_MANAGER_AWARENESS_SERVER_TIMEOUT")); }, 10000);
  });
}

function jsonResponse(route, payload, status = 200) {
  const response = {
    status,
    headers: {
      "access-control-allow-origin": route.request().headers().origin || "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "accept,content-type,authorization",
      "access-control-max-age": "60",
      "content-type": "application/json",
    },
  };
  if (status !== 204) response.body = JSON.stringify(payload);
  return route.fulfill(response);
}

function lifecycleSummary(feedEstimate, labSubmission) {
  return {
    farm: { id: "farm-1", name: "示範場", environment: "production" },
    house: { id: "house-1", name: "一舍" },
    currentFlock: { id: "flock-1", batchCode: "B-001", chickInDate: "2026-01-01", initialCount: 10, status: "closed" },
    currentCycle: { id: "flock-1", flockId: "flock-1", batchCode: "B-001", chickInDate: "2026-01-01" },
    effectiveStock: 0,
    lifecycleStatus: "READY_NEXT_INTAKE",
    cleaningStatus: "completed",
    readyForNextIntake: true,
    dataCompleteness: "complete",
    feedEstimate,
    labSubmission,
  };
}

function canonicalRecords() {
  return [{
    id: "a8-record",
    farmId: "farm-1",
    houseId: "house-1",
    flockId: "flock-1",
    taxonomyId: "A8",
    family: "operational_observation",
    type: "observation",
    subtype: "foot_odor",
    destination: "abnormal_events",
    occurredAt: "2026-09-10T04:00:00.000Z",
    createdAt: "2026-09-10T04:00:00.000Z",
    clientOperationId: "a8-client",
    effectiveStatus: "active",
    extent: "small",
    detail: "需要追蹤",
  }];
}

async function installCanonicalStub(page, calls, feedEstimate, labSubmission) {
  await page.route(`${workerBase}/**`, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const environment = url.searchParams.get("environment");
    calls.push({ method: request.method(), pathname: url.pathname, environment });
    if (request.method() === "OPTIONS") return jsonResponse(route, {}, 204);
    if (url.pathname === "/api/web/auth/login") return jsonResponse(route, {
      authenticated: true,
      token: "STUB_TOKEN_1234567890123456789012345678901234567",
      expiresAt: "2099-01-01T00:00:00.000Z",
      organization: { id: "org-test" },
    });
    if (url.pathname === "/api/web/auth/session") return jsonResponse(route, { authenticated: true, organization: { id: "org-test" } });
    if (url.pathname === "/api/web/auth/logout") return jsonResponse(route, { authenticated: false });
    if (url.pathname === "/api/farms") return jsonResponse(route, { farms: [{ id: "farm-1", name: "示範場", environment: "production", siteName: "Production" }] });
    if (url.pathname === "/api/houses") return jsonResponse(route, { houses: url.searchParams.get("farmId") === "farm-1" ? [{ id: "house-1", farmId: "farm-1", name: "一舍", farmEnvironment: "production" }] : [] });
    if (url.pathname === "/api/flocks") return jsonResponse(route, { flocks: url.searchParams.get("farmId") === "farm-1" ? [{ id: "flock-1", farmId: "farm-1", houseId: "house-1", batchCode: "B-001", status: "closed", initialCount: 10 }] : [] });
    if (url.pathname === "/api/ai/live-status") return jsonResponse(route, {
      aiInvoked: false,
      context: {
        scope: { type: "flock", id: "flock-1" },
        scopeEntity: { id: "flock-1", environment: "production" },
        flocks: [{ id: "flock-1", currentStock: 0, status: "closed" }],
      },
    });
    if (url.pathname === "/api/records" && request.method() === "GET") return jsonResponse(route, {
      environment,
      records: canonicalRecords(),
      lifecycleSummaries: [lifecycleSummary(feedEstimate, labSubmission)],
    });
    return jsonResponse(route, { error: "unexpected_test_route" }, 404);
  });
}

async function runViewport(browser, viewport, feedEstimate, labSubmission) {
  const context = await browser.newContext({ viewport, timezoneId: "Asia/Taipei" });
  const page = await context.newPage();
  const calls = [];
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await installCanonicalStub(page, calls, feedEstimate, labSubmission);
  await page.goto(`${baseUrl}/index.html?api-base=${encodeURIComponent(workerBase)}&cache-bust=canonical-manager-awareness-1#/dashboard`, { waitUntil: "networkidle" });
  await page.locator('[data-testid="web-auth-gate"]').waitFor();
  await page.locator("#web-admin-password").fill("stub-password");
  await page.locator("#web-login-form button[type=submit]").click();
  await page.locator('[data-testid="canonical-manager-awareness"]').waitFor();
  await page.locator('[data-testid="canonical-lifecycle-row"]').waitFor();
  await page.waitForFunction(() => {
    const status = document.querySelector('[data-testid="canonical-manager-status"]');
    return Boolean(status && status.textContent.includes("來源：Worker canonical read model"));
  });

  const manager = page.locator('[data-testid="canonical-manager-awareness"]');
  const managerText = await manager.innerText();
  assert.match(managerText, /示範場/);
  assert.match(managerText, /一舍/);
  assert.match(managerText, /B-001/);
  assert.match(managerText, /目前存欄 0 隻/);
  assert.match(managerText, /清消完成，可準備下一批入雛/);
  assert.match(managerText, new RegExp(labSubmission.statusLabel));
  assert.match(managerText, /飼料估算/);
  if (feedEstimate.status === "ESTIMATE_AVAILABLE") {
    assert.match(managerText, /目前水次估算 180\.5 kg/);
    assert.match(managerText, /參考 4 水/);
  } else {
    assert.match(managerText, /資料不足，暫不估算/);
    assert.doesNotMatch(managerText, /0 kg/);
  }
  assert.match(managerText, /A8/);
  assert.doesNotMatch(managerText, /今日摘要|Plus 測試趨勢|測試資料整理/);
  assert.equal(await page.locator('[data-testid="canonical-manager-attention"] .list-row').count(), 1);
  assert.equal(await page.locator('[data-testid="canonical-manager-recent-records"] .list-row').count(), 1);
  assert.ok(calls.some((call) => call.method === "GET" && call.pathname === "/api/records" && call.environment === "production"));
  assert.equal(calls.some((call) => call.method === "POST" && call.pathname !== "/api/web/auth/login"), false);
  assert.deepEqual(consoleErrors, []);
  assert.deepEqual(pageErrors, []);
  await context.close();
}

async function main() {
  const server = spawn("python3", ["-m", "http.server", String(port), "--bind", "127.0.0.1"], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
  let browser;
  try {
    await waitForServer(server);
    browser = await chromium.launch({ headless: true });
    await runViewport(browser, { width: 390, height: 844 }, {
      status: "ESTIMATE_AVAILABLE",
      estimate: 180.5,
      range: { lower: 160, upper: 205 },
      unit: "kg",
      referenceCycleCount: 4,
      availableEligibleCycleCount: 4,
      missingData: [],
    }, {
      status: "incomplete",
      statusLabel: "送驗：結果待補",
      dataCompleteness: "complete",
    });
    await runViewport(browser, { width: 1440, height: 900 }, {
      status: "INSUFFICIENT_DATA",
      estimate: null,
      range: null,
      unit: "kg",
      referenceCycleCount: 0,
      availableEligibleCycleCount: 1,
      missingData: ["minimum_eligible_completed_cycles"],
    }, {
      status: "waiting",
      statusLabel: "送驗：等待結果",
      dataCompleteness: "complete",
    });
    await runViewport(browser, { width: 1280, height: 800 }, {
      status: "ESTIMATE_AVAILABLE",
      estimate: 180.5,
      range: { lower: 160, upper: 205 },
      unit: "kg",
      referenceCycleCount: 4,
      availableEligibleCycleCount: 4,
      missingData: [],
    }, {
      status: "none",
      statusLabel: "送驗：無逾期未完成",
      dataCompleteness: "complete",
    });
    console.log("CANONICAL_MANAGER_AWARENESS_E2E_PASS", JSON.stringify({ viewports: 3, authoritativeReadModel: true, labSubmissionStates: ["incomplete", "waiting", "none"], feedEstimateStates: ["available", "insufficient"], fixtureDashboard: false, businessWrites: 0 }));
  } finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error("CANONICAL_MANAGER_AWARENESS_E2E_FAIL", error.stack || error.message);
  process.exitCode = 1;
});
