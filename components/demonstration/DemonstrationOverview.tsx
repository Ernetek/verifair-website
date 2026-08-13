import Image from "next/image";
import Link from "next/link";

const demonstrations = [
  {
    href: "/demonstration/monitoring-room",
    image: "/assets/demonstration-monitoring-room-dashboard.png",
    alt: "VerifAir monitoring-room dashboard showing proportionate green, amber and red monitoring zones",
    label: "Live visibility",
    title: "Monitoring room",
    description: "See every zone together on a high-visibility traffic-light display designed for a wall-mounted screen.",
    action: "Open monitoring-room demo",
  },
  {
    href: "/demonstration/workflow",
    image: "/assets/workflow-site-investigation.png",
    alt: "Simulated worker checking local controls during a guided VerifAir workflow",
    label: "Guided response",
    title: "Alert-to-evidence workflow",
    description: "Start the scenario, choose the appropriate response at each highlighted stage and see the controlled record develop.",
    action: "Start guided workflow",
  },
  {
    href: "/demonstration/evidence-reporting",
    image: "/assets/workflow-evidence-review.png",
    alt: "Simulated project team reviewing a monitoring evidence report",
    label: "Controlled records",
    title: "Evidence reporting",
    description: "Explore operational snapshots, trends, alert history, response notes and evidence-ready reporting outputs.",
    action: "Open evidence-reporting demo",
  },
] as const;

export function DemonstrationOverview() {
  return (
    <section aria-labelledby="demonstration-overview-title" className="bg-slate-100 py-10 sm:py-14">
      <div className="container">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Choose a demonstration</p>
        <h1 id="demonstration-overview-title" className="mt-3 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
          Explore the complete VerifAir response system
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Each demonstration has one clear purpose. Compare the three views below, then open the detailed experience you want to explore.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {demonstrations.map((item) => (
            <article key={item.href} className="grid overflow-hidden border border-slate-300 bg-white shadow-lg">
              <div className="relative aspect-[3/2] overflow-hidden bg-slate-200">
                <Image src={item.image} alt={item.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
              </div>
              <div className="grid p-5">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">{item.label}</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                <Link href={item.href} className="mt-5 inline-flex min-h-12 items-center justify-center self-end bg-blue-700 px-5 font-black text-white hover:bg-blue-800">
                  {item.action} →
                </Link>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-5 text-xs font-semibold text-slate-500">All scenes, readings and records are simulated demonstration material.</p>
      </div>
    </section>
  );
}
