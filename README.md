# VerifAir public website

Launch-stage public website for VerifAir, an Erne Tech particulate-monitoring platform.

## Local development

Use Node 22.

```bash
nvm use
npm ci
npm run dev
```

## Quality checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
npm run cf:build
```

## Deployment

`.github/workflows/ci.yml` is the sole production deployment authority. On a
push to `main`, GitHub Actions runs typecheck, lint, unit tests, the production
build, E2E tests and the Cloudflare build before the production deploy job can
run. A failure in any quality step prevents production deployment. The deploy
build embeds the commit SHA, then the workflow queries the live uncached
`/api/health` endpoint and fails unless production reports the expected SHA.

A successful build or deploy command alone is not production-readiness
evidence. Acceptance requires the independent live health/SHA step to pass.

Cloudflare Workers Builds remains connected for builds, version uploads and
branch previews only. Its production and non-production deploy commands must
remain `npx wrangler versions upload`, which uploads a version without
promoting it to production. While GitHub Actions owns production deployment,
do not configure `npm run deploy` or `wrangler deploy` as the Workers Builds
production deploy command.

Required GitHub secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

See `HUBSPOT_SETUP.md` for the public enquiry-form configuration.
