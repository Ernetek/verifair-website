import {
  BuildingOffice2Icon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  DocumentTextIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

import { Reveal } from "./Reveal";

const risks = [
  { icon: EyeSlashIcon, label: "Invisible airborne particulates" },
  { icon: ShieldCheckIcon, label: "Respirable dust exposure risks" },
  { icon: BuildingOffice2Icon, label: "Occupied and sensitive environments" },
  { icon: ClockIcon, label: "Delayed awareness of changing conditions" },
  { icon: ClipboardDocumentCheckIcon, label: "Manual monitoring gaps" },
  { icon: DocumentTextIcon, label: "Records needed for due diligence" },
];

export function ProblemSection() {
  return (
    <section className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
      <div className="container">
        <div className="grid items-start gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-12">
          <div className="flex flex-col">
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
                The problem
              </p>
              <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.45rem]">
                Fine particulate conditions can change before teams can see the risk.
              </h2>
              <div className="mt-5 h-0.5 w-12 bg-blue-600" />
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Construction, demolition and refurbishment activities can generate elevated fine-particle levels that are difficult to detect visually. VerifAir helps teams see changing PM1 and PM2.5 conditions in near real time so they can investigate earlier and help minimise potential exposure risk. Where silica, asbestos or other hazardous materials may be present, project-specific assessment, specialist monitoring and appropriate controls remain essential.
              </p>
            </Reveal>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {risks.map(({ icon: Icon, label }) => (
                <Reveal key={label}>
                  <div className="flex min-h-20 items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold leading-5 text-slate-900">
                      {label}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>

          </div>

          <Reveal className="w-full lg:justify-self-end">
            <div className="mx-auto w-full max-w-[34rem] overflow-hidden rounded-2xl bg-slate-100 lg:mx-0 lg:max-w-[30rem] xl:max-w-[34rem]">
              <Image
                src="/assets/problem-active-dust.webp"
                alt="Construction worker controlling dust during active concrete cutting beside an occupied hospital corridor"
                width={1200}
                height={1200}
                sizes="(min-width: 1280px) 34rem, (min-width: 1024px) 30rem, 100vw"
                className="h-auto w-full object-contain"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
