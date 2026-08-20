import Link from "next/link";
import {
  ArrowPathIcon,
  CloudIcon,
  ComputerDesktopIcon,
  CpuChipIcon,
  LifebuoyIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";

const capabilities = [
  {
    title: "EDGE COMPUTING & LOCAL INTELLIGENCE",
    body: "Local processing supporting the monitoring service.",
    Icon: CpuChipIcon,
  },
  {
    title: "INDEPENDENT CONNECTIVITY",
    body: "Telstra primary with Optus secondary connectivity.",
    Icon: SignalIcon,
  },
  {
    title: "REMOTE MANAGEMENT",
    body: "Remote software, configuration and support capability.",
    Icon: LifebuoyIcon,
  },
  {
    title: "RESILIENT OPERATION",
    body: "Automatic recovery and retention through connection interruptions.",
    Icon: ArrowPathIcon,
  },
  {
    title: "PRACTICAL DEPLOYMENT",
    body: "Easy to scale and move as project requirements change.",
    Icon: CloudIcon,
  },
  {
    title: "AUTHORISED ACCESS",
    body: "Shared browser-based visibility from authorised devices.",
    Icon: ComputerDesktopIcon,
  },
] as const;

export function PilotDeploymentSection() {
  return (
    <section
      className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="pilot-deployment-heading"
    >
      <div className="container">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
          CAPABILITIES &amp; DEPLOYMENT
        </p>
        <h2
          id="pilot-deployment-heading"
          className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl"
        >
          Designed around the project, not the other way around.
        </h2>
        <div className="mt-5 h-0.5 w-12 bg-blue-600" />
        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
          VerifAir deployments are configured around the project, its sites and zones, operational triggers and communications path. A
          pilot deployment may be available as an engagement option where a team wants to assess the approach in context.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 border-y border-slate-200 py-6 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(({ title, body, Icon }) => (
            <article key={title}>
              <Icon className="h-6 w-6 text-blue-700" aria-hidden="true" />
              <h3 className="mt-3 text-xs font-black leading-5 tracking-[0.08em] text-slate-950 sm:text-sm">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
            </article>
          ))}
        </div>

        <Link
          href="/contact"
          className="mt-7 inline-flex min-h-12 items-center font-bold text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
        >
          Discuss your deployment →
        </Link>
      </div>
    </section>
  );
}
