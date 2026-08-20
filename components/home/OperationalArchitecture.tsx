import {
  ArrowRightIcon,
  BuildingOffice2Icon,
  DevicePhoneMobileIcon,
  EyeIcon,
  GlobeAltIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";

const monitoringHierarchy = [
  {
    label: "PROJECT",
    detail: "A construction, refurbishment or occupied-building project.",
    Icon: BuildingOffice2Icon,
  },
  {
    label: "ZONE",
    detail: "A work area, boundary or occupied interface within the project.",
    Icon: SignalIcon,
  },
  {
    label: "MONITORING LOCATION",
    detail: "A named Dustlight monitoring point with its own readings and history.",
    Icon: DevicePhoneMobileIcon,
  },
  {
    label: "SHARED VIEW",
    detail: "One operational view of every monitoring location for the project team.",
    Icon: EyeIcon,
  },
  {
    label: "PORTFOLIO",
    detail: "Add further projects when portfolio-wide visibility is needed.",
    Icon: GlobeAltIcon,
  },
] as const;

export function OperationalArchitectureSection() {
  return (
    <section
      className="border-b border-slate-200 bg-slate-50 py-12 sm:py-14"
      aria-labelledby="homepage-architecture-title"
    >
      <div className="container">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
          Monitoring locations
        </p>
        <h2
          id="homepage-architecture-title"
          className="mt-3 max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl"
        >
          Visibility across monitoring locations — from one project to a wider portfolio.
        </h2>

        <ol className="mt-8 grid gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-stretch">
          {monitoringHierarchy.map(({ label, detail, Icon }, index) => (
            <li key={label} className="contents">
              <div className="flex min-w-0 items-start gap-3 border border-slate-200 bg-white p-4 shadow-sm">
                <Icon className="mt-0.5 size-6 shrink-0 text-blue-700" aria-hidden="true" />
                <div className="min-w-0">
                  <h3 className="text-xs font-black leading-5 tracking-[0.08em] text-slate-950">
                    {label}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-600">{detail}</p>
                </div>
              </div>
              {index < monitoringHierarchy.length - 1 ? (
                <div className="flex items-center justify-center py-1 text-blue-700 lg:px-1 lg:py-0">
                  <ArrowRightIcon className="size-4 rotate-90 lg:rotate-0" aria-hidden="true" />
                </div>
              ) : null}
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <p className="inline-flex items-center gap-2 border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-blue-800">
            Primary: one project, multiple monitoring locations
          </p>
          <p className="inline-flex items-center gap-2 border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-600">
            Scaling capability: multiple projects / portfolio
          </p>
        </div>

        <p className="mt-5 max-w-4xl text-sm leading-6 text-slate-600">
          A single project with several monitoring locations is a complete VerifAir use case. The same platform scales up to a portfolio
          view when a team needs visibility across multiple projects.
        </p>
      </div>
    </section>
  );
}
