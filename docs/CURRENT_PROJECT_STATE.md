# Jinji Current Project State

> Durable development-progress ledger for `aitest00898/jinji-web-v14r-lab`.
>
> This document records project understanding and evidence. It is not the
> Production source authority, a deployment approval, a migration command, or
> a replacement for a release decision.

## Governance

```text
GITHUB_DEVELOPMENT_PROGRESS_ALIGNMENT = ALWAYS_ON
```

Development-progress alignment is separate from:

- source promotion;
- merging `main`;
- Production deployment;
- remote schema migration;
- Queue mutation;
- LINE actions; and
- business-data writes.

An item being recorded here does not authorize any of those actions.

The durable-state rule is:

```text
GITHUB_PROGRESS_ALIGNMENT_REQUIRED = YES
```

whenever project understanding changes, even when:

```text
SOURCE_CHANGE = NO
```

## Repository and alignment snapshot

Observed on 2026-09-13:

```text
WEB_REPOSITORY = /Users/joe/Ai DEV/jinji-web-v14r-lab
GITHUB_REPOSITORY = aitest00898/jinji-web-v14r-lab
WEB_REMOTE_MAIN = d52c6197ada186ef5c69caa3548a0b7954b56459
WEB_REMOTE_FEAT_FULL_RECORDING = 0a6f51446052b68eb72e1477852c5386355e8cb9
```

The original Web `main` worktree had pre-existing uncommitted changes. They
were preserved and not touched by the progress-alignment work.

The metadata branch is intentionally based on the GitHub Web baseline:

```text
LEDGER_BRANCH = meta/current-project-state
LEDGER_BASE = d52c6197ada186ef5c69caa3548a0b7954b56459
LEDGER_FILE = docs/CURRENT_PROJECT_STATE.md
```

The following validated release source belongs to a separate Production
repository, not to this Web repository. Repository identity was verified from
the release checkout's Git common directory and its own `origin`; it was not
inferred from the directory name:

```text
RELEASE_REPOSITORY_IDENTITY = SEPARATE_REPOSITORY
RELEASE_REPOSITORY = aitest00898/jinji-farm-manager
RELEASE_ORIGIN = https://github.com/aitest00898/jinji-farm-manager.git
RELEASE_TOPLEVEL = /Users/joe/Documents/Codex/deployment-prerequisites-20260912
RELEASE_GIT_COMMON_DIR = /Users/joe/Documents/Codex/2026-08-19/files-pasted-by-the-user-ai/outputs/chicken-line-production/.git
LOCAL_RELEASE_REPOSITORY = /Users/joe/Documents/Codex/deployment-prerequisites-20260912
LOCAL_RELEASE_BRANCH = release/deployment-prerequisites-20260912
LOCAL_RELEASE_SHA = 7df2610070518122b1737c62a310ab5492c0e476
LOCAL_RELEASE_BASE_SHA = a51e923ac14bf7093ce3080557bee94e2861283d
VALIDATED_LOCAL_RELEASE_EXISTS = YES
VALIDATED_RELEASE_SOURCE_PUBLISHED = YES
REMOTE_RELEASE_BRANCH = release/deployment-prerequisites-20260912
REMOTE_RELEASE_SHA = 7df2610070518122b1737c62a310ab5492c0e476
REMOTE_SOURCE_ALIGNMENT = PUBLISHED
```

The release branch was absent on its actual remote before publication and was
created by a normal, non-force push. The remote release SHA now matches the
validated local SHA. This publication is source alignment only; it did not
promote the Worker or apply a migration.

The Web repository does not contain the `a51e923...` or `7df261...` objects,
because those objects belong to the separate Production repository. This is
repository provenance, not evidence that the validated Production release is
missing.

## Completed outcomes

The following product outcomes are closed based on the latest accepted
evidence. Older reports must not reopen them merely because an earlier
inventory used a weaker status.

```text
Daily House Round = CLOSED_COMPLETE
One-Water Operation = CLOSED_COMPLETE
Manager Operational Awareness = CLOSED_COMPLETE
```

## Canonical foundation — do not reopen by default

- D1 is the canonical source of truth.
- LINE and Web use the shared Worker/business boundary.
- Workers AI is fallback interpretation only, not write authority.
- Corrections and reversals are append-only and effective-state projected.
- `O1/O4 -> recording_events`.
- `O2/O5/O6/O7/O8 -> operational_actions`.
- `O3/O9 -> operational_events`.
- `A1-A16 -> abnormal_events`.
- Stock is derived from effective canonical facts.
- Test and Production scopes/environments are isolated.

