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

  const DATA = {"farms":[{"id":"all","name":"全部在養","subtitle":"全域總覽","readOnly":true,"stock":31412,"mortality":6,"cull":1,"net":115000,"houses":[]},{"id":"red","name":"稽核紅羽一場","subtitle":"紅羽場區","breed":"紅羽","risk":"死亡偏高＋高溫","stock":12132,"mortality":5,"cull":1,"caretakers":["模擬飼養者甲","模擬飼養者乙"],"finance":{"gross":55000,"allocated":33000,"expense":1200,"net":31800,"investors":[["模擬投資人甲",50,16500],["模擬投資人乙",50,16500]],"expenses":[["粗糠",420],["清雞糞",330],["維修",250],["其他",200]]},"houses":[{"id":"red-1","name":"紅羽一舍","code":"H1","flocks":[{"id":"alpha","code":"AUDIT-RED-ALPHA","status":"7 日內準備出雞","state":"active","initial":7000,"stock":6812,"chickIn":"2026-07-20","ship":"2026-09-06","upcoming":true}]},{"id":"red-2","name":"紅羽二舍","code":"H2","flocks":[{"id":"beta","code":"AUDIT-RED-BETA","status":"進行中","state":"active","initial":5500,"stock":5320,"chickIn":"2026-08-01","ship":"2026-09-25","upcoming":false}]}]},{"id":"black","name":"稽核黑羽二場","subtitle":"黑羽場區","breed":"黑羽","risk":"穩定","stock":5420,"mortality":0,"cull":0,"caretakers":["模擬飼養者丙"],"finance":{"gross":70000,"allocated":42000,"expense":1500,"net":40500,"investors":[["模擬投資人甲",40,16800],["模擬投資人丙",60,25200]],"expenses":[["粗糠",500],["清雞糞",420],["水電",330],["維修",250]]},"houses":[{"id":"black-1","name":"黑羽一舍","code":"H1","flocks":[{"id":"black-a","code":"AUDIT-BLACK-001","status":"進行中","state":"active","initial":5600,"stock":5420,"chickIn":"2026-07-28","ship":"2026-09-18","upcoming":false}]},{"id":"black-2","name":"黑羽二舍","code":"H2","flocks":[]}]},{"id":"silkie","name":"稽核烏骨三場","subtitle":"烏骨場區","breed":"烏骨","risk":"飲水異常追蹤","stock":5940,"mortality":1,"cull":0,"caretakers":["模擬飼養者丁","模擬飼養者乙"],"finance":{"gross":46000,"allocated":27600,"expense":900,"net":26700,"investors":[["模擬投資人乙",50,13800],["模擬投資人丁",50,13800]],"expenses":[["粗糠",300],["清雞糞",250],["水電",200],["維修",150]]},"houses":[{"id":"silkie-1","name":"烏骨一舍","code":"H1","flocks":[{"id":"silkie-a","code":"AUDIT-SILKIE-A","status":"進行中","state":"active","initial":3300,"stock":3160,"chickIn":"2026-07-15","ship":"2026-09-10","upcoming":false}]},{"id":"silkie-2","name":"烏骨二舍","code":"H2","flocks":[{"id":"silkie-b","code":"AUDIT-SILKIE-B","status":"進行中","state":"active","initial":2900,"stock":2780,"chickIn":"2026-07-24","ship":"2026-09-17","upcoming":false}]}]},{"id":"new","name":"稽核新批四場","subtitle":"新批場區","breed":"紅羽新批","risk":"新批觀察","stock":7920,"mortality":0,"cull":0,"caretakers":["模擬飼養者戊"],"finance":{"gross":0,"allocated":0,"expense":600,"net":-600,"investors":[["模擬投資人甲",50,0],["模擬投資人戊",50,0]],"expenses":[["粗糠",200],["清雞糞",150],["水電",150],["其他",100]]},"houses":[{"id":"new-1","name":"新批一舍","code":"H1","flocks":[{"id":"new-a","code":"AUDIT-NEW-001","status":"進行中","state":"active","initial":8000,"stock":7920,"chickIn":"2026-08-25","ship":"2026-11-20","upcoming":false}]}]},{"id":"history","name":"稽核歷史五場","subtitle":"歷史 review 區","breed":"歷史批","risk":"已出雞／僅供歷史查詢","stock":0,"mortality":0,"cull":0,"caretakers":["模擬飼養者己"],"finance":{"gross":33000,"allocated":17400,"expense":800,"net":16600,"investors":[["模擬投資人乙",60,10440],["模擬投資人己",40,6960]],"expenses":[["清雞糞",260],["水電",220],["維修",180],["其他",140]]},"houses":[{"id":"history-1","name":"歷史一舍","code":"H1","flocks":[{"id":"history-old","code":"AUDIT-HISTORY-OLD","status":"已出雞","state":"closed","initial":5000,"stock":0,"chickIn":"2026-05-01","ship":"2026-07-31","upcoming":false}]},{"id":"history-2","name":"歷史二舍","code":"H2","flocks":[]}]}],"pending":[{"id":"pending-1","title":"死亡 3？來源不完整","detail":"需要確認雞舍後才能成為正式紀錄。","kind":"死亡紀錄","farmId":"red","houseId":null,"flockId":null},{"id":"pending-2","title":"確認 7 日內出雞準備","detail":"AUDIT-RED-ALPHA 預計 09/06 出雞。","kind":"出雞準備","farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"pending-3","title":"飼料數量可能缺單位","detail":"來源文字「飼料 6」，需人工確認。","kind":"飼料紀錄","farmId":"black","houseId":"black-1","flockId":"black-a"},{"id":"pending-4","title":"飲水異常需要追蹤","detail":"烏骨一舍飲水量偏低。","kind":"異常追蹤","farmId":"silkie","houseId":"silkie-1","flockId":"silkie-a"}],"abnormalities":[{"id":"abnormal-1","title":"活動力下降","category":"健康","state":"追蹤中","status":"active","date":"2026-08-30","time":"15:20","temp":34.0,"farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"abnormal-2","title":"飲水量偏低","category":"飲水","state":"追蹤中","status":"active","date":"2026-08-31","time":"07:10","temp":31.0,"farmId":"silkie","houseId":"silkie-1","flockId":"silkie-a"},{"id":"abnormal-3","title":"水線壓力不穩","category":"設備","state":"追蹤中","status":"active","date":"2026-08-29","time":"14:40","temp":32.2,"farmId":"silkie","houseId":"silkie-2","flockId":"silkie-b"},{"id":"abnormal-4","title":"歷史高溫紀錄","category":"環境","state":"已結案","status":"resolved","date":"2026-07-20","time":"14:00","temp":35.1,"farmId":"history","houseId":"history-1","flockId":"history-old"}],"events":[{"id":"e-r1","date":"2026-08-31","time":"08:10","type":"mortality","qty":5,"unit":"隻","farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"e-r2","date":"2026-08-31","time":"07:50","type":"cull","qty":1,"unit":"隻","farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"e-r3","date":"2026-08-29","time":"09:05","type":"feed","qty":240,"unit":"kg","farmId":"red","houseId":null,"flockId":null},{"id":"e-b1","date":"2026-08-30","time":"10:10","type":"feed","qty":210,"unit":"kg","farmId":"black","houseId":"black-1","flockId":"black-a"},{"id":"e-b2","date":"2026-08-28","time":"07:40","type":"mortality","qty":1,"unit":"隻","farmId":"black","houseId":"black-1","flockId":"black-a"},{"id":"e-s1","date":"2026-08-31","time":"06:50","type":"mortality","qty":1,"unit":"隻","farmId":"silkie","houseId":"silkie-1","flockId":"silkie-a"},{"id":"e-s2","date":"2026-08-30","time":"08:30","type":"water","qty":1850,"unit":"L","farmId":"silkie","houseId":"silkie-1","flockId":"silkie-a"},{"id":"e-n1","date":"2026-08-30","time":"09:00","type":"feed","qty":120,"unit":"kg","farmId":"new","houseId":"new-1","flockId":"new-a"},{"id":"e-h1","date":"2026-07-31","time":"06:00","type":"shipment","qty":4705,"unit":"隻","farmId":"history","houseId":"history-1","flockId":"history-old"}],"history":[{"label":"07/01","value":76000},{"label":"07/15","value":84200},{"label":"08/01","value":96500},{"label":"08/15","value":107500},{"label":"09/01","value":115000}]};

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
    previousFocusMeta: null,
    scrollY: 0,
    quickRecordDraft: "",
    resumeAfterFarmSelection: null,
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
    if (context.farm.id === "all") return "全部在養 · 全域總覽 · 唯讀";
    if (!context.house) return `${context.farm.name} · 選擇雞舍`;
    if (!context.flock) return `${context.farm.name} · ${context.house.name}`;
    return `${context.house.name} · ${context.flock.code}`;
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
    const houseButtons = farm.id === "all" ? "" : `<div class="scope-row"><span class="scope-label">雞舍</span><div class="scope-chips" data-testid="house-chips"><button type="button" class="scope-choice ${!state.context.houseId ? "active" : ""}" data-action="select-house-direct" data-house-id="">全場</button>${houses.map((house) => `<button type="button" class="scope-choice ${state.context.houseId === house.id ? "active" : ""}" data-action="select-house-direct" data-house-id="${house.id}">${house.name}</button>`).join("")}</div></div>`;
    const flockButtons = context.house && flocks.length ? `<div class="scope-row"><span class="scope-label">批次</span><div class="scope-chips" data-testid="flock-chips"><button type="button" class="scope-choice ${!state.context.flockId ? "active" : ""}" data-action="select-flock-direct" data-flock-id="">全部批次</button>${flocks.map((flock) => `<button type="button" class="scope-choice ${state.context.flockId === flock.id ? "active" : ""}" data-action="select-flock-direct" data-flock-id="${flock.id}">${flock.code}</button>`).join("")}</div></div>` : "";
    return `<section class="context-hub" aria-label="目前工作範圍">
      <div class="context-farm-row"><span class="scope-label">雞場</span><button class="farm-selector" type="button" data-action="open-context" data-testid="farm-selector" aria-label="目前雞場：${farm.name}。點擊切換雞場"><span class="context-icon">${icon("pin")}</span><span><strong>${farm.name}</strong><small>${farm.id === "all" ? "全域唯讀總覽" : (farm.id === "history" ? "歷史查詢" : farm.subtitle)}</small></span><span class="farm-selector-arrow">⌄</span></button></div>
      ${houseButtons}${flockButtons}
    </section>`;
  }

  function pageIntro(kicker, title, description = "") {
    return `<div class="page-intro"><div><h1>${title}</h1>${description ? `<p class="intro-description">${description}</p>` : ""}</div></div>`;
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
    return farm.houses.flatMap((house) => house.flocks).filter((flock) => flock.state === "active").reduce((sum, flock) => sum + (flock.stock || 0), 0);
  }

  function houseStock(house) {
    return house.flocks.filter((flock) => flock.state === "active").reduce((sum, flock) => sum + (flock.stock || 0), 0);
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
    const pending = scopedPending();
    const upcoming = upcomingFlocks();
    const activeAbnormal = scopedAbnormalities({ activeOnly: true });
    const resolvedAbnormal = scopedAbnormalities().length - activeAbnormal.length;
    const mortality = mortalityValue();
    const cull = cullValue();
    const actions = [];
    if (pending.length) actions.push(`<button type="button" class="action-card" data-action="open-sheet" data-sheet-kind="pending"><span class="action-icon">${icon("check")}</span><span class="action-copy"><strong>${pending.length} 筆需要人工確認</strong><span>查看哪些資料還需要補齊或確認</span></span><span class="action-count">${pending.length}</span><span class="action-arrow">›</span></button>`);
    if (upcoming.length) actions.push(`<button type="button" class="action-card good" data-action="open-sheet" data-sheet-kind="upcoming"><span class="action-icon">${icon("flock")}</span><span class="action-copy"><strong>${upcoming.length} 批 7 日內準備出雞</strong><span>${upcoming.map((flock) => flock.code).join("、")}</span></span><span class="action-count">${upcoming.length}</span><span class="action-arrow">›</span></button>`);
    if (activeAbnormal.length) actions.push(`<button type="button" class="action-card alert" data-action="open-sheet" data-sheet-kind="abnormal"><span class="action-icon">${icon("warning")}</span><span class="action-copy"><strong>${activeAbnormal.length} 筆異常需要留意</strong><span>${activeAbnormal.slice(0, 2).map((item) => `${contextName(item)} · ${item.title}`).join("；")}${resolvedAbnormal ? `；另 ${resolvedAbnormal} 筆已結案` : ""}</span></span><span class="action-count">${activeAbnormal.length}</span><span class="action-arrow">›</span></button>`);
    return `<section class="page today-page" data-page="today">
      ${contextBar()}
      <div class="today-date"><span>9 月 1 日</span><strong>今日</strong></div>
      <section class="digest" aria-labelledby="digest-title"><div class="digest-head"><p class="kicker">今日摘要</p><span class="digest-mark">${icon("digest")}</span></div><h2 id="digest-title">${digestCopy()}</h2><p>摘要只依目前工作範圍中的測試資料整理，不會自行增加數字。</p></section>
      <div class="section-heading"><div><h2>今天需處理</h2><p>先放真正需要處理的事情。</p></div><span class="scope-chip">${actions.length} 項</span></div>
      <section class="action-list" aria-label="今天需處理">${actions.length ? actions.slice(0, 3).join("") : `<div class="empty-tab"><strong>目前沒有急迫事項</strong><p>這個範圍沒有待確認、追蹤中異常或 7 日內出雞批次。</p></div>`}</section>
      <section class="hero-metric" aria-label="目前在養"><div><p class="kicker">目前在養 · ${contextShortLabel()}</p><strong data-testid="stock-value">${number(contextStock())}</strong><p>${stockDetail(currentContext())}</p></div><div class="hero-side"><span class="hero-icon">${icon("flock")}</span><span class="metric-label">${contextCountLabel()}</span><button type="button" class="ghost-light" data-action="open-sheet" data-sheet-kind="flocks">查看批次</button></div></section>
      <div class="quick-summary">
        ${mortality > 0 ? `<button type="button" class="summary-tile alert" data-action="open-sheet" data-sheet-kind="mortality"><span class="tile-label">今日死亡 <span aria-hidden="true">›</span></span><strong data-testid="mortality-value">${number(mortality)}</strong><small>${scopedMortality().map((item) => `${item.farm} ${item.quantity}`).join(" · ")}</small></button>` : `<div class="summary-tile"><span class="tile-label">今日死亡</span><strong data-testid="mortality-value">0</strong><small>這個範圍沒有死亡明細</small></div>`}
        ${cull > 0 ? `<button type="button" class="summary-tile good" data-action="open-sheet" data-sheet-kind="cull"><span class="tile-label">今日淘汰 <span aria-hidden="true">›</span></span><strong>${number(cull)}</strong><small>查看場、舍與批次</small></button>` : `<div class="summary-tile good"><span class="tile-label">今日淘汰</span><strong>0</strong><small>這個範圍沒有淘汰明細</small></div>`}
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
      <section class="hero-metric" aria-label="場務目前在養"><div><p class="kicker">目前在養</p><strong data-testid="farm-stock-value">${number(contextStock())}</strong><p>${stockDetail(context)}</p></div><div class="hero-side"><span class="hero-icon">${icon("farm")}</span><span class="metric-label">進行中批次 ${number(flocks.length)}</span></div></section>
      <div class="section-heading"><div><h2>${state.context.farmId === "all" ? "雞場狀況" : "目前雞場"}</h2><p>點雞場可查看詳細資料。</p></div></div>
      <section class="farm-grid">${farms.map((farm) => `<button type="button" class="farm-item" data-action="open-farm-detail" data-farm-id="${farm.id}"><div><h3>${farm.name}</h3><p>${farm.breed || farm.subtitle} · ${farm.risk || "全域"}</p></div><div class="farm-metric"><strong>${number(farm.stock)}</strong><span>在養隻數 ›</span></div></button>`).join("")}</section>
      ${state.context.farmId === "all" ? "" : `<section class="content-panel"><div class="panel-title"><div><h3>雞舍</h3><p>${context.farm.name} · 點雞舍查看詳細</p></div></div><div class="list-stack">${houses.map((house) => `<button type="button" class="list-row" data-action="open-house-detail" data-farm-id="${context.farm.id}" data-house-id="${house.id}"><span><strong>${house.name}</strong><span>${house.flocks.length} 個批次</span></span><span class="row-end"><span class="row-value">${number(houseStock(house))}</span><span>在養隻數 ›</span></span></button>`).join("")}</div></section>`}
      <section class="content-panel"><div class="panel-title"><div><h3>進行中批次</h3><p>${flocks.length} 批；已出雞的歷史批次不列入。</p></div><button type="button" class="text-link" data-action="open-sheet" data-sheet-kind="flocks">查看全部 →</button></div><div class="list-stack">${flocks.slice(0, 3).map((flock) => flockRow(flock)).join("") || `<div class="empty-tab"><strong>沒有進行中批次</strong><p>這個範圍可能是歷史場或空舍。</p></div>`}</div></section>
    </section>`;
  }

  function flockRow(flock) {
    return `<button type="button" class="list-row" data-action="open-flock" data-flock-id="${flock.id}"><span><strong>${flock.code}</strong><span>${flock.farm} / ${flock.house}</span></span><span class="row-end"><span class="status-chip ${flock.upcoming ? "good" : ""}">${flock.status}</span><span class="row-arrow">›</span></span></button>`;
  }

  function eventLabel(type) {
    return ({ mortality: "死亡", cull: "淘汰", feed: "飼料", water: "飲水", shipment: "出雞" })[type] || type;
  }

  function renderRecords() {
    const eventRows = scopedEvents().map((event) => ({ kind: "event", id: event.id, sort: `${event.date} ${event.time}`, title: `${eventLabel(event.type)} ${number(event.qty)} ${event.unit}`, detail: `${contextName(event)} · ${event.date} ${event.time}`, tone: ["mortality","cull"].includes(event.type) ? "alert" : "good", state: "有效" }));
    const abnormalRows = scopedAbnormalities().map((item) => ({ kind: "abnormal", id: item.id, sort: `${item.date} ${item.time}`, title: `異常：${item.title}`, detail: `${contextName(item)} · ${item.category} · ${item.date} ${item.time}`, tone: item.status === "active" ? "warn" : "good", state: item.state }));
    const rows = [...eventRows, ...abnormalRows].sort((a, b) => b.sort.localeCompare(a.sort));
    return `<section class="page" data-page="records">
      ${contextBar()}
      ${pageIntro("", "紀錄", "查看目前工作範圍內的營運紀錄。")}
      <div class="filter-note"><span><strong>目前範圍</strong>　${contextLabel()}</span><span class="scope-chip">${rows.length} 筆</span></div>
      <section class="content-panel"><div class="panel-title"><div><h3>紀錄時間軸</h3><p>死亡、淘汰、飼料、飲水、出雞與異常都跟著目前範圍切換。</p></div></div><div class="list-stack">${rows.length ? rows.map((record) => `<button type="button" class="list-row" data-action="${record.kind === "event" ? "open-event" : "open-abnormal"}" ${record.kind === "event" ? `data-event-id="${record.id}"` : `data-abnormal-id="${record.id}"`}><span><strong>${record.title}</strong><span>${record.detail}</span></span><span class="row-end"><span class="status-chip ${record.tone}">${record.state}</span><span class="row-arrow">›</span></span></button>`).join("") : `<div class="empty-tab"><strong>這個範圍沒有紀錄</strong><p>測試版不會用推算值補齊。</p></div>`}</div></section>
      <section class="content-grid"><div class="content-panel"><h3>需要人工確認</h3><p>${scopedPending().length} 筆待確認項目。</p><button type="button" class="text-link" data-action="go-todo">前往待辦 →</button></div><div class="content-panel"><h3>測試版說明</h3><p>目前不會寫入正式資料。</p></div></section>
    </section>`;
  }

  function renderTodo() {
    const pending = scopedPending();
    const upcoming = upcomingFlocks();
    return `<section class="page" data-page="todo">
      ${contextBar()}
      ${pageIntro("", "待辦", "只放目前工作範圍真正有下一步的事情。")}
      <section class="action-list">${pending.length ? `<button type="button" class="action-card" data-action="open-sheet" data-sheet-kind="pending"><span class="action-icon">${icon("check")}</span><span class="action-copy"><strong>${pending.length} 筆需要人工確認</strong><span>${contextShortLabel()}</span></span><span class="action-count">${pending.length}</span><span class="action-arrow">›</span></button>` : ""}${upcoming.length ? `<button type="button" class="action-card good" data-action="open-sheet" data-sheet-kind="upcoming"><span class="action-icon">${icon("flock")}</span><span class="action-copy"><strong>${upcoming.length} 批 7 日內準備出雞</strong><span>${upcoming.map((flock) => flock.code).join("、")}</span></span><span class="action-count">${upcoming.length}</span><span class="action-arrow">›</span></button>` : ""}</section>
      <section class="content-panel"><div class="panel-title"><div><h3>待人工確認清單</h3><p>場級資料若還不知道雞舍，會明確標示。</p></div><span class="status-chip warn">${pending.length} 筆</span></div><div class="list-stack">${pending.length ? pending.map((item) => `<button type="button" class="list-row" data-action="open-pending-item" data-pending-id="${item.id}"><span><strong>${item.title}</strong><span>${pendingContextName(item)} · ${item.detail}</span></span><span class="row-end"><span class="row-value">${item.kind}</span><span class="row-arrow">›</span></span></button>`).join("") : `<div class="empty-tab"><strong>這個範圍沒有待確認項目</strong><p>可切換雞場或雞舍查看其他資料。</p></div>`}</div></section>
    </section>`;
  }

  function renderMore() {
    return `<section class="page" data-page="more">
      ${contextBar()}
      ${pageIntro("", "更多", "低頻功能集中在這裡，日常畫面保持乾淨。")}
      <div class="more-list">
        <button type="button" class="more-item" data-action="open-sheet" data-sheet-kind="insights"><span class="more-item-icon">${icon("chart")}</span><span><strong>洞察</strong><span>死亡、目前在養、飼料、飲水與異常摘要</span></span><span>›</span></button>
        <button type="button" class="more-item" data-action="go-finance"><span class="more-item-icon">${icon("finance")}</span><span><strong>財務</strong><span>總覽、各場、股權、費用、分配與統計</span></span><span>›</span></button>
        <button type="button" class="more-item" data-action="go-ai"><span class="more-item-icon">${icon("ai")}</span><span><strong>AI 助理</strong><span>帶入目前工作範圍；此測試版維持唯讀</span></span><span>›</span></button>
        <button type="button" class="more-item" data-action="open-sheet" data-sheet-kind="system"><span class="more-item-icon">${icon("lock")}</span><span><strong>系統</strong><span>查看雞場、雞舍、批次與服務邊界</span></span><span>›</span></button>
        <button type="button" class="more-item" data-action="open-sheet" data-sheet-kind="audit"><span class="more-item-icon">${icon("records")}</span><span><strong>變更紀錄</strong><span>修改、取消與操作歷程的入口</span></span><span>›</span></button>
        <button type="button" class="more-item" data-action="open-sheet" data-sheet-kind="settings"><span class="more-item-icon">${icon("more")}</span><span><strong>設定</strong><span>操作與管理設定</span></span><span>›</span></button>
      </div>
    </section>`;
  }

  function renderAi() {
    return `<section class="page" data-page="ai">
      ${contextBar()}
      ${pageIntro("", "AI 助理", "AI 只讀取目前工作範圍，不直接修改資料。")}
      <section class="digest"><div class="digest-head"><p class="kicker">目前範圍摘要</p><span class="digest-mark">${icon("ai")}</span></div><h2>${contextLabel()}</h2><p>目前在養 ${number(contextStock())}；今日死亡 ${number(mortalityValue())}；待確認 ${scopedPending().length}；追蹤中異常 ${scopedAbnormalities({ activeOnly: true }).length}。</p></section>
      <section class="content-grid"><div class="content-panel"><h3>目前範圍</h3><p>${contextLabel()}</p></div><div class="content-panel"><h3>測試版</h3><p>這個測試版不會真的呼叫 AI，也不會寫入資料。</p></div></section>
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
    return `<div class="chart-wrap"><svg class="net-chart" data-testid="finance-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="測試資料 歷史淨值變化折線圖，最後資料點為 115,000">
      ${yTicks.map((tick) => { const y = top + ((max - tick) / (max - min)) * plotHeight; return `<line class="chart-grid" x1="${left}" x2="${width - right}" y1="${y}" y2="${y}"/><text class="chart-axis" x="4" y="${y + 4}">${money(tick)}</text>`; }).join("")}
      <polygon class="chart-area" points="${area}"/><polyline class="chart-line" points="${polyline}"/>
      ${points.map((point, index) => `<circle class="chart-point ${index === points.length - 1 ? "current" : ""}" cx="${point.x}" cy="${point.y}" r="${index === points.length - 1 ? 6 : 4}"/><text class="chart-axis" text-anchor="middle" x="${point.x}" y="${height - 13}">${point.label}</text>${index === points.length - 1 ? `<text class="chart-value" text-anchor="end" x="${point.x - 10}" y="${point.y - 12}">${money(point.value)}</text>` : ""}`).join("")}
    </svg></div>`;
  }

  function renderFinanceOverview() {
    const totals = financeContext();
    const context = currentContext();
    return `<section class="finance-header"><div class="finance-kpis"><button type="button" class="finance-kpi finance-kpi-button" data-action="open-finance-metric" data-finance-metric="gross"><span>毛利</span><strong>${money(totals.gross)}</strong><small>查看構成 ›</small></button><button type="button" class="finance-kpi finance-kpi-button amber" data-action="open-finance-metric" data-finance-metric="allocated"><span>已配置</span><strong>${money(totals.allocated)}</strong><small>查看分配 ›</small></button><button type="button" class="finance-kpi finance-kpi-button red" data-action="open-finance-metric" data-finance-metric="expense"><span>費用</span><strong>${money(totals.expense)}</strong><small>查看分類 ›</small></button><button type="button" class="finance-kpi finance-kpi-button green" data-action="open-finance-metric" data-finance-metric="net"><span>目前淨額</span><strong data-testid="finance-net">${money(totals.net)}</strong><small>查看計算 ›</small></button></div><div class="metric-note"><strong>${context.farm.id === "all" ? "全部在養財務" : `${context.farm.name} 財務`}</strong><span>${context.farm.id === "all" ? "五個雞場合計。" : "雞舍／批次沿用所屬雞場財務。"}</span></div></section>${totals.chart ? `<section class="chart-panel"><div class="chart-title"><div><h3>歷史淨值變化</h3><p>測試用歷史趨勢 · 最後一點為目前淨額 115,000</p></div><span class="status-chip warn">測試資料</span></div>${chartMarkup()}</section>` : `<section class="chart-panel"><div class="chart-title"><div><h3>歷史淨值變化</h3><p>目前只有全部在養的測試用歷史趨勢。</p></div><span class="status-chip warn">此場無獨立趨勢</span></div><div class="empty-tab"><strong>此雞場沒有獨立歷史序列</strong><p>避免把全部在養趨勢誤看成 ${context.farm.name} 的獨立歷史。</p></div></section>`}`;
  }

  function financeTabBody() {
    const scope = financeScope();
    if (state.financeTab === "overview") return renderFinanceOverview();
    if (state.financeTab === "farms") {
      const farms = state.context.farmId === "all" ? allProductionFarms() : scope.farms;
      return `<section class="content-panel"><div class="panel-title"><div><h3>各場</h3><p>查看各場毛利、已配置、費用與淨額。</p></div><span class="status-chip good">${farms.length} 場</span></div><div class="list-stack">${farms.map((farm) => `<button type="button" class="list-row" data-action="open-finance-farm" data-farm-id="${farm.id}"><span><strong>${farm.name}</strong><span>毛利 ${money(farm.finance.gross)} · 已配置 ${money(farm.finance.allocated)} · 費用 ${money(farm.finance.expense)}</span></span><span class="row-end"><span class="row-value">${money(farm.finance.net)}</span><span>淨額 ›</span></span></button>`).join("")}</div></section>`;
    }
    if (state.financeTab === "equity") {
      const investors = investorSummary(scope.farms);
      return `<section class="content-panel"><div class="panel-title"><div><h3>投資人／股權</h3><p>依目前財務範圍顯示投資人配置。</p></div><span class="status-chip good">${investors.length} 位</span></div><div class="list-stack">${investors.map((investor) => `<button type="button" class="list-row" data-action="open-investor-detail" data-investor-name="${escapeHtml(investor.name)}"><span><strong>${investor.name}</strong><span>${investor.farms.map((row) => `${row.farm} ${row.share}%`).join(" · ")}</span></span><span class="row-end"><span class="row-value">${money(investor.amount)}</span><span>配置金額 ›</span></span></button>`).join("")}</div></section>`;
    }
    if (state.financeTab === "expenses") {
      return `<section class="content-panel"><div class="panel-title"><div><h3>費用</h3><p>測試用費用分類；各場分類總和與目前費用一致。</p></div><span class="status-chip warn">${money(scope.expense)}</span></div><div class="list-stack">${scope.farms.map((farm) => `<button type="button" class="list-row" data-action="open-expense-detail" data-farm-id="${farm.id}"><span><strong>${farm.name}</strong><span>${farm.finance.expenses.map(([name, value]) => `${name} ${money(value)}`).join(" · ")}</span></span><span class="row-end"><span class="row-value">${money(farm.finance.expense)}</span><span>費用 ›</span></span></button>`).join("")}</div></section>`;
    }
    if (state.financeTab === "distribution") {
      const rows = scope.farms.flatMap((farm) => farm.finance.investors.map(([name, share, amount]) => ({ farm, name, share, amount })));
      return `<section class="content-panel"><div class="panel-title"><div><h3>分配</h3><p>依各場股權比例列出本期測試配置。</p></div><span class="status-chip good">${money(scope.allocated)}</span></div><div class="list-stack">${rows.map((row) => `<button type="button" class="list-row" data-action="open-distribution-detail" data-farm-id="${row.farm.id}" data-investor-name="${escapeHtml(row.name)}"><span><strong>${row.name} · ${row.farm.name}</strong><span>股權 ${row.share}%</span></span><span class="row-end"><span class="row-value">${money(row.amount)}</span><span>›</span></span></button>`).join("")}</div></section>`;
    }
    const allocationRate = scope.gross ? (scope.allocated / scope.gross) * 100 : 0;
    const expenseRate = scope.gross ? (scope.expense / scope.gross) * 100 : 0;
    const netMargin = scope.gross ? (scope.net / scope.gross) * 100 : 0;
    const bestFarm = [...scope.farms].sort((a, b) => b.finance.net - a.finance.net)[0];
    const topInvestor = investorSummary(scope.farms)[0];
    return `<section class="content-panel"><div class="panel-title"><div><h3>統計分析</h3><p>全部由目前測試財務資料計算，不引入外部產業數據。</p></div><span class="status-chip good">計算值</span></div><div class="list-stack">
      <button type="button" class="list-row" data-action="open-analysis-detail" data-analysis-key="allocation"><span><strong>配置率</strong><span>已配置 ÷ 毛利</span></span><span class="row-end"><span class="row-value">${allocationRate.toFixed(1)}%</span><span>›</span></span></button>
      <button type="button" class="list-row" data-action="open-analysis-detail" data-analysis-key="expense"><span><strong>費用率</strong><span>費用 ÷ 毛利</span></span><span class="row-end"><span class="row-value">${expenseRate.toFixed(2)}%</span><span>›</span></span></button>
      <button type="button" class="list-row" data-action="open-analysis-detail" data-analysis-key="net"><span><strong>淨額／毛利</strong><span>淨額 ÷ 毛利</span></span><span class="row-end"><span class="row-value">${netMargin.toFixed(1)}%</span><span>›</span></span></button>
      <button type="button" class="list-row" data-action="open-analysis-detail" data-analysis-key="best-farm"><span><strong>最高淨額場次</strong><span>${bestFarm?.name || "—"}</span></span><span class="row-end"><span class="row-value">${bestFarm ? money(bestFarm.finance.net) : "—"}</span><span>›</span></span></button>
      <button type="button" class="list-row" data-action="open-analysis-detail" data-analysis-key="top-investor"><span><strong>最高配置投資人</strong><span>${topInvestor?.name || "—"}</span></span><span class="row-end"><span class="row-value">${topInvestor ? money(topInvestor.amount) : "—"}</span><span>›</span></span></button>
    </div></section>`;
  }

  function renderFinance() {
    const tabs = [["overview", "總覽"], ["farms", "各場"], ["equity", "投資人／股權"], ["expenses", "費用"], ["distribution", "分配"], ["analysis", "統計分析"]];
    return `<section class="page" data-page="finance">
      ${contextBar()}
      ${pageIntro("", "財務", "總覽、各場、股權、費用、分配與統計都使用同一組測試資料。")}
      <div class="finance-tabs" role="tablist" aria-label="財務分頁">${tabs.map(([key, label]) => `<button type="button" role="tab" aria-selected="${state.financeTab === key}" class="finance-tab ${state.financeTab === key ? "active" : ""}" data-action="finance-tab" data-finance-tab="${key}">${label}</button>`).join("")}</div>
      ${financeTabBody()}
      <div class="sync-note"><strong>財務範圍：</strong>${contextLabel()}。財務最小範圍為雞場；選到雞舍或批次時沿用所屬雞場財務資料。</div>
    </section>`;
  }

  function sheetShell(title, subtitle, body, kind) {
    return `<div class="sheet-layer" data-testid="bottom-sheet"><div class="sheet-backdrop" data-action="close-sheet" aria-hidden="true"></div><section class="sheet-panel" data-sheet-kind="${kind}" role="dialog" aria-modal="true" aria-labelledby="sheet-title" tabindex="-1"><div class="sheet-head"><div class="sheet-handle" aria-hidden="true"></div><div class="sheet-head-row"><div><h2 id="sheet-title">${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ""}</div><button type="button" class="sheet-close" data-action="close-sheet" aria-label="關閉">×</button></div></div><div class="sheet-body">${body}</div></section></div>`;
  }

  function contextSheet() {
    const farmOptions = DATA.farms.map((option) => `<button type="button" class="option-row ${state.context.farmId === option.id ? "selected" : ""}" data-action="select-farm-direct" data-farm-id="${option.id}"><span><strong>${option.name}</strong><span>${option.id === "all" ? "全域唯讀總覽" : `${option.id === "history" ? "歷史查詢" : option.subtitle} · 在養隻數 ${number(option.stock)}`}</span></span><span class="option-check">${state.context.farmId === option.id ? icon("check") : icon("arrow")}</span></button>`).join("");
    return sheetShell("選擇雞場", "選好雞場後，雞舍與批次可直接在頁面上用按鈕切換。", `<div class="option-list">${farmOptions}</div>`, "context");
  }

  function pendingSheet() {
    const rows = scopedPending();
    return sheetShell(`${rows.length} 筆需要人工確認`, contextLabel(), `<div class="sheet-item-list">${rows.length ? rows.map((item) => `<button type="button" class="sheet-item" data-action="open-pending-item" data-pending-id="${item.id}"><span><strong>${item.title}</strong><span>${pendingContextName(item)} · ${item.kind}</span></span><span class="sheet-item-end">›</span></button>`).join("") : `<div class="empty-tab"><strong>這個範圍沒有待確認資料</strong></div>`}</div><div class="readonly-note">測試版只展示操作，不會寫入正式資料。</div>`, "pending");
  }

  function upcomingSheet() {
    const rows = upcomingFlocks();
    return sheetShell(`${rows.length} 批 7 日內準備出雞`, contextLabel(), `<div class="sheet-item-list">${rows.length ? rows.map((flock) => `<button type="button" class="sheet-item" data-action="open-flock" data-flock-id="${flock.id}"><span><strong>${flock.code}</strong><span>${flock.farm} / ${flock.house} · ${flock.status}</span></span><span class="sheet-item-end">›</span></button>`).join("") : `<div class="empty-tab"><strong>此範圍沒有 7 日內出雞批次</strong><p>目前工作範圍沒有符合條件的進行中批次。</p></div>`}</div>`, "upcoming");
  }

  function abnormalSheet() {
    const rows = scopedAbnormalities();
    const active = rows.filter((item) => item.status === "active").length;
    const resolved = rows.length - active;
    return sheetShell(`異常紀錄 ${rows.length}`, `${active} 筆追蹤中${resolved ? ` · ${resolved} 筆已結案` : ""}`, `<div class="sheet-item-list">${rows.length ? rows.map((item) => `<button type="button" class="sheet-item" data-action="open-abnormal" data-abnormal-id="${item.id}"><span><strong>${item.title}</strong><span>${contextName(item)} · ${item.category} · ${item.state}</span></span><span class="sheet-item-end">›</span></button>`).join("") : `<div class="empty-tab"><strong>此範圍沒有異常紀錄</strong></div>`}</div>`, "abnormal");
  }

  function mortalitySheet() {
    const rows = scopedMortality();
    return sheetShell(`今日死亡 ${number(mortalityValue())}`, contextLabel(), `<div class="sheet-item-list">${rows.length ? rows.map((item) => `<button type="button" class="sheet-item" data-action="open-event" data-event-id="${item.id}"><span><strong>${item.farm} / ${item.house}</strong><span>${item.flock} · ${item.time}</span></span><span class="sheet-item-end">${number(item.quantity)} ›</span></button>`).join("") : `<div class="empty-tab"><strong>這個範圍沒有死亡明細</strong></div>`}</div>`, "mortality");
  }

  function cullSheet() {
    const rows = scopedCull();
    return sheetShell(`今日淘汰 ${number(cullValue())}`, contextLabel(), `<div class="sheet-item-list">${rows.length ? rows.map((item) => {
      const farm = farmById(item.farmId);
      const house = houseById(farm, item.houseId);
      const flock = house ? flockById(house, item.flockId) : null;
      return `<button type="button" class="sheet-item" data-action="open-event" data-event-id="${item.id}"><span><strong>${farm.name} / ${house?.name || "場級"}</strong><span>${flock?.code || "全批次"} · ${item.time}</span></span><span class="sheet-item-end">${number(item.qty)} ›</span></button>`;
    }).join("") : `<div class="empty-tab"><strong>這個範圍沒有淘汰明細</strong></div>`}</div>`, "cull");
  }

  function flocksSheet() {
    const rows = scopedFlocks();
    return sheetShell(`進行中批次 ${rows.length}`, `${contextLabel()} · 只列進行中批次`, `<div class="sheet-item-list">${rows.length ? rows.map((flock) => `<button type="button" class="sheet-item" data-action="open-flock" data-flock-id="${flock.id}"><span><strong>${flock.code}</strong><span>${flock.farm} / ${flock.house} · 本批在養 ${number(flock.stock)} · ${flock.status}</span></span><span class="sheet-item-end">›</span></button>`).join("") : `<div class="empty-tab"><strong>此範圍沒有進行中批次</strong><p>歷史已出雞批次不列入進行中批次。</p></div>`}</div>`, "flocks");
  }

  function flockSheet(flockId) {
    const flock = allFlocks().find((item) => item.id === flockId) || allFlocks()[0];
    return sheetShell("批次詳細", `${flock.farm} / ${flock.house}`, `<div class="sheet-detail"><div class="detail-hero"><small>${flock.state === "active" ? "進行中" : "已出雞"}</small><strong>${flock.code}</strong><span>${flock.status}</span></div><div class="detail-block"><h3>本批在養</h3><p>${number(flock.stock)} 隻</p></div><div class="detail-block"><h3>初始入雞</h3><p>${number(flock.initial)} 隻 · 入雛 ${flock.chickIn}</p></div><div class="detail-block"><h3>預計／實際出雞</h3><p>${flock.ship}</p></div><button type="button" class="sheet-primary" data-action="jump-context" data-farm-id="${flock.farmId}" data-house-id="${flock.houseId}" data-flock-id="${flock.id}">切換到這個批次</button></div>`, "flock");
  }

  function pendingItemSheet(id) {
    const item = DATA.pending.find((candidate) => candidate.id === id) || DATA.pending[0];
    return sheetShell(item.title, item.kind, `<div class="detail-hero"><small>${item.kind}</small><strong>${item.title}</strong><span>${pendingContextName(item)}</span></div><div class="detail-block"><h3>說明</h3><p>${item.detail}</p></div><div class="detail-block"><h3>測試版說明</h3><p>這裡只展示處理流程，不會修改正式資料。</p></div><button type="button" class="sheet-primary" data-action="go-records">前往紀錄</button>`, "pending-item");
  }

  function abnormalItemSheet(id) {
    const item = DATA.abnormalities.find((candidate) => candidate.id === id) || DATA.abnormalities[0];
    return sheetShell(item.title, `${item.category} · ${item.state}`, `<div class="detail-hero"><small>${item.state}</small><strong>${item.title}</strong><span>${contextName(item)}</span></div><div class="detail-block"><h3>紀錄</h3><p>${item.date} ${item.time} · 溫度快照 ${item.temp}°C</p></div><div class="detail-block"><h3>說明</h3><p>這個畫面只展示既有異常資料，不會自行產生健康評分或產業比較。</p></div><button type="button" class="sheet-primary" data-action="go-records">查看紀錄</button>`, "abnormal-item");
  }

  function eventItemSheet(id) {
    const item = DATA.events.find((event) => event.id === id) || DATA.events[0];
    const farm = farmById(item.farmId);
    const house = item.houseId ? houseById(farm, item.houseId) : null;
    const flock = house && item.flockId ? flockById(house, item.flockId) : null;
    return sheetShell(`${eventLabel(item.type)} ${number(item.qty)} ${item.unit}`, `${item.date} ${item.time}`, `<div class="detail-hero"><small>${eventLabel(item.type)}紀錄</small><strong>${number(item.qty)} ${item.unit}</strong><span>${contextName(item)}</span></div><div class="detail-block"><h3>位置</h3><p>${farm.name}${house ? ` · ${house.name}` : " · 場級紀錄"}${flock ? ` · ${flock.code}` : ""}</p></div>${flock ? `<button type="button" class="sheet-primary" data-action="jump-context" data-farm-id="${farm.id}" data-house-id="${house.id}" data-flock-id="${flock.id}">切換到這個批次</button>` : ""}`, "event-item");
  }

  function farmDetailSheet(farmId) {
    const farm = farmById(farmId);
    const active = farm.houses.flatMap((house) => house.flocks).filter((flock) => flock.state === "active");
    return sheetShell(farm.name, `${farm.breed || farm.subtitle} · ${farm.risk || ""}`, `<div class="detail-hero"><small>雞場</small><strong>${number(farmStock(farm))} 隻</strong><span>${active.length} 批進行中</span></div><div class="detail-block"><h3>雞舍</h3><div class="sheet-item-list">${farm.houses.map((house) => `<button type="button" class="sheet-item" data-action="open-house-detail" data-farm-id="${farm.id}" data-house-id="${house.id}"><span><strong>${house.name}</strong><span>在養隻數 ${number(houseStock(house))} · ${house.flocks.length} 個批次</span></span><span class="sheet-item-end">›</span></button>`).join("")}</div></div><button type="button" class="sheet-primary" data-action="set-farm-scope" data-farm-id="${farm.id}">切換到這個雞場</button>`, "farm-detail");
  }

  function houseDetailSheet(farmId, houseId) {
    const farm = farmById(farmId);
    const house = houseById(farm, houseId);
    return sheetShell(house?.name || "雞舍詳細", farm.name, `<div class="detail-hero"><small>雞舍</small><strong>${number(house ? houseStock(house) : 0)} 隻</strong><span>${house?.flocks.length || 0} 個批次</span></div><div class="detail-block"><h3>批次</h3><div class="sheet-item-list">${(house?.flocks || []).map((flock) => `<button type="button" class="sheet-item" data-action="open-flock" data-flock-id="${flock.id}"><span><strong>${flock.code}</strong><span>${flock.status} · 本批在養 ${number(flock.stock)}</span></span><span class="sheet-item-end">›</span></button>`).join("") || `<div class="empty-tab"><strong>目前沒有批次</strong></div>`}</div></div><button type="button" class="sheet-primary" data-action="set-house-scope" data-farm-id="${farm.id}" data-house-id="${house?.id || ""}">切換到這個雞舍</button>`, "house-detail");
  }

  function quickActionsSheet() {
    const isGlobal = state.context.farmId === "all";
    return sheetShell("快速行動", contextLabel(), `<div class="option-list"><button type="button" class="option-row" data-action="open-quick-record"><span><strong>＋ 快速記錄</strong><span>${isGlobal ? "全部在養為唯讀，點入後可先選雞場" : "用目前雞場、雞舍與批次準備一筆紀錄"}</span></span><span class="option-check">${icon("arrow")}</span></button><button type="button" class="option-row" data-action="go-ai"><span><strong>✦ 問 AI</strong><span>帶入目前工作範圍；AI 維持唯讀</span></span><span class="option-check">${icon("arrow")}</span></button></div>`, "quick-actions");
  }

  function quickRecordSheet() {
    if (state.context.farmId === "all") return sheetShell("快速記錄", "全部在養為唯讀", `<div class="empty-tab"><strong>請先選一個雞場</strong><p>選好後會自動回到快速記錄，不需要重新開啟。</p></div><button type="button" class="sheet-primary" data-action="open-context-for-quick-record">選擇雞場</button>`, "quick-record");
    return sheetShell("快速記錄", contextLabel(), `<label class="quick-record-label" for="quick-record-input">要記什麼？</label><textarea id="quick-record-input" class="quick-record-input" rows="4" placeholder="例如：死亡5，咳嗽，臭腳">${escapeHtml(state.quickRecordDraft)}</textarea><p class="quick-record-note">這是互動測試版，只做預覽，不會寫入資料。</p><button type="button" class="sheet-primary" data-action="preview-quick-record">預覽紀錄</button>`, "quick-record");
  }

  function quickRecordPreviewSheet() {
    return sheetShell("紀錄預覽", contextLabel(), `<div class="detail-hero"><small>尚未儲存</small><strong>${escapeHtml(state.quickRecordDraft || "（沒有內容）")}</strong><span>正式版仍需確認後才會寫入，並保留變更紀錄。</span></div><div class="readonly-note">本測試版不會真正送出或修改任何資料。</div>`, "quick-record-preview");
  }

  function insightsSheet() {
    const feedCount = scopedEvents("feed").length;
    const waterCount = scopedEvents("water").length;
    const activeAbnormal = scopedAbnormalities({ activeOnly: true }).length;
    return sheetShell("洞察", contextLabel(), `<div class="sheet-item-list"><button type="button" class="sheet-item" data-action="open-insight-detail" data-insight-key="stock"><span><strong>目前在養與批次</strong><span>${number(contextStock())} 隻 · ${scopedFlocks().length} 批進行中</span></span><span class="sheet-item-end">›</span></button><button type="button" class="sheet-item" data-action="open-sheet" data-sheet-kind="mortality"><span><strong>今日死亡</strong><span>${number(mortalityValue())} 隻</span></span><span class="sheet-item-end">›</span></button><button type="button" class="sheet-item" data-action="open-sheet" data-sheet-kind="cull"><span><strong>今日淘汰</strong><span>${number(cullValue())} 隻</span></span><span class="sheet-item-end">›</span></button><button type="button" class="sheet-item" data-action="open-sheet" data-sheet-kind="abnormal"><span><strong>異常追蹤</strong><span>${activeAbnormal} 筆追蹤中</span></span><span class="sheet-item-end">›</span></button><button type="button" class="sheet-item" data-action="open-insight-detail" data-insight-key="feed"><span><strong>飼料紀錄</strong><span>${feedCount} 筆</span></span><span class="sheet-item-end">›</span></button><button type="button" class="sheet-item" data-action="open-insight-detail" data-insight-key="water"><span><strong>飲水紀錄</strong><span>${waterCount} 筆</span></span><span class="sheet-item-end">›</span></button></div>`, "insights");
  }

  function insightDetailSheet(key) {
    if (key === "stock") return sheetShell("目前在養與批次", contextLabel(), `<div class="detail-hero"><small>目前在養</small><strong>${number(contextStock())} 隻</strong><span>${scopedFlocks().length} 批進行中</span></div><div class="sheet-item-list">${scopedFlocks().map((flock) => `<button type="button" class="sheet-item" data-action="open-flock" data-flock-id="${flock.id}"><span><strong>${flock.code}</strong><span>${flock.farm} · ${flock.house} · ${number(flock.stock)} 隻</span></span><span class="sheet-item-end">›</span></button>`).join("") || `<div class="empty-tab"><strong>沒有進行中批次</strong></div>`}</div>`, "insight-detail");
    const type = key === "feed" ? "feed" : "water";
    const rows = scopedEvents(type);
    return sheetShell(key === "feed" ? "飼料紀錄" : "飲水紀錄", contextLabel(), `<div class="sheet-item-list">${rows.map((item) => `<button type="button" class="sheet-item" data-action="open-event" data-event-id="${item.id}"><span><strong>${eventLabel(item.type)} ${number(item.qty)} ${item.unit}</strong><span>${contextName(item)} · ${item.date} ${item.time}</span></span><span class="sheet-item-end">›</span></button>`).join("") || `<div class="empty-tab"><strong>目前沒有相關紀錄</strong></div>`}</div>`, "insight-detail");
  }

  function systemSheet() {
    const farms = allProductionFarms();
    const houses = farms.flatMap((farm) => farm.houses);
    return sheetShell("系統", "測試版資訊", `<div class="sheet-item-list"><button type="button" class="sheet-item" data-action="open-system-detail" data-system-key="farms"><span><strong>雞場</strong><span>${farms.length} 場</span></span><span class="sheet-item-end">›</span></button><button type="button" class="sheet-item" data-action="open-system-detail" data-system-key="houses"><span><strong>雞舍</strong><span>${houses.length} 舍</span></span><span class="sheet-item-end">›</span></button><button type="button" class="sheet-item" data-action="open-system-detail" data-system-key="flocks"><span><strong>批次</strong><span>${allFlocks().length} 批</span></span><span class="sheet-item-end">›</span></button><div class="sheet-item static"><span><strong>正式服務</strong><span>這個公開測試版沒有連線 LINE、資料庫或正式後端</span></span></div></div>`, "system");
  }

  function systemDetailSheet(key) {
    const farms = allProductionFarms();
    if (key === "farms") return sheetShell("雞場清單", `${farms.length} 場`, `<div class="sheet-item-list">${farms.map((farm) => `<button type="button" class="sheet-item" data-action="open-farm-detail" data-farm-id="${farm.id}"><span><strong>${farm.name}</strong><span>在養隻數 ${number(farm.stock)} · ${farm.risk}</span></span><span class="sheet-item-end">›</span></button>`).join("")}</div>`, "system-detail");
    if (key === "houses") return sheetShell("雞舍清單", `${farms.flatMap((farm) => farm.houses).length} 舍`, `<div class="sheet-item-list">${farms.flatMap((farm) => farm.houses.map((house) => `<button type="button" class="sheet-item" data-action="open-house-detail" data-farm-id="${farm.id}" data-house-id="${house.id}"><span><strong>${farm.name} · ${house.name}</strong><span>在養隻數 ${number(houseStock(house))} · ${house.flocks.length} 個批次</span></span><span class="sheet-item-end">›</span></button>`)).join("")}</div>`, "system-detail");
    return sheetShell("批次清單", `${allFlocks().length} 批`, `<div class="sheet-item-list">${allFlocks().map((flock) => `<button type="button" class="sheet-item" data-action="open-flock" data-flock-id="${flock.id}"><span><strong>${flock.code}</strong><span>${flock.farm} · ${flock.house} · ${flock.status}</span></span><span class="sheet-item-end">›</span></button>`).join("")}</div>`, "system-detail");
  }

  function auditSheet() {
    return sheetShell("變更紀錄", "修改、取消與操作歷程", `<div class="empty-tab"><strong>目前沒有新增變更紀錄</strong><p>這個測試版不會真正寫入資料，因此不虛構變更紀錄。正式版仍應以追加紀錄方式保留修改與取消歷程。</p></div>`, "audit");
  }

  function settingsSheet() {
    return sheetShell("設定", "操作與管理設定", `<div class="sheet-item-list"><button type="button" class="sheet-item" data-action="open-settings-detail" data-settings-key="master"><span><strong>雞場與雞舍管理</strong><span>正式版需管理者驗證</span></span><span class="sheet-item-end">›</span></button><button type="button" class="sheet-item" data-action="open-settings-detail" data-settings-key="line"><span><strong>LINE 群組</strong><span>群組與通知設定</span></span><span class="sheet-item-end">›</span></button><button type="button" class="sheet-item" data-action="open-settings-detail" data-settings-key="display"><span><strong>顯示與操作</strong><span>介面偏好與操作說明</span></span><span class="sheet-item-end">›</span></button></div>`, "settings");
  }

  function settingsDetailSheet(key) {
    const details = {
      master: ["雞場與雞舍管理", "正式版的新增、停用與指派需先通過管理者驗證；本測試版維持唯讀，不提供假寫入。"],
      line: ["LINE 群組", "正式版可管理群組與通知；此測試版沒有連線 LINE，因此只保留資訊架構入口。"],
      display: ["顯示與操作", "目前使用手機優先版面、方案 B 工作範圍與底部導覽；此測試版不保存個人偏好。"],
    };
    const [title, copy] = details[key] || details.display;
    return sheetShell(title, "測試版設定說明", `<div class="detail-block"><h3>目前狀態</h3><p>${copy}</p></div><div class="readonly-note">沒有可安全模擬的正式資料時，不建立假的設定結果。</div>`, "settings-detail");
  }

  function financeFarmSheet(farmId) {
    const farm = farmById(farmId);
    return sheetShell(`${farm.name} · 財務`, "場級財務詳細", `<div class="detail-list"><div class="detail-block"><h3>毛利</h3><p>${money(farm.finance.gross)}</p></div><div class="detail-block"><h3>已配置</h3><p>${money(farm.finance.allocated)}</p></div><div class="detail-block"><h3>費用</h3><p>${money(farm.finance.expense)}</p></div><div class="detail-block"><h3>目前淨額</h3><p>${money(farm.finance.net)}</p></div><div class="detail-block"><h3>投資人／股權</h3><div class="sheet-item-list">${farm.finance.investors.map(([name, share, amount]) => `<button type="button" class="sheet-item" data-action="open-distribution-detail" data-farm-id="${farm.id}" data-investor-name="${escapeHtml(name)}"><span><strong>${name}</strong><span>股權 ${share}%</span></span><span class="sheet-item-end">${money(amount)} ›</span></button>`).join("")}</div></div><div class="detail-block"><h3>費用分類</h3><button type="button" class="sheet-primary" data-action="open-expense-detail" data-farm-id="${farm.id}">查看費用分類</button></div></div>`, "finance-farm");
  }

  function investorDetailSheet(name) {
    const scope = financeScope();
    const investor = investorSummary(scope.farms).find((row) => row.name === name);
    if (!investor) return sheetShell("投資人詳細", "找不到資料", `<div class="empty-tab"><strong>目前範圍沒有這位投資人</strong></div>`, "investor-detail");
    return sheetShell(investor.name, `配置金額 ${money(investor.amount)}`, `<div class="sheet-item-list">${investor.farms.map((row) => `<div class="sheet-item static"><span><strong>${row.farm}</strong><span>股權 ${row.share}%</span></span><span class="sheet-item-end">${money(row.amount)}</span></div>`).join("")}</div>`, "investor-detail");
  }

  function expenseDetailSheet(farmId) {
    const farm = farmById(farmId);
    return sheetShell(`${farm.name} · 費用`, `合計 ${money(farm.finance.expense)}`, `<div class="sheet-item-list">${farm.finance.expenses.map(([name, value]) => `<div class="sheet-item static"><span><strong>${name}</strong><span>測試用分類</span></span><span class="sheet-item-end">${money(value)}</span></div>`).join("")}</div>`, "expense-detail");
  }

  function distributionDetailSheet(farmId, investorName) {
    const farm = farmById(farmId);
    const row = farm.finance.investors.find(([name]) => name === investorName);
    if (!row) return sheetShell("分配詳細", farm.name, `<div class="empty-tab"><strong>找不到這筆分配</strong></div>`, "distribution-detail");
    const [name, share, amount] = row;
    return sheetShell(`${name} · ${farm.name}`, "分配詳細", `<div class="detail-hero"><small>配置金額</small><strong>${money(amount)}</strong><span>股權 ${share}%</span></div><div class="detail-block"><h3>所屬雞場</h3><p>${farm.name}</p></div>`, "distribution-detail");
  }

  function financeMetricSheet(metric) {
    const scope = financeScope();
    const map = {
      gross: ["毛利", scope.gross, "各場毛利加總"],
      allocated: ["已配置", scope.allocated, "目前範圍內投資人配置金額加總"],
      expense: ["費用", scope.expense, "各場費用加總"],
      net: ["目前淨額", scope.net, `已配置 ${money(scope.allocated)} 扣除費用 ${money(scope.expense)}；沿用既有測試財務定義`],
    };
    const [title, value, copy] = map[metric] || map.net;
    return sheetShell(title, contextLabel(), `<div class="detail-hero"><small>${title}</small><strong>${money(value)}</strong><span>${copy}</span></div><div class="sheet-item-list">${scope.farms.map((farm) => `<button type="button" class="sheet-item" data-action="open-finance-farm" data-farm-id="${farm.id}"><span><strong>${farm.name}</strong><span>${title} ${money(farm.finance[metric])}</span></span><span class="sheet-item-end">›</span></button>`).join("")}</div>`, "finance-metric");
  }

  function analysisDetailSheet(key) {
    const scope = financeScope();
    const allocationRate = scope.gross ? (scope.allocated / scope.gross) * 100 : 0;
    const expenseRate = scope.gross ? (scope.expense / scope.gross) * 100 : 0;
    const netMargin = scope.gross ? (scope.net / scope.gross) * 100 : 0;
    const bestFarm = [...scope.farms].sort((a, b) => b.finance.net - a.finance.net)[0];
    const topInvestor = investorSummary(scope.farms)[0];
    const detail = {
      allocation: ["配置率", `${allocationRate.toFixed(1)}%`, `${money(scope.allocated)} ÷ ${money(scope.gross)}`],
      expense: ["費用率", `${expenseRate.toFixed(2)}%`, `${money(scope.expense)} ÷ ${money(scope.gross)}`],
      net: ["淨額／毛利", `${netMargin.toFixed(1)}%`, `${money(scope.net)} ÷ ${money(scope.gross)}`],
      "best-farm": ["最高淨額場次", bestFarm?.name || "—", bestFarm ? `目前淨額 ${money(bestFarm.finance.net)}` : "沒有資料"],
      "top-investor": ["最高配置投資人", topInvestor?.name || "—", topInvestor ? `配置金額 ${money(topInvestor.amount)}` : "沒有資料"],
    };
    const [title, value, copy] = detail[key] || detail.net;
    return sheetShell(title, "由目前測試財務資料直接計算", `<div class="detail-hero"><small>${title}</small><strong>${value}</strong><span>${copy}</span></div><div class="readonly-note">不引入外部產業平均、IRR、ROI 或未授權指標。</div>`, "analysis-detail");
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
    if (state.sheet.kind === "quick-actions") return quickActionsSheet();
    if (state.sheet.kind === "quick-record") return quickRecordSheet();
    if (state.sheet.kind === "quick-record-preview") return quickRecordPreviewSheet();
    if (state.sheet.kind === "insights") return insightsSheet();
    if (state.sheet.kind === "system") return systemSheet();
    if (state.sheet.kind === "audit") return auditSheet();
    if (state.sheet.kind === "settings") return settingsSheet();
    if (state.sheet.kind === "insight-detail") return insightDetailSheet(state.sheet.key);
    if (state.sheet.kind === "system-detail") return systemDetailSheet(state.sheet.key);
    if (state.sheet.kind === "settings-detail") return settingsDetailSheet(state.sheet.key);
    if (state.sheet.kind === "finance-farm") return financeFarmSheet(state.sheet.farmId);
    if (state.sheet.kind === "investor-detail") return investorDetailSheet(state.sheet.name);
    if (state.sheet.kind === "expense-detail") return expenseDetailSheet(state.sheet.farmId);
    if (state.sheet.kind === "distribution-detail") return distributionDetailSheet(state.sheet.farmId, state.sheet.name);
    if (state.sheet.kind === "finance-metric") return financeMetricSheet(state.sheet.metric);
    if (state.sheet.kind === "analysis-detail") return analysisDetailSheet(state.sheet.key);
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

  function captureFocusMeta(element) {
    if (!element || element === document.body || element === document.documentElement) return null;
    if (element.dataset?.testid) return { testid: element.dataset.testid };
    if (element.dataset?.nav) return { nav: element.dataset.nav };
    if (element.dataset?.action) {
      const keys = ["sheetKind","farmId","houseId","flockId","eventId","pendingId","abnormalId","financeTab","financeMetric","analysisKey","insightKey","systemKey","settingsKey"];
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
    app.innerHTML = `<div class="app-shell"><header class="topbar"><div class="brand-lockup"><span class="brand-symbol">🐔</span><span class="brand-copy"><strong>金雞工作台</strong><span>營運管理</span></span></div><span class="topbar-status">測試版</span></header><main class="page-shell">${pageMarkup()}</main><button type="button" class="fab" data-action="open-sheet" data-sheet-kind="quick-actions" aria-label="開啟快速行動">${icon("plus")}<span>快速行動</span></button>${navMarkup()}${renderSheet()}</div>`;
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
    if (action === "open-context-for-quick-record") return openContextPicker("quick-record");
    if (action === "close-sheet") return closeSheet();
    if (action === "open-sheet") return openSheet({ kind: actionElement.dataset.sheetKind });
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
    if (action === "go-farms") { state.page = "farms"; return render(); }
    if (action === "go-todo") { state.page = "todo"; return render(); }
    if (action === "go-records") { state.page = "records"; state.sheet = null; return render(); }
    if (action === "go-finance") { state.page = "finance"; state.financeTab = "overview"; state.sheet = null; return render(); }
    if (action === "go-ai") { state.page = "ai"; state.sheet = null; return render(); }
    if (action === "finance-tab") { state.financeTab = actionElement.dataset.financeTab; return render(); }
    if (action === "open-flock") return openSheet({ kind: "flock", id: actionElement.dataset.flockId });
    if (action === "open-pending-item") return openSheet({ kind: "pending-item", id: actionElement.dataset.pendingId });
    if (action === "open-abnormal") return openSheet({ kind: "abnormal-item", id: actionElement.dataset.abnormalId });
    if (action === "open-event") return openSheet({ kind: "event-item", id: actionElement.dataset.eventId });
    if (action === "open-farm-detail") return openSheet({ kind: "farm-detail", farmId: actionElement.dataset.farmId });
    if (action === "open-house-detail") return openSheet({ kind: "house-detail", farmId: actionElement.dataset.farmId, houseId: actionElement.dataset.houseId });
    if (action === "open-finance-farm") return openSheet({ kind: "finance-farm", farmId: actionElement.dataset.farmId });
    if (action === "open-investor-detail") return openSheet({ kind: "investor-detail", name: actionElement.dataset.investorName });
    if (action === "open-expense-detail") return openSheet({ kind: "expense-detail", farmId: actionElement.dataset.farmId });
    if (action === "open-distribution-detail") return openSheet({ kind: "distribution-detail", farmId: actionElement.dataset.farmId, name: actionElement.dataset.investorName });
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
    if (action === "open-quick-record") return openSheet({ kind: "quick-record" });
    if (action === "preview-quick-record") {
      state.quickRecordDraft = document.getElementById("quick-record-input")?.value.trim() || "";
      return openSheet({ kind: "quick-record-preview" });
    }
    if (action === "jump-context") {
      state.context = { farmId: actionElement.dataset.farmId, houseId: actionElement.dataset.houseId || null, flockId: actionElement.dataset.flockId || null };
      state.page = "today";
      return closeSheet();
    }
  }


  let handleStartY = null;
  document.addEventListener("click", handleClick);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.sheet) { event.preventDefault(); closeSheet(); return; }
    trapSheetFocus(event);
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
