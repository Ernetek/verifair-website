import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, CpuChipIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { BenefitsGrid, FAQSection, FinalCTA, IndustryGrid } from "@/components/page-sections";
import { DashboardPreview } from "@/components/dashboard-preview";
import { FloatingTelemetry, HeroMotion, Reveal } from "@/components/motion";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Know the Air You Breathe. Protect the People Who Matter.",
  description:
    "VerifAir provides real-time dust monitoring and environmental intelligence for hospitals, construction, infrastructure and other dust-sensitive environments.",
  alternates: { canonical: "/" }
};

const workflow = ["Dustlight Device", "Gateway", "Edge Processing", "Secure Cloud", "Dashboard", "Alerts", "Reporting", "Operational Insights"];

export default function HomePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VerifAir",
    url: siteConfig.url,
    description: siteConfig.description
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-slate-950 text-white">
        <Image
          src="/assets/dustlight-device-banner.webp"
          alt="Dustlight particulate monitoring device used for construction dust visibility"
          fill
          className="object-cover opacity-[0.42]"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,18,32,0.93),rgba(11,18,32,0.64),rgba(11,18,32,0.22))]" />
        <div className="container relative flex min-h-[calc(100svh-5rem)] items-center py-16">
          <HeroMotion>
            <p className="eyebrow text-emerald-300">VerifAir environmental intelligence</p>
            <h1 className="display mt-5 max-w-5xl font-black">Know the Air You Breathe. Protect the People Who Matter.</h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-slate-100">
              VerifAir turns Dustlight particulate monitoring into real-time operational awareness for healthcare construction, infrastructure and dust-sensitive works.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link className="btn bg-white text-slate-950" href="/contact">
                Book demonstration
              </Link>
              <Link className="btn border border-white/25 bg-white/10 text-white" href="/platform">
                Watch platform overview
              </Link>
            </div>
          </HeroMotion>
        </div>
        <FloatingTelemetry />
      </section>

      <section className="border-b border-slate-200 py-8">
        <div className="container">
          <p className="text-sm font-black uppercase text-slate-500">Trusted by teams managing sensitive environments</p>
          <div className="mt-5 grid gap-3 text-sm font-bold text-slate-600 sm:grid-cols-2 lg:grid-cols-5">
            {["Hospital infrastructure", "Main contractors", "Government projects", "Engineering teams", "Facility managers"].map((item) => (
              <div key={item} className="border-t border-slate-200 pt-4">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="eyebrow">The problem</p>
            <h2 className="h2 mt-3 font-black">Dust risk often moves faster than the information available to manage it.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="lead">
              Construction-generated dust, PM10, PM2.5 and invisible airborne particulates can affect project decisions, occupied environments and stakeholder confidence. Manual checks and delayed reporting leave teams reacting after conditions have changed.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {["Invisible airborne risks", "Manual monitoring gaps", "Delayed awareness", "Fragmented records", "Operational disruption", "Environmental management pressure"].map((item) => (
                <div key={item} className="flex gap-3 border-t border-slate-200 pt-4 font-semibold">
                  <ArrowRightIcon className="mt-1 h-5 w-5 shrink-0 text-[var(--brand)]" />
                  {item}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section band">
        <div className="container">
          <Reveal>
            <p className="eyebrow">The solution</p>
            <h2 className="h2 mt-3 max-w-3xl font-black">Dustlight captures the data. VerifAir transforms it into operational awareness.</h2>
          </Reveal>
          <div className="mt-12 grid gap-3 md:grid-cols-4">
            {workflow.map((step, index) => (
              <Reveal key={step} delay={index * 0.03}>
                <div className="card h-full p-5">
                  <p className="font-mono text-sm text-[var(--brand)]">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-5 text-xl font-black">{step}</h3>
                  {index < workflow.length - 1 ? <ArrowRightIcon className="mt-8 h-5 w-5 text-slate-400" /> : <ShieldCheckIcon className="mt-8 h-5 w-5 text-emerald-600" />}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="eyebrow">Platform preview</p>
            <h2 className="h2 mt-3 font-black">A site-wide view for readings, alerts, trends and device health.</h2>
            <p className="lead mt-5">Dashboard visuals are created for this public website and use demonstration data only.</p>
          </Reveal>
          <Reveal delay={0.12}>
            <DashboardPreview />
          </Reveal>
        </div>
      </section>

      <BenefitsGrid />
      <IndustryGrid />

      <section className="section">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Why VerifAir</p>
            <h2 className="h2 mt-3 max-w-3xl font-black">Traditional monitoring sees points in time. VerifAir shows the operating picture.</h2>
          </Reveal>
          <div className="mt-10 overflow-hidden rounded-lg border border-slate-200">
            <div className="grid bg-slate-950 text-white md:grid-cols-2">
              <div className="p-6">
                <h3 className="text-2xl font-black">Traditional Monitoring</h3>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-black">VerifAir</h3>
              </div>
            </div>
            {[
              ["Periodic or fragmented checks", "Continuous multi-zone visibility"],
              ["Delayed reporting", "Real-time alerts and current status"],
              ["Separate device records", "Centralised monitoring across Dustlight devices"],
              ["Limited operational context", "Trends, sensor health and activity history"],
              ["Compliance claims can be overstated", "Careful support for compliance programs and due diligence"]
            ].map(([left, right]) => (
              <div key={left} className="grid border-t border-slate-200 md:grid-cols-2">
                <p className="p-5 text-slate-600">{left}</p>
                <p className="border-t border-slate-200 p-5 font-bold md:border-l md:border-t-0">{right}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="container grid gap-8 lg:grid-cols-3">
          {[
            ["Healthcare scenario", "Monitoring construction boundaries near occupied clinical areas with escalation-ready alerts."],
            ["Infrastructure scenario", "Coordinating devices across work fronts, public interfaces and sensitive receptors."],
            ["Commercial scenario", "Supporting facility teams during refurbishments inside occupied buildings."]
          ].map(([title, body]) => (
            <Reveal key={title}>
              <article className="card h-full p-6">
                <CpuChipIcon className="h-8 w-8 text-[var(--brand)]" />
                <h2 className="mt-6 text-2xl font-black">{title}</h2>
                <p className="mt-4 leading-7 text-slate-600">{body}</p>
                <Link className="mt-6 inline-flex font-black text-[var(--brand)]" href="/case-studies">
                  View scenario
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-8 lg:grid-cols-3">
          {[
            ["Project Director", "VerifAir gives our team a shared view of site conditions while decisions still matter."],
            ["Hospital Infrastructure Lead", "The monitoring records help align construction, facilities and clinical stakeholders."],
            ["Environmental Manager", "The value is not only the reading. It is the alert history, context and trend data."]
          ].map(([role, quote]) => (
            <blockquote key={role} className="border-l-4 border-[var(--brand)] pl-6">
              <p className="text-2xl font-black leading-tight">"{quote}"</p>
              <footer className="mt-5 text-sm font-bold uppercase text-slate-500">{role} | illustrative testimonial for approval</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <FAQSection />
      <FinalCTA />
    </>
  );
}
