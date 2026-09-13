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
REMOTE_0039 = NOT_APPLIED
REMOTE_0040 = NOT_APPLIED
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
