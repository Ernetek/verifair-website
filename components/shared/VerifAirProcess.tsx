import Image from "next/image";
import Link from "next/link";

const processCards = [
  {
    title: "ASSESS",
    heading: "Understand conditions across sites and zones.",
    body: "Centralised real-time visibility helps teams assess particulate conditions, trends and configured operational triggers.",
    image: "/assets/dust-monitoring-display-hub.webp",
    imageAlt: "VerifAir monitoring hub showing particulate conditions across multiple zones",
    href: "/demonstration#monitoring",
    action: "Explore monitoring",
  },
  {
    title: "ACT",
    heading: "Turn changing conditions into coordinated action.",
    body: "Alert the right people, acknowledge events, assign responsibility, investigate, record actions, escalate where required and manage incidents through to resolution.",
    image: "/assets/workflow-site-investigation.webp",
    imageAlt: "Project team member investigating a particulate monitoring event",
    href: "/demonstration#incident",
    action: "See response workflow",
  },
  {
    title: "REPORT",
    heading: "Create the operational record.",
    body: "VerifAir brings together monitoring data, alerts, acknowledgements, actions, comments and incident history to generate evidence and reporting.",
    image: "/assets/reports-evidence-review.webp",
    imageAlt: "Project team reviewing a VerifAir evidence and reporting view",
    href: "/demonstration#reportpreview",
    action: "Explore records",
  },
] as const;

export function VerifAirProcessContent() {
  return (
    <>
      <p className="text-sm font-bold uppercase tracking-wide text-blue-600">THE VERIFAIR PROCESS</p>
      <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
        ASSESS. ACT. REPORT.
      </h2>
      <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
        VerifAir connects real-time monitoring with operational response and a durable record of what happened.
      </p>

      <div className="mt-8 grid items-stretch gap-5 lg:grid-cols-3">
        {processCards.map((card) => (
          <article key={card.title} className="grid grid-rows-[auto_1fr] overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
            <div className="relative aspect-[3/2] overflow-hidden bg-slate-200">
              <Image
                src={card.image}
                alt={card.imageAlt}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-contain"
              />
            </div>
            <div className="grid grid-rows-[auto_minmax(3.5rem,auto)_1fr_auto] gap-2 p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">{card.title}</p>
              <h3 className="text-xl font-black leading-tight text-slate-950">{card.heading}</h3>
              <p className="text-sm leading-6 text-slate-600">{card.body}</p>
              <Link href={card.href} className="mt-1 inline-flex min-h-10 items-center font-bold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                {card.action} →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export function VerifAirProcessSection() {
  return (
    <section id="verifair-process" className="scroll-mt-24 border-b border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24" aria-label="The VerifAir process">
      <div className="container">
        <VerifAirProcessContent />
      </div>
    </section>
  );
}
