# SPEC-001 — VerifAir Operational Visibility Website

## Document control

| Field | Value |
| --- | --- |
| Status | Draft governance baseline — human review required before commit |
| Version | 1.1-draft |
| Owner | VerifAir / Erne Tech |
| Architecture decisions | Approved for TASK 003B drafting |
| Regulatory approval | Not granted; identified regulatory content requires expert review |
| Last revised | 2026-08-09 |

This specification is the controlled product-requirements source for the
VerifAir public website. “Must”, “must not” and “required” are normative.
Sections explicitly labelled implementation guidance describe a proposed
approach and do not prove that a module or capability exists.

## Product purpose

The website remains VerifAir's public sales and acquisition layer rather than
the authenticated customer SaaS product. Its primary commercial objective is a
consultation-first sales motion. Its primary product proposition is
**operational visibility**.

The target experience is a production-quality interactive replica of future
operational capabilities, implemented with reusable architecture and
deterministic simulated data:

> Fake the data, not the product.

The intended visitor journey is:

**SEE → UNDERSTAND → DETECT → RESPOND → PROVE → REPORT → CONFIGURE →
INTEGRATE → ASSIST → CONSULT**

The product must not make unsupported environmental, causal,
source-attribution, regulatory or compliance claims. It supports evidence and
regulator- or project-specific reporting workflows; it does not automatically
determine legal compliance.

## Verified current state

As of the production baseline at commit
`a5cd3cc6632d852bc3ff301ff148b2225961e632`, the repository implements:

- a Next.js 15.5 / React 19.1 / TypeScript 5.8 public website;
- Tailwind CSS 4 and Framer Motion presentation components;
- Node 22, pinned by `.nvmrc`, `package.json` and GitHub Actions;
- Vitest unit/quality tests and Playwright E2E tests;
- OpenNext for Cloudflare and Wrangler;
- static and deterministic demonstration presentation experiences;
- reporting proof, public resources and sales content;
- an active HubSpot embedded contact experience with hosted-form and direct
  email fallbacks;
- GitHub Actions `.github/workflows/ci.yml` as the sole production deployment
  authority;
- Cloudflare Workers Builds as build, version-upload and preview
  infrastructure only.

Production deployment is gated by typecheck, lint, unit tests, the Next.js
production build, Playwright E2E tests and the Cloudflare build. Cloudflare
Workers Builds must use `npx wrangler versions upload` for production and
non-production branches and must not promote production while `ci.yml` owns
production deployment.

The repository does **not** currently implement the canonical incident/replay
domain, deterministic replay engine, regulatory profile registry, production
telemetry ingestion, provider-neutral lead service or AI provider architecture
described below. Those are target capabilities.

See `docs/architecture/current-state.md` for repository evidence and
`docs/architecture/target-state.md` for the proposed target.

## Normative product requirements

### Must

- Preserve and evolve the existing VerifAir visual identity.
- Keep the website as the public sales/acquisition layer.
- Make operational visibility the core product proposition.
- Clearly label all synthetic telemetry and scenarios as simulated
  demonstration data.
- Use one canonical incident/replay domain and one deterministic replay engine.
- Give Environmental Intelligence and Alerts/Incident Response equal product
  weight.
- Provide Incident Replay from one authoritative scenario clock and state.
- Provide PM1, PM2.5, PM10, temperature, humidity, weather context, baseline
  comparison, monitor comparison and data-quality indicators where supported by
  the approved scenario.
- Provide an Incident Centre with filters, search, sorting, incident detail,
  action history, resolution and replay.
- Provide Evidence & Reporting grounded in canonical incident, observation,
  action and resolution records.
- Keep regulatory criteria, project requirements and customer operational
  triggers separate.
- Require primary-source provenance and expert review for regulatory profiles.
- Provide a public customer onboarding/configuration demonstration.
- Provide a shared feature and industry explorer.
- Preserve the current safe HubSpot contact experience until a richer lead
  architecture is approved, implemented and verified.
- Keep private HubSpot, CRM and email credentials server-side and out of
  `NEXT_PUBLIC_*`.
- Provide typed future integration contracts for edge observations, weather,
  APIs and webhooks.
- Ground any AI-assisted experience in existing platform records.
- Prevent AI from inventing telemetry, incidents, actions, regulatory
  requirements, causation, source attribution or compliance conclusions.
- Be mobile-first, accessible, keyboard operable and reduced-motion aware.
- Treat BLOCKER/HIGH security or privacy findings as release blockers.
- Pass the actual repository quality gate before an approved production
  release.

### Should

- Reuse the same incident, observation, weather, device and action entities
  across experiences.
- Include replay controls for play, pause, restart, seek and approved playback
  rates.
