import type { Metadata, Viewport } from "next";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { siteConfig } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: "/assets/verifair-og.png",
        width: 1200,
        height: 630,
        alt: "VerifAir particulate monitoring platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/assets/verifair-og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1220",
  colorScheme: "light",
};

const organisationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Erne Tech",
  brand: {
    "@type": "Brand",
    name: siteConfig.name,
  },
  url: siteConfig.url,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  logo: `${siteConfig.url}/assets/verifair-logo.webp`,
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  inLanguage: "en-AU",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organisationSchema, websiteSchema]),
          }}
        />
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow"
          href="#main"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
