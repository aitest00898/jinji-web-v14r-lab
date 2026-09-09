# Canonical API local integration

The Lab keeps its existing fixture-backed local behavior unless a canonical
API base is explicitly configured. Guided Record, Quick Record, pending
approval, correction, reversal, and record reads then use the same API
boundary as LINE:

```text
RecordCommand -> Worker API -> canonical business boundary
```

## Opt-in configuration

Use one of the following local-only configuration sources:

- `?api-base=https://<authorized-worker-host>`
- `window.__JINJI_API_BASE__`
- `<meta name="jinji-api-base" content="...">`

The default environment is `production`. Test mode requires both
`api-environment=test` and an explicit `api-test-admin=1` marker (or the
equivalent test-admin option). Unknown environments fail closed.

The client sends `credentials: "include"` so the existing session/CORS
boundary remains authoritative. It does not create browser bearer tokens or
access D1 directly. Every write body is `{ command: RecordCommand }`, and
correction/reversal use the append-only endpoints:

- `POST /api/records`
- `POST /api/records/:id/correct`
- `POST /api/records/:id/reverse`
- `GET /api/records`

Without an explicit API base, the Lab does not send a request and continues
to use synthetic local data. This document does not authorize a deployment,
remote write, or Pages release.