## Completed product slices

The following slices are complete in the current project understanding:

- correction/reversal convergence;
- one-water lifecycle and readiness;
- O6 lab-submission workflow;
- feed estimator for 5 years / 15 cycles;
- O3 partial and final shipment semantics;
- pilot stock safety guardrails;
- canonical manager read model;
- manager feed-estimate awareness;
- O6 overdue awareness;
- operator identity and scope provisioning;
- LINE group to operator/scope binding; and
- canonical write-hold architecture.

## Accepted Test evidence

```text
TEST_FARM = 金雞測試場
TEST_HOUSE = 測試1舍
TEST_BATCH = TEST-BATCH-001
AUTHORITATIVE_EFFECTIVE_STOCK = 963
```

The following accepted evidence remains valid and must not be repeated only to
re-prove the same fact:

- O2 correction exists and is reconciled;
- O3 shipment exists and is reconciled;
- O3 reversal exists and is reconciled; and
- the Test batch and its effective stock remain preserved.

## Sequence 015–020 evidence

```text
SEQ015 = operator identity / scope provisioning
SEQ016 = LINE group -> operator binding
SEQ019 = CANONICAL_WRITE_HOLD
SEQ020_RELEASE_BRANCH = release/deployment-prerequisites-20260912
SEQ020_RELEASE_SHA = 7df2610070518122b1737c62a310ab5492c0e476
SEQ020_TESTS = 912 passed / 11 skipped
SEQ020_FOCUSED_TESTS = PASS
SEQ020_TYPESCRIPT = PASS
SEQ020_GIT_DIFF_CHECK = PASS
SEQ020_LOCAL_MIGRATION_REHEARSAL = 0039 -> 0040 PASS
```

The release source and its tests were validated locally in the separate
Production repository and are now published on its release branch. They have
not been promoted to Production. The Web repository remains unchanged except
for this metadata ledger branch.

## Provisioning decisions already closed

Do not reopen these decisions by default:

- caretaker house/flock scope;
- canonical Web fallback mapping;
- alias CRUD as a first-Pilot blocker; and
- Web provisioning UI before the first Pilot.

Current decision:

```text
FARM_LEVEL_CARETAKER_SCOPE = SUFFICIENT
WEB_FALLBACK = OPERATIONAL_RUNBOOK
ALIAS_CRUD = NOT_A_FIRST_PILOT_BLOCKER
WEB_PROVISIONING_UI_BEFORE_PILOT = NOT_REQUIRED
```

## Backup classification

```text
BACKUP_READINESS = NOT_PROVEN
BACKUP_STATUS = NOT_CLASSIFIED_AS_BROKEN
CURRENT_DEPLOYMENT_BLOCKER = NO
```

This classification is intentionally not an implementation request or a
deployment blocker.

## Sequence 022 — provider-backed quiescence

The Production Queue was identified through read-only Wrangler inspection:

```text
PRODUCTION_QUEUE_NAME = chicken-line-events
PRODUCTION_QUEUE_ID = e0cf13f2b84f48b192a2049dae755da1
QUEUE_ENVIRONMENT = PRODUCTION
QUEUE_PRODUCER = worker:chicken-line-production
QUEUE_CONSUMER = worker:chicken-line-production
```

Observed consumer configuration:

```text
BATCH_SIZE = 10
MAX_RETRIES = 3
MAX_WAIT_TIME = 0ms
MAX_CONCURRENCY = UNSET
RETRY_DELAY = 0
DEAD_LETTER_QUEUE = NONE
```

Provider capability result:

```text
PAUSE_DELIVERY_SUPPORTED = YES
DELIVERY_PAUSED_STATE_OBSERVABLE = YES
CONSUMER_MAX_WALL_CLOCK = 15 minutes (standard provider bound)
QUEUE_BACKLOG_OBSERVABLE = YES / BEST_EFFORT
ACTIVE_INFLIGHT_DIRECT_OBSERVABLE = NO
PRE_CUTOFF_RECEIPTS_RECONCILABLE = YES
CONFIRMED_PROVIDER_GAPS = NONE
QUIESCENCE_DECISION = PROVIDER_BACKED_QUIESCENCE_AVAILABLE
DEPLOYMENT_PREREQUISITES_READY = YES
```

The provider pause/readback capability is distinct from the current paused
state. Sequence 022 did not pause, resume, purge, or otherwise mutate the
Production Queue. The Wrangler `queues info` display omits some settings;
the provider Queue GET contract exposes `settings.delivery_paused`.

