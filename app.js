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

  const DATA = {"farms":[{"id":"all","name":"全部雞場","subtitle":"全域總覽","readOnly":true,"stock":31412,"mortality":6,"cull":1,"net":115000,"houses":[]},{"id":"red","name":"稽核紅羽一場","subtitle":"紅羽場區","breed":"紅羽","risk":"死亡偏高＋高溫","stock":12132,"mortality":5,"cull":1,"caretakers":["模擬飼養者甲","模擬飼養者乙"],"finance":{"gross":55000,"allocated":33000,"expense":1200,"net":31800,"investors":[["模擬投資人甲",50,16500],["模擬投資人乙",50,16500]],"expenses":[["粗糠",420],["清雞糞",330],["維修",250],["其他",200]]},"houses":[{"id":"red-1","name":"紅羽一舍","code":"H1","flocks":[{"id":"alpha","code":"AUDIT-RED-ALPHA","status":"7 日內準備出雞","state":"active","initial":7000,"stock":6812,"chickIn":"2026-07-20","ship":"2026-09-06","upcoming":true}]},{"id":"red-2","name":"紅羽二舍","code":"H2","flocks":[{"id":"beta","code":"AUDIT-RED-BETA","status":"進行中","state":"active","initial":5500,"stock":5320,"chickIn":"2026-08-01","ship":"2026-09-25","upcoming":false}]}]},{"id":"black","name":"稽核黑羽二場","subtitle":"黑羽場區","breed":"黑羽","risk":"穩定","stock":5420,"mortality":0,"cull":0,"caretakers":["模擬飼養者丙"],"finance":{"gross":70000,"allocated":42000,"expense":1500,"net":40500,"investors":[["模擬投資人甲",40,16800],["模擬投資人丙",60,25200]],"expenses":[["粗糠",500],["清雞糞",420],["水電",330],["維修",250]]},"houses":[{"id":"black-1","name":"黑羽一舍","code":"H1","flocks":[{"id":"black-a","code":"AUDIT-BLACK-001","status":"進行中","state":"active","initial":5600,"stock":5420,"chickIn":"2026-07-28","ship":"2026-09-18","upcoming":false}]},{"id":"black-2","name":"黑羽二舍","code":"H2","flocks":[]}]},{"id":"silkie","name":"稽核烏骨三場","subtitle":"烏骨場區","breed":"烏骨","risk":"飲水異常追蹤","stock":5940,"mortality":1,"cull":0,"caretakers":["模擬飼養者丁","模擬飼養者乙"],"finance":{"gross":46000,"allocated":27600,"expense":900,"net":26700,"investors":[["模擬投資人乙",50,13800],["模擬投資人丁",50,13800]],"expenses":[["粗糠",300],["清雞糞",250],["水電",200],["維修",150]]},"houses":[{"id":"silkie-1","name":"烏骨一舍","code":"H1","flocks":[{"id":"silkie-a","code":"AUDIT-SILKIE-A","status":"進行中","state":"active","initial":3300,"stock":3160,"chickIn":"2026-07-15","ship":"2026-09-10","upcoming":false}]},{"id":"silkie-2","name":"烏骨二舍","code":"H2","flocks":[{"id":"silkie-b","code":"AUDIT-SILKIE-B","status":"進行中","state":"active","initial":2900,"stock":2780,"chickIn":"2026-07-24","ship":"2026-09-17","upcoming":false}]}]},{"id":"new","name":"稽核新批四場","subtitle":"新批場區","breed":"紅羽新批","risk":"新批觀察","stock":7920,"mortality":0,"cull":0,"caretakers":["模擬飼養者戊"],"finance":{"gross":0,"allocated":0,"expense":600,"net":-600,"investors":[["模擬投資人甲",50,0],["模擬投資人戊",50,0]],"expenses":[["粗糠",200],["清雞糞",150],["水電",150],["其他",100]]},"houses":[{"id":"new-1","name":"新批一舍","code":"H1","flocks":[{"id":"new-a","code":"AUDIT-NEW-001","status":"進行中","state":"active","initial":8000,"stock":7920,"chickIn":"2026-08-25","ship":"2026-11-20","upcoming":false}]}]},{"id":"history","name":"稽核歷史五場","subtitle":"歷史 review 區","breed":"歷史批","risk":"已出雞／僅供歷史查詢","stock":0,"mortality":0,"cull":0,"caretakers":["模擬飼養者己"],"finance":{"gross":33000,"allocated":17400,"expense":800,"net":16600,"investors":[["模擬投資人乙",60,10440],["模擬投資人己",40,6960]],"expenses":[["清雞糞",260],["水電",220],["維修",180],["其他",140]]},"houses":[{"id":"history-1","name":"歷史一舍","code":"H1","flocks":[{"id":"history-old","code":"AUDIT-HISTORY-OLD","status":"已出雞","state":"closed","initial":5000,"stock":0,"chickIn":"2026-05-01","ship":"2026-07-31","upcoming":false}]},{"id":"history-2","name":"歷史二舍","code":"H2","flocks":[]}]}],"pending":[{"id":"pending-1","title":"死亡 3？來源不完整","detail":"需要確認雞舍後才能成為正式紀錄。","kind":"死亡紀錄","farmId":"red","houseId":null,"flockId":null},{"id":"pending-2","title":"確認 7 日內出雞準備","detail":"AUDIT-RED-ALPHA 預計 09/06 出雞。","kind":"出雞準備","farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"pending-3","title":"飼料數量可能缺單位","detail":"來源文字「飼料 6」，需人工確認。","kind":"飼料紀錄","farmId":"black","houseId":"black-1","flockId":"black-a"},{"id":"pending-4","title":"飲水異常需要追蹤","detail":"烏骨一舍飲水量偏低。","kind":"異常追蹤","farmId":"silkie","houseId":"silkie-1","flockId":"silkie-a"}],"abnormalities":[{"id":"abnormal-1","title":"活動力下降","category":"健康","state":"追蹤中","status":"active","date":"2026-08-30","time":"15:20","temp":34.0,"farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"abnormal-2","title":"飲水量偏低","category":"飲水","state":"追蹤中","status":"active","date":"2026-08-31","time":"07:10","temp":31.0,"farmId":"silkie","houseId":"silkie-1","flockId":"silkie-a"},{"id":"abnormal-3","title":"水線壓力不穩","category":"設備","state":"追蹤中","status":"active","date":"2026-08-29","time":"14:40","temp":32.2,"farmId":"silkie","houseId":"silkie-2","flockId":"silkie-b"},{"id":"abnormal-4","title":"歷史高溫紀錄","category":"環境","state":"已結案","status":"resolved","date":"2026-07-20","time":"14:00","temp":35.1,"farmId":"history","houseId":"history-1","flockId":"history-old"}],"events":[{"id":"e-r1","date":"2026-08-31","time":"08:10","type":"mortality","qty":5,"unit":"隻","farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"e-r2","date":"2026-08-31","time":"07:50","type":"cull","qty":1,"unit":"隻","farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"e-r3","date":"2026-08-29","time":"09:05","type":"feed","qty":240,"unit":"kg","farmId":"red","houseId":null,"flockId":null},{"id":"e-b1","date":"2026-08-30","time":"10:10","type":"feed","qty":210,"unit":"kg","farmId":"black","houseId":"black-1","flockId":"black-a"},{"id":"e-b2","date":"2026-08-28","time":"07:40","type":"mortality","qty":1,"unit":"隻","farmId":"black","houseId":"black-1","flockId":"black-a"},{"id":"e-s1","date":"2026-08-31","time":"06:50","type":"mortality","qty":1,"unit":"隻","farmId":"silkie","houseId":"silkie-1","flockId":"silkie-a"},{"id":"e-s2","date":"2026-08-30","time":"08:30","type":"water","qty":1850,"unit":"L","farmId":"silkie","houseId":"silkie-1","flockId":"silkie-a"},{"id":"e-n1","date":"2026-08-30","time":"09:00","type":"feed","qty":120,"unit":"kg","farmId":"new","houseId":"new-1","flockId":"new-a"},{"id":"e-h1","date":"2026-07-31","time":"06:00","type":"shipment","qty":4705,"unit":"隻","farmId":"history","houseId":"history-1","flockId":"history-old"}],"history":[{"label":"07/01","value":76000},{"label":"07/15","value":84200},{"label":"08/01","value":96500},{"label":"08/15","value":107500},{"label":"09/01","value":115000}]};

  const NAV = [
    ["today", "今日", "digest"],
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

  function allProductionFarms() {
    return DATA.farms.filter((farm) => farm.id !== "all");
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

  function scopedEvents(type = null, todayOnly = false) {
    return DATA.events.filter((event) =>
      (!type || event.type === type) &&
      (!todayOnly || event.date === "2026-08-31") &&
      matchesContext(event)
    );
  }

  function scopedPending() {
    return DATA.pending.filter(matchesContext);
  }

  function scopedAbnormalities({ activeOnly = false } = {}) {
    return DATA.abnormalities.filter((item) => (!activeOnly || item.status === "active") && matchesContext(item));
  }

  function scopedMortality() {
    return scopedEvents("mortality", true).map((event) => {
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
    return scopedFlocks().reduce((sum, flock) => sum + (flock.stock || 0), 0);
  }

  function mortalityValue() {
    return scopedEvents("mortality", true).reduce((sum, event) => sum + event.qty, 0);
  }

  function cullValue() {
    return scopedCull().reduce((sum, event) => sum + event.qty, 0);
  }

  function upcomingFlocks() {
    return scopedFlocks().filter((flock) => flock.upcoming);
  }

  function contextCountLabel() {
    return `${scopedFlocks().length} 批進行中`;
  }

  function stockDetail(context) {
    if (context.farm.id === "all") return "全部雞場進行中批次合計";
    if (context.flock) return `${context.flock.code} 目前存欄`;
    if (context.house) return `${context.farm.name}／${context.house.name} 目前存欄`;
    return `${context.farm.name} 目前存欄`;
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

  function financeScopeFromFarms(farms) {
    return {
      gross: farms.reduce((sum, farm) => sum + farm.finance.gross, 0),
      allocated: farms.reduce((sum, farm) => sum + farm.finance.allocated, 0),
      expense: farms.reduce((sum, farm) => sum + farm.finance.expense, 0),
      net: farms.reduce((sum, farm) => sum + farm.finance.net, 0),
    };
  }

  function financeScope() {
    if (state.context.farmId === "all") {
      const farms = allProductionFarms();
      return { farms, ...financeScopeFromFarms(farms), chart: true };
    }
    const farm = farmById(state.context.farmId);
    return { farms: [farm], ...farm.finance, chart: false };
  }

  function investorSummary(farms = allProductionFarms()) {
    const totals = new Map();
    farms.forEach((farm) => farm.finance.investors.forEach(([name, share, amount]) => {
      const row = totals.get(name) || { name, amount: 0, farms: [] };
      row.amount += amount;
      row.farms.push({ farm: farm.name, share, amount });
      totals.set(name, row);
    }));
    return [...totals.values()].sort((a, b) => b.amount - a.amount);
  }

  function assertDataContract() {
    const farms = allProductionFarms();
    const houses = farms.flatMap((farm) => farm.houses);
    const flocks = allFlocks();
    const active = flocks.filter((flock) => flock.state === "active");
    const closed = flocks.filter((flock) => flock.state === "closed");
    const expect = (condition, message) => { if (!condition) throw new Error(`V14R_DATA_CONTRACT: ${message}`); };

    expect(farms.length === 5, "farm count");
    expect(houses.length === 9, "house count");
    expect(flocks.length === 7, "flock count");
    expect(active.length === 6, "active flock count");
    expect(closed.length === 1 && closed[0].code === "AUDIT-HISTORY-OLD", "closed history flock");
    expect(active.reduce((sum, flock) => sum + flock.stock, 0) === 31412, "all stock");
    expect(farmById("red").stock === 12132 && farmById("black").stock === 5420 && farmById("silkie").stock === 5940 && farmById("new").stock === 7920 && farmById("history").stock === 0, "farm stocks");
    expect(["AUDIT-RED-ALPHA","AUDIT-RED-BETA","AUDIT-BLACK-001","AUDIT-SILKIE-A","AUDIT-SILKIE-B","AUDIT-NEW-001"].every((code) => active.some((flock) => flock.code === code)), "active flock membership");
    expect(DATA.pending.length === 4, "pending count");
    expect(["死亡 3？來源不完整","確認 7 日內出雞準備","飼料數量可能缺單位","飲水異常需要追蹤"].every((title) => DATA.pending.some((item) => item.title === title)), "pending membership");
    expect(DATA.abnormalities.length === 4 && DATA.abnormalities.filter((item) => item.status === "active").length === 3, "abnormality baseline");
    expect(DATA.events.filter((event) => event.type === "mortality" && event.date === "2026-08-31").reduce((sum, event) => sum + event.qty, 0) === 6, "today mortality");
    expect(DATA.events.filter((event) => event.type === "cull" && event.date === "2026-08-31").reduce((sum, event) => sum + event.qty, 0) === 1, "today cull");
    const finance = financeScopeFromFarms(farms);
    expect(finance.gross === 204000 && finance.allocated === 120000 && finance.expense === 5000 && finance.net === 115000, "finance totals");
    expect(DATA.history.at(-1)?.value === 115000, "history endpoint");
  }

  function navMarkup() {
    return `<nav class="bottom-nav" aria-label="主要導覽">${NAV.map(([key, label, iconName]) => `<button type="button" data-nav="${key}" class="${state.page === key || (key === "more" && ["finance", "ai"].includes(state.page)) ? "active" : ""}" aria-current="${state.page === key || (key === "more" && ["finance", "ai"].includes(state.page)) ? "page" : "false"}">${icon(iconName, "nav-icon")}<span>${label}</span></button>`).join("")}</nav>`;
  }

  function renderToday() {
    const context = currentContext();
    const pending = scopedPending();
    const upcoming = upcomingFlocks();
    const activeAbnormal = scopedAbnormalities({ activeOnly: true });
    const resolvedAbnormal = scopedAbnormalities().length - activeAbnormal.length;
    const mortality = mortalityValue();
    const cull = cullValue();
    const actions = [];
    if (pending.length) actions.push(`<button type="button" class="action-card" data-action="open-sheet" data-sheet-kind="pending"><span class="action-icon">${icon("check")}</span><span class="action-copy"><strong>${pending.length} 筆需要人工確認</strong><span>逐筆檢視資料來源與目前範圍</span></span><span class="action-count">${pending.length}</span><span class="action-arrow">›</span></button>`);
    if (upcoming.length) actions.push(`<button type="button" class="action-card good" data-action="open-sheet" data-sheet-kind="upcoming"><span class="action-icon">${icon("flock")}</span><span class="action-copy"><strong>${upcoming.length} 批 7 日內準備出雞</strong><span>${upcoming.map((flock) => flock.code).join("、")} · 查看批次詳細</span></span><span class="action-count">${upcoming.length}</span><span class="action-arrow">›</span></button>`);
    if (activeAbnormal.length) actions.push(`<button type="button" class="action-card alert" data-action="open-sheet" data-sheet-kind="abnormal"><span class="action-icon">${icon("warning")}</span><span class="action-copy"><strong>${activeAbnormal.length} 筆異常需要留意</strong><span>${activeAbnormal.slice(0, 2).map((item) => `${contextName(item)} · ${item.title}`).join("；")}${resolvedAbnormal ? `；另 ${resolvedAbnormal} 筆已結案` : ""}</span></span><span class="action-count">${activeAbnormal.length}</span><span class="action-arrow">›</span></button>`);
    return `<section class="page" data-page="today">
      ${contextBar()}
      ${pageIntro("2026 / 09 / 01 · 今日焦點", "今天，先處理最重要的事")}
      <section class="digest" aria-labelledby="digest-title"><div class="digest-head"><p class="kicker">SMART DIGEST · DETERMINISTIC</p><span class="digest-mark">${icon("digest")}</span></div><h2 id="digest-title">${digestCopy()}</h2><p>只呈現固定 prototype data；沒有外部請求，也不會替現場推算新的 KPI。</p></section>
      <div class="section-heading"><div><h2>今天需處理</h2><p>只顯示目前範圍真的有細節可處理的項目。</p></div><span class="scope-chip">${actions.length} 項</span></div>
      <section class="action-list" aria-label="今天需處理">${actions.length ? actions.slice(0, 3).join("") : `<div class="empty-tab"><strong>目前沒有急迫事項</strong><p>此範圍沒有待確認、追蹤中異常或 7 日內出雞批次。</p></div>`}</section>
      <section class="hero-metric" aria-label="目前存欄"><div><p class="kicker">目前存欄 · ${contextShortLabel(context)}</p><strong data-testid="stock-value">${number(contextStock())}</strong><p>${stockDetail(context)}</p></div><div class="hero-side"><span class="hero-icon">${icon("flock")}</span><span class="metric-label">${contextCountLabel()}</span><button type="button" class="ghost-light" data-action="open-sheet" data-sheet-kind="flocks">查看批次</button></div></section>
      <div class="quick-summary">
        ${mortality > 0 ? `<button type="button" class="summary-tile alert" data-action="open-sheet" data-sheet-kind="mortality"><span class="tile-label">今日死亡 <span aria-hidden="true">›</span></span><strong data-testid="mortality-value">${number(mortality)}</strong><small>${scopedMortality().map((item) => `${item.farm} ${item.quantity}`).join(" · ")}</small></button>` : `<div class="summary-tile"><span class="tile-label">今日死亡</span><strong data-testid="mortality-value">0</strong><small>此範圍沒有死亡明細</small></div>`}
        ${cull > 0 ? `<button type="button" class="summary-tile good" data-action="open-sheet" data-sheet-kind="cull"><span class="tile-label">今日淘汰 <span aria-hidden="true">›</span></span><strong>${number(cull)}</strong><small>點擊查看場／舍／批次</small></button>` : `<div class="summary-tile good"><span class="tile-label">今日淘汰</span><strong>0</strong><small>此範圍沒有淘汰明細</small></div>`}
      </div>
      <div class="sync-note"><strong>Context sync：</strong>Today、Farm、Records、Todo、Finance、AI context 與 drill-down 都跟隨目前範圍。</div>
    </section>`;
  }

  function renderFarms() {
    const context = currentContext();
    const flocks = scopedFlocks();
    const farms = state.context.farmId === "all" ? allProductionFarms() : [context.farm];
    const houses = state.context.farmId === "all" ? [] : context.farm.houses.filter((house) => !state.context.houseId || house.id === state.context.houseId);
    return `<section class="page" data-page="farms">
      ${contextBar()}
      ${pageIntro("FARM WORKBENCH", "場務", "目前範圍同步到雞場、雞舍、批次與 drill-down。")}
      <div class="filter-note"><span><strong>目前範圍</strong>　${contextLabel(context)}</span><span class="status-chip good">synthetic</span></div>
      <section class="hero-metric" aria-label="場務目前存欄"><div><p class="kicker">目前存欄</p><strong data-testid="farm-stock-value">${number(contextStock())}</strong><p>${stockDetail(context)}</p></div><div class="hero-side"><span class="hero-icon">${icon("farm")}</span><span class="metric-label">進行中批次 ${number(flocks.length)}</span></div></section>
      <div class="section-heading"><div><h2>${state.context.farmId === "all" ? "全部雞場" : "目前場區"}</h2><p>雞場存欄與批次 membership 對齊 V11/V13 baseline。</p></div></div>
      <section class="farm-grid">${farms.map((farm) => `<article class="farm-item"><div><h3>${farm.name}</h3><p>${farm.breed || farm.subtitle} · ${farm.risk || "全域"}</p></div><div class="farm-metric"><strong>${number(farm.stock)}</strong><span>存欄</span></div></article>`).join("")}</section>
      ${state.context.farmId === "all" ? "" : `<section class="content-panel"><div class="panel-title"><div><h3>雞舍</h3><p>${context.farm.name} · ${houses.length} 個目前範圍雞舍</p></div></div><div class="list-stack">${houses.map((house) => `<div class="list-row"><span><strong>${house.name}</strong><span>${house.code} · ${house.flocks.length} 個 baseline 批次</span></span><span class="row-end"><span class="row-value">${number(house.flocks.filter((flock) => flock.state === "active").reduce((sum, flock) => sum + flock.stock, 0))}</span><span>存欄</span></span></div>`).join("")}</div></section>`}
      <section class="content-panel"><div class="panel-title"><div><h3>進行中批次</h3><p>${flocks.length} 批；歷史已結案批次不會被算入 active count。</p></div><button type="button" class="text-link" data-action="open-sheet" data-sheet-kind="flocks">查看全部 →</button></div><div class="list-stack">${flocks.slice(0, 3).map((flock) => flockRow(flock)).join("") || `<div class="empty-tab"><strong>沒有進行中批次</strong><p>此範圍可能是歷史場或空舍。</p></div>`}</div></section>
    </section>`;
  }

  function flockRow(flock) {
    return `<button type="button" class="list-row" data-action="open-flock" data-flock-id="${flock.id}"><span><strong>${flock.code}</strong><span>${flock.farm} / ${flock.house}</span></span><span class="row-end"><span class="status-chip ${flock.upcoming ? "good" : ""}">${flock.status}</span><span class="row-arrow">›</span></span></button>`;
  }

  function eventLabel(type) {
    return ({ mortality: "死亡", cull: "淘汰", feed: "飼料", water: "飲水", shipment: "出雞" })[type] || type;
  }

  function renderRecords() {
    const context = currentContext();
    const eventRows = scopedEvents().map((event) => ({ sort: `${event.date} ${event.time}`, title: `${eventLabel(event.type)} ${number(event.qty)} ${event.unit}`, detail: `${contextName(event)} · ${event.date} ${event.time}`, tone: ["mortality","cull"].includes(event.type) ? "alert" : "good" }));
    const abnormalRows = scopedAbnormalities().map((item) => ({ sort: `${item.date} ${item.time}`, title: `異常：${item.title}`, detail: `${contextName(item)} · ${item.category} · ${item.date} ${item.time}`, tone: item.status === "active" ? "warn" : "good", state: item.state }));
    const rows = [...eventRows, ...abnormalRows].sort((a, b) => b.sort.localeCompare(a.sort));
    return `<section class="page" data-page="records">
      ${contextBar()}
      ${pageIntro("RECORDS", "紀錄", "依目前範圍檢視 synthetic operating records。")}
      <div class="filter-note"><span><strong>目前範圍</strong>　${contextLabel(context)}</span><span class="scope-chip">${rows.length} 筆</span></div>
      <section class="content-panel"><div class="panel-title"><div><h3>紀錄時間軸</h3><p>死亡、淘汰、飼料、飲水、出雞與異常使用同一個 Context filter。</p></div><span class="status-chip warn">review only</span></div><div class="list-stack">${rows.length ? rows.map((record) => `<div class="list-row"><span><strong>${record.title}</strong><span>${record.detail}</span></span><span class="row-end"><span class="status-chip ${record.tone}">${record.state || "有效"}</span></span></div>`).join("") : `<div class="empty-tab"><strong>此範圍沒有紀錄</strong><p>Prototype 不會用推算值補齊。</p></div>`}</div></section>
      <section class="content-grid"><div class="content-panel"><h3>需要人工確認</h3><p>${scopedPending().length} 筆目前範圍待確認項目。</p><button type="button" class="text-link" data-action="go-todo">前往待辦 →</button></div><div class="content-panel"><h3>資料邊界</h3><p>沒有連線、沒有寫入，也不會把 synthetic review data 描述成 Production data。</p></div></section>
    </section>`;
  }

  function renderTodo() {
    const context = currentContext();
    const pending = scopedPending();
    const upcoming = upcomingFlocks();
    return `<section class="page" data-page="todo">
      ${contextBar()}
      ${pageIntro("TODO", "待辦", "只放目前 Context 有明確下一步的 synthetic items。")}
      <section class="action-list">${pending.length ? `<button type="button" class="action-card" data-action="open-sheet" data-sheet-kind="pending"><span class="action-icon">${icon("check")}</span><span class="action-copy"><strong>${pending.length} 筆需要人工確認</strong><span>目前範圍：${contextShortLabel(context)}</span></span><span class="action-count">${pending.length}</span><span class="action-arrow">›</span></button>` : ""}${upcoming.length ? `<button type="button" class="action-card good" data-action="open-sheet" data-sheet-kind="upcoming"><span class="action-icon">${icon("flock")}</span><span class="action-copy"><strong>${upcoming.length} 批 7 日內準備出雞</strong><span>${upcoming.map((flock) => flock.code).join("、")}</span></span><span class="action-count">${upcoming.length}</span><span class="action-arrow">›</span></button>` : ""}</section>
      <section class="content-panel"><div class="panel-title"><div><h3>待人工確認清單</h3><p>每筆都保留 farm / house / flock context。</p></div><span class="status-chip warn">${pending.length} 筆</span></div><div class="list-stack">${pending.length ? pending.map((item) => `<button type="button" class="list-row" data-action="open-pending-item" data-pending-id="${item.id}"><span><strong>${item.title}</strong><span>${contextName(item)} · ${item.detail}</span></span><span class="row-end"><span class="row-value">${item.kind}</span><span class="row-arrow">›</span></span></button>`).join("") : `<div class="empty-tab"><strong>此範圍沒有待確認項目</strong><p>切換 Context 可查看其他場次。</p></div>`}</div></section>
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
      ${pageIntro("AI CONTEXT", "AI context", "只展示 deterministic context binding，不執行模型呼叫。")}
      <section class="digest"><div class="digest-head"><p class="kicker">DETERMINISTIC CONTEXT</p><span class="digest-mark">${icon("ai")}</span></div><h2>${contextLabel(context)}</h2><p>存欄 ${number(contextStock())}；今日死亡 ${number(mortalityValue())}；待確認 ${scopedPending().length}；追蹤中異常 ${scopedAbnormalities({ activeOnly: true }).length}。AI 維持唯讀。</p></section>
      <section class="content-grid"><div class="content-panel"><h3>目前範圍</h3><p>${contextLabel(context)}</p></div><div class="content-panel"><h3>資料模式</h3><p>synthetic review only · no external requests</p></div></section>
      <button type="button" class="sheet-primary" data-action="open-context">切換目前範圍</button>
    </section>`;
  }

  function financeContext() {
    return financeScope();
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
    return `<section class="finance-header"><div class="finance-kpis"><div class="finance-kpi"><span>毛利</span><strong>${money(totals.gross)}</strong></div><div class="finance-kpi amber"><span>已配置</span><strong>${money(totals.allocated)}</strong></div><div class="finance-kpi red"><span>費用</span><strong>${money(totals.expense)}</strong></div><div class="finance-kpi green"><span>目前淨額</span><strong data-testid="finance-net">${money(totals.net)}</strong></div></div><div class="metric-note"><strong>${context.farm.id === "all" ? "全部雞場財務 baseline" : `${context.farm.name} 財務 baseline`}</strong><span>${context.farm.id === "all" ? "總覽 KPI 為五個雞場合計。" : "雞舍／批次 Context 在財務上沿用所屬雞場 Scope。"}</span></div></section>${totals.chart ? `<section class="chart-panel"><div class="chart-title"><div><h3>歷史淨值變化</h3><p>固定 review-only history · 最後一點對齊目前淨額 115,000</p></div><span class="status-chip warn">synthetic review only</span></div>${chartMarkup()}</section>` : `<section class="chart-panel"><div class="chart-title"><div><h3>歷史淨值變化</h3><p>目前只有全部雞場的 synthetic review-only history。</p></div><span class="status-chip warn">scope limited</span></div><div class="empty-tab"><strong>此雞場沒有獨立歷史序列</strong><p>避免把全部雞場的 synthetic history 誤讀成 ${context.farm.name} 的正式歷史。</p></div></section>`}`;
  }

  function financeTabBody() {
    const scope = financeScope();
    if (state.financeTab === "overview") return renderFinanceOverview();
    if (state.financeTab === "farms") {
      const farms = state.context.farmId === "all" ? allProductionFarms() : scope.farms;
      return `<section class="content-panel"><div class="panel-title"><div><h3>各場</h3><p>毛利、已配置、費用與淨額均對齊 V11 baseline。</p></div><span class="status-chip good">${farms.length} 場</span></div><div class="list-stack">${farms.map((farm) => `<div class="list-row"><span><strong>${farm.name}</strong><span>毛利 ${money(farm.finance.gross)} · 已配置 ${money(farm.finance.allocated)} · 費用 ${money(farm.finance.expense)}</span></span><span class="row-end"><span class="row-value">${money(farm.finance.net)}</span><span>淨額</span></span></div>`).join("")}</div></section>`;
    }
    if (state.financeTab === "equity") {
      const investors = investorSummary(scope.farms);
      return `<section class="content-panel"><div class="panel-title"><div><h3>投資人／股權</h3><p>依目前財務 Scope 顯示投資人配置。</p></div><span class="status-chip good">${investors.length} 位</span></div><div class="list-stack">${investors.map((investor) => `<div class="list-row"><span><strong>${investor.name}</strong><span>${investor.farms.map((row) => `${row.farm} ${row.share}%`).join(" · ")}</span></span><span class="row-end"><span class="row-value">${money(investor.amount)}</span><span>配置金額</span></span></div>`).join("")}</div></section>`;
    }
    if (state.financeTab === "expenses") {
      return `<section class="content-panel"><div class="panel-title"><div><h3>費用</h3><p>分類為 UX 審核用 synthetic breakdown；各場分類總和嚴格等於 V11 baseline。</p></div><span class="status-chip warn">${money(scope.expense)}</span></div><div class="list-stack">${scope.farms.map((farm) => `<div class="list-row"><span><strong>${farm.name}</strong><span>${farm.finance.expenses.map(([name, value]) => `${name} ${money(value)}`).join(" · ")}</span></span><span class="row-end"><span class="row-value">${money(farm.finance.expense)}</span><span>費用</span></span></div>`).join("")}</div></section>`;
    }
    if (state.financeTab === "distribution") {
      const rows = scope.farms.flatMap((farm) => farm.finance.investors.map(([name, share, amount]) => ({ farm, name, share, amount })));
      return `<section class="content-panel"><div class="panel-title"><div><h3>分配</h3><p>依各場股權比例列出本期 synthetic 配置。</p></div><span class="status-chip good">${money(scope.allocated)}</span></div><div class="list-stack">${rows.map((row) => `<div class="list-row"><span><strong>${row.name} · ${row.farm.name}</strong><span>股權 ${row.share}%</span></span><span class="row-end"><span class="row-value">${money(row.amount)}</span></span></div>`).join("")}</div></section>`;
    }
    const allocationRate = scope.gross ? (scope.allocated / scope.gross) * 100 : 0;
    const expenseRate = scope.gross ? (scope.expense / scope.gross) * 100 : 0;
    const netMargin = scope.gross ? (scope.net / scope.gross) * 100 : 0;
    const bestFarm = [...scope.farms].sort((a, b) => b.finance.net - a.finance.net)[0];
    const topInvestor = investorSummary(scope.farms)[0];
    return `<section class="content-panel"><div class="panel-title"><div><h3>統計分析</h3><p>全部由目前 synthetic finance baseline 計算，不引入外部產業數據。</p></div><span class="status-chip good">derived</span></div><div class="list-stack">
      <div class="list-row"><span><strong>配置率</strong><span>已配置 ÷ 毛利</span></span><span class="row-end"><span class="row-value">${allocationRate.toFixed(1)}%</span></span></div>
      <div class="list-row"><span><strong>費用率</strong><span>費用 ÷ 毛利</span></span><span class="row-end"><span class="row-value">${expenseRate.toFixed(2)}%</span></span></div>
      <div class="list-row"><span><strong>淨額／毛利</strong><span>淨額 ÷ 毛利</span></span><span class="row-end"><span class="row-value">${netMargin.toFixed(1)}%</span></span></div>
      <div class="list-row"><span><strong>最高淨額場次</strong><span>${bestFarm?.name || "—"}</span></span><span class="row-end"><span class="row-value">${bestFarm ? money(bestFarm.finance.net) : "—"}</span></span></div>
      <div class="list-row"><span><strong>最高配置投資人</strong><span>${topInvestor?.name || "—"}</span></span><span class="row-end"><span class="row-value">${topInvestor ? money(topInvestor.amount) : "—"}</span></span></div>
    </div></section>`;
  }

  function renderFinance() {
    const tabs = [["overview", "總覽"], ["farms", "各場"], ["equity", "投資人／股權"], ["expenses", "費用"], ["distribution", "分配"], ["analysis", "統計分析"]];
    return `<section class="page" data-page="finance">
      ${contextBar()}
      ${pageIntro("FINANCE", "財務", "六個財務分頁均由同一組 synthetic baseline 驅動。")}
      <div class="finance-tabs" role="tablist" aria-label="財務分頁">${tabs.map(([key, label]) => `<button type="button" role="tab" aria-selected="${state.financeTab === key}" class="finance-tab ${state.financeTab === key ? "active" : ""}" data-action="finance-tab" data-finance-tab="${key}">${label}</button>`).join("")}</div>
      ${financeTabBody()}
      <div class="sync-note"><strong>Finance context：</strong>${contextLabel()}。財務最小 Scope 為雞場；house / flock Context 沿用所屬雞場財務資料。</div>
    </section>`;
  }

  function sheetShell(title, subtitle, body, kind) {
    return `<div class="sheet-layer" data-testid="bottom-sheet"><div class="sheet-backdrop" data-action="close-sheet" aria-hidden="true"></div><section class="sheet-panel" data-sheet-kind="${kind}" role="dialog" aria-modal="true" aria-labelledby="sheet-title" tabindex="-1"><div class="sheet-head"><div class="sheet-handle" aria-hidden="true"></div><div class="sheet-head-row"><div><h2 id="sheet-title">${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ""}</div><button type="button" class="sheet-close" data-action="close-sheet" aria-label="關閉">×</button></div></div><div class="sheet-body">${body}</div></section></div>`;
  }

  function contextSheet() {
    const draft = state.contextDraft || state.context;
    const farm = farmById(draft.farmId);
    if (state.contextStep === "farm") {
      const farmOptions = DATA.farms.map((option) => `<button type="button" class="option-row ${draft.farmId === option.id ? "selected" : ""}" data-action="select-farm" data-farm-id="${option.id}"><span><strong>${option.name}</strong><span>${option.subtitle}${option.id === "all" ? " · 全域總覽、唯讀" : ` · 存欄 ${number(option.stock)}`}</span></span><span class="option-check">${draft.farmId === option.id ? icon("check") : icon("arrow")}</span></button>`).join("");
      return sheetShell("切換目前範圍", "依序選擇雞場 → 雞舍 → 批次；也可以停在雞場或雞舍層級。", `<div class="sheet-step"><strong>1 / 3　雞場</strong><span>目前：${farm.name}</span></div><div class="option-list">${farmOptions}</div><div class="readonly-note">全部雞場為全域唯讀；單一雞場可在下一步直接「套用整個雞場」。</div>`, "context");
    }
    if (state.contextStep === "house") {
      const houses = farm.houses || [];
      return sheetShell("選擇雞舍", `${farm.name} · 可套用整個雞場，或再縮小到雞舍。`, `<div class="sheet-step"><button type="button" class="step-back" data-action="context-step" data-step="farm">${icon("back")} 回到雞場</button><strong>2 / 3　雞舍</strong></div><div class="option-list"><button type="button" class="option-row" data-action="apply-farm-scope"><span><strong>套用整個雞場</strong><span>${farm.name} · 存欄 ${number(farm.stock)}</span></span><span class="option-check">${icon("check")}</span></button>${houses.map((house) => `<button type="button" class="option-row ${draft.houseId === house.id ? "selected" : ""}" data-action="select-house" data-house-id="${house.id}"><span><strong>${house.name}</strong><span>${house.code} · ${house.flocks.length} 個 baseline 批次</span></span><span class="option-check">${draft.houseId === house.id ? icon("check") : icon("arrow")}</span></button>`).join("")}</div>`, "context");
    }
    const house = houseById(farm, draft.houseId);
    return sheetShell("選擇批次", `${farm.name} / ${house?.name || "雞舍"} · 可套用整個雞舍，或選單一批次。`, `<div class="sheet-step"><button type="button" class="step-back" data-action="context-step" data-step="house">${icon("back")} 回到雞舍</button><strong>3 / 3　批次</strong></div><div class="option-list"><button type="button" class="option-row" data-action="apply-house-scope"><span><strong>套用全部批次</strong><span>${house?.name || "雞舍"} · 目前存欄 ${number((house?.flocks || []).filter((flock) => flock.state === "active").reduce((sum, flock) => sum + flock.stock, 0))}</span></span><span class="option-check">${icon("check")}</span></button>${(house?.flocks || []).map((flock) => `<button type="button" class="option-row ${draft.flockId === flock.id ? "selected" : ""}" data-action="select-flock" data-flock-id="${flock.id}"><span><strong>${flock.code}</strong><span>${flock.status} · 目前存欄 ${number(flock.stock)}</span></span><span class="option-check">${draft.flockId === flock.id ? icon("check") : icon("arrow")}</span></button>`).join("")}</div>`, "context");
  }

  function pendingSheet() {
    const rows = scopedPending();
    return sheetShell(`${rows.length} 筆需要人工確認`, `${contextLabel()} · 每一筆保留原始 scope。`, `<div class="sheet-item-list">${rows.length ? rows.map((item) => `<button type="button" class="sheet-item" data-action="open-pending-item" data-pending-id="${item.id}"><span><strong>${item.title}</strong><span>${contextName(item)} · ${item.kind}</span></span><span class="sheet-item-end">›</span></button>`).join("") : `<div class="empty-tab"><strong>此範圍沒有待確認資料</strong><p>切換 Context 可查看其他場次。</p></div>`}</div><div class="readonly-note">此清單只做互動展示，不會寫回任何資料。</div>`, "pending");
  }

  function upcomingSheet() {
    const rows = upcomingFlocks();
    return sheetShell(`${rows.length} 批 7 日內準備出雞`, contextLabel(), `<div class="sheet-item-list">${rows.length ? rows.map((flock) => `<button type="button" class="sheet-item" data-action="open-flock" data-flock-id="${flock.id}"><span><strong>${flock.code}</strong><span>${flock.farm} / ${flock.house} · ${flock.status}</span></span><span class="sheet-item-end">›</span></button>`).join("") : `<div class="empty-tab"><strong>此範圍沒有 7 日內出雞批次</strong><p>目前 Context 沒有符合條件的 active flock。</p></div>`}</div>`, "upcoming");
  }

  function abnormalSheet() {
    const rows = scopedAbnormalities();
    const active = rows.filter((item) => item.status === "active").length;
    const resolved = rows.length - active;
    return sheetShell(`異常紀錄 ${rows.length}`, `${active} 筆追蹤中${resolved ? ` · ${resolved} 筆已結案` : ""}`, `<div class="sheet-item-list">${rows.length ? rows.map((item) => `<button type="button" class="sheet-item" data-action="open-abnormal" data-abnormal-id="${item.id}"><span><strong>${item.title}</strong><span>${contextName(item)} · ${item.category} · ${item.state}</span></span><span class="sheet-item-end">›</span></button>`).join("") : `<div class="empty-tab"><strong>此範圍沒有異常紀錄</strong></div>`}</div>`, "abnormal");
  }

  function mortalitySheet() {
    const rows = scopedMortality();
    return sheetShell(`今日死亡 ${number(mortalityValue())}`, `${contextLabel()} · 依 farm / house / flock 顯示`, `<div class="sheet-item-list">${rows.length ? rows.map((item) => `<button type="button" class="sheet-item" data-action="jump-context" data-farm-id="${item.farmId}" data-house-id="${item.houseId}" data-flock-id="${item.flockId}"><span><strong>${item.farm} / ${item.house}</strong><span>${item.flock} · ${item.time}</span></span><span class="sheet-item-end">${number(item.quantity)}</span></button>`).join("") : `<div class="empty-tab"><strong>此範圍沒有死亡明細</strong><p>prototype 不會用推算值補齊。</p></div>`}</div>${state.context.farmId === "all" ? `<div class="readonly-note">全部雞場 baseline：稽核紅羽一場 / 紅羽一舍 = 5；稽核烏骨三場 / 烏骨一舍 = 1。</div>` : ""}`, "mortality");
  }

  function cullSheet() {
    const rows = scopedCull();
    return sheetShell(`今日淘汰 ${number(cullValue())}`, contextLabel(), `<div class="sheet-item-list">${rows.length ? rows.map((item) => {
      const farm = farmById(item.farmId);
      const house = houseById(farm, item.houseId);
      const flock = house ? flockById(house, item.flockId) : null;
      return `<button type="button" class="sheet-item" data-action="jump-context" data-farm-id="${item.farmId}" data-house-id="${item.houseId || ""}" data-flock-id="${item.flockId || ""}"><span><strong>${farm.name} / ${house?.name || "場級"}</strong><span>${flock?.code || "全批次"} · ${item.time}</span></span><span class="sheet-item-end">${number(item.qty)}</span></button>`;
    }).join("") : `<div class="empty-tab"><strong>此範圍沒有淘汰明細</strong></div>`}</div>`, "cull");
  }

  function flocksSheet() {
    const rows = scopedFlocks();
    return sheetShell(`進行中批次 ${rows.length}`, `${contextLabel()} · 只列 active flock`, `<div class="sheet-item-list">${rows.length ? rows.map((flock) => `<button type="button" class="sheet-item" data-action="open-flock" data-flock-id="${flock.id}"><span><strong>${flock.code}</strong><span>${flock.farm} / ${flock.house} · 存欄 ${number(flock.stock)} · ${flock.status}</span></span><span class="sheet-item-end">›</span></button>`).join("") : `<div class="empty-tab"><strong>此範圍沒有進行中批次</strong><p>歷史已出雞批次不會被算入 active。</p></div>`}</div>`, "flocks");
  }

  function flockSheet(flockId) {
    const flock = allFlocks().find((item) => item.id === flockId) || allFlocks()[0];
    return sheetShell("Flock detail", `${flock.farm} / ${flock.house}`, `<div class="sheet-detail"><div class="detail-hero"><small>FLOCK · ${flock.state === "active" ? "ACTIVE" : "CLOSED"}</small><strong>${flock.code}</strong><span>${flock.status}</span></div><div class="detail-block"><h3>目前存欄</h3><p>${number(flock.stock)} 隻</p></div><div class="detail-block"><h3>初始入雞</h3><p>${number(flock.initial)} 隻 · 入雛 ${flock.chickIn}</p></div><div class="detail-block"><h3>預計／實際出雞</h3><p>${flock.ship}</p></div><button type="button" class="sheet-primary" data-action="jump-context" data-farm-id="${flock.farmId}" data-house-id="${flock.houseId}" data-flock-id="${flock.id}">套用這個 context</button></div>`, "flock");
  }

  function pendingItemSheet(id) {
    const item = DATA.pending.find((candidate) => candidate.id === id) || DATA.pending[0];
    return sheetShell(item.title, "固定 review item detail。", `<div class="detail-hero"><small>${item.kind}</small><strong>${item.title}</strong><span>${contextName(item)}</span></div><div class="detail-block"><h3>說明</h3><p>${item.detail}</p></div><div class="detail-block"><h3>處理邊界</h3><p>此公開 prototype 不會修改正式資料；正式 Web 仍須遵守 validation、confirmation 與 append-only Audit。</p></div><button type="button" class="sheet-primary" data-action="go-records">前往紀錄</button>`, "pending-item");
  }

  function abnormalItemSheet(id) {
    const item = DATA.abnormalities.find((candidate) => candidate.id === id) || DATA.abnormalities[0];
    return sheetShell(item.title, `${item.category} · ${item.state}`, `<div class="detail-hero"><small>ABNORMAL · ${item.status.toUpperCase()}</small><strong>${item.title}</strong><span>${contextName(item)}</span></div><div class="detail-block"><h3>紀錄</h3><p>${item.date} ${item.time} · 溫度快照 ${item.temp}°C</p></div><div class="detail-block"><h3>處理邊界</h3><p>此畫面只做 drill-down 互動展示，不替現場建立健康評分或產業比較。</p></div><button type="button" class="sheet-primary" data-action="go-records">查看紀錄</button>`, "abnormal-item");
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
    if (!state.sheet) state.previousFocus = document.activeElement;
    state.sheet = sheet;
    render();
    window.requestAnimationFrame(() => document.querySelector(".sheet-close")?.focus());
  }

  function closeSheet() {
    const focus = state.previousFocus;
    const scrollY = state.scrollY;
    state.sheet = null;
    state.contextDraft = null;
    render();
    if (focus && focus !== document.body && focus !== document.documentElement && document.contains(focus) && typeof focus.focus === "function") window.requestAnimationFrame(() => {
      focus.focus({ preventScroll: true });
      restoreScroll(scrollY);
    });
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
    if (action === "apply-farm-scope") {
      state.contextDraft.houseId = null;
      state.contextDraft.flockId = null;
      return applyDraftContext();
    }
    if (action === "apply-house-scope") {
      state.contextDraft.flockId = null;
      return applyDraftContext();
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
      state.context = { farmId: actionElement.dataset.farmId, houseId: actionElement.dataset.houseId || null, flockId: actionElement.dataset.flockId || null };
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

  assertDataContract();
  render();
})();
