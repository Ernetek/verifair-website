import {
  AcademicCapIcon,
  ArchiveBoxIcon,
  BellAlertIcon,
  BuildingOffice2Icon,
  ChartBarSquareIcon,
  CheckCircleIcon,
  CloudIcon,
  CpuChipIcon,
  DocumentChartBarIcon,
  ExclamationTriangleIcon,
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
    image: "/assets/verifair-infographic.png",
    sections: [
      {
        title: "Unified site-wide visibility",
        body: "Individual Dustlight devices are valuable at the point of monitoring. VerifAir extends that value by combining device telemetry into a shared operating view.",
        points: ["Multi-zone readings", "Sensor health and connectivity", "Site-wide status indicators", "Authorised cloud access"]
      },
      {
        title: "Decision support for active environments",
        body: "Teams can review current conditions, understand trends and respond when configured thresholds are exceeded.",
        points: ["Current PM1, PM2.5 and PM10 readings", "Escalation-ready alerts", "Historical trends", "Operational activity log"]
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
    image: "/assets/verifair-how-it-works.png",
    sections: [
      {
        title: "Dustlight particulate monitoring",
        body: "Dustlight devices monitor airborne particulates at the deployed or worn location, including PM1, PM2.5 and PM10.",
        points: ["Laser-based photometric measurement", "Visual and audible device alerts", "Indicative measurement for early awareness", "Maintenance intervals required for ongoing measurement quality"]
      },
      {
        title: "Gateway and edge processing",
        body: "VerifAir extends Dustlight with deterministic telemetry distribution, local buffering and gateway bridging.",
        points: ["Concurrent BLE telemetry distribution", "Local processing independent of cloud availability", "Range extension through gateway bridging", "Priority handling for monitoring data"]
      },
      {
        title: "Secure cloud and reporting",
        body: "Cloud services support authorised access, synchronisation and reporting while the operational app remains separate from the public website.",
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
    image: "/assets/verifair-sow-design.png",
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
    heading: "Dust information while work is still happening.",
    intro:
      "VerifAir helps construction teams move from delayed or fragmented dust information to shared operational awareness across active sites.",
    sections: [
      {
        title: "Operational visibility",
        body: "Site leaders can see current readings, zones with elevated conditions, sensor connectivity and recent alert history.",
        points: ["PM1, PM2.5 and PM10 visibility", "Work-front and boundary monitoring", "Dust complaint context", "Incident review records"]
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
    heading: "Monitoring records for complex public works.",
    intro:
      "Infrastructure projects often involve public interfaces, long corridors and multiple contractors. VerifAir gives teams a clearer view across changing work fronts.",
    sections: [
      {
        title: "Multi-site and multi-zone coverage",
        body: "Coordinate Dustlight devices across work fronts, compounds, occupied interfaces and sensitive receptors.",
        points: ["Transport and civil works", "Public interfaces", "Project-wide dashboards", "Remote authorised access"]
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
    heading: "Clearer environmental intelligence for public-sector oversight.",
    intro:
      "VerifAir supports evidence-based conversations between project teams, facility operators, contractors and stakeholders.",
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
    heading: "Visibility when construction happens near learning environments.",
    intro:
      "VerifAir helps education authorities and project teams monitor conditions around construction works near occupied school communities.",
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
    heading: "Keep refurbishment visibility close to the people affected.",
    intro:
      "VerifAir supports facility and project teams managing works inside or beside occupied workplaces, tenancies and public-facing buildings.",
    sections: [
      {
        title: "Protect continuity",
        body: "Understand current conditions across work zones, occupied floors and shared access points.",
        points: ["Tenant-facing works", "After-hours construction", "Dust migration visibility", "Facility team dashboards"]
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
        points: ["Hospital construction dust monitoring guide", "PM1, PM2.5 and PM10 explainer", "Multi-zone monitoring checklist", "Compliance language guide"]
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
  ["What does VerifAir do?", "VerifAir turns Dustlight particulate monitoring data into site-wide visibility, alerting, reporting and operational intelligence for dust-sensitive projects."],
  ["Is VerifAir a dust sensor manufacturer?", "No. Dustlight provides the particulate monitoring technology. VerifAir is the platform and deployment approach that coordinates devices, gateways, alerts and reporting."],
  ["What particulate sizes are monitored?", "Current marketing focuses on PM1, PM2.5, PM10, total suspended particulates and respirable construction dust, depending on the project configuration."],
  ["Can VerifAir guarantee compliance?", "No. VerifAir supports monitoring and reporting programs, but compliance depends on risk assessments, deployment strategy, controls, procedures, professional judgement and applicable obligations."],
  ["Can it be used around hospitals?", "Yes, it is positioned for healthcare construction and refurbishment projects where additional visibility near occupied clinical environments is valuable."],
  ["Does it replace infection-control procedures?", "No. It can support visibility and escalation processes but does not replace clinical infection-control procedures or advice."],
  ["Does it replace occupational hygiene monitoring?", "No. It complements appropriate professional monitoring and management controls."],
  ["Can multiple zones be monitored?", "Yes. VerifAir is designed to coordinate multiple Dustlight devices across zones, work fronts and occupied interfaces."],
  ["Does it work when internet connectivity is interrupted?", "The edge-first design supports local processing and buffering, with cloud synchronisation where configured."],
  ["What alerts are available?", "Alerts can be configured around project thresholds and escalation workflows so responsible personnel can respond to elevated readings."],
  ["Can reports be exported?", "Reporting is designed to support project records, audits, stakeholder updates and incident review."],
  ["Is the dashboard shown on this website operational?", "No. Website dashboards are purpose-built demonstrations that show the public marketing experience, not the customer monitoring platform."],
  ["Where is the customer portal?", "The operational monitoring platform should be hosted separately, such as app.verifair.com.au."],
  ["Does VerifAir support schools?", "Yes, particularly schools adjacent to construction activity where monitoring records and escalation processes are useful."],
  ["Does VerifAir support infrastructure?", "Yes. Multi-zone monitoring and historical reporting are relevant to civil, transport and public infrastructure projects."],
  ["What information is needed for a site assessment?", "Project location, industry, project stage, number of monitoring zones, primary concern and expected installation timing are useful starting points."],
  ["Can thresholds be changed?", "Threshold settings should be configured according to project requirements, professional advice and applicable management procedures."],
  ["Can VerifAir integrate with other systems?", "The site is prepared for future CRM, analytics, support and portal integrations, subject to security and privacy review."],
  ["Is data secure?", "The public website is configured for modern security headers and Cloudflare deployment. Operational platform security should be assessed separately before launch."],
  ["How do we start?", "Book a demonstration or site assessment so the team can understand the project environment and monitoring objectives."]
].map(([question, answer]) => ({ question, answer }));