## Canonical deployment fence

When a separately approved controlled Production deployment occurs, use this
fence:

1. Deploy the old-schema-compatible write-hold bridge.
2. Set and verify canonical write hold `ON`.
3. Pause `chicken-line-events`.
4. Use provider GET to verify `delivery_paused=true` and record the cutoff.
5. Wait at least the confirmed provider consumer lifetime.
6. Reconcile D1 receipts, processing leases, retries, retained events, and
   canonical commits around the cutoff.
7. Apply remote migrations in order: `0039 -> 0040`.
8. Deploy the final Worker while write hold remains `ON`.
9. Verify schema, health, canonical readback, scope, and isolation.
10. Only after the fence is satisfied, turn hold `OFF` and resume Queue
    delivery.

```text
QUEUE_BACKLOG_ZERO_REQUIRED = NO
PURGE_REQUIRED = NO
FAKE_ACK_REQUIRED = NO
```

## Current project status

```text
PRODUCT_CAPABILITY = READY
PILOT_SUFFICIENCY = MET
PROVIDER_BACKED_QUIESCENCE = VERIFIED
DEPLOYMENT_PREREQUISITES_READY = YES
VALIDATED_RELEASE_SOURCE_PUBLISHED = YES
REMOTE_0039 = APPLIED
REMOTE_0040 = APPLIED
REMOTE_MIGRATIONS_APPLIED_AT = 2026-09-13T09:46Z
CONTROLLED_PRODUCTION_DEPLOYMENT = NOT_YET_RETRIED
REAL_PRODUCTION_PILOT = NOT_STARTED
```

The current action sequence is:

```text
1. independently approve controlled Production deployment
2. execute the canonical deployment fence
3. perform bounded post-deploy verification
```

The sequence is descriptive state, not an automatic action queue. This ledger
does not deploy, migrate, pause Queue delivery, write business data, or start
a Pilot.

## Do-not-reopen ledger

The following areas are closed unless one of the explicit reopen conditions
below is met:

- canonical foundation;
- canonical routing authority;
- stock authority;
- correction/reversal model;
- Daily House Round;
- One-Water lifecycle;
- O6 workflow;
- feed estimator;
- O3 partial/final shipment;
- Manager Awareness;
- operator scope model;
- LINE group/operator binding;
- caretaker granularity;
- Web fallback mapping;
- alias CRUD requirement;
- Web provisioning UI before Pilot;
- write-hold architecture;
- clean-release reconstruction;
- basic Queue receipt/retry/idempotency; and
- full-cycle fixture as a product blocker.

An item may be reopened only when at least one of these is true:

```text
relevant source changed
OR relevant deployed runtime changed
OR relevant schema/data changed
OR direct contradictory evidence exists
OR the user explicitly reopens it
```

## Evidence and supersession rules

```text
OLD REPORT != CURRENT TRUTH
UNKNOWN != MISSING
NOT_PROVEN != BROKEN
```

An older report may have been correct at the time. The latest source-backed,
deployment-backed, or readback-backed evidence supersedes it. Absence of
proof must remain distinct from proof of absence or failure.

## Permanent safety boundaries

```text
SOURCE_CODE_CHANGED_BY_ALIGNMENT = NO
MAIN_CHANGED = NO
PRODUCTION_DEPLOYMENT = NO
REMOTE_MIGRATION = NO
REMOTE_SCHEMA_WRITES = NO
PRODUCTION_BUSINESS_WRITES = 0
QUEUE_MUTATION = 0
LINE_SEND = 0
FINANCE_CHANGES = 0
CRON_CHANGED = NO
RECOVERY_CRON_REMAINS_DISABLED = YES
WORKERS_AI_CALLS = 0
MAIN_MERGE = NO
FORCE_PUSH = NO
```

## Alignment rule for future work

After any source change, test result, blocker decision, requirement closure,
release preparation, deployment attempt, migration, or Pilot evidence that
changes project understanding:

1. update this durable state;
2. commit the state update on a safe metadata or relevant development branch;
3. push only the explicitly approved branch; and
4. verify the remote file and commit SHA.

Do not imply that a metadata ledger publishes or promotes product source.

## Latest controlled-deployment attempt — stopped safe

Observed on 2026-09-13. The deployment was stopped before any Production
mutation because the required old-schema-compatible write-hold bridge could
not be identified as a distinct, exact, previously validated artifact.

