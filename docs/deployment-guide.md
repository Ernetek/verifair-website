# VerifAir Deployment Guide

## Deployment architecture

GitHub Actions workflow `.github/workflows/ci.yml` is the sole production
deployment authority. A push to `main` starts its complete quality job. The
production deploy job depends on that job and runs only after typecheck, lint,
unit tests, the production build, E2E tests and the Cloudflare build all pass.

Cloudflare Workers Builds remains connected to provide builds, version uploads
and previews. It must not promote a build to the active production deployment.

## GitHub Actions production deployment

The workflow uses Node 22 and requires these GitHub Actions secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Store only the secret names in repository documentation. Never commit or log
their values.

The production deploy job builds the same commit again and runs
`npx wrangler deploy` only after the complete quality job succeeds.

## Cloudflare Workers Builds

Configure Worker `verifair-public-website` with these settings:

- Production branch: `main`
- Build command: `npm run cf:build`
- Production deploy command: `npx wrangler versions upload`
- Non-production deploy command: `npx wrangler versions upload`
- Non-production branch builds: enabled
- Root directory: `/`

The root `.nvmrc` pins Workers Builds to Node 22.

`wrangler versions upload` creates an addressable Worker version and preview
without promoting it to the active production deployment. `wrangler deploy`
promotes a deployment to production. Workers Builds must use version upload
for both production and non-production branches while GitHub Actions owns
production deployment.

Never enable a second production deployment mechanism while the `ci.yml`
production deploy job is active. In particular, do not configure
`npm run deploy`, `wrangler deploy` or another production-promoting command as
the Workers Builds production deploy command.

## Verification procedure

1. Confirm `.github/workflows/ci.yml` is the only tracked workflow that can run
   `wrangler deploy` on a push to `main`.
2. Confirm its deploy job has `needs: quality` and is restricted to a push to
   `refs/heads/main`.
3. Run the complete local quality suite documented in `README.md`.
4. Push a non-production branch and confirm Workers Builds uses Node 22,
   uploads a version and provides a preview without changing the active
   production deployment.
5. After an approved merge, confirm the Workers Builds run for `main` uploads
   a version but does not promote it.
6. Confirm GitHub Actions completes the quality job before its deploy job and
   that the resulting GitHub Actions deployment is the only new active
   production deployment.

## Rollback procedure

If verification fails, hold merges and leave the Workers Builds production
command set to `npx wrangler versions upload`. The existing active deployment
will remain in service while the failure is investigated.

If an application deployment must be rolled back, reactivate the previously
verified Worker version through the approved Cloudflare rollback process.

To transfer production authority away from GitHub Actions, first disable its
production deploy job and verify that it cannot deploy. Only then may another
production deployment mechanism be enabled. To return authority to GitHub
Actions, first restore Workers Builds to version upload and verify that it
cannot promote production; then re-enable the gated GitHub Actions deploy job.
Two production deployment authorities must never be active at the same time.

## Environment Variables

- `TURNSTILE_SECRET_KEY`: server-side Turnstile verification secret.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: public Turnstile site key.
- Future CRM variables should remain server-side unless a vendor specifically requires a public key.

## Launch Notes

- Keep the operational monitoring app on a separate subdomain.
- Review CSP before enabling third-party analytics scripts.
- Enable Cloudflare WAF, bot protection, analytics, image optimisation and cache rules.
- Confirm legal approval for compliance language before public launch.
