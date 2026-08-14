import Link from "next/link";

const deploymentSteps = [
  {
    number: "01",
    title: "Review project requirements",
    body: "Review the work, operating environment, project stage and the monitoring questions the team needs to answer.",
  },
  {
    number: "02",
    title: "Define sites and zones",
    body: "Define the sites, work areas, occupied interfaces and monitoring zones that require an operational view.",
  },
  {
    number: "03",
    title: "Configure monitoring locations and operational triggers",
    body: "Configure monitoring locations, alert responsibilities, operational triggers and reporting requirements for the project.",
  },
  {
    number: "04",
    title: "Deploy Dustlight monitors and VerifAir Edge",
    body: "Deploy the monitoring equipment, Edge infrastructure and supporting connectivity across the defined sites and zones.",
  },
  {
    number: "05",
    title: "Verify communications and system health",
    body: "Verify communications, gateway health, monitor state and current observations before operational use.",
  },
  {
    number: "06",
    title: "Begin operational monitoring",
    body: "Begin monitoring conditions, configured triggers, response activity and the evidence record for the project.",
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
              DEPLOYMENT
            </p>
            <h2
              id="pilot-deployment-heading"
              className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl"
            >
              Designed for practical project deployment.
            </h2>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
              VerifAir deployments are configured around the project, its sites and
              zones, operational triggers, communications path and system-health
              requirements. A pilot deployment may be available as an engagement
              option where a team wants to assess the approach in context.
            </p>
            <Link
              href="/contact"
              className="mt-7 inline-flex min-h-12 items-center font-bold text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
            >
              Discuss your deployment →
            </Link>
          </div>

          <ol className="border-y border-slate-200">
            {deploymentSteps.map((step) => (
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
