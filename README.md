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

- all-farm current stock: `31,412`
- all-farm today mortality: `6`
- mortality detail: 稽核紅羽一場 / 紅羽一舍 = `5`; 稽核烏骨三場 / 烏骨一舍 = `1`
- all-farm today cull: `1`
- active flocks: `6`
- gross: `204,000`
- allocated: `120,000`
- expense: `5,000`
- current net: `115,000`
- farm net: `31,800`, `40,500`, `26,700`, `-600`, `16,600`

The net-value line chart is labelled **synthetic review only**. Its final point is the current all-farm prototype net baseline (`115,000`); it must not be read as Production history.

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
