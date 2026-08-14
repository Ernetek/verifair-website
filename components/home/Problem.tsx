import Image from "next/image";

import { Reveal } from "./Reveal";

const problemCards = [
  {
    number: "01",
    title: "CONDITIONS AREN'T ALWAYS VISIBLE",
    body: "Respirable particulate can be invisible to the human eye. Conditions can change without an obvious visual warning.",
  },
  {
    number: "02",
    title: "WORK AND OCCUPANCY COEXIST",
    body: "Construction and refurbishment can generate airborne particulate while people continue working, receiving care, learning or moving nearby.",
  },
  {
    number: "03",
    title: "THE EVENT NEEDS A RECORD",
    body: "When conditions require attention, teams need a record of what was observed, who was notified, what action was taken and how the event was resolved.",
  },
];

export function ProblemSection() {
  return (
    <section
      id="problem"
      className="border-b border-slate-200 bg-white py-12 sm:py-14 lg:py-16"
    >
      <div className="container grid gap-9 lg:grid-cols-[1.02fr_0.98fr] lg:gap-x-14 lg:gap-y-8 lg:items-start">
        <Reveal className="lg:col-start-2 lg:row-start-1">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
            THE OPERATIONAL GAP
          </p>

          <h2 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
            Construction keeps moving. Occupied environments stay operational.
          </h2>
        </Reveal>

        <Reveal delay={0.08} className="lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <figure>
            <div className="h-64 overflow-hidden border border-slate-200 bg-slate-50 sm:h-72 lg:h-[25rem]">
              <Image
                src="/assets/problem-active-dust.webp"
                alt="Active dusty work beside a dust-sensitive occupied environment"
                width={1150}
                height={1200}
                quality={92}
                className="size-full object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm leading-6 text-slate-500">
              Active work can change particulate conditions between inspections.
              Monitoring locations and response arrangements are determined for
              the project context.
            </figcaption>
          </figure>
        </Reveal>

        <Reveal className="lg:col-start-2 lg:row-start-2">
          <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            When building or refurbishing in or near occupied areas, project teams
            need a shared operational view of changing particulate conditions,
            faster response coordination and a clear record of what happened next.
          </p>
        </Reveal>

        <div className="grid gap-4 lg:col-span-2 lg:grid-cols-3">
          {problemCards.map((item) => (
            <article
              key={item.number}
              className="border border-slate-200 bg-slate-50 p-6 shadow-sm"
            >
              <span className="font-mono text-sm font-bold text-blue-600">
                {item.number}
              </span>
              <h3 className="mt-5 text-lg font-black leading-tight tracking-tight text-slate-950">
                {item.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-600">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

