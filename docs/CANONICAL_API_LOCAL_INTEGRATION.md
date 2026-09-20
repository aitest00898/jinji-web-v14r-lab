# Canonical API and authenticated local integration

The Lab has one default runtime: fixture-backed `PREPROD LAB`. Both
`localhost`/`127.0.0.1` and the Lab Pages host
`https://aitest00898.github.io/jinji-web-v14r-lab/` stay local and do not bind
to a Production Worker. Unknown hosted origins fail closed; they do not load
fixture data or guess an API base.

Guided Record, Quick Record, pending approval, correction, reversal, and
canonical writes use the same API boundary as LINE:

```text
RecordCommand -> Worker API -> canonical business boundary
```

## Local and test configuration

For a localhost-only contract harness, an API base may be injected through:

- `?api-base=https://<test-harness-host>`
- `window.__JINJI_API_BASE__`
- `<meta name="jinji-api-base" content="...">`

The default Lab Pages runtime has no API base and no authenticated API mode.
The local contract harness may inject an explicit base; Browser Test mode is
not enabled by URL flags: after Web login, the operator must explicitly select
`Test` in the scope control. Contract tests may inject `testAdmin: true` as a
test-only option. The Lab Pages host ignores API-base query/meta/global
configuration, so a copied Production URL cannot turn the Lab into a
Production client.

The Worker already exposes browser-safe login/session routes. The client sends
the password only to `POST /api/web/auth/login`, retains the returned short-
lived Bearer token in memory for the current page, and clears it on logout or
HTTP 401. It does not persist a token in localStorage, IndexedDB, cookies, or
URLs. Requests use `credentials: "omit"` plus the runtime Authorization header;
the Worker CORS allowlist remains authoritative. Safari does not depend on
cross-site cookie behavior.

Every write body is `{ command: RecordCommand }`, and correction/reversal use
the append-only endpoints:

- `POST /api/records`
- `POST /api/records/:id/correct`
- `POST /api/records/:id/reverse`
- `GET /api/records`

When a local contract harness is explicitly enabled, an API failure never
falls back to a local write. The visible Lab/Finance fixture surfaces remain
explicitly labelled synthetic; they are not presented as a Production
read-back. This document does not authorize a deployment, remote write, human
canary, or Pages release.
