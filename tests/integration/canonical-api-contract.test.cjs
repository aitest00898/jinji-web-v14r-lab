const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const taxonomy = require("../../src/recording-taxonomy.js");
const commandApi = require("../../src/record-command.js");
const { CanonicalApiError, createClient } = require("../../src/canonical-api.js");

function response(payload, status = 201) {
  return { ok: status >= 200 && status < 300, status, async json() { return payload; } };
}

function recordFor(taxonomyId, index) {
  const definition = taxonomy.taxonomyDefinitionFor(taxonomyId);
  const record = {
    id: `web-${taxonomyId.toLowerCase()}-${index}`,
    taxonomyId,
    family: definition.family,
    type: definition.canonicalType,
    subtype: definition.canonicalSubtypes[0],
    occurredAt: "2026-09-09T09:30:00+08:00",
    createdAt: "2026-09-09T01:30:00.000Z",
    farmId: "test-farm-a",
    houseId: "test-house-a",
    flockId: "test-flock-a",
    sourceChannel: "web",
    rawText: `[Web guided] ${taxonomyId}`,
    clientOperationId: `web-operation-${taxonomyId.toLowerCase()}-${index}`,
    confirmedBy: "web-contract-test",
  };
  switch (taxonomyId) {
    case "O1": Object.assign(record, { subtype: "chick_in", maleCount: 6, femaleCount: 4, condition: "good", totalCount: 10, unit: "birds" }); break;
    case "O2": Object.assign(record, { subtype: "medication", content: "test medication" }); break;
    case "O3": Object.assign(record, { subtype: "shipment", quantity: 4, sex: "mixed", totalWeight: 8 }); break;
    case "O4": Object.assign(record, { subtype: "weigh", averageWeight: 1.8, sex: "mixed", chickInDate: "2026-08-01" }); break;
    case "O5": Object.assign(record, { subtype: "feed_order", vendor: "test vendor", weight: 10, weightUnit: "kg" }); break;
    case "O6": Object.assign(record, { subtype: "lab_test", submittedAt: "2026-09-09T09:30:00+08:00", content: "test sample", workflowStatus: "waiting_result" }); break;
    case "O7": Object.assign(record, { subtype: "disinfection", workflowStatus: "pending" }); break;
    case "O8": Object.assign(record, { subtype: "maintenance", maintenanceContent: "test maintenance" }); break;
    case "O9": Object.assign(record, { subtype: "mortality", quantity: 1, unit: "隻" }); break;
    case "A1": Object.assign(record, { subtype: "mortality_abnormality", extent: "medium", linkedMortalityEventId: "mortality-origin" }); break;
    case "A8": Object.assign(record, { subtype: "foot_odor", extent: "small", detail: "test detail" }); break;
    case "A12": Object.assign(record, { subtype: "feed", extent: "large", detail: "test equipment detail" }); break;
    case "A16": Object.assign(record, { subtype: "attack", extent: "medium", detail: "test site event" }); break;
    default: Object.assign(record, { extent: "small" });
  }
  taxonomy.validateCanonicalRecording(record);
  return commandApi.createRecordCommand(record);
}

