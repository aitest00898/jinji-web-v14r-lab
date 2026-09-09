const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../..");
const files = ["index.html", "styles.css", "app.js", "src/domain.js", "src/storage.js", "src/admin.js", "src/ai.js", "src/lab-fixture.js", "src/finance-fixture.js", "src/recording-taxonomy.js"];
const source = files.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");
const canonicalApi = fs.readFileSync(path.join(root, "src/canonical-api.js"), "utf8");

assert.doesNotMatch(source, /https?:\/\/[^\s"']*(?:workers\.dev|api\.line\.me|cloudflareworkers\.com)/i);
assert.doesNotMatch(source, /(?:LINE_CHANNEL_SECRET|CHANNEL_ACCESS_TOKEN|Authorization:\s*Bearer|wrangler\s+secret)/i);
assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|WebSocket)\s*\(/);
assert.doesNotMatch(source, /farm\.finance|farm\s*\[\s*["']finance["']\s*\]/);
assert.doesNotMatch(source, /https?:\/\//i);
assert.match(source, /SYNTHETIC_FINANCE_V1/);
assert.match(source, /classification:\s*"synthetic"/);
assert.match(source, /function escapeHtml\(value\)/);
assert.match(source, /parseQuickRecord/);
assert.match(source, /escapeHtml\(state\.quickRecordDraft\)/);
assert.match(source, /IndexedDB|indexedDB/);
assert.match(source, /clientOperationId/);
assert.match(source, /conflict/i);
assert.match(source, /AI_UNAVAILABLE/);
assert.match(canonicalApi, /\/api\/records/);
assert.match(canonicalApi, /credentials:\s*"include"/);
assert.doesNotMatch(canonicalApi, /Authorization\s*:/i);
assert.doesNotMatch(canonicalApi, /(?:LINE_CHANNEL_SECRET|CHANNEL_ACCESS_TOKEN|wrangler\s+secret)/i);
console.log("SECURITY_PASS", JSON.stringify({ files: files.length + 1, labRuntimeNetwork: 0, canonicalApiBoundary: true, productionSecrets: 0, xssEscaping: true }));
