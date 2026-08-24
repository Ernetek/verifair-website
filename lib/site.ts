export const SALES_EMAIL = "support@ernelifting.com";
// Replace with the verified @verifair.com.au mailbox once configured and tested.

export const siteConfig = {
  name: "VerifAir",
  title: "VerifAir | Real-Time Dust Monitoring for Construction and Healthcare Projects",
  description:
    "VerifAir connects Dustlight particulate monitoring with cloud-based alerts, reporting and environmental intelligence for construction, healthcare, infrastructure and sensitive sites.",
  url: "https://verifair.com.au",
  phone: "+61 452 447 696",
  email: SALES_EMAIL
};

export const primaryNav = [
  { label: "Product", href: "/monitoring", dropdown: "product" },
  { label: "Industries", href: "/solutions", dropdown: "solutions" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Resources", href: "/resources", dropdown: "resources" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
] as const;

export const productNav = [
  {
    label: "Monitoring",
    stage: "ASSESS",
    description: "See particulate conditions across sites and zones.",
    href: "/monitoring"
  },
  {
    label: "Workflow",
    stage: "ACT",
    description: "Coordinate alerts, response and operational actions.",
    href: "/workflow"
  },
  {
    label: "Reporting",
    stage: "REPORT",
    description: "Maintain the connected operational record and reporting.",
    href: "/reporting"
  }
] as const;

export const solutionsNav = [
  { label: "Healthcare", href: "/healthcare" },
  { label: "Construction", href: "/construction" },
  { label: "Infrastructure", href: "/infrastructure" },
  { label: "Government", href: "/government" },
  { label: "Schools", href: "/schools" },
  { label: "Commercial Buildings", href: "/commercial-buildings" }
] as const;

export const resourcesNav = [
  { label: "Knowledge Base", href: "/resources" },
  { label: "Guides and Articles", href: "/resources" },
  { label: "WEL December 2026", href: "/resources/december-2026-workplace-exposure-limits" },
  { label: "Applications", href: "/applications" }
] as const;

export const footerGroups = [
  {
    title: "Products",
    links: [
      { label: "Monitoring", href: "/monitoring" },
      { label: "Workflow", href: "/#workflow" },
      { label: "Reporting", href: "/#reportpreview" },
      { label: "Technology", href: "/technology" }
    ]
  },
  {
    title: "Industries",
    links: [
      { label: "Healthcare", href: "/healthcare" },
      { label: "Construction", href: "/construction" },
      { label: "Infrastructure", href: "/infrastructure" },
      { label: "Government", href: "/government" },
      { label: "Schools", href: "/schools" },
      { label: "Commercial Buildings", href: "/commercial-buildings" }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Resources", href: "/resources" },
      { label: "Applications", href: "/applications" },
      { label: "About", href: "/about" }
    ]
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookies", href: "/cookies" }
    ]
  }
];
