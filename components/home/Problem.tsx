import Image from "next/image";

import { Reveal } from "./Reveal";

const observations = [
  {
    number: "01",
    title: "The change can begin before it is obvious.",
    body: "Fine particulate conditions may shift while work still appears visually unchanged, particularly around enclosed, occupied or sensitive interfaces.",
  },
  {
    number: "02",
    title: "Isolated checks provide only isolated moments.",
    body: "Periodic observations can miss changing conditions between inspections and make it harder to reconstruct what happened later.",
  },
  {
    number: "03",
    title: "A useful response depends on shared context.",
    body: "Teams need current readings, location, timing and response ownership together so they can review a change and act consistently.",
  },
];

export function ProblemSection() {
  return (
    <section id="problem" className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
      <div className="container grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
            The operational challenge
          </p>
          <h2 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
            Particulate conditions can change before the change becomes visible.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            VerifAir is designed to help project teams see changing particulate
            conditions earlier and coordinate a documented response without
            relying only on intermittent manual checks.
          </p>

          <ol className="mt-9 border-y border-slate-200">
            {observations.map((item) => (
              <li key={item.number} className="grid gap-3 border-b border-slate-200 py-6 last:border-b-0 sm:grid-cols-[3.25rem_1fr]">
                <span className="font-mono text-sm font-bold text-blue-600">{item.number}</span>
                <div>
                  <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-base leading-7 text-slate-600">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.08}>
          <figure>
            <div className="overflow-hidden border border-slate-200 bg-slate-50">
              <Image
                src="/assets/problem-dust-monitoring.png"
                alt="Particulate monitoring equipment shown in a project environment"
                width={1200}
                height={1200}
                className="h-auto w-full object-contain"
              />
            </div>
            <figcaption className="mt-3 text-sm leading-6 text-slate-500">
              Monitoring context shown for illustration. Site layout and device
              placement are configured for each project.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
