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
        body: "Dustlight is designed as a personal real-time dust monitor that provides PM1, PM2.5 and PM10 readings with a clear local status display and audible alerts.",
        points: ["Laser-based photometric measurement", "Clear green, amber and red traffic-light alerts with audible warning", "Indicative measurement for early awareness", "Maintenance intervals required for ongoing measurement quality"]
      },
      {
        title: "Gateway and edge processing",
        body: "VerifAir is intended to complement approved Dustlight use with configured site connectivity and project-level visibility. The final connection, continuity and maintenance approach is validated for the proposed deployment.",
        points: ["Configured telemetry transfer", "Project-specific continuity planning", "Shared dashboard visibility", "System-state and maintenance considerations"]
      },
      {
        title: "Secure cloud and reporting",
        body: "Configured cloud services can make the project dashboard available to authorised users, subject to the deployed connection, service availability, access controls and project requirements.",
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
      "VerifAir can provide shared particulate visibility across selected work fronts, compounds and sensitive receptors, subject to the approved monitoring and connectivity design.",
    image: "/assets/industry-infrastructure-environment.webp",
    sections: [
      {
        title: "Multi-site and multi-zone coverage",
        body: "Coordinate Dustlight devices across work fronts, compounds, occupied interfaces and sensitive receptors.",
        points: ["Transport and civil works", "Public interfaces", "Project-specific dashboards", "Authorised remote access subject to the deployed service and connection"]
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
      "VerifAir can give facility and project teams a shared view of PM1, PM2.5 and PM10 conditions across selected occupied floors, work zones and access points.",
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
  applications: {
    slug: "applications",
    title: "Applications",
    description:
      "Example deployment scenarios showing where VerifAir may support structured particulate monitoring, alerting and reporting.",
    eyebrow: "Where VerifAir fits",
    heading: "Example deployment scenarios for dust-sensitive environments.",
    intro:
      "These scenarios are illustrative only. They describe potential monitoring approaches and are not customer case studies, completed deployments or evidence of customer adoption.",
    sections: [
      {
        title: "Example deployment scenario — occupied clinical interface",
        body:
          "A proposed monitoring approach may place Dustlight devices at a work zone, an occupied interface and an external boundary during staged refurbishment.",
        points: [
          "Work Zone A",
          "Occupied Interface",
          "External Boundary",
          "Demonstration alert and reporting workflow",
        ],
      },
      {
        title: "Example deployment scenario — distributed civil works",
        body:
          "A proposed monitoring approach may use selected monitoring points across a compound, changing work front and public interface.",
        points: [
          "Monitoring-location review",
          "Connectivity assessment",
          "Alert-responsibility planning",
          "Demonstration event review",
        ],
      },
      {
        title: "Example deployment scenario — occupied commercial refurbishment",
        body:
          "A proposed monitoring approach may support visibility between a controlled work area, shared access route and occupied tenancy interface.",
        points: [
          "Site and operational-context review",
          "Monitoring approach",
          "Demonstration or pilot deployment",
          "Review and refinement",
        ],
      },
    ],
  },
  about: {
    slug: "about",
    title: "About",
    description: "Learn about VerifAir, a launch-stage particulate monitoring product being developed by Australian startup Erne Tech.",
    eyebrow: "About VerifAir",
    heading: "A launch-stage monitoring product developed by Erne Tech.",
    intro:
      "Erne Tech is an Australian startup developing VerifAir to improve visibility and coordination around changing particulate conditions in dust-sensitive environments.",
    sections: [
      {
        title: "Developed for structured pilot deployment",
        body: "The current focus is transparent product development, careful site review, demonstration workflows and structured pilot deployments.",
        points: ["Project discussion", "Site and operational-context review", "Monitoring approach", "Pilot review and refinement"]
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
    question: "How does VerifAir work?",
    answer:
      "Dustlight monitors collect particulate observations at configured locations. VerifAir Edge transfers that information through the approved communications path to VerifAir Cloud, where authorised users can assess conditions, coordinate response and retain the operational record.",
  },
  {
    question: "Does VerifAir require the facility's Wi-Fi or network?",
    answer:
      "VerifAir's monitoring telemetry is designed to use an independent communications path and does not require connection to the facility's operational LAN or Wi-Fi. Customer cybersecurity and vendor review may still apply.",
  },
  {
    question: "What happens if cellular connectivity is interrupted?",
    answer:
      "Continuity behaviour depends on the approved project design. Where configured and validated, VerifAir Edge can buffer observations locally and recover communications so the record can be reconciled after an interruption.",
  },
  {
    question: "Can VerifAir monitor multiple zones?",
    answer:
      "Yes. VerifAir coordinates monitoring points across selected work zones, boundaries, occupied interfaces and other project locations in one operational view.",
  },
  {
    question: "Can VerifAir support multiple sites?",
    answer:
      "Yes. The platform is designed to present multiple sites and zones to authorised users, subject to the approved monitoring, connectivity and deployment design.",
  },
  {
    question: "Can monitoring zones move as construction progresses?",
    answer:
      "Yes. Monitoring deployments can be reviewed and reconfigured as project stages, work fronts and occupied interfaces change. Relocation, commissioning and connectivity checks should be managed through the project deployment process.",
  },
  {
    question: "What happens when a configured condition requires attention?",
    answer:
      "The configured condition is surfaced to the responsible users, who can acknowledge the alert, assign ownership, assess the situation, record actions, escalate where required, verify the response and resolve the event.",
  },
  {
    question: "What reports and records does VerifAir create?",
    answer:
      "VerifAir brings together observations, alerts, acknowledgements, assignments, actions, comments, escalation history, verification and incident records to support evidence and reporting.",
  },
  {
    question: "How long are completed records retained?",
    answer:
      "Retention is determined by the approved project and service configuration. The applicable retention period should be confirmed during deployment and reflected in the relevant project or service documentation.",
  },
  {
    question: "Does VerifAir determine workplace exposure or regulatory compliance?",
    answer:
      "No. VerifAir provides project-level particulate monitoring and operational records. It does not independently determine personal exposure, workplace exposure compliance or regulatory compliance, and does not replace occupational hygiene advice, specialist sampling or competent professional assessment.",
  },
  {
    question: "How is VerifAir deployed?",
    answer:
      "Deployment covers project requirements, sites and zones, monitoring locations and operational triggers, Dustlight monitors, VerifAir Edge, communications and system-health verification before operational monitoring begins.",
  },
];
