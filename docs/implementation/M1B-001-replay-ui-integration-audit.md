# M1B-001 — Replay UI integration audit and implementation boundary

Status: audit complete; implementation subsequently delivered and reconciled on 25 August 2026

Supersession note: this document preserves the pre-implementation audit and its
decision record. For implemented architecture and current ownership, use
`docs/architecture/current-state.md`. Statements below describing source as
"currently" presentation-owned are historical findings from the audited
baseline, not assertions about the present tree.

Authority: GitHub Issue #9, human-approved 10 August 2026

Audited baseline: `origin/main` at `689ff86cb348263f63f8820d44b9bef135839b80`

M1A head contained by baseline: `6914ce1f976974ffa8cdcff46575ec08ca140116`

## 1. Outcome and non-negotiable boundary

M1B must integrate the existing presentation with the M1A domain, validator and
replay engine. It must not adapt M1A to preserve presentation-owned telemetry,
threshold or incident logic.

The integration flow is:

```text
approved unknown input
  -> validateScenario
  -> detached, deeply frozen ValidatedScenario
  -> evaluateAt(validatedScenario, requested positionMs)
  -> ReplayState
  -> pure selectors and presentation formatting
  -> UI
```

The playback controller may own the requested `positionMs`, play/pause state,
playback rate and timer mechanics. Observations, monitor/metric state, incidents,
actions, resolutions, evidence and timeline events remain engine-derived.

There is no approved public particulate scenario in M1A. The M1A fixture is
explicitly `MECHANICS_ONLY_TEST_FIXTURE`, uses artificial signals and must remain
test-only. The existing PM values, thresholds, SVG paths and response histories
are also not an approved canonical dataset. Approval of the final numeric
demonstration scenario is therefore a separate, blocking gate before public UI
integration.

## 2. Repository and evidence inspected

The audit used the implementation at the baseline above and inspected:

- `AGENTS.md`;
- GitHub Issue #9;
- `docs/Specs/SPEC-001-VerifAir-Operational-Visibility-Website.md`;
- `docs/implementation/TASKS.md`;
- `docs/architecture/current-state.md`;
- `docs/architecture/target-state.md`;
- `docs/architecture/component-contracts.md`;
- `docs/architecture/demo-data-contract.md`;
- `lib/replay/domain.ts`;
- `lib/replay/validation.ts`;
- `lib/replay/engine.ts`;
- `tests/replay-fixtures.ts`;
- `tests/replay-domain.test.ts`;
- `tests/replay-validation.test.ts`;
- `tests/replay-engine.test.ts`;
- `components/demonstration/ClinicalDashboards.tsx`;
- `components/home/PlatformOverview.tsx`;
- `components/home/MonitoringRoomSection.tsx`;
- `components/home/CoordinatedSolution.tsx`;
- `components/home/DashboardDemonstration.tsx`;
- `app/page.tsx`;
- `app/demonstration/monitoring-room/page.tsx`;
- `app/demonstration/shared-dashboard/page.tsx`;
- `tests/dashboard-demonstration.test.ts`;
- `tests/homepage-layout-refresh.test.ts`;
- `tests/homepage-composition.test.ts`;
- `tests/workflow-accessibility.test.ts`;
- `tests/section-order-and-zone-interaction.test.ts`;
- `tests/e2e/home.spec.ts`;
- `package.json` and `package-lock.json`.

`docs/architecture/current-state.md` predates the M1A merge and still describes
the canonical replay core as unimplemented. The executable M1A source and tests
on `main` are the current implementation evidence. This documentation drift is
not authority to reopen or change SPEC-001 and is outside this narrow audit edit.

## 3. Current-state inventory

### 3.1 Canonical M1A state

M1A supplies one readonly domain, strict validation from `unknown`, a detached
deeply frozen validated snapshot and deterministic evaluation at integer
offsets. `ReplayState` supplies:

- the requested and clamped offset, canonical timestamp and terminal state;
- monitors sorted by identifier;
- the latest observation independently held for each monitor and metric;
- active incidents with an engine-derived `open` or `resolved` lifecycle;
- actions, resolutions, evidence and timeline events visible at the position;
- stable same-offset ordering for order-independent events.

It intentionally does not supply a chart-history collection in `ReplayState`.
Chart history must be selected from the validated scenario up to
`ReplayState.offsetMs`; it must never be reconstructed from UI frames or paths.

