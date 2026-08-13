# VerifAir Codex Execution Pack

This package was prepared for the uploaded
`verifair-website-updated-v12.zip`.

## Files

-   `SPEC-001-VerifAir-Operational-Visibility-Website.md` --- approved
    architecture/design specification.
-   `CODEX-MASTER-BUILD-INSTRUCTIONS.md` --- master sequential Codex
    execution plan for M1--M11.
-   `AGENTS.md` --- repository-level rules to install/merge after Codex
    completes the initial audit.

## Recommended use

1.  Give Codex the original v12 repository.
2.  Give it the SPEC and master build instructions.
3.  Ask it to perform **Phase 0 only** first.
4.  Review its audit and proposed file plan.
5.  Merge/adapt `AGENTS.md` to actual repository conventions.
6.  Run M1 only.
7.  Do not continue until the M1 gate passes.
8.  Continue sequentially through M11.
9.  M7 remains expert-review-required.
10. Deploy only if the independent M11 task returns
    `READY FOR PRODUCTION`.

## Important repository facts observed

The uploaded project currently uses Next.js 15.5.x, React 19.1,
TypeScript 5.8, Tailwind 4, Vitest, Playwright, OpenNext Cloudflare,
Wrangler, and an existing HubSpot embedded form. Its README already
defines typecheck/lint/test/build/E2E/Cloudflare-build quality checks.

The existing `HUBSPOT_SETUP.md` uses public HubSpot form identifiers and
correctly warns against placing a private-app token in `NEXT_PUBLIC_*`.
M8 should evolve this safely rather than discard the existing fallback
blindly.

## Product boundary

This pack builds a public, production-quality interactive replica. It
does **not** authorize customer authentication, production telemetry
ingestion, billing, or automatic legal-compliance determination.
