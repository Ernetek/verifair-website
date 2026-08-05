import {
  AcademicCapIcon,
  ArchiveBoxIcon,
  BellAlertIcon,
  BuildingOffice2Icon,
  ChartBarSquareIcon,
  CheckCircleIcon,
  CloudIcon,
  DocumentChartBarIcon,
  MapIcon,
  ServerStackIcon,
  ShieldCheckIcon,
  SignalIcon,
  WrenchScrewdriverIcon
} from "@heroicons/react/24/outline";

export type MarketingPage = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
  image?: string;
  sections: Array<{
    title: string;
    body: string;
    points: string[];
  }>;
  faq?: Array<{ question: string; answer: string }>;
};

export const benefits = [
  { title: "24/7 Monitoring", body: "Keep watch across active zones, adjacent occupied areas and sensitive boundaries.", icon: SignalIcon },
  { title: "Real-time Alerts", body: "Notify the right people when configured particulate thresholds are exceeded.", icon: BellAlertIcon },
  { title: "Historical Reporting", body: "Retain monitoring records that support reviews, audits and project reporting.", icon: DocumentChartBarIcon },
  { title: "Operational Visibility", body: "Understand what is happening across a project before delayed reports arrive.", icon: ChartBarSquareIcon },
  { title: "Enterprise Scalability", body: "Coordinate multiple Dustlight devices across projects, facilities and organisations.", icon: ServerStackIcon },
  { title: "Evidence Generation", body: "Create defensible records that complement environmental and WHS processes.", icon: ArchiveBoxIcon },
  { title: "Cloud Access", body: "Access authorised monitoring information securely from any location.", icon: CloudIcon },
  { title: "Centralised Monitoring", body: "Bring device status, readings, alerts and trends into one shared operating picture.", icon: MapIcon }
];

export const industries = [
  {
    title: "Healthcare",
    href: "/healthcare",
    body: "Hospital refurbishments, construction beside occupied clinical areas and sensitive patient environments.",
    icon: ShieldCheckIcon
  },
  {
    title: "Construction",
    href: "/construction",
    body: "Main contractors, WHS teams and project leaders managing active dust risks across complex sites.",
    icon: WrenchScrewdriverIcon
  },
  {
    title: "Infrastructure",
    href: "/infrastructure",
    body: "Public works, transport corridors and civil projects that need clear monitoring records.",
    icon: BuildingOffice2Icon
  },
  {
    title: "Government",
    href: "/government",
    body: "Procurement, oversight and project assurance teams requiring transparent monitoring evidence.",
    icon: CheckCircleIcon
  },
  {
    title: "Schools",
    href: "/schools",
    body: "Education sites near construction activity where visible escalation processes matter.",
    icon: AcademicCapIcon
  },
  {
    title: "Commercial Buildings",
    href: "/commercial-buildings",
    body: "Occupied buildings, tenancies and facility teams balancing construction work with continuity.",
    icon: BuildingOffice2Icon
  }
];

const complianceNote =
  "VerifAir supports monitoring, reporting and environmental management programs. It does not replace occupational hygiene advice, statutory exposure assessment, clinical infection-control procedures or professional judgement.";

