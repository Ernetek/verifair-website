# VerifAir Controlled Implementation Plan

## Purpose

This document controls milestone sequence, scope and gates. Permanent safety and
engineering rules remain in `AGENTS.md`; product requirements remain in
SPEC-001. A milestone still requires a bounded, human-approved task prompt
before implementation.

## Governance baseline — TASK 003B

**Status: COMPLETE.** The baseline documents remain controlled, with current
implementation evidence reconciled in `docs/architecture/current-state.md`.

Establish canonical governance, product specification, verified current-state
evidence, target architecture, ownership contracts and deterministic demo-data
semantics. This task changes documentation only and stops before commit for
human review.

## M1A — canonical domain and deterministic replay engine

**Status: IMPLEMENTED.** Domain, validation, deterministic evaluation and
mechanics tests are present. The public numeric dataset was approved separately.

### Acceptance boundary

M1A delivers:

- canonical scenario, incident, timeline, observation, action, resolution and
  entity-reference types required by replay;
- scenario validation;
- a deterministic replay engine evaluated by integer `offsetMs`;
- UTC persistence, interval, seek and hold-last-known-value semantics from the
  approved demo-data contract;
- mechanics-only synthetic test fixtures where needed, explicitly excluded
  from the final VerifAir demonstration measurement dataset;
- unit and integration-level tests in the existing Vitest suite.

M1A does not deliver UI redesign, playback presentation, live telemetry,
regulatory interpretation, campaign work, AI, CRM/email architecture, lead
handling or the final VerifAir demonstration measurement dataset.

### M1A gate

- Domain ownership matches `component-contracts.md`.
- No current presentation component owns canonical incident/replay facts.
- Scenario inputs are explicitly simulated and validated.
- Required deterministic and boundary tests pass.
- No unsupported causal or regulatory claim is introduced.
- The full repository quality gate passes.
- Human review approves the implementation diff. Final numeric demonstration
  measurements remain subject to a separate dataset-approval task.

## Remaining M1 — replay UI integration

**Status: IMPLEMENTED FOR THE PUBLIC DEMONSTRATION.** The approved scenario,
playback controller, selectors and shared session feed the public replay
surfaces. The complete repository quality gate remains the acceptance evidence
for each change.

After M1A passes, a separately approved task may connect existing or revised
presentation components to the canonical engine, add accessible playback
controls and verify chart/timeline/current-state synchronization. It must not
create another replay model.

## Subsequent milestones

The interactive response and report-preview slices currently visible on the
public site are fictional browser-session demonstrations. They do not complete
M3 or M4: there is no authenticated command service, customer persistence,
production evidence store or operational report generator. M2–M11 therefore
remain separately gated unless a later controlled record explicitly changes
their status.

1. **M2 — Environmental Intelligence:** canonical observations, baseline,
   monitor comparison, weather context, confidence and deterministic insights.
2. **M3 — Incident Centre:** derived incident summaries, search/filter/sort,
   details, actions, resolution and canonical replay entry.
3. **M4 — Evidence & Reporting:** canonical evidence aggregation and reporting
   profiles without compliance scoring.
4. **M5 — Customer Onboarding:** deterministic public configuration without PII
   in shareable URLs.
5. **M6 — Feature & Industry Explorer:** shared capability registry and
   industry context linked to implemented proof.
6. **M7 — Australian Reporting Profiles:** primary-source research, provenance
   and external expert review. Codex cannot mark profiles verified.
7. **M8 — Consultation & Lead Funnel:** separately approved provider-neutral
   CRM/email evolution with validation, abuse controls, fallbacks and privacy.
8. **M9 — Platform Integrations:** typed, versioned future edge/weather/API and
   webhook contracts with documented security.
9. **M10 — AI-Assisted Operations:** grounded provider architecture and
   deterministic public demo behaviour.
10. **M11 — Independent hardening audit:** fresh review of security, privacy,
    reliability, accessibility, performance, SEO, mobile, claims, AI safety,
    demo/live separation and deployment.

## Gate discipline

- Milestones run in order unless a human approves a revised plan.
- Do not begin a later gated milestone while the current gate fails.
- Each implementation task defines exact authorized files and exclusions.
- Each milestone runs the actual repository quality gate and task-specific
  tests.
- M7 cannot pass without qualified expert review.
- M11 must be performed as an independent review and cannot infer readiness
  from build success alone.
- Deployment is never implicit in milestone completion.
