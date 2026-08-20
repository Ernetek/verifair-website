import { SharedDashboardPage } from "@/components/demonstration/ClinicalDashboards";
import { PRODUCT_FRAMEWORK } from "@/lib/product-model";

const stages = PRODUCT_FRAMEWORK;

const outcomes = [
  ["Earlier awareness", "See changing conditions closer to when they occur."],
  ["Shared operational context", "Connect location, timing and site response in one view."],
  ["Time-stamped event records", "Retain readings, acknowledgements and response notes."],
  ["Less dependence on isolated checks", "Supplement periodic inspection at selected locations."],
] as const;

export function CoordinatedSolutionSection() {
  return (
    <section
      id="platform"
      className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24"
    >
      <div className="container">
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
            How VerifAir works
          </p>
          <h2 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
            One shared view from changing conditions to documented closure.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
            The shared dashboard brings readings, project-specific workflow
            settings, event status and response records together so authorised
            users can review the same operational context.
          </p>
        </div>

        <div className="mt-10">
          <p className="sr-only" id="verifair-workflow-label">
            VerifAir product framework: Assess, Act and Record
          </p>
          <ol
            className="workflow-motion"
            aria-labelledby="verifair-workflow-label"
          >
            {stages.map((stage, index) => (
              <li key={stage.id} className="workflow-motion__item">
                <div className="workflow-motion__node" aria-hidden="true">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>

                <div className="workflow-motion__copy">
                  <p className="workflow-motion__title">{stage.title}</p>
                  <p>{stage.description}</p>
                </div>

                {index < stages.length - 1 ? (
                  <span
                    className="workflow-motion__connector"
                    aria-hidden="true"
                  >
                    <span className="workflow-motion__track" />
                    <span
                      className="workflow-motion__pulse"
                      style={{ animationDelay: `${index * 0.22}s` }}
                    />
                    <span className="workflow-motion__arrow" />
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 min-w-0">
          <SharedDashboardPage />
        </div>

        <dl className="mt-12 grid border-y border-slate-300 sm:grid-cols-2 xl:grid-cols-4">
          {outcomes.map(([title, body]) => (
            <div
              key={title}
              className="border-b border-slate-300 py-6 sm:border-r sm:px-6 xl:border-b-0 last:border-r-0"
            >
              <dt className="font-bold text-slate-950">{title}</dt>
              <dd className="mt-2 text-sm leading-6 text-slate-600">{body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
