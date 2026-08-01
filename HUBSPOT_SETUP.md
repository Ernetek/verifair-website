# HubSpot contact form setup

The website now renders HubSpot's embedded form directly. The previous custom
submission handler, Turnstile integration and `/api/enquiries` request are no
longer used by `components/contact-form.tsx`.

## 1. Create the HubSpot properties

Create or confirm these contact properties:

| Label | Internal name | Suggested field type |
|---|---|---|
| Project type | `project_type` | Dropdown select |
| Industry | `industry` | Dropdown select |
| Estimated project value | `estimated_project_value` | Dropdown select or number |
| Enquiry details | `message` | Multi-line text |
| VerifAir enquiry source | `verifair_enquiry_source` | Single-line text |
| VerifAir source page | `verifair_source_page` | Single-line text |
| VerifAir form variant | `verifair_form_variant` | Single-line text |
| VerifAir page URL | `verifair_page_url` | Single-line text |

Create custom UTM properties only when the HubSpot account does not already
contain approved equivalents:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`

## 2. Configure the HubSpot form

Add the visible fields required by the project:

- First name
- Last name
- Work email
- Phone
- Company
- Project type
- Industry
- Estimated project value
- Enquiry details
- Required privacy/consent field

Add the VerifAir source and UTM properties as hidden form fields. Give the
source fields safe default values in HubSpot as a fallback:

- `verifair_enquiry_source`: `website_contact_form`
- `verifair_form_variant`: `contact_page`

The embed also populates hidden fields when the legacy DOM-based form renderer
exposes them. HubSpot's own hidden-field configuration remains the source of
truth, including when the current form renderer isolates fields from page
JavaScript.

## 3. Submission behaviour

Keep the HubSpot form on the same page after submission. The component listens
for HubSpot's successful-submission event, replaces the form with an inline
confirmation and then loads the configured HubSpot Meetings scheduler.

## 4. Environment variables

Copy the HubSpot values into the deployment environment:

```env
NEXT_PUBLIC_HUBSPOT_PORTAL_ID=
NEXT_PUBLIC_HUBSPOT_CONTACT_FORM_ID=
NEXT_PUBLIC_HUBSPOT_REGION=na1
NEXT_PUBLIC_HUBSPOT_MEETINGS_URL=
```

## 5. HubSpot verification

Before launch:

1. Submit one test for every project-type and industry option.
2. Confirm project value and enquiry details appear on the contact record.
3. Confirm all hidden source and UTM properties are recorded.
4. Confirm the consent record is stored as configured.
5. Confirm the inline success message appears only after a successful submission.
6. Book a test meeting and verify the meeting is associated with the contact.
7. Test keyboard-only use, screen-reader labels, error messages and mobile layout.
8. Verify the approved data-retention and privacy settings in HubSpot.
