import Link from "next/link";

const pilotSteps = [
  {
    number: "01",
    title: "Project discussion",
    body: "Discuss the work, operating environment, project stage and the monitoring questions the team needs to answer.",
  },
  {
    number: "02",
    title: "Site and operational-context review",
    body: "Review work activities, sensitive areas, access constraints, likely monitoring locations and available connectivity.",
  },
  {
    number: "03",
    title: "Monitoring approach",
    body: "Define proposed monitoring points, alert responsibilities, dashboard needs and reporting requirements.",
  },
  {
    number: "04",
    title: "Demonstration or pilot deployment",
    body: "Use a carefully scoped demonstration or pilot to assess the proposed workflow in the intended operating context.",
  },
  {
    number: "05",
    title: "Review and refinement",
    body: "Review the monitoring information, operational feedback and technical limitations before refining the deployment approach.",
  },
];

export function PilotDeploymentSection() {
  return (
    <section
      className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="pilot-deployment-heading"
    >
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Launch-stage deployment
            </p>
            <h2
              id="pilot-deployment-heading"
              className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl"
            >
              Designed for structured pilot deployment
            </h2>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
              VerifAir is entering the market through carefully scoped project
              deployments. Each proposed site is reviewed for work activities,
              sensitive areas, monitoring locations, connectivity, alert
              responsibilities and reporting requirements before installation.
            </p>
            <Link
              href="/contact"
              className="mt-7 inline-flex min-h-12 items-center font-bold text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
            >
              Discuss a pilot project →
            </Link>
          </div>

          <ol className="border-y border-slate-200">
            {pilotSteps.map((step) => (
              <li
                key={step.number}
                className="grid gap-3 border-b border-slate-200 py-6 last:border-b-0 sm:grid-cols-[4rem_0.55fr_1fr] sm:items-start sm:gap-6"
              >
                <span className="font-mono text-sm font-bold text-blue-600">
                  {step.number}
                </span>
                <h3 className="text-lg font-bold text-slate-950">
                  {step.title}
                </h3>
                <p className="text-base leading-7 text-slate-600">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
