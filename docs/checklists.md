# VerifAir Launch Checklists

## Accessibility Audit

- Keyboard navigation works across header, accordions, links and forms.
- Focus indicators are visible.
- Heading hierarchy is logical.
- Form labels are explicit.
- Colour is not the only status signal.
- Motion respects reduced-motion preferences.
- Images have descriptive alternative text.

## Security Hardening

- CSP and security headers enabled.
- No secrets exposed in frontend code.
- Turnstile configured for forms.
- `/api/` disallowed in robots.
- Cloudflare WAF and rate limiting configured.
- CRM and analytics scripts reviewed before activation.

## Performance

- Next.js image optimisation enabled.
- Fonts are self-managed by Next.js.
- Public assets use long cache TTLs.
- Animation is restrained and non-blocking.
- Lighthouse target: Performance >95, Accessibility 100, SEO 100, Best Practices 100.

## Browser Compatibility

- Current Chrome, Edge, Safari and Firefox.
- iOS Safari and Android Chrome.
- Tablet landscape and portrait.
- No horizontal scrolling at common viewport widths.

## Content Governance

- Customer names and testimonials require written permission.
- Technical claims require product approval.
- Compliance statements require legal review.
- Dashboard readings on the public site remain labelled as demonstration data.

## Post-launch Optimisation

- Review enquiry conversion by source and industry.
- Add approved case studies as soon as customer permissions are available.
- Tune FAQ and resource pages based on search queries and sales objections.
- Add CRM routing once privacy and security settings are approved.