export const pageContent: Record<string, MarketingPage> = {
  platform: {
    slug: "platform",
    title: "Platform",
    description: "See how VerifAir turns Dustlight particulate monitoring into site-wide environmental intelligence.",
    eyebrow: "Environmental intelligence platform",
    heading: "Dustlight measures the environment. VerifAir manages it.",
    intro:
      "VerifAir coordinates multiple Dustlight devices, gateways, alerts and reporting workflows so teams can see conditions across projects, facilities and organisations in real time.",
    image: "/assets/verifair-og.png",
    sections: [
      {
        title: "Unified site-wide visibility",
        body: "Individual Dustlight devices are valuable at the point of monitoring. VerifAir extends that value by combining device telemetry into a shared operating view.",
        points: ["Multi-zone readings", "Sensor health and connectivity", "Site-wide status indicators", "Authorised cloud access"]
      },
      {
        title: "Decision support for active environments",
        body: "Teams can review current conditions, understand trends and respond when configured thresholds are exceeded.",
        points: ["Current PM1 and PM2.5 readings", "Escalation-ready alerts", "Historical trends", "Operational activity log"]
      },
      {
        title: "Built for future expansion",
        body: "The platform is designed to support additional environmental sensors and analytics without changing the public website or exposing operational functionality.",
        points: ["Extensible telemetry model", "Secure role-based access planned for the app subdomain", "Integration-ready architecture", complianceNote]
      }
    ]
  },
  technology: {
    slug: "technology",
    title: "Technology",
    description: "Explore VerifAir edge processing, Dustlight monitoring devices, gateways, alerts and secure cloud architecture.",
    eyebrow: "Technology",
    heading: "Real-time particulate data, engineered for operating conditions.",
    intro:
      "VerifAir is built around Dustlight particulate monitoring technology and an edge-first telemetry bridge that helps teams keep local awareness even when connectivity is imperfect.",
    image: "/assets/tech_hero.webp",
    sections: [
      {
        title: "Dustlight particulate monitoring",
        body: "Dustlight is a highly effective personal wearable monitor that gives workers immediate real-time PM1 and PM2.5 awareness through its clear traffic-light display and audible alerts.",
        points: ["Laser-based photometric measurement", "Clear green, amber and red traffic-light alerts with audible warning", "Indicative measurement for early awareness", "Maintenance intervals required for ongoing measurement quality"]
      },
      {
        title: "Gateway and edge processing",
        body: "VerifAir builds on Dustlight by removing dependence on a worker remembering, charging, switching on, pairing and cloud-syncing a phone-connected wearable. The installed system is always on, uses automated redundancy and failover, and delivers real-time site monitoring.",
        points: ["Concurrent BLE telemetry distribution", "Automated redundancy, local buffering and failover to maximise uptime", "Always-on gateway bridging that removes reliance on a worker phone", "Priority handling for monitoring data"]
      },
      {
        title: "Secure cloud and reporting",
        body: "Secure cloud services make each customer-branded, project-specific dashboard available to authorised users remotely where an authorised internet connection is available while maintaining real-time alerts, synchronisation and reporting.",
        points: ["Encrypted transport", "Cloudflare-hosted public site", "Future customer portal on app.verifair.com.au", complianceNote]
      }
    ]
  },
  industries: {
    slug: "industries",
    title: "Industries",
    description: "VerifAir supports dust monitoring for healthcare, construction, infrastructure, government, schools and commercial buildings.",
    eyebrow: "Industries",
    heading: "Designed for sensitive construction and occupied environments.",
    intro:
      "VerifAir helps teams see what is happening where construction-generated dust, airborne particulates and stakeholder confidence matter.",
    sections: [
      {
        title: "High-risk interfaces",
        body: "The strongest use cases sit at the boundary between construction activity and people who need protection, continuity or assurance.",
        points: ["Hospitals and clinical areas", "Schools beside construction works", "Occupied commercial buildings", "Sensitive neighbours"]
      },
      {
        title: "Project accountability",
        body: "Project teams need practical records, alerts and context for decisions, complaints, incident reviews and stakeholder reporting.",
        points: ["Main contractor visibility", "Environmental management support", "WHS and HSE review", "Government and procurement assurance"]
      }
    ]
  },
  healthcare: {
    slug: "healthcare",
    title: "Healthcare",
    description: "Hospital construction dust monitoring for occupied clinical environments, refurbishment projects and infection-control visibility.",
    eyebrow: "Healthcare construction",
    heading: "Visibility for construction beside occupied clinical areas.",
    intro:
      "VerifAir supports hospital infrastructure, infection prevention, facility and contractor teams with real-time airborne particle visibility across construction zones and sensitive areas.",
    image: "/assets/industry-healthcare-environment.webp",
    sections: [
      {
        title: "Monitor sensitive boundaries",
        body: "Place Dustlight devices around construction-zone boundaries, corridors, wards and occupied areas to create a shared view of conditions.",
        points: ["Refurbishment and live works", "Maternity, surgical and clinical adjacencies", "Multi-zone status", "Escalation procedures"]
      },
      {
        title: "Support infection-control processes",
        body: "VerifAir provides additional visibility that can complement existing infection-control and construction management procedures.",
        points: ["Elevated particle alerts", "Historical condition records", "Incident review support", "Does not replace clinical infection-control advice"]
      }
    ]
  },
  construction: {
    slug: "construction",
    title: "Construction",
    description: "Real-time construction dust monitoring for main contractors, WHS teams, environmental managers and project leaders.",
    eyebrow: "Construction",
    heading: "Real-time visibility across active construction work.",
    intro:
      "VerifAir gives site teams real-time PM1 and PM2.5 visibility across selected work fronts, boundaries and occupied interfaces, with automated connectivity, alerting and reporting.",
    image: "/assets/industry-construction-environment.webp",
    sections: [
      {
        title: "Operational visibility",
        body: "Site leaders can see current readings, zones with elevated conditions, sensor connectivity and recent alert history.",
        points: ["PM1 and PM2.5 visibility", "Work-front and boundary monitoring", "Dust complaint context", "Incident review records"]
      },
      {
        title: "Support response workflows",
        body: "Configured alerts help teams escalate, investigate and document responses when particulate levels rise.",
        points: ["Threshold-based notifications", "Configured escalation paths", "Historical reporting", "Complements WHS and environmental controls"]
      }
    ]
  },
  infrastructure: {
    slug: "infrastructure",
    title: "Infrastructure",
    description: "Dust monitoring and reporting support for infrastructure projects, public works and civil construction environments.",
    eyebrow: "Infrastructure",
    heading: "Continuous visibility across changing infrastructure work fronts.",
    intro:
      "VerifAir provides always-on monitoring across changing work fronts, compounds and sensitive receptors so authorised teams can review real-time conditions from remotely where an authorised internet connection is available.",
    image: "/assets/industry-infrastructure-environment.webp",
    sections: [
      {
        title: "Multi-site and multi-zone coverage",
        body: "Coordinate Dustlight devices across work fronts, compounds, occupied interfaces and sensitive receptors.",
        points: ["Transport and civil works", "Public interfaces", "Customer-branded, project-specific dashboards", "Authorised dashboard access from remotely where an authorised internet connection is available"]
      },
      {
        title: "Evidence for review",
        body: "Historical trends and alert records support stakeholder briefings, audits and post-event analysis.",
        points: ["Trend analysis", "Exportable reports", "Alert chronology", "Due-diligence support"]
      }
    ]
  },
  government: {
    slug: "government",
    title: "Government",
    description: "Environmental monitoring visibility for government projects, procurement teams and public-sector construction programs.",
    eyebrow: "Government",
    heading: "Real-time monitoring evidence for public-sector projects.",
    intro:
      "VerifAir provides government project teams with continuous, remotely accessible monitoring records, alert history and project-specific dashboards.",
    image: "/assets/industry-government-environment.webp",
    sections: [
      {
        title: "Procurement-ready framing",
        body: "The platform separates monitoring capability, reporting, support and future integrations for easier stakeholder evaluation.",
        points: ["Managed installation", "Australian support", "Cloudflare hosting pathway", "Security and accessibility documentation"]
      },
      {
        title: "Responsible compliance language",
        body: "VerifAir contributes evidence and reporting without claiming to make a project compliant by itself.",
        points: ["Supports compliance programs", "Assists environmental management", "Supports audits", complianceNote]
      }
    ]
  },
  schools: {
    slug: "schools",
    title: "Schools",
    description: "Airborne particle monitoring support for schools and education sites adjacent to construction activity.",
    eyebrow: "Schools",
    heading: "Real-time monitoring around occupied learning environments.",
    intro:
      "VerifAir helps education authorities and project teams maintain real-time visibility around classrooms, access routes and construction boundaries without relying on workers to carry or pair a device.",
    image: "/assets/industry-education-environment.webp",
    sections: [
      {
        title: "Monitor occupied interfaces",
        body: "Use multi-zone monitoring around classrooms, play areas, temporary paths and construction boundaries.",
        points: ["Boundary monitoring", "Elevated condition alerts", "Stakeholder reporting support", "Historical records"]
      },
      {
        title: "Communicate with confidence",
        body: "Clear monitoring records help teams respond to questions with evidence rather than guesswork.",
        points: ["Current status", "Trend summaries", "Incident review", "Operational response notes"]
      }
    ]
  },
  "commercial-buildings": {
    slug: "commercial-buildings",
    title: "Commercial Buildings",
    description: "Particulate monitoring for occupied commercial buildings, refurbishments, tenancies and facility teams.",
    eyebrow: "Commercial buildings",
    heading: "Continuous monitoring for occupied commercial environments.",
    intro:
      "VerifAir gives facility and project teams an always-on view of PM1 and PM2.5 conditions across occupied floors, work zones and shared access points.",
    image: "/assets/industry-commercial-environment.webp",
    sections: [
      {
        title: "Protect continuity",
        body: "Understand current conditions across work zones, occupied floors and shared access points.",
        points: ["Tenant-facing works", "After-hours construction", "Dust migration visibility", "Customer-branded dashboards configured for site and project requirements"]
      },
      {
        title: "Document conditions",
        body: "Monitoring records support transparent communication and post-event review.",
        points: ["Daily summaries", "Alert records", "Zone-level trends", "Project reporting packs"]
      }
    ]
  },
  reporting: {
    slug: "reporting",
    title: "Reporting",
    description: "VerifAir reporting converts particulate readings, alert history and zone trends into practical project evidence.",
    eyebrow: "Reporting",
    heading: "From raw readings to evidence-backed conversations.",
    intro:
      "VerifAir reporting helps project teams understand trends, review incidents and provide records that support audits and stakeholder updates.",
    sections: [
      {
        title: "Historical analytics",
        body: "Review how particulate conditions changed over time, by zone, device and project phase.",
        points: ["PM trend views", "Zone comparisons", "Daily and weekly summaries", "Export-ready records"]
      },
      {
        title: "Alert context",
        body: "Pair elevated readings with time, zone, sensor and response notes to support clearer decisions.",
        points: ["Alert chronology", "Escalation records", "Sensor health context", "Configured threshold history"]
      },
      {
        title: "Compliance support, not compliance guarantee",
        body: "Reports can assist compliance programs and due-diligence evidence when used with appropriate professional controls.",
        points: ["Supports audits", "Supports environmental management", "Complements site-specific risk assessments", complianceNote]
      }
    ]
  },
  resources: {
    slug: "resources",
    title: "Resources",
    description: "Guides and explainers about real-time particulate monitoring, hospital construction dust and VerifAir technology.",
    eyebrow: "Resources",
    heading: "Practical guides for project, health and environmental teams.",
    intro:
      "Use these resources to brief stakeholders, prepare procurement conversations and understand how monitoring programs should be framed.",
    sections: [
      {
        title: "Featured resources",
        body: "Educational material should help teams make better decisions without overstating what monitoring alone can prove.",
        points: ["Hospital construction dust monitoring guide", "PM1 and PM2.5 explainer", "Multi-zone monitoring checklist", "Compliance language guide"]
      }
    ]
  },
  "case-studies": {
    slug: "case-studies",
    title: "Case Studies",
    description: "Example VerifAir use cases for healthcare, infrastructure and commercial construction environments.",
    eyebrow: "Case studies",
    heading: "Use cases built around realistic project conditions.",
    intro:
      "These example scenarios show how VerifAir can support project visibility. Named customer case studies should be added only with permission.",
    sections: [
      {
        title: "Healthcare refurbishment scenario",
        body: "A hospital project team monitors construction boundaries, nearby corridors and sensitive clinical areas during staged refurbishment.",
        points: ["Multi-zone deployment", "Alert escalation", "Daily summary reporting", "Stakeholder review"]
      },
      {
        title: "Infrastructure corridor scenario",
        body: "A civil project monitors work fronts and sensitive receptors across changing site conditions.",
        points: ["Gateway bridging", "Trend reporting", "Public interface monitoring", "Incident review support"]
      },
      {
        title: "Commercial fit-out scenario",
        body: "A facility team keeps watch over occupied floors during refurbishment works.",
        points: ["Tenant communication", "After-hours works", "Elevated reading response", "Historical records"]
      }
    ]
  },
  about: {
    slug: "about",
    title: "About",
    description: "Learn about VerifAir, an Australian monitoring and environmental intelligence solution developed by Erne Tech Solutions.",
    eyebrow: "About VerifAir",
    heading: "Australian operational technology for difficult monitoring environments.",
    intro:
      "VerifAir is developed by Erne Tech Solutions to provide practical visibility where airborne particles, construction activity and occupied environments intersect.",
    sections: [
      {
        title: "Built for deployment",
        body: "The focus is practical monitoring architecture, managed implementation and usable information for project teams.",
        points: ["Deployable monitoring systems", "Australian support", "Edge-first architecture", "Managed project setup"]
      },
      {
        title: "Clear product boundaries",
        body: "VerifAir is the environmental intelligence layer built around Dustlight particulate monitoring technology.",
        points: ["Dustlight captures particulate data", "VerifAir coordinates devices and reporting", "Public website is separate from the operational app", complianceNote]
      }
    ]
  },
  contact: {
    slug: "contact",
    title: "Contact",
    description: "Book a VerifAir demonstration, discuss a site assessment or contact the VerifAir team.",
    eyebrow: "Contact",
    heading: "Book a demonstration or discuss a project.",
    intro:
      "Tell us about the environment, project stage and monitoring zones you need to understand. The VerifAir team will respond with practical next steps.",
    sections: []
  }
};