### 3.2 `ClinicalDashboards.tsx`

The file currently implements an independent demonstration model and three
separate time/data behaviours:

1. `SharedDashboard` renders static `initialZones`, hard-coded SVG
   `trendPaths`, locally derived status/workflow and a static response activity
   history. Its only React state is the selected zone.
2. `MonitoringRoomDisplay` copies `initialZones` into component state and mutates
   readings every 3.5 seconds using `Math.random()`. It owns a wall-clock
   `lastUpdated` value.
3. `MonitoringRoomHeroPreview` cycles through hard-coded `heroLiveFrames` every
   3.5 seconds and owns another wall-clock `lastUpdated` value.

None imports `lib/replay`. There is no play, pause, restart, seek, rate or
scenario-bound controller. Current charts are SVG illustrations, not projections
of canonical observations.

The file also owns PM2.5 warning/action settings, a dwell setting, threshold
classification functions, workflow progression, guidance, response history and
incident-like copy. `RoomMetricTile` applies the PM2.5 `stateFor` function to
both PM1 and PM2.5; this demonstrates why presentation threshold logic cannot be
retained as operational truth.

### 3.3 Importers and routes

- `/demonstration/monitoring-room` renders `MonitoringRoomDisplayPage`.
- `/demonstration/shared-dashboard` renders `SharedDashboardPage`.
- The live homepage renders `PlatformOverviewSection`, whose monitoring panel
  renders `MonitoringRoomHeroPreview`.
- The homepage workflow panel uses a separate `WorkflowDashboardDemo` inside
  `PlatformOverview.tsx`.
- `MonitoringRoomSection`, `CoordinatedSolution` and
  `DashboardDemonstration` retain import/re-export paths, but are not in the
  current `app/page.tsx` composition.
- `SharedDashboardPreview` is exported but has no current importer.

### 3.4 Additional duplicate state in `PlatformOverview.tsx`

The active homepage owns another `zones` dataset, PM readings and statuses. Its
workflow panel independently owns alert status, assignee, escalation, closure
reason and lifecycle progression. It also has hard-coded particulate trend paths,
threshold lines and automated-event labels.

Its reporting panel owns a further static report dataset, chart paths, event
list, availability/downtime figures and report totals. Evidence and reporting
belong to later milestones. M1B must not silently treat those aggregates as
outputs of the short replay scenario.

### 3.5 Current tests

The 36 M1A tests cover domain immutability, hostile validation inputs,
detachment/freezing, boundaries, clamping, hold-last-known-value, metric
independence, incident lifecycle and deterministic replay.

`dashboard-demonstration.test.ts` and several homepage tests are source-text
contract tests. Some currently assert the presence of `heroLiveFrames`,
`workflowForState`, threshold labels and other presentation-owned truth. They
would preserve the wrong architecture if left unchanged. Route/no-index,
composition and genuinely presentational assertions remain useful.

## 4. Presentation-item disposition

The dispositions below are exhaustive for replay-relevant state found in the
files above. `DEFER TO M2+` means the item is not a source of M1 replay truth and
must not be wired into M1B. Where a deferred interactive control currently
creates incident truth, it must be absent or clearly inert in the M1 replay
experience until its owning milestone exists.

