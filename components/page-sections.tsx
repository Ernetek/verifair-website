import Image from "next/image";
import Link from "next/link";
import { benefits, faqs, industries, type MarketingPage } from "@/lib/content";
import { DashboardPreview } from "@/components/dashboard-preview";
import { Reveal } from "@/components/motion";

export function PageHero({ page }: { page: MarketingPage }) {
  return (
    <section className="noise section overflow-hidden">
      <div className="container grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
        <Reveal>
          <p className="eyebrow">{page.eyebrow}</p>
          <h1 className="h1 mt-5 max-w-4xl font-black">{page.heading}</h1>
          <p className="lead mt-6 max-w-2xl">{page.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn btn-primary" href="/contact">
              Book demonstration
            </Link>
            <Link className="btn btn-secondary" href="/platform">
              Explore platform
            </Link>
          </div>
        </Reveal>
        {page.image ? (
          <Reveal delay={0.12}>
            <Image src={page.image} alt={`${page.title} visual for VerifAir monitoring`} width={900} height={900} className="max-h-[36rem] w-full rounded-lg object-contain" priority />
          </Reveal>
        ) : (
          <Reveal delay={0.12}>
            <DashboardPreview />
          </Reveal>
        )}
      </div>
    </section>
  );
}

export function ContentSections({ page }: { page: MarketingPage }) {
  return (
    <>
      {page.sections.map((section, index) => (
        <section key={section.title} className={index % 2 ? "section band" : "section"}>
          <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <p className="eyebrow">0{index + 1}</p>
              <h2 className="h2 mt-3 font-black">{section.title}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lead">{section.body}</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {section.points.map((point) => (
                  <div key={point} className="flex gap-3 border-t border-slate-200 pt-4">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                    <p className="font-semibold leading-7 text-slate-800">{point}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      ))}
    </>
  );
}

export function BenefitsGrid() {
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <p className="eyebrow">Key benefits</p>
          <h2 className="h2 mt-3 max-w-3xl font-black">Turn individual monitoring points into a shared operational picture.</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <Reveal key={benefit.title} delay={index * 0.03}>
              <div className="card h-full p-5 transition hover:-translate-y-1 hover:shadow-xl">
                <benefit.icon className="h-7 w-7 text-[var(--brand)]" />
                <h3 className="mt-5 text-lg font-black">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{benefit.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function IndustryGrid() {
  return (
    <section className="section band">
      <div className="container">
        <Reveal>
          <p className="eyebrow">Industries</p>
          <h2 className="h2 mt-3 max-w-3xl font-black">Built for construction activity near people, operations and sensitive places.</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <Link key={industry.href} href={industry.href} className="card group p-6 transition hover:-translate-y-1 hover:shadow-xl">
              <industry.icon className="h-8 w-8 text-[var(--brand)]" />
              <h3 className="mt-6 text-xl font-black">{industry.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{industry.body}</p>
              <span className="mt-6 inline-block text-sm font-black text-[var(--brand)] group-hover:underline">View industry</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  return (
    <section className="section">
      <div className="container max-w-4xl">
        <Reveal>
          <p className="eyebrow">FAQ</p>
          <h2 className="h2 mt-3 font-black">Questions procurement, health and project teams ask.</h2>
        </Reveal>
        <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="cursor-pointer list-none text-lg font-black marker:hidden">
                <span className="inline-flex w-full items-center justify-between gap-5">
                  {faq.question}
                  <span className="text-2xl text-[var(--brand)] group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-4 leading-7 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="section bg-slate-950 text-white">
      <div className="container grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="eyebrow text-emerald-300">Ready for project visibility</p>
          <h2 className="h2 mt-3 max-w-3xl font-black">Book a VerifAir demonstration for your next dust-sensitive project.</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="btn bg-white text-slate-950" href="/contact">
            Book demonstration
          </Link>
          <Link className="btn border border-white/20 text-white" href="/contact">
            Contact sales
          </Link>
        </div>
      </div>
    </section>
  );
}
