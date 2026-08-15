import Image from "next/image";
import Link from "next/link";

const applications = [
  {
    title: "HEALTHCARE CONSTRUCTION",
    href: "/healthcare",
    image: "/assets/healthcare_constructiom.webp",
    imageAlt: "Construction worker near an occupied healthcare environment",
    imagePosition: "55% center",
    copy: "Construction and refurbishment inside or adjacent to operating healthcare facilities.",
  },
  {
    title: "EDUCATION CONSTRUCTION",
    href: "/schools",
    image: "/assets/industry-education-environment.webp",
    imageAlt: "Students walking through an occupied school corridor beside external works",
    imagePosition: "center 38%",
    copy: "Construction and refurbishment around occupied schools and campuses.",
  },
  {
    title: "OCCUPIED BUILDINGS",
    href: "/commercial-buildings",
    image: "/assets/industry-commercial-environment.webp",
    imageAlt: "Commercial building refurbishment continuing beside an occupied office area",
    imagePosition: "center center",
    copy: "Refurbishment, remediation and staged works while facilities remain operational.",
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
          Applications
        </p>
        <h2 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
          Built for construction where normal operations continue.
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          Monitoring locations and workflows are configured for each project.
        </p>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {applications.map((application) => (
            <article key={application.title} className="grid overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                <Image
                  src={application.image}
                  alt={application.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  quality={95}
                  style={{ objectPosition: application.imagePosition }}
                  className="object-cover"
                />
              </div>
              <div className="grid gap-3 p-6">
                <h3 className="text-xl font-black leading-tight tracking-tight text-slate-950">{application.title}</h3>
                <p className="text-base leading-7 text-slate-600">{application.copy}</p>
                <Link href={application.href} className="mt-2 inline-flex min-h-11 items-center font-bold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                  Explore application →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <Link href="/applications" className="mt-6 inline-flex text-sm font-bold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
          Other construction applications →
        </Link>
      </div>
    </section>
  );
}
