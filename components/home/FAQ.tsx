import Link from "next/link";

import { faqs } from "@/lib/content";

import { Reveal } from "./Reveal";

export function FAQSection() {
  return (
    <section className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-12">
          <Reveal>
            <div className="lg:sticky lg:top-32">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
                FAQ
              </p>
              <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.45rem]">
                Questions procurement, health and project teams ask.
              </h2>
              <div className="mt-5 h-0.5 w-12 bg-blue-600" />
              <Link
                href="/faq"
                className="mt-7 inline-flex min-h-11 items-center text-sm font-bold text-blue-600 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
              >
                View all questions
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
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
          </Reveal>
        </div>
      </div>
    </section>
  );
}
