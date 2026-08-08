# HubSpot contact form setup

The public contact page embeds the HubSpot form from:

`components/contact/VerifAirContactForm.tsx`

The previous custom form component and `/api/enquiries` route have been removed.

## Environment variables

Configure these public form identifiers in the local and Cloudflare environments:

```env
NEXT_PUBLIC_HUBSPOT_PORTAL_ID=442470070
NEXT_PUBLIC_HUBSPOT_CONTACT_FORM_ID=9bebb709-1b3f-4392-9f07-a2ea7478b2b4
NEXT_PUBLIC_HUBSPOT_REGION=ap1
NEXT_PUBLIC_HUBSPOT_HOSTED_FORM_URL=https://7bfo3a.share-ap1.hsforms.com/2m-u3CRs_Q5KfB6LqdHiytA
```

These are public embed identifiers rather than private API credentials. Do not place a HubSpot private-app token in a `NEXT_PUBLIC_*` variable.

## Recommended form fields

- First name
- Last name
- Work email
- Phone
- Organisation
- Project type
- Project location
- Expected timing
- Enquiry details
- Required privacy or consent field

Keep the form concise. Additional qualification can occur during the project discussion.

## Content Security Policy

`next.config.mjs` permits the required HubSpot form script, frame, image, connection and child sources. After deployment, inspect the browser console and Network panel and keep the allowed domains as narrow as practical.

## Failure behaviour

The component:

1. waits for a real HubSpot iframe, form or rendered form root;
2. does not treat the placeholder `.hs-form-frame` element as a loaded form;
3. shows a hosted-form link and direct email fallback if the embed fails;
4. provides a no-JavaScript email fallback.

## Launch verification

Before launch:

1. Submit the embedded form on desktop and mobile.
2. Block the HubSpot script and confirm the hosted-form fallback appears.
3. Confirm the contact is created with the expected fields and consent record.
4. Confirm the privacy-policy link is visible and correct.
5. Test keyboard navigation, labels, validation messages and 200% zoom.
6. Confirm the Cloudflare CSP does not block the form or its submission.
