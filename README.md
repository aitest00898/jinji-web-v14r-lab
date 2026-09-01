# Jinji Web V14R Lab

Purpose:
UX / interaction prototype for the Jinji farm management Web redesign.

Not Production.

Contains synthetic review data only.

No Production backend connection.

This repository is an isolated, vanilla HTML/CSS/JavaScript interaction spike. It has no API client, no server-side runtime, no database dependency, no account integration, and no external runtime requests.

## Main things being evaluated

- modern mobile UX
- Context Identity + picker
- Smart Digest
- action-first Today dashboard
- Bottom Sheet drill-down
- Finance net-value visualization

## Prototype data boundary

Prototype data is synthetic and does not represent real farm financial or operating values.

The fixed review baseline in this spike is:

- all-scope current raised count (`目前在養`): `31,412`
- all-scope today mortality: `6`
- mortality detail: 稽核紅羽一場 / 紅羽一舍 = `5`; 稽核烏骨三場 / 烏骨一舍 = `1`
- all-scope today cull: `1`
- active flocks: `6`
- gross: `204,000`
- allocated: `120,000`
- expense: `5,000`
- current net: `115,000`
- farm net: `31,800`, `40,500`, `26,700`, `-600`, `16,600`

The net-value line chart is labelled **synthetic review only**. Its final point is the current all-scope prototype net baseline (`115,000`); it must not be read as Production history.

## Local preview

No build step is required. From this directory, run:

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/` in a browser. The site is designed for iPhone Safari / Chrome and desktop Safari / Chrome at the `390x844`, `393x852`, and `430x932` viewport widths.

## GitHub Pages target

The intended isolated repository is `aitest00898/jinji-web-v14r-lab`.

The expected public Pages URL is `https://aitest00898.github.io/jinji-web-v14r-lab/`.

Pages should publish the `main` branch root. This lab is not connected to any Production Worker, D1, LINE, Queue, Cron, AI service, secret, or existing Production Pages site.

## Data-parity contract

The browser spike keeps the V11/V13 synthetic review baseline intact:

- farms: `5`
- houses: `9`
- total flocks: `7`
- active flocks: `6`
- closed historical flock: `AUDIT-HISTORY-OLD`
- farm raised count (`在養隻數`): red `12,132`; black `5,420`; silkie `5,940`; new `7,920`; history `0`
- all-scope raised count (`目前在養`): `31,412`
- all-scope today mortality: `6` (`red 5 + silkie 1`)
- all-scope today cull: `1`
- pending review items: `4`, with their original review meanings preserved
- abnormal records: `4` (`3` active follow-up + `1` resolved historical record)
- finance: gross `204,000`; allocated `120,000`; expense `5,000`; net `115,000`

Context filtering is expected to follow the selected farm / house / flock for Today, Farms, Records, Todo, AI context and drill-downs. Finance uses farm as its minimum scope, so a house/flock selection inherits its farm's finance data.


## V14R-B+ UX contract

The B+ product-layer repair preserves the tested data engine while restoring the previously selected mobile interaction model:

- farm selection stays at the top level
- house selection uses always-visible one-tap chips after a farm is selected
- flock chips appear only when a house has batch choices
- Bottom Sheets are used for detail inspection, not for forcing a 3-step context wizard
- the global FAB opens Quick Record and AI actions rather than duplicating Todo
- farm, house, flock and operating records provide meaningful detail drill-down
- opening a mortality/cull detail never silently changes the global context; context changes require an explicit action
- More restores Insights, Finance, AI assistant, System, Audit history and Settings
- end-user copy is Traditional Chinese and avoids engineering terms where possible

This remains synthetic, isolated, and non-writing.


## V14R full-repair acceptance contract

The complete repair builds on B+ without changing the synthetic operating or finance baseline. It additionally requires:

- Quick Record user input is HTML-escaped before `innerHTML` rendering
- starting Quick Record from the all-scope read-only scope returns directly to Quick Record after farm selection
- iPhone/browser product title is Traditional Chinese (`金雞工作台`)
- finance KPIs, farms, investors, expenses, distributions and calculated analysis rows have meaningful detail drill-down
- Insights can drill into current raised counts/flocks (`目前在養`), mortality, cull, abnormalities, feed and water records
- System raised-count views (`在養隻數`) can drill into farm, house and flock lists
- Settings entries have explicit read-only detail instead of dead controls
- Audit remains empty when there is no real write activity; the prototype must not invent audit history

Build marker: `jinji-web-v14r-lab-full-repair-r1`.
