(function attachJinjiStorage(root, factory) {
  const api = factory(root);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.JinjiStorage = api;
})(typeof window === "object" ? window : (typeof globalThis === "object" ? globalThis : null), (root) => {
  "use strict";

  const KEYS = Object.freeze({
    overlay: "jinji-v14r-lab-runtime-overlay-v1",
    mode: "jinji-v14r-lab-backend-mode-v1",
  });
  const MODES = Object.freeze(["ONLINE", "AI_DOWN", "BACKEND_TEMP_DOWN", "BACKEND_LONG_DOWN"]);

  function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  function emptyState() {
    return {
      version: 1,
      events: [],
      pendingReviews: [],
      abnormalities: [],
      auditEntries: [],
      outbox: [],
      syncedOperationIds: [],
      settings: {},
      mode: "ONLINE",
    };
  }

  function validState(value) {
    if (!value || typeof value !== "object") return false;
    return ["events", "pendingReviews", "abnormalities", "auditEntries", "outbox"].every((key) => Array.isArray(value[key]));
  }

  function readJson(key) {
    try {
      const raw = root?.localStorage?.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function writeJson(key, value) {
    try {
      root?.localStorage?.setItem(key, JSON.stringify(value));
      return true;
    } catch (_) {
      return false;
    }
  }

  function dispatch(name, detail) {
    try { root?.dispatchEvent(new CustomEvent(name, { detail })); } catch (_) {}
  }

  class LabRepository {
    constructor(options = {}) {
      this.fixture = options.fixture || null;
      const stored = readJson(KEYS.overlay);
      this.state = validState(stored) ? { ...emptyState(), ...stored } : emptyState();
      const mode = readJson(KEYS.mode);
      if (typeof mode === "string" && MODES.includes(mode)) this.state.mode = mode;
      this.idbPromise = this.openIndexedDb();
    }

    openIndexedDb() {
      if (!root?.indexedDB) return Promise.resolve(null);
      return new Promise((resolve) => {
        let settled = false;
        const finish = (value) => { if (!settled) { settled = true; resolve(value); } };
        try {
          const request = root.indexedDB.open("jinji-v14r-lab", 1);
          request.onupgradeneeded = () => {
            if (!request.result.objectStoreNames.contains("runtime")) request.result.createObjectStore("runtime");
          };
          request.onsuccess = () => finish(request.result);
          request.onerror = () => finish(null);
          request.onblocked = () => finish(null);
        } catch (_) { finish(null); }
      });
    }

    persistToIndexedDb() {
      this.idbPromise.then((db) => {
        if (!db) return;
        try {
          const transaction = db.transaction("runtime", "readwrite");
          transaction.objectStore("runtime").put(clone(this.state), "overlay");
        } catch (_) {}
      });
    }

    persist() {
      writeJson(KEYS.overlay, this.state);
      writeJson(KEYS.mode, this.state.mode);
      this.persistToIndexedDb();
      dispatch("jinji:lab-store-updated", this.snapshot());
      return this.snapshot();
    }

    snapshot() {
      return clone(this.state);
    }

    setMode(mode) {
      if (!MODES.includes(mode)) throw new Error(`LAB_MODE_INVALID:${mode}`);
      this.state.mode = mode;
      return this.persist();
    }

    appendEvent(event, auditEntry = null) {
      const existing = this.state.events.find((candidate) => candidate.id === event.id);
      if (!existing) this.state.events.push(clone(event));
      if (auditEntry) this.state.auditEntries.push(clone(auditEntry));
      return this.persist();
    }

    appendEvents(events = [], auditEntries = []) {
      events.forEach((event) => {
        if (!this.state.events.some((candidate) => candidate.id === event.id)) this.state.events.push(clone(event));
      });
      auditEntries.forEach((entry) => this.state.auditEntries.push(clone(entry)));
      return this.persist();
    }

    appendPending(review) {
      if (!this.state.pendingReviews.some((item) => item.id === review.id)) this.state.pendingReviews.push(clone(review));
      return this.persist();
    }

    appendAbnormality(abnormality) {
      if (!this.state.abnormalities.some((item) => item.id === abnormality.id)) this.state.abnormalities.push(clone(abnormality));
      return this.persist();
    }

    queueOperation(operation) {
      const key = operation.clientOperationId;
      if (!key) throw new Error("LAB_OPERATION_ID_REQUIRED");
      if (this.state.syncedOperationIds.includes(key)) return { ...clone(operation), status: "synced", duplicate: true };
      const existing = this.state.outbox.find((item) => item.clientOperationId === key);
      if (existing) return { ...clone(existing), duplicate: true };
      const row = { ...clone(operation), status: "queued", queuedAt: operation.queuedAt || new Date().toISOString() };
      this.state.outbox.push(row);
      this.persist();
      return clone(row);
    }

    sync(options = {}) {
      const backendAvailable = options.backendAvailable !== false;
      if (!backendAvailable) return { status: "BACKEND_TEMP_DOWN", synced: 0, conflicts: 0, pending: this.state.outbox.length };
      const conflicts = new Set(options.conflictClientOperationIds || []);
      let synced = 0;
      let conflictCount = 0;
      const remaining = [];
      this.state.outbox.forEach((operation) => {
        if (conflicts.has(operation.clientOperationId)) {
          conflictCount += 1;
          const pendingId = `pending-conflict-${operation.clientOperationId}`;
          if (!this.state.pendingReviews.some((item) => item.id === pendingId)) this.state.pendingReviews.push({
            id: pendingId,
            title: "同步衝突需要人工確認",
            detail: "Mock sync 偵測到同一筆操作的內容衝突，不採用 last-write-wins。",
            kind: "同步衝突",
            clientOperationId: operation.clientOperationId,
            source: "lab_mock_sync",
          });
          remaining.push({ ...operation, status: "conflict" });
          return;
        }
        synced += 1;
        this.state.syncedOperationIds.push(operation.clientOperationId);
      });
      this.state.outbox = remaining;
      this.persist();
      return { status: "ONLINE", synced, conflicts: conflictCount, pending: remaining.length };
    }

    resetFixture() {
      this.state = emptyState();
      try { root?.localStorage?.removeItem(KEYS.overlay); root?.localStorage?.removeItem(KEYS.mode); } catch (_) {}
      this.idbPromise.then((db) => {
        if (!db) return;
        try { db.transaction("runtime", "readwrite").objectStore("runtime").clear(); } catch (_) {}
      });
      dispatch("jinji:lab-fixture-reset", this.snapshot());
      return this.snapshot();
    }
  }

  class BaseRepository { constructor(store) { this.store = store; } }
  class FarmRepository extends BaseRepository {}
  class HouseRepository extends BaseRepository {}
  class FlockRepository extends BaseRepository {}
  class EventRepository extends BaseRepository {}
  class PendingRepository extends BaseRepository {}
  class CalendarRepository extends BaseRepository {}
  class FinanceRepository extends BaseRepository {}
  class AuditRepository extends BaseRepository {}
  class SettingsRepository extends BaseRepository {}
  class AnalyticsRepository extends BaseRepository {}

  return {
    KEYS,
    MODES,
    LabRepository,
    FarmRepository,
    HouseRepository,
    FlockRepository,
    EventRepository,
    PendingRepository,
    CalendarRepository,
    FinanceRepository,
    AuditRepository,
    SettingsRepository,
    AnalyticsRepository,
  };
});
