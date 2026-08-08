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

GitHub Actions runs the full quality job before the production Cloudflare deployment. A failed typecheck, lint, test, build or E2E check prevents deployment.

Required GitHub secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

See `HUBSPOT_SETUP.md` for the public enquiry-form configuration.
