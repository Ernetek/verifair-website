import Image from "next/image";
import Link from "next/link";

import { Reveal } from "./Reveal";

const industries = [
  {
    title: "Healthcare",
    description:
      "Controlled refurbishment and construction beside occupied clinical corridors and sensitive healthcare areas.",
    image: "/assets/industry-healthcare-environment.webp",
    imageAlt:
      "Hospital refurbishment work beside an occupied clinical corridor",
    href: "/healthcare",
  },
  {
    title: "Construction",
    description:
      "Active cutting, drilling, demolition and concrete work where dust controls, PPE and timely visibility matter.",
    image: "/assets/industry-construction-environment.webp",
    imageAlt:
      "Construction workers carrying out dust-producing concrete work with controls and PPE",
    href: "/construction",
  },
  {
    title: "Infrastructure",
    description:
      "Tunnel, road, rail and major civil works with changing work fronts, public interfaces and sensitive receptors.",
    image: "/assets/industry-infrastructure-environment.webp",
    imageAlt:
      "Major civil infrastructure works in an active construction environment",
    href: "/infrastructure",
  },
  {
    title: "Government",
    description:
      "Refurbishment and construction within occupied public assets and government-managed facilities.",
    image: "/assets/industry-government-environment.webp",
    imageAlt:
      "Refurbishment work within an occupied public building",
    href: "/government",
  },
  {
    title: "Education",
    description:
      "Occupied schools and education facilities located beside active construction or refurbishment work.",
    image: "/assets/industry-education-environment.webp",
    imageAlt:
      "Occupied education facility beside active construction work",
    href: "/schools",
  },
  {
    title: "Commercial buildings",
    description:
      "Office and facility refurbishment continuing beside occupied operations and shared access areas.",
    image: "/assets/industry-commercial-environment.webp",
    imageAlt:
      "Commercial building refurbishment beside occupied operations",
    href: "/commercial-buildings",
  },
];

export function IndustriesSection() {
  return (
    <section
      id="industries"
      className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20 lg:py-24"
      aria-labelledby="industries-heading"
    >
      <div className="container">
        <Reveal>
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Industries
            </p>
            <h2
              id="industries-heading"
              className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.45rem]"
            >
              Monitoring for complex and dust-sensitive environments.
            </h2>
            <div className="mt-5 h-0.5 w-12 bg-blue-600" />
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              These are representative operating environments, not claims of
              existing customer deployments.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, index) => (
            <Reveal key={industry.title} delay={index * 0.05}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                  <Image
                    src={industry.image}
                    alt={industry.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                  <span className="absolute bottom-4 left-4 rounded-full border border-white/25 bg-slate-950/65 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-white backdrop-blur-sm">
                    {industry.title}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <p className="flex-1 text-base leading-7 text-slate-600">
                    {industry.description}
                  </p>
                  <Link
                    href={industry.href}
                    className="mt-6 inline-flex min-h-11 w-fit items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
                  >
                    Explore industry
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
