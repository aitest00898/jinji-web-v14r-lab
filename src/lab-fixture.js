(function attachJinjiLabFixture(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.JinjiLabFixture = api;
})(typeof window === "object" ? window : (typeof globalThis === "object" ? globalThis : null), () => {
  "use strict";

  /* Operational V7 baseline. Finance is supplied by the independent synthetic fixture. */
  return {"farms":[{"id":"all","name":"全部在養","subtitle":"全域總覽","readOnly":true,"stock":31412,"mortality":6,"cull":1,"houses":[]},{"id":"red","name":"稽核紅羽一場","subtitle":"紅羽場區","breed":"紅羽","risk":"死亡偏高＋高溫","stock":12132,"mortality":5,"cull":1,"caretakers":["模擬飼養者甲","模擬飼養者乙"],"houses":[{"id":"red-1","name":"紅羽一舍","code":"H1","flocks":[{"id":"alpha","code":"AUDIT-RED-ALPHA","status":"7 日內準備出雞","state":"active","initial":7000,"stock":6812,"chickIn":"2026-07-20","ship":"2026-09-06","upcoming":true}]},{"id":"red-2","name":"紅羽二舍","code":"H2","flocks":[{"id":"beta","code":"AUDIT-RED-BETA","status":"進行中","state":"active","initial":5500,"stock":5320,"chickIn":"2026-08-01","ship":"2026-09-25","upcoming":false}]}]},{"id":"black","name":"稽核黑羽二場","subtitle":"黑羽場區","breed":"黑羽","risk":"穩定","stock":5420,"mortality":0,"cull":0,"caretakers":["模擬飼養者丙"],"houses":[{"id":"black-1","name":"黑羽一舍","code":"H1","flocks":[{"id":"black-a","code":"AUDIT-BLACK-001","status":"進行中","state":"active","initial":5600,"stock":5420,"chickIn":"2026-07-28","ship":"2026-09-18","upcoming":false}]},{"id":"black-2","name":"黑羽二舍","code":"H2","flocks":[]}]},{"id":"silkie","name":"稽核烏骨三場","subtitle":"烏骨場區","breed":"烏骨","risk":"飲水異常追蹤","stock":5940,"mortality":1,"cull":0,"caretakers":["模擬飼養者丁","模擬飼養者乙"],"houses":[{"id":"silkie-1","name":"烏骨一舍","code":"H1","flocks":[{"id":"silkie-a","code":"AUDIT-SILKIE-A","status":"進行中","state":"active","initial":3300,"stock":3160,"chickIn":"2026-07-15","ship":"2026-09-10","upcoming":false}]},{"id":"silkie-2","name":"烏骨二舍","code":"H2","flocks":[{"id":"silkie-b","code":"AUDIT-SILKIE-B","status":"進行中","state":"active","initial":2900,"stock":2780,"chickIn":"2026-07-24","ship":"2026-09-17","upcoming":false}]}]},{"id":"new","name":"稽核新批四場","subtitle":"新批場區","breed":"紅羽新批","risk":"新批觀察","stock":7920,"mortality":0,"cull":0,"caretakers":["模擬飼養者戊"],"houses":[{"id":"new-1","name":"新批一舍","code":"H1","flocks":[{"id":"new-a","code":"AUDIT-NEW-001","status":"進行中","state":"active","initial":8000,"stock":7920,"chickIn":"2026-08-25","ship":"2026-11-20","upcoming":false}]}]},{"id":"history","name":"稽核歷史五場","subtitle":"歷史 review 區","breed":"歷史批","risk":"已出雞／僅供歷史查詢","stock":0,"mortality":0,"cull":0,"caretakers":["模擬飼養者己"],"houses":[{"id":"history-1","name":"歷史一舍","code":"H1","flocks":[{"id":"history-old","code":"AUDIT-HISTORY-OLD","status":"已出雞","state":"closed","initial":5000,"stock":0,"chickIn":"2026-05-01","ship":"2026-07-31","upcoming":false}]},{"id":"history-2","name":"歷史二舍","code":"H2","flocks":[]}]}],"pending":[{"id":"pending-1","title":"死亡 3？來源不完整","detail":"需要確認雞舍後才能成為正式紀錄。","kind":"死亡紀錄","farmId":"red","houseId":null,"flockId":null},{"id":"pending-2","title":"確認 7 日內出雞準備","detail":"AUDIT-RED-ALPHA 預計 09/06 出雞。","kind":"出雞準備","farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"pending-3","title":"飼料數量可能缺單位","detail":"來源文字「飼料 6」，需人工確認。","kind":"飼料紀錄","farmId":"black","houseId":"black-1","flockId":"black-a"},{"id":"pending-4","title":"飲水異常需要追蹤","detail":"烏骨一舍飲水量偏低。","kind":"異常追蹤","farmId":"silkie","houseId":"silkie-1","flockId":"silkie-a"}],"abnormalities":[{"id":"abnormal-1","title":"活動力下降","category":"健康","state":"追蹤中","status":"active","date":"2026-08-30","time":"15:20","temp":34,"farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"abnormal-2","title":"飲水量偏低","category":"飲水","state":"追蹤中","status":"active","date":"2026-08-31","time":"07:10","temp":31,"farmId":"silkie","houseId":"silkie-1","flockId":"silkie-a"},{"id":"abnormal-3","title":"水線壓力不穩","category":"設備","state":"追蹤中","status":"active","date":"2026-08-29","time":"14:40","temp":32.2,"farmId":"silkie","houseId":"silkie-2","flockId":"silkie-b"},{"id":"abnormal-4","title":"歷史高溫紀錄","category":"環境","state":"已結案","status":"resolved","date":"2026-07-20","time":"14:00","temp":35.1,"farmId":"history","houseId":"history-1","flockId":"history-old"}],"events":[{"id":"e-r1","date":"2026-08-31","time":"08:10","type":"mortality","qty":5,"unit":"隻","farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"e-r2","date":"2026-08-31","time":"07:50","type":"cull","qty":1,"unit":"隻","farmId":"red","houseId":"red-1","flockId":"alpha"},{"id":"e-r3","date":"2026-08-29","time":"09:05","type":"feed","qty":240,"unit":"kg","farmId":"red","houseId":null,"flockId":null},{"id":"e-b1","date":"2026-08-30","time":"10:10","type":"feed","qty":210,"unit":"kg","farmId":"black","houseId":"black-1","flockId":"black-a"},{"id":"e-b2","date":"2026-08-28","time":"07:40","type":"mortality","qty":1,"unit":"隻","farmId":"black","houseId":"black-1","flockId":"black-a"},{"id":"e-s1","date":"2026-08-31","time":"06:50","type":"mortality","qty":1,"unit":"隻","farmId":"silkie","houseId":"silkie-1","flockId":"silkie-a"},{"id":"e-s2","date":"2026-08-30","time":"08:30","type":"water","qty":1850,"unit":"L","farmId":"silkie","houseId":"silkie-1","flockId":"silkie-a"},{"id":"e-n1","date":"2026-08-30","time":"09:00","type":"feed","qty":120,"unit":"kg","farmId":"new","houseId":"new-1","flockId":"new-a"},{"id":"e-h1","date":"2026-07-31","time":"06:00","type":"shipment","qty":4705,"unit":"隻","farmId":"history","houseId":"history-1","flockId":"history-old"}]};
});

(function extendSyntheticOperationalFixture(root) {
  "use strict";

  const fixture = root && root.JinjiLabFixture;
  if (!fixture) return;

  /* Horizontal synthetic completion: every finance farm has an operational counterpart. */
  fixture.metadata = {
    classification: "synthetic",
    datasetId: "SYNTHETIC_OPERATIONAL_V1",
    schemaVersion: 1,
  };

  fixture.farms.push(
    {
      id: "f",
      name: "模擬營運場 F",
      subtitle: "青羽場區",
      breed: "青羽",
      risk: "飼飲穩定觀察",
      stock: 7728,
      mortality: 0,
      cull: 0,
      caretakers: ["模擬飼養者庚"],
      houses: [
        {
          id: "f-1",
          name: "青羽一舍",
          code: "H1",
          flocks: [{ id: "f-a", code: "SYN-F-001", status: "進行中", state: "active", initial: 4100, stock: 4018, chickIn: "2026-07-29", ship: "2026-09-12", upcoming: false }],
        },
        {
          id: "f-2",
          name: "青羽二舍",
          code: "H2",
          flocks: [{ id: "f-b", code: "SYN-F-002", status: "進行中", state: "active", initial: 3800, stock: 3710, chickIn: "2026-08-05", ship: "2026-09-28", upcoming: false }],
        },
      ],
    },
    {
      id: "g",
      name: "模擬營運場 G",
      subtitle: "白羽場區",
      breed: "白羽",
      risk: "近期出雞準備",
      stock: 9606,
      mortality: 0,
      cull: 0,
      caretakers: ["模擬飼養者辛", "模擬飼養者壬"],
      houses: [
        {
          id: "g-1",
          name: "白羽一舍",
          code: "H1",
          flocks: [{ id: "g-a", code: "SYN-G-001", status: "7 日內準備出雞", state: "active", initial: 5200, stock: 5088, chickIn: "2026-07-18", ship: "2026-09-06", upcoming: true }],
        },
        {
          id: "g-2",
          name: "白羽二舍",
          code: "H2",
          flocks: [{ id: "g-b", code: "SYN-G-002", status: "進行中", state: "active", initial: 4600, stock: 4518, chickIn: "2026-07-26", ship: "2026-09-19", upcoming: false }],
        },
      ],
    },
    {
      id: "h",
      name: "模擬營運場 H",
      subtitle: "金羽場區",
      breed: "金羽",
      risk: "設備巡檢追蹤",
      stock: 6548,
      mortality: 0,
      cull: 0,
      caretakers: ["模擬飼養者癸"],
      houses: [
        {
          id: "h-1",
          name: "金羽一舍",
          code: "H1",
          flocks: [{ id: "h-a", code: "SYN-H-001", status: "進行中", state: "active", initial: 3600, stock: 3510, chickIn: "2026-08-02", ship: "2026-09-15", upcoming: false }],
        },
        {
          id: "h-2",
          name: "金羽二舍",
          code: "H2",
          flocks: [{ id: "h-b", code: "SYN-H-002", status: "進行中", state: "active", initial: 3100, stock: 3038, chickIn: "2026-08-09", ship: "2026-09-26", upcoming: false }],
        },
      ],
    },
  );
  fixture.farms.find((farm) => farm.id === "all").stock = fixture.farms
    .filter((farm) => farm.id !== "all")
    .flatMap((farm) => farm.houses)
    .flatMap((house) => house.flocks)
    .filter((flock) => flock.state === "active")
    .reduce((total, flock) => total + flock.stock, 0);

  fixture.pending.push(
    { id: "pending-f1", title: "確認模擬場 F 飲水快照來源", detail: "青羽二舍飲水紀錄需要確認量測來源。", kind: "飲水紀錄", farmId: "f", houseId: "f-2", flockId: "f-b" },
    { id: "pending-g1", title: "確認模擬場 G 出雞準備", detail: "SYN-G-001 預計 09/06 出雞，等待場務確認。", kind: "出雞準備", farmId: "g", houseId: "g-1", flockId: "g-a" },
    { id: "pending-h1", title: "確認模擬場 H 設備巡檢", detail: "金羽二舍設備紀錄需要補上巡檢結果。", kind: "設備紀錄", farmId: "h", houseId: "h-2", flockId: "h-b" },
  );

  fixture.abnormalities.push(
    { id: "abnormal-f1", title: "青羽一舍溫度偏高", category: "環境", state: "追蹤中", status: "active", date: "2026-08-30", time: "14:20", temp: 33.5, farmId: "f", houseId: "f-1", flockId: "f-a" },
    { id: "abnormal-g1", title: "白羽二舍飲水波動", category: "飲水", state: "追蹤中", status: "active", date: "2026-08-29", time: "16:10", temp: 31.8, farmId: "g", houseId: "g-2", flockId: "g-b" },
    { id: "abnormal-h1", title: "金羽二舍設備巡檢待回報", category: "設備", state: "追蹤中", status: "active", date: "2026-08-30", time: "11:40", temp: 30.6, farmId: "h", houseId: "h-2", flockId: "h-b" },
  );

  fixture.events.push(
    { id: "e-f1", date: "2026-08-30", time: "07:25", type: "mortality", qty: 2, unit: "隻", farmId: "f", houseId: "f-1", flockId: "f-a" },
    { id: "e-f2", date: "2026-08-29", time: "09:15", type: "feed", qty: 164, unit: "kg", farmId: "f", houseId: "f-1", flockId: "f-a" },
    { id: "e-f3", date: "2026-08-30", time: "18:05", type: "water", qty: 1520, unit: "L", farmId: "f", houseId: "f-2", flockId: "f-b" },
    { id: "e-f4", date: "2026-08-28", time: "08:05", type: "cull", qty: 1, unit: "隻", farmId: "f", houseId: "f-2", flockId: "f-b" },
    { id: "e-g1", date: "2026-08-29", time: "07:35", type: "mortality", qty: 1, unit: "隻", farmId: "g", houseId: "g-1", flockId: "g-a" },
    { id: "e-g2", date: "2026-08-30", time: "09:05", type: "feed", qty: 188, unit: "kg", farmId: "g", houseId: "g-1", flockId: "g-a" },
    { id: "e-g3", date: "2026-08-29", time: "18:20", type: "water", qty: 1760, unit: "L", farmId: "g", houseId: "g-2", flockId: "g-b" },
    { id: "e-g4", date: "2026-08-28", time: "09:20", type: "feed", qty: 180, unit: "kg", farmId: "g", houseId: "g-2", flockId: "g-b" },
    { id: "e-h-a1", date: "2026-08-30", time: "07:45", type: "mortality", qty: 2, unit: "隻", farmId: "h", houseId: "h-1", flockId: "h-a" },
    { id: "e-h-a2", date: "2026-08-29", time: "09:40", type: "feed", qty: 142, unit: "kg", farmId: "h", houseId: "h-1", flockId: "h-a" },
    { id: "e-h-b1", date: "2026-08-30", time: "18:12", type: "water", qty: 1330, unit: "L", farmId: "h", houseId: "h-2", flockId: "h-b" },
    { id: "e-h-b2", date: "2026-08-29", time: "08:30", type: "cull", qty: 1, unit: "隻", farmId: "h", houseId: "h-2", flockId: "h-b" },
  );
})(typeof window === "object" ? window : (typeof globalThis === "object" ? globalThis : null));
