(function attachJinjiAi(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.JinjiAi = api;
})(typeof window === "object" ? window : (typeof globalThis === "object" ? globalThis : null), () => {
  "use strict";

  class AiAssistantAdapter {
    constructor({ available = true } = {}) { this.available = available; }
    status() { return this.available ? "AI_AVAILABLE" : "AI_UNAVAILABLE"; }
    query() { throw new Error("AI_ADAPTER_NOT_IMPLEMENTED"); }
  }

  class LocalAiMockAdapter extends AiAssistantAdapter {
    constructor(options = {}) {
      super(options);
      this.getSnapshot = options.getSnapshot || (() => ({}));
    }

    query(intent, context = {}) {
      if (!this.available) return { status: "AI_UNAVAILABLE", intent, readOnly: true, result: null };
      const snapshot = this.getSnapshot() || {};
      const eventCount = Array.isArray(snapshot.events) ? snapshot.events.length : 0;
      return {
        status: "AI_AVAILABLE",
        intent,
        readOnly: true,
        result: { context: context.label || "目前工作範圍", eventCount, suggestionOnly: true },
      };
    }
  }

  return { AiAssistantAdapter, LocalAiMockAdapter };
});
