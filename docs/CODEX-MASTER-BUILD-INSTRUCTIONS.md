# CODEX-MASTER-BUILD-INSTRUCTIONS

## Mission

Upgrade the uploaded VerifAir public website into the production-grade
public platform replica defined in
`SPEC-001-VerifAir-Operational-Visibility-Website.md`.

Do not treat this as a greenfield rewrite. Audit and preserve the
existing Next.js/React/Cloudflare architecture, VerifAir brand, tests,
HubSpot fallback, security headers, and working content unless a
documented change is necessary.

## Non-negotiable product rules

1.  Fake the data, not the product.
2.  Demo telemetry is deterministic and clearly identified as simulated.
3.  One domain model powers Incident Replay, Environmental Intelligence,
    Incident Centre, and Reporting.
4.  One replay engine only.
5.  Environmental correlation is not causation.
6.  Do not claim pollution-source attribution without validated
    methodology.
7.  VerifAir supports regulator-specific reporting; it does not
    automatically determine legal compliance.
8.  Regulatory, project, and customer operational criteria remain
    separate.
9.  Regulatory profiles require primary-source provenance and expert
    review.
10. AI is grounded in platform records and cannot invent facts.
11. Personal data never goes into public URLs or analytics events.
12. HubSpot private credentials are server-side only.
13. Avoid paid dependencies unless explicitly approved.
14. Security/privacy findings classified BLOCKER or HIGH stop release.
15. Do not call the site production-ready because `next build` succeeds.

## Phase 0 --- repository audit

Before product code:

-   read the entire repository;
-   read README, package.json, lockfile, Next config, Cloudflare config,
    GitHub workflows, docs, tests, and HubSpot setup;
-   run the existing quality suite;
-   record pre-existing failures;
-   map routes/components/design tokens;
-   map existing enquiry and HubSpot behavior;
-   identify existing CSP/security assumptions;
-   identify reusable components;
-   propose the smallest safe target architecture.

Create or update:

-   `AGENTS.md`
-   `docs/architecture/current-state.md`
-   `docs/architecture/target-state.md`
-   `docs/architecture/component-contracts.md`
-   `docs/architecture/demo-data-contract.md`
-   `docs/implementation/TASKS.md`

Do not implement M1 until this audit is complete.

## AGENTS.md minimum rules

Codex must encode these persistent rules in repository `AGENTS.md`:

-   Node version and package manager from repository.
-   Required quality commands.
-   TypeScript strictness/conventions.
-   Reuse before duplication.
-   No changing data inside presentation components.
-   No direct `Math.random()` in UI.
-   Deterministic demo scenarios.
-   Demo/live separation.
-   Accessibility requirements.
-   Mobile-first requirements.
-   Performance constraints.
-   Regulatory claim restrictions.
-   AI guardrails.
-   Privacy rules.
-   Secret-handling rules.
-   Dependency approval rule.
-   Milestone acceptance-gate rule.
-   Required final handoff format.

## Execution order

Execute strictly:

1.  M1 Incident Replay.
2.  M2 Environmental Intelligence.
3.  M3 Incident Centre.
4.  M4 Evidence & Reporting.
5.  M5 Customer Onboarding.
6.  M6 Feature + Industry Explorer.
7.  M7 Australian Reporting Profiles.
8.  M8 Consultation + Lead Funnel.
9.  M9 Platform Integrations.
10. M10 AI-Assisted Operations.
11. M11 independent Production Hardening.

After each milestone:

-   run required tests;
-   inspect diff;
-   document decisions;
-   stop on mandatory failure.

## M1 --- Incident Replay

Build one polished deterministic scenario `INC-DEMO-001`.

Use:

`ScenarioDefinition → SimulationClock → ReplayEngine → ReplayState → UI`

Timeline:

-   10:40:00 Normal operating conditions.
-   10:41:08 Elevated particulate conditions detected.
-   10:41:13 Alert generated.
-   10:42:02 Supervisor notification delivered.
-   10:44:31 Incident acknowledged.
-   10:48:17 Control action recorded.
-   10:50:42 Additional suppression recorded.
-   10:51:04 Conditions improving.
-   10:53:22 Trigger condition cleared.
-   10:58:44 Incident resolved.

UI: incident header, environmental chart, current readings, weather
context, device/data status, timeline, actions/resolution, replay
controls. Controls: play, pause, restart, scrub, 1x/2x/4x. Respect
reduced motion. All state comes from the same replay state.

Test timestamp boundaries and synchronization.

## M2 --- Environmental Intelligence

Reuse M1 telemetry/provider contracts.

Build current conditions, PM trends, monitor comparison, baseline
engine, weather context, data confidence, and deterministic
InsightEngine.

Baseline: mean, median, p95, sample count, completeness.

Never conflate recent baseline, operational trigger, or
regulatory/project criterion.

Test missing data, trends, localised/multi-monitor differences,
return-to-baseline, weather context, and cross-M1 consistency.

## M3 --- Incident Centre

