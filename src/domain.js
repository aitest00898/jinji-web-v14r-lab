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
    "AuditEntry",
    "TrendThreshold",
    "ClickAnalytics",
    "DeveloperLog",
    "SyncOperation",
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
    };
  }

  return {
    MODEL_NAMES,
    EVENT_TYPES,
    EVENT_UNITS,
    ...TYPES,
    clone,
    id,
    clientOperationId,
    createOperationalEvent,
    normalizeEvent,
    reconstructOperationalEvents,
    eventEffect,
    sumEvents,
    parseQuickRecord,
    createCorrectionLedger,
    calendarDaysInMonth,
    calendarMonthCells,
    createAuditEntry,
  };
});