| Location/item | Current role | Disposition | Required M1B treatment |
| --- | --- | --- | --- |
| Dashboard tab, active panel and selected monitor/zone | View/navigation selection | KEEP AS PRESENTATION | Keep local UI state; key selection by canonical monitor ID, not array index. |
| Carousel position, focus target and reduced-motion preference | View behaviour | KEEP AS PRESENTATION | Keep local and preserve keyboard/focus behaviour. |
| Responsive layout, classes, icons, headings and explanatory copy | Visual formatting | KEEP AS PRESENTATION | May format canonical facts but must not create them. |
| Locale/timezone rendering | Display formatting | KEEP AS PRESENTATION | Format `ReplayState.timestamp` using validated metadata; never use wall clock as replay truth. |
| Metric labels, units and numeric formatting | Display formatting | KEEP AS PRESENTATION | Render canonical `metricId`, unit and reading value; any friendly-label map is presentation metadata only. |
| Non-operational location/context copy | Display copy | KEEP AS PRESENTATION | May be keyed by approved monitor ID; it cannot encode readings, status or thresholds. |
| Play/pause/restart/seek/rate controls | Playback intent, currently absent | KEEP AS PRESENTATION | New controller owns requested position and commands only. |
| `initialZones` readings and `zones` readings in `PlatformOverview` | Parallel observation source | REPLACE WITH M1A STATE | Render `ReplayState.monitorStates[].latestObservations`. |
| `MonitoringRoomDisplay.zones` mutable state | Parallel current-state store | REMOVE | Do not mirror engine observations into mutable component state. |
| `Math.random()` update interval | Non-deterministic telemetry generator | REMOVE | Controller advances position; engine reconstructs state. |
| `heroLiveFrames`, `frame` and cyclic frame interval | Second replay model | REMOVE | Use the same controller/state path as full views. |
| Component-owned `lastUpdated` wall clock | Parallel timestamp | REPLACE WITH M1A STATE | Derive display time from canonical state timestamp. |
| `trendPaths`, `WorkflowTrend` paths and `SmallReportTrend` paths | Invented chart history | REPLACE WITH M1A STATE | Plot selected canonical observations up to the clamped offset via a pure selector. |
| Fixed chart time labels | Invented timeline scale | REPLACE WITH M1A STATE | Derive from scenario start/duration and selected observation offsets. |
| `DEMO_WARNING_PM25`, `DEMO_ACTION_PM25`, dwell and threshold lines | Unapproved project settings | DEFER TO M2+ | Require typed operational-trigger ownership, provenance and separate approval; do not infer from M1A. |
| `stateFor`, `metricStateFor` and duplicated `ZoneState` | Presentation-owned condition evaluation | REMOVE | M1B may show reading quality and canonical incident lifecycle; it must not calculate alert meaning. |
| Normal/review/action tone as operational status | Derived threshold conclusion | DEFER TO M2+ | A future canonical intelligence/trigger result must own it. Do not map colour to value in M1B. |
| Reading quality styling (`good`, `degraded`, `unavailable`) | Formatting of canonical quality | KEEP AS PRESENTATION | Style the canonical discriminated union and provide text, not colour alone. |
| `workflowForState`, `WorkflowProgress` and `HumanWorkflowMotion.stage` | Parallel incident lifecycle | REPLACE WITH M1A STATE | Project canonical incidents, actions and resolution into display steps without mutating them. |
| `responseActivity` and `activitySummaryFor` | Parallel action/resolution/timeline source | REPLACE WITH M1A STATE | Render canonical timeline events, actions and resolutions at the current offset. |
| `stateGuidance` operational guidance | Meaning inferred from local status | DEFER TO M2+ | Requires approved project trigger/intelligence semantics; neutral replay explanation may remain. |
| `SystemAutomationStrip` detected/transferred/evaluated claims | Events not present in M1A scenario | DEFER TO M2+ | Render only if future canonical events support them. |
| Workflow zone selector | Presentation selection | KEEP AS PRESENTATION | Select a canonical monitor; selection cannot change facts. |
| Workflow local `status` and status selector | User-created lifecycle truth | REPLACE WITH M1A STATE | M1B is read-only replay; status comes from incident/resolution offsets. |
| Assignee selection and assignment action | Operational command not modelled by M1A | DEFER TO M2+ | Specifically M3 Incident Centre; exclude from the replay state path. |
| Escalation toggle/action | Operational command not modelled by M1A | DEFER TO M2+ | Specifically M3; do not synthesise an action locally. |
| Close reason editor and Resolve button | Operational mutation not modelled by M1A | DEFER TO M2+ | Specifically M3; replay may display a canonical resolution but cannot create one. |
| Static report rows, totals, downtime, report event list and availability | Independent report/evidence truth | DEFER TO M2+ | Specifically M4 Evidence & Reporting; do not claim these are replay-derived. |
| Report view/date-range/highlight controls | Reporting presentation state | KEEP AS PRESENTATION | Keep within the static reporting preview until M4; do not couple to replay. |
| Existing hard-coded PM numbers and customer-like location scenario | Unapproved public dataset | REMOVE | Replace only after the separate numeric dataset approval gate passes. |
| M1A mechanics-only fixture | Test evidence | KEEP AS PRESENTATION | Test-only use is retained; it must never be imported by application code or displayed publicly. |
| `SharedDashboardPreview` and inactive home wrappers | Unused presentation surfaces | REMOVE | Remove dead exports/wrappers only when importer verification confirms no supported consumer. |
| Demonstration route metadata and `noindex` | Route/presentation policy | KEEP AS PRESENTATION | Preserve unless separately authorised. |

