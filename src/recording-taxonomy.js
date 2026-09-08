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
  const o6Statuses = Object.freeze(["waiting_result", "completed"]);
  const actionCompletionStatuses = Object.freeze(["pending", "completed"]);
  const actionWorkflowStates = Object.freeze(["pending", "waiting_result", "completed"]);
  const lifecycleStates = Object.freeze(["active", "reversed", "corrected", "replacement"]);
  const weightUnits = Object.freeze(["kg", "bag"]);
  const metadata = Object.freeze({
    O1: { todoEffect: "none", calendarEffect: "show", webTarget: "flock_guided", lineTarget: "manual_candidate", ambientTarget: "future_bounded" },
    O2: { todoEffect: "none", calendarEffect: "show", webTarget: "guided_action", lineTarget: "manual_candidate", ambientTarget: "future_bounded" },
    O3: { todoEffect: "none", calendarEffect: "show", webTarget: "shipment", lineTarget: "manual_candidate", ambientTarget: "future_bounded" },
    O4: { todoEffect: "none", calendarEffect: "show", webTarget: "weighing", lineTarget: "manual_candidate", ambientTarget: "future_bounded" },
    O5: { todoEffect: "none", calendarEffect: "show", webTarget: "feed_order", lineTarget: "manual_candidate", ambientTarget: "future_bounded" },
    O6: { todoEffect: "follow_up", calendarEffect: "reminder", webTarget: "lab_test", lineTarget: "manual_candidate", ambientTarget: "future_bounded" },
    O7: { todoEffect: "follow_up", calendarEffect: "show", webTarget: "disinfection", lineTarget: "manual_candidate", ambientTarget: "future_bounded" },
    O8: { todoEffect: "follow_up", calendarEffect: "show", webTarget: "maintenance", lineTarget: "manual_candidate", ambientTarget: "future_bounded" },
    O9: { todoEffect: "none", calendarEffect: "show", webTarget: "existing_quick_record", lineTarget: "existing_manual_candidate", ambientTarget: "current_v1" },
    A1: { todoEffect: "follow_up", calendarEffect: "show", webTarget: "observation", lineTarget: "observation_candidate", ambientTarget: "current_coarse" },
    A2: { todoEffect: "follow_up", calendarEffect: "show", webTarget: "observation", lineTarget: "observation_candidate", ambientTarget: "current_coarse" },
    A3: { todoEffect: "follow_up", calendarEffect: "show", webTarget: "observation", lineTarget: "observation_candidate", ambientTarget: "current_coarse" },
    A4: { todoEffect: "follow_up", calendarEffect: "show", webTarget: "observation", lineTarget: "observation_candidate", ambientTarget: "current_coarse" },
    A5: { todoEffect: "follow_up", calendarEffect: "show", webTarget: "observation", lineTarget: "observation_candidate", ambientTarget: "future_subtype" },
    A6: { todoEffect: "follow_up", calendarEffect: "show", webTarget: "observation", lineTarget: "observation_candidate", ambientTarget: "future_subtype" },
    A7: { todoEffect: "follow_up", calendarEffect: "show", webTarget: "observation", lineTarget: "observation_candidate", ambientTarget: "future_bounded" },
    A8: { todoEffect: "follow_up", calendarEffect: "show", webTarget: "observation", lineTarget: "observation_candidate", ambientTarget: "current_coarse" },
    A9: { todoEffect: "follow_up", calendarEffect: "show", webTarget: "observation", lineTarget: "observation_candidate", ambientTarget: "future_bounded" },
    A10: { todoEffect: "follow_up", calendarEffect: "show", webTarget: "observation", lineTarget: "observation_candidate", ambientTarget: "future_subtype" },
    A11: { todoEffect: "follow_up", calendarEffect: "show", webTarget: "observation", lineTarget: "observation_candidate", ambientTarget: "current_coarse" },
    A12: { todoEffect: "follow_up", calendarEffect: "show", webTarget: "observation", lineTarget: "observation_candidate", ambientTarget: "current_coarse" },
    A13: { todoEffect: "follow_up", calendarEffect: "show", webTarget: "observation", lineTarget: "observation_candidate", ambientTarget: "current_coarse" },
    A14: { todoEffect: "follow_up", calendarEffect: "show", webTarget: "observation", lineTarget: "observation_candidate", ambientTarget: "current_coarse" },
    A15: { todoEffect: "follow_up", calendarEffect: "show", webTarget: "observation", lineTarget: "observation_candidate", ambientTarget: "current_coarse" },
    A16: { todoEffect: "follow_up", calendarEffect: "show", webTarget: "observation", lineTarget: "observation_candidate", ambientTarget: "future_subtype" },
  });

  const definitions = [
    ["O1", "入雛", "operational_event", "event", ["chick_in"], ["houseId", "flockId", "maleCount", "femaleCount", "condition"], [], ["totalCount"], 1],
    ["O2", "疫苗／用藥／補充品", "operational_action", "action", ["vaccination", "medication", "supplement"], ["content"], ["houseId", "flockId"], [], 0],
    ["O3", "出雞", "operational_event", "event", ["shipment"], ["quantity", "sex"], ["houseId", "flockId", "totalWeight"], ["averageWeight"], -1],
    ["O4", "磅重", "operational_event", "event", ["weigh"], ["houseId", "flockId", "averageWeight", "sex"], ["chickInDate"], ["ageDays"], 0],
    ["O5", "叫飼料", "operational_action", "action", ["feed_order"], ["vendor", "weight", "weightUnit"], ["houseId"], [], 0],
    ["O6", "送驗", "operational_action", "action", ["lab_test"], ["submittedAt", "content", "workflowStatus"], ["houseId", "flockId", "result", "completedAt"], ["reminderDueAt"], 0],
    ["O7", "清消", "operational_action", "action", ["disinfection"], ["workflowStatus"], ["houseId", "flockId"], [], 0],
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
    ...metadata[id],
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
    if (typeof value !== "string") fail("RECORDING_TEXT_INVALID", field);
    const normalized = value.trim();
    if (!normalized || normalized.length > maxLength || /[\u0000-\u001F\u007F]/u.test(normalized)) fail("RECORDING_TEXT_INVALID", field);
    return normalized;
  }

  function number(value, field, positive) {
    const result = typeof value === "number" ? value : typeof value === "string" && value.trim() ? Number(value) : NaN;
    if (!Number.isFinite(result) || (positive ? result <= 0 : result < 0)) fail("RECORDING_NUMBER_INVALID", field);
    return result;
  }

  function integer(value, field, positive) {
    const result = number(value, field, positive);
    if (!Number.isSafeInteger(result)) fail("RECORDING_INTEGER_INVALID", field);
    return result;
  }

  function isoTimestamp(value, field) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/u.test(value) || !Number.isFinite(Date.parse(value))) fail("RECORDING_TIMESTAMP_INVALID", field);
    return value;
  }

  function enumValue(value, values, field) {
    if (typeof value !== "string" || !values.includes(value)) fail("RECORDING_ENUM_INVALID", field);
    return value;
  }

  function validateCanonicalRecording(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) fail("RECORDING_OBJECT_INVALID");
    const record = input;
    const taxonomyId = text(required(record, "taxonomyId"), "taxonomyId", 20);
    const definition = byId.get(taxonomyId);
    if (!definition) fail("RECORDING_TAXONOMY_ID_INVALID", "taxonomyId");
    if (record.family !== definition.family) fail("RECORDING_FAMILY_INVALID", "family");
    if (record.type !== definition.canonicalType) fail("RECORDING_TYPE_INVALID", "type");
    if (!definition.canonicalSubtypes.includes(record.subtype)) fail("RECORDING_SUBTYPE_INVALID", "subtype");
    text(required(record, "id"), "id", 160);
    isoTimestamp(required(record, "occurredAt"), "occurredAt");
    isoTimestamp(required(record, "createdAt"), "createdAt");
    text(required(record, "farmId"), "farmId", 160);
    enumValue(required(record, "sourceChannel"), sourceChannels, "sourceChannel");
    text(required(record, "rawText"), "rawText", 2000);
    text(required(record, "clientOperationId"), "clientOperationId", 200);
    ["houseId", "flockId", "sourceMessageId", "sourceCandidateId", "actorId", "confirmedBy", "correctionOfId", "reversalOfId", "replacementOfId"].forEach((field) => {
      if (record[field] !== undefined && record[field] !== null) text(record[field], field, field === "houseId" || field === "flockId" ? 160 : 240);
    });
    ["detail", "measurement", "evidence"].forEach((field) => {
      if (record[field] !== undefined && record[field] !== null) text(record[field], field, 240);
    });
    if (record.workflowStatus !== undefined && record.workflowStatus !== null) enumValue(record.workflowStatus, actionWorkflowStates, "workflowStatus");
    if (record.lifecycleStatus !== undefined && record.lifecycleStatus !== null) enumValue(record.lifecycleStatus, lifecycleStates, "lifecycleStatus");
    if (record.workflowStatus !== undefined && record.workflowStatus !== null && definition.id !== "O6" && definition.id !== "O7") fail("RECORDING_UNSUPPORTED_FIELD", "workflowStatus");
    definition.requiredFields.forEach((field) => required(record, field));
    if (definition.id === "O1") {
      integer(record.maleCount, "maleCount", false);
      integer(record.femaleCount, "femaleCount", false);
      enumValue(record.condition, ["good", "fair", "poor"], "condition");
      if (record.quantity !== undefined && record.quantity !== null) fail("RECORDING_UNSUPPORTED_FIELD", "quantity");
      const total = Number(record.maleCount) + Number(record.femaleCount);
      if (record.totalCount !== undefined && integer(record.totalCount, "totalCount", false) !== total) fail("RECORDING_DERIVED_FIELD_MISMATCH", "totalCount");
      if (record.unit !== undefined && record.unit !== null && !["birds", "隻"].includes(record.unit)) fail("RECORDING_UNIT_INVALID", "unit");
    }
    if (definition.id === "O2") text(record.content, "content", 240);
    if (definition.id === "O3") {
      integer(record.quantity, "quantity", true);
      enumValue(record.sex, sexes, "sex");
      if (record.totalWeight !== undefined && record.totalWeight !== null) number(record.totalWeight, "totalWeight", true);
      if (record.weightUnit !== undefined && record.weightUnit !== null) enumValue(record.weightUnit, ["kg"], "weightUnit");
      if (record.averageWeight !== undefined && record.averageWeight !== null) {
        const totalWeight = number(record.totalWeight, "totalWeight", true);
        const averageWeight = number(record.averageWeight, "averageWeight", true);
        if (Math.abs(averageWeight - totalWeight / Number(record.quantity)) > 1e-9) fail("RECORDING_DERIVED_FIELD_MISMATCH", "averageWeight");
      }
    }
    if (definition.id === "O4") {
      text(record.houseId, "houseId", 160);
      text(record.flockId, "flockId", 160);
      number(record.averageWeight, "averageWeight", true);
      enumValue(record.sex, sexes, "sex");
      if (record.weightUnit !== undefined && record.weightUnit !== null) enumValue(record.weightUnit, ["kg"], "weightUnit");
      if (record.chickInDate !== undefined && record.chickInDate !== null) {
        if (typeof record.chickInDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/u.test(record.chickInDate)) fail("RECORDING_DATE_INVALID", "chickInDate");
        const chickInDate = new Date(record.chickInDate + "T00:00:00Z");
        if (!Number.isFinite(chickInDate.getTime()) || chickInDate.toISOString().slice(0, 10) !== record.chickInDate) fail("RECORDING_DATE_INVALID", "chickInDate");
        if (record.ageDays !== undefined && record.ageDays !== null) {
          const ageDays = integer(record.ageDays, "ageDays", false);
          const expectedAgeDays = (Date.parse(String(record.occurredAt).slice(0, 10) + "T00:00:00Z") - Date.parse(record.chickInDate + "T00:00:00Z")) / 86400000;
          if (!Number.isInteger(expectedAgeDays) || expectedAgeDays < 0 || ageDays !== expectedAgeDays) fail("RECORDING_DERIVED_FIELD_MISMATCH", "ageDays");
        }
      } else if (record.ageDays !== undefined && record.ageDays !== null) {
        fail("RECORDING_DERIVED_FIELD_MISMATCH", "ageDays");
      }
    }
    if (definition.id === "O5") {
      text(record.vendor, "vendor", 240);
      number(record.weight, "weight", true);
      enumValue(record.weightUnit, weightUnits, "weightUnit");
    }
    if (definition.id === "O6") {
      isoTimestamp(record.submittedAt, "submittedAt");
      text(record.content, "content", 240);
      enumValue(record.workflowStatus, o6Statuses, "workflowStatus");
      if (record.workflowStatus === "completed") {
        text(required(record, "result"), "result", 240);
        isoTimestamp(record.completedAt, "completedAt");
      }
      if (record.reminderDueAt !== undefined && record.reminderDueAt !== null) {
        isoTimestamp(record.reminderDueAt, "reminderDueAt");
        const expectedReminder = Date.parse(String(record.submittedAt)) + 3 * 86400000;
        if (Date.parse(String(record.reminderDueAt)) !== expectedReminder) fail("RECORDING_DERIVED_FIELD_MISMATCH", "reminderDueAt");
      }
    }
    if (definition.id === "O7") enumValue(record.workflowStatus, actionCompletionStatuses, "workflowStatus");
    if (definition.id === "O8") text(record.maintenanceContent, "maintenanceContent", 240);
    if (definition.id === "O9") {
      integer(record.quantity, "quantity", true);
      if (record.sex !== undefined && record.sex !== null) enumValue(record.sex, sexes, "sex");
      if (record.unit !== undefined && record.unit !== null && !["birds", "隻"].includes(record.unit)) fail("RECORDING_UNIT_INVALID", "unit");
      if (record.totalCount !== undefined && record.totalCount !== null) fail("RECORDING_UNSUPPORTED_FIELD", "totalCount");
    }
    if (definition.family === "operational_observation") {
      enumValue(record.extent, extents, "extent");
      if (record.quantity !== undefined && record.quantity !== null) fail("OBSERVATION_QUANTITY_FORBIDDEN", "quantity");
      if (definition.id === "A1") text(record.linkedMortalityEventId, "linkedMortalityEventId", 200);
      if (definition.id === "A12" && record.subtype === "other") text(required(record, "detail"), "detail", 240);
      if (record.measuredTemperature !== undefined && record.measuredTemperature !== null) number(record.measuredTemperature, "measuredTemperature", false);
    }
    return true;
  }

  function deriveCanonicalFields(input = {}) {
    const derived = {};
    if (input.subtype === "chick_in" && Number.isSafeInteger(Number(input.maleCount)) && Number.isSafeInteger(Number(input.femaleCount))) derived.totalCount = Number(input.maleCount) + Number(input.femaleCount);
    if (input.subtype === "shipment" && Number(input.quantity) > 0 && Number.isFinite(Number(input.totalWeight))) derived.averageWeight = Number(input.totalWeight) / Number(input.quantity);
    if (input.subtype === "weigh" && typeof input.chickInDate === "string" && typeof input.occurredAt === "string") {
      const occurred = Date.parse(input.occurredAt.slice(0, 10) + "T00:00:00Z");
      const chickIn = Date.parse(input.chickInDate + "T00:00:00Z");
      const elapsed = (occurred - chickIn) / 86400000;
      if (Number.isInteger(elapsed) && elapsed >= 0) derived.ageDays = elapsed;
    }
    if (input.subtype === "lab_test" && typeof input.submittedAt === "string" && Number.isFinite(Date.parse(input.submittedAt))) derived.reminderDueAt = new Date(Date.parse(input.submittedAt) + 3 * 86400000).toISOString();
    return derived;
  }

  function recordingTaxonomyContractSnapshot() {
    return taxonomy.map((item) => ({
      id: item.id,
      family: item.family,
      canonicalType: item.canonicalType,
      canonicalSubtypes: [...item.canonicalSubtypes],
      requiredFields: [...item.requiredFields],
      optionalFields: [...item.optionalFields],
      derivedFields: [...item.derivedFields],
      stockEffect: item.stockEffect,
      todoEffect: item.todoEffect,
      calendarEffect: item.calendarEffect,
      webTarget: item.webTarget,
      lineTarget: item.lineTarget,
      ambientTarget: item.ambientTarget,
    }));
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
    O6_STATUSES: o6Statuses,
    ACTION_COMPLETION_STATUSES: actionCompletionStatuses,
    ACTION_WORKFLOW_STATES: actionWorkflowStates,
    RECORD_LIFECYCLE_STATES: lifecycleStates,
    WEIGHT_UNITS: weightUnits,
    RECORDING_TAXONOMY: taxonomy,
    taxonomyDefinitionFor(id) {
      const value = byId.get(id);
      if (!value) fail("RECORDING_TAXONOMY_ID_INVALID", "taxonomyId");
      return value;
    },
    recordingTaxonomyContractSnapshot,
    validateCanonicalRecording,
    deriveCanonicalFields,
    stockEffectForCanonicalRecord,
  };
});
