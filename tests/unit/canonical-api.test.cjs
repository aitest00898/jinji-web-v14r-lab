const test = require("node:test");
const assert = require("node:assert/strict");
const { CanonicalApiError, DEV_SESSION_STORAGE_KEY, canonicalCurrentStock, canonicalLiveStatusPayload, canonicalRecordsPayload, createClient, normalizeCanonicalApiError } = require("../../src/canonical-api.js");

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

test("canonical API error normalizer accepts flat and nested envelopes and fails closed", () => {
  assert.deepEqual(normalizeCanonicalApiError(
    { error: "invalid_credentials", message: "管理密碼錯誤。" },
    401,
  ), {
    code: "invalid_credentials",
    message: "管理密碼錯誤。",
    status: 401,
  });
  assert.deepEqual(normalizeCanonicalApiError(
    { error: { code: "invalid_credentials", message: "管理密碼錯誤。" } },
    401,
  ), {
    code: "invalid_credentials",
    message: "管理密碼錯誤。",
    status: 401,
  });
  assert.deepEqual(normalizeCanonicalApiError(
    { error: "future_worker_code", message: "server detail is not UI copy" },
    409,
  ), {
    code: "future_worker_code",
    message: "server detail is not UI copy",
    status: 409,
  });
  assert.deepEqual(normalizeCanonicalApiError(
    { error: { code: "future_nested_code", message: "nested detail" } },
    500,
  ), {
    code: "future_nested_code",
    message: "nested detail",
    status: 500,
  });

  const missingMessage = normalizeCanonicalApiError({ error: "invalid_credentials" }, 400);
  assert.deepEqual(missingMessage, {
    code: "invalid_credentials",
    message: "Canonical API rejected the request.",
    status: 400,
  });
  const nestedMissingMessage = normalizeCanonicalApiError({ error: { code: "unauthorized" } }, 401);
  assert.deepEqual(nestedMissingMessage, {
    code: "unauthorized",
    message: "Canonical API rejected the request.",
    status: 401,
  });

  for (const [payload, status] of [
    [{ message: "missing error" }, 403],
    [{ error: { code: 42, message: "non-string code" } }, 404],
    [null, 409],
    ["not-json-object", 429],
    [[], 500],
  ]) {
    const normalized = normalizeCanonicalApiError(payload, status);
    assert.equal(normalized.code, `CANONICAL_API_HTTP_${status}`);
    assert.equal(normalized.message, "Canonical API rejected the request.");
    assert.equal(normalized.status, status);
  }
  assert.equal(normalizeCanonicalApiError({ error: "invalid_credentials" }, "401").status, null);
});

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

test("loopback dev-session-persist restores only the Worker session token and logout clears it", async () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
  const token = "C".repeat(43);
  const location = { hostname: "127.0.0.1", protocol: "http:", origin: "http://127.0.0.1", href: "http://127.0.0.1/" };
  const searchParams = new URLSearchParams("dev-session-persist=1");
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url: new URL(url), init });
    const pathname = new URL(url).pathname;
    if (pathname === "/api/web/auth/login") return response({ authenticated: true, token, expiresAt: "2026-09-10T02:00:00.000Z", organization: { id: "org-test" } });
    if (pathname === "/api/web/auth/session") return response({ authenticated: true, expiresAt: "2026-09-10T02:00:00.000Z", organization: { id: "org-test" } });
    return response({ authenticated: false });
  };
  const client = createClient({ base: "https://worker.example.test", location, searchParams, storage, fetchImpl });

  assert.equal(client.state().sessionPersistenceEnabled, true);
  await client.login("password-is-not-stored");
  assert.equal(values.get(DEV_SESSION_STORAGE_KEY), token);
  assert.equal(JSON.stringify([...values.values()]).includes("password-is-not-stored"), false);
  await client.logout();
  assert.equal(values.has(DEV_SESSION_STORAGE_KEY), false);

  values.set(DEV_SESSION_STORAGE_KEY, token);
  const restoredCalls = [];
  const restoredClient = createClient({
    base: "https://worker.example.test",
    location,
    searchParams,
    storage,
    fetchImpl: async (url, init) => {
      restoredCalls.push({ url: new URL(url), init });
      return response({ authenticated: true, expiresAt: "2026-09-10T02:00:00.000Z", organization: { id: "org-test" } });
    },
  });
  const restored = await restoredClient.restorePersistedSession();
  assert.equal(restored.authenticated, true);
  assert.equal(restoredCalls[0].url.pathname, "/api/web/auth/session");
  assert.equal(restoredCalls[0].init.headers.authorization, `Bearer ${token}`);
  await restoredClient.logout();
  assert.equal(values.has(DEV_SESSION_STORAGE_KEY), false);
});