## 5. Canonical ownership map

| Concern | Canonical owner | Presentation access rule | Explicit non-owner |
| --- | --- | --- | --- |
| Playback position request | Playback controller | Own integer `positionMs`; call `evaluateAt` after every tick/command | React dashboard data objects |
| Clamped effective position and terminal state | `ReplayEngine` / `ReplayState` | Read `offsetMs` and `isTerminal`; synchronise controller to the effective bound | Slider arithmetic alone |
| Play/pause state | Playback controller | Local interaction state; pause at terminal | Replay engine |
| Playback rate | Playback controller | Allowed finite positive rate from an approved list | Scenario or presentation data |
| Scenario duration/start and timestamps | Validated `ScenarioDefinition`, then `ReplayState` | Display engine timestamp and scenario bounds | `Date.now()`, `new Date()` as live truth |
| Current observations | `ReplayState.monitorStates` | Render latest observations exactly | Component frames, random mutation or local copies |
| Monitor/metric independence | `ReplayEngine` | Key by monitor ID plus metric ID | Zone-level blanket state |
| Observation history for charts | Validated `ScenarioDefinition` selected at `ReplayState.offsetMs` | Pure selector includes observations at or before the effective offset and orders by offset/ID | Hard-coded SVG paths or interpolation |
| Incidents and lifecycle | `ReplayState.incidents` | Display open/resolved and canonical resolution | Local status workflow |
| Actions and resolutions | `ReplayState.actions` and `.resolutions` | Read-only rendering at current offset | UI buttons in M1B |
| Timeline | `ReplayState.timelineEvents` | Render stable canonical order | Static response lists |
| Evidence | `ReplayState.evidence` | May display scoped evidence facts; reporting aggregation remains M4 | Static report totals |
| Chart viewport, selected series, hover and visual scale | Presentation | May change how canonical points are viewed, never their values/order | Replay engine |
| Labels, time formatting, decimal formatting and CSS tone | Presentation | Pure formatting of canonical values/statuses with textual alternatives | Threshold/incident inference |
| Regulatory/project thresholds and trigger evaluation | Future typed M2 intelligence/configuration | Not represented as M1A facts | Components and CSS |
| Assignment, escalation and resolution commands | Future M3 Incident Centre | Not executable in read-only M1 replay | Local React state |
| Report aggregation/export | Future M4 reporting layer | Not derived ad hoc in M1B | Static UI arrays |

## 6. Duplicated replay and incident truth

The following are substantive duplicate sources, not merely repeated display
copy:

1. Two separate zone datasets (`ClinicalDashboards.initialZones` and
   `PlatformOverview.zones`) encode overlapping locations, readings and status.
2. Three clocks advance or label the monitoring experience independently:
   random mutation, cyclic hero frames and static/shared-dashboard times.
3. `heroLiveFrames` and multiple SVG path maps each encode a different reading
   history not derivable from a scenario.
4. PM threshold and dwell constants plus `stateFor`/`metricStateFor` calculate
   incident-like meaning in presentation code.
5. `workflowForState`, `responseActivity`, `HumanWorkflowMotion.stage` and the
   mutable homepage workflow each define competing incident lifecycles.
6. Local assignment, escalation, status and close-reason state creates actions
   and resolutions that do not exist in M1A canonical records.
7. Fixed chart labels, latest-update times and response times are independent
   timeline truth.
8. Reporting rows, charts and event lists create another set of observations,
   events and aggregates outside the replay source.
9. Source-text tests currently protect some of these duplicates by checking for
   the implementation symbols rather than replay behaviour.

## 7. Exact proposed M1B implementation file boundary

This is the authorised proposal for M1B-002 through M1B-007. Each task still
requires its own approval. Paths not listed are excluded.

### 7.1 Files to create

