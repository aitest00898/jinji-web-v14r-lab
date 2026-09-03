const test = require("node:test");
const assert = require("node:assert/strict");
const admin = require("../../src/admin.js");

test("Lab admin authorization is explicit and environment-scoped", () => {
  const adapter = new admin.LocalLabAdminAuthorizationAdapter();
  assert.deepEqual(adapter.authorize(), {
    authorized: false,
    reason: "confirmation_required",
    environment: "PREPROD LAB",
    adapter: "LocalLabAdminAuthorizationAdapter",
  });
  const authorized = adapter.authorize({ confirmed: true });
  assert.equal(authorized.authorized, true);
  assert.equal(authorized.environment, "PREPROD LAB");
  assert.equal(authorized.adapter, "LocalLabAdminAuthorizationAdapter");
  assert.match(authorized.verifiedAt, /^2026|^20\d\d-/);
  assert.throws(() => new admin.AdminAuthorizationAdapter().authorize(), /ADMIN_AUTHORIZATION_ADAPTER_REQUIRED/);
});
