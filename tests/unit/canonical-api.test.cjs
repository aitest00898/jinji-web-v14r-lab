const test = require("node:test");
const assert = require("node:assert/strict");
const { CanonicalApiError, createClient } = require("../../src/canonical-api.js");

function response(payload, status = 200) {
  return { ok: status >= 200 && status < 300, status, async json() { return payload; } };
}

function command(id = "record-1", overrides = {}) {
  return {
    kind: "record_command",
    version: 1,
    taxonomyId: "O9",
    destination: "operational_events",
    authoritativeDestination: "operational_events",
    parallelAuthoritativeDestinations: [],
    stockEffect: -1,
    sourceChannel: "web",
    clientOperationId: `operation-${id}`,
    record: {
      id,
      taxonomyId: "O9",
      family: "operational_event",
      type: "event",
      subtype: "mortality",
      occurredAt: "2026-09-09T09:30:00+08:00",
      createdAt: "2026-09-09T01:30:00.000Z",
      farmId: "farm-a",
      houseId: "house-a",
      flockId: "flock-a",
      sourceChannel: "web",
      rawText: "死亡1",
      clientOperationId: `operation-${id}`,
      confirmedBy: "web-test",
      quantity: 1,
      unit: "隻",
      ...overrides,
    },
  };
}

test("canonical API uses one records boundary for create, correction, reversal, and reads", async () => {
  const calls = [];
  const client = createClient({
    base: "https://worker.example.test/",
    fetchImpl: async (url, init) => {
      calls.push({ url: new URL(url), init });
      return response({ record: { created: true }, records: [] });
    },
  });

  assert.equal(client.isConfigured(), true);
  assert.equal(client.environment, "production");
  await client.createRecord(command("create-1"));
  await client.correctRecord("create-1", command("correct-1", { correctionOfId: "create-1", quantity: 2 }));
  await client.reverseRecord("create-1", command("reverse-1", { reversalOfId: "create-1" }));
  await client.listRecords({ farmId: "farm-a", limit: 10 });

  assert.deepEqual(calls.map(({ url }) => `${url.pathname}?${url.searchParams.toString()}`), [
    "/api/records?environment=production",
    "/api/records/create-1/correct?environment=production",
    "/api/records/create-1/reverse?environment=production",
    "/api/records?environment=production&farmId=farm-a&limit=10",
  ]);
  for (const { init } of calls) {
    assert.equal(init.credentials, "omit");
    assert.equal(init.headers.accept, "application/json");
    assert.equal(Object.prototype.hasOwnProperty.call(init.headers, "Authorization"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(init.headers, "authorization"), false);
  }
  assert.deepEqual(JSON.parse(calls[0].init.body), { command: command("create-1") });
  assert.deepEqual(JSON.parse(calls[1].init.body).command.record.correctionOfId, "create-1");
});

test("test scope requires an explicit test-admin marker and unknown scope fails closed", async () => {
  const calls = [];
  const testClient = createClient({
    base: "https://worker.example.test",
    environment: "test",
    testAdmin: true,
    fetchImpl: async (url, init) => {
      calls.push({ url: new URL(url), init });
      return response({ record: { created: true } }, 201);
    },
  });
  await testClient.createRecord(command("test-1"));
  assert.equal(calls[0].url.searchParams.get("environment"), "test");

  const missingMarker = createClient({ base: "https://worker.example.test", environment: "test", fetchImpl: async () => response({}) });
  assert.equal(missingMarker.isConfigured(), false);
  await assert.rejects(() => missingMarker.createRecord(command("test-no-admin")), (error) => error instanceof CanonicalApiError && error.code === "CANONICAL_API_TEST_AUTH_REQUIRED");

  const unknown = createClient({ base: "https://worker.example.test", environment: "staging", fetchImpl: async () => response({}) });
  assert.equal(unknown.isConfigured(), false);
  await assert.rejects(() => unknown.createRecord(command("unknown-scope")), (error) => error instanceof CanonicalApiError && error.code === "CANONICAL_API_ENV_INVALID");
});

test("unconfigured Lab client never sends a request and rejects non-RecordCommand payloads", async () => {
  let calls = 0;
  const client = createClient({ fetchImpl: async () => { calls += 1; return response({}); } });
  assert.equal(client.isConfigured(), false);
  await assert.rejects(() => client.createRecord(command("no-base")), (error) => error.code === "CANONICAL_API_NOT_CONFIGURED");
  assert.throws(() => createClient({ base: "https://worker.example.test", fetchImpl: async () => response({}) }).createRecord({ kind: "legacy_event" }), (error) => error.code === "CANONICAL_COMMAND_REQUIRED");
  assert.equal(calls, 0);
});

test("browser auth keeps the session token in memory and gates Test scope behind explicit selection", async () => {
  const calls = [];
  const client = createClient({
    base: "https://worker.example.test",
    fetchImpl: async (url, init) => {
      calls.push({ url: new URL(url), init });
      if (calls.length === 1) return response({ authenticated: true, token: "A".repeat(43), expiresAt: "2026-09-09T02:00:00.000Z", organization: { id: "org-test" } });
      if (calls.at(-1).url.pathname === "/api/web/auth/logout") return response({ authenticated: false });
      return response({ record: { created: true }, records: [] }, 201);
    },
  });

  assert.throws(() => client.setEnvironment("test", { explicitChoice: true }), /authenticated/);
  const auth = await client.login("browser-only-password");
  assert.deepEqual(auth, { authenticated: true, expiresAt: "2026-09-09T02:00:00.000Z", organization: { id: "org-test" } });
  assert.equal(client.state().authenticated, true);
  assert.equal(JSON.stringify(client.state()).includes("A".repeat(43)), false);

  client.setEnvironment("test", { explicitChoice: true });
  await client.createRecord(command("auth-1"));
  assert.equal(calls[1].init.credentials, "omit");
  assert.equal(calls[1].init.headers.authorization, `Bearer ${"A".repeat(43)}`);
  assert.equal(calls[1].url.searchParams.get("environment"), "test");

  await client.logout();
  assert.equal(calls[2].url.pathname, "/api/web/auth/logout");
  assert.equal(calls[2].init.headers.authorization, `Bearer ${"A".repeat(43)}`);
  assert.equal(client.isAuthenticated(), false);
  assert.equal(Object.prototype.hasOwnProperty.call(client.state(), "token"), false);
});

test("Pages runtime is allowlisted and unknown hosted origins fail closed", () => {
  const pages = createClient({
    location: { origin: "https://aitest00898.github.io", pathname: "/jinji-web-v14r-lab/", href: "https://aitest00898.github.io/jinji-web-v14r-lab/" },
    fetchImpl: async () => response({}),
  });
  assert.equal(pages.state().runtimeMode, "production_api");
  assert.equal(pages.base, "https://chicken-line-production.jinji-assistant.workers.dev");
  assert.equal(pages.state().baseSource, "pages-origin-allowlist");

  const overridden = createClient({
    location: { origin: "https://aitest00898.github.io", pathname: "/jinji-web-v14r-lab/", href: "https://aitest00898.github.io/jinji-web-v14r-lab/" },
    searchParams: new URLSearchParams("api-base=https%3A%2F%2Fevil.example.test"),
    fetchImpl: async () => response({}),
  });
  assert.equal(overridden.isConfigured(), false);
  assert.equal(overridden.state().configurationError, "CANONICAL_API_PAGES_BASE_OVERRIDE_FORBIDDEN");

  const unknown = createClient({
    location: { origin: "https://fork.example.test", pathname: "/", href: "https://fork.example.test/" },
    fetchImpl: async () => response({}),
  });
  assert.equal(unknown.state().runtimeMode, "unsupported_host");
  assert.equal(unknown.isConfigured(), false);
});
