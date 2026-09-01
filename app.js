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

  const DATA = {
    farms: [
      { id: "all", name: "全部雞場", subtitle: "全域總覽", readOnly: true, stock: 31412, mortality: 6, cull: 1, net: 115000, houses: [] },
      { id: "red", name: "稽核紅羽一場", subtitle: "紅羽場區", stock: 6812, mortality: 5, cull: null, net: 31800, houses: [
        { id: "red-1", name: "紅羽一舍", code: "H1", flocks: [{ id: "alpha", code: "AUDIT-RED-ALPHA", status: "7 日內準備出雞", stock: 6812 }] },
        { id: "red-2", name: "紅羽二舍", code: "H2", flocks: [{ id: "beta", code: "AUDIT-RED-BETA", status: "進行中", stock: null }] },
      ] },
      { id: "black", name: "稽核黑羽二場", subtitle: "黑羽場區", stock: null, mortality: null, cull: null, net: 40500, houses: [
        { id: "black-1", name: "黑羽主舍", code: "H1", flocks: [{ id: "black-main", code: "AUDIT-BLACK-MAIN", status: "進行中", stock: null }] },
      ] },
      { id: "silkie", name: "稽核烏骨三場", subtitle: "烏骨場區", stock: null, mortality: 1, cull: null, net: 26700, houses: [
        { id: "silkie-1", name: "烏骨一舍", code: "H1", flocks: [{ id: "silkie-alpha", code: "AUDIT-SILK-ALPHA", status: "進行中", stock: null }] },
      ] },
      { id: "new", name: "稽核新批四場", subtitle: "新批場區", stock: null, mortality: null, cull: null, net: -600, houses: [
        { id: "new-1", name: "新批主舍", code: "H1", flocks: [{ id: "new-main", code: "AUDIT-NEW-MAIN", status: "進行中", stock: null }] },
      ] },
      { id: "history", name: "稽核歷史五場", subtitle: "歷史 review 區", stock: null, mortality: null, cull: null, net: 16600, houses: [
        { id: "history-1", name: "歷史主舍", code: "H1", flocks: [{ id: "history-now", code: "AUDIT-HISTORY-NOW", status: "進行中", stock: null }] },
      ] },
    ],
    pending: [
      { id: "pending-1", title: "死亡紀錄待人工確認", context: "稽核紅羽一場 / 紅羽一舍", kind: "死亡紀錄" },
      { id: "pending-2", title: "飼料紀錄待人工確認", context: "稽核烏骨三場 / 烏骨一舍", kind: "飼料紀錄" },
      { id: "pending-3", title: "飲水異常待人工確認", context: "稽核新批四場 / 新批主舍", kind: "飲水紀錄" },
      { id: "pending-4", title: "歷史批次資料待人工確認", context: "稽核歷史五場 / 歷史主舍", kind: "批次資料" },
    ],
    abnormalities: [
      { id: "abnormal-1", title: "紅羽一舍通風異常", context: "稽核紅羽一場 / 紅羽一舍 / AUDIT-RED-ALPHA", state: "待留意" },
      { id: "abnormal-2", title: "黑羽主舍溫度偏高", context: "稽核黑羽二場 / 黑羽主舍 / AUDIT-BLACK-MAIN", state: "待留意" },
    ],
    mortality: [
      { farmId: "red", houseId: "red-1", flockId: "alpha", farm: "稽核紅羽一場", house: "紅羽一舍", quantity: 5 },
      { farmId: "silkie", houseId: "silkie-1", flockId: "silkie-alpha", farm: "稽核烏骨三場", house: "烏骨一舍", quantity: 1 },
    ],
    activeFlocks: [
      { farmId: "red", houseId: "red-1", id: "alpha", code: "AUDIT-RED-ALPHA", farm: "稽核紅羽一場", house: "紅羽一舍", status: "7 日內準備出雞", upcoming: true },
      { farmId: "red", houseId: "red-2", id: "beta", code: "AUDIT-RED-BETA", farm: "稽核紅羽一場", house: "紅羽二舍", status: "進行中" },
      { farmId: "black", houseId: "black-1", id: "black-main", code: "AUDIT-BLACK-MAIN", farm: "稽核黑羽二場", house: "黑羽主舍", status: "進行中" },
      { farmId: "silkie", houseId: "silkie-1", id: "silkie-alpha", code: "AUDIT-SILK-ALPHA", farm: "稽核烏骨三場", house: "烏骨一舍", status: "進行中" },
      { farmId: "new", houseId: "new-1", id: "new-main", code: "AUDIT-NEW-MAIN", farm: "稽核新批四場", house: "新批主舍", status: "進行中" },
      { farmId: "history", houseId: "history-1", id: "history-now", code: "AUDIT-HISTORY-NOW", farm: "稽核歷史五場", house: "歷史主舍", status: "進行中" },
    ],
    records: [
      { title: "今日死亡", detail: "稽核紅羽一場 / 紅羽一舍", value: "5 隻", tone: "alert" },
      { title: "今日死亡", detail: "稽核烏骨三場 / 烏骨一舍", value: "1 隻", tone: "alert" },
      { title: "今日淘汰", detail: "全部雞場 / 今日固定基線", value: "1 隻", tone: "warn" },
    ],
    history: [
      { label: "07/01", value: 76000 },
      { label: "07/15", value: 84200 },
      { label: "08/01", value: 96500 },
      { label: "08/15", value: 107500 },
      { label: "09/01", value: 115000 },
    ],
    finance: {
      gross: 204000,
      allocated: 120000,
      expense: 5000,
      net: 115000,
      farmNets: [
        ["稽核紅羽一場", 31800],
        ["稽核黑羽二場", 40500],
        ["稽核烏骨三場", 26700],
        ["稽核新批四場", -600],
        ["稽核歷史五場", 16600],
      ],
    },
  };

  const NAV = [
    ["today", "今日", "digest"],
    ["farms", "場務", "farm"],
    ["records", "紀錄", "records"],
    ["todo", "待辦", "todo"],
    ["more", "更多", "more"],
  ];

  const state = {
    page: "today",
    context: { farmId: "red", houseId: "red-1", flockId: "alpha" },
    contextDraft: null,
    contextStep: "farm",
    sheet: null,
    financeTab: "overview",
    previousFocus: null,
    scrollY: 0,
  };

  const app = document.getElementById("app");

  function icon(name, className = "") {
    return `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SVG[name] || SVG.spark}</svg>`;
  }

  function number(value) {
    return value === null || value === undefined ? "—" : Number(value).toLocaleString("zh-TW");
  }

  function money(value) {
    return value === null || value === undefined ? "—" : Number(value).toLocaleString("zh-TW");
  }

  function farmById(id) {
    return DATA.farms.find((farm) => farm.id === id) || DATA.farms[0];
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
    if (context.farm.id === "all") return "全部雞場 · 全域總覽 · 唯讀";
    if (!context.house) return `${context.farm.name} · 選擇雞舍`;
    if (!context.flock) return `${context.farm.name} · ${context.house.name}`;
    return `${context.house.name} · ${context.flock.code}`;
  }

  function contextShortLabel(context = currentContext()) {
    if (context.farm.id === "all") return "全部雞場";
    return context.farm.name;
  }

  function contextBar() {
    const context = currentContext();
    const subline = context.farm.id === "all" ? "全域總覽 · 唯讀" : `${context.house?.name || "尚未選擇雞舍"} · ${context.flock?.code || "尚未選擇批次"}`;
    return `<button class="context-identity" data-action="open-context" data-testid="context-identity" aria-label="目前範圍：${contextLabel(context)}。開啟範圍選擇器">
      <span class="context-icon">${icon("pin")}</span>
      <span class="context-copy"><small>目前範圍</small><strong>${contextShortLabel(context)}</strong><span>${subline}</span></span>
      <span class="context-chevron" aria-hidden="true">›</span>
    </button>`;
  }

  function pageIntro(kicker, title, description = "") {
    return `<div class="page-intro"><div><p class="kicker">${kicker}</p><h1>${title}</h1>${description ? `<p class="intro-description">${description}</p>` : ""}</div><span class="env-chip">SYNTHETIC</span></div>`;
  }

  function stockDetail(context) {
    if (context.farm.id === "all") return "全部雞場固定基線";
    if (context.farm.id === "red") return "紅羽一場／紅羽一舍固定基線";
    return "此範圍未另設目前存欄基線";
  }

  function mortalityValue(context) {
    if (context.farm.id === "all") return 6;
    if (context.farm.id === "red") return 5;
    if (context.farm.id === "silkie") return 1;
    return null;
  }

  function digestCopy(context) {
    if (context.farm.id === "all") return "今日死亡 6 隻，其中稽核紅羽一場 5 隻；1 批在 7 日內準備出雞；4 筆資料待人工確認。";
    if (context.farm.id === "red") return "紅羽一舍今日死亡 5 隻；AUDIT-RED-ALPHA 在 7 日內準備出雞；4 筆資料待人工確認。";
    return `${context.farm.name}目前顯示固定 review 範圍；1 批在 7 日內準備出雞；4 筆資料待人工確認。`;
  }

  function scopedFlocks() {
    if (state.context.farmId === "all") return DATA.activeFlocks;
    return DATA.activeFlocks.filter((flock) => flock.farmId === state.context.farmId);
  }

  function scopedMortality() {
    if (state.context.farmId === "all") return DATA.mortality;
    return DATA.mortality.filter((item) => item.farmId === state.context.farmId);
  }

  function navMarkup() {
    return `<nav class="bottom-nav" aria-label="主要導覽">${NAV.map(([key, label, iconName]) => `<button type="button" data-nav="${key}" class="${state.page === key || (key === "more" && ["finance", "ai"].includes(state.page)) ? "active" : ""}" aria-current="${state.page === key || (key === "more" && ["finance", "ai"].includes(state.page)) ? "page" : "false"}">${icon(iconName, "nav-icon")}<span>${label}</span></button>`).join("")}</nav>`;
  }

  function renderToday() {
    const context = currentContext();
    const mortality = mortalityValue(context);
    return `<section class="page" data-page="today">
      ${contextBar()}
      ${pageIntro("2026 / 09 / 01 · 今日焦點", "今天，先處理最重要的事")}
      <section class="digest" aria-labelledby="digest-title">
        <div class="digest-head"><p class="kicker">SMART DIGEST · DETERMINISTIC</p><span class="digest-mark">${icon("digest")}</span></div>
        <h2 id="digest-title">${digestCopy(context)}</h2>
        <p>只呈現固定 prototype data；沒有外部請求，也不會替現場推算新的 KPI。</p>
      </section>
      <div class="section-heading"><div><h2>今天需處理</h2><p>先看有明確細節的三件事。</p></div><span class="scope-chip">最多 3 項</span></div>
      <section class="action-list" aria-label="今天需處理">
        <button type="button" class="action-card" data-action="open-sheet" data-sheet-kind="pending">
          <span class="action-icon">${icon("check")}</span><span class="action-copy"><strong>4 筆需要人工確認</strong><span>逐筆檢視資料來源與目前範圍</span></span><span class="action-count">4</span><span class="action-arrow">›</span>
        </button>
        <button type="button" class="action-card good" data-action="open-sheet" data-sheet-kind="upcoming">
          <span class="action-icon">${icon("flock")}</span><span class="action-copy"><strong>1 批 7 日內準備出雞</strong><span>AUDIT-RED-ALPHA · 查看 flock detail</span></span><span class="action-count">1</span><span class="action-arrow">›</span>
        </button>
        <button type="button" class="action-card alert" data-action="open-sheet" data-sheet-kind="abnormal">
          <span class="action-icon">${icon("warning")}</span><span class="action-copy"><strong>異常需要留意</strong><span>紅羽一舍通風、黑羽主舍溫度</span></span><span class="action-arrow">›</span>
        </button>
      </section>
      <section class="hero-metric" aria-label="目前存欄">
        <div><p class="kicker">目前存欄 · ${contextShortLabel(context)}</p><strong data-testid="stock-value">${number(context.farm.stock)}</strong><p>${stockDetail(context)}</p></div>
        <div class="hero-side"><span class="hero-icon">${icon("flock")}</span><span class="metric-label">主要指標</span><button type="button" class="ghost-light" data-action="go-farms">查看場務</button></div>
      </section>
      <div class="quick-summary">
        <button type="button" class="summary-tile alert" data-action="open-sheet" data-sheet-kind="mortality"><span class="tile-label">今日死亡 <span aria-hidden="true">›</span></span><strong data-testid="mortality-value">${number(mortality)}</strong><small>${context.farm.id === "all" ? "紅羽 5 · 烏骨 1" : "目前範圍固定基線"}</small></button>
        <div class="summary-tile good"><span class="tile-label">今日淘汰</span><strong>${number(context.farm.id === "all" ? 1 : null)}</strong><small>目前 prototype baseline</small></div>
      </div>
      <div class="sync-note"><strong>Context sync：</strong>Today、Farm、Records、Todo、Finance、AI context 與 drill-down 都跟隨目前範圍。點擊上方 identity bar 切換。</div>
    </section>`;
  }

  function renderFarms() {
    const context = currentContext();
    const flocks = scopedFlocks();
    const farms = state.context.farmId === "all" ? DATA.farms.slice(1) : [context.farm];
    return `<section class="page" data-page="farms">
      ${contextBar()}
      ${pageIntro("FARM WORKBENCH", "場務", "目前範圍會同步到場務、批次與 drill-down。")}
      <div class="filter-note"><span><strong>目前範圍</strong>　${contextLabel(context)}</span><span class="status-chip good">唯讀 spike</span></div>
      <section class="hero-metric" aria-label="場務目前存欄">
        <div><p class="kicker">目前存欄</p><strong data-testid="farm-stock-value">${number(context.farm.stock)}</strong><p>${stockDetail(context)}</p></div>
        <div class="hero-side"><span class="hero-icon">${icon("farm")}</span><span class="metric-label">進行中批次 ${context.farm.id === "all" ? "6" : number(flocks.length)}</span></div>
      </section>
      <div class="section-heading"><div><h2>${state.context.farmId === "all" ? "全部雞場" : "目前場區"}</h2><p>僅列出本 prototype 的固定 review context。</p></div></div>
      <section class="farm-grid">${farms.map((farm) => `<article class="farm-item"><div><h3>${farm.name}</h3><p>${farm.subtitle} · ${farm.id === "all" ? "全域總覽" : "synthetic context"}</p></div><div class="farm-metric"><strong>${money(farm.net)}</strong><span>淨額</span></div></article>`).join("")}</section>
      <section class="content-panel"><div class="panel-title"><div><h3>進行中批次</h3><p>${state.context.farmId === "all" ? "全部雞場固定基線：6 批。" : `${contextShortLabel(context)} 的可檢視批次。`}</p></div><button type="button" class="text-link" data-action="open-sheet" data-sheet-kind="flocks">查看全部 →</button></div><div class="list-stack">${flocks.slice(0, 3).map((flock) => flockRow(flock)).join("")}</div></section>
    </section>`;
  }

  function flockRow(flock) {
    return `<button type="button" class="list-row" data-action="open-flock" data-flock-id="${flock.id}"><span><strong>${flock.code}</strong><span>${flock.farm} / ${flock.house}</span></span><span class="row-end"><span class="status-chip ${flock.upcoming ? "good" : ""}">${flock.status}</span><span class="row-arrow">›</span></span></button>`;
  }

  function renderRecords() {
    const context = currentContext();
    const records = state.context.farmId === "all" ? DATA.records : DATA.records.filter((record) => record.detail.startsWith(context.farm.name));
    return `<section class="page" data-page="records">
      ${contextBar()}
      ${pageIntro("RECORDS", "紀錄", "依目前範圍檢視已固定的 synthetic operating records。")}
      <div class="filter-note"><span><strong>目前範圍</strong>　${contextLabel(context)}</span><span class="scope-chip">資料時間 · 今日</span></div>
      <section class="content-panel"><div class="panel-title"><div><h3>今日快速紀錄</h3><p>死亡與淘汰摘要可由 Today 直接 drill down。</p></div><span class="status-chip warn">review only</span></div><div class="list-stack">${records.length ? records.map((record) => `<div class="list-row"><span><strong>${record.title}</strong><span>${record.detail}</span></span><span class="row-end"><span class="status-chip ${record.tone === "alert" ? "alert" : "warn"}">${record.value}</span></span></div>`).join("") : `<div class="empty-tab"><strong>此範圍沒有另設今日紀錄</strong><p>Prototype 保留原始範圍，不自行推算新的營運數字。</p></div>`}</div></section>
      <section class="content-grid"><div class="content-panel"><h3>需要人工確認</h3><p>4 筆固定 review items 仍可從待辦或 Today 進入詳細清單。</p><button type="button" class="text-link" data-action="go-todo">前往待辦 →</button></div><div class="content-panel"><h3>資料邊界</h3><p>這個畫面沒有連線、沒有寫入，也不會把 synthetic review data 描述成 Production data。</p></div></section>
    </section>`;
  }

  function renderTodo() {
    const context = currentContext();
    const pending = DATA.pending;
    return `<section class="page" data-page="todo">
      ${contextBar()}
      ${pageIntro("TODO", "待辦", "只放有明確下一步的固定 prototype items。")}
      <section class="action-list"><button type="button" class="action-card" data-action="open-sheet" data-sheet-kind="pending"><span class="action-icon">${icon("check")}</span><span class="action-copy"><strong>4 筆需要人工確認</strong><span>目前範圍：${contextShortLabel(context)}</span></span><span class="action-count">4</span><span class="action-arrow">›</span></button><button type="button" class="action-card good" data-action="open-sheet" data-sheet-kind="upcoming"><span class="action-icon">${icon("flock")}</span><span class="action-copy"><strong>1 批 7 日內準備出雞</strong><span>AUDIT-RED-ALPHA · 可查看 flock detail</span></span><span class="action-count">1</span><span class="action-arrow">›</span></button></section>
      <section class="content-panel"><div class="panel-title"><div><h3>待人工確認清單</h3><p>每筆都有 context，不用猜測資料歸屬。</p></div><span class="status-chip warn">4 筆</span></div><div class="list-stack">${pending.map((item) => `<button type="button" class="list-row" data-action="open-pending-item" data-pending-id="${item.id}"><span><strong>${item.title}</strong><span>${item.context}</span></span><span class="row-end"><span class="row-value">${item.kind}</span><span class="row-arrow">›</span></span></button>`).join("")}</div></section>
    </section>`;
  }

  function renderMore() {
    const context = currentContext();
    return `<section class="page" data-page="more">
      ${contextBar()}
      ${pageIntro("WORKBENCH", "更多", "Finance 與 AI context 仍然跟隨目前範圍。")}
      <div class="more-list">
        <button type="button" class="more-item" data-action="go-finance"><span class="more-item-icon">${icon("finance")}</span><span><strong>財務</strong><span>總覽、各場、投資人／股權、費用、分配、統計分析</span></span><span>›</span></button>
        <button type="button" class="more-item" data-action="go-ai"><span class="more-item-icon">${icon("ai")}</span><span><strong>AI context</strong><span>只顯示 deterministic context 摘要，不會發出 AI request。</span></span><span>›</span></button>
        <button type="button" class="more-item" data-action="open-sheet" data-sheet-kind="flocks"><span class="more-item-icon">${icon("flock")}</span><span><strong>批次 drill-down</strong><span>查看目前範圍可檢視的進行中批次。</span></span><span>›</span></button>
      </div>
      <div class="sync-note"><strong>隔離狀態：</strong>本頁與整個 lab 都是 synthetic review prototype，沒有 Production backend connection。</div>
    </section>`;
  }

  function renderAi() {
    const context = currentContext();
    return `<section class="page" data-page="ai">
      ${contextBar()}
      ${pageIntro("AI CONTEXT", "AI context", "這裡只展示 context binding 的 UX，不執行模型呼叫。")}
      <section class="digest"><div class="digest-head"><p class="kicker">DETERMINISTIC CONTEXT</p><span class="digest-mark">${icon("ai")}</span></div><h2>${contextLabel(context)}</h2><p>Today、場務、紀錄、待辦、財務與 drill-down 會使用同一個目前範圍。所有文字都來自固定 prototype data。</p></section>
      <section class="content-grid"><div class="content-panel"><h3>目前範圍</h3><p>${contextLabel(context)}</p></div><div class="content-panel"><h3>資料模式</h3><p>synthetic review only · no external requests</p></div></section>
      <button type="button" class="sheet-primary" data-action="open-context">切換目前範圍</button>
    </section>`;
  }

  function financeContext() {
    const context = currentContext();
    if (context.farm.id === "all") return { gross: DATA.finance.gross, allocated: DATA.finance.allocated, expense: DATA.finance.expense, net: DATA.finance.net, chart: true };
    return { gross: null, allocated: null, expense: null, net: context.farm.net, chart: false };
  }

  function chartMarkup() {
    const values = DATA.history;
    const width = 680;
    const height = 240;
    const left = 48;
    const right = 24;
    const top = 24;
    const bottom = 40;
    const min = 70000;
    const max = 120000;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;
    const points = values.map((item, index) => {
      const x = left + (plotWidth * index) / (values.length - 1);
      const y = top + ((max - item.value) / (max - min)) * plotHeight;
      return { ...item, x, y };
    });
    const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
    const area = `${points[0].x},${height - bottom} ${polyline} ${points[points.length - 1].x},${height - bottom}`;
    const yTicks = [70000, 95000, 120000];
    return `<div class="chart-wrap"><svg class="net-chart" data-testid="finance-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="synthetic review only 歷史淨值變化折線圖，最後資料點為 115,000">
      ${yTicks.map((tick) => { const y = top + ((max - tick) / (max - min)) * plotHeight; return `<line class="chart-grid" x1="${left}" x2="${width - right}" y1="${y}" y2="${y}"/><text class="chart-axis" x="4" y="${y + 4}">${money(tick)}</text>`; }).join("")}
      <polygon class="chart-area" points="${area}"/><polyline class="chart-line" points="${polyline}"/>
      ${points.map((point, index) => `<circle class="chart-point ${index === points.length - 1 ? "current" : ""}" cx="${point.x}" cy="${point.y}" r="${index === points.length - 1 ? 6 : 4}"/><text class="chart-axis" text-anchor="middle" x="${point.x}" y="${height - 13}">${point.label}</text>${index === points.length - 1 ? `<text class="chart-value" text-anchor="end" x="${point.x - 10}" y="${point.y - 12}">${money(point.value)}</text>` : ""}`).join("")}
    </svg></div>`;
  }

  function renderFinanceOverview() {
    const totals = financeContext();
    const context = currentContext();
    return `<section class="finance-header"><div class="finance-kpis"><div class="finance-kpi"><span>毛利</span><strong>${money(totals.gross)}</strong></div><div class="finance-kpi amber"><span>已配置</span><strong>${money(totals.allocated)}</strong></div><div class="finance-kpi red"><span>費用</span><strong>${money(totals.expense)}</strong></div><div class="finance-kpi green"><span>目前淨額</span><strong data-testid="finance-net">${money(totals.net)}</strong></div></div><div class="metric-note"><strong>${context.farm.id === "all" ? "全部雞場財務 baseline" : `${context.farm.name} 淨額`}</strong><span>${context.farm.id === "all" ? "總覽 KPI 使用固定 prototype baseline。" : "只顯示已提供的各場淨額；未提供的欄位保持空白。"}</span></div></section>${totals.chart ? `<section class="chart-panel"><div class="chart-title"><div><h3>歷史淨值變化</h3><p>固定 review-only history · 最後一點對齊目前淨額</p></div><span class="status-chip warn">synthetic review only</span></div>${chartMarkup()}</section>` : `<section class="chart-panel"><div class="chart-title"><div><h3>歷史淨值變化</h3><p>切換至全部雞場查看 global synthetic review-only history。</p></div><span class="status-chip warn">scope limited</span></div><div class="empty-tab"><strong>目前範圍不顯示 global history</strong><p>避免把全部雞場的 synthetic history 誤讀成 ${context.farm.name} 的正式歷史。</p></div></section>`}`;
  }

  function financeTabBody() {
    if (state.financeTab === "overview") return renderFinanceOverview();
    if (state.financeTab === "farms") return `<section class="content-panel"><div class="panel-title"><div><h3>各場</h3><p>固定 prototype 各場淨額。</p></div><span class="status-chip good">5 場</span></div><div class="list-stack">${DATA.finance.farmNets.map(([name, value]) => `<div class="list-row"><span><strong>${name}</strong><span>synthetic review net</span></span><span class="row-end"><span class="row-value">${money(value)}</span></span></div>`).join("")}</div></section>`;
    const tabCopy = {
      equity: ["投資人／股權", "本 spike 保留資訊架構入口；未加入未授權的股權比例或投資報酬數據。"],
      expenses: ["費用", "目前只呈現總覽固定 baseline 的費用欄位：5,000。"],
      distribution: ["分配", "本 spike 保留分配入口；沒有自行推算新的分配數字。"],
      analysis: ["統計分析", "本 spike 只提供歷史淨值圖，並明確標示 synthetic review only。"],
    };
    const [title, copy] = tabCopy[state.financeTab] || tabCopy.analysis;
    return `<section class="empty-tab"><strong>${title}</strong><p>${copy}</p><span class="status-chip warn">prototype scope</span></section>`;
  }

  function renderFinance() {
    const tabs = [["overview", "總覽"], ["farms", "各場"], ["equity", "投資人／股權"], ["expenses", "費用"], ["distribution", "分配"], ["analysis", "統計分析"]];
    return `<section class="page" data-page="finance">
      ${contextBar()}
      ${pageIntro("FINANCE", "財務", "保留完整資訊架構；先完成總覽 KPI、各場淨額與歷史淨值圖。")}
      <div class="finance-tabs" role="tablist" aria-label="財務分頁">${tabs.map(([key, label]) => `<button type="button" role="tab" aria-selected="${state.financeTab === key}" class="finance-tab ${state.financeTab === key ? "active" : ""}" data-action="finance-tab" data-finance-tab="${key}">${label}</button>`).join("")}</div>
      ${financeTabBody()}
      <div class="sync-note"><strong>Finance context：</strong>${contextLabel()}。所有財務資料都是 synthetic，沒有 Production history 或外部資料來源。</div>
    </section>`;
  }

  function sheetShell(title, subtitle, body, kind) {
    return `<div class="sheet-layer" data-testid="bottom-sheet"><div class="sheet-backdrop" data-action="close-sheet" aria-hidden="true"></div><section class="sheet-panel" data-sheet-kind="${kind}" role="dialog" aria-modal="true" aria-labelledby="sheet-title" tabindex="-1"><div class="sheet-head"><div class="sheet-handle" aria-hidden="true"></div><div class="sheet-head-row"><div><h2 id="sheet-title">${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ""}</div><button type="button" class="sheet-close" data-action="close-sheet" aria-label="關閉">×</button></div></div><div class="sheet-body">${body}</div></section></div>`;
  }

  function contextSheet() {
    const draft = state.contextDraft || state.context;
    const farm = farmById(draft.farmId);
    if (state.contextStep === "farm") {
      const farmOptions = DATA.farms.map((option) => `<button type="button" class="option-row ${draft.farmId === option.id ? "selected" : ""}" data-action="select-farm" data-farm-id="${option.id}"><span><strong>${option.name}</strong><span>${option.subtitle}${option.id === "all" ? " · 全域總覽、唯讀" : " · 選後再選雞舍"}</span></span><span class="option-check">${draft.farmId === option.id ? icon("check") : icon("arrow")}</span></button>`).join("");
      return sheetShell("切換目前範圍", "依序選擇雞場 → 雞舍 → 批次。全部雞場為全域唯讀總覽。", `<div class="sheet-step"><strong>1 / 3　雞場</strong><span>目前：${farm.name}</span></div><div class="option-list">${farmOptions}</div><div class="readonly-note">選擇「全部雞場」會套用全域總覽；選擇單一雞場後，下一步會列出可用雞舍。</div>`, "context");
    }
    if (state.contextStep === "house") {
      const houses = farm.houses || [];
      return sheetShell("選擇雞舍", `${farm.name} · 先選雞舍，再選批次。`, `<div class="sheet-step"><button type="button" class="step-back" data-action="context-step" data-step="farm">${icon("back")} 回到雞場</button><strong>2 / 3　雞舍</strong></div><div class="option-list">${houses.map((house) => `<button type="button" class="option-row ${draft.houseId === house.id ? "selected" : ""}" data-action="select-house" data-house-id="${house.id}"><span><strong>${house.name}</strong><span>${house.code} · ${house.flocks.length} 個可檢視批次</span></span><span class="option-check">${draft.houseId === house.id ? icon("check") : icon("arrow")}</span></button>`).join("")}</div>`, "context");
    }
    const house = houseById(farm, draft.houseId);
    return sheetShell("選擇批次", `${farm.name} / ${house?.name || "雞舍"} · 最後選擇批次完成切換。`, `<div class="sheet-step"><button type="button" class="step-back" data-action="context-step" data-step="house">${icon("back")} 回到雞舍</button><strong>3 / 3　批次</strong></div><div class="option-list">${(house?.flocks || []).map((flock) => `<button type="button" class="option-row ${draft.flockId === flock.id ? "selected" : ""}" data-action="select-flock" data-flock-id="${flock.id}"><span><strong>${flock.code}</strong><span>${flock.status}${flock.stock !== null ? ` · 目前存欄 ${number(flock.stock)}` : ""}</span></span><span class="option-check">${draft.flockId === flock.id ? icon("check") : icon("arrow")}</span></button>`).join("")}</div>`, "context");
  }

  function pendingSheet() {
    return sheetShell("4 筆需要人工確認", "每一筆都保留 farm / house context；這些是固定 review items。", `<div class="sheet-item-list">${DATA.pending.map((item) => `<button type="button" class="sheet-item" data-action="open-pending-item" data-pending-id="${item.id}"><span><strong>${item.title}</strong><span>${item.context} · ${item.kind}</span></span><span class="sheet-item-end">›</span></button>`).join("")}</div><div class="readonly-note">此清單只做互動展示，不會寫回任何資料。</div>`, "pending");
  }

  function upcomingSheet() {
    const flock = DATA.activeFlocks.find((item) => item.upcoming);
    return sheetShell("1 批 7 日內準備出雞", "有明確批次細節的卡片才提供 drill-down。", `<div class="sheet-detail"><div class="detail-hero"><small>UPCOMING FLOCK</small><strong>${flock.code}</strong><span>${flock.farm} / ${flock.house} · ${flock.status}</span></div><div class="detail-block"><h3>下一步</h3><p>開啟 flock detail 查看目前 context；prototype 不自行推算日期以外的正式營運結論。</p></div><button type="button" class="sheet-primary" data-action="open-flock" data-flock-id="${flock.id}">查看 flock detail</button></div>`, "upcoming");
  }

  function abnormalSheet() {
    return sheetShell("異常需要留意", "固定列出有內容的異常，不把沒有 detail 的項目做成假按鈕。", `<div class="sheet-item-list">${DATA.abnormalities.map((item) => `<button type="button" class="sheet-item" data-action="open-abnormal" data-abnormal-id="${item.id}"><span><strong>${item.title}</strong><span>${item.context} · ${item.state}</span></span><span class="sheet-item-end">›</span></button>`).join("")}</div>`, "abnormal");
  }

  function mortalitySheet() {
    const rows = scopedMortality();
    return sheetShell(`今日死亡 ${number(mortalityValue(currentContext()))}`, "依 farm / house / flock 顯示固定死亡明細。", `<div class="sheet-item-list">${rows.length ? rows.map((item) => `<button type="button" class="sheet-item" data-action="jump-context" data-farm-id="${item.farmId}" data-house-id="${item.houseId}" data-flock-id="${item.flockId}"><span><strong>${item.farm} / ${item.house}</strong><span>固定死亡明細 · ${item.farmId === "red" ? "紅羽一舍" : "烏骨一舍"}</span></span><span class="sheet-item-end">${number(item.quantity)}</span></button>`).join("") : `<div class="empty-tab"><strong>此範圍沒有死亡明細</strong><p>prototype 不會用推算值補齊。</p></div>`}</div><div class="readonly-note">全部雞場 baseline：稽核紅羽一場 / 紅羽一舍 = 5；稽核烏骨三場 / 烏骨一舍 = 1。</div>`, "mortality");
  }

  function flocksSheet() {
    const rows = scopedFlocks();
    return sheetShell(`進行中批次 ${state.context.farmId === "all" ? "6" : ""}`, "只列出可從目前範圍找到的固定 batch detail。", `<div class="sheet-item-list">${rows.map((flock) => `<button type="button" class="sheet-item" data-action="open-flock" data-flock-id="${flock.id}"><span><strong>${flock.code}</strong><span>${flock.farm} / ${flock.house} · ${flock.status}</span></span><span class="sheet-item-end">›</span></button>`).join("")}</div>`, "flocks");
  }

  function flockSheet(flockId) {
    const flock = DATA.activeFlocks.find((item) => item.id === flockId) || DATA.activeFlocks[0];
    return sheetShell("Flock detail", "由目前範圍進入的固定 batch detail。", `<div class="sheet-detail"><div class="detail-hero"><small>FLOCK</small><strong>${flock.code}</strong><span>${flock.farm} / ${flock.house}</span></div><div class="detail-block"><h3>狀態</h3><p>${flock.status}</p></div><div class="detail-block"><h3>目前範圍 binding</h3><p>切換 Context Identity 後，Today、Farm、Records、Todo、Finance、AI context 與這個 drill-down 會同步更新。</p></div><button type="button" class="sheet-primary" data-action="jump-context" data-farm-id="${flock.farmId}" data-house-id="${flock.houseId}" data-flock-id="${flock.id}">套用這個 context</button></div>`, "flock");
  }

  function pendingItemSheet(id) {
    const item = DATA.pending.find((candidate) => candidate.id === id) || DATA.pending[0];
    return sheetShell(item.title, "固定 review item detail。", `<div class="detail-hero"><small>${item.kind}</small><strong>${item.title}</strong><span>${item.context}</span></div><div class="detail-block"><h3>可做的事</h3><p>回到紀錄或待辦頁檢視；這個公開 prototype 不會修改任何正式資料。</p></div><button type="button" class="sheet-primary" data-action="go-records">前往紀錄</button>`, "pending-item");
  }

  function abnormalItemSheet(id) {
    const item = DATA.abnormalities.find((candidate) => candidate.id === id) || DATA.abnormalities[0];
    return sheetShell(item.title, "固定 synthetic abnormal detail。", `<div class="detail-hero"><small>ABNORMAL · ${item.state}</small><strong>${item.title}</strong><span>${item.context}</span></div><div class="detail-block"><h3>處理邊界</h3><p>此畫面只做 drill-down 互動展示，不替現場建立健康評分或產業比較。</p></div><button type="button" class="sheet-primary" data-action="go-records">查看紀錄</button>`, "abnormal-item");
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
    if (state.sheet.kind === "flocks") return flocksSheet();
    if (state.sheet.kind === "flock") return flockSheet(state.sheet.id);
    return "";
  }

  function pageMarkup() {
    if (state.page === "today") return renderToday();
    if (state.page === "farms") return renderFarms();
    if (state.page === "records") return renderRecords();
    if (state.page === "todo") return renderTodo();
    if (state.page === "more") return renderMore();
    if (state.page === "finance") return renderFinance();
    if (state.page === "ai") return renderAi();
    return renderToday();
  }

  function lockBody() {
    if (document.body.classList.contains("sheet-open")) return;
    state.scrollY = window.scrollY;
    document.body.style.top = `-${state.scrollY}px`;
    document.body.classList.add("sheet-open");
  }

  function unlockBody() {
    if (!document.body.classList.contains("sheet-open")) return;
    const scrollY = state.scrollY;
    document.body.classList.remove("sheet-open");
    document.body.style.top = "";
    window.scrollTo(0, scrollY);
  }

  function openSheet(sheet) {
    if (!state.sheet) state.previousFocus = document.activeElement;
    state.sheet = sheet;
    render();
    window.requestAnimationFrame(() => document.querySelector(".sheet-close")?.focus());
  }

  function closeSheet() {
    const focus = state.previousFocus;
    state.sheet = null;
    state.contextDraft = null;
    render();
    if (focus && typeof focus.focus === "function") window.requestAnimationFrame(() => focus.focus());
  }

  function openContextPicker() {
    state.contextDraft = { ...state.context };
    state.contextStep = "farm";
    openSheet({ kind: "context" });
  }

  function applyDraftContext() {
    state.context = { ...state.contextDraft };
    state.contextDraft = null;
    closeSheet();
  }

  function render() {
    app.innerHTML = `<div class="app-shell"><header class="topbar"><div class="brand-lockup"><span class="brand-symbol">🐔</span><span class="brand-copy"><strong>金雞 Web V14R Lab</strong><span>UX / INTERACTION PROTOTYPE</span></span></div><span class="topbar-status">synthetic only</span></header><main class="page-shell">${pageMarkup()}</main><button type="button" class="fab" data-action="open-sheet" data-sheet-kind="pending" aria-label="開啟快速待辦">${icon("plus")}<span>快速待辦</span></button>${navMarkup()}${renderSheet()}</div>`;
    if (state.sheet) lockBody(); else unlockBody();
  }

  function handleClick(event) {
    const nav = event.target.closest("[data-nav]");
    if (nav) {
      state.page = nav.dataset.nav;
      state.sheet = null;
      state.contextDraft = null;
      render();
      return;
    }
    const actionElement = event.target.closest("[data-action]");
    if (!actionElement) return;
    const action = actionElement.dataset.action;
    if (action === "open-context") return openContextPicker();
    if (action === "close-sheet") return closeSheet();
    if (action === "open-sheet") return openSheet({ kind: actionElement.dataset.sheetKind });
    if (action === "select-farm") {
      const farmId = actionElement.dataset.farmId;
      state.contextDraft = { farmId, houseId: null, flockId: null };
      if (farmId === "all") return applyDraftContext();
      state.contextStep = "house";
      return render();
    }
    if (action === "select-house") {
      state.contextDraft.houseId = actionElement.dataset.houseId;
      state.contextDraft.flockId = null;
      state.contextStep = "flock";
      return render();
    }
    if (action === "select-flock") {
      state.contextDraft.flockId = actionElement.dataset.flockId;
      return applyDraftContext();
    }
    if (action === "context-step") {
      state.contextStep = actionElement.dataset.step;
      return render();
    }
    if (action === "go-farms") { state.page = "farms"; return render(); }
    if (action === "go-todo") { state.page = "todo"; return render(); }
    if (action === "go-records") { state.page = "records"; state.sheet = null; return render(); }
    if (action === "go-finance") { state.page = "finance"; state.financeTab = "overview"; return render(); }
    if (action === "go-ai") { state.page = "ai"; return render(); }
    if (action === "finance-tab") { state.financeTab = actionElement.dataset.financeTab; return render(); }
    if (action === "open-flock") return openSheet({ kind: "flock", id: actionElement.dataset.flockId });
    if (action === "open-pending-item") return openSheet({ kind: "pending-item", id: actionElement.dataset.pendingId });
    if (action === "open-abnormal") return openSheet({ kind: "abnormal-item", id: actionElement.dataset.abnormalId });
    if (action === "jump-context") {
      state.context = { farmId: actionElement.dataset.farmId, houseId: actionElement.dataset.houseId, flockId: actionElement.dataset.flockId };
      state.page = "today";
      return closeSheet();
    }
  }

  let handleStartY = null;
  document.addEventListener("click", handleClick);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.sheet) closeSheet();
  });
  document.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".sheet-handle")) handleStartY = event.clientY;
  });
  document.addEventListener("pointerup", (event) => {
    if (handleStartY !== null && handleStartY - event.clientY < -70 && state.sheet) closeSheet();
    handleStartY = null;
  });

  render();
})();