| Path | Purpose | Earliest task |
| --- | --- | --- |
| `components/demonstration/replay/useReplayPlayback.ts` | React playback clock and commands; requested offset only | M1B-002 |
| `components/demonstration/replay/ReplayPlaybackControls.tsx` | Accessible play, pause, restart, seek and rate controls | M1B-003 |
| `lib/replay/selectors.ts` | Pure canonical observation-history and presentation-input selectors | M1B-004 |
| `tests/replay-playback.test.tsx` | Controller and control behaviour | M1B-002/003 |
| `tests/replay-selectors.test.ts` | History/current/timeline synchronisation and independence | M1B-004 |
| `lib/replay/demonstration-scenario.ts` | Validated public scenario input, only after dataset approval | M1B-005 |
| `tests/replay-demonstration-scenario.test.ts` | Provenance, review status, validation and deterministic public scenario checks | M1B-005 |
| `tests/e2e/replay-demonstration.spec.ts` | Public interaction, synchronisation and accessibility journey | M1B-006 |

The scenario filename is reserved, not approved for creation before the numeric
dataset gate. It must export a validated scenario boundary, not an alternate
state model.

### 7.2 Existing files allowed to modify

| Path | Permitted change |
| --- | --- |
| `components/demonstration/ClinicalDashboards.tsx` | Replace duplicate readings, clocks, charts and lifecycle with canonical inputs; remove random/frame/threshold logic; preserve relevant presentation. |
| `components/home/PlatformOverview.tsx` | Replace monitoring and read-only workflow facts with the same canonical replay path; isolate deferred M3/M4 controls/content. |
| `app/demonstration/monitoring-room/page.tsx` | Import/prop boundary only if required; preserve route policy. |
| `app/demonstration/shared-dashboard/page.tsx` | Import/prop boundary only if required; preserve route policy. |
| `tests/dashboard-demonstration.test.ts` | Replace duplicate-symbol assertions with observable integration contracts. |
| `tests/homepage-layout-refresh.test.ts` | Update composition assertions for the canonical replay surface. |
| `tests/homepage-composition.test.ts` | Update only if dead-wrapper removal changes an asserted import boundary. |
| `tests/workflow-accessibility.test.ts` | Update read-only workflow and accessible-control contracts. |
| `tests/section-order-and-zone-interaction.test.ts` | Update monitor-selection assertions without changing page ordering. |
| `tests/e2e/home.spec.ts` | Update only the existing homepage replay smoke coverage if the dedicated spec does not supersede it. |

Modifications must remain limited to the described concerns. Route files need
not change if the existing exported wrappers can accept the canonical provider
internally.

### 7.3 Explicitly excluded

- `lib/replay/domain.ts`, `lib/replay/validation.ts` and
  `lib/replay/engine.ts`; any semantic defect requires a separately reviewed M1A
  corrective task, not a UI accommodation.
- M1A tests and `tests/replay-fixtures.ts`, except a separately authorised M1A
  regression correction.
- SPEC-001 normative text, governance and architecture claims.
- `package.json`, lockfiles and dependency additions.
- HubSpot/CRM, AI, live telemetry, regulatory/compliance logic and customer data.
- reporting/export implementation and the demonstration PDF.
- deployment, Cloudflare, GitHub workflow, DNS and environment configuration.
- unrelated page sections, styling refactors or component architecture rewrites.

## 8. M1B-002 through M1B-007 sequence

### M1B-002 — Headless playback controller

Create the controller with integer elapsed-time accumulation, play, pause,
restart, seek and approved rates. Evaluate via `evaluateAt` on every requested
position and stop at the engine-reported terminal bound. Test with the existing
mechanics-only fixture only; no application component may import that fixture.

Gate: controller tests pass for clamping, backward seek, rate changes, repeated
evaluation and cleanup. No public numbers are introduced.

### M1B-003 — Accessible playback controls

Create the controls as a controlled presentation component. Provide native
buttons/range/select semantics, visible focus, accessible names, keyboard
operation, current/total time text, disabled-state logic and reduced-motion-safe
behaviour. Controls emit intent only and contain no replay facts.

Gate: interaction/accessibility tests pass at 1x and alternate approved rates,
including terminal restart and pause.

### M1B-004 — Pure replay selectors and UI contract

Add selectors for monitor lookup, metric lookup and chart observations at or
before `ReplayState.offsetMs`. Define a narrow component input contract based on
`ValidatedScenario` plus `ReplayState`; do not define a second domain model.
Prove current cards, timeline and chart use the same effective offset and that
same-offset ordering and monitor/metric independence survive projection.

