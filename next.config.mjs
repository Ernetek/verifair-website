import createMDX from "@next/mdx";

const withMDX = createMDX({ extension: /\.mdx?$/ });
const isDev = process.env.NODE_ENV === "development";

/** @type {import("next").NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    qualities: [75, 92, 95],
  },
  experimental: { optimizePackageImports: ["@heroicons/react"] },
  async headers() {
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} https://js-ap1.hsforms.net https://challenges.cloudflare.com`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.hsforms.com https://*.hsforms.net",
      "font-src 'self' data:",
      "connect-src 'self' https://*.hsforms.com https://*.hsforms.net https://challenges.cloudflare.com",
      "frame-src https://*.hsforms.com https://*.hsforms.net https://challenges.cloudflare.com",
      "child-src 'self' https://*.hsforms.com",
      "form-action 'self' https://*.hsforms.com",
      "base-uri 'self'",
      "frame-ancestors 'self'",
      !isDev && "upgrade-insecure-requests",
    ].filter(Boolean).join("; ");

    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Content-Security-Policy", value: csp },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      ],
    }];
  },
};

export default withMDX(nextConfig);
