# AGENTS.md — VerifAir Codex Operating Rules

## Purpose and authority

This repository is the public VerifAir sales website. It currently contains
public marketing pages, deterministic demonstration experiences, reporting
proof, educational resources, a HubSpot-hosted contact experience and the
canonical validated scenario/replay core described by SPEC-001. The interactive
incident-response reducer is a response projection within the shared
demonstration session; it is not a second source of scenario facts or evidence
that the future authenticated operational platform is complete.

This file contains durable repository-wide rules. Product requirements live in
`docs/Specs/SPEC-001-VerifAir-Operational-Visibility-Website.md`. Verified
implemented and proposed future architecture are documented separately under
`docs/architecture/`. Milestone scope and sequencing live in
`docs/implementation/TASKS.md`.

When documents conflict, stop and obtain human direction. Do not silently
reinterpret regulatory, privacy, security or product-claim requirements.

## Commands and environment

Use Node 22 and the repository lockfile. Run `npm ci` when setting up a clean
environment.

Before handoff, run at minimum unless the task is explicitly read-only or a
command would violate the task's safety constraints:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
npm run cf:build
```

Record every command result and every pre-existing or new failure. Do not hide
warnings or weaken tests merely to pass a gate.

## Current and target architecture

- Treat `docs/architecture/current-state.md` as evidence of implemented
  architecture, not an aspiration.
- Treat `docs/architecture/target-state.md` and target contracts as future
  architecture until their implementation and tests are merged.
- Reuse existing repository conventions and components.
- Do not create a second app architecture without written justification.
- The implemented incident/replay core has one validated scenario model and
  one replay engine shared by all consumers. Interactive demonstration response
  events may extend the session projection but must derive incident identity
  and scenario facts from that core.
- Presentation components must not invent changing telemetry or incident facts.
- Demo measurements must originate from an approved deterministic scenario or
  provider dataset.
- Prefer deterministic TypeScript logic over external AI/API calls for the
  public demonstration.
- Do not use direct `Math.random()` in presentation components.
- Demo and live providers must be explicitly separated. Production must never
  silently fall back to demo data.
- Use typed provider boundaries for weather, leads, AI and future telemetry
  when those integrations are implemented.
- Avoid new dependencies unless they materially reduce risk or complexity and
  the justification is documented.

## Product claims

Allowed positioning includes:

- “supports regulator-specific compliance reporting”;
- “provides environmental context”;
- “helps teams investigate changing conditions”;
- “retains environmental and operational response records”.

Do not claim without separately validated evidence:

- guaranteed compliance;
- regulator or EPA approval;
- automatic breach determination;
- pollution-source attribution;
- causal effect of an operational action;
- approved or reference measurement status.

Correlation is not causation. Synthetic or indicative readings must never be
presented as workplace, reference or compliance measurements.

## Regulatory rules

- Regulatory criteria, project requirements and customer operational triggers
  are separate concepts and types.
- Regulatory configuration requires current primary-source provenance.
- Unknown means unknown; never infer a missing legal requirement.
- New regulatory profiles are `EXPERT_REVIEW_REQUIRED`.
- Codex cannot promote a regulatory profile to verified.
- Source, version, applicability and review status must remain traceable.
- Regulatory and workplace-exposure interpretation requires human expert
  review.

## AI rules

- AI never becomes the source of telemetry, incident or regulatory facts.
- AI output must be grounded in existing platform records.
- AI must not invent readings, actions, incidents, requirements, compliance
  conclusions, causation or source attribution.
- Draft report text must be labelled AI-generated and review-required.
- Any future public AI demonstration must work through a deterministic demo
  provider without requiring paid inference.

## Privacy and HubSpot

- Collect only information required for consultation.
- Never put personal information in public or shareable URLs.
- Never send personal contact data to analytics.
- Keep private CRM and email credentials server-side.
- Never log secrets or complete sensitive lead payloads.
- Document third-party data flows.
- Existing HubSpot public form identifiers may remain public.
- Private-app tokens must never use `NEXT_PUBLIC_*`.
- The currently implemented contact experience embeds HubSpot directly and
  retains hosted-form and direct-email fallbacks. Do not describe a future
  provider-neutral lead service as already implemented.
- Any future richer lead pipeline must preserve a safe fallback and must not
  fail silently.

## Accessibility

- All controls must be keyboard operable with visible focus.
- State must not be communicated by colour alone.
- Respect `prefers-reduced-motion`.
- Provide textual or tabular alternatives where appropriate.
- Forms must expose labels, instructions and errors accessibly.
- Test mobile, touch, 200% zoom and relevant browser behaviour.

## Performance

- Avoid unnecessary client components and hydration.
- Avoid high-frequency whole-page rerenders during replay.
- Reuse existing charting or lightweight primitives before adding a large
  dependency.
- Optimise images and third-party scripts.
- No performance change may reduce correctness or accessibility.

## Security

- Never commit secrets.
- Validate server inputs.
- Review CSP whenever adding third-party origins.
- Treat consultation and future integration endpoints as abuse targets.
- Use least-privilege credentials.
- Document future integration authentication, replay protection and revocation.
- A BLOCKER or HIGH security/privacy finding stops release.

## Delivery discipline

- Follow the controlled milestone order and gates in
  `docs/implementation/TASKS.md`.
- Do not begin a later gated milestone while the current gate is failing.
- Keep changes within the authorized task scope.
- Inspect the complete diff and repository status before handoff.
- Do not claim production readiness merely because a build succeeds.
- Deployment requires explicit authorization and the verified production
  mechanism documented in `docs/deployment-guide.md`.

## Handoff format

Every task must report:

1. summary;
2. architecture decisions;
3. files created or modified;
4. dependencies;
5. tests;
6. commands and results;
7. accessibility;
8. security and privacy;
9. known limitations;
10. next task;
11. gate PASS or FAIL.