```text
DEPLOYMENT_RESULT = STOPPED_SAFE
STOP_REASON = VALIDATED_BRIDGE_ARTIFACT_NOT_RESOLVED
BRIDGE_ARTIFACT_PROVEN = NO
BRIDGE_BRANCH = NOT_RESOLVED
BRIDGE_SHA = NOT_RESOLVED
FINAL_RELEASE_SHA = 7df2610070518122b1737c62a310ab5492c0e476
FINAL_RELEASE_REMOTE_SHA_MATCH = YES
```

Evidence for the stop:

- `CANONICAL_WRITE_HOLD` first appears in the validated `7df261...` release
  commit.
- That same commit also introduces migrations `0039` and `0040`; it is the
  final schema-dependent release, not a separately proven pre-migration
  bridge.
- Existing `release/operational-safety-no-schema-20260909` and its corrected
  `release/operational-safety-8b-base-20260909` source trees do not contain
  `CANONICAL_WRITE_HOLD`, so they cannot be substituted as the required bridge.
- No other exact bridge branch, SHA, or validated artifact was found in the
  existing local worktrees or Git history.

No Production state was changed:

```text
PRODUCTION_RUNTIME_CHANGED = NO
REMOTE_MIGRATION_THIS_TURN = NO
REMOTE_SCHEMA_WRITES = 0
QUEUE_MUTATION_THIS_TURN = NO
PRODUCTION_BUSINESS_WRITES = 0
LINE_SEND = 0
FINANCE_CHANGES = 0
MAIN_CHANGED = NO
SOURCE_CODE_CHANGED = NO
```

The previously verified provider-backed quiescence capability remains
recorded as verified. It is not sufficient to continue this deployment
without the exact bridge artifact. The next permitted action is a bounded
provenance review for that artifact; do not improvise a bridge, rebuild the
release, or begin migrations/deployment.

```text
CURRENT_DEPLOYMENT_PREREQUISITES = BLOCKED_BY_UNRESOLVED_BRIDGE
CURRENT_NEXT_ACTION = PROVENANCE_REVIEW
```

## Canonical write-hold bridge — packaged and source-aligned

Observed on 2026-09-13. The stopped-safe deployment attempt above remains
historical evidence. The missing bridge has now been extracted from the
validated Production base in an isolated worktree, checked against the
pre-0039 local schema, committed, and published on its own release branch.

```text
CONTROLLED_PRODUCTION_DEPLOYMENT_ATTEMPT = STOPPED_SAFE
REASON = independent old-schema bridge artifact had not yet been packaged
CANONICAL_WRITE_HOLD_BRIDGE = release/canonical-write-hold-bridge-20260913
BRIDGE_BASE_SHA = a51e923ac14bf7093ce3080557bee94e2861283d
BRIDGE_SHA = ead7640f41b24db838c38ecff604c2ecdab51b33
BRIDGE_REMOTE_ALIGNED = YES
PRE_0039_SCHEMA_COMPATIBILITY = PASS
BRIDGE_SOURCE_PUBLISHED = YES
FINAL_RELEASE = 7df2610070518122b1737c62a310ab5492c0e476
FINAL_RELEASE_REMOTE_ALIGNED = YES
REMOTE_0039 = NOT_APPLIED
REMOTE_0040 = NOT_APPLIED
PRODUCTION_SOURCE = UNCHANGED
QUEUE_STATE = UNCHANGED
CURRENT_CONFIRMED_BLOCKER = NONE
CURRENT_DEPLOYMENT_PREREQUISITES = READY
CURRENT_NEXT_ACTION = RETRY_CONTROLLED_PRODUCTION_DEPLOYMENT
```

The bridge contains only the canonical write-hold boundary and its focused
contract coverage. It contains no 0039/0040 migration, operator-scope
provisioning, or LINE binding source. Local validation used only migrations
0001–0038; health/readiness started on that schema with hold states OFF, ON,
and INVALID observable, and no business or audit rows were created.

## Controlled Production deployment — complete

Observed on 2026-09-13. This section records the live transition separately
from the earlier stopped-safe attempt and the packaged-bridge readiness state.

