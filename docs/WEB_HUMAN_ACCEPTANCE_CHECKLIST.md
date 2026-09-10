# Web Human Acceptance Checklist

Scope: `feat/full-recording-taxonomy-foundation` / base source HEAD `68d966c`. This is a human acceptance sheet: leave PASS/FAIL and Notes blank until the device is actually operated. Existing automated evidence is not a human PASS.

## Entry and responsive baseline

| ID | Device | Action | Expected result | PASS/FAIL | Notes |
|---|---|---|---|---|---|
| H-01 | iPhone Safari 390×844 | Open the Lab and verify title, app identity and build marker; inspect the portal | PREPROD LAB/local-test notice is visible; content is usable with no horizontal overflow; no Production/LINE/AI/D1/Queue/Cron action is required |  |  |
| H-02 | iPad Safari 834×900 | Open portal in portrait and landscape; refresh | Three portal cards remain readable and clickable; no clipping or unnecessary horizontal scrolling |  |  |
| H-03 | Desktop Chromium 1440×900 | Open portal, then enter management center | Desktop sidebar/content layout is intact; Today, Records, Todo, Calendar, Farms and Finance are reachable |  |  |

## Recording portal and navigation

| ID | Device | Action | Expected result | PASS/FAIL | Notes |
|---|---|---|---|---|---|
| P-01 | iPhone | Tap 營運資料; inspect category list and select a category/subtype | O1–O9 are present; a valid subtype and guided context step follow |  |  |
| P-02 | iPhone | Return to portal; tap 異常登錄 | A1–A16 are present; observation extent is 小／中／大 and is not converted to bird count |  |  |
| P-03 | iPad | Tap 進入管理中心, then browser Back | Existing management view opens; Back returns to portal rather than leaving a stale portal choice |  |  |
| P-04 | Desktop | Use sidebar to visit Today, Records, Todo, Calendar, Farms and Finance, then return to portal | Each page has correct title/context and remains navigable |  |  |

## Guided flows: 營運資料 O1–O9

For each row start at 營運資料, choose the stated taxonomy/subtype and context, complete required fields, inspect review, and use the stated final action. Where Back is required, verify values remain. Where Cancel is required, verify no record is added.

| ID | Device | Action | Expected result | PASS/FAIL | Notes |
|---|---|---|---|---|---|
| O-01 | iPhone | O1 入雛 / `chick_in`; farm → house → flock; date, male, female, condition; review → Confirm | Review shows complete context and total; Records has O1 and Calendar has its date |  |  |
| O-02 | iPhone | O2 疫苗／用藥／補充品 / `medication`; house only, no flock; content; review → Cancel | Review explicitly says house and batch not specified; no auto-flock; Cancel adds nothing |  |  |
| O-03 | iPad | O3 出雞 / `shipment`; house + flock; quantity, sex, optional total weight; Confirm | Required values/context are shown; Records, stock and Calendar follow fixture semantics |  |  |
| O-04 | iPad | O4 磅重 / `weigh`; house + flock; average weight, sex, optional chick-in date; Back then review → Confirm | Back preserves editable values; review is correct; Records/Calendar show weighing |  |  |
| O-05 | Desktop | O5 叫飼料 / `feed_order`; house only, no flock; vendor, weight, unit; Cancel | House-only remains house-only; review preserves unit; no write after Cancel |  |  |
| O-06 | Desktop | O6 送驗 / `lab_test`; farm-only with explicit whole-farm confirmation; content + `waiting_result`; Confirm | Review says whole farm explicitly confirmed; local follow-up/reminder appears in Todo; no scheduler is needed |  |  |
| O-07 | iPhone | O7 清消 / `disinfection`; house + flock; workflow status; Back then Confirm | Back preserves state; review/confirm succeed; workflow result appears in Todo/Calendar as applicable |  |  |
| O-08 | iPad | O8 設備維護 / `maintenance`; house only, no flock; maintenance content; Cancel | No auto-flock; Cancel writes nothing and can return safely to portal |  |  |
| O-09 | iPhone | O9 死亡／淘汰 / `mortality`; house + flock; submit blank quantity, then valid positive integer; Confirm | Blank/non-positive/non-integer is blocked with quantity error; final review has O9/context; Records has one event and stock changes only by entered quantity |  |  |

## Guided flows: 異常登錄 A1–A16

For each row start at 異常登錄, select the stated subtype, provide date and extent, and inspect review. Unless A1 links a mortality record, the result must be a qualitative observation, never a numeric mortality event.

