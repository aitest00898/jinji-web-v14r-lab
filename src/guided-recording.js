(function attachJinjiGuidedRecording(root, factory) {
  let taxonomy = root?.JinjiRecordingTaxonomy;
  if (!taxonomy && typeof module !== "undefined" && module.exports && typeof require === "function") {
    taxonomy = require("./recording-taxonomy.js");
  }
  const api = factory(taxonomy);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.JinjiGuidedRecording = api;
})(typeof window === "object" ? window : (typeof globalThis === "object" ? globalThis : null), (taxonomy) => {
  "use strict";

  if (!taxonomy) throw new Error("GUIDED_RECORDING_TAXONOMY_REQUIRED");

  const AREAS = Object.freeze({
    operational: Object.freeze({ label: "營運資料", taxonomyIds: Object.freeze(["O1", "O2", "O3", "O4", "O5", "O6", "O7", "O8", "O9"]) }),
    abnormal: Object.freeze({ label: "異常登錄", taxonomyIds: Object.freeze(["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15", "A16"]) }),
  });

  const FIELD_LABELS = Object.freeze({
    date: "發生日期",
    maleCount: "公雞數量",
    femaleCount: "母雞數量",
    condition: "雞況",
    content: "內容",
    quantity: "數量",
    sex: "性別／類別",
    totalWeight: "總重量（可選）",
    averageWeight: "平均重量",
    chickInDate: "入雛日期（可選）",
    vendor: "供應商",
    weight: "重量",
    weightUnit: "重量單位",
    workflowStatus: "處理狀態",
    result: "檢驗結果（可選）",
    completedAt: "完成日期（可選）",
    maintenanceContent: "維護內容",
    extent: "影響範圍",
    linkedMortalityEventId: "關聯死亡紀錄",
    detail: "補充說明（可選）",
    measuredTemperature: "量測溫度（可選）",
    measurement: "量測／觀察值（可選）",
    evidence: "證據備註（可選）",
  });

  const NUMERIC_FIELDS = new Set(["maleCount", "femaleCount", "quantity", "totalWeight", "averageWeight", "weight", "measuredTemperature"]);
  const DATE_FIELDS = new Set(["chickInDate", "completedAt"]);
  const SCOPE_FIELDS = new Set(["houseId", "flockId"]);

  function definitionFor(taxonomyId) {
    return taxonomy.taxonomyDefinitionFor(taxonomyId);
  }

  function createState(area, date) {
    if (!AREAS[area]) throw new Error("GUIDED_RECORDING_AREA_INVALID");
    return {
      area,
      step: "category",
      taxonomyId: null,
      subtype: null,
      scope: { farmId: "", houseId: "", flockId: "", wholeFarmConfirmed: false },
      values: { date: String(date || "") },
      fieldIndex: 0,
      error: "",
    };
  }

  function definitionsForArea(area) {
    const config = AREAS[area];
    if (!config) throw new Error("GUIDED_RECORDING_AREA_INVALID");
    return config.taxonomyIds.map(definitionFor);
  }

  function fieldSequence(state) {
    if (!state?.taxonomyId) return [];
    const definition = definitionFor(state.taxonomyId);
    const fields = ["date"];
    definition.requiredFields.forEach((field) => {
      if (!SCOPE_FIELDS.has(field) && field !== "submittedAt" && !fields.includes(field)) fields.push(field);
    });
    definition.optionalFields.forEach((field) => {
      if (SCOPE_FIELDS.has(field) || field === "submittedAt") return;
      if (field === "result" || field === "completedAt") {
        if (state.values?.workflowStatus !== "completed") return;
      }
      if (!fields.includes(field)) fields.push(field);
    });
    return fields;
  }

  function isRequired(state, field) {
    if (!state?.taxonomyId) return false;
    if (definitionFor(state.taxonomyId).requiredFields.includes(field)) return true;
    // A completed O6 record has a stricter conditional contract in the
    // canonical validator: result and completedAt are required together.
    return state.taxonomyId === "O6"
      && state.values?.workflowStatus === "completed"
      && (field === "result" || field === "completedAt");
  }

  function fieldLabel(field) {
    return FIELD_LABELS[field] || field;
  }

  function scopeRequirements(state) {
    const definition = definitionFor(state.taxonomyId);
    return {
      houseRequired: definition.requiredFields.includes("houseId"),
      flockRequired: definition.requiredFields.includes("flockId"),
      wholeFarmAllowed: !definition.requiredFields.includes("houseId"),
    };
  }

  function normalizeValue(field, value) {
    const text = String(value ?? "").trim();
    if (!text) return undefined;
    if (NUMERIC_FIELDS.has(field)) return Number(text);
    if (field === "chickInDate" && /^\d{4}-\d{2}-\d{2}$/u.test(text)) return text;
    if (field === "completedAt" && /^\d{4}-\d{2}-\d{2}$/u.test(text)) return `${text}T09:30:00+08:00`;
    return text;
  }

  function displayValue(field, value) {
    if (value === undefined || value === null) return "";
    if (DATE_FIELDS.has(field) && typeof value === "string") return value.slice(0, 10);
    return String(value);
  }

  function generatedRawText(state, context) {
    const definition = definitionFor(state.taxonomyId);
    const pairs = fieldSequence(state)
      .filter((field) => field !== "date" && state.values[field] !== undefined && state.values[field] !== "")
      .map((field) => `${field}=${state.values[field]}`);
    return `[Web guided] ${definition.id} ${state.subtype} ${context.farmId}${context.houseId ? `/${context.houseId}` : ""}${context.flockId ? `/${context.flockId}` : ""} ${state.values.date || ""} ${pairs.join(" ")}`.slice(0, 2000);
  }

  function buildRecord(state, meta = {}) {
    if (!state?.taxonomyId || !state?.subtype) throw new Error("GUIDED_RECORDING_SELECTION_REQUIRED");
    const definition = definitionFor(state.taxonomyId);
    if (!definition.canonicalSubtypes.includes(state.subtype)) throw new Error("GUIDED_RECORDING_SUBTYPE_INVALID");
    const context = state.scope || {};
    if (!String(context.farmId || "").trim()) throw new Error("GUIDED_RECORDING_FARM_REQUIRED");
    const requirements = scopeRequirements(state);
    if (context.flockId && !context.houseId) throw new Error("GUIDED_RECORDING_FLOCK_REQUIRES_HOUSE");
    if (requirements.houseRequired && !context.houseId) throw new Error("GUIDED_RECORDING_HOUSE_REQUIRED");
    if (requirements.flockRequired && !context.flockId) throw new Error("GUIDED_RECORDING_FLOCK_REQUIRED");
    if (!context.houseId && requirements.wholeFarmAllowed && !context.wholeFarmConfirmed) {
      throw new Error("GUIDED_RECORDING_WHOLE_FARM_CONFIRMATION_REQUIRED");
    }
    const date = String(state.values?.date || "").trim();
    if (!/^\d{4}-\d{2}-\d{2}$/u.test(date)) throw new Error("GUIDED_RECORDING_DATE_REQUIRED");
    const createdAt = meta.createdAt || new Date().toISOString();
    const occurredAt = meta.occurredAt || `${date}T09:30:00+08:00`;
    const record = {
      id: meta.id || `guided-${Date.now()}`,
      taxonomyId: definition.id,
      family: definition.family,
      type: definition.canonicalType,
      subtype: state.subtype,
      occurredAt,
      createdAt,
      farmId: context.farmId,
      ...(context.houseId ? { houseId: context.houseId } : {}),
      ...(context.flockId ? { flockId: context.flockId } : {}),
      sourceChannel: meta.sourceChannel || "web",
      rawText: meta.rawText || generatedRawText(state, context),
      clientOperationId: meta.clientOperationId || `guided-${Date.now()}`,
      confirmedBy: meta.confirmedBy || "web-guided-review",
      scopeSelection: context.flockId ? "flock" : context.houseId ? "house" : "farm",
      scopeConfirmed: Boolean(context.wholeFarmConfirmed || context.houseId),
    };
    fieldSequence(state).forEach((field) => {
      if (field === "date") return;
      const value = normalizeValue(field, state.values?.[field]);
      if (value !== undefined) record[field] = value;
    });
    if (definition.id === "O6") record.submittedAt = occurredAt;
    if (definition.id === "O1") {
      record.totalCount = Number(record.maleCount || 0) + Number(record.femaleCount || 0);
      record.unit = "birds";
    }
    if (definition.id === "O3" && record.totalWeight !== undefined) record.weightUnit = "kg";
    if (definition.id === "O4" && record.averageWeight !== undefined) record.weightUnit = "kg";
    Object.assign(record, taxonomy.deriveCanonicalFields(record));
    taxonomy.validateCanonicalRecording(record);
    return record;
  }

  return Object.freeze({
    AREAS,
    createState,
    definitionsForArea,
    definitionFor,
    fieldSequence,
    fieldLabel,
    isRequired,
    scopeRequirements,
    normalizeValue,
    displayValue,
    buildRecord,
  });
});
