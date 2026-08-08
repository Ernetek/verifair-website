import Image from "next/image";

import { Reveal } from "./Reveal";

const observations = [
  {
    number: "01",
    title: "Conditions can change between inspections.",
    body: "Cutting, drilling, demolition, cleanup, access changes and temporary controls can create short-duration changes that a scheduled inspection may miss.",
  },
  {
    number: "02",
    title: "Hazards require material-specific controls.",
    body: "Respirable crystalline silica and asbestos fibres require competent assessment, appropriate controls and specialist methods that match the material and work activity.",
  },
  {
    number: "03",
    title: "The response needs a shared record.",
    body: "Location, timing, readings, notifications and practical actions should be reviewed together so teams can understand what happened next.",
  },
];

export function ProblemSection() {
  return (
    <section
      id="problem"
      className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="container grid gap-9 lg:grid-cols-[1.02fr_0.98fr] lg:gap-x-14 lg:gap-y-8 lg:items-start">
        <Reveal className="lg:col-start-1 lg:row-start-1">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
            The operational site challenge
          </p>

          <h2 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
            You can’t respond to what you can’t see.
          </h2>
        </Reveal>

        <Reveal delay={0.08} className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <figure>
            <div className="overflow-hidden border border-slate-200 bg-slate-50">
              <Image
                src="/assets/problem-active-dust.webp"
                alt="Active dusty work beside a dust-sensitive occupied environment"
                width={1150}
                height={1200}
                quality={92}
                className="h-auto w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm leading-6 text-slate-500">
              Active work can change particulate conditions between inspections.
              Monitoring locations and response arrangements are determined for
              the project context.
            </figcaption>
          </figure>
        </Reveal>

        <Reveal className="lg:col-start-1 lg:row-start-2">
          <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Active work can change particulate conditions between inspections and
            before there is an obvious visual warning. Some activities can
            generate hazardous respirable dust, including respirable crystalline
            silica, while disturbance of asbestos-containing material can release
            asbestos fibres. Teams need timely visibility, material-specific risk
            controls and a clear record of what happened next.
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
      </div>
    </section>
  );
}

