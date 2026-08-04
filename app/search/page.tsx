import type { Metadata } from "next";
import Link from "next/link";
import { pageContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Search",
  description: "Search VerifAir public website pages and resources.",
  alternates: { canonical: "/search" }
};

export default function SearchPage() {
  const pages = Object.values(pageContent);

  return (
    <section className="section">
      <div className="container">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-600">Search</p>
        <h1 className="h1 mt-4 font-black">Find VerifAir information.</h1>
        <p className="lead mt-6 max-w-3xl">Browse public website pages. A hosted search provider can be connected after launch if analytics show search demand.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {pages.map((page) => (
            <Link key={page.slug} href={`/${page.slug}`} className="card p-6 transition hover:-translate-y-1 hover:shadow-xl">
              <h2 className="text-lg font-bold text-slate-950">{page.title}</h2>
              <p className="mt-3 text-base leading-7 text-slate-600">{page.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
