# VerifAir Target-State Architecture

## Status

Everything in this document is future/target architecture unless an item is
also recorded in `current-state.md`. This document does not assert that target
modules, providers or product capabilities are implemented.

## Target boundary

The public website remains a sales and acquisition layer with a deterministic
interactive replica. Customer authentication, production fleet provisioning,
customer telemetry persistence and billing remain outside the public-site
program.

The target architecture extends the existing Next.js application rather than
creating a second app.

## Canonical operational core

The target has one canonical operational domain containing scenario,
observation, incident, timeline, action, resolution, device/data-health and
evidence references. One deterministic replay engine derives replay state for
all consumers.

```text
Approved ScenarioDefinition
  → validation
  → deterministic ReplayEngine(offsetMs)
  → canonical ReplayState
  → replay, environmental, incident and reporting consumers
```

UI components do not calculate independent incident truth or invent changing
measurements. A playback clock may advance `offsetMs`, but wall-clock rendering
does not own canonical state.

## Target data/provider separation

- A deterministic demo provider supplies explicitly simulated public data.
- Future live providers use typed boundaries and cannot silently fall back to
  demo data.
- Weather, leads, AI and future telemetry integrations have separate typed
  provider contracts.
- Regulatory, project and operational criteria remain distinct types with
  different provenance and verification requirements.

## Target experience layers

1. Incident Replay uses the canonical replay state.
2. Environmental Intelligence derives trends, baselines, comparisons and
   evidence-based insights from canonical observations.
3. Incident Centre derives summaries, filtering and details from canonical
   incidents.
4. Evidence & Reporting aggregates canonical records without creating a
   parallel dataset.
5. Customer Onboarding uses deterministic recommendations and retains no PII
   in shareable URLs.
6. Feature & Industry Explorer reuses capabilities rather than duplicating
   operational architecture.
7. Regulatory profiles carry primary-source provenance and expert-review
   status.
8. Future lead handling may add provider-neutral CRM/email delivery while
   preserving current safe fallbacks.
9. Future integrations use authenticated, versioned schemas.
10. Future AI uses grounded canonical record IDs and a deterministic public
    demo provider.

## Deployment invariant

The target product work does not change the verified deployment invariant:

`main push → complete GitHub quality gate → ci.yml deploy → production`

Cloudflare Workers Builds remains a build/version/preview mechanism unless a
separately approved migration first disables the existing authority. Two
production promotion authorities must never be enabled simultaneously.

## Planned documentation boundaries

- SPEC-001 owns product requirements.
- `AGENTS.md` owns durable engineering and safety rules.
- `component-contracts.md` owns architectural responsibility boundaries.
- `demo-data-contract.md` owns deterministic scenario semantics.
- `docs/implementation/TASKS.md` owns milestone sequencing and gates.
