(function attachJinjiCanonicalApi(root, factory) {
  const api = factory(root);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.JinjiCanonicalApi = api;
})(typeof window === "object" ? window : (typeof globalThis === "object" ? globalThis : null), (root) => {
  "use strict";

  const VALID_ENVIRONMENTS = new Set(["production", "test"]);
  const DEFAULT_PRODUCTION_API_BASE = "https://chicken-line-production.jinji-assistant.workers.dev";
  const PRODUCTION_PAGES_ORIGIN = "https://aitest00898.github.io";
  const PRODUCTION_PAGES_PATH = "/jinji-web-v14r-lab";
  const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "[::1]"]);

  class CanonicalApiError extends Error {
    constructor(code, message, options = {}) {
      super(message || code);
      this.name = "CanonicalApiError";
      this.code = code;
      this.status = options.status ?? null;
      this.payload = options.payload ?? null;
    }
  }

  function searchParams() {
    try { return new URLSearchParams(root?.location?.search || ""); } catch (_) { return new URLSearchParams(); }
  }

  function pageLocation(options) {
    return options.location || root?.location || null;
  }

  function isProductionPagesLocation(location) {
    if (!location) return false;
    const origin = String(location.origin || "").replace(/\/+$/u, "");
    const pathname = String(location.pathname || "").replace(/\/+$/u, "") || "/";
    return origin === PRODUCTION_PAGES_ORIGIN && (pathname === PRODUCTION_PAGES_PATH || pathname === `${PRODUCTION_PAGES_PATH}/index.html`);
  }

  function isLocalLocation(location) {
    if (!location) return true;
    let hostname = location.hostname;
    let protocol = location.protocol;
    if ((!hostname || !protocol) && (location.href || location.origin)) {
      try {
        const parsed = new URL(location.href || location.origin);
        hostname ||= parsed.hostname;
        protocol ||= parsed.protocol;
      } catch (_) {}
    }
    if (!hostname) return true;
    return LOCAL_HOSTNAMES.has(String(hostname).toLowerCase()) && /^https?:$/u.test(String(protocol || ""));
  }

  function normalizeBase(raw, location) {
    try {
      const url = new URL(String(raw), location?.href || "http://localhost/");
      if (!/^https?:$/u.test(url.protocol) || url.username || url.password) throw new Error("invalid_api_base");
      url.search = "";
      url.hash = "";
      return url.toString().replace(/\/+$/u, "");
    } catch (_) {
      throw new CanonicalApiError("CANONICAL_API_BASE_INVALID", "API base must be an http(s) URL without credentials.");
    }
  }

  function configuredBase(options, params, location) {
    const explicitOption = options.base !== undefined;
    const raw = options.base
      ?? params.get("api-base")
      ?? root?.__JINJI_API_BASE__
      ?? root?.document?.querySelector?.('meta[name="jinji-api-base"]')?.content
      ?? "";
    if (!String(raw).trim()) {
      if (isProductionPagesLocation(location)) return { value: DEFAULT_PRODUCTION_API_BASE, source: "pages-origin-allowlist" };
      return { value: null, source: "none" };
    }
    const value = normalizeBase(raw, location);
    if (isProductionPagesLocation(location) && !explicitOption && value !== DEFAULT_PRODUCTION_API_BASE) {
      throw new CanonicalApiError("CANONICAL_API_PAGES_BASE_OVERRIDE_FORBIDDEN", "The production Pages host may use only its allowlisted Worker origin.");
    }
    return {
      value,
      source: explicitOption ? "options" : params.get("api-base") ? "query" : root?.__JINJI_API_BASE__ ? "global" : "meta",
    };
  }

  function runtimeModeFor(location, base) {
    if (isProductionPagesLocation(location)) return "production_api";
    if (base) return "canonical_api";
    if (isLocalLocation(location)) return "fixture_local";
    return "unsupported_host";
  }

  function configuredEnvironment(options, params) {
    const value = String(options.environment ?? params.get("api-environment") ?? "production").trim().toLowerCase();
    if (value === "production") return value;
    // A URL flag is not an authorization boundary. Browser Test mode is
    // selected through the authenticated UI; testAdmin is retained only for
    // isolated local contract tests that inject an explicit option.
    const explicitTest = options.testAdmin === true;
    if (value === "test" && explicitTest) return value;
    if (!VALID_ENVIRONMENTS.has(value)) throw new CanonicalApiError("CANONICAL_API_ENV_INVALID", "Unknown API environment; request was not sent.");
    throw new CanonicalApiError("CANONICAL_API_TEST_AUTH_REQUIRED", "Test API mode requires an authenticated, explicit UI selection.");
  }

  function requestUrl(base, pathname, environment, query = {}) {
    const url = new URL(pathname, `${base}/`);
    url.searchParams.set("environment", environment);
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value) !== "") url.searchParams.set(key, String(value));
    });
    return url;
  }

  function commandBody(command) {
    if (!command || typeof command !== "object" || command.kind !== "record_command") {
      throw new CanonicalApiError("CANONICAL_COMMAND_REQUIRED", "Only a validated RecordCommand may cross the Web API boundary.");
    }
    return { command };
  }

  function masterDataError(message, payload = null) {
    return new CanonicalApiError("CANONICAL_MASTER_DATA_INVALID", message, { payload });
  }

  function masterDataRows(payload, collection, environment, parentFarmId = null) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload) || !Array.isArray(payload[collection])) {
      throw masterDataError(`Canonical ${collection} response must contain an array.`, payload);
    }
    const seen = new Set();
    return payload[collection].map((row) => {
      if (!row || typeof row !== "object" || Array.isArray(row)) throw masterDataError(`Canonical ${collection} row is invalid.`, payload);
      const id = typeof row.id === "string" ? row.id.trim() : "";
      if (!id || seen.has(id)) throw masterDataError(`Canonical ${collection} contains a missing or duplicate id.`, payload);
      seen.add(id);
      if (collection === "farms") {
        if (typeof row.name !== "string" || !row.name.trim() || row.environment !== environment) {
          throw masterDataError("Canonical farm environment or name is invalid.", payload);
        }
      }
      if (collection === "houses") {
        if (typeof row.name !== "string" || !row.name.trim() || row.farmId !== parentFarmId || (row.farmEnvironment !== undefined && row.farmEnvironment !== environment)) {
          throw masterDataError("Canonical house parent or environment is invalid.", payload);
        }
      }
      if (collection === "flocks") {
        if (row.farmId !== parentFarmId || typeof row.houseId !== "string" || !row.houseId.trim() || typeof row.batchCode !== "string" || !row.batchCode.trim()) {
          throw masterDataError("Canonical flock parent or batch code is invalid.", payload);
        }
      }
      return { ...row, id };
    });
  }

  function canonicalCurrentStock(row) {
    if (!row || typeof row !== "object" || Array.isArray(row)) return null;
    const value = row.currentStock !== undefined ? row.currentStock : row.stock;
    return Number.isSafeInteger(value) && value >= 0 ? value : null;
  }

  function canonicalLiveStatusPayload(payload, environment, scopeType, scopeId) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload) || payload.aiInvoked !== false) {
      throw new CanonicalApiError("CANONICAL_STOCK_READ_INVALID", "Canonical stock projection is unavailable.", { payload });
    }
    const context = payload.context;
    const scope = context?.scope;
    const entity = context?.scopeEntity;
    if (!context || typeof context !== "object" || Array.isArray(context)
      || !scope || typeof scope !== "object" || Array.isArray(scope)
      || scope.type !== scopeType || scope.id !== scopeId
      || !entity || typeof entity !== "object" || Array.isArray(entity)
      || entity.environment !== environment
      || !Array.isArray(context.flocks)) {
      throw new CanonicalApiError("CANONICAL_STOCK_SCOPE_INVALID", "Canonical stock projection scope is invalid.", { payload });
    }
    const seen = new Set();
    const flocks = context.flocks.map((row) => {
      if (!row || typeof row !== "object" || Array.isArray(row)) {
        throw new CanonicalApiError("CANONICAL_STOCK_READ_INVALID", "Canonical stock projection row is invalid.", { payload });
      }
      const id = typeof row.id === "string" ? row.id.trim() : "";
      const currentStock = canonicalCurrentStock(row);
      if (!id || seen.has(id) || currentStock === null) {
        throw new CanonicalApiError("CANONICAL_STOCK_READ_INVALID", "Canonical stock projection is missing an authoritative value.", { payload });
      }
      seen.add(id);
      return { ...row, id, currentStock };
    });
    if (scopeType === "flock" && (flocks.length !== 1 || flocks[0].id !== scopeId)) {
      throw new CanonicalApiError("CANONICAL_STOCK_READ_INVALID", "Canonical flock stock projection does not match the requested flock.", { payload });
    }
    return { ...payload, context: { ...context, flocks } };
  }

  const CANONICAL_RECORD_DESTINATIONS = new Set([
    "recording_events",
    "operational_actions",
    "operational_events",
    "abnormal_events",
  ]);

  const CANONICAL_EFFECTIVE_STATUSES = new Set(["active", "corrected", "reversed", "replacement"]);
  const CANONICAL_LEGACY_READ_ERROR = "CANONICAL_RECORD_LEGACY_SHAPE";

  function nullableCanonicalId(value) {
    if (value === undefined || value === null || value === "") return null;
    const normalized = String(value).trim();
    return normalized || null;
  }

  function canonicalLegacyRelation(row) {
    const relations = [
      ["correction", nullableCanonicalId(row.correctionOfId)],
      ["reversal", nullableCanonicalId(row.reversalOfId)],
      ["replacement", nullableCanonicalId(row.replacementOfId)],
    ].filter(([, id]) => id);
    return relations.length === 1 ? { kind: relations[0][0], id: relations[0][1] } : null;
  }

  function canonicalLegacyFields(row) {
    const fields = [
      "maleCount", "femaleCount", "totalCount", "condition", "sex", "averageWeight", "totalWeight", "weightUnit",
      "chickInDate", "content", "vendor", "weight", "submittedAt", "workflowStatus", "result", "completedAt",
      "reminderDueAt", "maintenanceContent", "extent", "linkedMortalityEventId", "detail", "measuredTemperature",
      "measurement", "evidence", "quantity", "unit",
    ];
    return Object.fromEntries(fields
      .filter((field) => row[field] !== undefined && row[field] !== null && row[field] !== "")
      .map((field) => [field, row[field]]));
  }

  function canonicalLegacyDerivedFields(row) {
    const derivedFields = row.derivedFields && typeof row.derivedFields === "object" && !Array.isArray(row.derivedFields)
      ? row.derivedFields
      : {};
    const knownDerivedFields = {
      O1: ["totalCount"],
      O3: ["averageWeight"],
      O4: ["ageDays"],
      O6: ["reminderDueAt"],
    }[row.taxonomyId] || [];
    return Object.fromEntries([...new Set([...knownDerivedFields, ...Object.keys(derivedFields)])]
      .map((field) => [field, row[field] ?? derivedFields[field]])
      .filter(([, value]) => value !== undefined && value !== null && value !== ""));
  }

  function canonicalLegacyRecord(row) {
    const relation = canonicalLegacyRelation(row);
    const relationStatus = relation?.kind === "reversal"
      ? "reversed"
      : relation
        ? "replacement"
        : null;
    const rawStatus = typeof row.lifecycleStatus === "string" ? row.lifecycleStatus.trim() : "";
    const effectiveStatus = relationStatus || (CANONICAL_EFFECTIVE_STATUSES.has(rawStatus) ? rawStatus : "active");
    const occurredAt = typeof row.occurredAt === "string" && row.occurredAt
      ? row.occurredAt
      : typeof row.createdAt === "string" ? row.createdAt : "";
    const createdAt = typeof row.createdAt === "string" && row.createdAt
      ? row.createdAt
      : occurredAt;
    const lineage = {
      correctionOfId: nullableCanonicalId(row.correctionOfId),
      reversalOfId: nullableCanonicalId(row.reversalOfId),
      replacementOfId: nullableCanonicalId(row.replacementOfId),
      correctedById: null,
      reversedById: null,
      replacedById: null,
    };
    return {
      ...row,
      id: String(row.id).trim(),
      taxonomyId: String(row.taxonomyId).trim(),
      family: typeof row.family === "string" ? row.family : "",
      type: typeof row.type === "string" ? row.type : "",
      subtype: typeof row.subtype === "string" && row.subtype ? row.subtype : typeof row.intent === "string" ? row.intent : "",
      occurredAt,
      createdAt,
      farmId: nullableCanonicalId(row.farmId) || "",
      houseId: nullableCanonicalId(row.houseId),
      flockId: nullableCanonicalId(row.flockId),
      sourceChannel: typeof row.sourceChannel === "string" ? row.sourceChannel : "",
      sourceMessageId: nullableCanonicalId(row.sourceMessageId),
      sourceCandidateId: nullableCanonicalId(row.sourceCandidateId),
      rawText: typeof row.rawText === "string" ? row.rawText : "",
      actorId: nullableCanonicalId(row.actorId),
      confirmedBy: nullableCanonicalId(row.confirmedBy),
      clientOperationId: nullableCanonicalId(row.clientOperationId || row.sourceEventId) || String(row.id).trim(),
      lifecycleStatus: effectiveStatus,
      effectiveStatus,
      isEffective: effectiveStatus === "active",
      readStatus: "unsafe",
      readErrorCode: CANONICAL_LEGACY_READ_ERROR,
      correctionSafe: false,
      reversalSafe: false,
      correctionBlockReason: "CANONICAL_RECORD_READ_MODEL_REQUIRED",
      reversalBlockReason: "CANONICAL_RECORD_READ_MODEL_REQUIRED",
      lineage,
      record: null,
      correctionSeed: null,
      reversalSeed: null,
      fields: canonicalLegacyFields(row),
      derivedFields: canonicalLegacyDerivedFields(row),
    };
  }

  function applyCanonicalLegacyLineage(records) {
    const byId = new Map(records.map((record) => [record.id, record]));
    for (const child of records) {
      if (child.readErrorCode !== CANONICAL_LEGACY_READ_ERROR) continue;
      const relation = canonicalLegacyRelation(child);
      if (!relation) continue;
      const parent = byId.get(relation.id);
      if (!parent || parent.readErrorCode !== CANONICAL_LEGACY_READ_ERROR) continue;
      const field = relation.kind === "correction"
        ? "correctedById"
        : relation.kind === "reversal"
          ? "reversedById"
          : "replacedById";
      parent.lineage[field] = child.id;
      parent.effectiveStatus = relation.kind === "reversal" ? "reversed" : "corrected";
      parent.lifecycleStatus = parent.effectiveStatus;
      parent.isEffective = false;
      parent.correctionSafe = false;
      parent.reversalSafe = false;
      parent.correctionBlockReason = "CANONICAL_RECORD_NOT_EFFECTIVE";
      parent.reversalBlockReason = "CANONICAL_RECORD_NOT_EFFECTIVE";
    }
    return records;
  }

  function canonicalRecordsPayload(payload, environment) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload) || !Array.isArray(payload.records)) {
      throw new CanonicalApiError("CANONICAL_RECORD_READ_INVALID", "Canonical records response must contain an array.", { payload });
    }
    if (payload.environment !== undefined && payload.environment !== environment) {
      throw new CanonicalApiError("CANONICAL_RECORD_ENVIRONMENT_MISMATCH", "Canonical records response scope does not match the selected environment.", { payload });
    }
    const seen = new Set();
    const records = payload.records.map((row) => {
      if (!row || typeof row !== "object" || Array.isArray(row)) {
        throw new CanonicalApiError("CANONICAL_RECORD_READ_INVALID", "Canonical record row is invalid.", { payload });
      }
      const id = typeof row.id === "string" ? row.id.trim() : "";
      const taxonomyId = typeof row.taxonomyId === "string" ? row.taxonomyId.trim() : "";
      const hasReadModelStatus = Object.prototype.hasOwnProperty.call(row, "readStatus");
      const hasDomainRecord = Object.prototype.hasOwnProperty.call(row, "record");
      const isExplicitUnsafeReadModel = row.readStatus === "unsafe" && row.record === null;
      if (!id || seen.has(id) || !CANONICAL_RECORD_DESTINATIONS.has(row.destination) || (!taxonomyId && !isExplicitUnsafeReadModel)) {
        throw new CanonicalApiError("CANONICAL_RECORD_READ_INVALID", "Canonical record identity or destination is invalid.", { payload });
      }
      if (!hasReadModelStatus && !hasDomainRecord) {
        seen.add(id);
        return canonicalLegacyRecord(row);
      }
      if (row.readStatus !== "valid" && row.readStatus !== "unsafe") {
        throw new CanonicalApiError("CANONICAL_RECORD_READ_INVALID", "Canonical record safety status is invalid.", { payload });
      }
      if (row.record !== null && (typeof row.record !== "object" || Array.isArray(row.record))) {
        throw new CanonicalApiError("CANONICAL_RECORD_READ_INVALID", "Canonical record domain payload is invalid.", { payload });
      }
      seen.add(id);
      return { ...row, id, taxonomyId };
    });
    return { ...payload, environment: payload.environment || environment, records: applyCanonicalLegacyLineage(records) };
  }

  const ERROR_CODE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,119}$/u;
  const DEFAULT_API_ERROR_MESSAGE = "Canonical API rejected the request.";

  function httpErrorCode(httpStatus) {
    return Number.isInteger(httpStatus) && httpStatus >= 100 && httpStatus <= 599
      ? `CANONICAL_API_HTTP_${httpStatus}`
      : "CANONICAL_API_HTTP_ERROR";
  }

  /**
   * Worker versions in the wild have used both of these equivalent envelopes:
   *   { error: "invalid_credentials", message: "..." }
   *   { error: { code: "invalid_credentials", message: "..." } }
   * Keep the transport compatibility here so every Web operation shares one
   * failure contract. UI code must map the resulting code to bounded copy and
   * must not render the server-provided message directly.
   */
  function normalizeCanonicalApiError(payload, httpStatus) {
    const status = Number.isInteger(httpStatus) ? httpStatus : null;
    const fallbackCode = httpErrorCode(httpStatus);
    const fallback = { code: fallbackCode, message: DEFAULT_API_ERROR_MESSAGE, status };
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return fallback;

    const envelope = payload.error;
    let code = null;
    let message = null;
    if (typeof envelope === "string") {
      code = envelope.trim();
      message = payload.message;
    } else if (envelope && typeof envelope === "object" && !Array.isArray(envelope)) {
      code = envelope.code;
      message = envelope.message;
    }
    if (typeof code !== "string" || !ERROR_CODE_PATTERN.test(code.trim())) return fallback;
    return {
      code: code.trim(),
      message: typeof message === "string" && message.trim() ? message.trim() : DEFAULT_API_ERROR_MESSAGE,
      status,
    };
  }

  function createClient(options = {}) {
    const params = options.searchParams || searchParams();
    const location = pageLocation(options);
    let base = null;
    let baseSource = "none";
    let configurationError = null;
    let environment = "production";
    try {
      const configured = configuredBase(options, params, location);
      base = configured.value;
      baseSource = configured.source;
      environment = configuredEnvironment(options, params);
    } catch (error) {
      configurationError = error instanceof CanonicalApiError
        ? error
        : new CanonicalApiError("CANONICAL_API_CONFIGURATION_INVALID", "Canonical API configuration is invalid.");
    }
    const fetchImpl = options.fetchImpl || root?.fetch?.bind(root);
    const enabled = Boolean(base) && !configurationError;
    const runtimeMode = runtimeModeFor(location, base);
    let token = null;
    let expiresAt = null;
    let organization = null;

    function clearAuth() {
      token = null;
      expiresAt = null;
      organization = null;
    }

    async function request(pathname, requestOptions = {}) {
      if (configurationError) throw configurationError;
      if (!base) throw new CanonicalApiError("CANONICAL_API_NOT_CONFIGURED", "Canonical API is not configured for this Lab page.");
      if (typeof fetchImpl !== "function") throw new CanonicalApiError("CANONICAL_API_FETCH_UNAVAILABLE", "Browser fetch is unavailable.");
      const url = requestUrl(base, pathname, environment, requestOptions.query);
      const headers = { accept: "application/json" };
      if (token) headers.authorization = `Bearer ${token}`;
      const init = {
        method: requestOptions.method || "GET",
        credentials: "omit",
        headers,
      };
      if (requestOptions.body !== undefined) {
        headers["content-type"] = "application/json";
        init.body = JSON.stringify(requestOptions.body);
      }
      let response;
      try {
        response = await fetchImpl(url.toString(), init);
      } catch (error) {
        throw new CanonicalApiError("CANONICAL_API_NETWORK_ERROR", "Canonical API request failed before a response was received.", { payload: error });
      }
      let payload = null;
      try { payload = await response.json(); } catch (_) {}
      if (!response.ok) {
        if (response.status === 401 && pathname !== "/api/web/auth/login" && pathname !== "/api/web/auth/session") clearAuth();
        const detail = normalizeCanonicalApiError(payload, response.status);
        throw new CanonicalApiError(detail.code, detail.message, { status: detail.status, payload });
      }
      return payload;
    }

    async function login(password) {
      if (typeof password !== "string" || !password || password.length > 200) {
        throw new CanonicalApiError("CANONICAL_API_INVALID_LOGIN", "登入資料無效。");
      }
      const payload = await request("/api/web/auth/login", { method: "POST", body: { password } });
      if (payload?.authenticated !== true || typeof payload.token !== "string" || !/^[A-Za-z0-9_-]{32,100}$/u.test(payload.token)) {
        clearAuth();
        throw new CanonicalApiError("CANONICAL_API_AUTH_RESPONSE_INVALID", "登入服務回傳無效 session。");
      }
      token = payload.token;
      expiresAt = typeof payload.expiresAt === "string" ? payload.expiresAt : null;
      organization = payload.organization || null;
      return { authenticated: true, expiresAt, organization };
    }

    async function logout() {
      try {
        if (token) await request("/api/web/auth/logout", { method: "POST" });
      } finally {
        clearAuth();
      }
      return { authenticated: false };
    }

    async function session() {
      const payload = await request("/api/web/auth/session", { method: "GET" });
      if (payload?.authenticated === true && token) {
        expiresAt = typeof payload.expiresAt === "string" ? payload.expiresAt : expiresAt;
        organization = payload.organization || organization;
      } else if (payload?.authenticated !== true) {
        clearAuth();
      }
      return { authenticated: payload?.authenticated === true && Boolean(token), expiresAt, organization };
    }

    function setEnvironment(next, { explicitChoice = false } = {}) {
      const value = String(next || "").trim().toLowerCase();
      if (!VALID_ENVIRONMENTS.has(value)) throw new CanonicalApiError("CANONICAL_API_ENV_INVALID", "Unknown API environment; request was not sent.");
      if (value === "test" && (!explicitChoice || !token)) {
        throw new CanonicalApiError("CANONICAL_API_TEST_AUTH_REQUIRED", "Test API mode requires an authenticated, explicit UI selection.");
      }
      environment = value;
      return environment;
    }

    async function listFarms() {
      return masterDataRows(await request("/api/farms", { method: "GET" }), "farms", environment);
    }

    async function listHouses(farmId) {
      const normalizedFarmId = typeof farmId === "string" ? farmId.trim() : "";
      if (!normalizedFarmId) throw new CanonicalApiError("CANONICAL_MASTER_DATA_FARM_REQUIRED", "A farm is required before loading houses.");
      return masterDataRows(await request("/api/houses", { method: "GET", query: { farmId: normalizedFarmId } }), "houses", environment, normalizedFarmId);
    }

    async function listFlocks(farmId) {
      const normalizedFarmId = typeof farmId === "string" ? farmId.trim() : "";
      if (!normalizedFarmId) throw new CanonicalApiError("CANONICAL_MASTER_DATA_FARM_REQUIRED", "A farm is required before loading flocks.");
      return masterDataRows(await request("/api/flocks", { method: "GET", query: { farmId: normalizedFarmId } }), "flocks", environment, normalizedFarmId);
    }

    async function getFlockCurrentStock(flockId) {
      const normalizedFlockId = typeof flockId === "string" ? flockId.trim() : "";
      if (!normalizedFlockId) throw new CanonicalApiError("CANONICAL_STOCK_FLOCK_REQUIRED", "A flock is required before loading current stock.");
      const payload = await request("/api/ai/live-status", {
        method: "GET",
        query: { scopeType: "flock", scopeId: normalizedFlockId },
      });
      const normalized = canonicalLiveStatusPayload(payload, environment, "flock", normalizedFlockId);
      return normalized.context.flocks[0].currentStock;
    }

    return Object.freeze({
      enabled,
      base,
      baseSource,
      runtimeMode,
      configurationError,
      get environment() { return environment; },
      isConfigured: () => enabled,
      isAuthenticated: () => Boolean(token),
      authState: () => ({ authenticated: Boolean(token), expiresAt, organization }),
      state: () => ({ enabled, environment, base, baseSource, runtimeMode, authenticated: Boolean(token), expiresAt, configurationError: configurationError?.code || null }),
      login,
      logout,
      session,
      setEnvironment,
      listFarms,
      listHouses,
      listFlocks,
      getFlockCurrentStock,
      createRecord: (command) => request("/api/records", { method: "POST", body: commandBody(command) }),
      correctRecord: (id, command) => request(`/api/records/${encodeURIComponent(String(id))}/correct`, { method: "POST", body: commandBody(command) }),
      reverseRecord: (id, command) => request(`/api/records/${encodeURIComponent(String(id))}/reverse`, { method: "POST", body: commandBody(command) }),
      submitRecord: (command, relation = null) => relation?.kind === "correction"
        ? request(`/api/records/${encodeURIComponent(String(relation.id))}/correct`, { method: "POST", body: commandBody(command) })
        : relation?.kind === "reversal"
          ? request(`/api/records/${encodeURIComponent(String(relation.id))}/reverse`, { method: "POST", body: commandBody(command) })
          : request("/api/records", { method: "POST", body: commandBody(command) }),
      listRecords: async (query = {}) => canonicalRecordsPayload(await request("/api/records", { method: "GET", query }), environment),
    });
  }

  return Object.freeze({ CanonicalApiError, createClient, normalizeCanonicalApiError, canonicalCurrentStock, canonicalLiveStatusPayload, DEFAULT_PRODUCTION_API_BASE, PRODUCTION_PAGES_ORIGIN, PRODUCTION_PAGES_PATH, masterDataRows, canonicalRecordsPayload });
});
