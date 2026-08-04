import type { Metadata } from "next";

import { faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about VerifAir particulate monitoring, connectivity, alerts, reporting and compliance boundaries.",
};

export default function FAQPage() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
          FAQ
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.45rem]">
          Frequently asked questions
        </h1>
        <div className="mt-5 h-0.5 w-12 bg-blue-600" />

        <div className="mt-10 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              className={index > 0 ? "group border-t border-slate-200" : "group"}
            >
              <summary className="flex min-h-14 cursor-pointer list-none items-center px-5 py-4 font-bold text-slate-950 marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 sm:px-6">
                <span className="inline-flex w-full items-center justify-between gap-5">
                  {faq.question}
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xl font-semibold text-blue-600 transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="px-5 pb-5 text-base leading-7 text-slate-600 sm:px-6 sm:pb-6">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