| ID | Device | Action | Expected result | PASS/FAIL | Notes |
|---|---|---|---|---|---|
| A-01 | iPhone | A1 死亡異常 / `mortality_abnormality`; house + flock; extent + optional linked mortality; Confirm | Observation is created with correct link/context; no numeric mortality is added |  |  |
| A-02 | iPhone | A2 咳嗽 / `cough`; house + flock; small extent; Cancel | Qualitative review is shown; Cancel adds no observation |  |  |
| A-03 | iPad | A3 喘／呼吸困難 / `respiratory_distress`; house + flock; medium; Confirm | Observation and context are visible in Records/abnormal tracking |  |  |
| A-04 | iPad | A4 精神不振／活動下降 / `activity_down`; house only; large; Back then Confirm | No auto-flock; Back preserves values; observation is created |  |  |
| A-05 | iPhone | A5 外觀 / `eye_swelling`; farm-only, explicitly confirm whole farm; medium; Confirm | Review says 整場（已明確確認）; qualitative observation, not mortality count |  |  |
| A-06 | iPhone | A6 下痢 / `white`; house + flock; small; Confirm | Subtype/extent match review and saved record |  |  |
| A-07 | iPad | A7 生長遲緩 / `growth_delay`; house + flock; medium; Confirm | Observation can be opened from Records/Todo |  |  |
| A-08 | iPhone | A8 臭腳 / `foot_odor`; house + flock; large; Confirm | Observation is created without requiring or inventing quantity |  |  |
| A-09 | iPad | A9 發燒 / `fever`; house + flock; temperature + extent; Confirm | Temperature is an observation value; result is not a mortality event |  |  |
| A-10 | Desktop | A10 緊迫 / `heat_stress`; house only; medium; Cancel | House-only remains explicit; no write after Cancel |  |  |
| A-11 | Desktop | A11 採食／飲水異常 / `water_abnormality`; house + flock; extent + optional measurement; Confirm | Correct qualitative subtype/context is visible in Records/abnormal tracking |  |  |
| A-12 | iPad | A12 設備異常 / `fan`; house + flock; large; Confirm | Equipment subtype is shown; observation, not numeric event |  |  |
| A-13 | Desktop | A13 天候異常 / `high_temperature`; farm-only with explicit whole-farm confirmation; medium; Confirm | Whole-farm scope is explicit; optional measurement is retained; no bird-count conversion |  |  |
| A-14 | iPhone | A14 淹水 / `flooding`; house + flock; large; Back then Confirm | Back preserves state; saved observation appears in Records/Calendar/tracking |  |  |
| A-15 | iPad | A15 異味 / `odor`; house only; medium; Confirm | No auto-flock; qualitative observation is saved |  |  |
| A-16 | Desktop | A16 場地事件 / `infection`; house + flock; extent, detail, evidence; Confirm | Review shows evidence note; observation is available in Todo/abnormal tracking |  |  |

## Quick Record and Pending Review

| ID | Device | Action | Expected result | PASS/FAIL | Notes |
|---|---|---|---|---|---|
| Q-01 | iPhone | Open Quick Record → 死亡; try blank, negative, decimal, then positive integer | First three are blocked as invalid positive integer; positive integer reaches preview |  |  |
| Q-02 | iPhone | Quick Record preview → Back; preview → Confirm; at farm-only scope choose 套用整場 | Back retains input; pre-confirm scope is visible; confirmed local event appears in Today/Records |  |  |
| Q-03 | iPhone | Quick Record scope → choose a house, no flock; inspect 本舍，不指定批次; Cancel scope | No auto-flock; Cancel leaves overlay unchanged |  |  |
| Q-04 | iPad | Enter unknown/incomplete text → Pending Review; open detail → approval; choose observation + extent; Confirm | Original input is retained; approval creates observation; item moves to completed history without overwriting original |  |  |
| Q-05 | Desktop | From Todo open Pending Review; switch to numeric event and enter positive quantity; return to detail, reopen and Confirm | Mode/quantity changes work; return does not lose item; confirmation produces the local formal record/audit/outbox result |  |  |

## Modules and management navigation

| ID | Device | Action | Expected result | PASS/FAIL | Notes |
|---|---|---|---|---|---|
| N-01 | iPhone | Bottom nav: Today → Records → Todo → Calendar → More → Finance → Records | Active navigation is correct; context persists; Records list/chart and Todo Pending/follow-up content are reachable |  |  |
| N-02 | iPad | Calendar: select a date, move previous/next month, open chick-in/weighing/death detail, then Records | Date detail matches record context; month navigation does not break layout or context |  |  |
| N-03 | Desktop | Open Records, Todo, Calendar and Finance; visit Finance tabs: 總覽、各場、投資人／股權、歷史分配、費用、投資績效、資料來源 | All seven tabs work; content is synthetic/read-only; configured and unconfigured finance scopes do not invent values |  |  |
| N-04 | Desktop | From Farms/management open master-data management; inspect farm, house, flock and caretaker entry; close/back | Management entry is reachable; Lab runtime-overlay boundary is clear; close returns to originating page |  |  |
| N-05 | iPhone／iPad／Desktop | Switch farm-only, house-only, and house + flock contexts; inspect Records, Todo, Calendar, Finance | All modules filter to current scope; house-only is not rendered as a flock; empty/unconfigured states are explicit |  |  |

## Evidence used (guidance only; not human PASS)

- `src/recording-taxonomy.js:1-70`: O1–O9/A1–A16 definitions, subtypes, required/optional/derived fields, and Todo/Calendar metadata.
- `src/guided-recording.js:1-180`: portal areas, guided sequence, farm/house/flock/whole-farm contracts, and canonical record construction.
- `app.js:1419-1650, 2711-3150, 3296-3625`: Records/Todo/Calendar/Finance surfaces, three portal areas, management navigation, guided and Quick Record/Pending Review back/cancel/confirm handlers.
- `tests/unit/guided-recording.test.cjs:1-100` and `tests/unit/recording-taxonomy.test.cjs:1-80`: full taxonomy build and validation plus scope contracts.
- `tests/e2e/recording-portal.cjs:60-160`: three portal entries, management Back, house-without-flock behavior, O9, A5, O6, responsive widths, and error/request assertions.
- `tests/e2e/quick-review.cjs:60-190`: Quick Record validation, farm-only cancel, house-only scope, qualitative observation, and Pending Review.
- `tests/e2e/journeys.cjs:78-271`: Quick Record, Records, Todo, Calendar, context retention and responsive journeys; `tests/e2e/finance.cjs:1-160`: mobile/desktop Finance seven-tab synthetic/source checks.