test("dev-session-persist is ignored outside loopback hosts", async () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
  const client = createClient({
    base: "https://worker.example.test",
    location: { hostname: "evil.example.test", protocol: "https:", origin: "https://evil.example.test", href: "https://evil.example.test/" },
    searchParams: new URLSearchParams("dev-session-persist=1"),
    storage,
    fetchImpl: async () => response({ authenticated: true, token: "D".repeat(43) }),
  });
  assert.equal(client.state().sessionPersistenceEnabled, false);
  await client.login("outside-loopback");
  assert.equal(values.size, 0);
});

test("invalid persisted session is cleared on 401", async () => {
  const values = new Map([[DEV_SESSION_STORAGE_KEY, "E".repeat(43)]]);
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
  const client = createClient({
    base: "https://worker.example.test",
    location: { hostname: "localhost", protocol: "http:", origin: "http://localhost", href: "http://localhost/" },
    searchParams: new URLSearchParams("dev-session-persist=1"),
    storage,
    fetchImpl: async () => ({ ok: false, status: 401, async json() { return { error: "unauthorized" }; } }),
  });
  await assert.rejects(() => client.restorePersistedSession(), (error) => error.code === "unauthorized");
  assert.equal(values.has(DEV_SESSION_STORAGE_KEY), false);
  assert.equal(client.isAuthenticated(), false);
});

test("flat Worker login rejection preserves code/status without creating auth state", async () => {
  const client = createClient({
    base: "https://worker.example.test",
    fetchImpl: async () => response({ error: "invalid_credentials", message: "管理密碼錯誤。" }, 401),
  });

  await assert.rejects(() => client.login("browser-only-password"), (error) => {
    assert.equal(error instanceof CanonicalApiError, true);
    assert.equal(error.code, "invalid_credentials");
    assert.equal(error.status, 401);
    assert.equal(error.message, "管理密碼錯誤。");
    return true;
  });
  assert.equal(client.isAuthenticated(), false);
  assert.deepEqual(client.authState(), { authenticated: false, expiresAt: null, organization: null });
});