export const faqs = [
  {
    question: "What does VerifAir monitor?",
    answer:
      "VerifAir coordinates particulate monitoring data from configured Dustlight devices and presents readings, alerts, trends and records through a shared operational interface.",
  },
  {
    question: "What particulate sizes are monitored?",
    answer:
      "Configured Dustlight monitors collect PM1 and PM2.5 readings at selected monitoring points. These readings do not identify the chemical or mineral composition of airborne material.",
  },
  {
    question: "Can multiple zones be monitored?",
    answer:
      "Yes. VerifAir is designed to coordinate multiple monitoring points across selected zones, work fronts, boundaries and occupied interfaces.",
  },
  {
    question: "What happens if internet connectivity is interrupted?",
    answer:
      "The edge-first design supports local buffering and processing during connectivity interruptions, with synchronisation resuming where configured when connectivity returns.",
  },
  {
    question: "How are alerts configured?",
    answer:
      "Alerts are configured around project requirements, agreed thresholds and escalation workflows so information can be routed to the people responsible for taking action.",
  },
  {
    question: "Can reports be exported?",
    answer:
      "Yes. Downloadable records and reports are intended to support project reviews, investigations, stakeholder updates and environmental-management processes.",
  },
  {
    question: "Can VerifAir guarantee compliance?",
    answer:
      "No. VerifAir provides monitoring data, alerts and records that can support environmental-management, due-diligence and reporting processes. It does not replace competent risk assessment, occupational-hygiene advice, specialist sampling, statutory controls or other project-specific compliance requirements.",
  },
  {
    question: "How do we get started?",
    answer:
      "Book a free site assessment so the team can understand the project environment, monitoring objectives, zones, connectivity and reporting requirements.",
  },
];
