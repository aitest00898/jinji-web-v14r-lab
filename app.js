
(() => {
  "use strict";

  const SVG = {
    pin: '<path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z"/><circle cx="12" cy="10" r="2.1"/>',
    digest: '<path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1"/><circle cx="12" cy="12" r="4"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    warning: '<path d="M12 3 21 19H3L12 3Z"/><path d="M12 9v5m0 3h.01"/>',
    flock: '<path d="M4 8 12 4l8 4-8 4-8-4Z"/><path d="m4 12 8 4 8-4M4 16l8 4 8-4"/>',
    chart: '<path d="M4 20V5M4 20h17"/><path d="m7 16 4-5 3 2 5-7"/><circle cx="7" cy="16" r="1"/><circle cx="11" cy="11" r="1"/><circle cx="14" cy="13" r="1"/><circle cx="19" cy="6" r="1"/>',
    farm: '<path d="m3 10 9-7 9 7"/><path d="M5 9v12h14V9M9 21v-7h6v7M8 11h2m4 0h2"/>',
    records: '<path d="M8 5h8M9 3h6v4H9z"/><path d="M6 5H4v16h16V5h-2"/><path d="m8 12 2 2 4-4M8 18h8"/>',
    todo: '<circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    finance: '<path d="M4 7h15a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12"/><path d="M16 12h5v4h-5a2 2 0 0 1 0-4Z"/>',
    ai: '<path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1"/><circle cx="12" cy="12" r="4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    arrow: '<path d="M5 12h13m-5-5 5 5-5 5"/>',
    back: '<path d="m15 5-7 7 7 7"/>',
    close: '<path d="m7 7 10 10M17 7 7 17"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    spark: '<path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/>',
  };

  const DATA = window.JinjiLabFixture;

  /* V14R Plus r3 linked test events — every chart point is also a normal scoped record. */
  const PLUS_LINKED_TEST_EVENTS = [{"id":"plus-ra-0825-m","date":"2026-08-25","time":"07:35","type":"mortality","qty":1,"unit":"隻","farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"plus-ra-0825-f","date":"2026-08-25","time":"09:10","type":"feed","qty":230,"unit":"kg","farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"plus-ra-0825-w","date":"2026-08-25","time":"18:20","type":"water","qty":2400,"unit":"L","farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"plus-ra-0826-m","date":"2026-08-26","time":"07:30","type":"mortality","qty":1,"unit":"隻","farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"plus-ra-0826-f","date":"2026-08-26","time":"09:05","type":"feed","qty":232,"unit":"kg","farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"plus-ra-0826-w","date":"2026-08-26","time":"18:10","type":"water","qty":2380,"unit":"L","farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"plus-ra-0827-m","date":"2026-08-27","time":"07:42","type":"mortality","qty":2,"unit":"隻","farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"plus-ra-0827-w","date":"2026-08-27","time":"18:15","type":"water","qty":2360,"unit":"L","farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"plus-ra-0828-m","date":"2026-08-28","time":"07:38","type":"mortality","qty":2,"unit":"隻","farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"plus-ra-0828-f","date":"2026-08-28","time":"09:00","type":"feed","qty":236,"unit":"kg","farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"plus-ra-0828-w","date":"2026-08-28","time":"18:12","type":"water","qty":2310,"unit":"L","farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"plus-ra-0829-m","date":"2026-08-29","time":"07:44","type":"mortality","qty":3,"unit":"隻","farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"plus-ra-0829-w","date":"2026-08-29","time":"18:00","type":"water","qty":2230,"unit":"L","farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"plus-ra-0830-m","date":"2026-08-30","time":"07:50","type":"mortality","qty":4,"unit":"隻","farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"plus-ra-0830-f","date":"2026-08-30","time":"09:15","type":"feed","qty":238,"unit":"kg","farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"plus-ra-0830-w","date":"2026-08-30","time":"18:05","type":"water","qty":2100,"unit":"L","farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"plus-rb-0825-f","date":"2026-08-25","time":"09:25","type":"feed","qty":190,"unit":"kg","farmId":"red","houseId":"red-2","flockId":"beta"},{"id":"plus-rb-0825-w","date":"2026-08-25","time":"18:30","type":"water","qty":1950,"unit":"L","farmId":"red","houseId":"red-2","flockId":"beta"},{"id":"plus-rb-0827-m","date":"2026-08-27","time":"07:55","type":"mortality","qty":1,"unit":"隻","farmId":"red","houseId":"red-2","flockId":"beta"},{"id":"plus-rb-0827-f","date":"2026-08-27","time":"09:20","type":"feed","qty":194,"unit":"kg","farmId":"red","houseId":"red-2","flockId":"beta"},{"id":"plus-rb-0829-m","date":"2026-08-29","time":"08:02","type":"mortality","qty":1,"unit":"隻","farmId":"red","houseId":"red-2","flockId":"beta"},{"id":"plus-rb-0829-w","date":"2026-08-29","time":"18:20","type":"water","qty":1900,"unit":"L","farmId":"red","houseId":"red-2","flockId":"beta"},{"id":"plus-rb-0831-f","date":"2026-08-31","time":"09:18","type":"feed","qty":198,"unit":"kg","farmId":"red","houseId":"red-2","flockId":"beta"},{"id":"plus-rb-0831-w","date":"2026-08-31","time":"18:18","type":"water","qty":1930,"unit":"L","farmId":"red","houseId":"red-2","flockId":"beta"},{"id":"plus-ba-0825-f","date":"2026-08-25","time":"09:12","type":"feed","qty":202,"unit":"kg","farmId":"black","houseId":"black-1","flockId":"black-a"},{"id":"plus-ba-0825-w","date":"2026-08-25","time":"18:16","type":"water","qty":1880,"unit":"L","farmId":"black","houseId":"black-1","flockId":"black-a"},{"id":"plus-ba-0826-m","date":"2026-08-26","time":"07:48","type":"mortality","qty":1,"unit":"隻","farmId":"black","houseId":"black-1","flockId":"black-a"},{"id":"plus-ba-0826-w","date":"2026-08-26","time":"18:11","type":"water","qty":1900,"unit":"L","farmId":"black","houseId":"black-1","flockId":"black-a"},{"id":"plus-ba-0829-f","date":"2026-08-29","time":"09:14","type":"feed","qty":208,"unit":"kg","farmId":"black","houseId":"black-1","flockId":"black-a"},{"id":"plus-ba-0829-w","date":"2026-08-29","time":"18:22","type":"water","qty":1910,"unit":"L","farmId":"black","houseId":"black-1","flockId":"black-a"},{"id":"plus-ba-0831-w","date":"2026-08-31","time":"18:15","type":"water","qty":1940,"unit":"L","farmId":"black","houseId":"black-1","flockId":"black-a"},{"id":"plus-sa-0825-f","date":"2026-08-25","time":"09:35","type":"feed","qty":118,"unit":"kg","farmId":"silkie","houseId":"silkie-1","flockId":"silkie-a"},{"id":"plus-sa-0825-w","date":"2026-08-25","time":"18:10","type":"water","qty":2080,"unit":"L","farmId":"silkie","houseId":"silkie-1","flockId":"silkie-a"},{"id":"plus-sa-0827-w","date":"2026-08-27","time":"18:14","type":"water","qty":2010,"unit":"L","farmId":"silkie","houseId":"silkie-1","flockId":"silkie-a"},{"id":"plus-sa-0828-f","date":"2026-08-28","time":"09:32","type":"feed","qty":120,"unit":"kg","farmId":"silkie","houseId":"silkie-1","flockId":"silkie-a"},{"id":"plus-sa-0828-w","date":"2026-08-28","time":"18:08","type":"water","qty":1950,"unit":"L","farmId":"silkie","houseId":"silkie-1","flockId":"silkie-a"},{"id":"plus-sa-0829-w","date":"2026-08-29","time":"18:05","type":"water","qty":1900,"unit":"L","farmId":"silkie","houseId":"silkie-1","flockId":"silkie-a"},{"id":"plus-sa-0831-f","date":"2026-08-31","time":"09:28","type":"feed","qty":116,"unit":"kg","farmId":"silkie","houseId":"silkie-1","flockId":"silkie-a"},{"id":"plus-sa-0831-w","date":"2026-08-31","time":"06:30","type":"water","qty":1680,"unit":"L","farmId":"silkie","houseId":"silkie-1","flockId":"silkie-a"},{"id":"plus-sb-0825-f","date":"2026-08-25","time":"09:42","type":"feed","qty":106,"unit":"kg","farmId":"silkie","houseId":"silkie-2","flockId":"silkie-b"},{"id":"plus-sb-0825-w","date":"2026-08-25","time":"18:25","type":"water","qty":1800,"unit":"L","farmId":"silkie","houseId":"silkie-2","flockId":"silkie-b"},{"id":"plus-sb-0827-w","date":"2026-08-27","time":"18:26","type":"water","qty":1760,"unit":"L","farmId":"silkie","houseId":"silkie-2","flockId":"silkie-b"},{"id":"plus-sb-0828-w","date":"2026-08-28","time":"18:24","type":"water","qty":1720,"unit":"L","farmId":"silkie","houseId":"silkie-2","flockId":"silkie-b"},{"id":"plus-sb-0829-f","date":"2026-08-29","time":"09:38","type":"feed","qty":104,"unit":"kg","farmId":"silkie","houseId":"silkie-2","flockId":"silkie-b"},{"id":"plus-sb-0829-w","date":"2026-08-29","time":"13:55","type":"water","qty":1480,"unit":"L","farmId":"silkie","houseId":"silkie-2","flockId":"silkie-b"},{"id":"plus-sb-0830-w","date":"2026-08-30","time":"18:24","type":"water","qty":1710,"unit":"L","farmId":"silkie","houseId":"silkie-2","flockId":"silkie-b"},{"id":"plus-sb-0831-w","date":"2026-08-31","time":"18:21","type":"water","qty":1770,"unit":"L","farmId":"silkie","houseId":"silkie-2","flockId":"silkie-b"},{"id":"plus-na-0825-f","date":"2026-08-25","time":"09:50","type":"feed","qty":72,"unit":"kg","farmId":"new","houseId":"new-1","flockId":"new-a"},{"id":"plus-na-0825-w","date":"2026-08-25","time":"18:35","type":"water","qty":980,"unit":"L","farmId":"new","houseId":"new-1","flockId":"new-a"},{"id":"plus-na-0826-f","date":"2026-08-26","time":"09:52","type":"feed","qty":82,"unit":"kg","farmId":"new","houseId":"new-1","flockId":"new-a"},{"id":"plus-na-0826-w","date":"2026-08-26","time":"18:34","type":"water","qty":1080,"unit":"L","farmId":"new","houseId":"new-1","flockId":"new-a"},{"id":"plus-na-0827-f","date":"2026-08-27","time":"09:51","type":"feed","qty":92,"unit":"kg","farmId":"new","houseId":"new-1","flockId":"new-a"},{"id":"plus-na-0827-w","date":"2026-08-27","time":"18:33","type":"water","qty":1170,"unit":"L","farmId":"new","houseId":"new-1","flockId":"new-a"},{"id":"plus-na-0828-f","date":"2026-08-28","time":"09:49","type":"feed","qty":102,"unit":"kg","farmId":"new","houseId":"new-1","flockId":"new-a"},{"id":"plus-na-0828-w","date":"2026-08-28","time":"18:31","type":"water","qty":1280,"unit":"L","farmId":"new","houseId":"new-1","flockId":"new-a"},{"id":"plus-na-0829-f","date":"2026-08-29","time":"09:46","type":"feed","qty":112,"unit":"kg","farmId":"new","houseId":"new-1","flockId":"new-a"},{"id":"plus-na-0829-w","date":"2026-08-29","time":"18:28","type":"water","qty":1390,"unit":"L","farmId":"new","houseId":"new-1","flockId":"new-a"},{"id":"plus-na-0830-w","date":"2026-08-30","time":"18:27","type":"water","qty":1480,"unit":"L","farmId":"new","houseId":"new-1","flockId":"new-a"},{"id":"plus-na-0831-f","date":"2026-08-31","time":"09:44","type":"feed","qty":128,"unit":"kg","farmId":"new","houseId":"new-1","flockId":"new-a"},{"id":"plus-na-0831-w","date":"2026-08-31","time":"18:26","type":"water","qty":1560,"unit":"L","farmId":"new","houseId":"new-1","flockId":"new-a"}];
  /* The fixture is immutable at runtime; linked events are part of the read-only Lab baseline. */
  const LAB_FIXTURE = structuredClone(DATA);
  LAB_FIXTURE.events.push(...PLUS_LINKED_TEST_EVENTS);
  const LAB_STORE = new window.JinjiStorage.LabRepository({ fixture: LAB_FIXTURE });
  const LAB_ADMIN = new window.JinjiAdmin.LocalLabAdminAuthorizationAdapter();
  const FINANCE_CONTEXT_FARM_MAP = Object.freeze({
    red: "syn-farm-a",
    black: "syn-farm-b",
    silkie: "syn-farm-c",
    new: "syn-farm-d",
    history: "syn-farm-e",
    f: "syn-farm-f",
    g: "syn-farm-g",
    h: "syn-farm-h",
  });
  const FINANCE_REPO = new window.JinjiStorage.FinanceRepository({ dataset: window.JinjiFinanceFixture });

  function masterDataOverlay() {
    const masterData = labOverlay().masterData || {};
    return {
      farms: Array.isArray(masterData.farms) ? masterData.farms : [],
      houses: Array.isArray(masterData.houses) ? masterData.houses : [],
      flocks: Array.isArray(masterData.flocks) ? masterData.flocks : [],
      caretakerAssignments: Array.isArray(masterData.caretakerAssignments) ? masterData.caretakerAssignments : [],
      financeIdentities: Array.isArray(masterData.financeIdentities) ? masterData.financeIdentities : [],
    };
  }

  function composeLabFarms() {
    const overlay = masterDataOverlay();
    const farms = structuredClone(LAB_FIXTURE.farms);
    const farmByIdMap = new Map(farms.map((farm) => [farm.id, farm]));
    overlay.farms.forEach((farm) => {
      if (!farmByIdMap.has(farm.id)) {
        const composed = { ...structuredClone(farm), houses: [] };
        farms.push(composed);
        farmByIdMap.set(composed.id, composed);
      }
    });
    overlay.houses.forEach((house) => {
      const farm = farmByIdMap.get(house.farmId);
      if (!farm || farm.houses.some((candidate) => candidate.id === house.id)) return;
      farm.houses.push({ ...structuredClone(house), flocks: [] });
    });
    const houseByIdMap = new Map(farms.flatMap((farm) => farm.houses).map((house) => [house.id, house]));
    overlay.flocks.forEach((flock) => {
      const house = houseByIdMap.get(flock.houseId);
      if (!house || house.flocks.some((candidate) => candidate.id === flock.id)) return;
      house.flocks.push(structuredClone(flock));
    });
    overlay.caretakerAssignments.forEach((assignment) => {
      const farm = farmByIdMap.get(assignment.farmId);
      if (!farm) return;
      farm.caretakers = Array.isArray(farm.caretakers) ? farm.caretakers : [];
      if (!farm.caretakers.includes(assignment.caretakerName)) farm.caretakers.push(assignment.caretakerName);
    });
    overlay.farms.forEach((overlayFarm) => {
      const farm = farmByIdMap.get(overlayFarm.id);
      if (!farm) return;
      farm.stock = farm.houses.flatMap((house) => house.flocks)
        .filter((flock) => flock.state === "active")
        .reduce((sum, flock) => sum + Number(flock.stock || 0), 0);
    });
    const all = farmByIdMap.get("all");
    if (all) {
      const baselineStock = Number(LAB_FIXTURE.farms.find((farm) => farm.id === "all")?.stock || 0);
      const overlayStock = overlay.flocks
        .filter((flock) => flock.state === "active")
        .reduce((sum, flock) => sum + Number(flock.stock || 0), 0);
      all.stock = baselineStock + overlayStock;
    }
    return farms;
  }

  function labData() {
    const overlay = LAB_STORE.snapshot();
    return {
      farms: composeLabFarms(),
      pending: [...LAB_FIXTURE.pending, ...(overlay.pendingReviews || [])],
      abnormalities: [...LAB_FIXTURE.abnormalities, ...(overlay.abnormalities || [])],
      events: [...LAB_FIXTURE.events, ...(overlay.events || [])],
    };
  }

  function labOverlay() {
    return LAB_STORE.snapshot();
  }

  function effectiveLabEvents() {
    return window.JinjiDomain.reconstructOperationalEvents(labData().events);
  }

  function eventMatchesScope(event, scope) {
    if (!scope || scope.farmId === "all") return true;
    if (event.farmId !== scope.farmId) return false;
    if (scope.houseId && event.houseId && event.houseId !== scope.houseId) return false;
    if (scope.flockId && event.flockId && event.flockId !== scope.flockId) return false;
    return true;
  }

  function removalTotal(events, scope) {
    return events
      .filter((event) => eventMatchesScope(event, scope))
      .reduce((sum, event) => sum + (["mortality", "cull", "shipment"].includes(event.type) ? Number(event.quantity || event.qty || 0) : 0), 0);
  }

  function runtimeStockDelta(scope) {
    const base = window.JinjiDomain.reconstructOperationalEvents(LAB_FIXTURE.events);
    const current = effectiveLabEvents();
    return removalTotal(current, scope) - removalTotal(base, scope);
  }

  const LAB_AI = new window.JinjiAi.LocalAiMockAdapter({
    getSnapshot: () => labData(),
  });

  const NAV = [
    ["today", "今日", "digest"],
    ["calendar", "月曆", "records"],
    ["farms", "場務", "farm"],
    ["records", "紀錄", "records"],
    ["todo", "待辦", "todo"],
    ["more", "更多", "more"],
  ];

  const state = {
    page: "today",
    context: { farmId: "all", houseId: null, flockId: null },
    contextDraft: null,
    contextStep: "farm",
    sheet: null,
    financeTab: "overview",
    chartTab: "stock",
    recordsMode: "list",
    recordsMetric: "mortality",
    recordsFarmFilter: "all",
    desktopFarmMenuOpen: false,
    aiPreviewKey: "overview",
    calendarYear: 2026,
    calendarMonth: 9,
    selectedCalendarDate: "2026-09-03",
    settingsNotice: "",
    developerNotice: "",
    previousFocus: null,
    previousFocusMeta: null,
    scrollY: 0,
    quickRecordDraft: "",
    quickRecordNotice: "",
    correctionNotice: "",
    resumeAfterFarmSelection: null,
    masterDataAuthorized: false,
    masterDataFarmId: null,
    masterDataHouseId: null,
    masterDataNotice: "",
    masterDataError: "",
    masterDataConfirmation: null,
  };

  const app = document.getElementById("app");

  const DEV_ANALYTICS_KEY = "jinji-v14r-plus-r4-analytics";
  const DEV_NOTE_KEY = "jinji-v14r-plus-r4-developer-note";
  const DEV_AI_STATUS_KEY = "jinji-v14r-plus-r4-ai-status";
  const TREND_SETTINGS_KEY = "jinji-v14r-plus-r4-trend-thresholds";
  const DEV_LOG_LIMIT = 300;
  const TREND_THRESHOLD_DEFAULTS = Object.freeze({
    baselineDays: 3,
    minBaselinePoints: 2,
    mortalityMin: 3,
    mortalityDelta: 2,
    mortalityRatio: 1.5,
    cullMin: 2,
    cullDelta: 2,
    feedDropPct: 15,
    waterDropPct: 10,
    waterRisePct: 25,
  });

  const volatileLocal = new Map();

  function safeLocalGet(key, fallback) {
    try {
      const value = window.localStorage.getItem(key);
      if (value !== null) { volatileLocal.set(key, value); return value; }
    } catch (_) {}
    return volatileLocal.has(key) ? volatileLocal.get(key) : fallback;
  }

  function safeLocalSet(key, value) {
    volatileLocal.set(key, String(value));
    try { window.localStorage.setItem(key, String(value)); return true; } catch (_) { return false; }
  }

  function trendThresholds() {
    try {
      const raw = safeLocalGet(TREND_SETTINGS_KEY, "");
      if (!raw) return { ...TREND_THRESHOLD_DEFAULTS };
      const parsed = JSON.parse(raw);
      const merged = { ...TREND_THRESHOLD_DEFAULTS, ...(parsed || {}) };
      Object.keys(TREND_THRESHOLD_DEFAULTS).forEach((key) => {
        const value = Number(merged[key]);
        merged[key] = Number.isFinite(value) ? value : TREND_THRESHOLD_DEFAULTS[key];
      });
      merged.baselineDays = Math.max(2, Math.min(6, Math.round(merged.baselineDays)));
      merged.minBaselinePoints = Math.max(2, Math.min(merged.baselineDays, Math.round(merged.minBaselinePoints)));
      merged.mortalityMin = Math.max(0, merged.mortalityMin);
      merged.mortalityDelta = Math.max(0, merged.mortalityDelta);
      merged.mortalityRatio = Math.max(1, merged.mortalityRatio);
      merged.cullMin = Math.max(0, merged.cullMin);
      merged.cullDelta = Math.max(0, merged.cullDelta);
      merged.feedDropPct = Math.max(0, Math.min(90, merged.feedDropPct));
      merged.waterDropPct = Math.max(0, Math.min(90, merged.waterDropPct));
      merged.waterRisePct = Math.max(0, Math.min(300, merged.waterRisePct));
      return merged;
    } catch (_) {
      return { ...TREND_THRESHOLD_DEFAULTS };
    }
  }

  function saveTrendThresholds(next) {
    const clean = { ...TREND_THRESHOLD_DEFAULTS, ...next };
    safeLocalSet(TREND_SETTINGS_KEY, JSON.stringify(clean));
    return trendThresholds();
  }

  function mortalityTrendStats() {
    return {
      today: scopedEvents("mortality", true).reduce((sum, event) => sum + event.qty, 0),
      cumulative: scopedEvents("mortality").reduce((sum, event) => sum + event.qty, 0),
    };
  }

  function loadDeveloperAnalytics() {
    try {
      const raw = safeLocalGet(DEV_ANALYTICS_KEY, "");
      if (!raw) return { counts: {}, log: [] };
      const parsed = JSON.parse(raw);
      return {
        counts: parsed && typeof parsed.counts === "object" ? parsed.counts : {},
        log: Array.isArray(parsed?.log) ? parsed.log.slice(-DEV_LOG_LIMIT) : [],
      };
    } catch (_) {
      return { counts: {}, log: [] };
    }
  }

  let developerAnalytics = loadDeveloperAnalytics();

  function saveDeveloperAnalytics() {
    safeLocalSet(DEV_ANALYTICS_KEY, JSON.stringify(developerAnalytics));
  }

  function componentKey(element) {
    if (!element) return "unknown";
    if (element.dataset?.nav) return `nav:${element.dataset.nav}`;
    if (element.dataset?.action) {
      const detailKeys = ["sheetKind","chartTab","recordsMode","recordsMetric","financeTab","farmId","houseId","flockId","pendingId","eventId","abnormalId","insightKey","systemKey","settingsKey","aiPreview"];
      const detail = detailKeys.map((key) => element.dataset[key] ? `${key}=${element.dataset[key]}` : "").filter(Boolean).join("|");
      return `action:${element.dataset.action}${detail ? `|${detail}` : ""}`;
    }
    const label = (element.getAttribute?.("aria-label") || element.textContent || element.className || "button").replace(/\s+/g, " ").trim().slice(0, 48);
    return `component:${label || "button"}`;
  }

  function recordComponentClick(element) {
    const key = componentKey(element);
    developerAnalytics.counts[key] = (developerAnalytics.counts[key] || 0) + 1;
    developerAnalytics.log.push({
      at: new Date().toISOString(),
      key,
      page: state.page,
      context: contextLabel(),
      sheet: state.sheet?.kind || null,
    });
    if (developerAnalytics.log.length > DEV_LOG_LIMIT) developerAnalytics.log = developerAnalytics.log.slice(-DEV_LOG_LIMIT);
    saveDeveloperAnalytics();
  }

  function developerNote() {
    return safeLocalGet(DEV_NOTE_KEY, "");
  }

  function simulatedAiAvailable() {
    return safeLocalGet(DEV_AI_STATUS_KEY, "available") !== "unavailable" && labOverlay().mode !== "AI_DOWN";
  }

  function labModeLabel(mode = labOverlay().mode) {
    return ({
      ONLINE: "ONLINE",
      AI_DOWN: "AI_UNAVAILABLE",
      BACKEND_TEMP_DOWN: "BACKEND_TEMP_DOWN · 本機待同步",
      BACKEND_LONG_DOWN: "BACKEND_LONG_DOWN · Local Lab Mode",
    })[mode] || mode;
  }

  function icon(name, className = "") {
    return `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SVG[name] || SVG.spark}</svg>`;
  }

  function number(value) {
    return value === null || value === undefined ? "—" : Number(value).toLocaleString("zh-TW");
  }

  const MONEY_FORMATTER = new Intl.NumberFormat("zh-TW", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  const MONEY_PRECISE_FORMATTER = new Intl.NumberFormat("zh-TW", { minimumFractionDigits: 0, maximumFractionDigits: 12 });

  function money(value) {
    return value === null || value === undefined ? "—" : MONEY_FORMATTER.format(Number(value));
  }

  function moneyPrecise(value) {
    return value === null || value === undefined ? "—" : MONEY_PRECISE_FORMATTER.format(Number(value));
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[char]);
  }

  function farmById(id) {
    return labData().farms.find((farm) => farm.id === id) || labData().farms[0];
  }

  function houseById(farm, id) {
    return farm?.houses?.find((house) => house.id === id) || null;
  }

  function flockById(house, id) {
    return house?.flocks?.find((flock) => flock.id === id) || null;
  }

  function currentContext() {
    const farm = farmById(state.context.farmId);
    const house = farm.id === "all" ? null : houseById(farm, state.context.houseId);
    const flock = house ? flockById(house, state.context.flockId) : null;
    return { farm, house, flock };
  }

  function contextLabel(context = currentContext()) {
    if (context.farm.id === "all") return "全部在養 · 全域總覽 · 唯讀";
    if (!context.house) return `${context.farm.name} · 選擇雞舍`;
    if (!context.flock) return `${context.farm.name} · ${context.house.name}`;
    return `${context.house.name} · ${context.flock.code}`;
  }

  function htmlContextLabel(context = currentContext()) {
    return escapeHtml(contextLabel(context));
  }

  function contextShortLabel(context = currentContext()) {
    if (context.farm.id === "all") return "全部在養";
    return context.farm.name;
  }

  function contextBar() {
    const context = currentContext();
    const farm = context.farm;
    const houses = farm.id === "all" ? [] : farm.houses;
    const flocks = context.house ? context.house.flocks : [];
    const houseButtons = farm.id === "all" ? "" : `<div class="scope-row"><span class="scope-label">雞舍</span><div class="scope-chips" data-testid="house-chips"><button type="button" class="scope-choice ${!state.context.houseId ? "active" : ""}" data-action="select-house-direct" data-house-id="">全場</button>${houses.map((house) => `<button type="button" class="scope-choice ${state.context.houseId === house.id ? "active" : ""}" data-action="select-house-direct" data-house-id="${escapeHtml(house.id)}">${escapeHtml(house.name)}</button>`).join("")}</div></div>`;
    const flockButtons = context.house && flocks.length ? `<div class="scope-row"><span class="scope-label">批次</span><div class="scope-chips" data-testid="flock-chips"><button type="button" class="scope-choice ${!state.context.flockId ? "active" : ""}" data-action="select-flock-direct" data-flock-id="">全部批次</button>${flocks.map((flock) => `<button type="button" class="scope-choice ${state.context.flockId === flock.id ? "active" : ""}" data-action="select-flock-direct" data-flock-id="${escapeHtml(flock.id)}">${escapeHtml(flock.code)}</button>`).join("")}</div></div>` : "";
    return `<section class="context-hub" aria-label="目前工作範圍">
      <div class="context-farm-row"><span class="scope-label">雞場</span><button class="farm-selector" type="button" data-action="open-context" data-testid="farm-selector" aria-label="目前雞場：${escapeHtml(farm.name)}。點擊切換雞場"><span class="context-icon">${icon("pin")}</span><span><strong>${escapeHtml(farm.name)}</strong><small>${escapeHtml(farm.id === "all" ? "全域唯讀總覽" : (farm.id === "history" ? "歷史查詢" : farm.subtitle))}</small></span><span class="farm-selector-arrow">⌄</span></button></div>
      ${houseButtons}${flockButtons}
    </section>`;
  }

  function pageIntro(kicker, title, description = "") {
    return `<div class="page-intro"><div><h1>${title}</h1>${description ? `<p class="intro-description">${description}</p>` : ""}</div></div>`;
  }

  function allProductionFarms() {
    return labData().farms.filter((farm) => farm.id !== "all");
  }

  function allFlocks() {
    return allProductionFarms().flatMap((farm) =>
      farm.houses.flatMap((house) =>
        house.flocks.map((flock) => ({ ...flock, farmId: farm.id, farm: farm.name, houseId: house.id, house: house.name }))
      )
    );
  }

  function matchesContext(item) {
    if (state.context.farmId === "all") return true;
    if (item.farmId !== state.context.farmId) return false;
    if (state.context.houseId && item.houseId && item.houseId !== state.context.houseId) return false;
    if (state.context.flockId && item.flockId && item.flockId !== state.context.flockId) return false;
    return true;
  }

  function scopedFlocks({ activeOnly = true } = {}) {
    return allFlocks().filter((flock) => (!activeOnly || flock.state === "active") && matchesContext({
      farmId: flock.farmId,
      houseId: flock.houseId,
      flockId: flock.id,
    }));
  }

  function isUpcomingFlock(flock) {
    if (typeof flock?.upcoming === "boolean") return flock.upcoming;
    if (!flock || flock.state !== "active" || !flock.ship) return false;
    const asOf = Date.parse(`${PLUS_AS_OF}T00:00:00Z`);
    const shipment = Date.parse(`${flock.ship}T00:00:00Z`);
    if (!Number.isFinite(asOf) || !Number.isFinite(shipment)) return false;
    const daysUntilShipment = Math.round((shipment - asOf) / 86400000);
    return daysUntilShipment >= 0 && daysUntilShipment <= 7;
  }

  function scopedEvents(type = null, todayOnly = false) {
    return effectiveLabEvents().filter((event) =>
      (!type || event.type === type) &&
      (!todayOnly || event.date === "2026-08-31") &&
      matchesContext(event)
    );
  }

  function scopedPending() {
    return labData().pending.filter(matchesContext);
  }

  function scopedAbnormalities({ activeOnly = false } = {}) {
    return labData().abnormalities.filter((item) => (!activeOnly || item.status === "active") && matchesContext(item));
  }

  function scopedMortality() {
    // Keep the V7 fixture display order while still reading the reconstructed
    // append-only event set; runtime events remain appended after the fixture.
    const activeEventIds = new Set(effectiveLabEvents().map((event) => event.id));
    return labData().events.filter((event) =>
      activeEventIds.has(event.id) && event.type === "mortality" && event.date === "2026-08-31" && matchesContext(event)
    ).map((event) => {
      const farm = farmById(event.farmId);
      const house = houseById(farm, event.houseId);
      const flock = house ? flockById(house, event.flockId) : null;
      return { ...event, farm: farm.name, house: house?.name || "場級", flock: flock?.code || "全批次", quantity: event.qty };
    });
  }

  function scopedCull() {
    return scopedEvents("cull", true);
  }

  function contextStock() {
    const base = scopedFlocks().reduce((sum, flock) => sum + (flock.stock || 0), 0);
    return Math.max(0, base - runtimeStockDelta(state.context));
  }

  function mortalityValue() {
    return scopedEvents("mortality", true).reduce((sum, event) => sum + event.qty, 0);
  }

  function cullValue() {
    return scopedCull().reduce((sum, event) => sum + event.qty, 0);
  }

  function upcomingFlocks() {
    return scopedFlocks().filter(isUpcomingFlock);
  }

  function contextCountLabel() {
    return `${scopedFlocks().length} 批進行中`;
  }

  function stockDetail(context) {
    if (context.farm.id === "all") return "全部在養進行中批次合計";
    if (context.flock) return `${context.flock.code} 本批在養`;
    if (context.house) return `${context.farm.name}／${context.house.name} 目前在養`;
    return `${context.farm.name} 目前在養`;
  }

  function digestCopy() {
    const mortality = mortalityValue();
    const pending = scopedPending().length;
    const upcoming = upcomingFlocks().length;
    const activeAbnormal = scopedAbnormalities({ activeOnly: true }).length;
    const resolvedAbnormal = scopedAbnormalities().length - activeAbnormal;
    const parts = [];
    parts.push(mortality > 0 ? `今日死亡 ${mortality} 隻` : "今日無死亡紀錄");
    if (pending > 0) parts.push(`${pending} 筆資料待人工確認`);
    if (upcoming > 0) parts.push(`${upcoming} 批在 7 日內準備出雞`);
    if (activeAbnormal > 0) parts.push(`${activeAbnormal} 筆異常追蹤中`);
    if (resolvedAbnormal > 0) parts.push(`另有 ${resolvedAbnormal} 筆歷史異常已結案`);
    return `${parts.join("；")}。`;
  }

  function contextName(item) {
    const farm = farmById(item.farmId);
    const house = item.houseId ? houseById(farm, item.houseId) : null;
    const flock = house && item.flockId ? flockById(house, item.flockId) : null;
    return [farm.name, house?.name, flock?.code].filter(Boolean).join(" / ");
  }

  function pendingContextName(item) {
    const farm = farmById(item.farmId);
    if (!item.houseId) return `${farm.name} · 尚未確認雞舍`;
    return contextName(item);
  }

  function farmStock(farm) {
    const base = farm.houses.flatMap((house) => house.flocks).filter((flock) => flock.state === "active").reduce((sum, flock) => sum + (flock.stock || 0), 0);
    return Math.max(0, base - runtimeStockDelta({ farmId: farm.id, houseId: null, flockId: null }));
  }

  function displayedFarmStock(farm) {
    if (farm?.id === "all") {
      const base = allFlocks().filter((flock) => flock.state === "active").reduce((sum, flock) => sum + (flock.stock || 0), 0);
      return Math.max(0, base - runtimeStockDelta({ farmId: "all", houseId: null, flockId: null }));
    }
    return farmStock(farm);
  }

  function houseStock(house) {
    const base = house.flocks.filter((flock) => flock.state === "active").reduce((sum, flock) => sum + (flock.stock || 0), 0);
    const farm = labData().farms.find((candidate) => candidate.houses.some((item) => item.id === house.id));
    return Math.max(0, base - runtimeStockDelta({ farmId: farm?.id || "all", houseId: house.id, flockId: null }));
  }

  function runtimeFinanceIdentities() {
    return masterDataOverlay().financeIdentities;
  }

  function runtimeFinanceIdentityById(financeId) {
    return runtimeFinanceIdentities().find((identity) => identity.id === financeId) || null;
  }

  function financeIdentityForOperationalFarm(farmId) {
    const baselineFinanceId = FINANCE_CONTEXT_FARM_MAP[farmId];
    if (baselineFinanceId) {
      return {
        id: baselineFinanceId,
        operationalFarmId: farmId,
        status: "configured",
        dataState: "has_finance_data",
        source: "SYNTHETIC_FINANCE_V1",
      };
    }
    return runtimeFinanceIdentities().find((identity) => identity.operationalFarmId === farmId) || null;
  }

  function operationalFarmForFinanceId(financeId) {
    const baselineFarmId = Object.entries(FINANCE_CONTEXT_FARM_MAP).find(([, value]) => value === financeId)?.[0];
    const runtime = runtimeFinanceIdentityById(financeId);
    return farmById(baselineFarmId || runtime?.operationalFarmId);
  }

  function runtimeFinanceRowsForScope() {
    const context = currentContext();
    return runtimeFinanceIdentities()
      .filter((identity) => context.farm.id === "all" || identity.operationalFarmId === context.farm.id)
      .map((identity) => {
        const farm = farmById(identity.operationalFarmId);
        return {
          id: identity.id,
          name: farm?.name || identity.operationalFarmId,
          operationalFarmId: identity.operationalFarmId,
          operationalFarmName: farm?.name || identity.operationalFarmId,
          unconfigured: true,
          status: identity.status,
          dataState: identity.dataState,
          distributionCount: 0,
          grossProfitLoss: null,
          allocatedProfitLoss: null,
          expense: null,
          netIncome: null,
          historyStatus: "unconfigured",
          financeIdentity: identity,
        };
      });
  }

  function financeFilters() {
    if (state.context.farmId === "all") return {};
    return { farmId: FINANCE_CONTEXT_FARM_MAP[state.context.farmId] || "__no_matching_synthetic_farm__" };
  }

  function financeScope() {
    const context = currentContext();
    const summary = FINANCE_REPO.getSummary(financeFilters());
    const runtimeRows = runtimeFinanceRowsForScope();
    const runtimeIdentity = context.farm.id === "all" ? null : financeIdentityForOperationalFarm(context.farm.id);
    return {
      ...summary,
      farms: [...summary.farms, ...runtimeRows],
      runtimeFinanceIdentities: runtimeFinanceIdentities(),
      currentContext: context,
      scopedToFarm: state.context.farmId !== "all",
      unconfiguredContext: runtimeIdentity?.status === "unconfigured",
      contextNote: context.house || context.flock ? "目前營運範圍已選到雞舍／批次；財務資料目前仍以所屬雞場為範圍。" : "",
    };
  }

  function investorSummary() {
    return FINANCE_REPO.getSummary(financeFilters()).investors;
  }

  function assertDataContract() {
    const farms = LAB_FIXTURE.farms.filter((farm) => farm.id !== "all");
    const houses = farms.flatMap((farm) => farm.houses);
    const flocks = houses.flatMap((house) => house.flocks);
    const active = flocks.filter((flock) => flock.state === "active");
    const closed = flocks.filter((flock) => flock.state === "closed");
    const expect = (condition, message) => { if (!condition) throw new Error(`V14R_DATA_CONTRACT: ${message}`); };

    expect(farms.length === 8, "farm count");
    expect(houses.length === 15, "house count");
    expect(flocks.length === 13, "flock count");
    expect(active.length === 12, "active flock count");
    expect(closed.length === 1 && closed[0].code === "AUDIT-HISTORY-OLD", "closed history flock");
    expect(active.reduce((sum, flock) => sum + flock.stock, 0) === 55294, "all stock");
    expect(LAB_FIXTURE.farms.find((farm) => farm.id === "all")?.stock === 55294, "all farm stock");
    const baselineStockByFarm = Object.fromEntries(farms.map((farm) => [farm.id, farm.stock]));
    expect(JSON.stringify(baselineStockByFarm) === JSON.stringify({ red: 12132, black: 5420, silkie: 5940, new: 7920, history: 0, f: 7728, g: 9606, h: 6548 }), "farm stocks");
    expect(["AUDIT-RED-ALPHA","AUDIT-RED-BETA","AUDIT-BLACK-001","AUDIT-SILKIE-A","AUDIT-SILKIE-B","AUDIT-NEW-001","SYN-F-001","SYN-F-002","SYN-G-001","SYN-G-002","SYN-H-001","SYN-H-002"].every((code) => active.some((flock) => flock.code === code)), "active flock membership");
    expect(LAB_FIXTURE.pending.length === 7, "pending count");
    expect(["死亡 3？來源不完整","確認 7 日內出雞準備","飼料數量可能缺單位","飲水異常需要追蹤"].every((title) => LAB_FIXTURE.pending.some((item) => item.title === title)), "pending membership");
    expect(LAB_FIXTURE.abnormalities.length === 7 && LAB_FIXTURE.abnormalities.filter((item) => item.status === "active").length === 6, "abnormality baseline");
    expect(LAB_FIXTURE.events.filter((event) => event.type === "mortality" && event.date === "2026-08-31").reduce((sum, event) => sum + event.qty, 0) === 6, "today mortality");
    expect(LAB_FIXTURE.events.filter((event) => event.type === "cull" && event.date === "2026-08-31").reduce((sum, event) => sum + event.qty, 0) === 1, "today cull");
    expect(["f", "g", "h"].every((farmId) => {
      const farm = LAB_FIXTURE.farms.find((candidate) => candidate.id === farmId);
      return farm && farm.houses.length > 0 && farm.houses.some((house) => house.flocks.length > 0) && LAB_FIXTURE.events.some((event) => event.farmId === farmId) && LAB_FIXTURE.pending.some((item) => item.farmId === farmId) && LAB_FIXTURE.abnormalities.some((item) => item.farmId === farmId);
    }), "horizontal synthetic farm coverage");
    const masterDataContract = window.JinjiDomain.validateMasterData(masterDataOverlay());
    expect(masterDataContract.financeIdentities === masterDataContract.farms, "runtime farm finance identity one-to-one");
    const finance = FINANCE_REPO.getSummary();
    expect(finance.farms.length === 8, "finance farm count");
    expect(finance.investors.length === 3, "finance investor count");
    expect(finance.farmInvestorEquity.length === 24, "finance equity count");
    expect(finance.distributions.length === 12, "finance distribution count");
    expect(finance.allocations.length === 36, "finance allocation count");
    const financeContract = window.JinjiDomain.validateFinanceDataset(window.JinjiFinanceFixture);
    expect(JSON.stringify(finance.totals) === JSON.stringify(financeContract.totals), "finance totals");
    expect(window.JinjiDomain.financeApproxEqual(FINANCE_REPO.getCumulativeNetSeries().at(-1)?.value, financeContract.totals.net), "finance cumulative series");
    expect(PLUS_LINKED_TEST_EVENTS.length >= 40, "linked test event volume");
    expect(PLUS_LINKED_TEST_EVENTS.every((event) => {
      const farm = farmById(event.farmId);
      if (!farm || farm.id === "all") return false;
      if (!event.houseId) return true;
      const house = houseById(farm, event.houseId);
      if (!house) return false;
      if (!event.flockId) return true;
      return Boolean(flockById(house, event.flockId));
    }), "linked test event references");
  }

  function navMarkup() {
    return `<nav class="bottom-nav" aria-label="主要導覽">${NAV.map(([key, label, iconName]) => `<button type="button" data-nav="${key}" class="${state.page === key || (key === "more" && ["finance", "ai"].includes(state.page)) ? "active" : ""}" aria-current="${state.page === key || (key === "more" && ["finance", "ai"].includes(state.page)) ? "page" : "false"}">${icon(iconName, "nav-icon")}<span>${label}</span></button>`).join("")}</nav>`;
  }

  function currentPageTitle() {
    return ({ today: "今日", calendar: "月曆", farms: "場務", records: "紀錄", todo: "待辦", more: "更多", finance: "財務", ai: "AI 助理" })[state.page] || "金雞管理中心";
  }

  function desktopNavMarkup() {
    const primary = [
      ["today", "今日", "digest"],
      ["calendar", "月曆", "records"],
      ["farms", "場務", "farm"],
      ["records", "紀錄", "records"],
      ["todo", "待辦", "todo"],
    ];
    const secondary = [
      ["finance", "財務", "finance"],
      ["ai", "AI 助理", "ai"],
      ["more", "更多", "more"],
    ];
    const item = ([key, label, iconName]) => `<button type="button" data-nav="${key}" class="${state.page === key ? "active" : ""}" aria-current="${state.page === key ? "page" : "false"}">${icon(iconName, "nav-icon")}<span>${label}</span></button>`;
    return `<aside class="desktop-sidebar" aria-label="桌面主要導覽">
      <div class="desktop-brand"><span class="desktop-brand-symbol">🐔</span><span><strong>金雞管理中心</strong><small>V14R Plus r4 · Desktop v7</small></span></div>
      <nav class="desktop-nav" aria-label="桌面分頁導覽">
        <div class="desktop-nav-group"><span class="desktop-nav-label">主工作</span>${primary.map(item).join("")}</div>
        <div class="desktop-nav-group"><span class="desktop-nav-label">分析與管理</span>${secondary.map(item).join("")}</div>
      </nav>
      <div class="desktop-sidebar-footer"><span class="desktop-online-dot" aria-hidden="true"></span><span><strong>測試環境</strong><small>模擬資料 · 不連 Production</small></span></div>
    </aside>`;
  }


  const PLUS_AS_OF = "2026-08-31";


  const CALENDAR_FLOCK_META = Object.freeze({
    alpha: { male: 3600, female: 3400 },
    beta: { male: 2850, female: 2650 },
    "black-a": { male: 2900, female: 2700 },
    "silkie-a": { male: 1650, female: 1650 },
    "silkie-b": { male: 1450, female: 1450 },
    "new-a": { male: 4100, female: 3900 },
    "history-old": { male: 2600, female: 2400 },
    "f-a": { male: 2100, female: 2000 },
    "f-b": { male: 1950, female: 1850 },
    "g-a": { male: 2700, female: 2500 },
    "g-b": { male: 2350, female: 2250 },
    "h-a": { male: 1900, female: 1700 },
    "h-b": { male: 1600, female: 1500 },
  });
  const CALENDAR_WEIGH_LEAD_DAYS = 3;

  function calendarDateKey(year, month, day) {
    return `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
  }
  function calendarShiftDate(dateKey, deltaDays) {
    const [year,month,day] = dateKey.split("-").map(Number);
    const date = new Date(year, month - 1, day + deltaDays);
    return calendarDateKey(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }
  function calendarContextMatches(item) {
    return matchesContext({ farmId:item.farmId, houseId:item.houseId || null, flockId:item.flockId || null });
  }
  function calendarFlockContext(flock) {
    const farm = farmById(flock.farmId);
    const house = houseById(farm, flock.houseId);
    return { farm, house };
  }
  function calendarBaseItems() {
    const items = [];
    allFlocks().forEach((flock) => {
      const { farm, house } = calendarFlockContext(flock);
      const suppliedSex = CALENDAR_FLOCK_META[flock.id] || (Number.isInteger(flock.male) && Number.isInteger(flock.female) ? { male: flock.male, female: flock.female } : null);
      items.push({
        id:`calendar-chick-${flock.id}`, date:flock.chickIn, kind:"chick_in", tone:"milestone", label:"入雛",
        farmId:farm.id, houseId:house.id, flockId:flock.id,
        title:`入雛 ${number(flock.initial)} 隻`,
        detail: suppliedSex ? `公 ${number(suppliedSex.male)} 隻 · 母 ${number(suppliedSex.female)} 隻 · 合計 ${number(flock.initial)} 隻` : `合計 ${number(flock.initial)} 隻 · 公母數尚未提供`,
        context:`${farm.name} · ${house.name} · ${flock.code}`,
      });
      if (flock.state === "active") {
        const weighDate = calendarShiftDate(flock.ship, -CALENDAR_WEIGH_LEAD_DAYS);
        items.push({
          id:`calendar-weigh-${flock.id}`, date:weighDate, kind:"weigh", tone:"weigh", label:"磅雞",
          farmId:farm.id, houseId:house.id, flockId:flock.id,
          title:"磅雞", detail:`出雞前 ${CALENDAR_WEIGH_LEAD_DAYS} 天測試排程 · 預計出雞 ${flock.ship}`,
          context:`${farm.name} · ${house.name} · ${flock.code}`,
        });
        items.push({
          id:`calendar-ship-plan-${flock.id}`, date:flock.ship, kind:"planned_ship", tone:"milestone", label:"預計出雞",
          farmId:farm.id, houseId:house.id, flockId:flock.id,
          title:"預計出雞", detail:`目前在養 ${number(flock.stock)} 隻 · 批次 ${flock.code}`,
          context:`${farm.name} · ${house.name}`,
        });
      }
    });
    effectiveLabEvents().forEach((event) => {
      const labels = { mortality:"死亡", cull:"淘汰", feed:"飼料", water:"飲水", shipment:"出雞" };
      const tone = ["mortality","cull"].includes(event.type) ? "alert" : event.type === "shipment" ? "milestone" : "info";
      items.push({
        id:`calendar-event-${event.id}`, date:event.date, kind:event.type, tone, label:labels[event.type] || event.type,
        farmId:event.farmId, houseId:event.houseId, flockId:event.flockId,
        title:`${labels[event.type] || event.type} ${number(event.qty)} ${event.unit}`,
        detail:`${event.time} · 正式紀錄視圖共用的測試事件`, context:contextName(event), sourceEventId:event.id,
      });
    });
    labData().abnormalities.forEach((item) => items.push({
      id:`calendar-abnormal-${item.id}`, date:item.date, kind:"abnormal", tone:item.status === "active" ? "alert" : "info", label:"異常",
      farmId:item.farmId, houseId:item.houseId, flockId:item.flockId,
      title:`異常：${item.title}`, detail:`${item.time} · ${item.category} · ${item.state}${item.temp ? ` · ${item.temp}°C` : ""}`, context:contextName(item), sourceAbnormalId:item.id,
    }));
    return items;
  }
  function scopedCalendarItems() { return calendarBaseItems().filter(calendarContextMatches); }
  function calendarItemsOn(dateKey) { return scopedCalendarItems().filter((item) => item.date === dateKey); }
  function calendarMonthLabel(year, month) { return `${year} 年 ${month} 月`; }
  function calendarSelectedLabel(dateKey) {
    const [year,month,day]=dateKey.split("-").map(Number);
    const weekdays=["日","一","二","三","四","五","六"];
    const d=new Date(year,month-1,day);
    return `${year} 年 ${month} 月 ${day} 日（${weekdays[d.getDay()]}）`;
  }
  function calendarCompactRows(items) {
    const order=["chick_in","weigh","planned_ship","shipment","abnormal","mortality","cull","feed","water"];
    const rows=[];
    order.forEach((kind) => {
      const group=items.filter((item)=>item.kind===kind);
      if (!group.length) return;
      if (["mortality","cull","feed","water","shipment"].includes(kind)) {
        const total=group.reduce((sum,item)=>{
          const match=item.title.match(/([\d,]+(?:\.\d+)?)/); return sum+(match?Number(match[1].replace(/,/g,"")):0);
        },0);
        const unit=kind==="feed"?"kg":kind==="water"?"L":"隻";
        const label={mortality:"死亡",cull:"淘汰",feed:"飼料",water:"飲水",shipment:"出雞"}[kind];
        rows.push({label:`${label} ${number(total)}${unit}`, tone:group[0].tone});
      } else {
        group.forEach((item)=>rows.push({label:item.label,tone:item.tone}));
      }
    });
    return rows;
  }
  function calendarCellMarkup(dateKey, day) {
    const items=calendarItemsOn(dateKey);
    const rows=calendarCompactRows(items);
    const today=new Date();
    const todayKey=calendarDateKey(today.getFullYear(),today.getMonth()+1,today.getDate());
    const selected=state.selectedCalendarDate===dateKey;
    return `<button type="button" class="calendar-cell ${selected?"selected":""} ${todayKey===dateKey?"today":""}" data-action="calendar-select-date" data-date="${dateKey}" aria-label="${dateKey}，${items.length} 項資料"><span class="calendar-day-head"><span class="calendar-day-number">${day}</span>${items.length?`<span class="calendar-day-count">${items.length} 項</span>`:""}</span><span class="calendar-badges">${rows.slice(0,4).map((row)=>`<span class="calendar-badge ${row.tone}">${escapeHtml(row.label)}</span>`).join("")}${rows.length>4?`<span class="calendar-more">＋${rows.length-4} 項</span>`:""}</span></button>`;
  }
  function calendarDetailMarkup(dateKey) {
    const items=calendarItemsOn(dateKey).sort((a,b)=>({chick_in:0,weigh:1,planned_ship:2,shipment:3,abnormal:4,mortality:5,cull:6,feed:7,water:8}[a.kind]??9)-({chick_in:0,weigh:1,planned_ship:2,shipment:3,abnormal:4,mortality:5,cull:6,feed:7,water:8}[b.kind]??9));
    return `<section class="calendar-detail-panel" aria-live="polite"><div class="calendar-detail-head"><div><h2>${calendarSelectedLabel(dateKey)}</h2><p>${escapeHtml(contextLabel())}</p></div><span class="scope-chip">${items.length} 項</span></div><div class="calendar-detail-list">${items.length?items.map((item)=>`<article class="calendar-detail-item ${item.tone}"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.context)}</span><small>${escapeHtml(item.detail)}</small></article>`).join(""):`<div class="empty-tab"><strong>這一天沒有資料</strong><p>目前工作範圍在這一天沒有排程、紀錄或異常。</p></div>`}</div></section>`;
  }
  function renderCalendar() {
    const year=state.calendarYear, month=state.calendarMonth;
    const days=new Date(year,month,0).getDate();
    const leading=new Date(year,month-1,1).getDay();
    const cells=[];
    for(let i=0;i<leading;i++) cells.push(`<div class="calendar-blank" aria-hidden="true"></div>`);
    for(let day=1;day<=days;day++) { const key=calendarDateKey(year,month,day); cells.push(calendarCellMarkup(key,day)); }
    while(cells.length%7) cells.push(`<div class="calendar-blank" aria-hidden="true"></div>`);
    const context = desktopWideMode() ? desktopContextToolbar() : contextBar();
    return `<section class="${desktopWideMode()?"desktop-v2-page":"page"} calendar-page" data-page="calendar">${context}<div class="calendar-toolbar"><div class="calendar-title-block"><p class="kicker">營運月曆</p><h1>${calendarMonthLabel(year,month)}</h1><p>日期格只顯示摘要；點日期後，下方會展開雞場、雞舍、批次與數量明細。</p></div><div class="calendar-month-controls"><button type="button" class="calendar-month-button icon-only" data-action="calendar-prev-month" aria-label="上一個月">‹</button><button type="button" class="calendar-month-button" data-action="calendar-this-month">本月</button><button type="button" class="calendar-month-button icon-only" data-action="calendar-next-month" aria-label="下一個月">›</button></div></div><div class="calendar-shell"><div class="calendar-weekdays" aria-hidden="true">${["日","一","二","三","四","五","六"].map((d)=>`<span>${d}</span>`).join("")}</div><div class="calendar-grid">${cells.join("")}</div></div><div class="calendar-legend"><span class="milestone"><i></i>入雛／預計出雞</span><span class="weigh"><i></i>磅雞</span><span class="alert"><i></i>死亡／淘汰／異常</span><span class="info"><i></i>飼料／飲水</span></div><p class="calendar-prototype-note">測試說明：磅雞排程由各批次「預計出雞日前 ${CALENDAR_WEIGH_LEAD_DAYS} 天」自動推導，只用於驗證月曆連動；入雛公母數量為與各批次入雛總數相符的連動測試資料。</p>${calendarDetailMarkup(state.selectedCalendarDate)}</section>`;
  }
  function calendarMoveMonth(delta) {
    const date=new Date(state.calendarYear,state.calendarMonth-1+delta,1);
    state.calendarYear=date.getFullYear(); state.calendarMonth=date.getMonth()+1;
    const monthPrefix=`${state.calendarYear}-${String(state.calendarMonth).padStart(2,"0")}-`;
    const firstItem=scopedCalendarItems().filter((item)=>item.date.startsWith(monthPrefix)).sort((a,b)=>a.date.localeCompare(b.date))[0];
    state.selectedCalendarDate=firstItem?.date || `${monthPrefix}01`;
  }

  function plusStockRows() {
    const context = currentContext();
    if (context.flock) {
      return [
        { label: "入雛", value: context.flock.initial || 0, tone: "muted" },
        { label: "本批在養", value: context.flock.stock || 0, tone: "green" },
      ];
    }
    if (context.house) {
      return context.house.flocks.map((flock) => ({
        label: flock.code,
        value: flock.state === "active" ? (flock.stock || 0) : 0,
        meta: flock.state === "active" ? "進行中" : "已出雞",
        tone: flock.state === "active" ? "green" : "muted",
      }));
    }
    if (context.farm.id !== "all") {
      return context.farm.houses.map((house) => ({
        label: house.name,
        value: houseStock(house),
        meta: `${house.flocks.filter((flock) => flock.state === "active").length} 批進行中`,
        tone: "green",
      }));
    }
    return allProductionFarms().map((farm) => ({
      label: farm.name,
      value: farmStock(farm),
      meta: farm.id === "history" ? "歷史查詢" : farm.risk,
      tone: farm.mortality > 0 ? "alert" : "green",
    }));
  }

  function plusStockChart() {
    const rows = plusStockRows();
    const max = Math.max(1, ...rows.map((row) => row.value));
    return `<div class="plus-bar-chart" role="img" aria-label="${escapeHtml(contextShortLabel())} 在養分布圖">
      ${rows.map((row) => {
        const width = row.value <= 0 ? 0 : Math.max(3, (row.value / max) * 100);
        return `<div class="plus-bar-row chart-query-target" tabindex="0" data-chart-tip="${escapeHtml(`${row.label}｜在養 ${number(row.value)} 隻${row.meta ? `｜${row.meta}` : ""}`)}">
          <div class="plus-bar-head"><span><strong>${escapeHtml(row.label)}</strong>${row.meta ? `<small>${escapeHtml(row.meta)}</small>` : ""}</span><b>${number(row.value)}</b></div>
          <div class="plus-bar-track"><span class="plus-bar-fill ${row.tone || "green"}" style="width:${width.toFixed(1)}%"></span></div>
        </div>`;
      }).join("")}
    </div>`;
  }

  function plusDateRange(days = 7) {
    const end = new Date(`${PLUS_AS_OF}T00:00:00`);
    return Array.from({ length: days }, (_, index) => {
      const date = new Date(end);
      date.setDate(end.getDate() - (days - 1 - index));
      return date.toISOString().slice(0, 10);
    });
  }

  function plusDateRows() {
    const days = [];
    const end = new Date(`${PLUS_AS_OF}T00:00:00`);
    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = new Date(end);
      date.setDate(end.getDate() - offset);
      const key = date.toISOString().slice(0, 10);
      const events = scopedEvents().filter((event) => event.date === key);
      days.push({
        date: key,
        label: `${date.getMonth() + 1}/${date.getDate()}`,
        mortality: events.filter((event) => event.type === "mortality").reduce((sum, event) => sum + event.qty, 0),
        cull: events.filter((event) => event.type === "cull").reduce((sum, event) => sum + event.qty, 0),
        feed: events.filter((event) => event.type === "feed").reduce((sum, event) => sum + event.qty, 0),
        water: events.filter((event) => event.type === "water").reduce((sum, event) => sum + event.qty, 0),
        count: events.length,
      });
    }
    return days;
  }

  function plusEventTrend() {
    const days = plusDateRows();
    const max = Math.max(1, ...days.map((row) => row.mortality));
    const hasData = days.some((row) => row.mortality);
    if (!hasData) return `<div class="plus-chart-empty"><strong>最近 7 天沒有死亡紀錄</strong><span>圖表與「紀錄」頁使用同一份事件資料，不會補造不存在的數字。</span></div>`;
    const linkedCount = days.reduce((sum, row) => sum + row.count, 0);
    const stats = mortalityTrendStats();
    return `<div class="plus-event-chart" role="img" aria-label="最近 7 天死亡紀錄圖">
      <div class="plus-event-summary"><div class="plus-event-legend"><span><i class="mortality"></i>死亡</span></div><div class="mortality-dual-stats compact"><span><small>今日</small><strong>${number(stats.today)}</strong><em>隻</em></span><span><small>累積</small><strong>${number(stats.cumulative)}</strong><em>隻</em></span></div></div>
      <div class="plus-event-grid">
        ${days.map((row) => {
          const m = (row.mortality / max) * 100;
          return `<div class="plus-event-day chart-query-target" tabindex="0" data-chart-tip="${escapeHtml(`${row.date}｜死亡 ${number(row.mortality)} 隻`)}">
            <div class="plus-event-bars"><span class="plus-event-bar mortality" style="height:${m.toFixed(1)}%"></span></div>
            <small>${row.label}</small>
          </div>`;
        }).join("")}
      </div>
      <div class="plus-chart-foot">與「紀錄」頁共用同一份事件資料 · 此範圍近 7 天共 ${linkedCount} 筆營運紀錄</div>
    </div>`;
  }

  function plusMiniTrend(rows, key, unit, tone) {
    const max = Math.max(1, ...rows.map((row) => row[key]));
    return `<div class="plus-mini-trend ${tone}">
      <div class="plus-mini-bars">${rows.map((row) => `<div class="plus-mini-day" title="${row.date}：${number(row[key])} ${unit}"><div class="plus-mini-track"><span style="height:${((row[key] / max) * 100).toFixed(1)}%"></span></div><small>${row.label}</small></div>`).join("")}</div>
    </div>`;
  }

  function plusFeedWaterTrend() {
    const days = plusDateRows();
    const feedTotal = days.reduce((sum, row) => sum + row.feed, 0);
    const waterTotal = days.reduce((sum, row) => sum + row.water, 0);
    if (!feedTotal && !waterTotal) return `<div class="plus-chart-empty"><strong>最近 7 天沒有飼料或飲水紀錄</strong><span>切換其他雞場／雞舍／批次可查看有紀錄的範圍。</span></div>`;
    return `<div class="plus-feedwater-chart">
      <div class="plus-mini-card"><div class="plus-mini-title"><span><strong>飼料</strong><small>近 7 天合計</small></span><b>${number(feedTotal)} kg</b></div>${plusMiniTrend(days, "feed", "kg", "feed")}</div>
      <div class="plus-mini-card"><div class="plus-mini-title"><span><strong>飲水</strong><small>近 7 天合計</small></span><b>${number(waterTotal)} L</b></div>${plusMiniTrend(days, "water", "L", "water")}</div>
      <div class="plus-chart-foot">每根柱都對應「紀錄」頁中的同日期、同雞場／雞舍／批次紀錄；切換 Context 會同步重算。</div>
    </div>`;
  }

  function daysBetween(a, b) {
    return Math.round((new Date(`${b}T00:00:00`) - new Date(`${a}T00:00:00`)) / 86400000);
  }

  function plusShipChart() {
    const flocks = scopedFlocks().filter((flock) => flock.state === "active").slice().sort((a, b) => a.ship.localeCompare(b.ship));
    if (!flocks.length) return `<div class="plus-chart-empty"><strong>目前範圍沒有進行中批次</strong><span>因此沒有可繪製的出雞進度。</span></div>`;
    return `<div class="plus-ship-chart" role="img" aria-label="批次出雞進度圖">
      ${flocks.map((flock) => {
        const total = Math.max(1, daysBetween(flock.chickIn, flock.ship));
        const elapsed = Math.max(0, Math.min(total, daysBetween(flock.chickIn, PLUS_AS_OF)));
        const progress = (elapsed / total) * 100;
        const remain = daysBetween(PLUS_AS_OF, flock.ship);
        return `<div class="plus-ship-row chart-query-target" tabindex="0" data-chart-tip="${escapeHtml(`${flock.code}｜預計 ${flock.ship} 出雞｜${remain >= 0 ? `${remain} 天後` : "已到期"}`)}">
          <div class="plus-ship-head"><span><strong>${escapeHtml(flock.code)}</strong><small>${escapeHtml(flock.farm)} · ${escapeHtml(flock.house)}</small></span><b>${remain >= 0 ? `${remain} 天後` : "已到期"}</b></div>
          <div class="plus-ship-track"><span style="width:${progress.toFixed(1)}%"></span><i style="left:${progress.toFixed(1)}%"></i></div>
          <div class="plus-ship-axis"><small>${flock.chickIn.slice(5).replace('-', '/')} 入雛</small><small>${flock.ship.slice(5).replace('-', '/')} 出雞</small></div>
        </div>`;
      }).join("")}
      <div class="plus-chart-foot">進度依入雛日 → 預計出雞日計算；不是 AI 預測。</div>
    </div>`;
  }

  function plusChartsSection() {
    const tabs = [
      ["stock", "在養分布"],
      ["events", "死亡趨勢"],
      ["feedwater", "飼飲趨勢"],
      ["ship", "出雞進度"],
    ];
    const body = state.chartTab === "events" ? plusEventTrend() : state.chartTab === "feedwater" ? plusFeedWaterTrend() : state.chartTab === "ship" ? plusShipChart() : plusStockChart();
    const descriptions = {
      stock: "把目前範圍拆開比較，快速看出數量集中在哪裡。",
      events: "最近 7 天死亡紀錄，與紀錄頁共用同一份事件資料。",
      feedwater: "最近 7 天飼料與飲水紀錄，依目前雞場／雞舍／批次同步彙整。",
      ship: "依入雛與預計出雞日期呈現各批次目前進度。",
    };
    return `<section class="plus-chart-panel" aria-labelledby="plus-chart-title">
      <div class="plus-chart-title"><div><p class="kicker">V14R Plus</p><h2 id="plus-chart-title">趨勢與比較</h2><p>${descriptions[state.chartTab]}</p></div><span class="status-chip good">即時計算</span></div>
      <div class="plus-chart-tabs" role="tablist" aria-label="圖表切換">
        ${tabs.map(([key, label]) => `<button type="button" role="tab" aria-selected="${state.chartTab === key}" class="plus-chart-tab ${state.chartTab === key ? "active" : ""}" data-action="chart-tab" data-chart-tab="${key}">${label}</button>`).join("")}
      </div>
      <div class="plus-chart-body">${body}</div><div class="plus-data-proof"><strong>資料連動</strong><span>Plus 測試趨勢不是獨立假數字：所有新增飼料、飲水、死亡資料都直接加入同一份事件時間軸，圖表只做彙整。</span></div>
    </section>`;
  }

  function renderToday() {
    const pending = scopedPending();
    const upcoming = upcomingFlocks();
    const activeAbnormal = scopedAbnormalities({ activeOnly: true });
    const resolvedAbnormal = scopedAbnormalities().length - activeAbnormal.length;
    const mortality = mortalityValue();
    const cull = cullValue();
    const actions = [];
    if (pending.length) actions.push(`<button type="button" class="action-card" data-action="open-sheet" data-sheet-kind="pending"><span class="action-icon">${icon("check")}</span><span class="action-copy"><strong>${pending.length} 筆需要人工確認</strong><span>查看哪些資料還需要補齊或確認</span></span><span class="action-count">${pending.length}</span><span class="action-arrow">›</span></button>`);
    if (upcoming.length) actions.push(`<button type="button" class="action-card good" data-action="open-sheet" data-sheet-kind="upcoming"><span class="action-icon">${icon("flock")}</span><span class="action-copy"><strong>${upcoming.length} 批 7 日內準備出雞</strong><span>${upcoming.map((flock) => escapeHtml(flock.code)).join("、")}</span></span><span class="action-count">${upcoming.length}</span><span class="action-arrow">›</span></button>`);
    if (activeAbnormal.length) actions.push(`<button type="button" class="action-card alert" data-action="open-sheet" data-sheet-kind="abnormal"><span class="action-icon">${icon("warning")}</span><span class="action-copy"><strong>${activeAbnormal.length} 筆異常需要留意</strong><span>${escapeHtml(activeAbnormal.slice(0, 2).map((item) => `${contextName(item)} · ${item.title}`).join("；"))}${resolvedAbnormal ? `；另 ${resolvedAbnormal} 筆已結案` : ""}</span></span><span class="action-count">${activeAbnormal.length}</span><span class="action-arrow">›</span></button>`);
    return `<section class="page today-page" data-page="today">
      ${contextBar()}
      ${state.quickRecordNotice ? `<div class="lab-write-notice" role="status">${escapeHtml(state.quickRecordNotice)}</div>` : ""}
      <div class="today-date"><span>資料截至 8 月 31 日</span><strong>今日</strong></div>
      <div class="desktop-overview-grid">
        <section class="digest" aria-labelledby="digest-title"><div class="digest-head"><p class="kicker">今日摘要</p><span class="digest-mark">${icon("digest")}</span></div><h2 id="digest-title">${digestCopy()}</h2><p>摘要只依目前工作範圍中的測試資料整理，不會自行增加數字。</p></section>
        <section class="hero-metric" aria-label="目前在養"><div><p class="kicker">目前在養 · ${escapeHtml(contextShortLabel())}</p><strong data-testid="stock-value">${number(contextStock())}</strong><p>${escapeHtml(stockDetail(currentContext()))}</p></div><div class="hero-side"><span class="hero-icon">${icon("flock")}</span><span class="metric-label">${contextCountLabel()}</span><button type="button" class="ghost-light" data-action="open-sheet" data-sheet-kind="flocks">查看批次</button></div></section>
      </div>
      <div class="desktop-main-grid">
        <div class="desktop-action-column">
          <div class="section-heading"><div><h2>今天需處理</h2><p>先放真正需要處理的事情。</p></div><span class="scope-chip">${actions.length} 項</span></div>
          <section class="action-list" aria-label="今天需處理">${actions.length ? actions.slice(0, 3).join("") : `<div class="empty-tab"><strong>目前沒有急迫事項</strong><p>這個範圍沒有待確認、追蹤中異常或 7 日內出雞批次。</p></div>`}</section>
          <div class="quick-summary">
            ${mortality > 0 ? `<button type="button" class="summary-tile alert" data-action="open-sheet" data-sheet-kind="mortality"><span class="tile-label">今日死亡 <span aria-hidden="true">›</span></span><strong data-testid="mortality-value">${number(mortality)}</strong><small>${escapeHtml(scopedMortality().map((item) => `${item.farm} ${item.quantity}`).join(" · "))}</small></button>` : `<div class="summary-tile"><span class="tile-label">今日死亡</span><strong data-testid="mortality-value">0</strong><small>這個範圍沒有死亡明細</small></div>`}
            ${cull > 0 ? `<button type="button" class="summary-tile good" data-action="open-sheet" data-sheet-kind="cull"><span class="tile-label">今日淘汰 <span aria-hidden="true">›</span></span><strong>${number(cull)}</strong><small>查看場、舍與批次</small></button>` : `<div class="summary-tile good"><span class="tile-label">今日淘汰</span><strong>0</strong><small>這個範圍沒有淘汰明細</small></div>`}
          </div>
        </div>
        ${plusChartsSection()}
      </div>
    </section>`;
  }

  function renderFarms() {
    const context = currentContext();
    const flocks = scopedFlocks();
    const farms = state.context.farmId === "all" ? allProductionFarms() : [context.farm];
    const houses = state.context.farmId === "all" ? [] : context.farm.houses.filter((house) => !state.context.houseId || house.id === state.context.houseId);
    return `<section class="page" data-page="farms">
      ${contextBar()}
      ${pageIntro("", "場務", "查看目前雞場、雞舍與批次狀況。")}
      <section class="hero-metric" aria-label="場務目前在養"><div><p class="kicker">目前在養</p><strong data-testid="farm-stock-value">${number(contextStock())}</strong><p>${escapeHtml(stockDetail(context))}</p></div><div class="hero-side"><span class="hero-icon">${icon("farm")}</span><span class="metric-label">進行中批次 ${number(flocks.length)}</span></div></section>
      <section class="master-data-entry" data-testid="master-data-entry"><div><p class="kicker">管理</p><h2>主檔管理</h2><p>新增雞場、雞舍、批次與照顧者；所有新增資料只進入 Lab runtime overlay。</p></div><button type="button" class="sheet-secondary" data-action="open-master-data">開啟主檔管理</button></section>
      <div class="section-heading"><div><h2>${state.context.farmId === "all" ? "雞場狀況" : "目前雞場"}</h2><p>點雞場可查看詳細資料。</p></div></div>
      <section class="farm-grid">${farms.map((farm) => `<button type="button" class="farm-item" data-action="open-farm-detail" data-farm-id="${escapeHtml(farm.id)}"><div><h3>${escapeHtml(farm.name)}</h3><p>${escapeHtml(farm.breed || farm.subtitle)} · ${escapeHtml(farm.risk || "全域")}</p></div><div class="farm-metric"><strong>${number(displayedFarmStock(farm))}</strong><span>在養隻數 ›</span></div></button>`).join("")}</section>
      <div class="desktop-farm-detail-grid ${state.context.farmId === "all" ? "single" : ""}">
        ${state.context.farmId === "all" ? "" : `<section class="content-panel clean-list-panel"><div class="panel-title"><div><h3>雞舍</h3><p>${escapeHtml(context.farm.name)} · 點雞舍查看詳細</p></div></div><div class="list-stack">${houses.map((house) => `<button type="button" class="list-row" data-action="open-house-detail" data-farm-id="${escapeHtml(context.farm.id)}" data-house-id="${escapeHtml(house.id)}"><span><strong>${escapeHtml(house.name)}</strong><span>${house.flocks.length} 個批次</span></span><span class="row-end"><span class="row-value">${number(houseStock(house))}</span><span>在養隻數 ›</span></span></button>`).join("")}</div></section>`}
        <section class="content-panel clean-list-panel"><div class="panel-title"><div><h3>進行中批次</h3><p>${flocks.length} 批；已出雞的歷史批次不列入。</p></div><button type="button" class="text-link" data-action="open-sheet" data-sheet-kind="flocks">查看全部 →</button></div><div class="list-stack">${flocks.slice(0, 3).map((flock) => flockRow(flock)).join("") || `<div class="empty-tab"><strong>沒有進行中批次</strong><p>這個範圍可能是歷史場或空舍。</p></div>`}</div></section>
      </div>
    </section>`;
  }

  function flockRow(flock) {
    return `<button type="button" class="list-row" data-action="open-flock" data-flock-id="${escapeHtml(flock.id)}"><span><strong>${escapeHtml(flock.code)}</strong><span>${escapeHtml(flock.farm)} / ${escapeHtml(flock.house)}</span></span><span class="row-end"><span class="status-chip ${isUpcomingFlock(flock) ? "good" : ""}">${escapeHtml(flock.status)}</span><span class="row-arrow">›</span></span></button>`;
  }

  function eventLabel(type) {
    return ({ mortality: "死亡", cull: "淘汰", feed: "飼料", water: "飲水", shipment: "出雞" })[type] || type;
  }

  const RECORD_METRICS = {
    mortality: { label: "死亡", unit: "隻", tone: "red", kind: "event" },
    cull: { label: "淘汰", unit: "隻", tone: "amber", kind: "event" },
    feed: { label: "飼料", unit: "kg", tone: "amber", kind: "event" },
    water: { label: "飲水", unit: "L", tone: "blue", kind: "event" },
    abnormal: { label: "異常", unit: "筆", tone: "red", kind: "abnormal" },
    shipment: { label: "出雞", unit: "隻", tone: "green", kind: "event" },
  };

  function median(values) {
    const rows = values.filter((value) => Number.isFinite(value)).slice().sort((a, b) => a - b);
    if (!rows.length) return null;
    const middle = Math.floor(rows.length / 2);
    return rows.length % 2 ? rows[middle] : (rows[middle - 1] + rows[middle]) / 2;
  }

  function recordsAnalysisScope() {
    if (state.context.farmId !== "all") return state.context;
    if (state.recordsFarmFilter && state.recordsFarmFilter !== "all") return { farmId: state.recordsFarmFilter, houseId: null, flockId: null };
    return { farmId: "all", houseId: null, flockId: null };
  }

  function recordsAnalysisMatches(item) {
    return eventMatchesScope(item, recordsAnalysisScope());
  }

  function recordsAnalysisEvents(type = null) {
    return effectiveLabEvents().filter((event) => (!type || event.type === type) && recordsAnalysisMatches(event));
  }

  function recordsAnalysisAbnormalities() {
    return labData().abnormalities.filter(recordsAnalysisMatches);
  }

  function recordsAnalysisLabel() {
    const scope = recordsAnalysisScope();
    if (scope.farmId === "all") return "全部在養";
    return farmById(scope.farmId)?.name || scope.farmId;
  }

  function recordsAnalysisMortalityStats() {
    return {
      today: recordsAnalysisEvents("mortality").filter((event) => event.date === PLUS_AS_OF).reduce((sum, event) => sum + Number(event.quantity || event.qty || 0), 0),
      cumulative: recordsAnalysisEvents("mortality").reduce((sum, event) => sum + Number(event.quantity || event.qty || 0), 0),
    };
  }

  function recordsCrossFarmAnalysis() {
    if (state.context.farmId !== "all") return "";
    const farms = allProductionFarms();
    const todayRows = farms.map((farm) => ({
      farm,
      value: effectiveLabEvents().filter((event) => event.farmId === farm.id && event.type === "mortality" && event.date === PLUS_AS_OF).reduce((sum, event) => sum + Number(event.quantity || event.qty || 0), 0),
    }));
    const maxToday = todayRows.slice().sort((a, b) => b.value - a.value || a.farm.name.localeCompare(b.farm.name))[0];
    const startDate = plusDateRange(7)[0];
    const recentRows = farms.map((farm) => {
      const events = effectiveLabEvents().filter((event) => event.farmId === farm.id && event.date >= startDate && event.date <= PLUS_AS_OF);
      return {
        farm,
        mortality: events.filter((event) => event.type === "mortality").reduce((sum, event) => sum + Number(event.quantity || event.qty || 0), 0),
        cull: events.filter((event) => event.type === "cull").reduce((sum, event) => sum + Number(event.quantity || event.qty || 0), 0),
      };
    }).sort((a, b) => (b.mortality + b.cull) - (a.mortality + a.cull) || a.farm.name.localeCompare(b.farm.name));
    const recentEvents = effectiveLabEvents().filter((event) => event.date >= startDate && event.date <= PLUS_AS_OF).sort((a, b) => `${b.date} ${b.time} ${b.id}`.localeCompare(`${a.date} ${a.time} ${a.id}`)).slice(0, 8);
    const filterFarm = state.recordsFarmFilter === "all" ? null : farmById(state.recordsFarmFilter);
    const filterCopy = filterFarm ? `目前局部分析：${filterFarm.name}` : "目前局部分析：全部在養";
    return `<section class="records-cross-farm" data-testid="records-cross-farm-analysis">
      <div class="panel-title"><div><h2>跨場紀錄分析</h2><p>這是紀錄頁的局部分析範圍；上方工作範圍仍維持「全部在養」，不會被篩選器偷偷改變。</p></div><span class="status-chip good">${escapeHtml(filterCopy)}</span></div>
      <div class="records-farm-filter" role="tablist" aria-label="紀錄頁場級分析範圍"><span class="scope-label">場級篩選</span><div class="scope-chips"><button type="button" class="scope-choice ${state.recordsFarmFilter === "all" ? "active" : ""}" data-action="records-farm-filter" data-records-farm-id="all" role="tab" aria-selected="${state.recordsFarmFilter === "all"}">全部在養</button>${farms.map((farm) => `<button type="button" class="scope-choice ${state.recordsFarmFilter === farm.id ? "active" : ""}" data-action="records-farm-filter" data-records-farm-id="${escapeHtml(farm.id)}" role="tab" aria-selected="${state.recordsFarmFilter === farm.id}">${escapeHtml(farm.name)}</button>`).join("")}</div></div>
      <div class="records-cross-kpis"><div class="records-cross-kpi" data-testid="records-today-mortality-max"><span>今日死亡最高</span><strong>${maxToday?.value ? `${escapeHtml(maxToday.farm.name)} · ${number(maxToday.value)} 隻` : "目前沒有死亡"}</strong><small>跨場比較，不改變目前 Context</small></div><div class="records-cross-kpi"><span>近 7 日有紀錄的場</span><strong>${recentRows.filter((row) => row.mortality || row.cull).length} / ${farms.length}</strong><small>死亡／淘汰依同一事件時間軸彙整</small></div></div>
      <div class="records-cross-columns"><section><h3>近 7 日死亡／淘汰</h3><div class="records-farm-summary-list">${recentRows.map((row) => `<div class="records-farm-summary"><strong>${escapeHtml(row.farm.name)}</strong><span>死亡 ${number(row.mortality)} 隻 · 淘汰 ${number(row.cull)} 隻</span></div>`).join("")}</div></section><section><h3>各場近期事件</h3><div class="records-recent-event-list">${recentEvents.length ? recentEvents.map((event) => `<button type="button" class="records-recent-event" data-action="open-event" data-event-id="${escapeHtml(event.id)}"><span><strong>${escapeHtml(farmById(event.farmId)?.name || event.farmId)} · ${eventLabel(event.type)} ${number(event.quantity || event.qty)} ${escapeHtml(event.unit || "")}</strong><small>${escapeHtml(event.date)} ${escapeHtml(event.time)} · ${escapeHtml(contextName(event))}</small></span><span>›</span></button>`).join("") : `<div class="empty-tab"><strong>近 7 日沒有營運事件</strong></div>`}</div></section></div>
    </section>`;
  }

  function recordsTrendSeries(metric) {
    const config = RECORD_METRICS[metric] || RECORD_METRICS.mortality;
    return plusDateRange(7).map((date) => {
      const d = new Date(`${date}T00:00:00`);
      if (config.kind === "abnormal") {
        const rows = recordsAnalysisAbnormalities().filter((item) => item.date === date);
        return { date, label: `${d.getMonth() + 1}/${d.getDate()}`, value: rows.length, has: true, rows: rows.length };
      }
      const rows = recordsAnalysisEvents(metric).filter((event) => event.date === date);
      const zeroIsMeaningful = ["mortality", "cull", "shipment"].includes(metric);
      return {
        date,
        label: `${d.getMonth() + 1}/${d.getDate()}`,
        value: rows.reduce((sum, event) => sum + event.qty, 0),
        has: zeroIsMeaningful || rows.length > 0,
        rows: rows.length,
      };
    });
  }

  function recordsTrendAssessment(metric, series) {
    const config = RECORD_METRICS[metric] || RECORD_METRICS.mortality;
    const t = trendThresholds();
    const observed = series.filter((row) => row.has);
    if (!observed.length || observed.every((row) => row.value === 0)) {
      return { tone: "info", title: "目前沒有可判定的趨勢", copy: `最近 7 天沒有${config.label}資料；不補造數字，也不做異常推論。` };
    }
    if (metric === "shipment") {
      return { tone: "info", title: "事件型資料", copy: "出雞屬排程／事件資料，本版只顯示趨勢，不套用異常門檻。" };
    }
    if (metric === "abnormal") {
      const latest = [...series].reverse().find((row) => row.value > 0);
      return latest ? { tone: "warn", title: `${latest.label} 有 ${latest.value} 筆異常紀錄`, copy: "此提醒只表示近期有異常事件，不代表疾病診斷或風險分級。" } : { tone: "good", title: "近期無新增異常", copy: "最近 7 天沒有新增異常紀錄。" };
    }

    let latestFinding = null;
    let insufficientBaseline = false;
    for (let index = t.baselineDays; index < series.length; index += 1) {
      const current = series[index];
      if (!current.has) continue;
      const previous = series.slice(Math.max(0, index - t.baselineDays), index).filter((row) => row.has).map((row) => row.value);
      if (previous.length < t.minBaselinePoints) {
        insufficientBaseline = true;
        continue;
      }
      const base = median(previous);
      if (base === null) continue;
      if (metric === "mortality") {
        if (current.value >= t.mortalityMin && current.value - base >= t.mortalityDelta && current.value >= Math.max(1, base * t.mortalityRatio)) {
          latestFinding = { tone: "alert", title: `${current.label} 死亡上升`, copy: `當日 ${number(current.value)} 隻，高於前 ${t.baselineDays} 日基線中位數 ${number(base)} 隻；目前設定：單日至少 ${number(t.mortalityMin)} 隻、增加至少 ${number(t.mortalityDelta)} 隻、達基線 ${t.mortalityRatio.toFixed(1)} 倍。這是資料趨勢提醒，不是獸醫警戒值。` };
        }
      } else if (metric === "cull") {
        if (current.value >= t.cullMin && current.value - base >= t.cullDelta) latestFinding = { tone: "warn", title: `${current.label} 淘汰增加`, copy: `當日 ${number(current.value)} 隻；目前設定為單日至少 ${number(t.cullMin)} 隻且較近期基線增加至少 ${number(t.cullDelta)} 隻。` };
      } else if (metric === "feed") {
        if (base > 0 && current.value < base * (1 - t.feedDropPct / 100)) latestFinding = { tone: "warn", title: `${current.label} 飼料量偏低`, copy: `當日 ${number(current.value)} kg，較近期有紀錄日中位數 ${number(base)} kg 下降超過 ${number(t.feedDropPct)}%；請先確認是否漏記、換料或實際用量改變。` };
      } else if (metric === "water") {
        if (base > 0 && current.value < base * (1 - t.waterDropPct / 100)) latestFinding = { tone: "alert", title: `${current.label} 飲水量下降`, copy: `當日 ${number(current.value)} L，較近期有紀錄日中位數 ${number(base)} L 下降超過 ${number(t.waterDropPct)}%；請核對水線、設備與同批異常紀錄。` };
        else if (base > 0 && current.value > base * (1 + t.waterRisePct / 100)) latestFinding = { tone: "warn", title: `${current.label} 飲水量上升`, copy: `當日 ${number(current.value)} L，較近期中位數增加超過 ${number(t.waterRisePct)}%；建議核對天氣、日齡與是否有漏水。` };
      }
    }
    if (latestFinding) return latestFinding;
    if (insufficientBaseline) return { tone: "info", title: "資料不足，不判定", copy: `目前工作範圍在可比較日期中只有不足 ${number(t.minBaselinePoints)} 個有效基線資料點；系統不補造數字，也不判定異常。` };
    return { tone: "good", title: "近期趨勢未觸發提醒", copy: `${config.label}依「設定 → 趨勢提醒」目前門檻沒有明顯偏離；規則只做自我歷史比較，不使用外部產業門檻。` };
  }


  function recordsTrendChart(metric) {
    const config = RECORD_METRICS[metric] || RECORD_METRICS.mortality;
    const series = recordsTrendSeries(metric);
    const observed = series.map((row, index) => ({ ...row, index })).filter((row) => row.has);
    const assessment = recordsTrendAssessment(metric, series);
    const mortalityStats = metric === "mortality" ? recordsAnalysisMortalityStats() : null;
    if (!observed.length) return `<div class="records-trend-empty"><strong>沒有${config.label}資料</strong><span>切換其他範圍或查看時間軸。</span></div><div class="trend-alert ${assessment.tone}"><strong>${assessment.title}</strong><span>${assessment.copy}</span></div>`;
    const width = 640, height = 230, left = 42, right = 18, top = 24, bottom = 38;
    const plotW = width - left - right, plotH = height - top - bottom;
    const maxValue = Math.max(1, ...observed.map((row) => row.value));
    const x = (index) => left + (index / 6) * plotW;
    const y = (value) => top + (1 - value / maxValue) * plotH;
    const points = observed.map((row) => `${x(row.index).toFixed(1)},${y(row.value).toFixed(1)}`).join(" ");
    const latest = observed.at(-1);
    const headStats = mortalityStats
      ? `<div class="mortality-dual-stats" aria-label="死亡統計"><span><small>今日</small><strong>${number(mortalityStats.today)}</strong><em>隻</em></span><span><small>累積</small><strong>${number(mortalityStats.cumulative)}</strong><em>隻</em></span></div>`
      : `<b>${number(latest.value)} ${config.unit}</b>`;
    return `<div class="records-trend-card">
      <div class="records-trend-head"><span><strong>${config.label}趨勢</strong><small>最近 7 天 · ${escapeHtml(contextShortLabel())}</small></span>${headStats}</div>
      <div class="records-trend-svg-wrap"><svg class="records-trend-svg ${config.tone}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${config.label}最近 7 天趨勢圖">
        <line class="records-grid" x1="${left}" x2="${width-right}" y1="${top}" y2="${top}"/><line class="records-grid" x1="${left}" x2="${width-right}" y1="${top+plotH/2}" y2="${top+plotH/2}"/><line class="records-grid" x1="${left}" x2="${width-right}" y1="${top+plotH}" y2="${top+plotH}"/>
        ${points ? `<polyline class="records-trend-line" points="${points}"/>` : ""}
        ${observed.map((row) => `<circle class="records-trend-point" cx="${x(row.index)}" cy="${y(row.value)}" r="5"/><circle class="chart-query-hit" cx="${x(row.index)}" cy="${y(row.value)}" r="15" tabindex="0" data-chart-tip="${escapeHtml(`${row.date}｜${config.label} ${number(row.value)} ${config.unit}`)}" aria-label="${escapeHtml(`${row.date} ${config.label} ${number(row.value)} ${config.unit}`)}"/>`).join("")}
        ${series.map((row, index) => `<text class="records-axis" text-anchor="middle" x="${x(index)}" y="${height-12}">${row.label}</text>`).join("")}
        <text class="records-axis" x="4" y="${top+4}">${number(maxValue)}</text><text class="records-axis" x="18" y="${top+plotH+4}">0</text>
      </svg></div>
      <div class="records-trend-note">${["feed","water"].includes(metric) ? "無紀錄日期不當成 0；折線只連接實際有紀錄的日期。" : "圖表直接彙整紀錄時間軸中的同一份資料。"}${metric === "mortality" ? " 累積＝目前工作範圍內所有死亡紀錄合計。" : ""}</div>
    </div><div class="trend-alert ${assessment.tone}"><strong>${assessment.title}</strong><span>${assessment.copy}</span></div>`;
  }


  function recordsChartView() {
    const metrics = Object.entries(RECORD_METRICS);
    return `<div class="records-metric-chips" role="tablist" aria-label="紀錄趨勢項目">${metrics.map(([key, config]) => `<button type="button" class="records-metric-chip ${state.recordsMetric === key ? "active" : ""}" data-action="records-metric" data-records-metric="${key}" role="tab" aria-selected="${state.recordsMetric === key}">${config.label}</button>`).join("")}</div>${recordsTrendChart(state.recordsMetric)}`;
  }

  function renderRecords() {
    const eventRows = recordsAnalysisEvents().map((event) => ({ kind: "event", id: event.id, sort: `${event.date} ${event.time}`, title: `${eventLabel(event.type)} ${number(event.qty)} ${event.unit}`, detail: `${contextName(event)} · ${event.date} ${event.time}`, tone: ["mortality","cull"].includes(event.type) ? "alert" : "good", state: "有效" }));
    const abnormalRows = recordsAnalysisAbnormalities().map((item) => ({ kind: "abnormal", id: item.id, sort: `${item.date} ${item.time}`, title: `異常：${item.title}`, detail: `${contextName(item)} · ${item.category} · ${item.date} ${item.time}`, tone: item.status === "active" ? "warn" : "good", state: item.state }));
    const rows = [...eventRows, ...abnormalRows].sort((a, b) => b.sort.localeCompare(a.sort));
    const listView = `<section class="content-panel clean-list-panel"><div class="panel-title"><div><h3>紀錄時間軸</h3><p>死亡、淘汰、飼料、飲水、出雞與異常都跟著目前範圍切換。</p></div></div><div class="list-stack">${rows.length ? rows.map((record) => `<button type="button" class="list-row" data-action="${record.kind === "event" ? "open-event" : "open-abnormal"}" ${record.kind === "event" ? `data-event-id="${escapeHtml(record.id)}"` : `data-abnormal-id="${escapeHtml(record.id)}"`}><span><strong>${escapeHtml(record.title)}</strong><span>${escapeHtml(record.detail)}</span></span><span class="row-end"><span class="status-chip ${record.tone}">${escapeHtml(record.state)}</span><span class="row-arrow">›</span></span></button>`).join("") : `<div class="empty-tab"><strong>這個範圍沒有紀錄</strong><p>測試版不會用推算值補齊。</p></div>`}</div></section>`;
    return `<section class="page" data-page="records">
      ${contextBar()}
      ${pageIntro("", "紀錄", "查看目前工作範圍內的營運紀錄與趨勢。")}
      ${recordsCrossFarmAnalysis()}
      <div class="records-view-chips" role="tablist" aria-label="紀錄顯示方式"><button type="button" class="records-view-chip ${state.recordsMode === "list" ? "active" : ""}" data-action="records-mode" data-records-mode="list" role="tab" aria-selected="${state.recordsMode === "list"}">時間軸</button><button type="button" class="records-view-chip ${state.recordsMode === "chart" ? "active" : ""}" data-action="records-mode" data-records-mode="chart" role="tab" aria-selected="${state.recordsMode === "chart"}">趨勢圖</button></div>
      <div class="filter-note"><span><strong>紀錄分析範圍</strong>　${escapeHtml(recordsAnalysisLabel())}<small class="records-scope-note">${state.context.farmId === "all" ? "（局部篩選不會改變上方目前工作範圍）" : `（沿用 ${escapeHtml(contextLabel())}）`}</small></span><span class="scope-chip">${rows.length} 筆</span></div>
      ${state.recordsMode === "chart" ? `<section class="records-chart-panel">${recordsChartView()}</section>` : listView}
      <section class="content-grid"><div class="content-panel"><h3>需要人工確認</h3><p>${scopedPending().length} 筆待確認項目。</p><button type="button" class="text-link" data-action="go-todo">前往待辦 →</button></div><div class="content-panel"><h3>趨勢提醒設定</h3><p>門檻已集中到「設定 → 趨勢提醒」，資料不足仍不判定。</p><button type="button" class="text-link" data-action="open-settings-trend">調整提醒門檻 →</button></div></section>
    </section>`;
  }

  function renderTodo() {
    const pending = scopedPending();
    const upcoming = upcomingFlocks();
    return `<section class="page" data-page="todo">
      ${contextBar()}
      ${pageIntro("", "待辦", "只放目前工作範圍真正有下一步的事情。")}
      <section class="action-list">${pending.length ? `<button type="button" class="action-card" data-action="open-sheet" data-sheet-kind="pending"><span class="action-icon">${icon("check")}</span><span class="action-copy"><strong>${pending.length} 筆需要人工確認</strong><span>${escapeHtml(contextShortLabel())}</span></span><span class="action-count">${pending.length}</span><span class="action-arrow">›</span></button>` : ""}${upcoming.length ? `<button type="button" class="action-card good" data-action="open-sheet" data-sheet-kind="upcoming"><span class="action-icon">${icon("flock")}</span><span class="action-copy"><strong>${upcoming.length} 批 7 日內準備出雞</strong><span>${upcoming.map((flock) => escapeHtml(flock.code)).join("、")}</span></span><span class="action-count">${upcoming.length}</span><span class="action-arrow">›</span></button>` : ""}</section>
      <section class="content-panel clean-list-panel"><div class="panel-title"><div><h3>待人工確認清單</h3><p>場級資料若還不知道雞舍，會明確標示。</p></div><span class="status-chip warn">${pending.length} 筆</span></div><div class="list-stack">${pending.length ? pending.map((item) => `<button type="button" class="list-row" data-action="open-pending-item" data-pending-id="${escapeHtml(item.id)}"><span><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(pendingContextName(item))} · ${escapeHtml(item.detail)}</span></span><span class="row-end"><span class="row-value">${escapeHtml(item.kind)}</span><span class="row-arrow">›</span></span></button>`).join("") : `<div class="empty-tab"><strong>這個範圍沒有待確認項目</strong><p>可切換雞場或雞舍查看其他資料。</p></div>`}</div></section>
    </section>`;
  }

  function renderMore() {
    const totalClicks = Object.values(developerAnalytics.counts).reduce((sum, value) => sum + value, 0);
    return `<section class="page" data-page="more">
      ${contextBar()}
      ${pageIntro("", "更多", "低頻功能集中在這裡，日常畫面保持乾淨。")}
      <div class="more-list">
        <button type="button" class="more-item" data-action="open-sheet" data-sheet-kind="insights"><span class="more-item-icon">${icon("chart")}</span><span><strong>洞察</strong><span>死亡、目前在養、飼料、飲水與異常摘要</span></span><span>›</span></button>
        <button type="button" class="more-item" data-nav="calendar"><span class="more-item-icon">${icon("records")}</span><span><strong>月曆</strong><span>排程、入雛、磅雞、出雞與營運紀錄</span></span><span>›</span></button>
        <button type="button" class="more-item" data-action="go-finance" data-testid="finance-entry" aria-label="更多中的財務"><span class="more-item-icon">${icon("finance")}</span><span><strong>財務</strong><span>總覽、各場、股權、歷史分配、費用、投資績效與資料來源；手機從更多進入，桌面在左側導覽。</span></span><span>›</span></button>
        <button type="button" class="more-item" data-action="go-ai"><span class="more-item-icon">${icon("ai")}</span><span><strong>AI 助理</strong><span>帶入目前工作範圍；此測試版維持唯讀</span></span><span>›</span></button>
        <button type="button" class="more-item" data-action="open-sheet" data-sheet-kind="system"><span class="more-item-icon">${icon("lock")}</span><span><strong>系統</strong><span>查看雞場、雞舍、批次與服務邊界</span></span><span>›</span></button>
        <button type="button" class="more-item" data-action="open-sheet" data-sheet-kind="audit"><span class="more-item-icon">${icon("records")}</span><span><strong>變更紀錄</strong><span>修改、取消與操作歷程的入口</span></span><span>›</span></button>
        <button type="button" class="more-item" data-action="open-sheet" data-sheet-kind="settings"><span class="more-item-icon">${icon("more")}</span><span><strong>設定</strong><span>操作與管理設定</span></span><span>›</span></button>
      </div>
      <section class="developer-block"><div class="section-heading"><div><h2>開發者</h2><p>本機測試分析，不上傳操作資料。</p></div><span class="env-chip">${number(totalClicks)} 次點擊</span></div><div class="developer-grid">
        <button type="button" class="developer-item" data-action="open-sheet" data-sheet-kind="developer-clicks"><span>${icon("todo")}</span><strong>點擊計數</strong><small>查看每個組件／按鈕使用次數</small></button>
        <button type="button" class="developer-item" data-action="open-sheet" data-sheet-kind="developer-log"><span>${icon("records")}</span><strong>UI Log</strong><small>最近 ${Math.min(developerAnalytics.log.length, DEV_LOG_LIMIT)} 筆本機互動</small></button>
        <button type="button" class="developer-item" data-action="open-sheet" data-sheet-kind="developer-notes"><span>${icon("spark")}</span><strong>開發者筆記</strong><small>只存本機瀏覽器</small></button>
        <button type="button" class="developer-item" data-action="open-sheet" data-sheet-kind="developer-diagnostics"><span>${icon("lock")}</span><strong>診斷</strong><small>資料契約、版本與降級狀態</small></button>
        <button type="button" class="developer-item wide" data-action="open-sheet" data-sheet-kind="developer-fallback"><span>${icon("ai")}</span><strong>AI／Cloudflare 降級方案</strong><small>暫時中斷與永久遷移設計提案</small></button>
      </div></section>
    </section>`;
  }

  function aiPreviewMarkup(key) {
    const stats = mortalityTrendStats();
    const pending = scopedPending();
    const abnormal = scopedAbnormalities({ activeOnly: true });
    const upcoming = upcomingFlocks();
    if (key === "mortality") {
      const assessment = recordsTrendAssessment("mortality", recordsTrendSeries("mortality"));
      return `<div class="ai-preview-result"><p class="kicker">死亡趨勢解讀</p><h2>今日 ${number(stats.today)} 隻 · 累積 ${number(stats.cumulative)} 隻</h2><div class="trend-alert ${assessment.tone}"><strong>${assessment.title}</strong><span>${assessment.copy}</span></div><button type="button" class="text-link" data-action="go-records">打開死亡趨勢與原始紀錄 →</button></div>`;
    }
    if (key === "feedwater") {
      const feed = recordsTrendAssessment("feed", recordsTrendSeries("feed"));
      const water = recordsTrendAssessment("water", recordsTrendSeries("water"));
      return `<div class="ai-preview-result"><p class="kicker">飼飲趨勢</p><h2>先看是否偏離近期基線</h2><div class="ai-result-stack"><div class="trend-alert ${feed.tone}"><strong>飼料｜${feed.title}</strong><span>${feed.copy}</span></div><div class="trend-alert ${water.tone}"><strong>飲水｜${water.title}</strong><span>${water.copy}</span></div></div></div>`;
    }
    if (key === "shipment") {
      return `<div class="ai-preview-result"><p class="kicker">出雞準備</p><h2>${upcoming.length ? `${upcoming.length} 批在 7 日內` : "目前沒有 7 日內出雞批次"}</h2><div class="ai-result-list">${upcoming.map((flock) => `<button type="button" class="sheet-item" data-action="open-flock" data-flock-id="${escapeHtml(flock.id)}"><span><strong>${escapeHtml(flock.code)}</strong><span>${escapeHtml(flock.farm)} · ${escapeHtml(flock.house)} · ${escapeHtml(flock.ship)}</span></span><span class="sheet-item-end">›</span></button>`).join("") || `<div class="empty-tab"><strong>目前無近期出雞事項</strong></div>`}</div></div>`;
    }
    if (key === "records") {
      const recent = desktopRecentRows(6);
      return `<div class="ai-preview-result"><p class="kicker">查找近期紀錄</p><h2>目前範圍最近 ${recent.length} 筆</h2><div class="ai-result-list">${recent.map((row) => `<button type="button" class="sheet-item" data-action="${row.kind === "event" ? "open-event" : "open-abnormal"}" ${row.kind === "event" ? `data-event-id="${row.id}"` : `data-abnormal-id="${row.id}"`}><span><strong>${escapeHtml(row.title)}</strong><span>${escapeHtml(row.detail)}</span></span><span class="sheet-item-end">›</span></button>`).join("") || `<div class="empty-tab"><strong>沒有近期紀錄</strong></div>`}</div></div>`;
    }
    return `<div class="ai-preview-result"><p class="kicker">今日重點</p><h2>${escapeHtml(contextShortLabel())}</h2><div class="ai-overview-metrics"><div><span>目前在養</span><strong>${number(contextStock())}</strong></div><div><span>今日死亡</span><strong>${number(stats.today)}</strong></div><div><span>待確認</span><strong>${number(pending.length)}</strong></div><div><span>異常追蹤</span><strong>${number(abnormal.length)}</strong></div></div><p>AI 正式版可把這些資料整理成白話摘要、指出值得優先查看的原始紀錄；但不直接修改正式資料。</p></div>`;
  }

  function renderAi() {
    const available = simulatedAiAvailable();
    LAB_AI.available = available;
    const aiStatus = LAB_AI.status();
    const contextMarkup = desktopWideMode() ? desktopContextToolbar() : contextBar();
    if (!available) {
      return `<section class="${desktopWideMode() ? "desktop-v2-page" : "page"} ai-page" data-page="ai">${contextMarkup}${pageIntro("", "AI 助理", "AI 目前不可用，但核心資料與操作維持正常。")}<section class="fallback-card warn"><strong>AI 暫時不可用</strong><p>不影響 Context、快速記錄、紀錄、待辦、財務與圖表。請使用既有結構化操作；自然語言分析暫停。</p></section><div class="ai-unavailable-grid"><section class="content-panel"><h3>仍可正常使用</h3><p>快速記錄、紀錄查詢、待辦、財務、圖表、Context 切換與人工確認。</p></section><section class="content-panel"><h3>暫停的能力</h3><p>白話摘要、自然語言查詢、趨勢解讀與建議；核心資料流程不依賴 AI。</p></section><section class="content-panel"><h3>管理者／開發者</h3><p>「更多 → 開發者 → AI／Cloudflare 降級方案」可查看暫時下線與永久遷移設計。</p></section></div></section>`;
    }
    const tasks = [
      ["overview", "今日重點", "把目前在養、死亡、待辦與異常整理成摘要", "digest"],
      ["mortality", "死亡趨勢", "解讀今日／累積死亡與近期趨勢提醒", "chart"],
      ["feedwater", "飼飲異常", "比較飼料、飲水與近期基線是否偏離", "warning"],
      ["shipment", "出雞準備", "整理 7 日內出雞批次與場舍位置", "flock"],
      ["records", "查找紀錄", "從目前工作範圍找出最近相關紀錄", "records"],
    ];
    return `<section class="${desktopWideMode() ? "desktop-v2-page" : "page"} ai-page" data-page="ai">
      ${contextMarkup}
      ${pageIntro("", "AI 助理", "用白話查詢、整理與解讀目前工作範圍；AI 永遠唯讀，不直接改資料。")}
      <div class="ai-status-strip"><span class="status-chip good">${aiStatus === "AI_AVAILABLE" ? "AI 可用" : "AI 暫不可用"}</span><strong>先選你要 AI 幫什麼</strong><span>正式版可再加入自由輸入問題；本原型以真實測試資料示範能力。</span></div>
      <div class="ai-workspace">
        <aside class="ai-task-panel"><div class="desktop-pane-head"><div><h2>可用功能</h2><p>點一項立即看結果範例</p></div></div><div class="ai-task-list">${tasks.map(([key,label,copy,iconName]) => `<button type="button" class="ai-task ${state.aiPreviewKey === key ? "active" : ""}" data-action="ai-preview" data-ai-preview="${key}"><span>${icon(iconName)}</span><span><strong>${label}</strong><small>${copy}</small></span><em>›</em></button>`).join("")}</div></aside>
        <main class="ai-preview-panel"><div class="desktop-pane-head"><div><h2>分析預覽</h2><p>${escapeHtml(contextLabel())}</p></div><span class="scope-chip">唯讀</span></div><div class="ai-preview-body">${aiPreviewMarkup(state.aiPreviewKey)}</div></main>
        <aside class="ai-boundary-panel"><div class="desktop-pane-head"><div><h2>AI 的權限</h2><p>避免誤以為 AI 會直接操作</p></div></div><div class="ai-boundary-body"><div class="ai-boundary good"><strong>可以</strong><span>摘要、查詢、趨勢解讀、找相關紀錄、提出待確認建議。</span></div><div class="ai-boundary alert"><strong>不可以</strong><span>直接寫入 D1、直接修改數量、刪除紀錄、跳過人工確認。</span></div><div class="ai-example"><strong>你可以這樣問</strong><span>「紅羽一場最近死亡有沒有變高？」</span><span>「烏骨一舍飲水下降從哪天開始？」</span><span>「這週有哪些批次要準備出雞？」</span></div></div></aside>
      </div>
    </section>`;
  }

  function financeTabs() {
    return [["overview", "總覽"], ["farms", "各場"], ["equity", "投資人／股權"], ["distributions", "歷史分配"], ["expenses", "費用"], ["performance", "投資績效"], ["source", "資料來源"]];
  }

  function chartMarkup() {
    const values = FINANCE_REPO.getCumulativeNetSeries(financeFilters());
    if (!values.length) return `<div class="empty-tab" data-testid="finance-chart-empty"><strong>尚無歷史結算</strong><p>目前範圍沒有可建立的累積淨收入序列。</p></div>`;
    const width = 680;
    const height = 240;
    const left = 56;
    const right = 24;
    const top = 24;
    const bottom = 40;
    const rawValues = values.map((item) => item.value);
    const rawMin = Math.min(...rawValues, 0);
    const rawMax = Math.max(...rawValues, 0);
    const padding = Math.max((rawMax - rawMin) * 0.12, 1);
    const min = rawMin - padding;
    const max = rawMax + padding;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;
    const points = values.map((item, index) => {
      const x = values.length === 1 ? left + plotWidth / 2 : left + (plotWidth * index) / (values.length - 1);
      const y = top + ((max - item.value) / (max - min)) * plotHeight;
      return { ...item, x, y };
    });
    const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
    const area = `${points[0].x},${height - bottom} ${polyline} ${points[points.length - 1].x},${height - bottom}`;
    const yTicks = [min, (min + max) / 2, max];
    const last = values.at(-1);
    return `<div class="chart-wrap"><svg class="net-chart" data-testid="finance-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="累積淨收入變化折線圖，最後資料點為 ${escapeHtml(money(last.value))}">
      <title>依歷史分配動態計算的累積淨收入</title>
      ${yTicks.map((tick) => { const y = top + ((max - tick) / (max - min)) * plotHeight; return `<line class="chart-grid" x1="${left}" x2="${width - right}" y1="${y}" y2="${y}"/><text class="chart-axis" x="4" y="${y + 4}">${money(tick)}</text>`; }).join("")}
      <polygon class="chart-area" points="${area}"/><polyline class="chart-line" points="${polyline}"/>
      ${points.map((point, index) => `<circle class="chart-point ${index === points.length - 1 ? "current" : ""}" cx="${point.x}" cy="${point.y}" r="${index === points.length - 1 ? 6 : 4}"/><circle class="chart-query-hit" cx="${point.x}" cy="${point.y}" r="15" tabindex="0" data-chart-tip="${escapeHtml(`${point.date}｜累積淨收入 ${moneyPrecise(point.value)}`)}" aria-label="${escapeHtml(`${point.date} 累積淨收入 ${money(point.value)}`)}"/><text class="chart-axis" text-anchor="middle" x="${point.x}" y="${height - 13}">${escapeHtml(point.label)}</text>${index === points.length - 1 ? `<text class="chart-value" text-anchor="end" x="${point.x - 10}" y="${point.y - 12}">${money(last.value)}</text>` : ""}`).join("")}
    </svg></div>`;
  }

  function renderFinanceOverview() {
    const scope = financeScope();
    const totals = scope.totals;
    const context = scope.currentContext;
    const scopeTitle = context.farm.id === "all" ? "全部在養財務" : `${escapeHtml(context.farm.name)} 財務`;
    const runtimeIdentity = context.farm.id === "all" ? null : financeIdentityForOperationalFarm(context.farm.id);
    const unconfigured = runtimeIdentity?.status === "unconfigured";
    const displayAmount = (value) => unconfigured ? "—" : money(value);
    const scopeCopy = unconfigured
      ? "已建立 Finance identity，但尚未建立財務資料；不顯示假的收入、分配或費用。"
      : context.farm.id === "all" ? "八個模擬場合計；所有金額均為 synthetic fixture。" : "財務最小範圍為雞場；雞舍／批次沿用所屬雞場。";
    const chart = unconfigured
      ? `<div class="empty-tab" data-testid="finance-chart-empty"><strong>尚未建立財務資料</strong><p>這個雞場已有 Finance identity，但尚無可呈現的收入、分配、費用或累積淨收入資料。</p></div>`
      : chartMarkup();
    return `<section class="finance-header"><div class="finance-kpis"><button type="button" class="finance-kpi finance-kpi-button" data-action="open-finance-metric" data-finance-metric="gross"><span>歷史總盈虧</span><strong>${displayAmount(totals.gross)}</strong><small>${unconfigured ? "尚未建立財務資料" : "查看構成 ›"}</small></button><button type="button" class="finance-kpi finance-kpi-button amber" data-action="open-finance-metric" data-finance-metric="allocated"><span>已配置盈虧</span><strong>${displayAmount(totals.allocated)}</strong><small>${unconfigured ? "尚未建立財務資料" : "查看歷史分配 ›"}</small></button><button type="button" class="finance-kpi finance-kpi-button red" data-action="open-finance-metric" data-finance-metric="expense"><span>費用</span><strong>${displayAmount(totals.expense)}</strong><small>${unconfigured ? "尚未建立財務資料" : "查看費用合計 ›"}</small></button><button type="button" class="finance-kpi finance-kpi-button green" data-action="open-finance-metric" data-finance-metric="net"><span>投資人淨收入</span><strong data-testid="finance-net">${displayAmount(totals.net)}</strong><small>${unconfigured ? "尚未建立財務資料" : "查看計算 ›"}</small></button></div><div class="metric-note"><strong>${scopeTitle}</strong><span>${scopeCopy}${scope.contextNote ? ` ${scope.contextNote}` : ""}</span></div></section><section class="chart-panel"><div class="chart-title"><div><h3>累積淨收入趨勢</h3><p>${unconfigured ? "尚無資料，不建立空白結算或累積數字。" : "由 FinanceRepository 依分配日期排序後動態計算。"}</p></div><span class="status-chip warn">${unconfigured ? "未配置" : "Synthetic"}</span></div>${chart}</section>`;
  }

  function financeFarmRows(scope) {
    return scope.farms.map((farm) => {
      if (farm.unconfigured) {
        return `<button type="button" class="list-row finance-unconfigured-row" data-action="open-finance-farm" data-farm-id="${escapeHtml(farm.id)}"><span><strong>${escapeHtml(farm.name)}</strong><span>Finance identity ${escapeHtml(farm.id)} · 尚未建立財務資料</span></span><span class="row-end"><span class="status-chip warn">未配置</span><span>查看身份 ›</span></span></button>`;
      }
      const history = farm.historyStatus === "has_history";
      const description = history
        ? `歷史總盈虧 ${money(farm.grossProfitLoss)} · 已配置盈虧 ${money(farm.allocatedProfitLoss)} · 費用 ${money(farm.expense)}`
        : "尚無歷史結算";
      return `<button type="button" class="list-row" data-action="open-finance-farm" data-farm-id="${escapeHtml(farm.id)}"><span><strong>${escapeHtml(farm.name)}</strong><span>${description}</span></span><span class="row-end"><span class="row-value">${history ? money(farm.netIncome) : "—"}</span><span>${history ? "投資人淨收入 ›" : "尚無歷史結算"}</span></span></button>`;
    }).join("");
  }

  function financeInvestorRows(scope) {
    return scope.investors.map((investor) => `<button type="button" class="list-row" data-action="open-investor-detail" data-investor-id="${escapeHtml(investor.id)}"><span><strong>${escapeHtml(investor.name)}</strong><span>${investor.farms.map((row) => `${escapeHtml(row.farm)} ${row.share.toFixed(1)}%`).join(" · ") || "尚無股權資料"} · 正向 ${investor.positiveDistributionCount} 筆 · 負向 ${investor.negativeDistributionCount} 筆</span></span><span class="row-end"><span class="row-value">${money(investor.allocationTotal)}</span><span>配置合計 ›</span></span></button>`).join("");
  }

  function financeDistributionRows(scope) {
    return scope.distributions.map((distribution) => `<button type="button" class="list-row" data-action="open-distribution-detail" data-distribution-id="${escapeHtml(distribution.id)}"><span><strong>${escapeHtml(distribution.distributionDate)} · ${escapeHtml(distribution.sourceRowKey)}</strong><span>歷史總盈虧 ${money(distribution.grossProfitLoss)} · 已配置盈虧 ${money(distribution.allocatedProfitLoss)} · 費用 ${money(distribution.expense)}</span></span><span class="row-end"><span class="row-value">${money(distribution.netIncome)}</span><span>投資人淨收入 ›</span></span></button>`).join("");
  }

  function financeTabBody() {
    const scope = financeScope();
    if (state.financeTab === "overview") return renderFinanceOverview();
    if (scope.unconfiguredContext && ["equity", "distributions", "expenses", "performance", "source"].includes(state.financeTab)) return `<section class="content-panel" data-testid="finance-unconfigured-tab"><div class="panel-title"><div><h3>${escapeHtml(financeTabs().find(([key]) => key === state.financeTab)?.[1] || "財務")}</h3><p>這個雞場已有 Finance identity，但尚未建立可呈現的財務資料。</p></div><span class="status-chip warn">未配置</span></div><div class="empty-tab"><strong>尚未建立財務資料</strong><p>不補造收入、分配、費用、股權或績效數字。</p></div></section>`;
    if (state.financeTab === "farms") return `<section class="content-panel"><div class="panel-title"><div><h3>各場</h3><p>已配置場沿用 FinanceRepository；新建場只顯示 Finance identity，不補造結算。</p></div><span class="status-chip good">${scope.farms.length} 場／身份</span></div><div class="list-stack">${financeFarmRows(scope) || `<div class="empty-tab"><strong>沒有符合範圍的模擬場</strong></div>`}</div></section>`;
    if (state.financeTab === "equity") return `<section class="content-panel"><div class="panel-title"><div><h3>投資人／股權</h3><p>由投資人、場級股權與歷史分配資料 join；不使用均分假設。</p></div><span class="status-chip good">${scope.investors.length} 位</span></div><div class="list-stack">${financeInvestorRows(scope) || `<div class="empty-tab"><strong>沒有符合範圍的投資人</strong></div>`}</div></section>`;
    if (state.financeTab === "distributions") return `<section class="content-panel"><div class="panel-title"><div><h3>歷史分配</h3><p>每筆 ProfitDistribution 與其三筆投資人配置均可進入明細。</p></div><span class="status-chip good">${scope.distributions.length} 筆</span></div><div class="list-stack">${financeDistributionRows(scope) || `<div class="empty-tab"><strong>尚無歷史結算</strong></div>`}</div></section>`;
    if (state.financeTab === "expenses") return `<section class="content-panel"><div class="panel-title"><div><h3>費用</h3><p>只呈現分配層級的費用合計，不虛構費用分類。</p></div><span class="status-chip warn">${money(scope.totals.expense)}</span></div><div class="list-stack">${scope.farms.map((farm) => `<button type="button" class="list-row" data-action="open-expense-detail" data-farm-id="${escapeHtml(farm.id)}"><span><strong>${escapeHtml(farm.name)}</strong><span>${farm.distributionCount ? `${farm.distributionCount} 筆歷史分配 · 分配層級費用合計` : "尚無歷史結算"}</span></span><span class="row-end"><span class="row-value">${farm.distributionCount ? money(farm.expense) : "—"}</span><span>費用明細 ›</span></span></button>`).join("") || `<div class="empty-tab"><strong>沒有符合範圍的模擬場</strong></div>`}</div></section>`;
    if (state.financeTab === "performance") {
      const positive = scope.distributions.filter((row) => Number(row.netIncome) > 0).length;
      const negative = scope.distributions.filter((row) => Number(row.netIncome) < 0).length;
      const latest = scope.distributions.at(-1);
      return `<section class="content-panel"><div class="panel-title"><div><h3>投資績效</h3><p>僅呈現已配置盈虧與投資人淨收入；沒有資本投入資料時不推導 ROI／IRR。</p></div><span class="status-chip good">唯讀計算</span></div><div class="detail-list"><div class="detail-block"><h3>投資人淨收入</h3><p data-testid="finance-performance-net">${money(scope.totals.net)}</p></div><div class="detail-block"><h3>正向／負向歷史分配</h3><p>${positive} ／ ${negative} 筆</p></div><div class="detail-block"><h3>最近歷史分配</h3><p>${latest ? `${latest.distributionDate} · ${money(latest.netIncome)}` : "尚無歷史結算"}</p></div><div class="readonly-note">ROI、IRR、年化報酬與回收期未提供：合約沒有資本投入基準，因此不自行推導。</div></div></section>`;
    }
    const sources = FINANCE_REPO.listSourceReferences(financeFilters());
    return `<section class="content-panel"><div class="panel-title"><div><h3>資料來源</h3><p>所有財務列均來自 synthetic fixture；此頁只呈現可追溯欄位。</p></div><span class="status-chip warn">synthetic</span></div><div class="list-stack">${sources.map((source) => `<button type="button" class="list-row" data-action="open-distribution-detail" data-distribution-id="${escapeHtml(source.distributionId)}"><span><strong>${escapeHtml(source.sourceDataset)}</strong><span>${escapeHtml(source.sourceRowKey)} · ROC ${escapeHtml(source.sourceDateRoc)} · ${escapeHtml(source.distributionDate)}</span></span><span class="row-end"><span class="row-value">synthetic</span><span>查看 ›</span></span></button>`).join("") || `<div class="empty-tab"><strong>沒有來源資料</strong></div>`}</div></section>`;
  }

  function renderFinance() {
    const tabs = financeTabs();
    return `<section class="page" data-page="finance">
      ${contextBar()}
      ${pageIntro("", "財務", "七個財務檢視均使用 FinanceRepository 的 synthetic fixture。")}
      <div class="finance-tabs" role="tablist" aria-label="財務分頁">${tabs.map(([key, label]) => `<button type="button" role="tab" aria-selected="${state.financeTab === key}" class="finance-tab ${state.financeTab === key ? "active" : ""}" data-action="finance-tab" data-finance-tab="${key}">${label}</button>`).join("")}</div>
      ${financeTabBody()}
      <div class="sync-note"><strong>財務範圍：</strong>${htmlContextLabel()}。${escapeHtml(financeScope().contextNote || "FinanceRepository 只讀 synthetic fixture，不連線外部資料源。")}</div>
    </section>`;
  }

  function sheetShell(title, subtitle, body, kind) {
    return `<div class="sheet-layer" data-testid="bottom-sheet"><div class="sheet-backdrop" data-action="close-sheet" aria-hidden="true"></div><section class="sheet-panel" data-sheet-kind="${kind}" role="dialog" aria-modal="true" aria-labelledby="sheet-title" tabindex="-1"><div class="sheet-head"><div class="sheet-handle" aria-hidden="true"></div><div class="sheet-head-row"><div><h2 id="sheet-title">${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ""}</div><button type="button" class="sheet-close" data-action="close-sheet" aria-label="關閉">×</button></div></div><div class="sheet-body">${body}</div></section></div>`;
  }

  function contextSheet() {
    const farmOptions = labData().farms.map((option) => `<button type="button" class="option-row ${state.context.farmId === option.id ? "selected" : ""}" data-action="select-farm-direct" data-farm-id="${escapeHtml(option.id)}"><span><strong>${escapeHtml(option.name)}</strong><span>${option.id === "all" ? "全域唯讀總覽" : `${option.id === "history" ? "歷史查詢" : escapeHtml(option.subtitle || "Lab 新增雞場")} · 在養隻數 ${number(displayedFarmStock(option))}`}</span></span><span class="option-check">${state.context.farmId === option.id ? icon("check") : icon("arrow")}</span></button>`).join("");
    return sheetShell("選擇雞場", "選好雞場後，雞舍與批次可直接在頁面上用按鈕切換。", `<div class="option-list">${farmOptions}</div>`, "context");
  }

  function pendingSheet() {
    const rows = scopedPending();
    return sheetShell(`${rows.length} 筆需要人工確認`, htmlContextLabel(), `<div class="sheet-item-list">${rows.length ? rows.map((item) => `<button type="button" class="sheet-item" data-action="open-pending-item" data-pending-id="${escapeHtml(item.id)}"><span><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(pendingContextName(item))} · ${escapeHtml(item.kind)}</span></span><span class="sheet-item-end">›</span></button>`).join("") : `<div class="empty-tab"><strong>這個範圍沒有待確認資料</strong></div>`}</div><div class="readonly-note">測試版只展示操作，不會寫入正式資料。</div>`, "pending");
  }

  function upcomingSheet() {
    const rows = upcomingFlocks();
    return sheetShell(`${rows.length} 批 7 日內準備出雞`, htmlContextLabel(), `<div class="sheet-item-list">${rows.length ? rows.map((flock) => `<button type="button" class="sheet-item" data-action="open-flock" data-flock-id="${escapeHtml(flock.id)}"><span><strong>${escapeHtml(flock.code)}</strong><span>${escapeHtml(flock.farm)} / ${escapeHtml(flock.house)} · ${escapeHtml(flock.status)}</span></span><span class="sheet-item-end">›</span></button>`).join("") : `<div class="empty-tab"><strong>此範圍沒有 7 日內出雞批次</strong><p>目前工作範圍沒有符合條件的進行中批次。</p></div>`}</div>`, "upcoming");
  }

  function abnormalSheet() {
    const rows = scopedAbnormalities();
    const active = rows.filter((item) => item.status === "active").length;
    const resolved = rows.length - active;
    return sheetShell(`異常紀錄 ${rows.length}`, `${active} 筆追蹤中${resolved ? ` · ${resolved} 筆已結案` : ""}`, `<div class="sheet-item-list">${rows.length ? rows.map((item) => `<button type="button" class="sheet-item" data-action="open-abnormal" data-abnormal-id="${escapeHtml(item.id)}"><span><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(contextName(item))} · ${escapeHtml(item.category)} · ${escapeHtml(item.state)}</span></span><span class="sheet-item-end">›</span></button>`).join("") : `<div class="empty-tab"><strong>此範圍沒有異常紀錄</strong></div>`}</div>`, "abnormal");
  }

  function mortalitySheet() {
    const rows = scopedMortality();
    return sheetShell(`今日死亡 ${number(mortalityValue())}`, htmlContextLabel(), `<div class="sheet-item-list">${rows.length ? rows.map((item) => `<button type="button" class="sheet-item" data-action="open-event" data-event-id="${escapeHtml(item.id)}"><span><strong>${escapeHtml(item.farm)} / ${escapeHtml(item.house)}</strong><span>${escapeHtml(item.flock)} · ${escapeHtml(item.time)}</span></span><span class="sheet-item-end">${number(item.quantity)} ›</span></button>`).join("") : `<div class="empty-tab"><strong>這個範圍沒有死亡明細</strong></div>`}</div>`, "mortality");
  }

  function cullSheet() {
    const rows = scopedCull();
    return sheetShell(`今日淘汰 ${number(cullValue())}`, htmlContextLabel(), `<div class="sheet-item-list">${rows.length ? rows.map((item) => {
      const farm = farmById(item.farmId);
      const house = houseById(farm, item.houseId);
      const flock = house ? flockById(house, item.flockId) : null;
      return `<button type="button" class="sheet-item" data-action="open-event" data-event-id="${escapeHtml(item.id)}"><span><strong>${escapeHtml(farm.name)} / ${escapeHtml(house?.name || "場級")}</strong><span>${escapeHtml(flock?.code || "全批次")} · ${escapeHtml(item.time)}</span></span><span class="sheet-item-end">${number(item.qty)} ›</span></button>`;
    }).join("") : `<div class="empty-tab"><strong>這個範圍沒有淘汰明細</strong></div>`}</div>`, "cull");
  }

  function flocksSheet() {
    const rows = scopedFlocks();
    return sheetShell(`進行中批次 ${rows.length}`, `${htmlContextLabel()} · 只列進行中批次`, `<div class="sheet-item-list">${rows.length ? rows.map((flock) => `<button type="button" class="sheet-item" data-action="open-flock" data-flock-id="${escapeHtml(flock.id)}"><span><strong>${escapeHtml(flock.code)}</strong><span>${escapeHtml(flock.farm)} / ${escapeHtml(flock.house)} · 本批在養 ${number(flock.stock)} · ${escapeHtml(flock.status)}</span></span><span class="sheet-item-end">›</span></button>`).join("") : `<div class="empty-tab"><strong>此範圍沒有進行中批次</strong><p>歷史已出雞批次不列入進行中批次。</p></div>`}</div>`, "flocks");
  }

  function flockSheet(flockId) {
    const flock = allFlocks().find((item) => item.id === flockId) || allFlocks()[0];
    return sheetShell("批次詳細", `${escapeHtml(flock.farm)} / ${escapeHtml(flock.house)}`, `<div class="sheet-detail"><div class="detail-hero"><small>${flock.state === "active" ? "進行中" : "已出雞"}</small><strong>${escapeHtml(flock.code)}</strong><span>${escapeHtml(flock.status)}</span></div><div class="detail-block"><h3>本批在養</h3><p>${number(flock.stock)} 隻</p></div><div class="detail-block"><h3>初始入雞</h3><p>${number(flock.initial)} 隻 · 入雛 ${escapeHtml(flock.chickIn)}</p></div><div class="detail-block"><h3>預計／實際出雞</h3><p>${escapeHtml(flock.ship)}</p></div><button type="button" class="sheet-primary" data-action="jump-context" data-farm-id="${escapeHtml(flock.farmId)}" data-house-id="${escapeHtml(flock.houseId)}" data-flock-id="${escapeHtml(flock.id)}">切換到這個批次</button></div>`, "flock");
  }

  function pendingItemSheet(id) {
    const item = labData().pending.find((candidate) => candidate.id === id) || labData().pending[0];
    return sheetShell(escapeHtml(item.title), escapeHtml(item.kind), `<div class="detail-hero"><small>${escapeHtml(item.kind)}</small><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(pendingContextName(item))}</span></div><div class="detail-block"><h3>說明</h3><p>${escapeHtml(item.detail)}</p></div><div class="detail-block"><h3>測試版說明</h3><p>這裡只展示處理流程，不會修改正式資料。</p></div><button type="button" class="sheet-primary" data-action="go-records">前往紀錄</button>`, "pending-item");
  }

  function abnormalItemSheet(id) {
    const item = labData().abnormalities.find((candidate) => candidate.id === id) || labData().abnormalities[0];
    return sheetShell(escapeHtml(item.title), `${escapeHtml(item.category)} · ${escapeHtml(item.state)}`, `<div class="detail-hero"><small>${escapeHtml(item.state)}</small><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(contextName(item))}</span></div><div class="detail-block"><h3>紀錄</h3><p>${escapeHtml(item.date)} ${escapeHtml(item.time)} · 溫度快照 ${escapeHtml(item.temp)}°C</p></div><div class="detail-block"><h3>說明</h3><p>這個畫面只展示既有異常資料，不會自行產生健康評分或產業比較。</p></div><button type="button" class="sheet-primary" data-action="go-records">查看紀錄</button>`, "abnormal-item");
  }

  function eventItemSheet(id) {
    const events = effectiveLabEvents();
    const item = events.find((event) => event.id === id) || events[0];
    const farm = farmById(item.farmId);
    const house = item.houseId ? houseById(farm, item.houseId) : null;
    const flock = house && item.flockId ? flockById(house, item.flockId) : null;
    const isLabEvent = labOverlay().events.some((event) => event.id === item.id);
    return sheetShell(`${eventLabel(item.type)} ${number(item.qty)} ${escapeHtml(item.unit)}`, `${escapeHtml(item.date)} ${escapeHtml(item.time)}`, `<div class="detail-hero"><small>${eventLabel(item.type)}紀錄</small><strong>${number(item.qty)} ${escapeHtml(item.unit)}</strong><span>${escapeHtml(contextName(item))}</span></div><div class="detail-block"><h3>位置</h3><p>${escapeHtml(farm.name)}${house ? ` · ${escapeHtml(house.name)}` : " · 場級紀錄"}${flock ? ` · ${escapeHtml(flock.code)}` : ""}</p></div><div class="readonly-note">來源：${escapeHtml(item.source || "fixture")} · 原紀錄只能保留；需要更正時，系統會新增一筆修正紀錄。</div>${flock ? `<button type="button" class="sheet-primary" data-action="jump-context" data-farm-id="${escapeHtml(farm.id)}" data-house-id="${escapeHtml(house.id)}" data-flock-id="${escapeHtml(flock.id)}">切換到這個批次</button>` : ""}${isLabEvent ? `<button type="button" class="sheet-secondary" data-action="open-correction" data-event-id="${escapeHtml(item.id)}">修正紀錄</button>` : ""}`, "event-item");
  }

  function correctionSheet(id) {
    const item = effectiveLabEvents().find((event) => event.id === id);
    if (!item) return sheetShell("找不到事件", "變更紀錄", `<div class="empty-tab"><strong>這筆事件已不存在</strong></div>`, "correction");
    return sheetShell("修正紀錄", `${escapeHtml(contextName(item))} · ${escapeHtml(item.date)} ${escapeHtml(item.time)}`, `<div class="detail-hero"><small>原紀錄保留</small><strong>${eventLabel(item.type)} ${number(item.qty)} ${escapeHtml(item.unit)}</strong><span>原紀錄會保留，系統會新增一筆修正紀錄。</span></div><label class="quick-record-label" for="correction-qty">修正後數量</label><input id="correction-qty" class="quick-record-input" type="number" min="0" step="1" value="${Number(item.qty || item.quantity || 0)}" inputmode="numeric"><p class="quick-record-note">送出後會保留原紀錄、修正關聯與時間戳，並可由變更紀錄重建目前狀態。</p>${state.correctionNotice ? `<div class="dev-save-note">${escapeHtml(state.correctionNotice)}</div>` : ""}<div class="developer-actions"><button type="button" class="sheet-primary" data-action="commit-correction" data-event-id="${escapeHtml(item.id)}">新增修正紀錄</button><button type="button" class="sheet-secondary" data-action="close-sheet">取消</button></div>`, "correction");
  }

  function farmDetailSheet(farmId) {
    const farm = farmById(farmId);
    const active = farm.houses.flatMap((house) => house.flocks).filter((flock) => flock.state === "active");
    const identity = financeIdentityForOperationalFarm(farm.id);
    const financeButton = identity
      ? `<button type="button" class="sheet-secondary" data-action="open-finance-farm" data-farm-id="${escapeHtml(identity.id)}" data-testid="farm-finance-entry">查看財務身份</button>`
      : `<div class="readonly-note">目前沒有可對應的 Finance identity。</div>`;
    return sheetShell(escapeHtml(farm.name), `${escapeHtml(farm.breed || farm.subtitle || "")} · ${escapeHtml(farm.risk || "")}`, `<div class="detail-hero"><small>雞場</small><strong>${number(farmStock(farm))} 隻</strong><span>${active.length} 批進行中</span></div><div class="detail-block"><h3>雞舍</h3><div class="sheet-item-list">${farm.houses.map((house) => `<button type="button" class="sheet-item" data-action="open-house-detail" data-farm-id="${escapeHtml(farm.id)}" data-house-id="${escapeHtml(house.id)}"><span><strong>${escapeHtml(house.name)}</strong><span>在養隻數 ${number(houseStock(house))} · ${house.flocks.length} 個批次</span></span><span class="sheet-item-end">›</span></button>`).join("")}</div></div><div class="detail-block"><h3>Finance identity</h3><p>${identity?.status === "configured" ? "已連結 synthetic 財務資料。" : "尚未建立財務資料；不補造收入、分配或費用。"}</p>${financeButton}</div><button type="button" class="sheet-primary" data-action="set-farm-scope" data-farm-id="${escapeHtml(farm.id)}">切換到這個雞場</button>`, "farm-detail");
  }

  function houseDetailSheet(farmId, houseId) {
    const farm = farmById(farmId);
    const house = houseById(farm, houseId);
    return sheetShell(escapeHtml(house?.name || "雞舍詳細"), escapeHtml(farm.name), `<div class="detail-hero"><small>雞舍</small><strong>${number(house ? houseStock(house) : 0)} 隻</strong><span>${house?.flocks.length || 0} 個批次</span></div><div class="detail-block"><h3>批次</h3><div class="sheet-item-list">${(house?.flocks || []).map((flock) => `<button type="button" class="sheet-item" data-action="open-flock" data-flock-id="${escapeHtml(flock.id)}"><span><strong>${escapeHtml(flock.code)}</strong><span>${escapeHtml(flock.status)} · 本批在養 ${number(flock.stock)}</span></span><span class="sheet-item-end">›</span></button>`).join("") || `<div class="empty-tab"><strong>目前沒有批次</strong></div>`}</div></div><button type="button" class="sheet-primary" data-action="set-house-scope" data-farm-id="${escapeHtml(farm.id)}" data-house-id="${escapeHtml(house?.id || "")}">切換到這個雞舍</button>`, "house-detail");
  }

  function masterDataFarms() {
    return allProductionFarms().filter((farm) => farm.id !== "history");
  }

  function selectedMasterFarm() {
    const farms = masterDataFarms();
    const selected = farms.find((farm) => farm.id === state.masterDataFarmId);
    if (selected) return selected;
    const current = farms.find((farm) => farm.id === state.context.farmId);
    return current || farms[0] || null;
  }

  function selectedMasterHouse(farm = selectedMasterFarm()) {
    return farm?.houses?.find((house) => house.id === state.masterDataHouseId) || farm?.houses?.[0] || null;
  }

  function masterDataAuditEntries() {
    return (labOverlay().auditEntries || []).filter((entry) => ["Farm", "House", "Flock", "CaretakerAssignment", "FarmFinanceIdentity"].includes(entry.entityType));
  }

  function masterDataConfirmationSheet() {
    const confirmation = state.masterDataConfirmation;
    if (!confirmation) return masterDataManagementSheet();
    const summary = confirmation.summary.map(([label, value]) => `<div class="master-confirm-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong></div>`).join("");
    const confirmLabel = confirmation.kind === "caretaker" ? "確認指派" : "確認新增";
    return sheetShell("最後確認", "主檔操作 · 確認後才寫入", `<section class="master-auth-card" data-testid="master-final-confirmation"><div class="detail-hero"><small>請確認實際內容</small><strong>${escapeHtml(confirmation.title)}</strong><span>按下「${confirmLabel}」後，才會追加到 Lab runtime overlay 並留下 Audit。</span></div><div class="master-confirmation-summary">${summary}</div><div class="developer-actions"><button type="button" class="sheet-primary" data-action="confirm-master-operation" data-testid="master-final-confirmation-confirm">${confirmLabel}</button><button type="button" class="sheet-secondary" data-action="cancel-master-operation" data-testid="master-final-confirmation-cancel">取消，不寫入</button></div><div class="readonly-note">取消只會返回主檔表單，不會寫入主檔、Audit 或 outbox。</div></section>`, "master-data-confirmation");
  }

  function masterDataManagementSheet() {
    if (!state.masterDataAuthorized) {
      return sheetShell("主檔管理", "場務 · PREPROD LAB", `<section class="master-auth-card" data-testid="master-data-auth"><div class="detail-hero"><small>需要額外確認</small><strong>測試環境管理者驗證</strong><span>主檔建立只在公開 synthetic PREPROD LAB 的本機 runtime overlay 進行，不代表正式系統權限。</span></div><label class="master-check"><input id="master-admin-confirm" data-testid="master-admin-confirm" type="checkbox"><span>我確認目前操作位於 PREPROD LAB，並了解不會連線正式資料。</span></label>${state.masterDataError ? `<div class="master-error" role="alert">${escapeHtml(state.masterDataError)}</div>` : ""}<button type="button" class="sheet-primary" data-action="authorize-master-data" data-testid="authorize-master-data">完成測試環境管理者驗證</button><div class="readonly-note">LocalLabAdminAuthorizationAdapter 只驗證本次測試環境確認；不收集密碼、token 或其他秘密。</div></section>`, "master-data");
    }
    if (state.masterDataConfirmation) return masterDataConfirmationSheet();
    const farm = selectedMasterFarm();
    const house = selectedMasterHouse(farm);
    if (!farm) return sheetShell("主檔管理", "沒有可管理的雞場", `<div class="empty-tab"><strong>目前沒有可管理的雞場</strong><p>請先確認 Lab fixture。</p></div>`, "master-data");
    state.masterDataFarmId = farm.id;
    state.masterDataHouseId = house?.id || null;
    const farms = masterDataFarms();
    const houses = farm.houses || [];
    const flocks = house?.flocks || [];
    const assignments = (masterDataOverlay().caretakerAssignments || []).filter((assignment) => assignment.farmId === farm.id);
    const audits = masterDataAuditEntries().slice().reverse().slice(0, 8);
    return sheetShell("主檔管理", "場務 · 測試環境管理者驗證已完成", `<div class="master-authenticated" data-testid="master-data-authorized"><span class="status-chip good">已驗證 · PREPROD LAB</span><span>這些資料只寫入 runtime overlay；fixture 本身維持唯讀。</span></div>${state.masterDataNotice ? `<div class="dev-save-note" role="status">${escapeHtml(state.masterDataNotice)}</div>` : ""}${state.masterDataError ? `<div class="master-error" role="alert">${escapeHtml(state.masterDataError)}</div>` : ""}
      <section class="master-section"><div class="master-section-head"><div><h3>新增雞場</h3><p>建立後會自動產生一對一的財務身份，但不建立任何收入、分配、費用或歷史結算。</p></div><span class="scope-chip">${farms.length} 場</span></div><div class="master-form-grid"><label class="master-field"><span>雞場名稱（必填）</span><input id="master-farm-name" data-testid="master-farm-name" type="text" maxlength="80" placeholder="例如：北區測試場"></label><label class="master-field"><span>類型（選填）</span><input id="master-farm-type" type="text" maxlength="40" placeholder="例如：紅羽"></label><label class="master-field master-field-wide"><span>說明（選填）</span><input id="master-farm-description" type="text" maxlength="120" placeholder="例如：新建測試場"></label></div><button type="button" class="sheet-primary" data-action="create-farm" data-testid="create-farm">新增雞場</button></section>
      <section class="master-section"><div class="master-section-head"><div><h3>目前管理的雞場</h3><p>先選擇雞場，再建立雞舍與批次。</p></div></div><label class="master-field"><span>雞場</span><select id="master-farm-select" data-action="select-master-farm" data-testid="master-farm-select">${farms.map((candidate) => `<option value="${escapeHtml(candidate.id)}" ${candidate.id === farm.id ? "selected" : ""}>${escapeHtml(candidate.name)}</option>`).join("")}</select></label><div class="master-master-summary"><strong>${escapeHtml(farm.name)}</strong><span>${escapeHtml(farm.description || farm.subtitle || "尚未填寫說明")} · ${farm.houses.length} 舍 · ${farm.houses.flatMap((item) => item.flocks).length} 批 · ${farm.caretakers?.length || 0} 位照顧者</span></div></section>
      <section class="master-section"><div class="master-section-head"><div><h3>新增雞舍</h3><p>雞舍永遠隸屬目前選定雞場；不提供刪除或級聯刪除。</p></div><span class="scope-chip">${houses.length} 舍</span></div><div class="master-form-grid"><label class="master-field"><span>雞舍名稱（必填）</span><input id="master-house-name" data-testid="master-house-name" type="text" maxlength="80" placeholder="例如：第一舍"></label><label class="master-field"><span>代碼（必填）</span><input id="master-house-code" data-testid="master-house-code" type="text" maxlength="30" placeholder="例如：H1"></label></div><button type="button" class="sheet-primary" data-action="create-house" data-testid="create-house">新增雞舍</button>${houses.length ? `<label class="master-field"><span>目前雞舍</span><select id="master-house-select" data-action="select-master-house" data-testid="master-house-select">${houses.map((candidate) => `<option value="${escapeHtml(candidate.id)}" ${candidate.id === house?.id ? "selected" : ""}>${escapeHtml(candidate.name)} · ${escapeHtml(candidate.code)}</option>`).join("")}</select></label>` : `<div class="empty-tab master-inline-empty"><strong>尚未建立雞舍</strong><p>建立第一個雞舍後才能新增批次。</p></div>`}</section>
      <section class="master-section"><div class="master-section-head"><div><h3>新增批次</h3><p>批次隸屬目前雞舍；狀態只支援進行中或已出雞。公母數量是選填，若輸入必須加總等於初始入雞。</p></div><span class="scope-chip">${flocks.length} 批</span></div>${house ? `<div class="master-context-note">目前位置：${escapeHtml(farm.name)} · ${escapeHtml(house.name)}</div><div class="master-form-grid"><label class="master-field"><span>批次代碼（必填）</span><input id="master-flock-code" data-testid="master-flock-code" type="text" maxlength="80" placeholder="例如：2026-秋-01"></label><label class="master-field"><span>初始入雞（必填）</span><input id="master-flock-initial" data-testid="master-flock-initial" type="number" min="1" step="1" inputmode="numeric" placeholder="例如：1000"></label><label class="master-field"><span>入雛日期（必填）</span><input id="master-flock-chick-in" data-testid="master-flock-chick-in" type="date" value="2026-09-01"></label><label class="master-field"><span>預計出雞（必填）</span><input id="master-flock-ship" data-testid="master-flock-ship" type="date" value="2026-09-20"></label><label class="master-field"><span>狀態（必填）</span><select id="master-flock-state" data-testid="master-flock-state"><option value="active">進行中</option><option value="closed">已出雞</option></select></label><label class="master-field"><span>公（選填）</span><input id="master-flock-male" type="number" min="0" step="1" inputmode="numeric" placeholder="不填不推算"></label><label class="master-field"><span>母（選填）</span><input id="master-flock-female" type="number" min="0" step="1" inputmode="numeric" placeholder="不填不推算"></label></div><button type="button" class="sheet-primary" data-action="create-flock" data-testid="create-flock">新增批次</button><div class="master-list">${flocks.length ? flocks.map((candidate) => `<div class="master-list-row" data-testid="master-flock-row"><strong>${escapeHtml(candidate.code)}</strong><span>${escapeHtml(candidate.chickIn)} 入雛 · 預計 ${escapeHtml(candidate.ship)} 出雞 · 初始 ${number(candidate.initial)} 隻 · ${escapeHtml(candidate.status)}${Number.isInteger(candidate.male) && Number.isInteger(candidate.female) ? ` · 公 ${number(candidate.male)}／母 ${number(candidate.female)}` : " · 公母數未提供"}</span></div>`).join("") : `<div class="master-inline-empty"><strong>尚未建立批次</strong></div>`}</div>` : `<div class="empty-tab master-inline-empty"><strong>請先建立雞舍</strong><p>批次需要明確的雞舍 Context。</p></div>`}</section>
      <section class="master-section"><div class="master-section-head"><div><h3>指派照顧者</h3><p>這是 synthetic Lab 的照顧者指派，不建立 HR 或登入資料。</p></div><span class="scope-chip">${assignments.length} 筆新增</span></div><label class="master-field"><span>照顧者姓名（必填）</span><input id="master-caretaker-name" data-testid="master-caretaker-name" type="text" maxlength="80" placeholder="例如：測試照顧者甲"></label><button type="button" class="sheet-primary" data-action="assign-caretaker" data-testid="assign-caretaker">指派到目前雞場</button>${assignments.length ? `<div class="master-list">${assignments.map((assignment) => `<div class="master-list-row"><strong>${escapeHtml(assignment.caretakerName)}</strong><span>已指派 · ${escapeHtml(assignment.createdAt || "Lab")}</span></div>`).join("")}</div>` : ""}</section>
      <section class="master-section"><div class="master-section-head"><div><h3>主檔變更紀錄</h3><p>建立與指派都留下 Audit；歷史只能追加，沒有刪除入口。</p></div><span class="scope-chip">${masterDataAuditEntries().length} 筆</span></div><div class="master-list">${audits.length ? audits.map((entry) => `<div class="master-list-row"><strong>${escapeHtml(entry.entityType)} · ${escapeHtml(entry.operation === "assign" ? "指派" : "建立")}</strong><span>${escapeHtml(entry.entityId || "—")} · ${escapeHtml(entry.timestamp || "")}</span></div>`).join("") : `<div class="master-inline-empty"><strong>尚未有主檔變更</strong></div>`}</div></section>
      <div class="readonly-note">不可刪除、不可級聯、不可修改 fixture。新雞場的 Finance identity 會顯示「尚未建立財務資料」，不會顯示假的 0 結算。</div>`, "master-data");
  }

  function masterInputValue(id) {
    return String(document.getElementById(id)?.value || "").trim();
  }

  function masterDataErrorMessage(error) {
    const messages = {
      MASTER_DATA_FARM_NAME_REQUIRED: "請輸入雞場名稱。",
      MASTER_DATA_HOUSE_NAME_REQUIRED: "請輸入雞舍名稱。",
      MASTER_DATA_HOUSE_CODE_REQUIRED: "請輸入雞舍代碼。",
      MASTER_DATA_FLOCK_CODE_REQUIRED: "請輸入批次代碼。",
      MASTER_DATA_INITIAL_INTEGER_INVALID: "初始入雞必須是正整數。",
      MASTER_DATA_CHICK_IN_DATE_INVALID: "請輸入有效的入雛日期。",
      MASTER_DATA_PLANNED_SHIPMENT_DATE_INVALID: "請輸入有效的預計出雞日期。",
      MASTER_DATA_SHIPMENT_BEFORE_CHICK_IN: "預計出雞日期不能早於入雛日期。",
      MASTER_DATA_SEX_PAIR_REQUIRED: "公、母數量必須一起輸入，或一起留白。",
      MASTER_DATA_SEX_TOTAL_MISMATCH: "公母數量加總必須等於初始入雞。",
      MASTER_DATA_MALE_INTEGER_INVALID: "公數量必須是零或正整數。",
      MASTER_DATA_FEMALE_INTEGER_INVALID: "母數量必須是零或正整數。",
      MASTER_DATA_FLOCK_STATE_INVALID: "批次狀態只支援進行中或已出雞。",
      MASTER_DATA_FLOCK_STATUS_INVALID: "批次狀態與顯示名稱不一致。",
      LAB_MASTER_DATA_RELATIONSHIP_INVALID: "主檔關係驗證失敗，尚未寫入任何資料。",
    };
    return messages[error?.message] || "主檔資料格式不完整，請檢查後再試。";
  }

  function showMasterDataError(message) {
    state.masterDataError = message;
    state.masterDataNotice = "";
    return openSheet({ kind: "master-data" });
  }

  function queueMasterDataOperation(operation) {
    LAB_STORE.queueOperation({
      clientOperationId: window.JinjiDomain.clientOperationId("master-data"),
      source: "master_data",
      ...operation,
    });
    if (LAB_STORE.snapshot().mode === "ONLINE") LAB_STORE.sync({ backendAvailable: true });
  }

  function createMasterFarm() {
    const name = masterInputValue("master-farm-name");
    const type = masterInputValue("master-farm-type");
    const description = masterInputValue("master-farm-description");
    if (!name) return showMasterDataError("請輸入雞場名稱。");
    if (allProductionFarms().some((farm) => farm.name === name)) return showMasterDataError("這個雞場名稱已存在，請使用不同名稱。");
    try {
      const farm = window.JinjiDomain.createFarm({ id: window.JinjiDomain.id("lab-farm"), name, type, description });
      const identity = window.JinjiDomain.createFarmFinanceIdentity({ id: `lab-finance-identity-${farm.id}`, operationalFarmId: farm.id });
      const farmAudit = window.JinjiDomain.createAuditEntry({ entityType: "Farm", entityId: farm.id, operation: "create", source: "master_data", metadata: { environment: "PREPROD LAB", financeIdentityId: identity.id } });
      const identityAudit = window.JinjiDomain.createAuditEntry({ entityType: "FarmFinanceIdentity", entityId: identity.id, operation: "create", source: "master_data", metadata: { operationalFarmId: farm.id, dataState: identity.dataState } });
      state.masterDataConfirmation = {
        kind: "farm",
        title: "新增雞場",
        summary: [["雞場名稱", farm.name], ["類型", farm.type || "—"], ["說明", farm.description || "—"], ["Finance identity", identity.id], ["寫入邊界", "Lab runtime overlay"]],
        entities: [{ entityType: "Farm", entity: farm }, { entityType: "FarmFinanceIdentity", entity: identity }],
        audits: [farmAudit, identityAudit],
        operation: { type: "create_farm", farmId: farm.id, financeIdentityId: identity.id },
        nextFarmId: farm.id,
        nextHouseId: null,
        notice: `已新增雞場：${farm.name}；Finance identity 已建立，但尚無財務資料。`,
      };
      state.masterDataError = "";
      return openSheet({ kind: "master-data-confirmation" });
    } catch (error) {
      return showMasterDataError(masterDataErrorMessage(error));
    }
  }

  function createMasterHouse() {
    const farm = selectedMasterFarm();
    const name = masterInputValue("master-house-name");
    const code = masterInputValue("master-house-code");
    if (!farm) return showMasterDataError("請先選擇可管理的雞場。");
    if (farm.houses.some((house) => house.name === name || house.code === code)) return showMasterDataError("目前雞場已有相同的雞舍名稱或代碼。");
    try {
      const house = window.JinjiDomain.createHouse({ id: window.JinjiDomain.id("lab-house"), farmId: farm.id, name, code });
      const audit = window.JinjiDomain.createAuditEntry({ entityType: "House", entityId: house.id, operation: "create", source: "master_data", metadata: { farmId: farm.id } });
      state.masterDataConfirmation = {
        kind: "house",
        title: "新增雞舍",
        summary: [["所屬雞場", farm.name], ["雞舍名稱", house.name], ["雞舍代碼", house.code], ["寫入邊界", "Lab runtime overlay"]],
        entities: [{ entityType: "House", entity: house }],
        audits: [audit],
        operation: { type: "create_house", farmId: farm.id, houseId: house.id },
        nextFarmId: farm.id,
        nextHouseId: house.id,
        notice: `已新增雞舍：${farm.name} · ${house.name}。`,
      };
      state.masterDataError = "";
      return openSheet({ kind: "master-data-confirmation" });
    } catch (error) {
      return showMasterDataError(masterDataErrorMessage(error));
    }
  }

  function createMasterFlock() {
    const farm = selectedMasterFarm();
    const house = selectedMasterHouse(farm);
    const code = masterInputValue("master-flock-code");
    const initial = masterInputValue("master-flock-initial");
    const chickIn = masterInputValue("master-flock-chick-in");
    const ship = masterInputValue("master-flock-ship");
    const flockState = masterInputValue("master-flock-state") || "active";
    const maleRaw = masterInputValue("master-flock-male");
    const femaleRaw = masterInputValue("master-flock-female");
    if (!farm || !house) return showMasterDataError("請先選擇雞場與雞舍。");
    if (house.flocks.some((flock) => flock.code === code)) return showMasterDataError("目前雞舍已有相同的批次代碼。");
    try {
      const flock = window.JinjiDomain.createFlock({
        id: window.JinjiDomain.id("lab-flock"),
        houseId: house.id,
        code,
        initial,
        chickIn,
        ship,
        state: flockState,
        status: flockState === "closed" ? "已出雞" : "進行中",
        ...(maleRaw ? { male: maleRaw } : {}),
        ...(femaleRaw ? { female: femaleRaw } : {}),
      });
      const audit = window.JinjiDomain.createAuditEntry({ entityType: "Flock", entityId: flock.id, operation: "create", source: "master_data", metadata: { farmId: farm.id, houseId: house.id } });
      state.masterDataConfirmation = {
        kind: "flock",
        title: "新增批次",
        summary: [["所屬位置", `${farm.name} · ${house.name}`], ["批次代碼", flock.code], ["狀態", flock.status], ["初始入雞", `${number(flock.initial)} 隻`], ["入雛日期", flock.chickIn], ["預計出雞", flock.ship], ["公／母", Number.isInteger(flock.male) && Number.isInteger(flock.female) ? `${number(flock.male)}／${number(flock.female)}` : "未提供"]],
        entities: [{ entityType: "Flock", entity: flock }],
        audits: [audit],
        operation: { type: "create_flock", farmId: farm.id, houseId: house.id, flockId: flock.id },
        nextFarmId: farm.id,
        nextHouseId: house.id,
        notice: `已新增批次：${flock.code}；入雛、磅雞與預計出雞會同步進入月曆。`,
      };
      state.masterDataError = "";
      return openSheet({ kind: "master-data-confirmation" });
    } catch (error) {
      return showMasterDataError(masterDataErrorMessage(error));
    }
  }

  function assignMasterCaretaker() {
    const farm = selectedMasterFarm();
    const caretakerName = masterInputValue("master-caretaker-name");
    if (!farm) return showMasterDataError("請先選擇可管理的雞場。");
    if (farm.caretakers?.includes(caretakerName)) return showMasterDataError("這位照顧者已指派到目前雞場。");
    try {
      const assignment = window.JinjiDomain.createCaretakerAssignment({ id: window.JinjiDomain.id("lab-caretaker-assignment"), farmId: farm.id, caretakerName });
      const audit = window.JinjiDomain.createAuditEntry({ entityType: "CaretakerAssignment", entityId: assignment.id, operation: "assign", source: "master_data", metadata: { farmId: farm.id, caretakerId: assignment.caretakerId } });
      state.masterDataConfirmation = {
        kind: "caretaker",
        title: "指派照顧者",
        summary: [["雞場", farm.name], ["照顧者", assignment.caretakerName], ["指派範圍", "目前雞場"], ["寫入邊界", "Lab runtime overlay"]],
        entities: [{ entityType: "CaretakerAssignment", entity: assignment }],
        audits: [audit],
        operation: { type: "assign_caretaker", farmId: farm.id, caretakerAssignmentId: assignment.id },
        nextFarmId: farm.id,
        nextHouseId: state.masterDataHouseId,
        notice: `已指派照顧者：${assignment.caretakerName} → ${farm.name}。`,
      };
      state.masterDataError = "";
      return openSheet({ kind: "master-data-confirmation" });
    } catch (error) {
      return showMasterDataError(masterDataErrorMessage(error));
    }
  }

  function commitMasterDataConfirmation() {
    const confirmation = state.masterDataConfirmation;
    if (!confirmation) return openSheet({ kind: "master-data" });
    try {
      LAB_STORE.appendMasterDataBatch(confirmation.entities, confirmation.audits);
      queueMasterDataOperation(confirmation.operation);
      state.masterDataFarmId = confirmation.nextFarmId;
      state.masterDataHouseId = confirmation.nextHouseId;
      state.masterDataError = "";
      state.masterDataNotice = confirmation.notice;
      state.masterDataConfirmation = null;
      return openSheet({ kind: "master-data" });
    } catch (error) {
      state.masterDataConfirmation = null;
      return showMasterDataError(masterDataErrorMessage(error));
    }
  }

  function writableFarms() {
    return allProductionFarms().filter((farm) => farm.id !== "history" && farmStock(farm) > 0);
  }

  function quickActionsSheet() {
    const isGlobal = state.context.farmId === "all";
    const recordArea = isGlobal
      ? `<div class="quick-direct"><div class="quick-direct-title"><strong>快速記錄到雞場</strong><span>直接選雞場後立即開啟記錄，不需回主頁切換。</span></div><div class="quick-farm-grid">${writableFarms().map((farm) => `<button type="button" class="quick-farm" data-action="start-quick-record-farm" data-farm-id="${escapeHtml(farm.id)}"><strong>${escapeHtml(farm.name)}</strong><span>在養 ${number(farm.stock)} 隻</span></button>`).join("")}</div></div>`
      : `<button type="button" class="option-row" data-action="open-quick-record"><span><strong>＋ 快速記錄</strong><span>用目前雞場、雞舍與批次準備一筆紀錄</span></span><span class="option-check">${icon("arrow")}</span></button>`;
    return sheetShell("快速行動", htmlContextLabel(), `<div class="option-list">${recordArea}<button type="button" class="option-row" data-action="go-ai"><span><strong>✦ 問 AI</strong><span>${simulatedAiAvailable() ? "帶入目前工作範圍；AI 維持唯讀" : "AI 暫不可用；點入查看降級說明"}</span></span><span class="option-check">${icon("arrow")}</span></button></div>`, "quick-actions");
  }

  function quickRecordSheet() {
    const context = currentContext();
    const targetName = [context.farm.name, context.house?.name, context.flock?.code].filter(Boolean).join("・");
    const quickRecordTitle = `${escapeHtml(targetName)}＋快速記錄`;
    if (state.context.farmId === "all") return sheetShell(quickRecordTitle, "全部在養為唯讀", `<div class="empty-tab"><strong>請先選一個雞場</strong><p>選好後會自動回到快速記錄，不需要重新開啟。</p></div><button type="button" class="sheet-primary" data-action="open-context-for-quick-record">選擇雞場</button>`, "quick-record");
    return sheetShell(quickRecordTitle, `目前記錄位置：${htmlContextLabel()}`, `<label class="quick-record-label" for="quick-record-input">要記什麼？</label><textarea id="quick-record-input" class="quick-record-input" rows="4" placeholder="例如：死亡5，咳嗽，臭腳">${escapeHtml(state.quickRecordDraft)}</textarea><p class="quick-record-note">Lab Write 只寫入此瀏覽器的 local overlay／IndexedDB，不連正式後端；輸入會先經過安全解析與人工確認。</p><button type="button" class="sheet-primary" data-action="preview-quick-record">檢查並預覽</button>`, "quick-record");
  }

  function quickRecordPreviewSheet() {
    const parsed = window.JinjiDomain.parseQuickRecord(state.quickRecordDraft);
    if (parsed.status === "event") {
      const event = parsed.event;
      return sheetShell("紀錄預覽", htmlContextLabel(), `<div class="detail-hero"><small>可寫入 Lab</small><strong>${eventLabel(event.type)} ${number(event.quantity)} ${escapeHtml(event.unit)}</strong><span>${event.note ? `備註：${escapeHtml(event.note)}` : "已辨識類型與數量；這筆會加入目前雞場的事件時間軸。"}</span></div><div class="detail-block"><h3>明確 Context</h3><p>${htmlContextLabel()}</p></div><div class="readonly-note">確認後只建立一筆 OperationalEvent，並同步 Today、紀錄、月曆、圖表、趨勢與變更紀錄。</div><div class="developer-actions"><button type="button" class="sheet-primary" data-action="commit-lab-event">寫入 Lab 紀錄</button><button type="button" class="sheet-secondary" data-action="back-quick-record">返回修改</button></div>`, "quick-record-preview");
    }
    return sheetShell("紀錄預覽", htmlContextLabel(), `<div class="detail-hero"><small>待人工確認</small><strong>${escapeHtml(state.quickRecordDraft || "（沒有內容）")}</strong><span>${escapeHtml(parsed.message)}</span></div><div class="readonly-note">無法安全辨識時不建立事件；可把這筆保留到 Pending Review，之後由人工補齊。</div><div class="developer-actions"><button type="button" class="sheet-primary" data-action="save-pending-review">送人工確認</button><button type="button" class="sheet-secondary" data-action="back-quick-record">返回修改</button></div>`, "quick-record-preview");
  }

  function labEventFromDraft() {
    const parsed = window.JinjiDomain.parseQuickRecord(state.quickRecordDraft);
    if (parsed.status !== "event") return { parsed, event: null };
    const event = window.JinjiDomain.createOperationalEvent({
      ...parsed.event,
      date: PLUS_AS_OF,
      time: "09:30",
      farmId: state.context.farmId,
      houseId: state.context.houseId,
      flockId: state.context.flockId,
    });
    return { parsed, event };
  }

  function commitLabEvent() {
    if (state.context.farmId === "all") return openContextPicker("quick-record");
    const { parsed, event } = labEventFromDraft();
    if (parsed.status !== "event" || !event) return openSheet({ kind: "quick-record-preview" });
    const audit = window.JinjiDomain.createAuditEntry({ entityId: event.id, operation: "create", source: "quick_record", newEventIds: [event.id] });
    LAB_STORE.appendEvent(event, audit);
    LAB_STORE.queueOperation({ clientOperationId: event.clientOperationId, type: "create_event", eventId: event.id, source: "quick_record" });
    if (LAB_STORE.snapshot().mode === "ONLINE") LAB_STORE.sync({ backendAvailable: true });
    state.quickRecordDraft = "";
    state.quickRecordNotice = `已寫入 Lab：${eventLabel(event.type)} ${number(event.quantity)} ${event.unit} · ${contextLabel()}`;
    state.calendarYear = Number(PLUS_AS_OF.slice(0, 4));
    state.calendarMonth = Number(PLUS_AS_OF.slice(5, 7));
    state.selectedCalendarDate = PLUS_AS_OF;
    state.sheet = null;
    render();
  }

  function commitCorrection(eventId) {
    const original = effectiveLabEvents().find((event) => event.id === eventId);
    const nextQuantity = Number(document.getElementById("correction-qty")?.value);
    if (!original || !Number.isFinite(nextQuantity) || nextQuantity < 0) {
      state.correctionNotice = "請輸入有效的零或正數。";
      return openSheet({ kind: "correction", id: eventId });
    }
    const ledger = window.JinjiDomain.createCorrectionLedger(original, {
      operation: "replacement",
      replacements: [{ quantity: nextQuantity, qty: nextQuantity, value: nextQuantity }],
      source: "lab_correction",
    });
    LAB_STORE.appendEvents([ledger.reversal, ...ledger.replacements], [ledger.audit]);
    LAB_STORE.queueOperation({ clientOperationId: ledger.audit.id, type: "correct_event", eventId: original.id, replacementEventIds: ledger.audit.newEventIds, source: "lab_correction" });
    if (LAB_STORE.snapshot().mode === "ONLINE") LAB_STORE.sync({ backendAvailable: true });
    state.correctionNotice = "";
    state.quickRecordNotice = `已新增修正紀錄：${eventLabel(original.type)} ${number(nextQuantity)} ${original.unit}；原紀錄仍保留於變更紀錄。`;
    state.sheet = null;
    render();
  }

  function savePendingReviewFromDraft() {
    const { parsed } = labEventFromDraft();
    const review = {
      id: window.JinjiDomain.id("pending"),
      title: "快速記錄待人工確認",
      detail: parsed.message,
      kind: "快速記錄",
      farmId: state.context.farmId,
      houseId: state.context.houseId,
      flockId: state.context.flockId,
      rawText: String(state.quickRecordDraft || "").slice(0, 240),
      source: "quick_record",
    };
    LAB_STORE.appendPending(review);
    LAB_STORE.queueOperation({ clientOperationId: window.JinjiDomain.clientOperationId("pending"), type: "create_pending_review", pendingId: review.id, source: "quick_record" });
    state.quickRecordDraft = "";
    state.quickRecordNotice = "這筆內容已保留到 Pending Review，沒有建立不確定的正式事件。";
    state.sheet = null;
    render();
  }

  function insightsSheet() {
    const feedCount = scopedEvents("feed").length;
    const waterCount = scopedEvents("water").length;
    const activeAbnormal = scopedAbnormalities({ activeOnly: true }).length;
    return sheetShell("洞察", htmlContextLabel(), `<div class="sheet-item-list"><button type="button" class="sheet-item" data-action="open-insight-detail" data-insight-key="stock"><span><strong>目前在養與批次</strong><span>${number(contextStock())} 隻 · ${scopedFlocks().length} 批進行中</span></span><span class="sheet-item-end">›</span></button><button type="button" class="sheet-item" data-action="open-sheet" data-sheet-kind="mortality"><span><strong>今日死亡</strong><span>${number(mortalityValue())} 隻</span></span><span class="sheet-item-end">›</span></button><button type="button" class="sheet-item" data-action="open-sheet" data-sheet-kind="cull"><span><strong>今日淘汰</strong><span>${number(cullValue())} 隻</span></span><span class="sheet-item-end">›</span></button><button type="button" class="sheet-item" data-action="open-sheet" data-sheet-kind="abnormal"><span><strong>異常追蹤</strong><span>${activeAbnormal} 筆追蹤中</span></span><span class="sheet-item-end">›</span></button><button type="button" class="sheet-item" data-action="open-insight-detail" data-insight-key="feed"><span><strong>飼料紀錄</strong><span>${feedCount} 筆</span></span><span class="sheet-item-end">›</span></button><button type="button" class="sheet-item" data-action="open-insight-detail" data-insight-key="water"><span><strong>飲水紀錄</strong><span>${waterCount} 筆</span></span><span class="sheet-item-end">›</span></button></div>`, "insights");
  }

  function insightDetailSheet(key) {
    if (key === "stock") return sheetShell("目前在養與批次", htmlContextLabel(), `<div class="detail-hero"><small>目前在養</small><strong>${number(contextStock())} 隻</strong><span>${scopedFlocks().length} 批進行中</span></div><div class="sheet-item-list">${scopedFlocks().map((flock) => `<button type="button" class="sheet-item" data-action="open-flock" data-flock-id="${escapeHtml(flock.id)}"><span><strong>${escapeHtml(flock.code)}</strong><span>${escapeHtml(flock.farm)} · ${escapeHtml(flock.house)} · ${number(flock.stock)} 隻</span></span><span class="sheet-item-end">›</span></button>`).join("") || `<div class="empty-tab"><strong>沒有進行中批次</strong></div>`}</div>`, "insight-detail");
    const type = key === "feed" ? "feed" : "water";
    const rows = scopedEvents(type);
    return sheetShell(key === "feed" ? "飼料紀錄" : "飲水紀錄", htmlContextLabel(), `<div class="sheet-item-list">${rows.map((item) => `<button type="button" class="sheet-item" data-action="open-event" data-event-id="${escapeHtml(item.id)}"><span><strong>${eventLabel(item.type)} ${number(item.qty)} ${escapeHtml(item.unit)}</strong><span>${escapeHtml(contextName(item))} · ${escapeHtml(item.date)} ${escapeHtml(item.time)}</span></span><span class="sheet-item-end">›</span></button>`).join("") || `<div class="empty-tab"><strong>目前沒有相關紀錄</strong></div>`}</div>`, "insight-detail");
  }

  function systemSheet() {
    const farms = allProductionFarms();
    const houses = farms.flatMap((farm) => farm.houses);
    return sheetShell("系統", "測試版資訊", `<div class="sheet-item-list"><button type="button" class="sheet-item" data-action="open-system-detail" data-system-key="farms"><span><strong>雞場</strong><span>${farms.length} 場</span></span><span class="sheet-item-end">›</span></button><button type="button" class="sheet-item" data-action="open-system-detail" data-system-key="houses"><span><strong>雞舍</strong><span>${houses.length} 舍</span></span><span class="sheet-item-end">›</span></button><button type="button" class="sheet-item" data-action="open-system-detail" data-system-key="flocks"><span><strong>批次</strong><span>${allFlocks().length} 批</span></span><span class="sheet-item-end">›</span></button><div class="sheet-item static"><span><strong>正式服務</strong><span>這個公開測試版沒有連線 LINE、資料庫或正式後端</span></span></div></div>`, "system");
  }

  function systemDetailSheet(key) {
    const farms = allProductionFarms();
    if (key === "farms") return sheetShell("雞場清單", `${farms.length} 場`, `<div class="sheet-item-list">${farms.map((farm) => `<button type="button" class="sheet-item" data-action="open-farm-detail" data-farm-id="${escapeHtml(farm.id)}"><span><strong>${escapeHtml(farm.name)}</strong><span>在養隻數 ${number(farm.stock)} · ${escapeHtml(farm.risk)}</span></span><span class="sheet-item-end">›</span></button>`).join("")}</div>`, "system-detail");
    if (key === "houses") return sheetShell("雞舍清單", `${farms.flatMap((farm) => farm.houses).length} 舍`, `<div class="sheet-item-list">${farms.flatMap((farm) => farm.houses.map((house) => `<button type="button" class="sheet-item" data-action="open-house-detail" data-farm-id="${escapeHtml(farm.id)}" data-house-id="${escapeHtml(house.id)}"><span><strong>${escapeHtml(farm.name)} · ${escapeHtml(house.name)}</strong><span>在養隻數 ${number(houseStock(house))} · ${house.flocks.length} 個批次</span></span><span class="sheet-item-end">›</span></button>`)).join("")}</div>`, "system-detail");
    return sheetShell("批次清單", `${allFlocks().length} 批`, `<div class="sheet-item-list">${allFlocks().map((flock) => `<button type="button" class="sheet-item" data-action="open-flock" data-flock-id="${escapeHtml(flock.id)}"><span><strong>${escapeHtml(flock.code)}</strong><span>${escapeHtml(flock.farm)} · ${escapeHtml(flock.house)} · ${escapeHtml(flock.status)}</span></span><span class="sheet-item-end">›</span></button>`).join("")}</div>`, "system-detail");
  }

  function auditSheet() {
    const entries = labOverlay().auditEntries || [];
    if (!entries.length) return sheetShell("變更紀錄", "修改、取消與操作歷程", `<div class="empty-tab"><strong>目前沒有新增變更紀錄</strong><p>這個測試版尚未新增 Lab 事件。正式版仍應以追加紀錄方式保留修改與取消歷程。</p></div>`, "audit");
    return sheetShell("變更紀錄", `本機追加 ${entries.length} 筆`, `<div class="sheet-item-list">${entries.slice().reverse().map((entry) => { const old = entry.oldEvent; const oldLabel = old ? `${eventLabel(old.type)} ${number(old.quantity ?? old.qty)} ${old.unit || ""}` : entry.entityType === "CaretakerAssignment" ? "照顧者指派" : entry.entityType === "FarmFinanceIdentity" ? "Finance identity 建立" : "主檔建立"; const operationLabel = entry.operation === "replacement" ? "修正紀錄" : entry.operation === "assign" ? "指派" : entry.operation === "create" ? "建立" : entry.operation; return `<div class="sheet-item static"><span><strong>${escapeHtml(operationLabel)} · ${escapeHtml(oldLabel)}</strong><span>${escapeHtml(entry.entityType || "紀錄")} · entity ${escapeHtml(entry.entityId || "—")} · ${escapeHtml(entry.source || "lab")}</span></span><span class="dev-time">${escapeHtml(String(entry.timestamp || "").slice(11, 19))}</span></div>`; }).join("")}</div><div class="readonly-note">變更紀錄只保留事件與主檔治理 metadata；原資料不被覆寫或刪除。</div>`, "audit");
  }

  function settingsSheet() {
    const t = trendThresholds();
    return sheetShell("設定", "操作、提醒與管理設定", `<div class="sheet-item-list"><button type="button" class="sheet-item" data-action="open-settings-detail" data-settings-key="trend"><span><strong>趨勢提醒</strong><span>死亡、淘汰、飼料、飲水的自我歷史比較門檻</span></span><span class="sheet-item-end">›</span></button><button type="button" class="sheet-item" data-action="open-settings-detail" data-settings-key="master"><span><strong>雞場與雞舍管理</strong><span>正式版需管理者驗證</span></span><span class="sheet-item-end">›</span></button><button type="button" class="sheet-item" data-action="open-settings-detail" data-settings-key="line"><span><strong>LINE 群組</strong><span>群組與通知設定</span></span><span class="sheet-item-end">›</span></button><button type="button" class="sheet-item" data-action="open-settings-detail" data-settings-key="display"><span><strong>顯示與操作</strong><span>介面偏好與操作說明</span></span><span class="sheet-item-end">›</span></button></div><div class="readonly-note">目前趨勢提醒基線：前 ${t.baselineDays} 日；設定只存在此瀏覽器測試環境。</div>`, "settings");
  }


  function settingsDetailSheet(key) {
    if (key === "trend") {
      const t = trendThresholds();
      const field = (name, label, value, suffix, effect, example, step="1") => `<label class="threshold-field"><span class="threshold-field-copy"><strong>${label}</strong><span class="threshold-effect"><b>效果：</b>${effect}</span><span class="threshold-example"><b>範例：</b>${example}</span></span><span class="threshold-control"><input type="number" inputmode="decimal" min="0" step="${step}" value="${value}" data-threshold-key="${name}" aria-label="${label}"><em>${suffix}</em></span></label>`;
      return sheetShell("趨勢提醒", "每個門檻都說明作用與範例；只做目前範圍的自我歷史比較", `<div class="threshold-settings">
        <section><h3>比較基線</h3><p class="threshold-section-note">先決定「拿多少近期資料當正常參考」，再判斷今天是否偏離。</p>
          ${field("baselineDays","比較前幾日",t.baselineDays,"日","決定每一天要回頭看幾個日曆日，並用其中有紀錄的數值中位數當近期基線。天數少會較敏感；天數多會較穩定。",`目前 ${t.baselineDays} 日：判斷 8/31 時，會查看 8/28～8/30 的近期紀錄。`)}
          ${field("minBaselinePoints","至少需要幾個有效資料點",t.minBaselinePoints,"點","限制至少要有多少個真的有紀錄的資料點才允許判定，避免資料太少就亂發警告。",`目前 ${t.minBaselinePoints} 點：若前 ${t.baselineDays} 日只有 ${Math.max(0,t.minBaselinePoints-1)} 個有效資料點，系統會顯示「資料不足」，不判定異常。`)}
        </section>
        <section><h3>死亡</h3><p class="threshold-section-note">死亡提醒必須「最低數量＋高於基線隻數＋基線倍數」三個條件同時成立，避免單一條件太敏感。</p>
          ${field("mortalityMin","單日最低數量",t.mortalityMin,"隻","先設定今天至少死亡多少隻，才進一步檢查是否相對近期基線異常。",`設 ${t.mortalityMin} 隻：今日只有 ${Math.max(0,t.mortalityMin-1)} 隻時，即使相對倍數很高，也不觸發死亡趨勢提醒。`)}
          ${field("mortalityDelta","至少高於基線",t.mortalityDelta,"隻","要求今天的死亡數必須比近期基線中位數至少多這麼多隻。數值越大，越不容易因小幅波動提醒。",`設 ${t.mortalityDelta} 隻：若近期基線是 2 隻，今日至少要到 ${2+t.mortalityDelta} 隻才通過這個條件。`)}
          ${field("mortalityRatio","至少達基線倍數",t.mortalityRatio,"倍","要求今天的死亡數至少達近期基線的指定倍數，用來防止高基線時只增加少量也被判異常。",`設 ${t.mortalityRatio} 倍：若近期基線是 2 隻，今日至少要到 ${Math.ceil(2*t.mortalityRatio)} 隻才通過倍數條件。`,"0.1")}
        </section>
        <section><h3>淘汰</h3><p class="threshold-section-note">淘汰使用「最低數量＋高於基線隻數」兩道門檻。</p>
          ${field("cullMin","單日最低數量",t.cullMin,"隻","今天淘汰數至少達到這個數量，才會進一步比較近期基線。",`設 ${t.cullMin} 隻：今日低於 ${t.cullMin} 隻時不觸發淘汰增加提醒。`)}
          ${field("cullDelta","至少高於基線",t.cullDelta,"隻","要求今天淘汰數比近期基線中位數至少多指定隻數。",`設 ${t.cullDelta} 隻：若近期基線是 1 隻，今日至少要到 ${1+t.cullDelta} 隻才通過這個條件。`)}
        </section>
        <section><h3>飼料／飲水</h3><p class="threshold-section-note">百分比是相對同一工作範圍近期「有紀錄日」的中位數比較；無紀錄日不當成 0。</p>
          ${field("feedDropPct","飼料下降提醒",t.feedDropPct,"%","當日飼料量低於近期基線指定百分比以上時提醒。百分比越小越敏感。",`設 ${t.feedDropPct}%：若近期基線是 200 kg，低於 ${(200*(1-t.feedDropPct/100)).toFixed(0)} kg 才會觸發提醒。`)}
          ${field("waterDropPct","飲水下降提醒",t.waterDropPct,"%","當日飲水量較近期基線下降超過指定百分比時提醒，用來協助發現水線、設備或採食飲水變化。",`設 ${t.waterDropPct}%：若近期基線是 1,800 L，低於 ${(1800*(1-t.waterDropPct/100)).toFixed(0)} L 才會觸發下降提醒。`)}
          ${field("waterRisePct","飲水上升提醒",t.waterRisePct,"%","當日飲水量較近期基線上升超過指定百分比時提醒，可協助核對高溫、日齡變化或漏水。",`設 ${t.waterRisePct}%：若近期基線是 1,800 L，高於 ${(1800*(1+t.waterRisePct/100)).toFixed(0)} L 才會觸發上升提醒。`)}
        </section>
      </div><div class="threshold-safety"><strong>這些是資料趨勢門檻，不是獸醫警戒值。</strong><span>只比較同一工作範圍的近期紀錄；資料不足就不判定。修改後會影響「紀錄 → 趨勢圖」的提醒結果。</span></div>${state.settingsNotice ? `<div class="dev-save-note">${escapeHtml(state.settingsNotice)}</div>` : ""}<div class="developer-actions"><button type="button" class="sheet-primary" data-action="save-trend-thresholds">儲存本機設定</button><button type="button" class="sheet-secondary" data-action="reset-trend-thresholds">恢復預設值</button></div>`, "settings-detail");
    }
    const details = {
      master: ["雞場與雞舍管理", "正式版的新增、停用與指派需先通過管理者驗證；本測試版維持唯讀，不提供假寫入。"],
      line: ["LINE 群組", "正式版可管理群組與通知；此測試版沒有連線 LINE，因此只保留資訊架構入口。"],
      display: ["顯示與操作", "桌面版採左側導覽、大字體與寬螢幕工作台；移動版維持底部導覽與觸控優先操作。"],
    };
    const [title, copy] = details[key] || details.display;
    return sheetShell(title, "測試版設定說明", `<div class="detail-block"><h3>目前狀態</h3><p>${copy}</p></div><div class="readonly-note">沒有可安全模擬的正式資料時，不建立假的設定結果。</div>`, "settings-detail");
  }


  function financeFarmSheet(farmId) {
    const runtimeIdentity = runtimeFinanceIdentityById(farmId);
    if (runtimeIdentity) {
      const operationalFarm = farmById(runtimeIdentity.operationalFarmId);
      return sheetShell(`${escapeHtml(operationalFarm?.name || runtimeIdentity.operationalFarmId)} · Finance`, "場級 Finance identity", `<div class="detail-hero"><small>尚未建立財務資料</small><strong>未配置</strong><span>這個身份只用來連結營運雞場，不代表有收入、分配、費用或歷史結算。</span></div><div class="finance-identity-card" data-testid="finance-identity"><strong>Finance identity</strong><span>${escapeHtml(runtimeIdentity.id)}</span><span>營運雞場：${escapeHtml(operationalFarm?.name || runtimeIdentity.operationalFarmId)} · operationalFarmId=${escapeHtml(runtimeIdentity.operationalFarmId)}</span></div><div class="readonly-note">新建雞場的財務資料尚未配置。FinanceRepository 的 synthetic fixture 與既有公式沒有被新增空白資料改寫。</div>`, "finance-farm");
    }
    const farm = FINANCE_REPO.getFarm(farmId);
    if (!farm) return sheetShell("場級財務詳細", "找不到資料", `<div class="empty-tab"><strong>目前範圍沒有這個模擬場</strong></div>`, "finance-farm");
    const summary = FINANCE_REPO.getSummary({ farmId });
    const distributions = FINANCE_REPO.listDistributions({ farmId });
    const operationalFarm = operationalFarmForFinanceId(farmId);
    return sheetShell(`${escapeHtml(farm.name)} · 財務`, "場級財務詳細", `<div class="detail-list"><div class="finance-identity-card" data-testid="finance-identity"><strong>Finance ↔ 營運身份</strong><span>Finance Farm ID：${escapeHtml(farmId)}</span><span>營運雞場：${escapeHtml(operationalFarm?.name || "—")} · operationalFarmId=${escapeHtml(operationalFarm?.id || "—")}</span></div><div class="detail-block"><h3>歷史總盈虧</h3><p>${money(farm.grossProfitLoss)}</p></div><div class="detail-block"><h3>已配置盈虧</h3><p>${money(farm.allocatedProfitLoss)}</p></div><div class="detail-block"><h3>費用</h3><p>${money(farm.expense)}</p></div><div class="detail-block"><h3>投資人淨收入</h3><p>${money(farm.netIncome)}</p></div><div class="detail-block"><h3>場級股權</h3><p>${(Number(farm.equityFraction) * 100).toFixed(1)}%</p></div><div class="detail-block"><h3>投資人／股權</h3><div class="sheet-item-list">${summary.investors.map((investor) => `<button type="button" class="sheet-item" data-action="open-investor-detail" data-investor-id="${escapeHtml(investor.id)}"><span><strong>${escapeHtml(investor.name)}</strong><span>${investor.farms.find((row) => row.farmId === farmId)?.share.toFixed(1) || "0.0"}% · 配置合計 ${money(investor.farms.find((row) => row.farmId === farmId)?.allocationTotal || 0)}</span></span><span class="sheet-item-end">查看 ›</span></button>`).join("") || `<div class="empty-tab">沒有股權資料。</div>`}</div></div><div class="detail-block"><h3>歷史分配</h3><div class="sheet-item-list">${distributions.map((distribution) => `<button type="button" class="sheet-item" data-action="open-distribution-detail" data-distribution-id="${escapeHtml(distribution.id)}"><span><strong>${escapeHtml(distribution.distributionDate)}</strong><span>投資人淨收入 ${money(distribution.netIncome)}</span></span><span class="sheet-item-end">查看 ›</span></button>`).join("") || `<div class="empty-tab"><strong>尚無歷史結算</strong></div>`}</div></div></div>`, "finance-farm");
  }

  function investorDetailSheet(investorId) {
    const investor = FINANCE_REPO.getInvestor(investorId, financeFilters());
    if (!investor) return sheetShell("投資人詳細", "找不到資料", `<div class="empty-tab"><strong>目前範圍沒有這位投資人</strong></div>`, "investor-detail");
    const allocations = FINANCE_REPO.getInvestorAllocations(investor.id, financeFilters()).map((allocation) => ({ allocation, distribution: FINANCE_REPO.getDistribution(allocation.distributionId) }));
    return sheetShell(escapeHtml(investor.name), `配置合計 ${moneyPrecise(investor.allocationTotal)}`, `<div class="detail-list"><div class="detail-block"><h3>場級股權</h3><div class="sheet-item-list">${investor.farms.map((row) => `<div class="sheet-item static"><span><strong>${escapeHtml(row.farm)}</strong><span>股權 ${(row.share).toFixed(1)}% · 場級配置 ${moneyPrecise(row.allocationTotal)}</span></span><span class="sheet-item-end">${moneyPrecise(row.allocationTotal)}</span></div>`).join("") || `<div class="empty-tab">沒有股權資料。</div>`}</div></div><div class="detail-block"><h3>正向／負向歷史分配</h3><p>${investor.positiveDistributionCount} ／ ${investor.negativeDistributionCount} 筆</p></div><div class="detail-block"><h3>配置紀錄</h3><div class="sheet-item-list">${allocations.map(({ allocation, distribution }) => `<div class="sheet-item static"><span><strong>${escapeHtml(distribution?.distributionDate || "—")}</strong><span>${escapeHtml(distribution?.sourceRowKey || "")}</span></span><span class="sheet-item-end">${moneyPrecise(allocation.amount)}</span></div>`).join("") || `<div class="empty-tab"><strong>尚無歷史分配</strong></div>`}</div></div></div>`, "investor-detail");
  }

  function expenseDetailSheet(farmId) {
    const farm = FINANCE_REPO.getFarm(farmId);
    if (!farm) return sheetShell("費用詳細", "找不到資料", `<div class="empty-tab"><strong>目前範圍沒有這個模擬場</strong></div>`, "expense-detail");
    const distributions = FINANCE_REPO.listDistributions({ farmId });
    return sheetShell(`${escapeHtml(farm.name)} · 費用`, `分配層級合計 ${money(farm.expense)}`, `<div class="readonly-note">合約只提供 ProfitDistribution.expense；沒有費用分類資料，因此不建立分類明細。</div><div class="sheet-item-list">${distributions.map((distribution) => `<div class="sheet-item static"><span><strong>${escapeHtml(distribution.distributionDate)}</strong><span>${escapeHtml(distribution.sourceRowKey)}</span></span><span class="sheet-item-end">${money(distribution.expense)}</span></div>`).join("") || `<div class="empty-tab"><strong>尚無歷史結算</strong></div>`}</div>`, "expense-detail");
  }

  function distributionDetailSheet(distributionId) {
    const distribution = FINANCE_REPO.getDistribution(distributionId);
    if (!distribution) return sheetShell("歷史分配詳細", "找不到資料", `<div class="empty-tab"><strong>找不到這筆歷史分配</strong></div>`, "distribution-detail");
    const farm = FINANCE_REPO.getFarm(distribution.farmId);
    const operationalFarm = operationalFarmForFinanceId(distribution.farmId);
    const allocations = FINANCE_REPO.getDistributionAllocations(distribution.id);
    const source = FINANCE_REPO.getSourceReference(distribution.id);
    const traceRows = allocations.map((allocation) => {
      const investor = FINANCE_REPO.getInvestor(allocation.investorId);
      return `<div class="finance-trace-row" data-testid="finance-trace-row"><strong>${escapeHtml(investor?.name || allocation.investorId)} · ${moneyPrecise(allocation.amount)}</strong><span>ProfitDistributionAllocation ID：${escapeHtml(allocation.id)} · investorId=${escapeHtml(allocation.investorId)} · distributionId=${escapeHtml(allocation.distributionId)} · farmId=${escapeHtml(distribution.farmId)}</span></div>`;
    }).join("");
    return sheetShell(`${escapeHtml(distribution.distributionDate)} · ${escapeHtml(farm?.name || distribution.farmId)}`, "歷史分配詳細", `<div class="detail-hero"><small>投資人淨收入</small><strong>${moneyPrecise(distribution.netIncome)}</strong><span>已配置盈虧 ${moneyPrecise(distribution.allocatedProfitLoss)} · 費用 ${moneyPrecise(distribution.expense)}</span></div><div class="finance-identity-card"><strong>Finance ↔ 營運身份</strong><span>Finance Farm ID：${escapeHtml(distribution.farmId)} · 營運雞場：${escapeHtml(operationalFarm?.name || "—")}</span><span>operationalFarmId=${escapeHtml(operationalFarm?.id || "—")}</span></div><div class="detail-block"><h3>金額合約</h3><p>歷史總盈虧 ${moneyPrecise(distribution.grossProfitLoss)} · 已配置盈虧 − 費用 = 投資人淨收入</p></div><div class="detail-block finance-trace" data-testid="finance-trace"><h3>分配 → 配置追溯</h3><p>以 authoritative identifier 直接連結這筆 ProfitDistribution 與每筆 ProfitDistributionAllocation；不依賴排序、索引或金額。</p><div class="finance-trace-list">${traceRows}</div></div><div class="detail-block"><h3>資料來源</h3><p>${escapeHtml(source?.sourceDataset || "")} · ${escapeHtml(source?.sourceRowKey || "")} · ROC ${escapeHtml(source?.sourceDateRoc || "")}</p></div>`, "distribution-detail");
  }

  function financeMetricSheet(metric) {
    const scope = financeScope();
    const fieldMap = { gross: "grossProfitLoss", allocated: "allocatedProfitLoss", expense: "expense", net: "netIncome" };
    const field = fieldMap[metric] || fieldMap.net;
    const labelMap = { gross: "歷史總盈虧", allocated: "已配置盈虧", expense: "費用", net: "投資人淨收入" };
    const title = labelMap[metric] || labelMap.net;
    if (scope.unconfiguredContext) {
      const identity = financeIdentityForOperationalFarm(scope.currentContext.farm.id);
      return sheetShell(title, escapeHtml(contextLabel()), `<div class="detail-hero"><small>${title}</small><strong>尚未建立財務資料</strong><span>這個雞場已有 Finance identity，但沒有可呈現的收入、分配、費用或淨收入數字。</span></div><div class="finance-identity-card"><strong>Finance identity</strong><span>${escapeHtml(identity?.id || "—")}</span><span>operationalFarmId=${escapeHtml(scope.currentContext.farm.id)}</span></div><div class="readonly-note">不以 0 代替未知資料，也不自行補造結算。</div>`, "finance-metric");
    }
    const value = scope.totals[metric] ?? scope.totals.net;
    const map = {
      gross: "各場歷史總盈虧加總",
      allocated: "目前範圍內已配置盈虧加總",
      expense: "目前範圍內分配層級費用加總",
      net: `已配置 ${money(scope.totals.allocated)} 扣除費用 ${money(scope.totals.expense)}`,
    };
    return sheetShell(title, htmlContextLabel(), `<div class="detail-hero"><small>${title}</small><strong>${money(value)}</strong><span>${map[metric] || map.net}</span></div><div class="sheet-item-list">${scope.farms.map((farm) => `<button type="button" class="sheet-item" data-action="open-finance-farm" data-farm-id="${escapeHtml(farm.id)}"><span><strong>${escapeHtml(farm.name)}</strong><span>${title} ${money(farm[field])}</span></span><span class="sheet-item-end">›</span></button>`).join("")}</div>`, "finance-metric");
  }

  function analysisDetailSheet(key) {
    const scope = financeScope();
    if (scope.unconfiguredContext) return sheetShell("財務分析", escapeHtml(contextLabel()), `<div class="detail-hero"><small>目前範圍</small><strong>尚未建立財務資料</strong><span>這個雞場已有 Finance identity，但尚無可計算的歷史分配或投資績效資料。</span></div><div class="readonly-note">不建立 0%、ROI、IRR 或其他推導數字。</div>`, "analysis-detail");
    const allocationRate = scope.totals.gross ? (scope.totals.allocated / scope.totals.gross) * 100 : 0;
    const expenseRate = scope.totals.gross ? (scope.totals.expense / scope.totals.gross) * 100 : 0;
    const netMargin = scope.totals.gross ? (scope.totals.net / scope.totals.gross) * 100 : 0;
    const bestFarm = [...scope.farms].sort((a, b) => b.netIncome - a.netIncome)[0];
    const topInvestor = [...scope.investors].sort((a, b) => b.allocationTotal - a.allocationTotal)[0];
    const detail = {
      allocation: ["已配置盈虧率", `${allocationRate.toFixed(1)}%`, `${money(scope.totals.allocated)} ÷ ${money(scope.totals.gross)}`],
      expense: ["費用率", `${expenseRate.toFixed(2)}%`, `${money(scope.totals.expense)} ÷ ${money(scope.totals.gross)}`],
      net: ["投資人淨收入率", `${netMargin.toFixed(1)}%`, `${money(scope.totals.net)} ÷ ${money(scope.totals.gross)}`],
      "best-farm": ["最高投資人淨收入場", bestFarm?.name || "—", bestFarm ? `投資人淨收入 ${money(bestFarm.netIncome)}` : "沒有資料"],
      "top-investor": ["最高配置投資人", topInvestor?.name || "—", topInvestor ? `配置合計 ${money(topInvestor.allocationTotal)}` : "沒有資料"],
    };
    const [title, value, copy] = detail[key] || detail.net;
    return sheetShell(title, "由目前測試財務資料直接計算", `<div class="detail-hero"><small>${title}</small><strong>${value}</strong><span>${copy}</span></div><div class="readonly-note">不引入外部產業平均、IRR、ROI 或未授權指標。</div>`, "analysis-detail");
  }

  function developerClicksSheet() {
    const rows = Object.entries(developerAnalytics.counts).sort((a, b) => b[1] - a[1]);
    const total = rows.reduce((sum, [, value]) => sum + value, 0);
    return sheetShell("點擊計數", `本機累計 ${number(total)} 次`, `<div class="developer-actions"><button type="button" class="sheet-primary" data-action="export-dev-analytics">匯出 JSON</button><button type="button" class="sheet-secondary danger" data-action="reset-dev-analytics">重設點擊與 Log</button></div><div class="sheet-item-list">${rows.length ? rows.slice(0, 80).map(([key, value]) => `<div class="sheet-item static"><span><strong>${escapeHtml(key)}</strong><span>點擊次數</span></span><span class="sheet-item-end dev-count">${number(value)}</span></div>`).join("") : `<div class="empty-tab"><strong>還沒有點擊資料</strong><p>操作任一按鈕後會開始累計。</p></div>`}</div><div class="readonly-note">僅存 localStorage；不記錄快速記錄文字、AI 問題或個人內容。</div>`, "developer-clicks");
  }

  function developerLogSheet() {
    const rows = developerAnalytics.log.slice().reverse().slice(0, 100);
    return sheetShell("UI Log", `最近 ${rows.length} 筆本機互動`, `<div class="sheet-item-list dev-log-list">${rows.length ? rows.map((row) => `<div class="sheet-item static"><span><strong>${escapeHtml(row.key)}</strong><span>${escapeHtml(row.page)} · ${escapeHtml(row.context)}${row.sheet ? ` · sheet:${escapeHtml(row.sheet)}` : ""}</span></span><span class="dev-time">${escapeHtml(row.at.slice(11,19))}</span></div>`).join("") : `<div class="empty-tab"><strong>目前沒有 Log</strong></div>`}</div><div class="readonly-note">這裡是 UI 操作 Log，不是 Production Worker／D1／LINE 的正式系統 Log。</div>`, "developer-log");
  }

  function developerNotesSheet() {
    return sheetShell("開發者筆記", "只存此瀏覽器", `<label class="quick-record-label" for="developer-note-input">筆記</label><textarea id="developer-note-input" class="developer-note-input" rows="8" placeholder="記錄要改善的組件、測試結果或下一步…">${escapeHtml(developerNote())}</textarea>${state.developerNotice ? `<div class="dev-save-note">${escapeHtml(state.developerNotice)}</div>` : ""}<button type="button" class="sheet-primary" data-action="save-dev-note">儲存本機筆記</button><div class="readonly-note">筆記不會上傳，也不是正式 Audit Log。</div>`, "developer-notes");
  }

  function developerDiagnosticsSheet() {
    const root = document.documentElement;
    const buildSha = root.dataset.buildSha || "LOCAL_UNBUILT";
    const buildTime = root.dataset.buildTime || "LOCAL";
    const buildBranch = root.dataset.buildBranch || "feat/management-center-preprod-v7";
    const overlay = labOverlay();
    const mode = overlay.mode;
    const aiStatus = simulatedAiAvailable() ? "AI_AVAILABLE" : "AI_UNAVAILABLE";
    return sheetShell("開發者診斷", "V14R Plus r4", `<div class="diagnostic-grid"><div><span>Environment</span><strong>PREPROD LAB</strong></div><div><span>Build SHA</span><strong>${escapeHtml(buildSha)}</strong></div><div><span>Build marker</span><strong>${escapeHtml(root.dataset.buildMarker || "")}</strong></div><div><span>Build time</span><strong>${escapeHtml(buildTime)}</strong></div><div><span>Branch</span><strong>${escapeHtml(buildBranch)}</strong></div><div><span>資料契約</span><strong>PASS（載入時驗證）</strong></div><div><span>連動測試事件</span><strong>${number(PLUS_LINKED_TEST_EVENTS.length)} 筆</strong></div><div><span>Lab backend</span><strong>${escapeHtml(labModeLabel(mode))}</strong></div><div><span>待同步操作</span><strong>${number(overlay.outbox.length)} 筆</strong></div><div><span>點擊資料</span><strong>localStorage</strong></div><div><span>AI 狀態</span><strong>${aiStatus}</strong></div></div><div class="developer-actions"><button type="button" class="sheet-primary" data-action="toggle-ai-simulation">${aiStatus === "AI_AVAILABLE" ? "模擬 AI 不可用" : "恢復 AI 可用"}</button><button type="button" class="sheet-secondary" data-action="export-dev-analytics">匯出本機診斷 JSON</button></div><div class="readonly-note">診斷只顯示 PREPROD LAB 身份、版本與本機 adapter 狀態；不暴露 secret、token 或個人內容。</div>`, "developer-diagnostics");
  }

  function developerFallbackSheet() {
    const mode = labOverlay().mode;
    return sheetShell("AI／Cloudflare 降級方案", `目前 Lab 狀態：${labModeLabel(mode)}`, `<div class="fallback-stack">
      <section class="fallback-card good"><strong>情境 A｜只有 AI 不可用</strong><p>核心記錄、查詢、修正、Context、財務與圖表全部照常。AI 入口顯示「暫不可用」，自然語言無法解析時改用 Quick Record 結構化選項／人工確認；不阻塞正式資料流程。</p></section>
      <section class="fallback-card warn"><strong>情境 B｜Cloudflare 暫時下線</strong><p>Web 靜態殼與最近一次資料快照可繼續開啟；新紀錄先進本機 IndexedDB「待同步匣」，每筆產生 client_operation_id，恢復後以冪等方式送回正式 Business Boundary。衝突不自動覆蓋，進 Pending 人工確認。</p><p><b>LINE：</b>若 webhook 仍直接依賴 Cloudflare，暫停期間無法即時處理。建議另建「供應商獨立的緊急入口」：只接收、去重、保存原始事件並回覆維護訊息；Cloudflare 恢復後再安全 replay，不在備援端直接改正式帳。</p></section>
      <section class="fallback-card alert"><strong>情境 C｜Cloudflare 永久下線</strong><p>把 parser／validator／business／audit 保持 provider-neutral，透過 Storage / Queue / Scheduler / AI adapters 遷移。每日把可還原資料與 migration 版本加密備份到非 Cloudflare 儲存；DNS／網域控制也不得只依賴單一供應商。</p><p><b>遷移目標：</b>可替換為任一標準 Node/Serverless 主機 + PostgreSQL/SQLite 相容資料庫 + queue + scheduler。AI provider 可獨立切換，且永遠不是正式寫入必要條件。</p></section>
      <section class="fallback-card"><strong>建議落地順序</strong><p>1. 先做 AI provider abstraction 與 deterministic fallback → 2. Web IndexedDB outbox + reconnect sync → 3. 非 Cloudflare 加密備份 → 4. 獨立 emergency ingress → 5. 每季演練 permanent migration restore。</p></section>
    </div><div class="detail-block"><h3>Fault injection</h3><p>以下只切換本機 Lab adapter；不呼叫 Production API。</p><div class="developer-actions"><button type="button" class="sheet-secondary" data-action="set-lab-mode" data-mode="ONLINE">ONLINE</button><button type="button" class="sheet-secondary" data-action="set-lab-mode" data-mode="AI_DOWN">AI_DOWN</button><button type="button" class="sheet-secondary" data-action="set-lab-mode" data-mode="BACKEND_TEMP_DOWN">BACKEND_TEMP_DOWN</button><button type="button" class="sheet-secondary" data-action="set-lab-mode" data-mode="BACKEND_LONG_DOWN">BACKEND_LONG_DOWN</button><button type="button" class="sheet-secondary danger" data-action="reset-lab-fixture">Reset fixture</button></div></div><div class="readonly-note">本 r4 只把流程與開發者可見提案做進 Prototype；真正的跨供應商備援需要另外部署與災難復原驗收。</div>`, "developer-fallback");
  }

  function renderSheet() {
    if (!state.sheet) return "";
    if (state.sheet.kind === "context") return contextSheet();
    if (state.sheet.kind === "pending") return pendingSheet();
    if (state.sheet.kind === "pending-item") return pendingItemSheet(state.sheet.id);
    if (state.sheet.kind === "upcoming") return upcomingSheet();
    if (state.sheet.kind === "abnormal") return abnormalSheet();
    if (state.sheet.kind === "abnormal-item") return abnormalItemSheet(state.sheet.id);
    if (state.sheet.kind === "mortality") return mortalitySheet();
    if (state.sheet.kind === "cull") return cullSheet();
    if (state.sheet.kind === "flocks") return flocksSheet();
    if (state.sheet.kind === "flock") return flockSheet(state.sheet.id);
    if (state.sheet.kind === "event-item") return eventItemSheet(state.sheet.id);
    if (state.sheet.kind === "farm-detail") return farmDetailSheet(state.sheet.farmId);
    if (state.sheet.kind === "house-detail") return houseDetailSheet(state.sheet.farmId, state.sheet.houseId);
    if (state.sheet.kind === "master-data") return masterDataManagementSheet();
    if (state.sheet.kind === "master-data-confirmation") return masterDataConfirmationSheet();
    if (state.sheet.kind === "quick-actions") return quickActionsSheet();
    if (state.sheet.kind === "quick-record") return quickRecordSheet();
    if (state.sheet.kind === "quick-record-preview") return quickRecordPreviewSheet();
    if (state.sheet.kind === "correction") return correctionSheet(state.sheet.id);
    if (state.sheet.kind === "insights") return insightsSheet();
    if (state.sheet.kind === "system") return systemSheet();
    if (state.sheet.kind === "audit") return auditSheet();
    if (state.sheet.kind === "settings") return settingsSheet();
    if (state.sheet.kind === "insight-detail") return insightDetailSheet(state.sheet.key);
    if (state.sheet.kind === "system-detail") return systemDetailSheet(state.sheet.key);
    if (state.sheet.kind === "settings-detail") return settingsDetailSheet(state.sheet.key);
    if (state.sheet.kind === "finance-farm") return financeFarmSheet(state.sheet.farmId);
    if (state.sheet.kind === "investor-detail") return investorDetailSheet(state.sheet.investorId);
    if (state.sheet.kind === "expense-detail") return expenseDetailSheet(state.sheet.farmId);
    if (state.sheet.kind === "distribution-detail") return distributionDetailSheet(state.sheet.distributionId);
    if (state.sheet.kind === "finance-metric") return financeMetricSheet(state.sheet.metric);
    if (state.sheet.kind === "analysis-detail") return analysisDetailSheet(state.sheet.key);
    if (state.sheet.kind === "developer-clicks") return developerClicksSheet();
    if (state.sheet.kind === "developer-log") return developerLogSheet();
    if (state.sheet.kind === "developer-notes") return developerNotesSheet();
    if (state.sheet.kind === "developer-diagnostics") return developerDiagnosticsSheet();
    if (state.sheet.kind === "developer-fallback") return developerFallbackSheet();
    return "";
  }



  function desktopWideMode() { return window.innerWidth >= 1024; }

  function desktopContextToolbar() {
    const context = currentContext();
    const farm = context.farm;
    const house = context.house;
    const houses = farm.id === "all" ? [] : farm.houses;
    const flocks = house ? house.flocks : [];
    const menu = state.desktopFarmMenuOpen ? `<div class="desktop-farm-dropdown" role="menu" aria-label="選擇雞場">${labData().farms.map((item) => `<button type="button" role="menuitem" class="desktop-farm-option ${item.id === farm.id ? "active" : ""}" data-action="desktop-select-farm-dropdown" data-farm-id="${escapeHtml(item.id)}"><span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.id === "all" ? "全域唯讀總覽" : item.subtitle)}</small></span><em>${item.id === farm.id ? "✓" : ""}</em></button>`).join("")}</div>` : "";
    return `<section class="desktop-v2-contextbar" aria-label="桌面工作範圍">
      <div class="desktop-farm-dropdown-wrap"><button type="button" class="desktop-farm-trigger" data-action="toggle-desktop-farm-menu" aria-haspopup="menu" aria-expanded="${state.desktopFarmMenuOpen}"><span class="context-icon">${icon("pin")}</span><span class="desktop-farm-title"><small>目前雞場</small><strong>${escapeHtml(farm.name)}</strong><span>${escapeHtml(farm.id === "all" ? "全域唯讀總覽" : farm.subtitle)}</span></span><span class="desktop-farm-chevron" aria-hidden="true">⌄</span></button>${menu}</div>
      <div class="desktop-context-trail">
        ${farm.id !== "all" ? houses.map((item) => `<button type="button" class="desktop-context-chip ${state.context.houseId === item.id ? "active" : ""}" data-action="desktop-set-house" data-house-id="${escapeHtml(item.id)}">${escapeHtml(item.name)}</button>`).join("") : `<span class="scope-chip">全部在養 · 全域唯讀</span>`}
        ${flocks.length ? flocks.map((flock) => `<button type="button" class="desktop-context-chip ${state.context.flockId === flock.id ? "active" : ""}" data-action="select-flock-direct" data-flock-id="${escapeHtml(flock.id)}">${escapeHtml(flock.code)}</button>`).join("") : ""}
      </div>
    </section>`;
  }


  function desktopRecentRows(limit=7) {
    const events = scopedEvents().map((event) => ({ kind:"event", id:event.id, sort:`${event.date} ${event.time}`, title:`${eventLabel(event.type)} ${number(event.qty)} ${event.unit}`, detail:`${contextName(event)} · ${event.date.slice(5).replace('-', '/')} ${event.time}` }));
    const abnormal = scopedAbnormalities().map((item) => ({ kind:"abnormal", id:item.id, sort:`${item.date} ${item.time}`, title:`異常：${item.title}`, detail:`${contextName(item)} · ${item.state}` }));
    return [...events,...abnormal].sort((a,b)=>b.sort.localeCompare(a.sort)).slice(0,limit);
  }

  function desktopToday() {
    const pending = scopedPending();
    const upcoming = upcomingFlocks();
    const abnormalities = scopedAbnormalities({activeOnly:true});
    const mortality = mortalityValue();
    const cull = cullValue();
    const actions=[];
    if (pending.length) actions.push(`<button type="button" class="action-card" data-action="open-sheet" data-sheet-kind="pending"><span class="action-icon">${icon("check")}</span><span class="action-copy"><strong>${pending.length} 筆需要人工確認</strong><span>資料尚未完整</span></span><span class="action-count">${pending.length}</span></button>`);
    if (upcoming.length) actions.push(`<button type="button" class="action-card good" data-action="open-sheet" data-sheet-kind="upcoming"><span class="action-icon">${icon("flock")}</span><span class="action-copy"><strong>${upcoming.length} 批 7 日內出雞</strong><span>${upcoming.map(f=>escapeHtml(f.code)).join("、")}</span></span><span class="action-count">${upcoming.length}</span></button>`);
    if (abnormalities.length) actions.push(`<button type="button" class="action-card alert" data-action="open-sheet" data-sheet-kind="abnormal"><span class="action-icon">${icon("warning")}</span><span class="action-copy"><strong>${abnormalities.length} 筆異常追蹤中</strong><span>${escapeHtml(abnormalities.slice(0,2).map(i=>i.title).join("、"))}</span></span><span class="action-count">${abnormalities.length}</span></button>`);
    const farms = state.context.farmId === "all" ? allProductionFarms() : [currentContext().farm];
    const recent = desktopRecentRows(6);
    return `<section class="desktop-v2-page" data-page="today">
      ${desktopContextToolbar()}
      <div class="desktop-kpi-ribbon" aria-label="核心指標">
        <button type="button" class="desktop-kpi good" data-action="open-sheet" data-sheet-kind="flocks"><span>目前在養</span><strong>${number(contextStock())}</strong><small>${contextCountLabel()} · 查看批次</small></button>
        <button type="button" class="desktop-kpi alert" data-action="open-sheet" data-sheet-kind="mortality"><span>今日死亡</span><strong>${number(mortality)}</strong><small>${mortality ? "查看死亡明細" : "目前無死亡明細"}</small></button>
        <button type="button" class="desktop-kpi warn" data-action="open-sheet" data-sheet-kind="pending"><span>待人工確認</span><strong>${number(pending.length)}</strong><small>需要補齊或確認</small></button>
        <button type="button" class="desktop-kpi ${abnormalities.length ? "alert" : "good"}" data-action="open-sheet" data-sheet-kind="abnormal"><span>異常追蹤</span><strong>${number(abnormalities.length)}</strong><small>目前工作範圍</small></button>
      </div>
      <div class="desktop-workbench">
        <aside class="desktop-pane desktop-priority-pane"><div class="desktop-pane-head"><div><h2>今日決策</h2><p>只放需要立即判斷的事項</p></div><span class="scope-chip">${actions.length} 項</span></div><div class="desktop-pane-body"><section class="digest"><div class="digest-head"><p class="kicker">摘要</p><span class="digest-mark">${icon("digest")}</span></div><h2>${digestCopy()}</h2><p>只依目前範圍測試資料整理。</p></section><div class="action-list">${actions.length ? actions.join("") : `<div class="desktop-empty"><strong>目前沒有急迫事項</strong>這個範圍沒有待確認、近期出雞或追蹤中異常。</div>`}</div><div class="desktop-section-split"></div><div class="quick-summary"><button type="button" class="summary-tile alert" data-action="open-sheet" data-sheet-kind="mortality"><span class="tile-label">死亡</span><strong>${number(mortality)}</strong><small>今日</small></button><button type="button" class="summary-tile good" data-action="open-sheet" data-sheet-kind="cull"><span class="tile-label">淘汰</span><strong>${number(cull)}</strong><small>今日</small></button></div></div></aside>
        <main class="desktop-pane desktop-analysis-pane"><div class="desktop-pane-head"><div><h2>營運趨勢</h2><p>圖表是桌面工作區主體，可直接切換比較</p></div><span class="status-chip good">即時計算</span></div><div class="desktop-pane-body">${plusChartsSection()}</div></main>
        <aside class="desktop-pane desktop-live-pane"><div class="desktop-pane-head"><div><h2>場次與最新動態</h2><p>不用離開首頁即可掌握分布</p></div></div><div class="desktop-pane-body"><div><strong style="font-size:11px">雞場概況</strong><div class="desktop-live-list">${farms.map(f=>{const p=labData().pending.filter(x=>x.farmId===f.id).length; const a=labData().abnormalities.filter(x=>x.farmId===f.id && x.status==="active").length; return `<button type="button" class="desktop-live-row" data-action="desktop-set-farm" data-farm-id="${escapeHtml(f.id)}"><span><strong>${escapeHtml(f.name)}</strong><span>待確認 ${p} · 異常 ${a}</span></span><span><b>${number(f.stock)}</b><small>在養</small></span></button>`}).join("")}</div></div><div class="desktop-section-split"></div><div><strong style="font-size:11px">最新紀錄</strong><div class="desktop-live-list">${recent.map(r=>`<button type="button" class="desktop-live-row" data-action="${r.kind==="event"?"open-event":"open-abnormal"}" ${r.kind==="event"?`data-event-id="${escapeHtml(r.id)}"`:`data-abnormal-id="${escapeHtml(r.id)}"`}><span><strong>${escapeHtml(r.title)}</strong><span>${escapeHtml(r.detail)}</span></span><span>›</span></button>`).join("") || `<div class="desktop-empty">沒有近期紀錄。</div>`}</div></div></div></aside>
      </div>
    </section>`;
  }

  function desktopRecords() {
    const metric = state.recordsMetric || "mortality";
    const series = recordsTrendSeries(metric);
    const cfg = RECORD_METRICS[metric];
    const latest = [...series].reverse().find(r=>r.has) || {value:0};
    const rows=desktopRecentRows(16);
    return `<section class="desktop-v2-page" data-page="records">${desktopContextToolbar()}<div class="desktop-records-grid">
      <aside class="desktop-pane"><div class="desktop-pane-head"><div><h2>數據項目</h2><p>選擇後中間圖表立即更新</p></div></div><div class="desktop-metric-rail">${Object.entries(RECORD_METRICS).map(([key,c])=>`<button type="button" class="${metric===key?"active":""}" data-action="records-metric" data-records-metric="${key}"><span>${c.label}</span><b>${key===metric?`${number(latest.value)} ${c.unit}`:""}</b></button>`).join("")}</div></aside>
      <main class="desktop-pane desktop-records-chart"><div class="desktop-pane-head"><div><h2>${cfg.label}趨勢</h2><p>最近 7 天 · ${escapeHtml(contextShortLabel())}</p></div><span class="status-chip good">同一份紀錄資料</span></div>${recordsTrendChart(metric)}</main>
      <aside class="desktop-pane desktop-records-right"><div class="desktop-pane-head"><div><h2>事件時間軸</h2><p>圖表與明細同時可見</p></div><span class="scope-chip">${rows.length} 筆</span></div><div class="desktop-records-timeline"><div class="list-stack">${rows.map(r=>`<button type="button" class="list-row" data-action="${r.kind==="event"?"open-event":"open-abnormal"}" ${r.kind==="event"?`data-event-id="${r.id}"`:`data-abnormal-id="${r.id}"`}><span><strong>${escapeHtml(r.title)}</strong><span>${escapeHtml(r.detail)}</span></span><span class="row-arrow">›</span></button>`).join("") || `<div class="desktop-empty"><strong>沒有紀錄</strong>目前範圍沒有可顯示資料。</div>`}</div></div></aside>
    </div></section>`;
  }

  function desktopFarms() {
    const farms=allProductionFarms();
    const selected=state.context.farmId==="all"?null:currentContext().farm;
    const houses=selected?selected.houses:[];
    const selectedHouse=selected && state.context.houseId ? houseById(selected,state.context.houseId) : null;
    const flocks=selectedHouse ? selectedHouse.flocks : selected ? selected.houses.flatMap(h=>h.flocks.map(f=>({...f,houseName:h.name}))) : [];
    return `<section class="desktop-v2-page" data-page="farms">${desktopContextToolbar()}<div class="desktop-kpi-ribbon"><div class="desktop-kpi good"><span>目前在養</span><strong>${number(contextStock())}</strong><small>${escapeHtml(contextShortLabel())}</small></div><div class="desktop-kpi"><span>雞場</span><strong>${farms.length}</strong><small>測試資料</small></div><div class="desktop-kpi"><span>進行中批次</span><strong>${scopedFlocks().length}</strong><small>依目前範圍</small></div><div class="desktop-kpi ${scopedAbnormalities({activeOnly:true}).length?"alert":"good"}"><span>追蹤中異常</span><strong>${scopedAbnormalities({activeOnly:true}).length}</strong><small>目前範圍</small></div></div><section class="master-data-entry desktop-master-entry" data-testid="master-data-entry"><div><p class="kicker">管理</p><h2>主檔管理</h2><p>新增雞場、雞舍、批次與照顧者；只寫入 Lab runtime overlay。</p></div><button type="button" class="sheet-secondary" data-action="open-master-data">開啟主檔管理</button></section><div class="desktop-farms-grid">
      <aside class="desktop-pane"><div class="desktop-pane-head"><div><h2>雞場</h2><p>第一層主清單</p></div></div><div class="desktop-master-list">${farms.map(f=>`<button type="button" class="desktop-master-item ${selected?.id===f.id?"active":""}" data-action="desktop-set-farm" data-farm-id="${escapeHtml(f.id)}"><strong>${escapeHtml(f.name)}</strong><span>${escapeHtml(f.risk||f.subtitle)}</span><div class="desktop-master-metrics"><span>在養 <b>${number(f.stock)}</b></span><span>死亡 <b>${f.mortality}</b></span></div></button>`).join("")}</div></aside>
      <section class="desktop-pane desktop-farms-detail"><div class="desktop-pane-head"><div><h2>雞舍</h2><p>${selected?escapeHtml(selected.name):"先選擇左側雞場"}</p></div></div><div class="desktop-master-list">${selected?houses.map(h=>`<button type="button" class="desktop-master-item ${state.context.houseId===h.id?"active":""}" data-action="desktop-set-house" data-house-id="${escapeHtml(h.id)}"><strong>${escapeHtml(h.name)}</strong><span>${h.flocks.length} 個批次</span><div class="desktop-master-metrics"><span>在養 <b>${number(houseStock(h))}</b></span></div></button>`).join(""):`<div class="desktop-empty"><strong>選一個雞場</strong>桌面版會在這裡直接展開雞舍，不需要再開另一層視窗。</div>`}</div></section>
      <section class="desktop-pane desktop-farms-flocks"><div class="desktop-pane-head"><div><h2>批次</h2><p>${selectedHouse?escapeHtml(selectedHouse.name):selected?"目前雞場所有批次":"等待選擇雞場"}</p></div><span class="scope-chip">${flocks.length} 批</span></div><div class="desktop-pane-body"><div class="list-stack">${flocks.map(f=>`<button type="button" class="list-row" data-action="open-flock" data-flock-id="${escapeHtml(f.id)}"><span><strong>${escapeHtml(f.code)}</strong><span>${escapeHtml(f.houseName||selectedHouse?.name||"")} · ${escapeHtml(f.status)}</span></span><span class="row-end"><span class="row-value">${number(f.stock)}</span><span>在養 ›</span></span></button>`).join("") || `<div class="desktop-empty"><strong>沒有批次</strong>選擇雞場或雞舍後在此顯示。</div>`}</div></div></section>
    </div></section>`;
  }

  function desktopTodo() {
    const pending=scopedPending(); const upcoming=upcomingFlocks(); const abnormal=scopedAbnormalities({activeOnly:true});
    return `<section class="desktop-v2-page" data-page="todo">${desktopContextToolbar()}<div class="desktop-kpi-ribbon"><button type="button" class="desktop-kpi warn" data-action="open-sheet" data-sheet-kind="pending"><span>待人工確認</span><strong>${pending.length}</strong><small>需要補資料</small></button><button type="button" class="desktop-kpi good" data-action="open-sheet" data-sheet-kind="upcoming"><span>7 日內出雞</span><strong>${upcoming.length}</strong><small>批次</small></button><button type="button" class="desktop-kpi ${abnormal.length?"alert":"good"}" data-action="open-sheet" data-sheet-kind="abnormal"><span>異常追蹤</span><strong>${abnormal.length}</strong><small>進行中</small></button><div class="desktop-kpi"><span>目前範圍</span><strong style="font-size:16px">${escapeHtml(contextShortLabel())}</strong><small>同步過濾</small></div></div><div class="desktop-todo-grid"><section class="desktop-pane"><div class="desktop-pane-head"><div><h2>待人工確認</h2><p>主要工作清單</p></div><span class="status-chip warn">${pending.length} 筆</span></div><div class="desktop-pane-body"><div class="list-stack">${pending.map(i=>`<button type="button" class="list-row" data-action="open-pending-item" data-pending-id="${escapeHtml(i.id)}"><span><strong>${escapeHtml(i.title)}</strong><span>${escapeHtml(pendingContextName(i))} · ${escapeHtml(i.detail)}</span></span><span class="row-end"><span class="row-value">${escapeHtml(i.kind)}</span><span>›</span></span></button>`).join("") || `<div class="desktop-empty">沒有待確認項目。</div>`}</div></div></section><aside class="desktop-pane"><div class="desktop-pane-head"><div><h2>近期排程與異常</h2><p>不用離開首頁即可一起查看</p></div></div><div class="desktop-pane-body"><strong style="font-size:11px">7 日內出雞</strong><div class="desktop-live-list">${upcoming.map(f=>`<button type="button" class="desktop-live-row" data-action="open-flock" data-flock-id="${escapeHtml(f.id)}"><span><strong>${escapeHtml(f.code)}</strong><span>${escapeHtml(f.farm)} · ${escapeHtml(f.house)}</span></span><span>›</span></button>`).join("")||`<div class="desktop-empty">沒有近期出雞批次。</div>`}</div><div class="desktop-section-split"></div><strong style="font-size:11px">異常追蹤</strong><div class="desktop-live-list">${abnormal.map(a=>`<button type="button" class="desktop-live-row" data-action="open-abnormal" data-abnormal-id="${escapeHtml(a.id)}"><span><strong>${escapeHtml(a.title)}</strong><span>${escapeHtml(contextName(a))} · ${escapeHtml(a.state)}</span></span><span>›</span></button>`).join("")||`<div class="desktop-empty">目前沒有追蹤中異常。</div>`}</div></div></aside></div></section>`;
  }

  function desktopMore() {
    const totalClicks=Object.values(developerAnalytics.counts).reduce((s,v)=>s+v,0);
    const tool=(iconName,title,desc,action,kind="")=>`<button type="button" class="more-item" data-action="${action}" ${kind?`data-sheet-kind="${kind}"`:""}><span class="more-item-icon">${icon(iconName)}</span><span><strong>${title}</strong><span>${desc}</span></span><span>›</span></button>`;
    return `<section class="desktop-v2-page" data-page="more">${desktopContextToolbar()}<div class="desktop-more-grid"><section class="desktop-pane"><div class="desktop-pane-head"><div><h2>工具與管理</h2><p>桌面一次展開高頻與低頻工具</p></div></div><div class="more-list">${tool("chart","洞察","在養、死亡、飼料、飲水與異常","open-sheet","insights")}${tool("records","月曆","排程、入雛、磅雞、出雞與營運紀錄","go-calendar")}${tool("finance","財務","總覽、各場、股權、歷史分配、費用、投資績效與資料來源；桌面左側也可直接進入","go-finance")}${tool("ai","AI 助理","帶入目前工作範圍；維持唯讀","go-ai")}${tool("lock","系統","雞場、雞舍、批次與服務邊界","open-sheet","system")}${tool("records","變更紀錄","修改、取消與操作歷程入口","open-sheet","audit")}${tool("more","設定","操作與管理設定","open-sheet","settings")}</div></section><aside class="desktop-pane"><div class="desktop-pane-head"><div><h2>開發者</h2><p>本機測試分析 · 不上傳操作資料</p></div><span class="env-chip">${number(totalClicks)} 次點擊</span></div><section class="developer-block"><div class="developer-grid"><button type="button" class="developer-item" data-action="open-sheet" data-sheet-kind="developer-clicks"><span>${icon("todo")}</span><strong>點擊計數</strong><small>組件使用次數</small></button><button type="button" class="developer-item" data-action="open-sheet" data-sheet-kind="developer-log"><span>${icon("records")}</span><strong>UI Log</strong><small>最近互動</small></button><button type="button" class="developer-item" data-action="open-sheet" data-sheet-kind="developer-notes"><span>${icon("spark")}</span><strong>開發者筆記</strong><small>本機儲存</small></button><button type="button" class="developer-item" data-action="open-sheet" data-sheet-kind="developer-diagnostics"><span>${icon("lock")}</span><strong>診斷</strong><small>資料契約與降級</small></button><button type="button" class="developer-item wide" data-action="open-sheet" data-sheet-kind="developer-fallback"><span>${icon("ai")}</span><strong>AI／Cloudflare 降級方案</strong><small>暫時中斷與永久遷移</small></button></div></section></aside></div></section>`;
  }

  function desktopFinance() {
    const tabs=financeTabs();
    const scope=financeScope();
    const totals=scope.totals;
    const unconfigured = scope.unconfiguredContext;
    const allocation=unconfigured?null:(totals.gross?totals.allocated/totals.gross*100:0);
    const expense=unconfigured?null:(totals.gross?totals.expense/totals.gross*100:0);
    const net=unconfigured?null:(totals.gross?totals.net/totals.gross*100:0);
    const best=unconfigured?null:[...scope.farms].sort((a,b)=>b.netIncome-a.netIncome)[0];
    const displayRate = (value, digits) => value === null ? "—" : `${value.toFixed(digits)}%`;
    return `<section class="desktop-v2-page" data-page="finance">${desktopContextToolbar()}<div class="desktop-finance-grid"><aside class="desktop-pane"><div class="desktop-pane-head"><div><h2>財務模組</h2><p>七個唯讀 synthetic 檢視</p></div></div><nav class="desktop-finance-tabs">${tabs.map(([k,l])=>`<button type="button" class="${state.financeTab===k?"active":""}" data-action="finance-tab" data-finance-tab="${k}">${l}</button>`).join("")}</nav></aside><main class="desktop-finance-main">${financeTabBody()}</main><aside class="desktop-pane desktop-finance-facts-pane"><div class="desktop-pane-head"><div><h2>關鍵比率</h2><p>${unconfigured ? "尚未建立財務資料" : "固定留在右側供比較"}</p></div></div><div class="desktop-finance-facts"><div class="desktop-fact"><span>投資人淨收入</span><strong>${unconfigured ? "—" : money(totals.net)}</strong><small>${unconfigured ? "尚未建立財務資料" : "已配置盈虧 − 費用"}</small></div><div class="desktop-fact"><span>已配置盈虧率</span><strong>${displayRate(allocation, 1)}</strong><small>${unconfigured ? "尚未建立財務資料" : "已配置盈虧 ÷ 歷史總盈虧"}</small></div><div class="desktop-fact"><span>費用率</span><strong>${displayRate(expense, 2)}</strong><small>${unconfigured ? "尚未建立財務資料" : "費用 ÷ 歷史總盈虧"}</small></div><div class="desktop-fact"><span>淨收入率</span><strong>${displayRate(net, 1)}</strong><small>${unconfigured ? "尚未建立財務資料" : best ? `最高投資人淨收入：${escapeHtml(best.name)}` : "—"}</small></div></div></aside></div></section>`;
  }

  function desktopPageMarkup() {
    if (state.page === "today") return desktopToday();
    if (state.page === "calendar") return renderCalendar();
    if (state.page === "farms") return desktopFarms();
    if (state.page === "records") return desktopRecords();
    if (state.page === "todo") return desktopTodo();
    if (state.page === "more") return desktopMore();
    if (state.page === "finance") return desktopFinance();
    if (state.page === "ai") return renderAi();
    return desktopToday();
  }

  function pageMarkup() {
    if (desktopWideMode()) return desktopPageMarkup();
    if (state.page === "today") return renderToday();
    if (state.page === "calendar") return renderCalendar();
    if (state.page === "farms") return renderFarms();
    if (state.page === "records") return renderRecords();
    if (state.page === "todo") return renderTodo();
    if (state.page === "more") return renderMore();
    if (state.page === "finance") return renderFinance();
    if (state.page === "ai") return renderAi();
    return renderToday();
  }

  function captureFocusMeta(element) {
    if (!element || element === document.body || element === document.documentElement) return null;
    if (element.dataset?.testid) return { testid: element.dataset.testid };
    if (element.dataset?.nav) return { nav: element.dataset.nav };
    if (element.dataset?.action) {
      const keys = ["sheetKind","farmId","houseId","flockId","eventId","pendingId","abnormalId","financeTab","financeMetric","analysisKey","insightKey","systemKey","settingsKey","aiPreview"];
      const data = {};
      keys.forEach((key) => { if (element.dataset[key]) data[key] = element.dataset[key]; });
      return { action: element.dataset.action, data };
    }
    if (element.classList?.contains("fab")) return { className: "fab" };
    return null;
  }

  function findFocusReturn(meta) {
    if (!meta) return null;
    if (meta.testid) return document.querySelector(`[data-testid="${meta.testid}"]`);
    if (meta.nav) return document.querySelector(`[data-nav="${meta.nav}"]`);
    if (meta.className) return document.querySelector(`.${meta.className}`);
    if (meta.action) {
      return [...document.querySelectorAll(`[data-action="${meta.action}"]`)].find((element) =>
        Object.entries(meta.data || {}).every(([key, value]) => element.dataset[key] === value)
      ) || null;
    }
    return null;
  }

  function trapSheetFocus(event) {
    if (!state.sheet || event.key !== "Tab") return false;
    const panel = document.querySelector(".sheet-panel");
    if (!panel) return false;
    const focusable = [...panel.querySelectorAll('button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')].filter((element) => !element.hidden && element.getClientRects().length);
    if (!focusable.length) { event.preventDefault(); panel.focus(); return true; }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); return true; }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); return true; }
    if (!panel.contains(document.activeElement)) { event.preventDefault(); first.focus(); return true; }
    return false;
  }

  function lockBody() {
    if (document.body.classList.contains("sheet-open")) return;
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    state.scrollY = window.scrollY;
    document.body.style.top = `-${state.scrollY}px`;
    document.body.classList.add("sheet-open");
    void root.offsetHeight;
    window.requestAnimationFrame(() => {
      root.style.scrollBehavior = previousBehavior;
    });
  }

  function restoreScroll(scrollY) {
    const root = document.scrollingElement || document.documentElement;
    const previousBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    void document.documentElement.offsetHeight;
    root.scrollTop = scrollY;
    root.scrollLeft = 0;
    window.requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = previousBehavior;
    });
  }

  function unlockBody() {
    if (!document.body.classList.contains("sheet-open")) return;
    const scrollY = state.scrollY;
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    document.body.classList.remove("sheet-open");
    document.body.style.top = "";
    void root.offsetHeight;
    const scrollingElement = document.scrollingElement || root;
    scrollingElement.scrollTop = scrollY;
    scrollingElement.scrollLeft = 0;
    void root.offsetHeight;
    window.requestAnimationFrame(() => {
      root.style.scrollBehavior = previousBehavior;
    });
  }

  function openSheet(sheet) {
    if (!state.sheet) {
      state.previousFocus = document.activeElement;
      state.previousFocusMeta = captureFocusMeta(document.activeElement);
    }
    state.sheet = sheet;
    render();
    window.requestAnimationFrame(() => document.querySelector(".sheet-close")?.focus());
  }

  function closeSheet() {
    const focusMeta = state.previousFocusMeta;
    const scrollY = state.scrollY;
    state.sheet = null;
    state.contextDraft = null;
    state.resumeAfterFarmSelection = null;
    state.masterDataConfirmation = null;
    state.previousFocus = null;
    state.previousFocusMeta = null;
    render();
    window.requestAnimationFrame(() => {
      const target = findFocusReturn(focusMeta);
      if (target && typeof target.focus === "function") target.focus({ preventScroll: true });
      restoreScroll(scrollY);
    });
  }

  function openContextPicker(resumeAfter = null) {
    state.resumeAfterFarmSelection = resumeAfter;
    openSheet({ kind: "context" });
  }

  function applyDraftContext() {
    if (state.contextDraft) state.context = { ...state.contextDraft };
    state.contextDraft = null;
    closeSheet();
  }

  function render() {
    const desktop = desktopWideMode();
    const mode = labOverlay().mode;
    const modeStatus = mode === "ONLINE" ? "" : `<span class="lab-mode-status">${escapeHtml(labModeLabel(mode))}</span>`;
    const desktopQuick = `<div class="desktop-quick-slot" aria-label="快速行動固定區"><button type="button" class="desktop-quick-button" data-action="open-sheet" data-sheet-kind="quick-actions" aria-label="開啟快速行動" title="快速行動">${icon("plus")}</button></div>`;
    const mobileQuick = `<div class="mobile-quick-slot" aria-label="快速行動固定區"><button type="button" class="mobile-quick-button" data-action="open-sheet" data-sheet-kind="quick-actions" aria-label="開啟快速行動" title="快速行動">${icon("plus")}</button></div>`;
    const header = desktop
      ? `<header class="topbar desktop-topbar"><div class="desktop-topbar-copy"><span class="desktop-page-kicker">目前頁面</span><strong>${currentPageTitle()}</strong><small>${escapeHtml(contextLabel())}</small></div>${desktopQuick}</header>`
      : `<header class="topbar"><div class="brand-lockup mobile-brand"><span class="brand-symbol">🐔</span><span class="brand-copy"><strong>金雞管理中心</strong><span>營運管理 · V14R Plus r4</span></span></div><span class="topbar-status">Plus r4${modeStatus}</span></header>`;
    app.innerHTML = `<div class="app-shell">${desktop ? desktopNavMarkup() : ""}<div class="workspace-shell">${header}<main class="page-shell">${pageMarkup()}</main></div>${desktop ? "" : mobileQuick}${navMarkup()}${renderSheet()}</div>`;
    if (state.sheet) lockBody(); else unlockBody();
  }


  function handleClick(event) {
    const nav = event.target.closest("[data-nav]");
    if (nav) {
      state.page = nav.dataset.nav;
      state.sheet = null;
      state.contextDraft = null;
      state.masterDataConfirmation = null;
      render();
      return;
    }
    const actionElement = event.target.closest("[data-action]");
    if (!actionElement) return;
    const action = actionElement.dataset.action;
    if (action === "open-context") return openContextPicker();
    if (action === "open-context-for-quick-record") return openContextPicker("quick-record");
    if (action === "close-sheet") return closeSheet();
    if (action === "open-sheet") return openSheet({ kind: actionElement.dataset.sheetKind });
    if (action === "open-master-data") {
      if (state.context.farmId !== "all" && state.context.farmId !== "history") state.masterDataFarmId = state.context.farmId;
      state.masterDataError = "";
      state.masterDataConfirmation = null;
      return openSheet({ kind: "master-data" });
    }
    if (action === "authorize-master-data") {
      const result = LAB_ADMIN.authorize({ confirmed: Boolean(document.getElementById("master-admin-confirm")?.checked) });
      if (!result.authorized) return showMasterDataError("請先確認目前位於 PREPROD LAB，才能進入主檔管理。");
      state.masterDataAuthorized = true;
      state.masterDataError = "";
      state.masterDataNotice = "測試環境管理者驗證完成；本次只可寫入 Lab runtime overlay。";
      return openSheet({ kind: "master-data" });
    }
    if (action === "create-farm") return createMasterFarm();
    if (action === "create-house") return createMasterHouse();
    if (action === "create-flock") return createMasterFlock();
    if (action === "assign-caretaker") return assignMasterCaretaker();
    if (action === "cancel-master-operation") {
      state.masterDataConfirmation = null;
      state.masterDataError = "";
      return openSheet({ kind: "master-data" });
    }
    if (action === "confirm-master-operation") return commitMasterDataConfirmation();
    if (action === "select-farm-direct") {
      const farmId = actionElement.dataset.farmId;
      state.context = { farmId, houseId: null, flockId: null };
      const resume = state.resumeAfterFarmSelection;
      state.resumeAfterFarmSelection = null;
      if (resume === "quick-record") return openSheet({ kind: "quick-record" });
      return closeSheet();
    }
    if (action === "select-house-direct") {
      state.context = { farmId: state.context.farmId, houseId: actionElement.dataset.houseId || null, flockId: null };
      return render();
    }
    if (action === "select-flock-direct") {
      state.context = { farmId: state.context.farmId, houseId: state.context.houseId, flockId: actionElement.dataset.flockId || null };
      return render();
    }
    if (action === "toggle-desktop-farm-menu") { state.desktopFarmMenuOpen = !state.desktopFarmMenuOpen; return render(); }
    if (action === "desktop-select-farm-dropdown") { state.context = { farmId: actionElement.dataset.farmId, houseId: null, flockId: null }; state.desktopFarmMenuOpen = false; return render(); }
    if (action === "desktop-set-farm") { state.context = { farmId: actionElement.dataset.farmId, houseId: null, flockId: null }; state.desktopFarmMenuOpen = false; return render(); }
    if (action === "desktop-set-house") { state.context = { farmId: state.context.farmId, houseId: actionElement.dataset.houseId || null, flockId: null }; return render(); }
    if (action === "go-farms") { state.page = "farms"; return render(); }
    if (action === "go-todo") { state.page = "todo"; return render(); }
    if (action === "go-calendar") { state.page = "calendar"; state.sheet = null; return render(); }
    if (action === "go-records") { state.page = "records"; state.sheet = null; return render(); }
    if (action === "calendar-select-date") { state.selectedCalendarDate = actionElement.dataset.date; return render(); }
    if (action === "calendar-prev-month") { calendarMoveMonth(-1); return render(); }
    if (action === "calendar-next-month") { calendarMoveMonth(1); return render(); }
    if (action === "calendar-this-month") { const now = new Date(); state.calendarYear = now.getFullYear(); state.calendarMonth = now.getMonth() + 1; const key = calendarDateKey(state.calendarYear,state.calendarMonth,now.getDate()); state.selectedCalendarDate = key; return render(); }
    if (action === "go-finance") { state.page = "finance"; state.financeTab = "overview"; state.sheet = null; return render(); }
    if (action === "go-ai") { state.page = "ai"; state.sheet = null; return render(); }
    if (action === "ai-preview") { state.aiPreviewKey = actionElement.dataset.aiPreview || "overview"; return render(); }
    if (action === "open-settings-trend") return openSheet({ kind: "settings-detail", key: "trend" });
    if (action === "finance-tab") { state.financeTab = actionElement.dataset.financeTab; return render(); }
    if (action === "records-mode") { state.recordsMode = actionElement.dataset.recordsMode || "list"; return render(); }
    if (action === "records-metric") { state.recordsMetric = actionElement.dataset.recordsMetric || "mortality"; return render(); }
    if (action === "records-farm-filter") { state.recordsFarmFilter = actionElement.dataset.recordsFarmId || "all"; return render(); }
    if (action === "chart-tab") { state.chartTab = actionElement.dataset.chartTab || "stock"; return render(); }
    if (action === "open-flock") return openSheet({ kind: "flock", id: actionElement.dataset.flockId });
    if (action === "open-pending-item") return openSheet({ kind: "pending-item", id: actionElement.dataset.pendingId });
    if (action === "open-abnormal") return openSheet({ kind: "abnormal-item", id: actionElement.dataset.abnormalId });
    if (action === "open-event") return openSheet({ kind: "event-item", id: actionElement.dataset.eventId });
    if (action === "open-farm-detail") return openSheet({ kind: "farm-detail", farmId: actionElement.dataset.farmId });
    if (action === "open-house-detail") return openSheet({ kind: "house-detail", farmId: actionElement.dataset.farmId, houseId: actionElement.dataset.houseId });
    if (action === "open-finance-farm") return openSheet({ kind: "finance-farm", farmId: actionElement.dataset.farmId });
    if (action === "open-investor-detail") return openSheet({ kind: "investor-detail", investorId: actionElement.dataset.investorId });
    if (action === "open-expense-detail") return openSheet({ kind: "expense-detail", farmId: actionElement.dataset.farmId });
    if (action === "open-distribution-detail") return openSheet({ kind: "distribution-detail", distributionId: actionElement.dataset.distributionId });
    if (action === "open-finance-metric") return openSheet({ kind: "finance-metric", metric: actionElement.dataset.financeMetric });
    if (action === "open-analysis-detail") return openSheet({ kind: "analysis-detail", key: actionElement.dataset.analysisKey });
    if (action === "open-insight-detail") return openSheet({ kind: "insight-detail", key: actionElement.dataset.insightKey });
    if (action === "open-system-detail") return openSheet({ kind: "system-detail", key: actionElement.dataset.systemKey });
    if (action === "open-settings-detail") return openSheet({ kind: "settings-detail", key: actionElement.dataset.settingsKey });
    if (action === "set-farm-scope") {
      state.context = { farmId: actionElement.dataset.farmId, houseId: null, flockId: null };
      state.page = "farms";
      return closeSheet();
    }
    if (action === "set-house-scope") {
      state.context = { farmId: actionElement.dataset.farmId, houseId: actionElement.dataset.houseId, flockId: null };
      state.page = "farms";
      return closeSheet();
    }
    if (action === "start-quick-record-farm") {
      state.context = { farmId: actionElement.dataset.farmId, houseId: null, flockId: null };
      state.quickRecordDraft = "";
      return openSheet({ kind: "quick-record" });
    }
    if (action === "open-quick-record") return openSheet({ kind: "quick-record" });
    if (action === "preview-quick-record") {
      state.quickRecordDraft = document.getElementById("quick-record-input")?.value.trim() || "";
      return openSheet({ kind: "quick-record-preview" });
    }
    if (action === "back-quick-record") return openSheet({ kind: "quick-record" });
    if (action === "commit-lab-event") return commitLabEvent();
    if (action === "save-pending-review") return savePendingReviewFromDraft();
    if (action === "open-correction") return openSheet({ kind: "correction", id: actionElement.dataset.eventId });
    if (action === "commit-correction") return commitCorrection(actionElement.dataset.eventId);
    if (action === "set-lab-mode") {
      const mode = actionElement.dataset.mode;
      LAB_STORE.setMode(mode);
      if (mode === "ONLINE") LAB_STORE.sync({ backendAvailable: true });
      state.quickRecordNotice = mode === "ONLINE" ? "Lab adapter 已回到 ONLINE；待同步操作已做冪等 mock sync。" : `Lab adapter 已切換為 ${labModeLabel(mode)}。`;
      return openSheet({ kind: "developer-fallback" });
    }
    if (action === "reset-lab-fixture") {
      if (window.confirm("確定要清除本機 Lab overlay 與 outbox，回復 V7 fixture？變更紀錄會保留。")) {
        LAB_STORE.resetFixture();
        state.quickRecordDraft = "";
        state.quickRecordNotice = "已回復 V7 fixture；原始 fixture 未被修改，變更紀錄已保留。";
        state.correctionNotice = "";
      }
      return openSheet({ kind: "developer-fallback" });
    }
    if (action === "save-trend-thresholds") {
      const next = {};
      document.querySelectorAll("[data-threshold-key]").forEach((input) => { next[input.dataset.thresholdKey] = Number(input.value); });
      saveTrendThresholds(next);
      state.settingsNotice = "趨勢提醒門檻已儲存在此瀏覽器";
      return openSheet({ kind: "settings-detail", key: "trend" });
    }
    if (action === "reset-trend-thresholds") {
      safeLocalSet(TREND_SETTINGS_KEY, JSON.stringify(TREND_THRESHOLD_DEFAULTS));
      state.settingsNotice = "已恢復預設趨勢門檻";
      return openSheet({ kind: "settings-detail", key: "trend" });
    }
    if (action === "toggle-ai-simulation") {
      safeLocalSet(DEV_AI_STATUS_KEY, simulatedAiAvailable() ? "unavailable" : "available");
      return openSheet({ kind: "developer-diagnostics" });
    }
    if (action === "save-dev-note") {
      const value = document.getElementById("developer-note-input")?.value || "";
      safeLocalSet(DEV_NOTE_KEY, value);
      state.developerNotice = "已儲存於本機";
      return openSheet({ kind: "developer-notes" });
    }
    if (action === "reset-dev-analytics") {
      if (window.confirm("確定要清除本機點擊計數與 UI Log？")) {
        developerAnalytics = { counts: {}, log: [] };
        saveDeveloperAnalytics();
        state.developerNotice = "已重設";
      }
      return openSheet({ kind: "developer-clicks" });
    }
    if (action === "export-dev-analytics") {
      const payload = { build: "jinji-v14r-plus-r4-desktop-v6-calendar", exportedAt: new Date().toISOString(), analytics: developerAnalytics, note: developerNote() };
      const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
      const link = document.createElement("a"); link.href = url; link.download = `jinji-v14r-plus-r4-dev-${Date.now()}.json`; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
      return;
    }
    if (action === "jump-context") {
      state.context = { farmId: actionElement.dataset.farmId, houseId: actionElement.dataset.houseId || null, flockId: actionElement.dataset.flockId || null };
      state.page = "today";
      return closeSheet();
    }
  }

  function handleChange(event) {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    if (target.dataset.action === "select-master-farm") {
      state.masterDataFarmId = target.value;
      state.masterDataHouseId = null;
      state.masterDataError = "";
      return openSheet({ kind: "master-data" });
    }
    if (target.dataset.action === "select-master-house") {
      state.masterDataHouseId = target.value;
      state.masterDataError = "";
      return openSheet({ kind: "master-data" });
    }
  }


  function chartTooltipElement() {
    let tooltip = document.getElementById("chart-query-tooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "chart-query-tooltip";
      tooltip.className = "chart-query-tooltip";
      tooltip.setAttribute("role", "status");
      tooltip.setAttribute("aria-live", "polite");
      document.body.appendChild(tooltip);
    }
    return tooltip;
  }

  function showChartTooltip(target, event = null) {
    if (!target?.dataset?.chartTip) return;
    const tooltip = chartTooltipElement();
    tooltip.textContent = target.dataset.chartTip;
    tooltip.classList.add("visible");
    const rect = target.getBoundingClientRect();
    let x = event?.clientX ?? (rect.left + rect.width / 2);
    let y = event?.clientY ?? rect.top;
    const width = Math.min(tooltip.offsetWidth || 220, window.innerWidth - 24);
    x = Math.max(12 + width / 2, Math.min(window.innerWidth - 12 - width / 2, x));
    y = Math.max(62, y - 14);
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  }

  function hideChartTooltip() {
    document.getElementById("chart-query-tooltip")?.classList.remove("visible");
  }

  let handleStartY = null;
  document.addEventListener("click", (event) => {
    const component = event.target.closest("button, [data-action], [data-nav]");
    if (component) recordComponentClick(component);
    const hadFarmMenu = state.desktopFarmMenuOpen;
    if (hadFarmMenu && !event.target.closest(".desktop-farm-dropdown-wrap")) state.desktopFarmMenuOpen = false;
    handleClick(event);
    if (hadFarmMenu && !event.target.closest(".desktop-farm-dropdown-wrap") && !component) render();
  });
  document.addEventListener("change", handleChange);
  document.addEventListener("pointerover", (event) => {
    const target = event.target.closest("[data-chart-tip]");
    if (target && event.pointerType !== "touch") showChartTooltip(target, event);
  });
  document.addEventListener("pointermove", (event) => {
    const target = event.target.closest("[data-chart-tip]");
    if (target && event.pointerType !== "touch") showChartTooltip(target, event);
  });
  document.addEventListener("pointerout", (event) => {
    if (event.target.closest("[data-chart-tip]") && event.pointerType !== "touch") hideChartTooltip();
  });
  document.addEventListener("focusin", (event) => {
    const target = event.target.closest("[data-chart-tip]");
    if (target) showChartTooltip(target);
  });
  document.addEventListener("focusout", (event) => {
    if (event.target.closest("[data-chart-tip]")) hideChartTooltip();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.sheet) { event.preventDefault(); closeSheet(); return; }
    trapSheetFocus(event);
  });
  document.addEventListener("pointerdown", (event) => {
    const chartTarget = event.target.closest("[data-chart-tip]");
    if (chartTarget) showChartTooltip(chartTarget, event); else if (!event.target.closest("#chart-query-tooltip")) hideChartTooltip();
    if (event.target.closest(".sheet-handle")) handleStartY = event.clientY;
  });
  document.addEventListener("pointerup", (event) => {
    if (handleStartY !== null && handleStartY - event.clientY < -70 && state.sheet) closeSheet();
    handleStartY = null;
  });

  let lastWideMode = desktopWideMode();
  let resizeFrame = null;
  window.addEventListener("resize", () => {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      const nextWideMode = desktopWideMode();
      if (nextWideMode !== lastWideMode) {
        lastWideMode = nextWideMode;
        state.sheet = null;
        state.contextDraft = null;
        render();
      }
    });
  });

  assertDataContract();
  render();
})();
