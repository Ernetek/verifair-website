import Image from "next/image";
import { EyeSlashIcon, MapPinIcon, UserGroupIcon } from "@heroicons/react/24/outline";

import { Reveal } from "./Reveal";

const problemCards = [
  {
    title: "NOT ALWAYS VISIBLE",
    body: "Particulate conditions can change without an obvious visual indication.",
    icon: EyeSlashIcon,
    tone: "border-red-200 bg-red-50/70 text-red-900",
    iconTone: "border-red-200 bg-white/70 text-red-700",
  },
  {
    title: "MULTIPLE LOCATIONS",
    body: "Conditions may differ between work areas, boundaries and nearby occupied environments.",
    icon: MapPinIcon,
    tone: "border-amber-200 bg-amber-50/70 text-amber-950",
    iconTone: "border-amber-200 bg-white/70 text-amber-700",
  },
  {
    title: "SHARED RESPONSE",
    body: "Project teams need a shared view to recognise changing conditions and coordinate what happens next.",
    icon: UserGroupIcon,
    tone: "border-emerald-200 bg-emerald-50/70 text-emerald-950",
    iconTone: "border-emerald-200 bg-white/70 text-emerald-700",
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
            Changing particulate conditions aren&apos;t always obvious.
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
          </figure>
        </Reveal>

        <Reveal className="lg:col-start-2 lg:row-start-2">
          <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Project teams need a shared operational view of changing particulate conditions across every monitoring location. Bringing
            readings, trends, operational state and response activity together gives site, environmental and project leaders the same
            context at the same time—so changes are easier to recognise, responsibility is clearer and the next response can be
            coordinated across the project.
          </p>
        </Reveal>

        <div className="grid gap-4 lg:col-span-2 lg:grid-cols-3">
          {problemCards.map((item) => {
            const Icon = item.icon;
            return (
            <article
              key={item.title}
              className={`border p-5 shadow-sm ${item.tone}`}
            >
              <span className={`grid size-9 place-items-center border ${item.iconTone}`}>
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-black leading-tight sm:text-lg">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {item.body}
              </p>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