test("malformed and non-JSON errors remain bounded, while protected 401 clears auth", async () => {
  let call = 0;
  const client = createClient({
    base: "https://worker.example.test",
    fetchImpl: async (url) => {
      call += 1;
      const pathname = new URL(url).pathname;
      if (pathname === "/api/web/auth/login") return response({ authenticated: true, token: "B".repeat(43) });
      if (call === 2) return response({ error: { message: "missing code" } }, 400);
      return { ok: false, status: 401, async json() { throw new Error("not-json"); } };
    },
  });

  await client.login("browser-only-password");
  await assert.rejects(() => client.createRecord(command("malformed")), (error) => {
    assert.equal(error.code, "CANONICAL_API_HTTP_400");
    assert.equal(error.status, 400);
    return true;
  });
  await assert.rejects(() => client.createRecord(command("non-json")), (error) => {
    assert.equal(error.code, "CANONICAL_API_HTTP_401");
    assert.equal(error.status, 401);
    return true;
  });
  assert.equal(client.isAuthenticated(), false);
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

test("canonical master-data reads use the authenticated read boundary and preserve scope", async () => {
  const calls = [];
  const client = createClient({
    base: "https://worker.example.test",
    environment: "test",
    testAdmin: true,
    fetchImpl: async (url, init) => {
      const parsed = new URL(url);
      calls.push({ url: parsed, init });
      if (parsed.pathname === "/api/farms") return response({ farms: [{ id: "farm-test", name: "金雞測試場", environment: "test" }] });
      if (parsed.pathname === "/api/houses") return response({ houses: [{ id: "house-test", farmId: "farm-test", name: "測試1舍", farmEnvironment: "test" }] });
      return response({ flocks: [{ id: "flock-test", farmId: "farm-test", houseId: "house-test", batchCode: "TEST-BATCH-001" }] });
    },
  });

  const farms = await client.listFarms();
  const houses = await client.listHouses("farm-test");
  const flocks = await client.listFlocks("farm-test");
  assert.equal(farms[0].name, "金雞測試場");
  assert.equal(houses[0].farmId, "farm-test");
  assert.equal(flocks[0].houseId, "house-test");
  assert.deepEqual(calls.map(({ url }) => `${url.pathname}?${url.searchParams.toString()}`), [
    "/api/farms?environment=test",
    "/api/houses?environment=test&farmId=farm-test",
    "/api/flocks?environment=test&farmId=farm-test",
  ]);
  for (const { init } of calls) {
    assert.equal(init.method, "GET");
    assert.equal(init.credentials, "omit");
    assert.equal(init.headers.accept, "application/json");
  }
});

test("canonical stock projection preserves zero and rejects missing or cross-scope values", () => {
  assert.equal(canonicalCurrentStock({ currentStock: 963, stock: 1000 }), 963);
  assert.equal(canonicalCurrentStock({ currentStock: 0, stock: 1000 }), 0);
  assert.equal(canonicalCurrentStock({ stock: 12 }), 12);
  assert.equal(canonicalCurrentStock({ currentStock: null, stock: 12 }), null);
  assert.equal(canonicalCurrentStock({ currentStock: -1 }), null);
  assert.equal(canonicalCurrentStock({ currentStock: "963" }), null);

  const valid = canonicalLiveStatusPayload({
    aiInvoked: false,
    context: {
      scope: { type: "flock", id: "flock-test" },
      scopeEntity: { id: "flock-test", environment: "test" },
      flocks: [{ id: "flock-test", currentStock: 963, status: "active" }],
    },
  }, "test", "flock", "flock-test");
  assert.equal(valid.context.flocks[0].currentStock, 963);
  assert.equal(valid.aiInvoked, false);

  const zero = canonicalLiveStatusPayload({
    aiInvoked: false,
    context: {
      scope: { type: "flock", id: "flock-test" },
      scopeEntity: { id: "flock-test", environment: "test" },
      flocks: [{ id: "flock-test", currentStock: 0 }],
    },
  }, "test", "flock", "flock-test");
  assert.equal(zero.context.flocks[0].currentStock, 0);

  for (const [payload, expectedCode] of [
    [{ aiInvoked: true, context: {} }, "CANONICAL_STOCK_READ_INVALID"],
    [{ aiInvoked: false, context: { scope: { type: "flock", id: "flock-test" }, scopeEntity: { environment: "test" }, flocks: [{ id: "flock-test" }] } }, "CANONICAL_STOCK_READ_INVALID"],
    [{ aiInvoked: false, context: { scope: { type: "flock", id: "flock-test" }, scopeEntity: { environment: "production" }, flocks: [{ id: "flock-test", currentStock: 963 }] } }, "CANONICAL_STOCK_SCOPE_INVALID"],
    [{ aiInvoked: false, context: { scope: { type: "flock", id: "other" }, scopeEntity: { environment: "test" }, flocks: [{ id: "flock-test", currentStock: 963 }] } }, "CANONICAL_STOCK_SCOPE_INVALID"],
  ]) {
    assert.throws(() => canonicalLiveStatusPayload(payload, "test", "flock", "flock-test"), (error) => {
      assert.equal(error instanceof CanonicalApiError, true);
      assert.equal(error.code, expectedCode);
      return true;
    });
  }
});

test("canonical flock stock client uses the existing read-only live-status projection", async () => {
  const calls = [];
  const client = createClient({
    base: "https://worker.example.test",
    environment: "test",
    testAdmin: true,
    fetchImpl: async (url, init) => {
      calls.push({ url: new URL(url), init });
      return response({
        aiInvoked: false,
        context: {
          scope: { type: "flock", id: "flock-test" },
          scopeEntity: { id: "flock-test", environment: "test" },
          flocks: [{ id: "flock-test", currentStock: 963 }],
        },
      });
    },
  });

  assert.equal(await client.getFlockCurrentStock("flock-test"), 963);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url.pathname, "/api/ai/live-status");
  assert.equal(calls[0].url.searchParams.get("environment"), "test");
  assert.equal(calls[0].url.searchParams.get("scopeType"), "flock");
  assert.equal(calls[0].url.searchParams.get("scopeId"), "flock-test");
  assert.equal(calls[0].init.method, "GET");
  assert.equal(calls[0].init.credentials, "omit");
  assert.equal(calls[0].init.headers.accept, "application/json");
});

test("canonical record reads validate identity, authority, safety, and environment before UI use", async () => {
  const valid = {
    id: "record-read-1",
    taxonomyId: "O4",
    destination: "recording_events",
    readStatus: "valid",
    record: { id: "record-read-1", taxonomyId: "O4", averageWeight: 1.8 },
  };
  const payload = canonicalRecordsPayload({ environment: "test", records: [valid] }, "test");
  assert.equal(payload.environment, "test");
  assert.equal(payload.records[0].id, "record-read-1");
  assert.equal(payload.records[0].record.averageWeight, 1.8);

  const unsafe = canonicalRecordsPayload({ records: [{ ...valid, id: "unsafe-1", readStatus: "unsafe", record: null }] }, "production");
  assert.equal(unsafe.environment, "production");
  assert.equal(unsafe.records[0].readStatus, "unsafe");

  const unsafeWithoutTaxonomy = canonicalRecordsPayload({ records: [{
    id: "unsafe-no-taxonomy",
    taxonomyId: "",
    destination: "operational_actions",
    readStatus: "unsafe",
    readErrorCode: "LEGACY_OPERATIONAL_ACTION_NOT_CANONICAL",
    record: null,
  }] }, "production");
  assert.equal(unsafeWithoutTaxonomy.records[0].id, "unsafe-no-taxonomy");
  assert.equal(unsafeWithoutTaxonomy.records[0].taxonomyId, "");
  assert.equal(unsafeWithoutTaxonomy.records[0].record, null);

  for (const invalid of [
    { records: [{ ...valid, id: "" }] },
    { records: [{ ...valid }, { ...valid }] },
    { records: [{ ...valid, destination: "unknown_table" }] },
    { records: [{ ...valid, readStatus: "unknown" }] },
    { records: [{ ...valid, record: "lossy text" }] },
  ]) {
    assert.throws(() => canonicalRecordsPayload(invalid, "production"), (error) => {
      assert.equal(error instanceof CanonicalApiError, true);
      assert.equal(error.code, "CANONICAL_RECORD_READ_INVALID");
      return true;
    });
  }
  assert.throws(() => canonicalRecordsPayload({ environment: "production", records: [] }, "test"), (error) => {
    assert.equal(error.code, "CANONICAL_RECORD_ENVIRONMENT_MISMATCH");
    return true;
  });
});

test("canonical record reads normalize the deployed legacy envelope without enabling writes", () => {
  const payload = canonicalRecordsPayload({
    environment: "test",
    records: [
      {
        id: "o4-record",
        taxonomyId: "O4",
        family: "operational_event",
        type: "event",
        subtype: "weigh",
        destination: "recording_events",
        occurredAt: "2026-09-10T01:00:00.000Z",
        createdAt: "2026-09-10T01:00:00.000Z",
        farmId: "test-farm",
        houseId: "test-house",
        flockId: "test-flock",
        sourceChannel: "web",
        clientOperationId: "o4-client",
        averageWeight: 1.8,
        weightUnit: "kg",
        ageDays: 39,
        sex: "mixed",
      },
      {
        id: "o2-original",
        taxonomyId: "O2",
        family: "operational_action",
        type: "action",
        subtype: "medication",
        destination: "operational_actions",
        occurredAt: "2026-09-10T02:00:00.000Z",
        createdAt: "2026-09-10T02:00:00.000Z",
        farmId: "test-farm",
        houseId: "test-house",
        flockId: "test-flock",
        sourceChannel: "web",
        clientOperationId: "o2-client",
        content: "original medication",
        lifecycleStatus: "active",
      },
      {
        id: "o2-correction",
        taxonomyId: "O2",
        family: "operational_action",
        type: "action",
        subtype: "medication",
        destination: "operational_actions",
        occurredAt: "2026-09-10T03:00:00.000Z",
        createdAt: "2026-09-10T03:00:00.000Z",
        farmId: "test-farm",
        houseId: "test-house",
        flockId: "test-flock",
        sourceChannel: "web",
        clientOperationId: "o2-correction-client",
        correctionOfId: "o2-original",
        content: "corrected medication",
      },
      {
        id: "a8-record",
        taxonomyId: "A8",
        family: "operational_observation",
        type: "observation",
        subtype: "foot_odor",
        destination: "abnormal_events",
        occurredAt: "2026-09-10T04:00:00.000Z",
        createdAt: "2026-09-10T04:00:00.000Z",
        farmId: "test-farm",
        houseId: "test-house",
        flockId: "test-flock",
        sourceChannel: "web",
        clientOperationId: "a8-client",
        extent: "small",
        detail: "test detail",
      },
      {
        id: "o3-original",
        taxonomyId: "O3",
        family: "operational_event",
        type: "event",
        subtype: "shipment",
        destination: "operational_events",
        occurredAt: "2026-09-10T05:00:00.000Z",
        createdAt: "2026-09-10T05:00:00.000Z",
        farmId: "test-farm",
        houseId: "test-house",
        flockId: "test-flock",
        sourceChannel: "web",
        clientOperationId: "o3-client",
        quantity: 1,
        unit: "隻",
        sex: "male",
        totalWeight: 2,
        weightUnit: "kg",
      },
      {
        id: "o3-reversal",
        taxonomyId: "O3",
        family: "operational_event",
        type: "event",
        subtype: "shipment",
        destination: "operational_events",
        occurredAt: "2026-09-10T06:00:00.000Z",
        createdAt: "2026-09-10T06:00:00.000Z",
        farmId: "test-farm",
        houseId: "test-house",
        flockId: "test-flock",
        sourceChannel: "web",
        clientOperationId: "o3-reversal-client",
        reversalOfId: "o3-original",
        quantity: 1,
        unit: "隻",
        sex: "male",
      },
    ],
  }, "test");

  assert.deepEqual(payload.records.map((record) => record.taxonomyId).sort(), ["A8", "O2", "O2", "O3", "O3", "O4"]);
  assert.equal(payload.records.every((record) => record.readStatus === "unsafe" && record.record === null), true);
  assert.equal(payload.records.find((record) => record.id === "o4-record").fields.averageWeight, 1.8);
  assert.equal(payload.records.find((record) => record.id === "o4-record").derivedFields.ageDays, 39);
  assert.equal(payload.records.find((record) => record.id === "a8-record").fields.extent, "small");

  const o2Original = payload.records.find((record) => record.id === "o2-original");
  const o2Correction = payload.records.find((record) => record.id === "o2-correction");
  assert.equal(o2Original.effectiveStatus, "corrected");
  assert.equal(o2Original.isEffective, false);
  assert.equal(o2Original.lineage.correctedById, "o2-correction");
  assert.equal(o2Correction.effectiveStatus, "replacement");
  assert.equal(o2Correction.lineage.correctionOfId, "o2-original");

  const o3Original = payload.records.find((record) => record.id === "o3-original");
  const o3Reversal = payload.records.find((record) => record.id === "o3-reversal");
  assert.equal(o3Original.effectiveStatus, "reversed");
  assert.equal(o3Original.isEffective, false);
  assert.equal(o3Original.lineage.reversedById, "o3-reversal");
  assert.equal(o3Reversal.effectiveStatus, "reversed");
  assert.equal(o3Reversal.lineage.reversalOfId, "o3-original");
  assert.equal(o3Original.correctionSafe, false);
  assert.equal(o3Original.reversalSafe, false);
});

test("canonical record reads distinguish valid empty responses from malformed responses", () => {
  assert.deepEqual(canonicalRecordsPayload({ environment: "test", records: [] }, "test").records, []);
  assert.throws(() => canonicalRecordsPayload({ environment: "test", records: [{ id: "broken", destination: "recording_events" }] }, "test"), (error) => {
    assert.equal(error instanceof CanonicalApiError, true);
    assert.equal(error.code, "CANONICAL_RECORD_READ_INVALID");
    return true;
  });
});

test("canonical master-data reads fail closed on duplicate, wrong-parent, and wrong-environment rows", async () => {
  const invalidPayloads = [
    { farms: [{ id: "farm-test", name: "金雞測試場", environment: "test" }, { id: "farm-test", name: "重複", environment: "test" }] },
    { houses: [{ id: "house-test", farmId: "other-farm", name: "測試1舍", farmEnvironment: "test" }] },
    { flocks: [{ id: "flock-test", farmId: "other-farm", houseId: "house-test", batchCode: "TEST-BATCH-001" }] },
    { farms: [{ id: "farm-production", name: "Production", environment: "production" }] },
  ];
  for (const [index, payload] of invalidPayloads.entries()) {
    const client = createClient({
      base: "https://worker.example.test",
      environment: "test",
      testAdmin: true,
      fetchImpl: async () => response(payload),
    });
    const operation = index === 0 || index === 3
      ? () => client.listFarms()
      : index === 1
        ? () => client.listHouses("farm-test")
        : () => client.listFlocks("farm-test");
    await assert.rejects(operation, (error) => error instanceof CanonicalApiError && error.code === "CANONICAL_MASTER_DATA_INVALID");
  }
  const client = createClient({ base: "https://worker.example.test", testAdmin: true, fetchImpl: async () => response({}) });
  await assert.rejects(() => client.listHouses(""), (error) => error.code === "CANONICAL_MASTER_DATA_FARM_REQUIRED");
  await assert.rejects(() => client.listFlocks(null), (error) => error.code === "CANONICAL_MASTER_DATA_FARM_REQUIRED");
});