```text
CONTROLLED_PRODUCTION_DEPLOYMENT = COMPLETE
INITIAL_WORKER_VERSION = 04afee9d-646f-48c9-94ee-9ac65c4477aa
INITIAL_SCHEMA_STATE = PRE_0039_0040
INITIAL_QUEUE_STATE = ACTIVE
BRIDGE_SHA = ead7640f41b24db838c38ecff604c2ecdab51b33
BRIDGE_WORKER_VERSION = 72e37935-abb2-4e9f-9eeb-073041d56931
BRIDGE_CANONICAL_WRITE_HOLD = ON
CUTOFF_T0 = 2026-09-13T09:29:43Z
QUEUE_STATE = ACTIVE
QUEUE_DELIVERY_PAUSED = false
REMOTE_0039 = APPLIED
REMOTE_0040 = APPLIED
REMOTE_MIGRATIONS_APPLIED_AT = 2026-09-13T09:46Z
FINAL_RELEASE_DEPLOYED = YES
FINAL_RELEASE_SHA = 7df2610070518122b1737c62a310ab5492c0e476
FINAL_RELEASE_WORKER_VERSION_HOLD_ON = e2fdc41c-94a3-42e0-baca-2dfc0465c7f1
FINAL_RELEASE_CANONICAL_WRITE_HOLD = ON
FINAL_RELEASE_WORKER_VERSION_HOLD_OFF = f4bd4c6c-8cd0-46a2-9278-f8fc00810bde
CURRENT_CANONICAL_WRITE_HOLD = OFF
QUEUE_MESSAGE_MUTATION = 0
QUEUE_CONTROL_TRANSITION = PAUSE_THEN_RESUME
PRODUCTION_BUSINESS_WRITES = 0
FINANCE_CHANGES = 0
LINE_SEND = 0
WORKERS_AI_CALLS = 0
POST_RESUME_OBSERVATION = PASS
NEXT_ALLOWED_ACTION = FIRST_CONTROLLED_REAL_PRODUCTION_PILOT
```

The provider readback sequence was `Paused` during the transition and
`Active` after resume (`delivery_paused=false`). The bridge and final-release
health/readiness checks were normal; the final release was 100% live under
hold before the hold-off transition, with no pending migrations and the new
operator identity/scope tables present. Post-resume bounded observation also
remained normal. No Production pilot was started by this deployment task.

## First controlled real Production pilot — blocked safe at read-only preflight

Observed on 2026-09-13. The authenticated canonical Web session was used for
read-only preflight only. No LINE message, canonical business write, Queue
mutation, or Production data mutation was performed.

```text
PILOT_RESULT = BLOCKED_SAFE
PILOT_STAGE = 1A_READ_ONLY_PREFLIGHT
PILOT_SCOPE = PRODUCTION
PRODUCTION_WEB_SESSION = AUTHENTICATED
AUTHORIZED_PRODUCTION_FARMS_VISIBLE = 8
GLOBAL_CANONICAL_HOUSES_VISIBLE = 15
ACTIVE_PRODUCTION_FLOCKS_VISIBLE = CONFLICTING_SURFACES_NOT_VERIFIED
PRODUCTION_OPERATOR_BINDING = NOT_VERIFIED
PRODUCTION_LINE_GROUP_BINDING = NOT_VERIFIED
BLOCK_REASON = NO_AUTHORITATIVE_PRODUCTION_OPERATOR_BINDING_AND_ACTIVE_FLOCK_NOT_VERIFIED
CURRENT_LINE_CHAT_EVIDENCE = TEST_GROUP_ONLY
WEB_LINE_BINDING_SURFACE = NO_PRODUCTION_LINE_CONNECTION_IN_CURRENT_BUILD
PRODUCTION_PILOT_1A = NOT_EXECUTED
PRODUCTION_PILOT_1B = NOT_EXECUTED
PRODUCTION_BUSINESS_WRITES = 0
LINE_SEND = 0
QUEUE_MESSAGE_MUTATION = 0
FINANCE_CHANGES = 0
WORKERS_AI_CALLS = 0
```

The Web session showed Production scope and eight authorized farm choices.
The system read model showed fifteen houses and zero active batches, while the
house-list surface separately displayed batch rows; the current selected
authorized farm had no selectable house/flock for a write context. This is a
conflicting readback, not evidence of a usable active Production flock. The Web
LINE settings surface explicitly states that this build does not connect to
LINE and only retains an information entry point. The visible LINE Desktop
conversation was the established Test group, not evidence of a Production
binding. These facts are sufficient to fail closed; they do not constitute a
Product P0/P1.

```text
CONFIRMED_P0 = 0
CONFIRMED_P1 = 0
NEXT_ALLOWED_ACTION = VERIFY_OR_CONFIGURE_AUTHORITATIVE_PRODUCTION_OPERATOR_AND_LINE_BINDING
```
