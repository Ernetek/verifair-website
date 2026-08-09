# Deterministic Demo Data Contract

## Purpose and status

This contract governs synthetic data proposed or implemented for the public
VerifAir demonstration. It contains approved semantics, but numeric
demonstration measurements remain unapproved.

## Data identity and labelling

- Every demo scenario has a stable ID and version.
- Every numeric demo dataset is explicitly labelled simulated/synthetic.
- Synthetic data must never be represented as workplace, customer, reference,
  approved-instrument or regulatory measurements.
- Units, timestamp basis, source/provenance and approval status are explicit.
- M1A may implement domain, validation and replay mechanics but must not invent
  the final VerifAir demonstration measurement dataset. Dataset approval is a
  separate task.

## Determinism

- The same validated scenario and integer `offsetMs` produce the same state.
- Scenario ordering cannot depend on wall-clock timing, frame rate, locale,
  browser timezone or network availability.
- Direct randomness is prohibited. Seeded generation is also prohibited unless
  its algorithm, seed and resulting dataset are explicitly approved and frozen.
- Presentation code cannot create changing telemetry.

## Time semantics

- Persist absolute timestamps as UTC ISO-8601.
- Canonical replay ordering is ascending integer `offsetMs` relative to scenario
  start.
- Display timezone is presentation metadata only.
- Replay intervals are start-inclusive and end-exclusive.
- The terminal position includes the terminal scenario state.
- Seeking before zero resolves to zero; seeking after duration resolves to
  duration.
- Invalid or non-integer offsets are rejected by scenario validation.

Order-sensitive timeline events must not share the same `offsetMs`. Same-offset
events are permitted only when their relative ordering has no semantic effect.
Scenario validation must reject ambiguous order-sensitive same-offset events.
Do not introduce a sequence field at this stage.

## Observations and interpolation

- Observations are discrete canonical records.
- The default between observations is hold-last-known-value.
- The engine must not fabricate intermediate measurements.
- Any alternative interpolation method must be declared by the approved
  scenario, documented and covered by boundary tests.
- Missing, unavailable and degraded observations remain explicit; they are not
  silently filled.

## Entity and evidence integrity

- Timeline events reference observations, actions, incidents, device states and
  evidence rather than copying their payloads.
- Summary counts and report values are derived from canonical records.
- Reporting must not maintain a second synthetic dataset.
- Scenario changes require version changes and renewed review of expected test
  outputs.

## Claims and causation

- “Following” or other temporal wording must not be rewritten as proof that an
  action caused a change.
- Do not quantify action effectiveness without a separately validated causal
  methodology.
- Do not attribute a pollution source from synthetic correlation.
- Do not declare a breach, legal compliance or regulator approval.
- Configured operational triggers must not be presented as regulatory limits.

## Regulatory boundary

Regulatory/WEL applicability, interpretation, thresholds, measurement methods,
averaging periods, siting and instrument status remain expert/human-review
matters. Unknown values remain unknown. New profiles remain
`EXPERT_REVIEW_REQUIRED`.

## Required M1A tests

- deterministic state for repeated evaluation;
- exact event-boundary behaviour;
- start, intermediate and terminal positions;
- seek clamping before and after scenario bounds;
- UTC persistence and timezone-independent ordering;
- hold-last-known-value behaviour;
- missing/degraded observation behaviour;
- rejection of invalid offsets and dangling references;
- no duplicated canonical payload in timeline events;
- explicit simulated-data metadata.
