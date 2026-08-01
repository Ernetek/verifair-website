"use client";

import Link from "next/link";
import Script from "next/script";
import { useState } from "react";

import { SALES_EMAIL } from "@/lib/site";

const HUBSPOT_PORTAL_ID = "442470070";
const HUBSPOT_FORM_ID = "9bebb709-1b3f-4392-9f07-a2ea7478b2b4";
const HUBSPOT_REGION = "ap1";

export default function ContactForm() {
  const [scriptFailed, setScriptFailed] = useState(false);

  return (
    <section
      id="contact-form"
      className="contact-section"
      aria-labelledby="contact-form-title"
    >
      <Script
        id="verifair-hubspot-current-form"
        src={`https://js-${HUBSPOT_REGION}.hsforms.net/forms/embed/${HUBSPOT_PORTAL_ID}.js`}
        strategy="afterInteractive"
        onError={() => setScriptFailed(true)}
      />

      <div className="contact-container">
        <header className="contact-header">
          <p className="contact-eyebrow">Project enquiries</p>

          <h2 id="contact-form-title">
            Discuss your monitoring requirements
          </h2>

          <p>
            Tell us about your project, site conditions and monitoring
            requirements. We’ll review the information and contact you to
            discuss the most appropriate next steps.
          </p>
        </header>

        <div className="contact-grid">
          <aside className="contact-information">
            <p className="panel-eyebrow">What to include</p>

            <h3>Help us understand your project</h3>

            <p className="panel-description">
              Include the project location, expected timing, monitoring
              requirements and any sensitive-site considerations.
            </p>

            <ul>
              <li>
                <CheckIcon />
                <span>Project type and industry</span>
              </li>

              <li>
                <CheckIcon />
                <span>Site location and expected timing</span>
              </li>

              <li>
                <CheckIcon />
                <span>Monitoring and reporting requirements</span>
              </li>

              <li>
                <CheckIcon />
                <span>Healthcare or sensitive-site considerations</span>
              </li>
            </ul>

            <div className="contact-notice">
              <InfoIcon />

              <p>
                VerifAir supports environmental monitoring, reporting and
                operational decision-making. Site-specific regulatory and
                compliance obligations should be assessed independently.
              </p>
            </div>

            <div className="direct-contact">
              <span>Prefer to contact us directly?</span>

              <a href={`mailto:${SALES_EMAIL}`}>
                {SALES_EMAIL}
              </a>

              <a href="tel:+61452447696">
                0452 447 696
              </a>
            </div>
          </aside>

          <div className="form-panel">
            <div className="form-panel-header">
              <div>
                <p className="panel-eyebrow">VerifAir</p>
                <h3>Submit a project enquiry</h3>
              </div>

              <span className="secure-label">
                <LockIcon />
                Secure form
              </span>
            </div>

            <noscript>
              <div className="form-error" role="alert">
                <strong>JavaScript is required to load this form.</strong>

                <p>
                  Email{" "}
                  <a href={`mailto:${SALES_EMAIL}`}>
                    {SALES_EMAIL}
                  </a>{" "}
                  if you cannot enable JavaScript.
                </p>
              </div>
            </noscript>

            {scriptFailed ? (
              <div className="form-error" role="alert">
                <strong>The enquiry form could not be loaded.</strong>

                <p>
                  Please refresh the page or email{" "}
                  <a href={`mailto:${SALES_EMAIL}`}>
                    {SALES_EMAIL}
                  </a>
                  .
                </p>
              </div>
            ) : (
              <div
                className="hubspot-current-form"
                aria-label="VerifAir project enquiry form"
              >
                <div
                  className="hs-form-frame"
                  data-region={HUBSPOT_REGION}
                  data-form-id={HUBSPOT_FORM_ID}
                  data-portal-id={HUBSPOT_PORTAL_ID}
                />
              </div>
            )}

            <p className="privacy-message">
              Your information will be handled in accordance with our{" "}
              <Link href="/privacy">privacy policy</Link>.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-section,
        .contact-section *,
        .contact-section *::before,
        .contact-section *::after {
          box-sizing: border-box;
        }

        .contact-section {
          width: 100%;
          padding: clamp(72px, 9vw, 120px) 24px;
          color: #ffffff;
          background:
            radial-gradient(
              circle at 20% 100%,
              rgba(57, 113, 63, 0.24),
              transparent 35%
            ),
            #021c15;
        }

        .contact-container {
          width: min(1160px, 100%);
          margin: 0 auto;
        }

        .contact-header {
          max-width: 690px;
          margin: 0 auto clamp(42px, 6vw, 64px);
          text-align: center;
        }

        .contact-eyebrow,
        .panel-eyebrow {
          margin: 0;
          color: #16a878;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .contact-header h2 {
          margin: 16px 0 20px;
          color: #ffffff;
          font-size: clamp(36px, 5vw, 58px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.045em;
          text-wrap: balance;
        }

        .contact-header > p:last-child {
          margin: 0;
          color: rgba(255, 255, 255, 0.68);
          font-size: 17px;
          line-height: 1.7;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: minmax(280px, 0.8fr) minmax(0, 1.4fr);
          gap: 28px;
          align-items: stretch;
        }

        .contact-information,
        .form-panel {
          min-width: 0;
          border: 1px solid rgba(126, 218, 185, 0.14);
          border-radius: 24px;
        }

        .contact-information {
          display: flex;
          flex-direction: column;
          padding: clamp(28px, 4vw, 48px);
          background:
            radial-gradient(
              circle at 100% 0,
              rgba(145, 180, 88, 0.25),
              transparent 40%
            ),
            linear-gradient(145deg, #07553e, #06382d);
        }

        .contact-information h3 {
          margin: 16px 0;
          color: #ffffff;
          font-size: clamp(30px, 3.5vw, 44px);
          line-height: 1.05;
          letter-spacing: -0.04em;
        }

        .panel-description {
          margin: 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: 15px;
          line-height: 1.7;
        }

        .contact-information ul {
          display: grid;
          gap: 17px;
          margin: 32px 0;
          padding: 0;
          list-style: none;
        }

        .contact-information li {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          color: rgba(255, 255, 255, 0.84);
          font-size: 14px;
          line-height: 1.5;
        }

        .contact-information li :global(svg) {
          flex: 0 0 auto;
          width: 18px;
          height: 18px;
          color: #78d8b5;
        }

        .contact-notice {
          display: flex;
          gap: 12px;
          margin-top: auto;
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.07);
        }

        .contact-notice :global(svg) {
          flex: 0 0 auto;
          width: 18px;
          height: 18px;
          color: #ffb145;
        }

        .contact-notice p {
          margin: 0;
          color: rgba(255, 255, 255, 0.69);
          font-size: 12px;
          line-height: 1.6;
        }

        .direct-contact {
          display: grid;
          gap: 6px;
          margin-top: 24px;
        }

        .direct-contact span {
          color: rgba(255, 255, 255, 0.48);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .direct-contact a {
          width: fit-content;
          color: #ffffff;
          font-size: 14px;
          font-weight: 750;
          text-decoration: none;
        }

        .direct-contact a:hover {
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .form-panel {
          display: flex;
          min-height: 700px;
          flex-direction: column;
          padding: clamp(28px, 4vw, 48px);
          background: rgba(3, 39, 30, 0.82);
        }

        .form-panel-header {
          display: flex;
          gap: 24px;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 30px;
          padding-bottom: 25px;
          border-bottom: 1px solid rgba(126, 218, 185, 0.1);
        }

        .form-panel-header h3 {
          margin: 10px 0 0;
          color: #ffffff;
          font-size: clamp(24px, 3vw, 34px);
          font-weight: 500;
          line-height: 1.2;
          letter-spacing: -0.03em;
        }

        .secure-label {
          display: inline-flex;
          flex: 0 0 auto;
          gap: 7px;
          align-items: center;
          padding: 8px 11px;
          border: 1px solid rgba(126, 218, 185, 0.15);
          border-radius: 999px;
          color: #16a878;
          font-size: 11px;
          font-weight: 700;
        }

        .secure-label :global(svg) {
          width: 14px;
          height: 14px;
        }

        .hubspot-current-form {
          width: 100%;
          min-width: 0;
          flex: 1;
        }

        .hubspot-current-form :global(.hs-form-frame) {
          width: 100%;
          min-height: 560px;
        }

        .hubspot-current-form :global(iframe) {
          display: block;
          width: 100% !important;
          max-width: 100% !important;
          min-height: 560px;
          border: 0;
        }

        .form-error {
          padding: 22px;
          border: 1px solid rgba(255, 177, 69, 0.4);
          border-radius: 16px;
          background: rgba(255, 177, 69, 0.08);
        }

        .form-error strong {
          display: block;
          margin-bottom: 8px;
        }

        .form-error p {
          margin: 0;
          color: rgba(255, 255, 255, 0.72);
          line-height: 1.6;
        }

        .form-error a,
        .privacy-message a {
          color: #8ce3c4;
          font-weight: 700;
        }

        .privacy-message {
          margin: 24px 0 0;
          color: rgba(255, 255, 255, 0.56);
          font-size: 11px;
          line-height: 1.6;
          text-align: center;
        }

        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }

          .form-panel {
            min-height: 650px;
          }
        }

        @media (max-width: 600px) {
          .contact-section {
            padding: 64px 16px;
          }

          .contact-header {
            text-align: left;
          }

          .contact-information,
          .form-panel {
            padding: 24px;
            border-radius: 20px;
          }

          .form-panel {
            min-height: 620px;
          }

          .form-panel-header {
            display: grid;
            gap: 14px;
          }

          .secure-label {
            width: fit-content;
          }

          .hubspot-current-form :global(.hs-form-frame),
          .hubspot-current-form :global(iframe) {
            min-height: 520px;
          }
        }
      `}</style>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="m5 12.5 4.2 4.2L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M12 10.8v5.4M12 7.6h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M8 10V7a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}