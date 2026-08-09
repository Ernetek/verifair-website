# VerifAir Current-State Architecture

## Status and evidence boundary

This document records implemented repository architecture only. It was audited
against `origin/main` commit
`a5cd3cc6632d852bc3ff301ff148b2225961e632` on 2026-08-09. Proposed modules
belong in `target-state.md` and must not be inferred from this document.

## Runtime and framework

- Node 22 is pinned by `.nvmrc`, `package.json` and GitHub Actions.
- The application uses Next.js 15.5, React 19.1 and TypeScript 5.8.
- Styling uses Tailwind CSS 4; existing interactive presentation also uses
  Framer Motion.
- The application uses the Next.js App Router and MDX content.
- OpenNext for Cloudflare builds the Worker bundle described by
  `open-next.config.ts` and `wrangler.toml`.

## Implemented application structure

- `app/page.tsx` composes the public homepage.
- `app/[slug]/page.tsx` supplies content-driven public pages, including the
  current contact route.
- Dedicated routes exist for reporting, reports, resources, search,
  technology, case studies and two demonstration pages.
- `lib/content.ts`, `lib/resources.ts`, `lib/site.ts` and `lib/metrics.ts` own
  the current small content/configuration layer.
- Current dashboard, monitoring-room and reporting components are presentation
  demonstrations. They do not constitute a canonical incident/replay domain or
  replay engine.
- There is no tracked local `/api/enquiries` route.

## Contact and HubSpot

`components/contact/VerifAirContactForm.tsx` is imported by the contact branch
of `app/[slug]/page.tsx`. It embeds the configured public HubSpot form directly.
If the embed fails, it exposes the hosted-form and direct-email fallbacks
documented in `HUBSPOT_SETUP.md`.

The repository does not currently implement a provider-neutral `LeadService`,
a private HubSpot API integration or an independent email-delivery provider.

## Tests and quality

The tracked test suite uses Vitest for unit/quality/component tests and
Playwright for E2E coverage. Regression protection includes:

- retirement of the former local enquiry route and legacy contact form;
- case-sensitive validation of public asset references;
- contact fallback behaviour;
- core page, composition, accessibility and presentation expectations.

The actual quality job runs install, typecheck, lint, unit tests, production
build, E2E tests and Cloudflare build.

## Deployment

`.github/workflows/ci.yml` is the only tracked GitHub Actions workflow. On a
push to `main`, its `quality` job must succeed before its dependent `deploy` job
can run `npx wrangler deploy`.

Cloudflare Workers Builds remains connected for builds, version uploads and
previews. Its production and non-production deploy commands are required to
remain `npx wrangler versions upload`. It is not a production promotion
authority.

The Worker is `verifair-public-website`; the production domain remains
`verifair.com.au`.

## Security and public integrations

- `next.config.mjs` supplies CSP and other response security headers.
- HubSpot public embed identifiers are documented as public configuration;
  private credentials must remain server-side.
- No secret values belong in repository documentation.

## Explicitly not implemented

The current repository does not yet contain:

- a canonical incident, observation, action and evidence domain;
- a deterministic replay engine or scenario clock;
- approved synthetic numeric replay datasets;
- live customer telemetry ingestion or persistence;
- regulatory profile data;
- a provider-neutral lead pipeline;
- AI provider or AI context infrastructure;
- customer authentication, billing or fleet provisioning.
