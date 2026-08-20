import Image from "next/image";
import Link from "next/link";

const industries = [
  {
    title: "Healthcare",
    href: "/healthcare",
    image: "/assets/industry-healthcare-environment.webp",
    imageAlt: "Construction work continuing beside an occupied hospital corridor",
    copy: "Refurbishment beside live clinical environments.",
  },
  {
    title: "Construction",
    href: "/construction",
    image: "/assets/industry-construction-environment.webp",
    imageAlt: "Active construction work front on a project site",
    copy: "Site-wide visibility across work fronts and boundaries.",
  },
  {
    title: "Infrastructure",
    href: "/infrastructure",
    image: "/assets/industry-infrastructure-environment.webp",
    imageAlt: "Infrastructure and civil works construction environment",
    copy: "Visibility across public works and civil projects.",
  },
  {
    title: "Government",
    href: "/government",
    image: "/assets/industry-government-environment.webp",
    imageAlt: "Government or public-sector project environment",
    copy: "Environmental visibility for public-sector projects.",
  },
  {
    title: "Schools",
    href: "/schools",
    image: "/assets/industry-education-environment.webp",
    imageAlt: "Students walking through an occupied school corridor beside external works",
    copy: "Construction beside occupied schools and campuses.",
  },
  {
    title: "Commercial Buildings",
    href: "/commercial-buildings",
    image: "/assets/industry-commercial-environment.webp",
    imageAlt: "Commercial building refurbishment continuing beside an occupied office area",
    copy: "Refurbishment while facilities remain operational.",
  },
] as const;

export function IndustriesSection() {
  return (
    <section
      id="industries"
      className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="container">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
          Industries
        </p>
        <h2 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
          Built for construction where normal operations continue.
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          Monitoring locations and workflows are configured for each project.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <article key={industry.title} className="grid overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <Image
                  src={industry.image}
                  alt={industry.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  quality={92}
                  className="object-cover"
                />
              </div>
              <div className="grid gap-2 p-5">
                <h3 className="text-lg font-black leading-tight tracking-tight text-slate-950">{industry.title}</h3>
                <p className="text-sm leading-6 text-slate-600">{industry.copy}</p>
                <Link href={industry.href} className="mt-1 inline-flex min-h-10 items-center font-bold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                  Explore {industry.title} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
