(function attachJinjiDomain(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.JinjiDomain = api;
})(typeof window === "object" ? window : (typeof globalThis === "object" ? globalThis : null), () => {
  "use strict";

  const MODEL_NAMES = Object.freeze([
    "Organization",
    "Farm",
    "House",
    "Flock",
    "OperationalEvent",
    "PendingReview",
    "Abnormality",
    "CalendarEvent",
    "FinanceEntry",
    "Investor",
    "FarmInvestorEquity",
    "ProfitDistribution",
    "ProfitDistributionAllocation",
    "FinanceSourceReference",
    "AuditEntry",
    "TrendThreshold",
    "ClickAnalytics",
    "DeveloperLog",
    "SyncOperation",
    "CaretakerAssignment",
    "FarmFinanceIdentity",
  ]);

  const EVENT_TYPES = Object.freeze([
    "mortality",
    "cull",
    "feed",
    "water",
    "shipment",
    "chick_in",
    "weigh",
    "other",
  ]);

  const EVENT_UNITS = Object.freeze({
    mortality: "隻",
    cull: "隻",
    feed: "kg",
    water: "L",
    shipment: "隻",
    chick_in: "隻",
    weigh: "kg",
    other: "筆",
  });

  const MASTER_DATA_COLLECTIONS = Object.freeze([
    "farms",
    "houses",
    "flocks",
    "caretakerAssignments",
    "financeIdentities",
  ]);

  const TYPES = {};
  MODEL_NAMES.forEach((name) => {
    TYPES[name] = class DomainEntity {
      constructor(input = {}) {
        Object.assign(this, input);
      }
    };
  });

  function clone(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  const FINANCE_EPSILON = 1e-9;

  function financeApproxEqual(left, right, epsilon = FINANCE_EPSILON) {
    return Math.abs(Number(left) - Number(right)) <= epsilon;
  }

  function financeNumber(value, field) {
    const numberValue = Number(value ?? 0);
    if (!Number.isFinite(numberValue)) throw new Error(`FINANCE_NUMBER_INVALID:${field}`);
    return numberValue;
  }

  function validateFinanceDataset(dataset) {
    const expect = (condition, message) => {
      if (!condition) throw new Error(`FINANCE_CONTRACT_INVALID:${message}`);
    };
    expect(dataset && typeof dataset === "object", "dataset");
    expect(dataset.metadata?.classification === "synthetic", "classification");
    expect(String(dataset.metadata?.datasetId || "").startsWith("SYNTHETIC_"), "datasetId");
    expect(Number(dataset.metadata?.schemaVersion) >= 1, "schemaVersion");
    expect(String(dataset.organization?.id || "").startsWith("syn-"), "organization id");
    expect(Array.isArray(dataset.farms), "farms");
    expect(Array.isArray(dataset.investors), "investors");
    expect(Array.isArray(dataset.farmInvestorEquity), "farmInvestorEquity");
    expect(Array.isArray(dataset.distributions), "distributions");
    expect(Array.isArray(dataset.allocations), "allocations");

    const farms = new Map();
    dataset.farms.forEach((farm) => {
      expect(String(farm.id || "").startsWith("syn-"), `farm id ${farm.id}`);
      expect(!farms.has(farm.id), `duplicate farm ${farm.id}`);
      const totalEquity = financeNumber(farm.farmTotalEquityFraction, `${farm.id}.farmTotalEquityFraction`);
      const playerEquity = financeNumber(farm.playerGroupEquityFraction, `${farm.id}.playerGroupEquityFraction`);
      expect(totalEquity >= 0 && totalEquity <= 1, `${farm.id} total equity range`);
      expect(playerEquity >= 0 && playerEquity <= totalEquity + FINANCE_EPSILON, `${farm.id} player equity range`);
      farms.set(farm.id, farm);
    });
    const investors = new Map();
    dataset.investors.forEach((investor) => {
      expect(String(investor.id || "").startsWith("syn-"), `investor id ${investor.id}`);
      expect(!investors.has(investor.id), `duplicate investor ${investor.id}`);
      investors.set(investor.id, investor);
    });

    const equityTotals = new Map();
    dataset.farmInvestorEquity.forEach((row) => {
      expect(String(row.id || "").startsWith("syn-"), `equity id ${row.id}`);
      expect(farms.has(row.farmId), `equity farm ${row.farmId}`);
      expect(investors.has(row.investorId), `equity investor ${row.investorId}`);
      const fraction = financeNumber(row.equityFraction, `${row.id}.equityFraction`);
      expect(fraction >= 0 && fraction <= 1, `${row.id} equity range`);
      const key = row.farmId;
      equityTotals.set(key, (equityTotals.get(key) || 0) + fraction);
    });
    farms.forEach((farm, farmId) => {
      const actual = equityTotals.get(farmId) || 0;
      expect(financeApproxEqual(actual, farm.playerGroupEquityFraction), `${farmId} equity sum`);
    });

    const distributions = new Map();
    dataset.distributions.forEach((distribution) => {
      expect(String(distribution.id || "").startsWith("syn-"), `distribution id ${distribution.id}`);
      expect(distribution.organizationId === dataset.organization.id, `${distribution.id} organization`);
      expect(farms.has(distribution.farmId), `${distribution.id} farm`);
      expect(/^\d{4}-\d{2}-\d{2}$/.test(String(distribution.distributionDate || "")), `${distribution.id} distributionDate`);
      expect(/^\d{3}\/\d{2}\/\d{2}$/.test(String(distribution.sourceDateRoc || "")), `${distribution.id} sourceDateRoc`);
      expect(String(distribution.sourceDataset || "").startsWith("SYNTHETIC_"), `${distribution.id} sourceDataset`);
      expect(String(distribution.sourceRowKey || "").startsWith("fixture://"), `${distribution.id} sourceRowKey`);
      const allocated = financeNumber(distribution.allocatedProfitLoss, `${distribution.id}.allocatedProfitLoss`);
      const expense = financeNumber(distribution.expense, `${distribution.id}.expense`);
      const net = financeNumber(distribution.netIncome, `${distribution.id}.netIncome`);
      financeNumber(distribution.grossProfitLoss, `${distribution.id}.grossProfitLoss`);
      expect(financeApproxEqual(net, allocated - expense), `${distribution.id} net equation`);
      expect(!distributions.has(distribution.id), `duplicate distribution ${distribution.id}`);
      distributions.set(distribution.id, distribution);
    });

    const allocationTotals = new Map();
    dataset.allocations.forEach((allocation) => {
      expect(String(allocation.id || "").startsWith("syn-"), `allocation id ${allocation.id}`);
      expect(distributions.has(allocation.distributionId), `allocation distribution ${allocation.distributionId}`);
      expect(investors.has(allocation.investorId), `allocation investor ${allocation.investorId}`);
      const amount = financeNumber(allocation.amount, `${allocation.id}.amount`);
      allocationTotals.set(allocation.distributionId, (allocationTotals.get(allocation.distributionId) || 0) + amount);
    });
    distributions.forEach((distribution, distributionId) => {
      expect(financeApproxEqual(allocationTotals.get(distributionId) || 0, distribution.netIncome), `${distributionId} allocation total`);
    });

    if (dataset.sourceReferences !== undefined) {
      expect(Array.isArray(dataset.sourceReferences), "sourceReferences");
      expect(dataset.sourceReferences.length === dataset.distributions.length, "sourceReferences count");
      const sourceDistributionIds = new Set();
      dataset.sourceReferences.forEach((reference) => {
        expect(String(reference.id || "").startsWith("syn-"), `source reference id ${reference.id}`);
        expect(distributions.has(reference.distributionId), `source reference distribution ${reference.distributionId}`);
        expect(!sourceDistributionIds.has(reference.distributionId), `duplicate source reference ${reference.distributionId}`);
        expect(reference.sourceDataset === distributions.get(reference.distributionId).sourceDataset, `source reference dataset ${reference.id}`);
        expect(reference.sourceRowKey === distributions.get(reference.distributionId).sourceRowKey, `source reference row ${reference.id}`);
        expect(reference.sourceDateRoc === distributions.get(reference.distributionId).sourceDateRoc, `source reference ROC ${reference.id}`);
        sourceDistributionIds.add(reference.distributionId);
      });
    }

    const totals = dataset.distributions.reduce((result, distribution) => ({
      gross: result.gross + financeNumber(distribution.grossProfitLoss, `${distribution.id}.grossProfitLoss`),
      allocated: result.allocated + financeNumber(distribution.allocatedProfitLoss, `${distribution.id}.allocatedProfitLoss`),
      expense: result.expense + financeNumber(distribution.expense, `${distribution.id}.expense`),
      net: result.net + financeNumber(distribution.netIncome, `${distribution.id}.netIncome`),
    }), { gross: 0, allocated: 0, expense: 0, net: 0 });
    return {
      farms: dataset.farms.length,
      investors: dataset.investors.length,
      equityRows: dataset.farmInvestorEquity.length,
      distributions: dataset.distributions.length,
      allocations: dataset.allocations.length,
      totals,
    };
  }

  function nowIso(now = new Date()) {
    return now instanceof Date ? now.toISOString() : new Date(now).toISOString();
  }

  function id(prefix = "lab") {
    const random = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    return `${prefix}-${random}`;
  }

  function clientOperationId(prefix = "op") {
    return id(prefix);
  }

  function assertEventType(type) {
    if (!EVENT_TYPES.includes(type)) throw new Error(`DOMAIN_EVENT_TYPE_INVALID:${type}`);
  }

  function numericQuantity(input) {
    const value = Number(input);
    if (!Number.isFinite(value) || value < 0) throw new Error("DOMAIN_EVENT_QUANTITY_INVALID");
    return value;
  }

  function createOperationalEvent(input = {}, now = new Date()) {
    const type = String(input.type || "other");
    assertEventType(type);
    const quantity = numericQuantity(input.quantity ?? input.value ?? 0);
    const createdAt = input.createdAt || nowIso(now);
    const date = input.date || createdAt.slice(0, 10);
    const time = input.time || createdAt.slice(11, 16);
    return {
      id: input.id || id("event"),
      type,
      date,
      time,
      farmId: input.farmId || null,
      houseId: input.houseId || null,
      flockId: input.flockId || null,
      quantity,
      value: input.value ?? quantity,
      qty: input.qty ?? quantity,
      unit: input.unit || EVENT_UNITS[type] || "筆",
      source: input.source || "lab",
      createdAt,
      clientOperationId: input.clientOperationId || clientOperationId("op"),
      ...(input.note ? { note: String(input.note) } : {}),
      ...(input.parentEventId ? { parentEventId: input.parentEventId } : {}),
      ...(input.correctionOf ? { correctionOf: input.correctionOf } : {}),
      ...(input.reversalOf ? { reversalOf: input.reversalOf } : {}),
    };
  }

  function normalizeEvent(event) {
    return createOperationalEvent(event, event?.createdAt || new Date());
  }

  function eventEffect(event) {
    return event?.reversalOf ? -1 : 1;
  }

  function reconstructOperationalEvents(events = []) {
    const rows = events.map(normalizeEvent);
    const reversed = new Set(rows.filter((event) => event.reversalOf).map((event) => event.reversalOf));
    return rows
      .filter((event) => !event.reversalOf && !reversed.has(event.id) && event.status !== "void")
      .sort((a, b) => `${a.date} ${a.time} ${a.id}`.localeCompare(`${b.date} ${b.time} ${b.id}`));
  }

  function sumEvents(events = [], options = {}) {
    const { type = null, date = null, matches = null } = options;
    return reconstructOperationalEvents(events)
      .filter((event) => (!type || event.type === type) && (!date || event.date === date) && (!matches || matches(event)))
      .reduce((sum, event) => sum + Number(event.quantity || event.qty || event.value || 0), 0);
  }

  function parseDigits(value) {
    return String(value).replace(/[０-９]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xff10 + 48));
  }

  function parseQuickRecord(rawText) {
    const raw = parseDigits(String(rawText || "")).trim();
    if (!raw) return { status: "pending", reason: "empty", message: "請輸入一筆可辨識的紀錄。" };
    if (raw.length > 240) return { status: "pending", reason: "too_long", message: "內容過長，請拆成一筆一筆的結構化紀錄。" };
    const patterns = [
      { type: "mortality", unit: "隻", pattern: /(?:死亡|死雞|死鳥)\s*([0-9]+(?:\.[0-9]+)?)/i },
      { type: "cull", unit: "隻", pattern: /(?:淘汰|淘雞)\s*([0-9]+(?:\.[0-9]+)?)/i },
      { type: "feed", unit: "kg", pattern: /(?:飼料|飼料量)\s*([0-9]+(?:\.[0-9]+)?)\s*(?:kg|公斤)?/i },
      { type: "water", unit: "L", pattern: /(?:飲水|飲水量)\s*([0-9]+(?:\.[0-9]+)?)\s*(?:l|公升)?/i },
      { type: "shipment", unit: "隻", pattern: /(?:出雞|出貨)\s*([0-9]+(?:\.[0-9]+)?)\s*(?:隻)?/i },
    ];
    const matches = patterns.map((entry) => ({ ...entry, match: raw.match(entry.pattern) })).filter((entry) => entry.match);
    if (matches.length !== 1) {
      return {
        status: "pending",
        reason: matches.length > 1 ? "ambiguous_multiple_metrics" : "unrecognized",
        message: matches.length > 1 ? "一筆文字包含多種數據，請拆開後再確認。" : "無法安全辨識類型與數量，請交由人工確認。",
        rawPreview: raw.slice(0, 80),
      };
    }
    const match = matches[0];
    const quantity = Number(match.match[1]);
    if (!Number.isInteger(quantity) && ["mortality", "cull", "shipment"].includes(match.type)) {
      return { status: "pending", reason: "integer_required", message: "死亡、淘汰與出雞數量必須是整數。", rawPreview: raw.slice(0, 80) };
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      return { status: "pending", reason: "quantity_invalid", message: "數量必須大於 0。", rawPreview: raw.slice(0, 80) };
    }
    const note = raw.replace(match.match[0], "").replace(/[，,。；;]+/g, " ").trim();
    return {
      status: "event",
      event: { type: match.type, quantity, unit: match.unit, source: "quick_record", ...(note ? { note } : {}) },
      rawPreview: raw.slice(0, 80),
    };
  }

  function createCorrectionLedger(originalInput, options = {}, now = new Date()) {
    const original = normalizeEvent(originalInput);
    const operation = options.operation || "replacement";
    const replacementInputs = Array.isArray(options.replacements)
      ? options.replacements
      : [options.replacement || options.patch || {}];
    const reversal = createOperationalEvent({
      ...original,
      id: id("reversal"),
      source: options.source || "lab_correction",
      reversalOf: original.id,
      correctionOf: original.id,
      clientOperationId: clientOperationId("correction"),
    }, now);
    const replacements = replacementInputs.map((replacement, index) => createOperationalEvent({
      ...original,
      ...replacement,
      id: replacement.id || id(`replacement-${index + 1}`),
      source: options.source || "lab_correction",
      correctionOf: original.id,
      parentEventId: original.id,
      clientOperationId: clientOperationId("correction"),
    }, now));
    const audit = {
      id: id("audit"),
      entityType: "OperationalEvent",
      entityId: original.id,
      operation,
      oldEvent: clone(original),
      newEventIds: replacements.map((event) => event.id),
      source: options.source || "lab_correction",
      timestamp: nowIso(now),
    };
    return { reversal, replacements, audit };
  }

  function requiredMasterText(value, field) {
    const text = String(value ?? "").trim();
    if (!text) throw new Error(`MASTER_DATA_${field.toUpperCase()}_REQUIRED`);
    return text;
  }

  function validMasterDate(value, field) {
    const date = String(value ?? "").trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`MASTER_DATA_${field.toUpperCase()}_DATE_INVALID`);
    const parsed = new Date(`${date}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) throw new Error(`MASTER_DATA_${field.toUpperCase()}_DATE_INVALID`);
    return date;
  }

  function nonnegativeInteger(value, field, { positive = false } = {}) {
    const numberValue = Number(value);
    if (!Number.isInteger(numberValue) || numberValue < 0 || (positive && numberValue <= 0)) {
      throw new Error(`MASTER_DATA_${field.toUpperCase()}_INTEGER_INVALID`);
    }
    return numberValue;
  }

  function createFarm(input = {}, now = new Date()) {
    const name = requiredMasterText(input.name, "farm_name");
    const description = String(input.description ?? "").trim();
    const type = String(input.type ?? "").trim();
    return {
      id: input.id || id("farm"),
      name,
      description,
      type,
      subtitle: input.subtitle || description || "Lab 新增雞場",
      breed: input.breed || type || "待設定",
      risk: input.risk || "新建待設定",
      stock: 0,
      active: input.active !== false,
      caretakers: [],
      houses: [],
      source: input.source || "lab_master_data",
      createdAt: input.createdAt || nowIso(now),
    };
  }

  function createHouse(input = {}, now = new Date()) {
    return {
      id: input.id || id("house"),
      farmId: requiredMasterText(input.farmId, "farm_id"),
      name: requiredMasterText(input.name, "house_name"),
      code: requiredMasterText(input.code, "house_code"),
      flocks: [],
      source: input.source || "lab_master_data",
      createdAt: input.createdAt || nowIso(now),
    };
  }

  function createFlock(input = {}, now = new Date()) {
    const code = requiredMasterText(input.code, "flock_code");
    const houseId = requiredMasterText(input.houseId, "house_id");
    const chickIn = validMasterDate(input.chickIn ?? input.chickInDate, "chick_in");
    const ship = validMasterDate(input.ship ?? input.plannedShipment, "planned_shipment");
    if (ship < chickIn) throw new Error("MASTER_DATA_SHIPMENT_BEFORE_CHICK_IN");
    const initial = nonnegativeInteger(input.initial ?? input.initialQuantity, "initial", { positive: true });
    const stock = input.stock === undefined ? initial : nonnegativeInteger(input.stock, "stock");
    if (stock > initial) throw new Error("MASTER_DATA_STOCK_EXCEEDS_INITIAL");
    const hasMale = input.male !== undefined && input.male !== "";
    const hasFemale = input.female !== undefined && input.female !== "";
    if (hasMale !== hasFemale) throw new Error("MASTER_DATA_SEX_PAIR_REQUIRED");
    const sex = hasMale
      ? {
          male: nonnegativeInteger(input.male, "male"),
          female: nonnegativeInteger(input.female, "female"),
        }
      : null;
    if (sex && sex.male + sex.female !== initial) throw new Error("MASTER_DATA_SEX_TOTAL_MISMATCH");
    const state = input.state || (input.status === "已出雞" ? "closed" : "active");
    return {
      id: input.id || id("flock"),
      houseId,
      code,
      chickIn,
      initial,
      ship,
      plannedShipment: ship,
      stock,
      state,
      status: input.status || (state === "closed" ? "已出雞" : "進行中"),
      ...(sex || {}),
      source: input.source || "lab_master_data",
      createdAt: input.createdAt || nowIso(now),
    };
  }

  function createCaretakerAssignment(input = {}, now = new Date()) {
    const caretakerName = requiredMasterText(input.caretakerName ?? input.name, "caretaker_name");
    return {
      id: input.id || id("caretaker-assignment"),
      farmId: requiredMasterText(input.farmId, "farm_id"),
      caretakerId: input.caretakerId || id("caretaker"),
      caretakerName,
      source: input.source || "lab_master_data",
      createdAt: input.createdAt || nowIso(now),
    };
  }

  function createFarmFinanceIdentity(input = {}, now = new Date()) {
    return {
      id: input.id || id("finance-identity"),
      operationalFarmId: requiredMasterText(input.operationalFarmId ?? input.farmId, "operational_farm_id"),
      status: "unconfigured",
      dataState: "no_finance_data",
      source: input.source || "lab_master_data",
      createdAt: input.createdAt || nowIso(now),
    };
  }

  function validateMasterData(masterData = {}) {
    const rows = {};
    MASTER_DATA_COLLECTIONS.forEach((key) => {
      rows[key] = Array.isArray(masterData[key]) ? masterData[key] : [];
    });
    const expect = (condition, message) => {
      if (!condition) throw new Error(`MASTER_DATA_CONTRACT_INVALID:${message}`);
    };
    const uniqueIds = (key) => {
      const seen = new Set();
      rows[key].forEach((row) => {
        expect(row && typeof row === "object", `${key} row`);
        expect(String(row.id || ""), `${key} id`);
        expect(!seen.has(row.id), `duplicate ${key} ${row.id}`);
        seen.add(row.id);
      });
      return seen;
    };
    uniqueIds("farms");
    uniqueIds("houses");
    uniqueIds("flocks");
    uniqueIds("caretakerAssignments");
    uniqueIds("financeIdentities");
    const farmIds = new Set(rows.farms.map((farm) => farm.id));
    const houseIds = new Set(rows.houses.map((house) => house.id));
    rows.houses.forEach((house) => expect(farmIds.has(house.farmId), `house farm ${house.id}`));
    rows.flocks.forEach((flock) => expect(houseIds.has(flock.houseId), `flock house ${flock.id}`));
    rows.caretakerAssignments.forEach((assignment) => expect(farmIds.has(assignment.farmId), `caretaker farm ${assignment.id}`));
    const financeFarmIds = new Set();
    rows.financeIdentities.forEach((identity) => {
      expect(farmIds.has(identity.operationalFarmId), `finance identity farm ${identity.id}`);
      expect(identity.status === "unconfigured", `finance identity status ${identity.id}`);
      expect(!financeFarmIds.has(identity.operationalFarmId), `duplicate finance identity ${identity.operationalFarmId}`);
      financeFarmIds.add(identity.operationalFarmId);
    });
    expect(rows.financeIdentities.length === rows.farms.length, "finance identity one-to-one");
    return {
      farms: rows.farms.length,
      houses: rows.houses.length,
      flocks: rows.flocks.length,
      caretakerAssignments: rows.caretakerAssignments.length,
      financeIdentities: rows.financeIdentities.length,
    };
  }

  function calendarDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  function calendarMonthCells(year, month) {
    const days = calendarDaysInMonth(year, month);
    const leading = new Date(year, month - 1, 1).getDay();
    const cells = Array.from({ length: leading }, () => null);
    for (let day = 1; day <= days; day += 1) cells.push(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
    while (cells.length % 7) cells.push(null);
    return cells;
  }

  function createAuditEntry(input = {}, now = new Date()) {
    return {
      id: input.id || id("audit"),
      entityType: input.entityType || "OperationalEvent",
      entityId: input.entityId || null,
      operation: input.operation || "create",
      source: input.source || "lab",
      timestamp: input.timestamp || nowIso(now),
      ...(input.oldEvent ? { oldEvent: clone(input.oldEvent) } : {}),
      ...(input.newEventIds ? { newEventIds: clone(input.newEventIds) } : {}),
      ...(input.metadata ? { metadata: clone(input.metadata) } : {}),
    };
  }

  return {
    MODEL_NAMES,
    EVENT_TYPES,
    EVENT_UNITS,
    ...TYPES,
    clone,
    FINANCE_EPSILON,
    financeApproxEqual,
    validateFinanceDataset,
    id,
    clientOperationId,
    createOperationalEvent,
    normalizeEvent,
    reconstructOperationalEvents,
    eventEffect,
    sumEvents,
    parseQuickRecord,
    createCorrectionLedger,
    MASTER_DATA_COLLECTIONS,
    createFarm,
    createHouse,
    createFlock,
    createCaretakerAssignment,
    createFarmFinanceIdentity,
    validateMasterData,
    calendarDaysInMonth,
    calendarMonthCells,
    createAuditEntry,
  };
});
