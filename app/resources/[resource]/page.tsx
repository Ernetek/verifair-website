import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getResource, verifAirResources } from "@/lib/resources";

type Params = Promise<{ resource: string }>;

export function generateStaticParams() {
  return verifAirResources.map(({ slug }) => ({ resource: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { resource } = await params;
  const page = getResource(resource);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.summary,
    alternates: { canonical: `/resources/${page.slug}` },
  };
}

export default async function ResourcePage({
  params,
}: {
  params: Params;
}) {
  const { resource } = await params;
  const page = getResource(resource);

  if (!page) {
    notFound();
  }

  return (
    <>
      <section className="border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
        <div className="container max-w-4xl">
          <Link
            className="inline-flex min-h-11 items-center font-bold text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
            href="/resources"
          >
            Back to resources
          </Link>
          <p className="mt-8 text-sm font-bold uppercase tracking-wide text-blue-600">
            {page.category}
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            {page.title}
          </h1>
          <div className="mt-5 h-0.5 w-12 bg-blue-600" />
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">{page.intro}</p>
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
            <Image
              src={page.image}
              alt={page.imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 56rem, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="container max-w-4xl">
          <div className="grid gap-5">
            {page.sections.map((section) => (
              <article
                key={section.title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
                  {section.title}
                </h2>
                <div className="mt-4 grid gap-4">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-base leading-7 text-slate-700 sm:text-lg">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.points ? (
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {section.points.map((point) => (
                      <li key={point} className="flex gap-3 leading-7 text-slate-700">
                        <span className="mt-2.5 size-2 shrink-0 rounded-full bg-blue-600" />
                        {point}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
