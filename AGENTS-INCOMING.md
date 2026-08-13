# AGENTS.md --- VerifAir Codex Operating Rules

## Purpose

This repository is the public VerifAir sales website and
production-grade interactive replica of the future operational platform.
The public replica uses deterministic simulated data.

## Commands

Use Node 22 and the repository lockfile.

Before handoff run, at minimum:

``` bash
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
npm run cf:build
```

Run `npm ci` when setting up a clean environment.

## Architecture rules

-   Reuse existing repository conventions and components.
-   Do not create a second app architecture without written
    justification.
-   Presentation components never invent changing telemetry.
-   All demo measurements originate from approved provider/scenario
    data.
-   One authoritative incident/replay domain model.
-   One replay engine.
-   Use typed provider boundaries for weather, leads, AI, and future
    telemetry.
-   Prefer deterministic TypeScript logic over external AI/API calls.
-   Avoid new dependencies unless they materially reduce risk/complexity
    and are documented.
-   No direct `Math.random()` in UI components.
-   Demo/live providers must be explicitly separated. Production must
    never silently fall back to demo data.

## Product-claim rules

Allowed: - "supports regulator-specific compliance reporting" -
"provides environmental context" - "helps teams investigate changing
conditions" - "retains environmental and operational response records"

Do not claim without separately validated evidence: - guaranteed
compliance; - regulator/EPA approval; - automatic breach
determination; - pollution-source attribution; - causal effect of an
operational action; - approved/reference measurement status.

Correlation is not causation.

## Regulatory rules

-   Regulatory criteria, project requirements, and customer operational
    triggers are separate types.
-   Regulatory configuration requires primary-source provenance.
-   Unknown means unknown; never infer a missing legal requirement.
-   New profiles are `EXPERT_REVIEW_REQUIRED`.
-   Codex cannot self-promote profiles to VERIFIED.
-   Regulatory source/version/applicability must be traceable.

## AI rules

-   AI never becomes the source of telemetry or incident facts.
-   AI outputs must be grounded in existing platform records.
-   AI must not invent readings, actions, incidents, regulatory
    requirements, compliance conclusions, causation, or source
    attribution.
-   Draft report text must be clearly labelled as AI-generated and
    review-required.
-   Public demo must work with a deterministic `DemoAIProvider` and no
    paid inference.

## Privacy rules

-   Collect only data required for consultation.
-   Never put personal information in public/shareable URLs.
-   Never send personal contact data to analytics.
-   Keep private CRM/email credentials server-side.
-   Never log secrets or full sensitive lead payloads.
-   Document third-party data flows.

## HubSpot rules

-   Existing public form IDs may remain public.
-   Private-app tokens must never use `NEXT_PUBLIC_*`.
-   Use a provider-neutral `LeadService`.
-   Preserve a safe fallback if the richer lead pipeline fails.
-   Lead submission must not fail silently.

## Accessibility

-   Keyboard operation for all controls.
-   Visible focus.
-   State is never communicated by colour alone.
-   Respect `prefers-reduced-motion`.
-   Provide textual/chart alternatives where appropriate.
-   Forms expose labels and errors accessibly.
-   Test mobile/touch behavior.

## Performance

-   Avoid unnecessary client components and hydration.
-   Avoid high-frequency whole-page rerenders during replay.
-   Reuse existing charting or lightweight primitives before adding a
    large dependency.
-   Optimize images and third-party scripts.
-   No performance "fix" may reduce correctness or accessibility.

## Security

-   No secrets in source.
-   Validate server inputs.
-   Review CSP whenever adding third-party origins.
-   Treat consultation endpoints as abuse targets.
-   Use least-privilege credentials.
-   Document future integration authentication and replay protection.
-   BLOCKER/HIGH security or privacy findings stop release.

## Milestone discipline

Implement M1 through M11 in order. Do not start the next milestone until
the current quality gate passes. M7 additionally requires external
expert review. M11 is an independent audit.

## Handoff format

Every task must report:

1.  summary;
2.  architecture decisions;
3.  files created/modified;
4.  dependencies;
5.  tests;
6.  commands/results;
7.  accessibility;
8.  security/privacy;
9.  known limitations;
10. next task;
11. gate PASS/FAIL.

Do not claim production readiness merely because the build succeeds.
