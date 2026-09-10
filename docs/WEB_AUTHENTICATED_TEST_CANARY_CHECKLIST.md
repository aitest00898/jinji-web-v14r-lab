# Web authenticated Test-scope canary checklist

Scope: Web release candidate only. This is a human-operated checklist; keep
PASS/FAIL and Notes blank until the human enters the password in the Web login
UI. Do not paste the password, Bearer token, cookie, or screenshots containing
secrets into Codex.

## Human-only entry boundary

| Item | Required confirmation | PASS/FAIL | Notes |
|---|---|---|---|
| Login | Open the approved Pages URL and enter the management password only in the Web login form. Confirm the UI shows `已登入 · Production scope`; no credential is put in URL, localStorage, IndexedDB, or a chat message. |  |  |
| Test mode | After login, explicitly select `Test（明確選取）` in the scope control. Confirm the UI label changes to `Test scope`; do not activate Test by editing the URL. |  |  |
| Test scope | Visually confirm the authorized test farm / house / flock shown by the approved run sheet: `金雞測試場 / 測試1舍 / TEST-BATCH-001`. |  |  |
| Pre-stock | Read the pre-canary stock and Finance tuple from the approved read-only run sheet before the first write. Do not proceed if the scope is not the intended Test scope. |  |  |

## Authenticated canonical records

Use only the approved Test farm/house/flock and the exact valid fields from the
run sheet. Each confirmation must show the canonical review before submit.

| ID | Human action | Expected result | PASS/FAIL | Notes |
|---|---|---|---|---|
| C-01 | Guided Record: submit representative O4 磅重. | One accepted `RecordCommand`; destination is `recording_events`; derived age/weight fields are visible in the review/read-back; no local fallback. |  |  |
| C-02 | Guided Record: submit representative O2 用藥／補充品. | One accepted `RecordCommand`; destination is `operational_actions`; house-only scope remains explicit and no flock is guessed. |  |  |
| C-03 | Guided Record: submit representative A8 臭腳 observation. | One accepted `RecordCommand`; destination is `abnormal_events`; extent/detail are preserved and no quantity is invented. |  |  |
| C-04 | Guided Record: submit representative O3 出雞. | One accepted `RecordCommand`; destination is `operational_events`; shipment remains the singular shipment authority. |  |  |
| C-05 | Records read-back | Each accepted row is returned by `GET /api/records` with the intended Test environment, taxonomy, destination, scope and provenance. |  |  |
| C-06 | Idempotency replay | Replay one identical `clientOperationId`; response identifies the existing fact and creates no second authoritative fact. |  |  |
| C-07 | Reversal | Reverse the approved O3 test fact through the Web correction/reversal control. | Original row remains; one append-only reversal row exists; shipment stock effect is applied exactly once and then restored. |  |  |
| C-08 | Post-stock | Read back stock after O3 and reversal. | Stock arithmetic is exact; no double count; O4/O2/A8 do not create an unintended stock change; A8 has stock effect 0. |  |  |
| C-09 | Finance unchanged | Re-read the pre-canary Finance tuple after all Test-scope actions. | Finance totals, distributions, allocations and expense rows are unchanged. |  |  |

## Isolation and logout

| Item | Required confirmation | PASS/FAIL | Notes |
|---|---|---|---|
| Production default | Reload the approved Pages URL in a fresh tab. | Login screen appears; default scope is Production; no Test request is sent before explicit authenticated selection. |  |  |
| Production isolation | Confirm all canary URLs carry `environment=test`, and no Production business fact is created. | Test scope is explicit and isolated; no Production write, schema write, Queue write, LINE send or AI call is part of this canary. |  |  |
| Logout | Click `登出`. | Session is revoked; UI returns to login; a later API request cannot reuse the old token. |  |  |
| Credential boundary | Inspect only the UI behavior, not secret values. | Password/token/cookie is never reported to Codex, stored in the repository, or embedded in a URL/build artifact. |  |  |

## Stop conditions

Stop immediately and record FAIL without retrying writes if any of these occurs:

- the login screen is bypassed, the scope label is missing, or Test is active without explicit selection;
- the farm, house, or flock does not match the approved run sheet;
- an API error causes a local fixture write or a success message;
- a destination, read-back row, client operation ID, stock value, or Finance tuple is unexpected;
- any Production, Queue, Cron, LINE, AI, schema, or migration side effect is observed.

No result is accepted from this checklist until the human confirms the exact
scope and enters PASS/FAIL in the table.
