(function attachJinjiRecordingTaxonomy(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.JinjiRecordingTaxonomy = api;
})(typeof window === "object" ? window : (typeof globalThis === "object" ? globalThis : null), () => {
  "use strict";

  const families = Object.freeze(["operational_event", "operational_observation", "operational_action"]);
  const sourceChannels = Object.freeze(["line", "web", "ambient", "system"]);
  const sexes = Object.freeze(["male", "female", "mixed", "unspecified"]);
  const extents = Object.freeze(["small", "medium", "large"]);
  const definitions = [
    ["O1", "入雛", "operational_event", "event", ["chick_in"], ["houseId", "flockId", "maleCount", "femaleCount", "condition"], [], ["totalCount"], 1],
    ["O2", "疫苗／用藥／補充品", "operational_action", "action", ["vaccination", "medication", "supplement"], ["content"], ["houseId", "flockId"], [], 0],
    ["O3", "出雞", "operational_event", "event", ["shipment"], ["quantity", "sex"], ["houseId", "flockId", "totalWeight"], ["averageWeight"], -1],
    ["O4", "磅重", "operational_event", "event", ["weigh"], ["houseId", "flockId", "averageWeight", "sex"], ["chickInDate"], ["ageDays"], 0],
    ["O5", "叫飼料", "operational_action", "action", ["feed_order"], ["vendor", "weight", "weightUnit"], ["houseId"], [], 0],
    ["O6", "送驗", "operational_action", "action", ["lab_test"], ["submittedAt", "content", "status"], ["houseId", "flockId", "result", "completedAt"], ["reminderDueAt"], 0],
    ["O7", "清消", "operational_action", "action", ["disinfection"], ["completionStatus"], ["houseId", "flockId"], [], 0],
    ["O8", "設備維護", "operational_action", "action", ["maintenance"], ["maintenanceContent"], ["houseId"], [], 0],
    ["O9", "死亡／淘汰", "operational_event", "event", ["mortality", "cull"], ["quantity"], ["houseId", "flockId", "sex"], [], -1],
    ["A1", "死亡異常", "operational_observation", "observation", ["mortality_abnormality"], ["extent", "linkedMortalityEventId"], ["houseId", "flockId", "detail"], [], 0],
    ["A2", "咳嗽", "operational_observation", "observation", ["cough"], ["extent"], ["houseId", "flockId", "detail"], [], 0],
    ["A3", "喘／呼吸困難", "operational_observation", "observation", ["respiratory_distress"], ["extent"], ["houseId", "flockId", "detail"], [], 0],
    ["A4", "精神不振／活動下降", "operational_observation", "observation", ["activity_down"], ["extent"], ["houseId", "flockId", "detail"], [], 0],
    ["A5", "外觀", "operational_observation", "observation", ["eye_swelling", "white_crown", "purple_crown", "black_crown"], ["extent"], ["houseId", "flockId", "detail"], [], 0],
    ["A6", "下痢", "operational_observation", "observation", ["watery", "white", "green", "bloody"], ["extent"], ["houseId", "flockId", "detail"], [], 0],
    ["A7", "生長遲緩", "operational_observation", "observation", ["growth_delay"], ["extent"], ["houseId", "flockId", "detail"], [], 0],
    ["A8", "臭腳", "operational_observation", "observation", ["foot_odor"], ["extent"], ["houseId", "flockId", "detail"], [], 0],
    ["A9", "發燒", "operational_observation", "observation", ["fever"], ["extent"], ["houseId", "flockId", "measuredTemperature", "detail"], [], 0],
    ["A10", "緊迫", "operational_observation", "observation", ["heat_stress", "catching_stress"], ["extent"], ["houseId", "flockId", "detail"], [], 0],
    ["A11", "採食／飲水異常", "operational_observation", "observation", ["feeding_abnormality", "water_abnormality"], ["extent"], ["houseId", "flockId", "measurement", "detail"], [], 0],
    ["A12", "設備異常", "operational_observation", "observation", ["feed", "water", "electricity", "fan", "cooling", "heating", "other"], ["extent"], ["houseId", "flockId", "detail"], [], 0],
    ["A13", "天候異常", "operational_observation", "observation", ["high_temperature", "low_temperature", "heavy_rain"], ["extent"], ["houseId", "flockId", "measurement"], [], 0],
    ["A14", "淹水", "operational_observation", "observation", ["flooding"], ["extent"], ["houseId", "flockId", "detail"], [], 0],
    ["A15", "異味", "operational_observation", "observation", ["odor"], ["extent"], ["houseId", "flockId", "detail"], [], 0],
    ["A16", "場地事件", "operational_observation", "observation", ["attack", "infection", "spread"], ["extent"], ["houseId", "flockId", "detail", "evidence"], [], 0],
  ].map(([id, label, family, canonicalType, canonicalSubtypes, requiredFields, optionalFields, derivedFields, stockEffect]) => Object.freeze({
    id, label, family, canonicalType,
    canonicalSubtypes: Object.freeze(canonicalSubtypes),
    requiredFields: Object.freeze(requiredFields),
    optionalFields: Object.freeze(optionalFields),
    derivedFields: Object.freeze(derivedFields),
    stockEffect,
  }));
  const taxonomy = Object.freeze(definitions);
  const byId = new Map(taxonomy.map((item) => [item.id, item]));

  function fail(code, field) {
    throw new Error(field ? code + ":" + field : code);
  }

  function required(record, field) {
    if (record[field] === undefined || record[field] === null || record[field] === "") fail("RECORDING_REQUIRED_FIELD", field);
    return record[field];
  }

  function text(value, field, maxLength) {
    if (typeof value !== "string" || !value.trim() || value.trim().length > maxLength) fail("RECORDING_TEXT_INVALID", field);
    return value.trim();
  }

  function number(value, field, positive) {
    const result = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(result) || (positive ? result <= 0 : result < 0)) fail("RECORDING_NUMBER_INVALID", field);
    return result;
  }

  function validateCanonicalRecording(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) fail("RECORDING_OBJECT_INVALID");
    const record = input;
    const definition = byId.get(record.taxonomyId);
    if (!definition) fail("RECORDING_TAXONOMY_ID_INVALID", "taxonomyId");
    if (record.family !== definition.family) fail("RECORDING_FAMILY_INVALID", "family");
    if (record.type !== definition.canonicalType) fail("RECORDING_TYPE_INVALID", "type");
    if (!definition.canonicalSubtypes.includes(record.subtype)) fail("RECORDING_SUBTYPE_INVALID", "subtype");
    text(required(record, "id"), "id", 160);
    text(required(record, "occurredAt"), "occurredAt", 80);
    text(required(record, "createdAt"), "createdAt", 80);
    text(required(record, "farmId"), "farmId", 160);
    if (!sourceChannels.includes(record.sourceChannel)) fail("RECORDING_ENUM_INVALID", "sourceChannel");
    text(required(record, "rawText"), "rawText", 2000);
    text(required(record, "clientOperationId"), "clientOperationId", 200);
    definition.requiredFields.forEach((field) => required(record, field));
    if (definition.id === "O1") {
      number(record.maleCount, "maleCount", false);
      number(record.femaleCount, "femaleCount", false);
      if (!Number.isSafeInteger(Number(record.maleCount)) || !Number.isSafeInteger(Number(record.femaleCount))) fail("RECORDING_INTEGER_INVALID");
      if (!["good", "fair", "poor"].includes(record.condition)) fail("RECORDING_ENUM_INVALID", "condition");
      if (record.totalCount !== undefined && Number(record.totalCount) !== Number(record.maleCount) + Number(record.femaleCount)) fail("RECORDING_DERIVED_FIELD_MISMATCH", "totalCount");
    }
    if (definition.id === "O2") text(record.content, "content", 240);
    if (definition.id === "O3") {
      number(record.quantity, "quantity", true);
      if (!sexes.includes(record.sex)) fail("RECORDING_ENUM_INVALID", "sex");
      if (record.totalWeight !== undefined) number(record.totalWeight, "totalWeight", true);
      if (record.averageWeight !== undefined) {
        if (record.totalWeight === undefined) fail("RECORDING_DERIVED_FIELD_MISMATCH", "averageWeight");
        if (Math.abs(Number(record.averageWeight) - Number(record.totalWeight) / Number(record.quantity)) > 1e-9) fail("RECORDING_DERIVED_FIELD_MISMATCH", "averageWeight");
      }
    }
    if (definition.id === "O4") {
      text(record.houseId, "houseId", 160);
      text(record.flockId, "flockId", 160);
      number(record.averageWeight, "averageWeight", true);
      if (!sexes.includes(record.sex)) fail("RECORDING_ENUM_INVALID", "sex");
    }
    if (definition.id === "O5") {
      text(record.vendor, "vendor", 240);
      number(record.weight, "weight", true);
      if (!["kg", "bag"].includes(record.weightUnit)) fail("RECORDING_ENUM_INVALID", "weightUnit");
    }
    if (definition.id === "O6") {
      text(record.submittedAt, "submittedAt", 80);
      text(record.content, "content", 240);
      if (!["waiting_result", "completed"].includes(record.status)) fail("RECORDING_ENUM_INVALID", "status");
      if (record.status === "completed") {
        text(required(record, "result"), "result", 240);
        text(required(record, "completedAt"), "completedAt", 80);
      }
    }
    if (definition.id === "O7" && !["pending", "completed"].includes(record.completionStatus)) fail("RECORDING_ENUM_INVALID", "completionStatus");
    if (definition.id === "O8") text(record.maintenanceContent, "maintenanceContent", 240);
    if (definition.id === "O9") {
      number(record.quantity, "quantity", true);
      if (record.sex !== undefined && !sexes.includes(record.sex)) fail("RECORDING_ENUM_INVALID", "sex");
    }
    if (definition.family === "operational_observation") {
      if (!extents.includes(record.extent)) fail("RECORDING_ENUM_INVALID", "extent");
      if (record.quantity !== undefined && record.quantity !== null) fail("OBSERVATION_QUANTITY_FORBIDDEN", "quantity");
      if (definition.id === "A1") text(record.linkedMortalityEventId, "linkedMortalityEventId", 200);
      if (definition.id === "A12" && record.subtype === "other") text(required(record, "detail"), "detail", 240);
    }
    return true;
  }

  function deriveCanonicalFields(input = {}) {
    const derived = {};
    if (input.subtype === "chick_in" && Number.isSafeInteger(Number(input.maleCount)) && Number.isSafeInteger(Number(input.femaleCount))) derived.totalCount = Number(input.maleCount) + Number(input.femaleCount);
    if (input.subtype === "shipment" && Number(input.quantity) > 0 && Number.isFinite(Number(input.totalWeight))) derived.averageWeight = Number(input.totalWeight) / Number(input.quantity);
    return derived;
  }

  function stockEffectForCanonicalRecord(input = {}) {
    const definition = input.taxonomyId ? byId.get(input.taxonomyId) : taxonomy.find((item) => item.family === input.family && item.canonicalType === input.type && item.canonicalSubtypes.includes(input.subtype));
    if (!definition) fail("RECORDING_TAXONOMY_UNSUPPORTED");
    return definition.stockEffect;
  }

  return {
    RECORDING_FAMILIES: families,
    RECORDING_SOURCE_CHANNELS: sourceChannels,
    RECORDING_SEXES: sexes,
    OBSERVATION_EXTENTS: extents,
    RECORDING_TAXONOMY: taxonomy,
    taxonomyDefinitionFor(id) {
      const value = byId.get(id);
      if (!value) fail("RECORDING_TAXONOMY_ID_INVALID", "taxonomyId");
      return value;
    },
    validateCanonicalRecording,
    deriveCanonicalFields,
    stockEffectForCanonicalRecord,
  };
});