- Include monitor/data confidence and completeness.
- Include deterministic baseline and insight engines.
- Include local meteorological context and a future typed weather provider.
- Include industry journeys for construction, quarrying/mining, remediation,
  waste/recycling, infrastructure and manufacturing.
- Preserve non-personal onboarding context without putting personal
  information into URLs.
- Capture intentional lead-qualification context and UTM attribution without
  sending personal information to analytics.
- Include explicit loading, empty, unavailable and error states.
- Consider a tamper-evident evidence-manifest design for future production use
  without presenting it as blockchain.

### Could

- Add shareable non-personal configuration links.
- Add deterministic evidence-completeness evaluation.
- Add approved public/community monitoring scenarios.
- Add additional sensor types through the same provider contracts.
- Add a real LLM provider only after deterministic behaviour, privacy, security
  and cost controls are approved.
- Add live telemetry later in an authenticated product without replacing public
  UI contracts.

### Won't in this public-site program

- Customer authentication.
- Production sensor-fleet provisioning.
- Production telemetry persistence for customer sites.
- Subscription billing.
- Automatic legal-compliance determination.
- Claims that indicative sensors are approved/reference compliance instruments.
- Unrestricted AI chat over arbitrary data.
- Paid weather or AI dependencies required merely for the public demo.
- A second independent replay, telemetry or reporting data model.

## M1A — canonical incident/replay domain and deterministic engine

M1A is formally a subdivision of M1.

### Scope

M1A contains only:

- the canonical incident/replay domain model;
- the deterministic scenario/replay engine;
- validation of deterministic scenario inputs;
- associated unit and integration-level tests within the existing Vitest
  suite.

M1A excludes UI redesign, live telemetry, AI providers, lead handling,
campaign work and regulatory interpretation. UI integration belongs to the
remaining M1 work after M1A passes its gate.

### Canonical timeline event

`IncidentTimelineEvent` is a canonical typed event with:

- a stable ID;
- integer `offsetMs` relative to scenario start;
- an absolute timestamp where required;
- an event type;
- a title or label;
- an optional description;
- applicable severity or category metadata;
- references to related canonical entities instead of duplicated measurement,
  action or evidence data.

An event must not copy observation values, action details or evidence payloads
that are owned by another canonical entity.

### Time and replay semantics

- Persist absolute timestamps as UTC ISO-8601.
- Canonical replay ordering is ascending integer `offsetMs` from scenario start.
- Display timezone is presentation metadata and cannot affect ordering or
  engine state.
- Replay intervals are start-inclusive and end-exclusive except at the
  terminal scenario position, which includes the terminal state.
- Seeking clamps to scenario bounds.
- The engine must return the same state for the same validated scenario and
  position regardless of render frequency or wall-clock timing.
- Order-sensitive timeline events must not share the same `offsetMs`.
- Same-offset events are permitted only when their relative ordering has no
  semantic effect.
- Scenario validation must reject ambiguous order-sensitive same-offset events.
- Do not introduce a sequence field at this stage.

### Observation and interpolation policy

- Do not fabricate measurements between observations.
- Default replay behaviour is hold-last-known-value.
- Another interpolation method may be used only when the approved scenario
  explicitly declares it and its semantics are documented and tested.
- Missing, unavailable and degraded observations remain explicit states.

### Synthetic scenario data

Numeric demonstration measurements remain unapproved. M1A may implement the
domain, validation and replay mechanics, but it must not invent the final
VerifAir demonstration measurement dataset. Dataset approval is a separate
human-review task. Any non-canonical numeric test fixture must:

- be labelled simulated demonstration data;
- never be represented as workplace, customer, reference or regulatory
  measurements;
- have documented units and scenario provenance;
- avoid unsupported causal statements;
- be identified as a mechanics-only test fixture rather than an approved or
  proposed final scenario dataset.

The canonical demonstration timeline includes normal conditions, detection,
alert, notification, acknowledgement, recorded control actions, improving
conditions, trigger clear and resolution. Final numeric observations require a
separate dataset-approval task.

## Target product capabilities

The following subsections are normative outcomes but describe future,
unimplemented work unless `current-state.md` says otherwise.

### Environmental Intelligence

Use canonical observations to present current conditions, trends, monitor
comparison, recent baseline, weather context, device/data confidence and
deterministic insights. Baseline values must expose window, metric, mean,
median, p95, sample count and completeness. Insights describe evidence; they do
not attribute a pollution source or declare compliance.

### Incident Centre

Provide deterministic incident records across approved scenarios. Derive
summary counts; do not hard-code them separately. Support filters, search,
sorting, details, action/resolution history and direct use of the canonical
replay engine.

