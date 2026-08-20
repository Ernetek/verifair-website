# Monitoring-room mobile compaction — change record

## Summary

This change compacts VerifAir's monitoring-room demonstration on phone-sized viewports and gives every displayed particulate metric an independently classified textual state. It also introduces one responsive device-shell primitive for the monitoring, workflow, and reporting product experiences.

## Demonstration metric status configuration

The pure classifier in `lib/demonstration/metric-status.ts` owns the product-owner-confirmed deterministic demonstration-only thresholds:

| Metric | ELEVATED from | ACTION from |
| --- | ---: | ---: |
| PM1 | 8 | 20 |
| PM2.5 | 15 | 25 |
| Respirable dust | 25 | 50 |
| PM10 | 30 | 50 |

These are presentation triggers for the public deterministic demonstration. They are **not** workplace exposure values, regulatory criteria, compliance limits, or automatic breach determinations. Regulatory profiles remain separate.

The classifier returns `NORMAL`, `ELEVATED`, or `ACTION` plus accessible high-contrast green, amber, or red presentation classes. Unit tests cover both boundaries for every metric, including PM2.5 at 14.9/15 and 24.9/25.

## Monitoring-room presentation

- The sensor-card wrapper is a two-column grid below `lg` and retains four columns at `lg` and above.
- Base shell padding, headings, gaps, and metric typography are compact on phones and restore their larger sizing at `sm`.
- Each neutral dark monitor card shows the full, wrapping monitor identity and four independently classified metric panels.
- Every panel includes its metric, deterministic reading, `PARTICULATE_UNIT`, and visible state text; state is not communicated by colour alone.
- The existing canonical incident phase/progress block remains at the bottom.
- Shared dashboard and hero-preview PM2.5 semantics use the same classifier, and dashboard controls keep visible keyboard focus treatment.

## Unified product device shell

`DeviceShell` is a dependency-free presentational wrapper built with React and Tailwind utilities. Below `sm`, it provides a rounded phone bezel, speaker/camera treatment, and home indicator. At `sm` and above it provides a monitor bezel, inset screen, camera detail, stand, and base. Decorative details are `aria-hidden`.

The real React interface reflows inside the bezel; it is not scaled as an image. Bezel clipping does not create an inner vertical scroll container. The same shell is used for monitoring, opened workflow, and reporting while retaining the existing section and anchor IDs.

## Validation coverage

- Pure unit tests validate both classification boundaries for all four metrics.
- Playwright verifies the unified monitoring grid has two computed columns at 320 px and that the document does not overflow horizontally.
- No dependency, scenario measurement, replay timing, workflow event, or data-provider change was made.
