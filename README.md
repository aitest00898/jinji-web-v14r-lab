# Jinji Web V14R Lab

金雞管理中心 V7 的 Pre-Production Lab。這是與 Production 完全隔離的 Vanilla HTML/CSS/JavaScript 測試 repository；不連線 Production Worker、D1、Queue、Cron、LINE、Workers AI、Production Pages 或任何 secret。

## Lab 邊界

- V7 reference 是 UI source of truth：`data-app-id="jinji-web-v14r-lab"`、`data-build-marker="jinji-v14r-plus-r4-desktop-v7-mobile-nav"`。
- baseline fixture 保留 5 個雞場、9 個雞舍、7 個批次、6 個進行中批次、`AUDIT-HISTORY-OLD`，以及原有在養、事件、待人工確認、異常與財務數字。
- `OperationalEvent` 是 Today、紀錄、月曆、圖表、趨勢與 Audit 的共同來源；V7 的 linked test events 皆可追溯到雞場／雞舍／批次。
- Quick Record 是真正的 Lab Write，只寫本機 overlay／IndexedDB；fixture 不會被 destructive mutate，Developer → AI／Cloudflare 降級方案可 Reset fixture。
- 可在 Developer 區切換 `ONLINE`、`AI_DOWN`、`BACKEND_TEMP_DOWN`、`BACKEND_LONG_DOWN`，觀察 AI unavailable、local outbox、冪等 mock sync 與 Pending Review conflict flow。

## Local preview

```bash
python3 -m http.server 4177
```

開啟 `http://127.0.0.1:4177/index.html`。本機 root 的 build identity 會顯示 `LOCAL_UNBUILT`；GitHub Pages workflow 會以 Lab `main` SHA 建立正式 artifact。

## Test commands

```bash
npm ci
npm run test:unit
npm run test:integration
npm run test:e2e:chromium
npm run test:e2e:webkit
npm run test:visual
npm run test:security
npm run test:all
```

`test:visual` 在 `/Users/joe/Downloads/jinji-management-center-v7.html` 存在時，會啟動獨立 reference server 並執行 390×844、1440×900 的 pixel diff；在 CI 沒有外部 reference 檔案時，會明確輸出 structural-only，不冒充 pixel comparison。

## Repository and Pages

- Repository：`aitest00898/jinji-web-v14r-lab`
- Feature branch：`feat/management-center-preprod-v7`
- Public Lab Pages：<https://aitest00898.github.io/jinji-web-v14r-lab/>
- Pages build 會產生 `build-info.json`，並將 Build SHA、marker、time、branch 顯示在 Developer Diagnostics。

本 Lab 完成自動驗收後仍需真人以 iPhone／iPad／Desktop 驗收；它不代表 Production 已接受或已部署。
