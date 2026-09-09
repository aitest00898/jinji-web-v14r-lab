(function attachJinjiCanonicalApi(root, factory) {
  const api = factory(root);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.JinjiCanonicalApi = api;
})(typeof window === "object" ? window : (typeof globalThis === "object" ? globalThis : null), (root) => {
  "use strict";

  const VALID_ENVIRONMENTS = new Set(["production", "test"]);

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

  function configuredBase(options, params) {
    const raw = options.base
      ?? params.get("api-base")
      ?? root?.__JINJI_API_BASE__
      ?? root?.document?.querySelector?.('meta[name="jinji-api-base"]')?.content
      ?? "";
    if (!String(raw).trim()) return null;
    try {
      const url = new URL(String(raw), root?.location?.href || "http://localhost/");
      if (!/^https?:$/u.test(url.protocol) || url.username || url.password) throw new Error("invalid_api_base");
      url.search = "";
      url.hash = "";
      return url.toString().replace(/\/+$/u, "");
    } catch (_) {
      throw new CanonicalApiError("CANONICAL_API_BASE_INVALID", "API base must be an http(s) URL without credentials.");
    }
  }

  function configuredEnvironment(options, params) {
    const value = String(options.environment ?? params.get("api-environment") ?? "production").trim().toLowerCase();
    if (value === "production") return value;
    const explicitTest = options.testAdmin === true
      || params.get("api-test-admin") === "1"
      || root?.__JINJI_API_TEST_ADMIN__ === true;
    if (value === "test" && explicitTest) return value;
    if (!VALID_ENVIRONMENTS.has(value)) throw new CanonicalApiError("CANONICAL_API_ENV_INVALID", "Unknown API environment; request was not sent.");
    throw new CanonicalApiError("CANONICAL_API_TEST_AUTH_REQUIRED", "Test API mode requires an explicit test-admin marker.");
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

  function errorPayload(payload) {
    if (!payload || typeof payload !== "object") return null;
    if (payload.error && typeof payload.error === "object") return payload.error;
    return null;
  }

  function createClient(options = {}) {
    const params = options.searchParams || searchParams();
    let base = null;
    let configurationError = null;
    let environment = "production";
    try {
      base = configuredBase(options, params);
      environment = configuredEnvironment(options, params);
    } catch (error) {
      configurationError = error instanceof CanonicalApiError
        ? error
        : new CanonicalApiError("CANONICAL_API_CONFIGURATION_INVALID", "Canonical API configuration is invalid.");
    }
    const fetchImpl = options.fetchImpl || root?.fetch?.bind(root);
    const enabled = Boolean(base) && !configurationError;

    async function request(pathname, requestOptions = {}) {
      if (configurationError) throw configurationError;
      if (!base) throw new CanonicalApiError("CANONICAL_API_NOT_CONFIGURED", "Canonical API is not configured for this Lab page.");
      if (typeof fetchImpl !== "function") throw new CanonicalApiError("CANONICAL_API_FETCH_UNAVAILABLE", "Browser fetch is unavailable.");
      const url = requestUrl(base, pathname, environment, requestOptions.query);
      const headers = { accept: "application/json" };
      const init = {
        method: requestOptions.method || "GET",
        credentials: "include",
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
        const detail = errorPayload(payload);
        throw new CanonicalApiError(String(detail?.code || `CANONICAL_API_HTTP_${response.status}`), String(detail?.message || "Canonical API rejected the request."), { status: response.status, payload });
      }
      return payload;
    }

    return Object.freeze({
      enabled,
      environment,
      base,
      configurationError,
      isConfigured: () => enabled,
      state: () => ({ enabled, environment, base, configurationError: configurationError?.code || null }),
      createRecord: (command) => request("/api/records", { method: "POST", body: commandBody(command) }),
      correctRecord: (id, command) => request(`/api/records/${encodeURIComponent(String(id))}/correct`, { method: "POST", body: commandBody(command) }),
      reverseRecord: (id, command) => request(`/api/records/${encodeURIComponent(String(id))}/reverse`, { method: "POST", body: commandBody(command) }),
      submitRecord: (command, relation = null) => relation?.kind === "correction"
        ? request(`/api/records/${encodeURIComponent(String(relation.id))}/correct`, { method: "POST", body: commandBody(command) })
        : relation?.kind === "reversal"
          ? request(`/api/records/${encodeURIComponent(String(relation.id))}/reverse`, { method: "POST", body: commandBody(command) })
          : request("/api/records", { method: "POST", body: commandBody(command) }),
      listRecords: (query = {}) => request("/api/records", { method: "GET", query }),
    });
  }

  return Object.freeze({ CanonicalApiError, createClient });
});