test("Guided Web representative commands use the shared canonical API in explicit Test scope", async () => {
  const calls = [];
  const client = createClient({
    base: "https://worker.example.test",
    environment: "test",
    testAdmin: true,
    fetchImpl: async (url, init) => {
      calls.push({ url: new URL(url), init });
      return response({ record: { created: true }, records: [] });
    },
  });
  const ids = ["O1", "O2", "O3", "O4", "O6", "O9", "A1", "A8", "A12", "A16"];
  const commands = ids.map((id, index) => recordFor(id, index));
  for (const command of commands) await client.createRecord(command);
  const correction = recordFor("O9", 100);
  correction.record.correctionOfId = commands[5].record.id;
  await client.correctRecord(commands[5].record.id, correction);
  const reversal = recordFor("O9", 101);
  reversal.record.reversalOfId = commands[5].record.id;
  await client.reverseRecord(commands[5].record.id, reversal);
  await client.listRecords({ farmId: "test-farm-a" });

  assert.equal(calls.length, 13);
  assert.deepEqual(calls.slice(0, 10).map(({ url }) => url.pathname), Array(10).fill("/api/records"));
  assert.equal(calls[10].url.pathname, `/api/records/${commands[5].record.id}/correct`);
  assert.equal(calls[11].url.pathname, `/api/records/${commands[5].record.id}/reverse`);
  assert.equal(calls[12].url.pathname, "/api/records");
  for (const { url, init } of calls) {
    assert.equal(url.searchParams.get("environment"), "test");
    assert.equal(init.credentials, "omit");
    assert.equal(init.headers.accept, "application/json");
    assert.equal(Object.prototype.hasOwnProperty.call(init.headers, "Authorization"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(init.headers, "authorization"), false);
  }
  const destinations = calls.slice(0, 10).map(({ init }) => JSON.parse(init.body).command.authoritativeDestination);
  assert.deepEqual(destinations, [
    "recording_events", "operational_actions", "operational_events", "recording_events", "operational_actions",
    "operational_events", "abnormal_events", "abnormal_events", "abnormal_events", "abnormal_events",
  ]);
  assert.equal(JSON.parse(calls[10].init.body).command.record.correctionOfId, commands[5].record.id);
  assert.equal(JSON.parse(calls[11].init.body).command.record.reversalOfId, commands[5].record.id);
});

test("create, correction, and reversal share the same error normalizer", async () => {
  const calls = [];
  const client = createClient({
    base: "https://worker.example.test",
    fetchImpl: async (url) => {
      const pathname = new URL(url).pathname;
      calls.push(pathname);
      if (pathname.endsWith("/correct")) return response({ error: { code: "CANONICAL_RELATION_TARGET_MISMATCH", message: "nested detail" } }, 400);
      if (pathname.endsWith("/reverse")) return response({ error: "not_found", message: "flat detail" }, 404);
      return response({ error: "duplicate_client_operation", message: "replay" }, 409);
    },
  });
  const base = recordFor("O9", 200);

  for (const [operation, expectedPath, expectedCode, expectedStatus] of [
    [() => client.createRecord(base), "/api/records", "duplicate_client_operation", 409],
    [() => client.correctRecord(base.record.id, base), `/api/records/${base.record.id}/correct`, "CANONICAL_RELATION_TARGET_MISMATCH", 400],
    [() => client.reverseRecord(base.record.id, base), `/api/records/${base.record.id}/reverse`, "not_found", 404],
  ]) {
    await assert.rejects(operation, (error) => {
      assert.equal(error instanceof CanonicalApiError, true);
      assert.equal(error.code, expectedCode);
      assert.equal(error.status, expectedStatus);
      return true;
    });
    assert.equal(calls.at(-1), expectedPath);
  }
});

test("Web canonical recording scope uses master-data reads without fixture fallback", () => {
  const appSource = fs.readFileSync(path.join(__dirname, "../../app.js"), "utf8");
  assert.match(appSource, /CANONICAL_API\.listFarms\(\)/u);
  assert.match(appSource, /CANONICAL_API\.listHouses\(farm\.id\)/u);
  assert.match(appSource, /CANONICAL_API\.listFlocks\(farm\.id\)/u);
  assert.match(appSource, /canonicalScopeCatalog\.housesByFarm/u);
  assert.match(appSource, /無法載入正式工作範圍/u);
  assert.match(appSource, /canonicalRecordingEnabled\(\) \? canonicalFarmById\(record\.farmId\) : farmById/u);
  assert.match(appSource, /recordingScopeFarms\(\)/u);
  assert.match(appSource, /clearSelection: true/u);
  assert.match(appSource, /state\.guidedRecord = null/u);
});
