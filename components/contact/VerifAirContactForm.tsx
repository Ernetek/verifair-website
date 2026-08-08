"use client";

import {
  CheckCircleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

import { SALES_EMAIL, siteConfig } from "@/lib/site";

const HUBSPOT_PORTAL_ID =
  process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID ?? "442470070";
const HUBSPOT_FORM_ID =
  process.env.NEXT_PUBLIC_HUBSPOT_CONTACT_FORM_ID ??
  "9bebb709-1b3f-4392-9f07-a2ea7478b2b4";
const HUBSPOT_REGION = process.env.NEXT_PUBLIC_HUBSPOT_REGION ?? "ap1";
const HUBSPOT_HOSTED_FORM_URL =
  process.env.NEXT_PUBLIC_HUBSPOT_HOSTED_FORM_URL ??
  "https://7bfo3a.share-ap1.hsforms.com/2m-u3CRs_Q5KfB6LqdHiytA";

type FormStatus = "loading" | "ready" | "error";

const projectDetails = [
  "Project type and operating environment",
  "Site location and expected timing",
  "Potential monitoring locations and sensitive interfaces",
  "Alert responsibilities and reporting requirements",
];

const nextSteps = [
  "Project discussion",
  "Site and operational-context review",
  "Proposed monitoring approach",
  "Demonstration or pilot planning",
];

export default function ContactForm() {
  const formHostRef = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>("loading");
  const hasConfiguration = Boolean(HUBSPOT_PORTAL_ID && HUBSPOT_FORM_ID);

  useEffect(() => {
    if (!hasConfiguration) {
      setFormStatus("error");
      return;
    }

    if (!scriptReady || !formHostRef.current) {
      return;
    }

    const formHost = formHostRef.current;
    const hasEmbeddedForm = () =>
      Boolean(
        formHost.querySelector(
          "iframe, form, [data-hs-form-root], .hs-form:not(.hs-form-frame)",
        ),
      );

    if (hasEmbeddedForm()) {
      setFormStatus("ready");
      return;
    }

    const observer = new MutationObserver(() => {
      if (hasEmbeddedForm()) {
        setFormStatus("ready");
        observer.disconnect();
      }
    });

    observer.observe(formHost, { childList: true, subtree: true });

    const timeout = window.setTimeout(() => {
      if (!hasEmbeddedForm()) {
        setFormStatus("error");
      }
      observer.disconnect();
    }, 12000);

    return () => {
      window.clearTimeout(timeout);
      observer.disconnect();
    };
  }, [hasConfiguration, scriptReady]);

  return (
    <section
      id="project-enquiry"
      className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24"
      aria-labelledby="contact-form-title"
    >
      {hasConfiguration ? (
        <Script
          id="verifair-hubspot-current-form"
          src={`https://js-${HUBSPOT_REGION}.hsforms.net/forms/embed/${HUBSPOT_PORTAL_ID}.js`}
          strategy="afterInteractive"
          onReady={() => setScriptReady(true)}
          onError={() => setFormStatus("error")}
        />
      ) : null}

      <div className="container">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
            Project enquiries
          </p>
          <h1
            id="contact-form-title"
            className="mt-4 text-4xl font-bold leading-[1.04] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
          >
            Discuss your monitoring requirements.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Tell us about the project, operating environment and the monitoring
            questions your team needs to answer. We will review the information
            and discuss an appropriate next step.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:gap-16">
          <div>
            <section aria-labelledby="contact-include-title">
              <h2 id="contact-include-title" className="text-2xl font-bold text-slate-950">
                What to include
              </h2>
              <ul className="mt-6 border-y border-slate-300">
                {projectDetails.map((detail) => (
                  <li
                    key={detail}
                    className="flex gap-3 border-b border-slate-300 py-4 last:border-b-0"
                  >
                    <CheckCircleIcon className="mt-0.5 size-5 shrink-0 text-blue-600" aria-hidden="true" />
                    <span className="leading-7 text-slate-700">{detail}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-10" aria-labelledby="contact-next-title">
              <h2 id="contact-next-title" className="text-2xl font-bold text-slate-950">
                What happens next
              </h2>
              <ol className="mt-6 border-y border-slate-300">
                {nextSteps.map((step, index) => (
                  <li
                    key={step}
                    className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-slate-300 py-4 last:border-b-0"
                  >
                    <span className="font-mono text-sm font-bold text-blue-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-semibold text-slate-800">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            <div className="mt-10 border-l-4 border-blue-600 pl-5">
              <p className="text-sm text-slate-500">Contact VerifAir directly</p>
              <a className="mt-2 block font-bold text-blue-700 hover:underline" href={`mailto:${SALES_EMAIL}`}>
                {SALES_EMAIL}
              </a>
              <a className="mt-2 block font-bold text-blue-700 hover:underline" href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>
                {siteConfig.phone}
              </a>
            </div>
          </div>

          <div className="border border-slate-300 bg-white p-5 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
                  VerifAir
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">
                  Submit a project enquiry
                </h2>
              </div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                <LockClosedIcon className="size-4" aria-hidden="true" />
                Secure form
              </span>
            </div>

            <noscript>
              <div className="mt-6 border-l-4 border-red-600 bg-red-50 p-4 text-sm text-red-900" role="alert">
                <strong>JavaScript is required to load this form.</strong>
                <p className="mt-2">Email <a className="font-bold underline" href={`mailto:${SALES_EMAIL}`}>{SALES_EMAIL}</a> if you cannot enable JavaScript.</p>
              </div>
            </noscript>

            {formStatus === "error" ? (
              <div className="mt-6 border-l-4 border-amber-600 bg-amber-50 p-5 text-amber-950" role="alert">
                <strong>The enquiry form could not be loaded.</strong>
                <p className="mt-2 leading-7">
                  Refresh the page, allow optional website scripts, or{" "}
                  <a className="font-bold underline" href={HUBSPOT_HOSTED_FORM_URL} target="_blank" rel="noreferrer">
                    open the enquiry form in a new tab
                  </a>
                  . You can also email <a className="font-bold underline" href={`mailto:${SALES_EMAIL}`}>{SALES_EMAIL}</a>.
                </p>
              </div>
            ) : (
              <>
                {formStatus === "loading" ? (
                  <p className="mt-6 text-sm text-slate-500" role="status" aria-live="polite">
                    Loading the secure enquiry form…
                  </p>
                ) : null}
                <div
                  ref={formHostRef}
                  className="mt-6 min-h-96"
                  aria-label="VerifAir project enquiry form"
                  aria-busy={formStatus === "loading"}
                >
                  <div
                    className="hs-form-frame"
                    data-region={HUBSPOT_REGION}
                    data-form-id={HUBSPOT_FORM_ID}
                    data-portal-id={HUBSPOT_PORTAL_ID}
                  />
                </div>
              </>
            )}

            <p className="mt-6 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-500">
              Your information will be handled in accordance with our{" "}
              <Link className="font-semibold text-blue-700 hover:underline" href="/privacy">
                privacy policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
