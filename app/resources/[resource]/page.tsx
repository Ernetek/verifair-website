import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const resources = {
  "hospital-construction-dust-monitoring": {
    title: "Hospital Construction Dust Monitoring Guide",
    description: "A practical guide for monitoring airborne particulates near occupied healthcare environments.",
    body: [
      "Hospital construction can involve refurbishment, demolition, drilling, traffic changes and temporary barriers close to occupied clinical spaces.",
      "A monitoring plan should define sensitive receptors, construction boundaries, device locations, thresholds, escalation owners and reporting expectations before work starts.",
      "VerifAir supports visibility by coordinating Dustlight devices across zones and turning particulate readings into alerts, dashboards and records.",
      "Monitoring should be designed alongside infection-control, facility, contractor and environmental management procedures."
    ]
  },
  "pm-particle-size-guide": {
    title: "PM1, PM2.5 and PM10 Explainer",
    description: "Plain-language guide to particulate monitoring terms used in construction dust programs.",
    body: [
      "PM1, PM2.5 and PM10 refer to particles by aerodynamic diameter. Smaller particles can remain suspended and may move beyond the visible dust source.",
      "PM10 is often associated with coarser dust. PM2.5 and PM1 are smaller fractions that can be harder to observe visually.",
      "VerifAir focuses on converting these readings into operational context, alerts, trends and reporting rather than treating each number as a complete decision by itself."
    ]
  },
  "multi-zone-monitoring-checklist": {
    title: "Multi-zone Monitoring Checklist",
    description: "Checklist for planning Dustlight and VerifAir deployments across sensitive project zones.",
    body: [
      "Define the monitoring objective and the decisions the data should support.",
      "Identify sensitive receptors, occupied interfaces, work fronts, access routes and likely dust sources.",
      "Plan device placement, gateway coverage, threshold settings, response owners, reporting cadence and review procedures.",
      "Confirm that monitoring complements site-specific risk assessments, engineering controls, administrative controls and professional advice."
    ]
  }
};

type Params = Promise<{ resource: string }>;

export function generateStaticParams() {
  return Object.keys(resources).map((resource) => ({ resource }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { resource } = await params;
  const page = resources[resource as keyof typeof resources];
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/resources/${resource}` }
  };
}

export default async function ResourcePage({ params }: { params: Params }) {
  const { resource } = await params;
  const page = resources[resource as keyof typeof resources];
  if (!page) notFound();

  return (
    <section className="section">
      <div className="container max-w-4xl">
        <Link className="text-sm font-black text-[var(--brand)]" href="/resources">
          Back to resources
        </Link>
        <h1 className="h1 mt-5 font-black">{page.title}</h1>
        <p className="lead mt-6">{page.description}</p>
        <div className="mt-10 grid gap-5">
          {page.body.map((paragraph) => (
            <p key={paragraph} className="border-t border-slate-200 pt-5 leading-8 text-slate-700">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
