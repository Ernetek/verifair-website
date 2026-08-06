import Image from "next/image";

import { Reveal } from "./Reveal";

const observations = [
  {
    number: "01",
    title: "Work conditions do not remain static.",
    body: "Cutting, demolition, cleanup, access changes and temporary controls can alter particulate conditions during the shift—not only when a scheduled inspection occurs.",
  },
  {
    number: "02",
    title: "The people who need context are often in different places.",
    body: "Site teams, facility representatives and project leaders may each see only part of the situation. Without a shared view, readings, location and work activity can become disconnected.",
  },
  {
    number: "03",
    title: "A response needs more than a number.",
    body: "Teams need to know where the change occurred, when it began, who acknowledged it, what action was taken and whether conditions returned to the configured range.",
  },
];

export function ProblemSection() {
  return (
    <section
      id="problem"
      className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="container grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
            The operational challenge
          </p>

          <h2 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
            You can’t respond to what you can’t see.
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Active work can change particulate conditions between inspections
            and before there is an obvious visual warning. Teams need a shared
            view of where the change occurred, when it began and what action
            followed.
          </p>

          <ol className="mt-9 border-y border-slate-200">
            {observations.map((item) => (
              <li
                key={item.number}
                className="grid gap-3 border-b border-slate-200 py-6 last:border-b-0 sm:grid-cols-[3.25rem_1fr]"
              >
                <span className="font-mono text-sm font-bold text-blue-600">
                  {item.number}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-base leading-7 text-slate-600">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.08}>
          <figure>
            <div className="overflow-hidden border border-slate-200 bg-slate-50">
              <Image
                src="/assets/problem-active-dust.webp"
                alt="Active dusty work illustrating changing particulate conditions at a work interface"
                width={1200}
                height={1200}
                className="h-auto w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm leading-6 text-slate-500">
              Active work can change particulate conditions over time. Monitoring
              locations and response settings are configured for the project
              context.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
