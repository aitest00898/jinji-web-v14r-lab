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
    assert.equal(init.credentials, "include");
    assert.equal(init.headers.accept, "application/json");
    assert.equal(Object.prototype.hasOwnProperty.call(init.headers, "Authorization"), false);
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