Gate: selector tests pass using test-only fixtures; no public scenario exists.

### Separate human gate — final numeric demonstration scenario

Before M1B-005, a human must approve the complete public scenario: monitor names,
metric IDs, units, every numeric observation, timestamps/offsets, incidents,
actions, resolutions, evidence, event copy, provenance, timezone and review
status. Any threshold or dwell configuration additionally needs its future typed
owner and relevant expert review. Approval must not be inferred from existing UI
numbers or from M1A fixtures.

Failure to approve means M1B-005 and public integration stop. M1B-002 through
M1B-004 may still be reviewed independently.

### M1B-005 — Approved scenario boundary

Only after the separate gate, encode the approved scenario, validate it from
`unknown` at the boundary and add provenance/review tests. Do not add operational
threshold semantics that M1A does not model.

Gate: scenario validates, is detached/frozen, contains no private/customer data,
is deterministic and is expressly approved for public demonstration.

### M1B-006 — Integrate all active replay surfaces

Connect the approved validated scenario, one controller and engine state to the
two demonstration routes and active homepage monitoring/workflow previews.
Replace random mutation, frames, hard-coded paths, local incident lifecycle and
static replay timestamps. Charts select canonical observations. Remove or keep
out of the replay path the deferred M3 workflow commands and M4 reporting facts.

Gate: component and E2E tests prove synchronisation across current state,
timeline and charts; no active importer retains a second replay source.

### M1B-007 — Removal, accessibility and repository gate

Remove dead duplicate exports/helpers after import verification; replace
source-text tests that protected duplicates; complete keyboard, screen-reader,
reduced-motion, mobile/touch and 200% zoom checks. Run the full repository and
Cloudflare build gates and inspect the complete diff and dependency/configuration
scope.

Gate: zero presentation-owned telemetry/incident truth, all required checks pass
without weakened tests, and deployment remains a separate authorisation.

## 9. Test matrix

| Behaviour | Unit/controller | Selector/engine integration | Component/E2E acceptance |
| --- | --- | --- | --- |
| Play | Fake clock advances requested integer offset | Each position is evaluated by M1A | Button changes to Pause and visible state advances |
| Pause | Clock is cancelled; offset remains fixed | Repeated evaluation is equal | Current cards, timeline and chart remain unchanged |
| Restart | Resets requested offset to zero; terminal state clears | Start-boundary records are included | Keyboard activation restores start state and focus remains usable |
| Seek | Requested integer offset is emitted | Engine evaluates exact position | Slider, current state, timeline and chart update together |
| Playback rates | 0.5x, 1x and 2x (or approved list) scale elapsed offset without fractional engine requests | Same effective offset gives identical state regardless of route taken | Rate control has accessible name/value and does not restart playback |
| Scenario-bound clamping | Negative/over-end request retained only as intent where needed | Engine effective offset clamps to 0/duration and terminal is correct | Slider/time show effective bound; play stops at end |
| Backward seek | Works while paused and playing; resets timing origin | Future observations/events/actions/resolutions disappear; incidents can return from resolved to open or unopened | All visible panels rewind in the same render |
| Deterministic reconstruction | Clock route and direct seek to same integer offset | Deep equality for repeated and forward-then-back evaluation | Screenshot/text state is equal at the same position; no wall-clock/random dependency |
| Current/timeline/chart synchronisation | One controller position | Selectors use `ReplayState.offsetMs`; chart includes no future point | Assertion checks IDs/values/event count/chart points at before, exact and after boundaries |
| Hold-last-known-value | No controller interpolation | Engine-held observation identity/value remains exact between boundaries | Card holds; chart adds no invented intermediate point |
| Monitor/metric independence | Selection changes view only | Update/unavailability for one key does not overwrite another | Cards and series independently show available/degraded/unavailable states |
| Incident lifecycle | Controller crosses open/action/resolution boundaries | Engine supplies unopened/open/resolved and filtered actions | Workflow/timeline reflect canonical transition and rewind correctly |
| Same-offset ordering | N/A | Order-independent events remain stable by ID; invalid order-sensitive ambiguity remains rejected | Timeline has stable order after restart/seek |
| Accessibility | Command API exposes explicit state | N/A | Tab/Shift+Tab, Enter/Space, range arrow keys, visible focus, textual status, no colour-only meaning, labelled controls |
| Reduced motion | Autoplay policy and timer behaviour follow approved UX decision | Canonical result unchanged | No essential information depends on animation; manual controls remain available |
| Route consistency | Same scenario/controller contract used | Same offset produces same selected facts | Homepage and both demonstration routes show the same canonical values at a known offset |
| Dataset isolation | Fixture import scan | Public scenario has approved metadata | No `MECHANICS_ONLY_TEST_FIXTURE`, artificial test signal or customer/private value is rendered |

