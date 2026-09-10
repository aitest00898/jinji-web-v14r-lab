(function attachJinjiRecordCommand(root, factory) {
  const api = factory(root?.JinjiRecordingTaxonomy);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.JinjiRecordCommand = api;
})(typeof window === "object" ? window : (typeof globalThis === "object" ? globalThis : null), (taxonomy) => {
  "use strict";

  if (!taxonomy) throw new Error("RECORD_COMMAND_TAXONOMY_REQUIRED");

  const destinations = Object.freeze({
    O1: "recording_events", O4: "recording_events",
    O2: "operational_actions", O5: "operational_actions", O6: "operational_actions", O7: "operational_actions", O8: "operational_actions",
    O3: "operational_events", O9: "operational_events",
  });

  const identityFields = new Set([
    "id", "createdAt", "sourceChannel", "sourceMessageId", "sourceCandidateId",
    "rawText", "actorId", "confirmedBy", "clientOperationId", "correctionOfId",
    "reversalOfId", "replacementOfId", "lifecycleStatus",
  ]);

  function canonicalDestinationForRecord(record) {
    taxonomy.validateCanonicalRecording(record);
    return destinations[record.taxonomyId] || "abnormal_events";
  }

  function createRecordCommand(input) {
    const record = { ...(input || {}) };
    taxonomy.validateCanonicalRecording(record);
    const destination = canonicalDestinationForRecord(record);
    return {
      kind: "record_command",
      version: 1,
      taxonomyId: record.taxonomyId,
      record,
      destination,
      authoritativeDestination: destination,
      parallelAuthoritativeDestinations: [],
      stockEffect: taxonomy.stockEffectForCanonicalRecord(record),
      sourceChannel: record.sourceChannel,
      clientOperationId: String(record.clientOperationId),
    };
  }

  function command(input) {
    if (input && input.kind === "record_command") return createRecordCommand(input.record);
    return createRecordCommand(input);
  }

  function nonEmpty(value) { return typeof value === "string" && value.trim() ? value.trim() : null; }

  function canonicalValue(value) {
    if (Array.isArray(value)) return value.map(canonicalValue);
    if (!value || typeof value !== "object") return value;
    return Object.fromEntries(Object.entries(value)
      .filter(([key]) => !identityFields.has(key))
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, child]) => [key, canonicalValue(child)]));
  }

  function correctionReferences(incoming, existing) {
    const left = [incoming.correctionOfId, incoming.reversalOfId, incoming.replacementOfId].map(nonEmpty).filter(Boolean);
    const right = [existing.correctionOfId, existing.reversalOfId, existing.replacementOfId].map(nonEmpty).filter(Boolean);
    return left.includes(nonEmpty(existing.id)) || right.includes(nonEmpty(incoming.id));
  }

  function sameProvenance(incoming, existing) {
    return (nonEmpty(incoming.clientOperationId) && incoming.clientOperationId === nonEmpty(existing.clientOperationId))
      || (nonEmpty(incoming.sourceMessageId) && incoming.sourceMessageId === nonEmpty(existing.sourceMessageId))
      || (nonEmpty(incoming.sourceCandidateId) && incoming.sourceCandidateId === nonEmpty(existing.sourceCandidateId));
  }

  function reconcileRecordCommand(input, existingInputs = []) {
    const incoming = command(input);
    const existing = existingInputs.map(command);
    const sameId = existing.filter((candidate) => candidate.record.id === incoming.record.id);
    if (sameId.length) return { state: "ALREADY_RECORDED", reason: "same_record_id", matchedCommandIds: sameId.map((row) => row.record.id), semanticMatch: true };
    const provenance = existing.filter((candidate) => sameProvenance(incoming.record, candidate.record));
    if (provenance.length) return { state: "ALREADY_RECORDED", reason: "same_idempotency_or_source_provenance", matchedCommandIds: provenance.map((row) => row.record.id), semanticMatch: false };
    const corrections = existing.filter((candidate) => correctionReferences(incoming.record, candidate.record));
    if (corrections.length) return { state: "CORRECTION_OF_EXISTING", reason: "explicit_correction_or_reversal_reference", matchedCommandIds: corrections.map((row) => row.record.id), semanticMatch: false };
    const semantic = existing.filter((candidate) => JSON.stringify(canonicalValue(incoming.record)) === JSON.stringify(canonicalValue(candidate.record)));
    if (semantic.length) return { state: "POSSIBLY_RECORDED", reason: "same_canonical_content_without_same_provenance", matchedCommandIds: semantic.map((row) => row.record.id), semanticMatch: true };
    return { state: "NEW_INDEPENDENT_EVENT", reason: "no_same_provenance_or_canonical_content", matchedCommandIds: [], semanticMatch: false };
  }

  return { canonicalDestinationForRecord, createRecordCommand, reconcileRecordCommand };
});
