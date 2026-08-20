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

import {
  PRODUCT_FRAMEWORK,
  TECHNOLOGY_RESPONSIBILITIES,
} from "@/lib/product-model";

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
  { title: "Continuous monitoring", body: "Keep watch across active zones, adjacent occupied areas and sensitive boundaries during the configured monitoring period.", icon: SignalIcon },
  { title: "Real-time Alerts", body: "Notify the right people when a configured operational trigger is reached.", icon: BellAlertIcon },
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
  product: {
    slug: "product",
    title: "Product",
    description:
      "Explore the VerifAir product: multi-zone particulate monitoring, operational alerts, response workflow and evidence reporting.",
    eyebrow: "VerifAir product",
    heading: "One product for monitoring, response and operational records.",
    intro:
      "VerifAir brings selected particulate readings, configured operational triggers, incident workflow and reporting into one shared view for project and facility teams.",
    image: "/assets/dust-monitoring-display-hub.webp",
    sections: PRODUCT_FRAMEWORK.map(({ title, description }) => ({
      title,
      body: description,
      points:
        title === "ASSESS"
          ? [
              "Respirable Dust, PM1, PM2.5 and PM10 visibility",
              "Dustlight device status",
              "VerifAir system health",
              "Authorised multi-zone access",
            ]
          : title === "ACT"
            ? [
                "Project-configured VerifAir operational states",
                "Alert acknowledgement and ownership",
                "Investigation notes",
                "Escalation and response workflow",
              ]
            : [
                "Connected event chronology",
                "Evidence attachments",
                "Response history",
                "Generated reporting outputs",
                complianceNote,
              ],
    }))
  },
  solutions: {
    slug: "solutions",
    title: "Solutions",
    description:
      "Explore VerifAir solutions for healthcare, construction, infrastructure, government, education and occupied commercial environments.",
    eyebrow: "VerifAir solutions",
    heading: "Operational visibility for dust-sensitive projects and occupied places.",
    intro:
      "VerifAir is configured around the sites, monitoring zones, operational responsibilities and reporting needs of each project rather than applying one universal monitoring plan.",
    image: "/assets/industry-construction-environment.webp",
    sections: [
      {
        title: "Sensitive occupied environments",
        body: "Support teams working beside hospitals, schools, tenants and public interfaces where changing particulate conditions need a visible, coordinated response.",
        points: ["Healthcare refurbishments", "Schools and education sites", "Occupied commercial buildings", "Public-facing project boundaries"]
      },
      {
        title: "Complex construction and infrastructure",
        body: "Organise selected work fronts, compounds, access routes and boundary locations into a shared monitoring and response view.",
        points: ["Main construction projects", "Civil and transport works", "Government programs", "Distributed project zones"]
      },
      {
        title: "Configured for the operating context",
        body: "Deployment begins with project requirements, monitoring locations, communications, responsible users and approved operational triggers.",
        points: ["Site and zone design", "Connectivity planning", "Project-specific triggers", "Response ownership", "Reporting requirements", complianceNote]
      }
    ]
  },
  platform: {
    slug: "platform",
    title: "Platform",
    description: "See how VerifAir turns Dustlight particulate monitoring into site-wide environmental intelligence.",
    eyebrow: "Environmental intelligence platform",
    heading: "Dustlight senses particulate conditions. VerifAir connects the operational response.",
    intro:
      "VerifAir coordinates multiple Dustlight devices, gateways, alerts and reporting workflows so teams can see conditions across projects, facilities and organisations in real time.",
    image: "/assets/verifair-og.png",
    sections: [
      {
        title: "Unified site-wide visibility",
        body: "Individual Dustlight devices are valuable at the point of monitoring. VerifAir extends that value by combining device telemetry into a shared operating view.",
        points: ["Multi-zone readings", "VerifAir system health and connectivity", "Project-configured operational states", "Authorised platform access"]
      },
      {
        title: "Decision support for active environments",
        body: "Teams can review current conditions, understand trends and respond when a configured operational trigger is reached.",
        points: ["Respirable Dust, PM1, PM2.5 and PM10 readings", "Escalation-ready alerts", "Historical trends", "Operational activity log"]
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
    sections: TECHNOLOGY_RESPONSIBILITIES.map(
      ({ technology, responsibilities }) => ({
        title: technology,
        body: responsibilities,
        points:
          technology === "Dustlight"
            ? [
                "Particulate sensing",
                "GREEN, YELLOW and RED device status",
                "Dustlight is supplied technology; VerifAir does not manufacture it",
              ]
            : technology === "VerifAir Edge"
              ? [
                  "Local BLE collection",
                  "Secure transport",
                  "Data retained during connection interruptions",
                  "HEALTHY, DEGRADED, STALE and OFFLINE system health",
                ]
              : [
                  "Centralised monitoring",
                  "NORMAL, ATTENTION and ACTION operational states",
                  "Alerts and workflow",
                  "Connected records and reporting",
                  complianceNote,
                ],
      }),
    )
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
    heading: "Make clinical interfaces easier to see, respond to and explain.",
    intro:
      "VerifAir gives hospital infrastructure, infection prevention, facilities and contractor teams a shared view of changing particulate conditions around live clinical environments, with practical workflows and retained evidence.",
    image: "/assets/industry-healthcare-environment.webp",
    sections: [
      {
        title: "Assess the clinical interface",
        body: "Use selected monitoring zones around refurbishment work, access routes and occupied clinical areas to understand where conditions are changing.",
        points: ["Multi-zone monitoring", "Clinical and contractor visibility", "Edge-connected deployment options", "Site-specific trigger configuration"]
      },
      {
        title: "Act and record with discipline",
        body: "Alerts, incident workflows and generated evidence reports help teams coordinate a response while keeping professional clinical and infection-control judgement in control.",
        points: ["Elevated-condition alerts", "Acknowledgement and assignment", "Response notes and review history", "Does not replace clinical infection-control advice"]
      }
    ]
  },
  construction: {
    slug: "construction",
    title: "Construction",
    description: "Real-time construction dust monitoring for main contractors, WHS teams, environmental managers and project leaders.",
    eyebrow: "Construction",
    heading: "Turn changing site conditions into an operational response.",
    intro:
      "VerifAir helps main contractors, WHS teams, environmental managers and project leaders assess selected work fronts, act when configured conditions change and retain a clear record of what happened.",
    image: "/assets/industry-construction-environment.webp",
    sections: [
      {
        title: "Assess the work front",
        body: "Bring current operational state, Respirable Dust, PM1, PM2.5 and PM10 readings, system health and recent alert context into one practical monitoring view.",
        points: ["Work-front and boundary monitoring", "Multi-zone status", "VerifAir Edge connectivity", "Dust complaint context"]
      },
      {
        title: "Act, then retain the record",
        body: "Configured alerts open a focused response workflow so teams can acknowledge, assign, investigate and document actions when conditions change.",
        points: ["Configured operational-trigger notifications", "Configured escalation paths", "Generated evidence reports", "Complements WHS and environmental controls"]
      }
    ]
  },
  infrastructure: {
    slug: "infrastructure",
    title: "Infrastructure",
    description: "Dust monitoring and reporting support for infrastructure projects, public works and civil construction environments.",
    eyebrow: "Infrastructure",
    heading: "Coordinate environmental visibility across moving work fronts.",
    intro:
      "VerifAir supports infrastructure and civil project teams with a shared view across selected work fronts, compounds and public interfaces, subject to the approved monitoring and connectivity design.",
    image: "/assets/industry-infrastructure-environment.webp",
    sections: [
      {
        title: "Assess a distributed project",
        body: "Organise monitoring around the locations where linear works, public access and project operations meet, with project-specific dashboards and connectivity context.",
        points: ["Transport and civil works", "Public interfaces", "Multi-zone project views", "Authorised remote access subject to the deployed service and connection"]
      },
      {
        title: "Act with context and record outcomes",
        body: "Alert chronology, response notes and generated reports help project teams explain changing conditions to stakeholders and review events after the fact.",
        points: ["Trend analysis", "Response workflows", "Alert chronology", "Due-diligence support"]
      }
    ]
  },
  government: {
    slug: "government",
    title: "Government",
    description: "Environmental monitoring visibility for government projects, procurement teams and public-sector construction programs.",
    eyebrow: "Government",
    heading: "Give public projects a clearer evidence trail.",
    intro:
      "VerifAir helps government project teams assess environmental conditions, coordinate practical responses and retain project-specific records without overstating what monitoring alone can prove.",
    image: "/assets/industry-government-environment.webp",
    sections: [
      {
        title: "Assess a public interface",
        body: "A project-specific monitoring design can make changing conditions, connectivity and zone status easier for delivery and oversight teams to review.",
        points: ["Managed installation", "Australian support", "VerifAir Edge and communications", "Security and accessibility documentation"]
      },
      {
        title: "Act transparently and record decisions",
        body: "Configured alerts, incident records and generated reports support review and communication while keeping regulatory interpretation with the appropriate experts.",
        points: ["Supports compliance programs", "Assists environmental management", "Supports audits", complianceNote]
      }
    ]
  },
  schools: {
    slug: "schools",
    title: "Schools",
    description: "Airborne particle monitoring support for schools and education sites adjacent to construction activity.",
    eyebrow: "Schools",
    heading: "Help school projects respond around occupied learning spaces.",
    intro:
      "VerifAir helps education authorities and project teams assess conditions around classrooms, arrival routes and construction boundaries, then coordinate and record responses without relying on workers to carry or pair a device.",
    image: "/assets/industry-education-environment.webp",
    sections: [
      {
        title: "Assess the school interface",
        body: "Use multi-zone monitoring around classrooms, play areas, temporary paths and construction boundaries to establish a shared operational picture.",
        points: ["Boundary monitoring", "Elevated-condition alerts", "Edge-connected deployment options", "Historical records"]
      },
      {
        title: "Act and communicate clearly",
        body: "Acknowledge, assign and document responses, then use trend summaries and evidence reports to support conversations with school communities and project stakeholders.",
        points: ["Current status", "Trend summaries", "Incident review", "Operational response notes"]
      }
    ]
  },
  "commercial-buildings": {
    slug: "commercial-buildings",
    title: "Commercial Buildings",
    description: "Particulate monitoring for occupied commercial buildings, refurbishments, tenancies and facility teams.",
    eyebrow: "Commercial buildings",
    heading: "Keep occupied building works visible and accountable.",
    intro:
      "VerifAir gives facility, tenancy and project teams a shared view of selected occupied floors, work zones and access points so they can assess change, coordinate action and retain evidence.",
    image: "/assets/industry-commercial-environment.webp",
    sections: [
      {
        title: "Assess occupied interfaces",
        body: "Understand current Respirable Dust, PM1, PM2.5 and PM10 conditions across work zones, occupied floors and shared access points.",
        points: ["Tenant-facing works", "After-hours construction", "Dust migration visibility", "Customer-branded dashboards configured for site and project requirements"]
      },
      {
        title: "Coordinate action and record conditions",
        body: "Alerts, response notes, zone-level trends and generated reports support transparent communication and post-event review.",
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
        points: ["Alert chronology", "Escalation records", "System-health context", "Configured operational-trigger history"]
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
    description: "Learn how VerifAir connects Dustlight sensing, Edge infrastructure, operational workflow and evidence reporting, engineered by ERNE Tech.",
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
    question: "What does VerifAir monitor?",
    answer:
      "VerifAir presents Respirable Dust as a separately captured channel alongside PM1, PM2.5 and PM10 readings from Dustlight monitors at configured monitoring locations across a project.",
  },
  {
    question: "How many monitoring locations can a project use?",
    answer:
      "A project can use as many monitoring locations as its monitoring objectives require. A single project with several monitoring locations is a complete VerifAir use case, and visibility can scale up to a wider portfolio when needed.",
  },
  {
    question: "How are project attention and action levels configured?",
    answer:
      "Attention and action levels are configured for each project based on its monitoring objectives and context. VerifAir compares monitored particulate readings against these configured levels to determine the operational state.",
  },
  {
    question: "What happens when a configured project level is reached?",
    answer:
      "The relevant users are alerted so they can acknowledge, assign ownership, investigate, record actions, escalate where required and verify and resolve the event through a coordinated response workflow.",
  },
  {
    question: "Does VerifAir require the customer's local network?",
    answer:
      "No. VerifAir's monitoring telemetry is designed to use an independent communications path and does not require connection to the facility's operational LAN or Wi-Fi.",
  },
  {
    question: "Can authorised users view VerifAir remotely?",
    answer:
      "Yes. Authorised users can access the Control Centre and Wallboard views from any authorised browser, subject to the approved connectivity and access design for the project.",
  },
  {
    question: "What records and reports are retained?",
    answer:
      "VerifAir brings together readings, alerts, acknowledgements, actions, comments and incident history into a connected operational record that can support reporting. Retention periods are determined by the approved project and service configuration.",
  },
  {
    question: "How is VerifAir different from a standalone particulate monitor?",
    answer:
      "A standalone monitor gives local, point-in-time readings. VerifAir connects Dustlight monitors across a project into one shared operational view, with configured alerts, workflow and a connected record - this can support compliance activities but does not itself determine exposure or regulatory compliance.",
  },
];
