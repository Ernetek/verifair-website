# VerifAir Current-State Architecture

## Status and evidence boundary

This document records implemented repository architecture as reviewed on
25 August 2026. Executable source and passing tests are the implementation
evidence; target capabilities remain in `target-state.md`. The public site is a
sales and deterministic demonstration surface, not the authenticated customer
platform.

## Runtime and framework

- Node 22 is required by `.nvmrc`, `package.json` and GitHub Actions.
- The application uses Next.js 15.5, React 19.1 and TypeScript 5.8.
- Styling uses Tailwind CSS 4 and selected Framer Motion interactions.
- The Next.js App Router serves TypeScript and MDX content.
- OpenNext produces the Cloudflare Worker described by
  `open-next.config.ts` and `wrangler.toml`.

## Public application structure

- `app/page.tsx` composes the public homepage.
- Dedicated Monitoring, Workflow and Reporting routes present ASSESS, ACT and
  REPORT product surfaces.
- `/demonstration` provides the unified fictional operational walkthrough.
- `app/[slug]/page.tsx` supplies content-driven industry, legal, product and
  contact pages.
- Resources are repository-authored content exposed through dedicated routes.
- There is no tracked local `/api/enquiries` submission route.

## Canonical deterministic demonstration

The single scenario-fact path is:

```text
publicDemonstrationScenario
  -> validateScenario
  -> ValidatedScenario
  -> ReplayPlaybackController / evaluateAt
  -> ReplayState
  -> selectors and DemonstrationSession
  -> presentation consumers
```

`lib/replay/domain.ts` owns scenario incidents, observations, actions,
resolutions, evidence and timeline events. `lib/replay/validation.ts` snapshots,
validates and freezes unknown scenario input. `lib/replay/engine.ts` derives
deterministic state at an integer offset. The public numeric dataset is frozen,
fictional, explicitly labelled and approved only for product demonstration.

`lib/demonstration/incident-domain.ts` is an event-sourced response projection,
not a second scenario domain. `DemonstrationSession` derives its incident ID,
monitor ID, opening offset and trigger description from the validated replay
incident, combines the replay state with user-entered response events, and
provides one subscribed snapshot to the interactive UI. Response events never
rewrite scenario observations or claim that a recorded action caused later
readings.

Static Workflow and Reporting timeline presentations project
`publicDemonstrationScenario.timelineEvents`. Charts use scenario observations;
presentation code does not own an independent changing telemetry series.

The Monitoring route has a narrower projection boundary. The typed
`projectMonitoringAt` selector derives its Control Centre, Monitor Detail,
trend, Wallboard, freshness and health facts from the same validated public
scenario and device-health configuration. It does not render incident
workflow, response actions, evidence or report-generation controls.

## Product-model boundaries

- Dustlight device status, VerifAir operational state and VerifAir system
  health remain separate typed concepts.
- Respirable Dust is a separate fictional channel and is not calculated from
  PM1, PM2.5 or PM10.
- Demonstration operational triggers are scenario-local and are not regulatory
  limits, exposure determinations or production defaults.
- Interactive assignment, investigation, evidence, verification and closure
  are browser-session demonstrations. They do not establish completion of the
  future authenticated Incident Centre milestone.

## Contact and HubSpot

`components/contact/VerifAirContactForm.tsx` embeds the configured public
HubSpot form. If the embed fails, it exposes hosted-form and direct-email
fallbacks. The repository does not implement a provider-neutral `LeadService`,
private HubSpot API integration or independent email-delivery provider.

## Tests and quality

Vitest covers domain, validation, replay, controller, session, presentation
contracts, content and deployment-health behaviour. Playwright covers public
routes, the homepage, responsive behaviour, keyboard interactions, contact
fallbacks and replay synchronisation on Desktop Chrome and Mobile Safari.

The required local and CI gate is typecheck, lint, unit tests, Next production
build, Playwright E2E and OpenNext Cloudflare build.

## Deployment and production verification

`.github/workflows/ci.yml` is the sole tracked production promotion authority.
On a push to `main`, quality must pass before `wrangler deploy`. The deployment
build embeds `github.sha`; after promotion, CI queries `/api/health` on the
production domain and fails unless the live uncached response reports both
`status: ok` and the expected SHA.

Cloudflare Workers Builds remains documented as build/version/preview only.
Its external dashboard configuration cannot be proven from repository source
and requires independent operational verification.

## Security and public integrations

- `next.config.mjs` supplies CSP and other response security headers.
- `/api/health` exposes service status and a public commit identifier only; it
  is uncached and contains no environment secrets.
- HubSpot public embed identifiers may be client-visible; private credentials
  remain server-side.
- No customer authentication, billing, fleet provisioning, live telemetry
  ingestion or customer record persistence is implemented in this repository.

## Explicitly future or incomplete

- authenticated customer/tenant access and role-based authorisation;
- live customer telemetry ingestion, persistence and production providers;
- verified regulatory profiles and expert-reviewed interpretations;
- provider-neutral lead handling and abuse-controlled server submission;
- production AI providers and grounded AI context infrastructure;
- independently verified Cloudflare dashboard, WAF, bot and rollback settings;
- customer fleet provisioning, billing and production service operations.
