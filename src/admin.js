(function attachJinjiAdmin(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.JinjiAdmin = api;
})(typeof window === "object" ? window : (typeof globalThis === "object" ? globalThis : null), () => {
  "use strict";

  class AdminAuthorizationAdapter {
    authorize() {
      throw new Error("ADMIN_AUTHORIZATION_ADAPTER_REQUIRED");
    }
  }

  class LocalLabAdminAuthorizationAdapter extends AdminAuthorizationAdapter {
    authorize({ confirmed = false } = {}) {
      if (!confirmed) {
        return {
          authorized: false,
          reason: "confirmation_required",
          environment: "PREPROD LAB",
          adapter: "LocalLabAdminAuthorizationAdapter",
        };
      }
      return {
        authorized: true,
        environment: "PREPROD LAB",
        adapter: "LocalLabAdminAuthorizationAdapter",
        label: "測試環境管理者驗證",
        verifiedAt: new Date().toISOString(),
      };
    }
  }

  return {
    AdminAuthorizationAdapter,
    LocalLabAdminAuthorizationAdapter,
  };
});