Tests must favour behaviour and semantic output. Source scans remain useful only
for negative architecture constraints such as absence of `Math.random`, fixture
imports or duplicate threshold helpers.

## 10. Risks, blockers and decisions

### Blocking before public integration

1. **Final numeric dataset approval:** no approved customer-facing scenario
   exists. The public data module and M1B-006 integration must not proceed until
   the separate gate in section 8 passes.
2. **Condition semantics:** M1A represents observation quality and incident
   lifecycle, not normal/review/action threshold evaluation. A human must choose
   the interim M1 presentation: neutral readings plus canonical incident status
   is the safe recommendation. Retaining the current traffic-light calculation
   would create a second model and is not acceptable.
3. **Workflow commands:** assignment, escalation and user-authored closure are
   future M3 operations. Human approval is needed on whether to hide these
   controls in M1B or retain an explicitly non-interactive preview. They cannot
   mutate replay truth.
4. **Reporting preview:** current M4-like figures conflict with the goal of one
   factual source. Human approval is needed on whether they remain as clearly
   isolated fictional reporting content until M4 or are hidden. M1B must not
   derive or validate them ad hoc.

### Engineering risks with defined controls

- Timer drift or fractional offsets could undermine determinism. Accumulate from
  a monotonic elapsed time and round to safe integer milliseconds before engine
  evaluation; test fake-time transitions.
- React state duplication could make cards, charts and timeline disagree. Compute
  one `ReplayState` per effective position and pass it down; do not copy canonical
  arrays into local state.
- Chart selectors could accidentally include future records or interpolate.
  Filter against the engine-clamped offset and preserve canonical values/order.
- Backward seek can expose stale memoised/action state. Derive all factual views
  from the current replay evaluation and test resolution-to-open/unopened rewind.
- Homepage, route and inactive wrappers can diverge. Share the scenario/replay
  boundary and verify every importer before removing dead exports.
- `prefers-reduced-motion` does not itself specify whether replay should
  auto-play. Product/design must approve the autoplay policy; manual controls and
  information equivalence are mandatory in either case.

## 11. Audit acceptance and next task

This audit changes documentation only. It adds no dependency, scenario, customer
data, application code, test behaviour, deployment configuration or production
change. Accessibility requirements are explicitly included in the future test
matrix. Security/privacy controls prohibit fixtures, private data, secrets and
unapproved public values.

Verification performed for this audit:

| Command | Result |
| --- | --- |
| `git rev-parse HEAD` / `git rev-parse origin/main` / `git merge-base HEAD origin/main` | All returned `689ff86cb348263f63f8820d44b9bef135839b80`. |
| `npm.cmd test -- tests/replay-domain.test.ts tests/replay-engine.test.ts tests/replay-validation.test.ts` | PASS: 3 files, 36 tests (Domain 2, Engine 14, Validation 20). The first sandboxed attempt was blocked by filesystem traversal permission; the identical read-only command passed outside that sandbox. |
| `git diff --check` | PASS. |
| `git diff --name-status origin/main -- app components lib tests package.json package-lock.json next.config.ts wrangler.jsonc .github` | Empty: no application, library, test, dependency or deployment/configuration change. |
| `git status --short --branch` | Only this audit plus the pre-existing untracked `AGENTS-INCOMING.md`, `docs/CODEX-MASTER-BUILD-INSTRUCTIONS.md` and `docs/Campaign/`; those unrelated items remain untouched. |

The full typecheck, lint, build, E2E and Cloudflare build gates were not repeated
because the change is one untracked Markdown planning document and the task
explicitly excludes application implementation. They remain mandatory for each
implementation handoff under repository rules.

The next task is M1B-002, limited to the headless playback controller and its
tests. It must not create the public scenario or begin integration.