### Evidence and reporting

Aggregate canonical records rather than owning a parallel dataset. Target
experiences include Incident Evidence, Daily Environmental Summary, Monitoring
Period Summary and Actions & Resolution Register. Evidence completeness is not
a compliance score.

### Customer onboarding

Provide a public, unauthenticated configuration demonstration for industry,
jurisdiction, sites, objectives, monitoring points, capabilities, alerts,
reporting and consultation. Recommendation logic is deterministic. Never infer
a legally required monitor count without an approved applicable source.

### Feature and industry explorer

Use a shared capability registry to drive feature pages, industry journeys,
interactive proof, onboarding defaults and metadata. Industry context must not
create a parallel platform architecture.

### Consultation and lead handling

The current implementation submits through a HubSpot embedded form and does
not use a local `/api/enquiries` route. A future provider-neutral lead service
may coordinate HubSpot and independent email delivery only after a separately
approved design addresses validation, abuse protection, idempotency, partial
failure, fallback, credential isolation and privacy-safe attribution.

### Platform integrations

Future edge, weather, API and webhook contracts must be typed and versioned.
Future production ingestion requires authentication, TLS, credential rotation,
request signing where appropriate, replay protection, timestamp validation,
schema validation, rate limiting and revocation.

### AI-assisted operations

Any future AI provider receives grounded context derived from canonical
records. The public demonstration must have a deterministic, zero-cost provider
path. Draft narratives must be labelled AI-generated and human-review
required.

## Regulatory and expert-review boundary

The following matters require current primary sources and qualified human
expert review:

- National, NSW, VIC, QLD, WA, SA, TAS, ACT and NT reporting-profile content;
- regulatory or workplace-exposure criteria and effective dates;
- applicability to a site, activity, worker or measurement method;
- approved/reference instrument, siting, averaging, QA/QC or sampling claims;
- legal compliance, breach or mandatory monitor-count conclusions.

New profiles default to `EXPERT_REVIEW_REQUIRED`. Codex may collect and
structure primary-source material but cannot promote a profile to verified.
Unknown requirements remain unknown.

Indicative sensor readings are not automatically equivalent to reference or
compliance measurements. Regulatory criteria, project requirements and
customer operational triggers require different source types and must not be
conflated.

## Implementation guidance — non-normative

After repository audit, implementation may use modules resembling:

```text
components/platform/
lib/verifair/domain/
lib/verifair/replay/
lib/verifair/providers/
data/demo/
data/regulatory/
```

Names and locations may be adjusted to repository conventions. The enduring
constraints are ownership, determinism, one canonical domain and one replay
engine—not this suggested directory layout.

The target dependency flow is:

`ScenarioDefinition → ReplayEngine → ReplayState → presentation consumers`

A simulation clock may drive playback, but canonical state calculation must
remain independently testable at an explicit integer `offsetMs`.

Detailed ownership boundaries are in
`docs/architecture/component-contracts.md`; deterministic data requirements are
in `docs/architecture/demo-data-contract.md`.

## Security and privacy

Future release review must cover XSS, injection, unsafe HTML, redirects, CSRF
where applicable, CORS, secrets, environment variables, CSP, third-party
scripts, form abuse, rate limiting, error leakage, source maps, webhooks and
Cloudflare configuration.

Privacy review must cover consultation fields, onboarding state, analytics,
browser storage, cookies, query parameters, third-party scripts, CRM/email
delivery, logs, error reporting and AI context.

Demo/live separation is release-critical. Production providers must never
silently fall back to demo data.

## Actual repository quality gate

Use Node 22 and the lockfile. The controlled quality gate is:

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
npm run cf:build
```

Vitest contains the repository's unit and integration-level deterministic
tests; there is currently no separate `npm run test:integration` command. Add a
new gate only through an explicit repository change.

Run `npm run format` only when intended; do not create unrelated formatting
churn.

Passing the build is necessary but does not by itself establish accessibility,
security, privacy, regulatory or production readiness.

## Milestones

Controlled scope and gates are maintained in `docs/implementation/TASKS.md`.
At a high level:

1. M1A — canonical domain and deterministic replay engine.
2. Remaining M1 — replay UI integration using M1A.
3. M2 — Environmental Intelligence.
4. M3 — Incident Centre.
5. M4 — Evidence & Reporting.
6. M5 — Customer Onboarding.
7. M6 — Feature & Industry Explorer.
8. M7 — Australian Reporting Profiles; expert review required.
9. M8 — Consultation & Lead Funnel.
10. M9 — Platform Integrations.
11. M10 — AI-Assisted Operations.
12. M11 — independent security, privacy and production-hardening audit.

No later gated milestone starts while the current gate is failing.
