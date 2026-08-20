import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import ContactForm from "@/components/contact/VerifAirContactForm";
import { AboutPage } from "@/components/about/AboutPage";
import { PageDisclaimer } from "@/components/legal/PageDisclaimer";
import {
  ContentSections,
  FinalCTA,
  PageHero,
} from "@/components/page-sections";
import { pageContent } from "@/lib/content";
import { SALES_EMAIL, siteConfig } from "@/lib/site";

const legalPages = {
  privacy: {
    title: "Privacy Policy",
    description:
      "How VerifAir handles personal information submitted through the public website.",
    body: [
      "VerifAir collects information submitted through enquiry, demonstration and newsletter forms so the team can respond to sales, support and project questions.",
      "Personal information may include name, company, role, email address, phone number, industry, project location, preferred contact method and message content.",
      "Website analytics, security logging and Cloudflare services may process technical information such as IP address, browser details, device information and page interactions.",
      "VerifAir does not sell personal information. CRM and analytics integrations should be activated only after privacy review and appropriate consent configuration.",
      `To request access, correction or deletion of information submitted through this website, contact ${SALES_EMAIL}.`,
    ],
  },

  terms: {
    title: "Terms",
    description:
      "Terms of use for the VerifAir public marketing website.",
    body: [
      "This website provides general information about VerifAir, Dustlight-enabled monitoring and environmental intelligence for dust-sensitive environments.",
      "Website content is not professional occupational hygiene, legal, medical, engineering or infection-control advice.",
      "VerifAir supports monitoring, reporting and informed decision-making but does not guarantee compliance, eliminate exposure risk or replace site-specific professional controls.",
      "Dashboard illustrations and readings on this public website are demonstration data unless expressly identified otherwise.",
      "Product availability, implementation scope and integrations are subject to project assessment and commercial agreement.",
    ],
  },

  cookies: {
    title: "Cookies",
    description:
      "Cookie and tracking technology information for the VerifAir public website.",
    body: [
      "The VerifAir website may use essential cookies for security, forms and basic site operation.",
      "Cloudflare services may use cookies or similar technologies for security, bot protection, Turnstile verification, analytics and performance.",
      "Marketing analytics tools such as GA4, LinkedIn Insight Tag, Microsoft Clarity, Meta Pixel or CRM tracking should be enabled only after consent, privacy and performance review.",
      "Visitors can manage cookies through browser settings. Some security and form features may not work correctly if essential cookies are blocked.",
    ],
  },
};

type Params = Promise<{
  slug: string;
}>;

export function generateStaticParams() {
  return [
    ...Object.keys(pageContent).filter(
      (slug) => !["resources", "technology", "reporting", "reports"].includes(slug),
    ),
    ...Object.keys(legalPages),
  ].map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;

  const page =
    pageContent[slug] ??
    legalPages[slug as keyof typeof legalPages];

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,

    alternates: {
      canonical: `/${slug}`,
    },

    openGraph: {
      title: `${page.title} | ${siteConfig.name}`,
      description: page.description,
      url: `/${slug}`,
      images: ["/assets/verifair-og.png"],
    },

    twitter: {
      card: "summary_large_image",
      title: `${page.title} | ${siteConfig.name}`,
      description: page.description,
      images: ["/assets/verifair-og.png"],
    },
  };
}

export default async function SlugPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;

  const page = pageContent[slug];

  const legal =
    legalPages[slug as keyof typeof legalPages];

  if (!page && !legal) {
    notFound();
  }

  const pageTitle =
    page?.title ??
    legal?.title ??
    "Page";

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: pageTitle,
        item: `${siteConfig.url}/${slug}`,
      },
    ],
  };

  if (legal) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumb),
          }}
        />

        <div>
          <section className="section">
            <div className="container max-w-4xl">
              <p className="eyebrow">
                Legal
              </p>

              <h1 className="h1 mt-4 font-black">
                {legal.title}
              </h1>

              <p className="lead mt-6">
                {legal.description}
              </p>

              <div className="mt-10 grid gap-5">
                {legal.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="border-t border-slate-200 pt-5 leading-8 text-slate-700"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }

  if (!page) {
    notFound();
  }

  /*
   * The contact page has its own dedicated layout.
   *
   * The standard PageHero is intentionally excluded so the page
   * begins directly with the project-enquiry form section.
   */
  if (slug === "contact") {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumb),
          }}
        />

        <div>
          <div id="project-enquiry">
            <ContactForm />
          </div>
          <PageDisclaimer />
        </div>
      </>
    );
  }

  if (slug === "about") {
    return <AboutPage />;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumb),
        }}
      />

      <div>
        <PageHero page={page} />

        <ContentSections page={page} />

        {slug === "resources" ? (
          <ResourceList />
        ) : null}

        {slug === "construction" || slug === "healthcare" ? (
          <section className="border-b border-slate-200 bg-blue-50 py-10">
            <div className="container flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <p className="max-w-2xl text-sm leading-6 text-slate-700">
                <strong className="font-black text-slate-950">Preparing for 1 December 2026?</strong> Australia is moving to workplace
                exposure limits for airborne contaminants. Review readiness questions for monitoring, records and specialist assessment.
              </p>
              <Link
                href="/resources/december-2026-workplace-exposure-limits"
                className="cta-primary inline-flex min-h-11 shrink-0 items-center justify-center px-5 text-sm font-bold"
              >
                Read the WEL readiness guide →
              </Link>
            </div>
          </section>
        ) : null}

        <FinalCTA />
        <PageDisclaimer />
      </div>
    </>
  );
}

function ResourceList() {
  const resources = [
    [
      "Hospital construction dust monitoring guide",
      "/resources/hospital-construction-dust-monitoring",
    ],
    [
      "PM1, PM2.5 and PM10 explainer",
      "/resources/pm-particle-size-guide",
    ],
    [
      "Multi-zone monitoring checklist",
      "/resources/multi-zone-monitoring-checklist",
    ],
  ];

  return (
    <section className="section band">
      <div className="container">
        <h2 className="h2 font-black">
          Resource library
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {resources.map(([title, href]) => (
            <Link
              key={href}
              href={href}
              className="card p-6 font-black transition hover:-translate-y-1 hover:shadow-xl"
            >
              {title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}