import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageDisclaimer } from "@/components/legal/PageDisclaimer";
import { getResource, verifAirResources } from "@/lib/resources";
import { siteConfig } from "@/lib/site";

type Params = Promise<{ resource: string }>;

export function generateStaticParams() {
  return verifAirResources.map(({ slug }) => ({ resource: slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { resource } = await params;
  const page = getResource(resource);
  if (!page) return {};
  return {
    title: page.title,
    description: page.summary,
    alternates: { canonical: `/resources/${page.slug}` },
  };
}

export default async function ResourcePage({ params }: { params: Params }) {
  const { resource } = await params;
  const page = getResource(resource);
  if (!page) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.summary,
    dateModified: page.updated ?? "2026-08-05",
    mainEntityOfPage: `${siteConfig.url}/resources/${page.slug}`,
    publisher: { "@type": "Organization", name: "VerifAir" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <article className="bg-white py-14 sm:py-20">
        <div className="container max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
            <Link href="/">Home</Link> <span aria-hidden="true">/</span>{" "}
            <Link href="/resources">Resources</Link> <span aria-hidden="true">/</span>{" "}
            <span aria-current="page">{page.title}</span>
          </nav>

          <header className="mt-10 border-b border-slate-200 pb-10">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">{page.category}</p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.06] tracking-tight text-slate-950 sm:text-5xl">{page.title}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">{page.intro}</p>
            <p className="mt-5 text-sm text-slate-500">
              Updated {page.updated ?? "5 August 2026"} · {page.readingMinutes ?? 5} min read
            </p>
          </header>

          <div className="space-y-12 py-12">
            {page.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-950">{section.title}</h2>
                <div className="mt-5 space-y-5">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-base leading-8 text-slate-700 sm:text-lg">{paragraph}</p>
                  ))}
                </div>
                {section.points ? (
                  <ul className="mt-6 border-y border-slate-200">
                    {section.points.map((point) => (
                      <li key={point} className="border-b border-slate-200 py-4 leading-7 text-slate-700 last:border-b-0">{point}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </article>
      <PageDisclaimer />
    </>
  );
}
