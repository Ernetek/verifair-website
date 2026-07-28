import type { Metadata } from "next";
import Link from "next/link";
import { ContentSections, FAQSection, FinalCTA, PageHero } from "@/components/page-sections";
import { pageContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Resources",
  description: "Guides and explainers about real-time particulate monitoring, hospital construction dust and VerifAir technology.",
  alternates: { canonical: "/resources" }
};

export default function ResourcesPage() {
  const page = pageContent.resources;

  return (
    <>
      <PageHero page={page} />
      <ContentSections page={page} />
      <section className="section band">
        <div className="container">
          <h2 className="h2 font-black">Resource library</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Hospital construction dust monitoring guide", "/resources/hospital-construction-dust-monitoring"],
              ["PM1, PM2.5 and PM10 explainer", "/resources/pm-particle-size-guide"],
              ["Multi-zone monitoring checklist", "/resources/multi-zone-monitoring-checklist"]
            ].map(([title, href]) => (
              <Link key={href} href={href} className="card p-6 font-black transition hover:-translate-y-1 hover:shadow-xl">
                {title}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <FAQSection />
      <FinalCTA />
    </>
  );
}
