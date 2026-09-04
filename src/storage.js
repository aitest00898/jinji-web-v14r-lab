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
  const MASTER_DATA_TYPES = Object.freeze({
    farm: "farms",
    Farm: "farms",
    house: "houses",
    House: "houses",
    flock: "flocks",
    Flock: "flocks",
    caretakerAssignment: "caretakerAssignments",
    CaretakerAssignment: "caretakerAssignments",
    financeIdentity: "financeIdentities",
    FarmFinanceIdentity: "financeIdentities",
  });

  function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  function emptyState() {
    return {
      version: 1,
      revision: 0,
      events: [],
      pendingReviews: [],
      abnormalities: [],
      auditEntries: [],
      outbox: [],
      syncedOperationIds: [],
      settings: {},
      masterData: {
        farms: [],
        houses: [],
        flocks: [],
        caretakerAssignments: [],
        financeIdentities: [],
      },
      mode: "ONLINE",
    };
  }

  function revisionOf(value) {
    const revision = Number(value);
    return Number.isInteger(revision) && revision >= 0 ? revision : 0;
  }

  function hasLocalStorage() {
    return Boolean(root?.localStorage
      && typeof root.localStorage.getItem === "function"
      && typeof root.localStorage.setItem === "function");
  }

  function validState(value) {
    if (!value || typeof value !== "object") return false;
    const objectRow = (row) => Boolean(row && typeof row === "object" && !Array.isArray(row));
    const requiredArrays = ["events", "pendingReviews", "abnormalities", "auditEntries", "outbox"];
    if (!requiredArrays.every((key) => Array.isArray(value[key]) && value[key].every(objectRow))) return false;
    if (value.syncedOperationIds !== undefined && !Array.isArray(value.syncedOperationIds)) return false;
    if (value.settings !== undefined && (!value.settings || typeof value.settings !== "object" || Array.isArray(value.settings))) return false;
    if (value.masterData !== undefined) {
      if (!value.masterData || typeof value.masterData !== "object" || Array.isArray(value.masterData)) return false;
      if (!Object.keys(emptyState().masterData).every((key) => {
        const rows = value.masterData[key];
        return rows === undefined || (Array.isArray(rows) && rows.every(objectRow));
      })) return false;
    }
    return true;
  }

  function readJson(key) {
    try {
      const raw = root?.localStorage?.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function readRaw(key) {
    try {
      return root?.localStorage?.getItem(key) ?? null;
    } catch (_) {
      return null;
    }
  }

  function restoreRaw(key, raw) {
    try {
      if (raw === null || raw === undefined) root?.localStorage?.removeItem?.(key);
      else root?.localStorage?.setItem?.(key, raw);
    } catch (_) {}
  }

  function writeJson(key, value) {
    try {
      root?.localStorage?.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      const failure = new Error("LAB_STORAGE_WRITE_FAILED");
      failure.cause = error;
      throw failure;
    }
  }

  function fixtureMasterData(fixture) {
    const farms = [];
    const houses = [];
    const flocks = [];
    (Array.isArray(fixture?.farms) ? fixture.farms : []).forEach((farm) => {
      if (!farm || typeof farm !== "object" || !farm.id || farm.id === "all") return;
      farms.push({ id: farm.id });
      (Array.isArray(farm.houses) ? farm.houses : []).forEach((house) => {
        if (!house || typeof house !== "object" || !house.id) return;
        houses.push({ id: house.id, farmId: farm.id });
        (Array.isArray(house.flocks) ? house.flocks : []).forEach((flock) => {
          if (!flock || typeof flock !== "object" || !flock.id) return;
          flocks.push({ id: flock.id, houseId: house.id });
        });
      });
    });
    return { farms, houses, flocks, caretakerAssignments: [], financeIdentities: [] };
  }

  function validPersistedEvent(row) {
    if (!row || typeof row !== "object" || Array.isArray(row) || !String(row.id || "").trim()) return false;
    const hasEventFields = row.type !== undefined || row.quantity !== undefined || row.qty !== undefined || row.value !== undefined;
    // Preserve opaque legacy runtime rows that never entered the event contract;
    // they are harmless to reconstruct and are retained for backward compatibility.
    if (!hasEventFields) return true;
    if (typeof root?.JinjiDomain?.validateOperationalEvent === "function") {
      try {
        root.JinjiDomain.validateOperationalEvent(row);
        return true;
      } catch (_) {
        return false;
      }
    }
    const eventTypes = ["mortality", "cull", "feed", "water", "shipment", "chick_in", "weigh", "other"];
    const quantity = Number(row.quantity ?? row.qty ?? row.value);
    return eventTypes.includes(String(row.type || "other")) && Number.isFinite(quantity) && quantity >= 0;
  }

  function storageConflict(expectedRevision, actualRevision) {
    const error = new Error("LAB_STORAGE_CONFLICT");
    error.expectedRevision = expectedRevision;
    error.actualRevision = actualRevision;
    return error;
  }

  function dispatch(name, detail) {
    try { root?.dispatchEvent(new CustomEvent(name, { detail })); } catch (_) {}
  }

  class LabRepository {
    constructor(options = {}) {
      this.fixture = options.fixture || null;
      this.masterDataContext = clone(options.masterDataContext || fixtureMasterData(this.fixture));
      const stored = readJson(KEYS.overlay);
      const storedWithoutMasterData = stored && typeof stored === "object" && !Array.isArray(stored)
        ? { ...stored, masterData: emptyState().masterData }
        : stored;
      this.state = validState(storedWithoutMasterData) ? { ...emptyState(), ...stored } : emptyState();
      this.state.revision = revisionOf(this.state.revision);
      let eventRowsWereSanitized = false;
      this.state.events = this.state.events.filter((row) => {
        const valid = validPersistedEvent(row);
        if (!valid) eventRowsWereSanitized = true;
        return valid;
      });
      let masterDataWasSanitized = false;
      const storedMasterData = stored && typeof stored === "object" && !Array.isArray(stored) ? stored.masterData : undefined;
      if (storedMasterData !== undefined && (!storedMasterData || typeof storedMasterData !== "object" || Array.isArray(storedMasterData))) {
        masterDataWasSanitized = true;
      }
      this.state.masterData = {
        ...emptyState().masterData,
        ...(this.state.masterData && typeof this.state.masterData === "object" ? this.state.masterData : {}),
      };
      Object.keys(emptyState().masterData).forEach((key) => {
        if (!Array.isArray(this.state.masterData[key])) {
          if (storedMasterData !== undefined && storedMasterData[key] !== undefined) masterDataWasSanitized = true;
          this.state.masterData[key] = [];
        } else if (this.state.masterData[key].some((row) => !row || typeof row !== "object" || Array.isArray(row))) {
          masterDataWasSanitized = true;
        }
      });
      if (typeof root?.JinjiDomain?.validateMasterData === "function") {
        try {
          root.JinjiDomain.validateMasterData(this.state.masterData, this.masterDataContext);
        } catch (_) {
          // A corrupt local overlay must never prevent the Lab shell from loading.
          // Discard only the invalid master-data overlay; the checked-in fixture is untouched.
          this.state.masterData = emptyState().masterData;
          masterDataWasSanitized = true;
        }
      }
      const mode = readJson(KEYS.mode);
      if (typeof mode === "string" && MODES.includes(mode)) this.state.mode = mode;
      this.idbPromise = this.openIndexedDb();
      if (masterDataWasSanitized || eventRowsWereSanitized) {
        // Self-heal only invalid runtime rows while preserving all valid runtime state.
        try {
          this.persist(this.state);
        } catch (_) {
          // Recovery must not prevent the Lab shell from loading when local storage is unavailable.
        }
      }
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

    persistToIndexedDb(candidate = this.state) {
      this.idbPromise.then((db) => {
        if (!db) return;
        try {
          const transaction = db.transaction("runtime", "readwrite");
          transaction.objectStore("runtime").put(clone(candidate), "overlay");
        } catch (_) {}
      });
    }

    persist(nextState = this.state) {
      const candidate = clone(nextState);
      const expectedRevision = revisionOf(this.state.revision);
      if (hasLocalStorage()) {
        const currentRevision = revisionOf(readJson(KEYS.overlay)?.revision);
        if (currentRevision !== expectedRevision) throw storageConflict(expectedRevision, currentRevision);
      }
      candidate.revision = expectedRevision + 1;
      const previousOverlay = readRaw(KEYS.overlay);
      const previousMode = readRaw(KEYS.mode);
      try {
        writeJson(KEYS.overlay, candidate);
        writeJson(KEYS.mode, candidate.mode);
      } catch (error) {
        restoreRaw(KEYS.overlay, previousOverlay);
        restoreRaw(KEYS.mode, previousMode);
        throw error;
      }
      this.state = candidate;
      this.persistToIndexedDb(candidate);
      dispatch("jinji:lab-store-updated", this.snapshot());
      return this.snapshot();
    }

    snapshot() {
      return clone(this.state);
    }

    setMode(mode) {
      if (!MODES.includes(mode)) throw new Error(`LAB_MODE_INVALID:${mode}`);
      const nextState = clone(this.state);
      nextState.mode = mode;
      return this.persist(nextState);
    }

    appendEvent(event, auditEntry = null) {
      const nextState = clone(this.state);
      const existing = nextState.events.find((candidate) => candidate.id === event.id);
      if (!existing) nextState.events.push(clone(event));
      if (auditEntry) nextState.auditEntries.push(clone(auditEntry));
      return this.persist(nextState);
    }

    appendEvents(events = [], auditEntries = []) {
      const nextState = clone(this.state);
      events.forEach((event) => {
        if (!nextState.events.some((candidate) => candidate.id === event.id)) nextState.events.push(clone(event));
      });
      auditEntries.forEach((entry) => nextState.auditEntries.push(clone(entry)));
      return this.persist(nextState);
    }

    appendPending(review) {
      const nextState = clone(this.state);
      if (!nextState.pendingReviews.some((item) => item.id === review.id)) nextState.pendingReviews.push(clone(review));
      return this.persist(nextState);
    }

    appendAbnormality(abnormality) {
      const nextState = clone(this.state);
      if (!nextState.abnormalities.some((item) => item.id === abnormality.id)) nextState.abnormalities.push(clone(abnormality));
      return this.persist(nextState);
    }

    appendMasterData(entityType, entity, auditEntry = null) {
      return this.appendMasterDataBatch([{ entityType, entity }], auditEntry ? [auditEntry] : []);
    }

    appendMasterDataBatch(entities = [], auditEntries = []) {
      const nextState = clone(this.state);
      entities.forEach(({ entityType, entity }) => {
        const collection = MASTER_DATA_TYPES[entityType];
        if (!collection || !entity || !entity.id) throw new Error("LAB_MASTER_DATA_INVALID");
        if (!nextState.masterData[collection].some((item) => item.id === entity.id)) nextState.masterData[collection].push(clone(entity));
      });
      auditEntries.forEach((entry) => {
        if (entry && !nextState.auditEntries.some((candidate) => candidate.id === entry.id)) nextState.auditEntries.push(clone(entry));
      });
      if (typeof root?.JinjiDomain?.validateMasterData === "function") {
        try {
          root.JinjiDomain.validateMasterData(nextState.masterData, this.masterDataContext);
        } catch (error) {
          const relationshipError = new Error("LAB_MASTER_DATA_RELATIONSHIP_INVALID");
          relationshipError.cause = error;
          throw relationshipError;
        }
      }
      return this.persist(nextState);
    }

    commitLocalOperation({ events = [], pendingReviews = [], masterData = [], auditEntries = [], operation } = {}) {
      const key = operation?.clientOperationId;
      if (!key) throw new Error("LAB_OPERATION_ID_REQUIRED");
      if (this.state.syncedOperationIds.includes(key)) return { ...clone(operation), status: "synced", duplicate: true };
      const existing = this.state.outbox.find((item) => item.clientOperationId === key);
      if (existing) return { ...clone(existing), duplicate: true };

      const nextState = clone(this.state);
      events.forEach((event) => {
        if (!nextState.events.some((candidate) => candidate.id === event.id)) nextState.events.push(clone(event));
      });
      pendingReviews.forEach((review) => {
        if (!nextState.pendingReviews.some((candidate) => candidate.id === review.id)) nextState.pendingReviews.push(clone(review));
      });
      masterData.forEach(({ entityType, entity }) => {
        const collection = MASTER_DATA_TYPES[entityType];
        if (!collection || !entity || !entity.id) throw new Error("LAB_MASTER_DATA_INVALID");
        if (!nextState.masterData[collection].some((item) => item.id === entity.id)) nextState.masterData[collection].push(clone(entity));
      });
      auditEntries.forEach((entry) => {
        if (entry && !nextState.auditEntries.some((candidate) => candidate.id === entry.id)) nextState.auditEntries.push(clone(entry));
      });
      if (masterData.length && typeof root?.JinjiDomain?.validateMasterData === "function") {
        try {
          root.JinjiDomain.validateMasterData(nextState.masterData, this.masterDataContext);
        } catch (error) {
          const relationshipError = new Error("LAB_MASTER_DATA_RELATIONSHIP_INVALID");
          relationshipError.cause = error;
          throw relationshipError;
        }
      }

      const row = { ...clone(operation), status: "queued", queuedAt: operation.queuedAt || new Date().toISOString() };
      nextState.outbox.push(row);
      // One user action has one local persistence boundary. Sync is deliberately
      // separate so a later sync conflict cannot erase or mislabel this save.
      this.persist(nextState);
      return clone(row);
    }

    setSettings(patch = {}) {
      if (!patch || typeof patch !== "object" || Array.isArray(patch)) throw new Error("LAB_SETTINGS_INVALID");
      const nextState = clone(this.state);
      nextState.settings = { ...nextState.settings, ...clone(patch) };
      return this.persist(nextState);
    }

    queueOperation(operation) {
      const key = operation.clientOperationId;
      if (!key) throw new Error("LAB_OPERATION_ID_REQUIRED");
      if (this.state.syncedOperationIds.includes(key)) return { ...clone(operation), status: "synced", duplicate: true };
      const existing = this.state.outbox.find((item) => item.clientOperationId === key);
      if (existing) return { ...clone(existing), duplicate: true };
      const row = { ...clone(operation), status: "queued", queuedAt: operation.queuedAt || new Date().toISOString() };
      const nextState = clone(this.state);
      nextState.outbox.push(row);
      this.persist(nextState);
      return clone(row);
    }

    sync(options = {}) {
      const backendAvailable = options.backendAvailable !== false;
      if (!backendAvailable) return { status: "BACKEND_TEMP_DOWN", synced: 0, conflicts: 0, pending: this.state.outbox.length };
      const conflicts = new Set(options.conflictClientOperationIds || []);
      let synced = 0;
      let conflictCount = 0;
      const remaining = [];
      const nextState = clone(this.state);
      nextState.outbox.forEach((operation) => {
        if (conflicts.has(operation.clientOperationId)) {
          conflictCount += 1;
          const pendingId = `pending-conflict-${operation.clientOperationId}`;
          if (!nextState.pendingReviews.some((item) => item.id === pendingId)) nextState.pendingReviews.push({
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
        nextState.syncedOperationIds.push(operation.clientOperationId);
      });
      nextState.outbox = remaining;
      this.persist(nextState);
      return { status: "ONLINE", synced, conflicts: conflictCount, pending: remaining.length };
    }

    resetFixture() {
      const auditEntries = clone(this.state.auditEntries);
      const nextState = emptyState();
      // Fixture reset clears only local runtime state. Audit history is append-only
      // and must remain available for reconstruction after a developer reset.
      nextState.auditEntries = auditEntries;
      const snapshot = this.persist(nextState);
      dispatch("jinji:lab-fixture-reset", snapshot);
      return snapshot;
    }
  }

  class BaseRepository { constructor(store) { this.store = store; } }
  class FarmRepository extends BaseRepository {}
  class HouseRepository extends BaseRepository {}
  class FlockRepository extends BaseRepository {}
  class EventRepository extends BaseRepository {}
  class PendingRepository extends BaseRepository {}
  class CalendarRepository extends BaseRepository {}
  class FinanceRepository extends BaseRepository {
    constructor(options = {}) {
      super(options.store || null);
      const source = options.dataset || root?.JinjiFinanceFixture;
      if (!source) throw new Error("FINANCE_DATASET_REQUIRED");
      const dataset = clone(source);
      const validator = options.validate || root?.JinjiDomain?.validateFinanceDataset;
      if (typeof validator === "function") {
        validator(dataset);
      } else if (dataset.metadata?.classification !== "synthetic" || !String(dataset.metadata?.datasetId || "").startsWith("SYNTHETIC_")) {
        throw new Error("FINANCE_SYNTHETIC_DATASET_REQUIRED");
      }
      this.dataset = this.freeze(dataset);
    }

    freeze(value) {
      if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
      Object.values(value).forEach((child) => this.freeze(child));
      return Object.freeze(value);
    }

    normalizeFilters(filters = {}) {
      const list = (value) => {
        if (value === undefined || value === null || value === "") return [];
        return (Array.isArray(value) ? value : [value]).map(String);
      };
      return {
        farmIds: [...new Set([...list(filters.farmId), ...list(filters.farmIds)])],
        investorIds: [...new Set([...list(filters.investorId), ...list(filters.investorIds)])],
        fromDate: filters.fromDate || filters.dateFrom || filters.startDate || null,
        toDate: filters.toDate || filters.dateTo || filters.endDate || null,
      };
    }

    distributionRows(filters = {}) {
      const normalized = this.normalizeFilters(filters);
      const investorIds = new Set(normalized.investorIds);
      return this.dataset.distributions
        .filter((row) => !normalized.farmIds.length || normalized.farmIds.includes(row.farmId))
        .filter((row) => !normalized.fromDate || row.distributionDate >= normalized.fromDate)
        .filter((row) => !normalized.toDate || row.distributionDate <= normalized.toDate)
        .filter((row) => !investorIds.size || this.dataset.allocations.some((allocation) => allocation.distributionId === row.id && investorIds.has(allocation.investorId)))
        .sort((a, b) => `${a.distributionDate} ${a.id}`.localeCompare(`${b.distributionDate} ${b.id}`));
    }

    selectedFarmIds(filters = {}, distributions = this.distributionRows(filters)) {
      const normalized = this.normalizeFilters(filters);
      if (normalized.farmIds.length) return normalized.farmIds;
      if (!normalized.investorIds.length) return this.dataset.farms.map((farm) => farm.id);
      const investorIds = new Set(normalized.investorIds);
      const distributionFarmIds = new Set(distributions.map((row) => row.farmId));
      this.dataset.farmInvestorEquity.forEach((row) => {
        if (investorIds.has(row.investorId)) distributionFarmIds.add(row.farmId);
      });
      return this.dataset.farms.map((farm) => farm.id).filter((farmId) => distributionFarmIds.has(farmId));
    }

    getDataset() {
      return clone(this.dataset);
    }

    getPortfolioTotals(filters = {}) {
      return clone(this.getSummary(filters).totals);
    }

    getSummary(filters = {}) {
      const normalized = this.normalizeFilters(filters);
      const distributions = this.distributionRows(filters);
      const distributionIds = new Set(distributions.map((row) => row.id));
      const investorIds = new Set(normalized.investorIds);
      const allocations = this.dataset.allocations.filter((row) => distributionIds.has(row.distributionId) && (!investorIds.size || investorIds.has(row.investorId)));
      const selectedFarmIds = new Set(this.selectedFarmIds(filters, distributions));
      const farmRows = this.dataset.farms.filter((farm) => selectedFarmIds.has(farm.id)).map((farm) => {
        const farmDistributions = distributions.filter((row) => row.farmId === farm.id);
        const farmAllocations = allocations.filter((row) => farmDistributions.some((distribution) => distribution.id === row.distributionId));
        const allocated = investorIds.size
          ? farmAllocations.reduce((sum, row) => sum + Number(row.amount || 0), 0)
          : farmDistributions.reduce((sum, row) => sum + Number(row.allocatedProfitLoss || 0), 0);
        const expense = farmDistributions.reduce((sum, row) => sum + Number(row.expense || 0), 0);
        const gross = farmDistributions.reduce((sum, row) => sum + Number(row.grossProfitLoss || 0), 0);
        const net = investorIds.size ? allocated : farmDistributions.reduce((sum, row) => sum + Number(row.netIncome || 0), 0);
        const latest = farmDistributions.at(-1);
        return {
          ...clone(farm),
          equityFraction: Number(farm.playerGroupEquityFraction || 0),
          distributionCount: farmDistributions.length,
          grossProfitLoss: gross,
          allocatedProfitLoss: allocated,
          expense,
          netIncome: net,
          latestDistributionDate: latest?.distributionDate || null,
          historyStatus: farmDistributions.length ? "has_history" : "no_history",
        };
      });

      const equityRows = this.dataset.farmInvestorEquity.filter((row) => selectedFarmIds.has(row.farmId) && (!investorIds.size || investorIds.has(row.investorId)));
      const investorRows = this.dataset.investors.filter((investor) => !investorIds.size || investorIds.has(investor.id)).map((investor) => {
        const investorAllocations = allocations.filter((row) => row.investorId === investor.id);
        const investorEquities = equityRows.filter((row) => row.investorId === investor.id);
        const latestAllocation = investorAllocations
          .map((allocation) => ({ allocation, distribution: this.dataset.distributions.find((row) => row.id === allocation.distributionId) }))
          .filter((row) => row.distribution)
          .sort((a, b) => `${a.distribution.distributionDate} ${a.allocation.id}`.localeCompare(`${b.distribution.distributionDate} ${b.allocation.id}`))
          .at(-1);
        return {
          ...clone(investor),
          farms: investorEquities.map((equity) => ({
            farmId: equity.farmId,
            farm: this.dataset.farms.find((farm) => farm.id === equity.farmId)?.name || equity.farmId,
            equityFraction: Number(equity.equityFraction || 0),
            share: Number(equity.equityFraction || 0) * 100,
            allocationTotal: investorAllocations
              .filter((allocation) => this.dataset.distributions.find((row) => row.id === allocation.distributionId)?.farmId === equity.farmId)
              .reduce((sum, allocation) => sum + Number(allocation.amount || 0), 0),
          })),
          equityTotal: investorEquities.reduce((sum, equity) => sum + Number(equity.equityFraction || 0), 0),
          allocationTotal: investorAllocations.reduce((sum, allocation) => sum + Number(allocation.amount || 0), 0),
          positiveDistributionCount: investorAllocations.filter((allocation) => Number(allocation.amount) > 0).length,
          negativeDistributionCount: investorAllocations.filter((allocation) => Number(allocation.amount) < 0).length,
          latestAllocation: latestAllocation ? {
            amount: Number(latestAllocation.allocation.amount),
            distributionId: latestAllocation.allocation.distributionId,
            date: latestAllocation.distribution.distributionDate,
          } : null,
        };
      });

      const totals = distributions.reduce((result, row) => ({
        gross: result.gross + Number(row.grossProfitLoss || 0),
        allocated: result.allocated + (investorIds.size
          ? allocations.filter((allocation) => allocation.distributionId === row.id).reduce((sum, allocation) => sum + Number(allocation.amount || 0), 0)
          : Number(row.allocatedProfitLoss || 0)),
        expense: result.expense + Number(row.expense || 0),
        net: result.net + (investorIds.size
          ? allocations.filter((allocation) => allocation.distributionId === row.id).reduce((sum, allocation) => sum + Number(allocation.amount || 0), 0)
          : Number(row.netIncome || 0)),
      }), { gross: 0, allocated: 0, expense: 0, net: 0 });

      return clone({
        dataset: this.dataset.metadata,
        organization: this.dataset.organization,
        totals,
        farms: farmRows,
        investors: investorRows,
        farmInvestorEquity: equityRows,
        distributions,
        allocations,
      });
    }

    listFarms(filters = {}) { return this.getSummary(filters).farms; }
    getFarm(farmId, filters = {}) { return this.listFarms({ ...filters, farmId }).find((farm) => farm.id === farmId) || null; }
    listInvestors(filters = {}) { return this.getSummary(filters).investors; }
    getInvestor(investorId, filters = {}) { return this.listInvestors({ ...filters, investorId }).find((investor) => investor.id === investorId) || null; }
    listEquities(filters = {}) {
      const normalized = this.normalizeFilters(filters);
      return clone(this.dataset.farmInvestorEquity.filter((row) => (!normalized.farmIds.length || normalized.farmIds.includes(row.farmId)) && (!normalized.investorIds.length || normalized.investorIds.includes(row.investorId))));
    }
    listDistributions(filters = {}) { return clone(this.distributionRows(filters)); }
    getDistribution(distributionId) { return clone(this.dataset.distributions.find((row) => row.id === distributionId) || null); }
    listAllocations(filters = {}) { return this.getSummary(filters).allocations; }
    getDistributionAllocations(distributionId) { return clone(this.dataset.allocations.filter((row) => row.distributionId === distributionId)); }
    getInvestorAllocations(investorId, filters = {}) { return clone(this.dataset.allocations.filter((row) => row.investorId === investorId && this.distributionRows({ ...filters, investorId }).some((distribution) => distribution.id === row.distributionId))); }
    listSourceReferences(filters = {}) {
      const distributions = this.listDistributions(filters);
      const distributionById = new Map(distributions.map((distribution) => [distribution.id, distribution]));
      const references = this.dataset.sourceReferences || this.dataset.distributions.map((distribution) => ({
        id: `syn-source-${distribution.id}`,
        distributionId: distribution.id,
        sourceDataset: distribution.sourceDataset,
        sourceRowKey: distribution.sourceRowKey,
        sourceDateRoc: distribution.sourceDateRoc,
      }));
      return clone(references.filter((reference) => distributionById.has(reference.distributionId)).map((reference) => ({
        ...reference,
        distributionDate: distributionById.get(reference.distributionId).distributionDate,
        classification: this.dataset.metadata.classification,
      })));
    }
    getSourceReference(distributionId) { return this.listSourceReferences().find((row) => row.distributionId === distributionId) || null; }
    getCumulativeNetSeries(filters = {}) {
      const normalized = this.normalizeFilters(filters);
      const distributions = this.distributionRows(filters);
      const allocationsByDistribution = new Map();
      const investorIds = new Set(normalized.investorIds);
      if (investorIds.size) {
        this.dataset.allocations.forEach((allocation) => {
          if (!investorIds.has(allocation.investorId)) return;
          allocationsByDistribution.set(allocation.distributionId, (allocationsByDistribution.get(allocation.distributionId) || 0) + Number(allocation.amount || 0));
        });
      }
      let runningTotal = 0;
      return distributions.map((distribution) => {
        const netIncome = investorIds.size ? allocationsByDistribution.get(distribution.id) || 0 : Number(distribution.netIncome || 0);
        runningTotal += netIncome;
        return {
          date: distribution.distributionDate,
          label: distribution.distributionDate.slice(0, 7),
          distributionId: distribution.id,
          netIncome,
          expense: Number(distribution.expense || 0),
          runningTotal,
          value: runningTotal,
        };
      });
    }
    getExpenseSeries(filters = {}) {
      return this.distributionRows(filters).map((distribution) => ({
        date: distribution.distributionDate,
        label: distribution.distributionDate.slice(0, 7),
        distributionId: distribution.id,
        expense: Number(distribution.expense || 0),
        value: Number(distribution.expense || 0),
      }));
    }
  }
  class AuditRepository extends BaseRepository {}
  class SettingsRepository extends BaseRepository {}
  class AnalyticsRepository extends BaseRepository {}

  return {
    KEYS,
    MODES,
    MASTER_DATA_TYPES,
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
