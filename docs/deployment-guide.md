# VerifAir Deployment Guide

## Cloudflare

1. Create the Cloudflare account project for `verifair.com.au`.
2. Add `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` as GitHub Actions secrets.
3. Configure DNS for `verifair.com.au` in Cloudflare.
4. Run `npm ci`.
5. Run `npm run cf:build`.
6. Deploy with `npx wrangler deploy`.

## Environment Variables

- `TURNSTILE_SECRET_KEY`: server-side Turnstile verification secret.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: public Turnstile site key.
- Future CRM variables should remain server-side unless a vendor specifically requires a public key.

## Launch Notes

- Keep the operational monitoring app on a separate subdomain.
- Review CSP before enabling third-party analytics scripts.
- Enable Cloudflare WAF, bot protection, analytics, image optimisation and cache rules.
- Confirm legal approval for compliance language before public launch.