Create 10--15 deterministic incidents. Build derived summary counts,
filters, sorting, search, incident detail, actions, device/data health,
resolution, and Replay link.

No second replay system.

Test Centre → Detail → Replay and consistency with M2
telemetry/weather/actions.

## M4 --- Evidence & Reporting

Aggregate existing data only.

Build:

-   Incident Evidence.
-   Daily Environmental Summary.
-   Monitoring Period Summary.
-   Actions & Resolution Register.
-   ReportingProfile abstraction.
-   EvidenceCompleteness evaluator.

Do not present completeness as compliance.

## M5 --- Customer Onboarding

Build public configurator:

operation → jurisdiction → sites → monitoring objectives → monitoring
points → capabilities → alerts → reporting → deployment summary →
consultation.

Recommendation engine is deterministic.

Do not put PII in URLs. Persist non-personal configuration safely.

## M6 --- Feature + Industry Explorer

Create structured capability registry and industry profiles for
construction, quarrying/mining, remediation, waste/recycling,
infrastructure, manufacturing.

Industry selection changes context, not core architecture.

Every capability should link to real M1--M5 interactive proof where
available.

## M7 --- Australian Reporting Profiles

Internet research is required. Use current primary authoritative
government/regulator sources only.

Support National, NSW, VIC, QLD, WA, SA, TAS, ACT, NT.

Every regulatory configuration item needs provenance. Unknown data
remains unknown. Never invent.

All new profiles default to `EXPERT_REVIEW_REQUIRED`.

Create:

-   `docs/regulatory/research-method.md`
-   `docs/regulatory/expert-review.md`
-   `docs/regulatory/unresolved.md`
-   machine-readable profiles;
-   source notes.

Do not mark a profile VERIFIED yourself.

## M8 --- Consultation + Lead Funnel

The repository currently embeds a HubSpot form. Preserve a safe
hosted-form/email fallback while implementing the approved CRM + email
architecture.

Build provider-neutral `LeadService` with:

-   `HubSpotLeadProvider`
-   `EmailProvider`

Requirements:

-   server-side validation;
-   rate limiting/abuse protection;
-   minimal data collection;
-   private HubSpot credentials server-side only;
-   idempotent contact handling by email where appropriate;
-   qualification context;
-   UTM attribution;
-   privacy-safe analytics;
-   explicit partial/total failure handling;
-   no silent lead loss.

Do not expose secrets in `NEXT_PUBLIC_*`.

## M9 --- Platform Integrations

Define and validate:

-   EdgeObservation schema;
-   WeatherProvider;
-   future EdgeWeatherProvider;
-   API contract;
-   versioned webhook event schemas.

Document future device security: authentication, TLS, credential
rotation, replay protection, timestamp validation, schema validation,
rate limiting, revocation.

The public site must clearly distinguish implemented, simulated, and
planned integrations.

## M10 --- AI-Assisted Operations

Implement:

-   `AIProvider`
-   `AIContextBuilder`
-   `AIGuardrails`
-   `AIInsight`
-   `DemoAIProvider`

Public demo makes no external AI call.

Features:

-   Explain Incident.
-   Shift Briefing.
-   Compare Monitoring Points.
-   Draft Incident Narrative.
-   Controlled Ask VerifAir.

All output is grounded in existing record IDs. Draft narratives are
labelled `AI-GENERATED DRAFT — REVIEW REQUIRED`.

Test prompt attempts to invent data, assert causation, identify
pollution sources, declare breaches/compliance, claim regulator
approval, or override uncertainty.

## M11 --- independent release audit

Use a fresh Codex task. Do not trust prior agents.

Audit equally:

-   security;
-   privacy;
-   reliability;
-   accessibility;
-   performance;
-   SEO;
-   mobile;
-   regulatory claims;
-   AI safety;
-   demo/live separation;
-   conversion;
-   deployment.

Security/privacy are non-negotiable blockers.

Create:

-   `docs/release/security-review.md`
-   `docs/release/privacy-review.md`
-   `docs/release/accessibility-review.md`
-   `docs/release/performance-review.md`
-   `docs/release/regulatory-claims-review.md`
-   `docs/release/ai-red-team.md`
-   `docs/release/production-checklist.md`

Classify findings BLOCKER/HIGH/MEDIUM/LOW/INFORMATIONAL.

Final decision must be exactly:

`READY FOR PRODUCTION`

or

`NOT READY FOR PRODUCTION`

If not ready, list exact blockers and remediation.

## Mandatory quality gate

Use repository scripts. Current v12 includes:

``` bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
npm run cf:build
```

Also run relevant dependency/security checks and preview smoke tests
where the environment permits.

## Required milestone handoff

Every milestone response must contain:

1.  Summary.
2.  Architecture decisions.
3.  Files created.
4.  Files modified.
5.  Dependencies added + justification.
6.  Tests added.
7.  Commands run + results.
8.  Accessibility implications.
9.  Security/privacy implications.
10. Known limitations.
11. Exact recommended next task.
12. Whether the milestone gate passed.

Never hide failures.
