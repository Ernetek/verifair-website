export type VerifAirResource = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  intro: string;
  image: string;
  updated?: string;
  readingMinutes?: number;
  sections: Array<{
    title: string;
    paragraphs: string[];
    points?: string[];
  }>;
};

export const verifAirResources: VerifAirResource[] = [
  {
    slug: "pm-particle-size-guide",
    image: "/assets/dustlight.webp",
    updated: "2026-08-05",
    readingMinutes: 5,
    category: "Technical explainer",
    title: "PM1 and PM2.5 explained",
    summary:
      "A plain-language guide to the particulate-size readings used in environmental monitoring.",
    intro:
      "PM1 and PM2.5 describe particle-size fractions measured by particulate monitors. They provide useful information about changing conditions, but they do not identify the chemical or mineral composition of airborne material.",
    sections: [
      {
        title: "What the numbers mean",
        paragraphs: [
          "The number refers to an aerodynamic particle-size fraction measured in micrometres. PM2.5 represents particles up to 2.5 micrometres, while PM1 represents the smaller fraction up to 1 micrometre.",
          "Different activities, weather conditions and control measures can change the balance of particulate sizes at a monitoring point.",
        ],
      },
      {
        title: "How to use particulate readings",
        paragraphs: [
          "Readings can help teams identify trends, compare zones and review events against project-specific response settings.",
          "Particulate monitoring should be interpreted alongside work activities, controls, site observations and specialist advice where hazardous materials may be present.",
        ],
      },
    ],
  },
  {
    slug: "selecting-monitoring-locations",
    image: "/assets/problem-active-dust.webp",
    updated: "2026-08-05",
    readingMinutes: 5,
    category: "Monitoring guide",
    title: "Selecting monitoring locations",
    summary:
      "Factors to consider when choosing monitoring points around active work and occupied areas.",
    intro:
      "Monitoring locations should be selected to support a defined project objective. A useful location is one that helps a team understand a source, boundary, sensitive receptor or occupied interface.",
    sections: [
      {
        title: "Start with the monitoring objective",
        paragraphs: [
          "Define the decisions that monitoring information should support before placing devices.",
        ],
        points: [
          "Work-area boundaries",
          "Occupied corridors or rooms",
          "Site entrances and material routes",
          "External boundaries and neighbouring properties",
          "Background or comparison locations",
        ],
      },
      {
        title: "Review placement during the project",
        paragraphs: [
          "Monitoring needs can change as work fronts, barriers, ventilation and access arrangements change. Locations should be reviewed when the project conditions change.",
        ],
      },
    ],
  },
  {
    slug: "multi-zone-monitoring-checklist",
    image: "/assets/platform-dashboard.webp",
    updated: "2026-08-05",
    readingMinutes: 5,
    category: "Project checklist",
    title: "Multi-zone monitoring checklist",
    summary:
      "A practical checklist for planning monitoring across multiple work areas and sensitive interfaces.",
    intro:
      "Multi-zone monitoring works best when the project team agrees on objectives, responsibilities, response settings and reporting expectations before deployment.",
    sections: [
      {
        title: "Planning checklist",
        paragraphs: [],
        points: [
          "Define each monitoring zone and its purpose",
          "Identify sensitive receptors and likely particulate sources",
          "Confirm access, power and site-connectivity requirements",
          "Assign alert and escalation owners",
          "Agree reporting periods and review meetings",
          "Record project changes that may affect monitoring context",
        ],
      },
      {
        title: "Monitoring complements site controls",
        paragraphs: [
          "Continuous monitoring can supplement inspections and spot checks. It does not replace risk assessment, engineering controls, occupational hygiene advice or specialist sampling.",
        ],
      },
    ],
  },
  {
    slug: "dust-migration-occupied-environments",
    image: "/assets/industry-commercial-environment.webp",
    updated: "2026-08-05",
    readingMinutes: 5,
    category: "Monitoring guide",
    title: "Dust migration near occupied environments",
    summary:
      "Planning considerations where active work occurs beside patients, staff, students, tenants or the public.",
    intro:
      "Dust can move beyond the immediate work area through openings, traffic routes, air movement and changing barriers. Monitoring plans should consider the interfaces between active work and occupied environments.",
    sections: [
      {
        title: "Consider the whole interface",
        paragraphs: [
          "Review work boundaries, doors, corridors, lifts, loading areas, ventilation pathways and external conditions.",
        ],
        points: [
          "Occupied areas beside the work zone",
          "High-traffic transition points",
          "Temporary barriers and changing work fronts",
          "Sensitive activities or populations",
          "Escalation and communication responsibilities",
        ],
      },
    ],
  },
  {
    slug: "alert-response-planning",
    image: "/assets/Alerts.webp",
    updated: "2026-08-05",
    readingMinutes: 5,
    category: "Project checklist",
    title: "Alert and response planning",
    summary:
      "A framework for assigning alert settings, responsibilities and practical response steps.",
    intro:
      "An alert is useful only when the responsible people understand what it means, who receives it and what action should follow.",
    sections: [
      {
        title: "Define the response workflow",
        paragraphs: [],
        points: [
          "Set project-specific alert conditions",
          "Identify primary and backup recipients",
          "Document investigation and escalation steps",
          "Record relevant activities and control changes",
          "Review settings when project conditions change",
        ],
      },
      {
        title: "Avoid treating an alert as a diagnosis",
        paragraphs: [
          "A particulate alert indicates that a configured condition has been reached. It does not identify asbestos, silica or another material and does not independently determine personal exposure.",
        ],
      },
    ],
  },
  {
    slug: "monitoring-versus-occupational-hygiene",
    image: "/assets/dustlight.webp",
    updated: "2026-08-05",
    readingMinutes: 5,
    category: "Technical explainer",
    title: "Monitoring versus occupational hygiene",
    summary:
      "Understand the different roles of continuous particulate monitoring and specialist exposure assessment.",
    intro:
      "Continuous particulate monitoring and occupational hygiene assessment can support different project decisions. They should not be treated as interchangeable.",
    sections: [
      {
        title: "Continuous project monitoring",
        paragraphs: [
          "VerifAir can present changing particulate conditions, trends, configured alerts and time-stamped records across selected monitoring points.",
        ],
      },
      {
        title: "Specialist assessment",
        paragraphs: [
          "Occupational hygienists can design personal exposure sampling, select validated methods, interpret results against relevant limits and advise on controls.",
          "Where silica, asbestos or other hazardous materials may be present, competent specialist advice and appropriate sampling remain essential.",
        ],
      },
    ],
  },
  {
    slug: "evidence-ready-reporting-checklist",
    image: "/assets/reports.webp",
    updated: "2026-08-05",
    readingMinutes: 5,
    category: "Reporting guidance",
    title: "Evidence-ready reporting checklist",
    summary:
      "Information to capture so monitoring records remain clear, reviewable and useful.",
    intro:
      "A useful monitoring record explains what was monitored, where, when and in what project context.",
    sections: [
      {
        title: "Recommended record elements",
        paragraphs: [],
        points: [
          "Project, site and reporting-period details",
          "Monitoring-zone names and locations",
          "PM1 and PM2.5 trends",
          "Configured alert settings and alert history",
          "Device and connectivity status",
          "Known data gaps",
          "Project notes and relevant work activities",
          "Report-generation date",
        ],
      },
      {
        title: "Use records appropriately",
        paragraphs: [
          "Monitoring reports can support reviews, due-diligence processes and stakeholder communication. They do not independently establish legal compliance or personal exposure.",
        ],
      },
    ],
  },
  {
    slug: "hospital-construction-dust-monitoring",
    image: "/assets/industry-healthcare-environment.webp",
    updated: "2026-08-05",
    readingMinutes: 5,
    category: "Monitoring guide",
    title: "Hospital refurbishment monitoring guide",
    summary:
      "Planning monitoring around construction and refurbishment near occupied clinical environments.",
    intro:
      "Healthcare refurbishment can place active work beside patients, staff, visitors and sensitive clinical operations. Monitoring should be coordinated with the facility, contractor and relevant specialist procedures.",
    sections: [
      {
        title: "Plan around sensitive interfaces",
        paragraphs: [
          "Identify work boundaries, occupied corridors, clinical areas, access routes, ventilation considerations and escalation responsibilities before work begins.",
        ],
        points: [
          "Agree monitoring objectives with facility and project teams",
          "Select work-zone, boundary and occupied-area monitoring points",
          "Coordinate alert recipients and response procedures",
          "Document project changes and relevant activities",
          "Review monitoring alongside infection-control and site controls",
        ],
      },
      {
        title: "Important limitation",
        paragraphs: [
          "Particulate monitoring does not identify biological, asbestos or silica composition and does not replace infection-control, occupational hygiene or asbestos-management requirements.",
        ],
      },
    ],
  },

  {
    slug: "dustlight-personal-monitor-overview",
    image: "/assets/dustlight.webp",
    updated: "2026-08-05",
    readingMinutes: 5,
    category: "Device guide",
    title: "Dustlight personal monitor overview",
    summary:
      "How Dustlight gives individual workers immediate real-time particle awareness through a wearable traffic-light display.",
    intro:
      "Dustlight is a capable personal particulate monitor designed to be worn by a worker. Its clear green, amber and red traffic-light display and audible alerts make changing conditions immediately understandable at the point of work.",
    sections: [
      {
        title: "A strong personal monitoring tool",
        paragraphs: [
          "Dustlight provides real-time PM1 and PM2.5 readings, local visual status and audible alerts in a compact wearable format.",
          "When it is charged, switched on, paired and syncing correctly, it gives the wearer valuable immediate feedback and a useful record of personal monitoring conditions.",
        ],
        points: [
          "Wearable and portable",
          "Green, amber and red traffic-light status",
          "Audible alerting",
          "Bluetooth connection to a mobile phone",
          "Local and cloud-supported data workflows",
        ],
      },
      {
        title: "Why installed monitoring is also needed",
        paragraphs: [
          "Personal wearables depend on human routines. Devices may be left at home, not switched on, not paired to Bluetooth or prevented from completing cloud synchronisation.",
          "VerifAir complements Dustlight with an always-on installed architecture, automated redundancy, local buffering and failover so site-wide real-time monitoring does not depend on one worker or one phone.",
        ],
      },
    ],
  },
  {
    slug: "verifair-platform-explainer",
    image: "/assets/verifair-logo.webp",
    updated: "2026-08-05",
    readingMinutes: 5,
    category: "System overview",
    title: "How VerifAir extends Dustlight",
    summary:
      "A clear explanation of how VerifAir turns excellent personal Dustlight monitoring into an always-on site-wide system.",
    intro:
      "Erne Tech developed VerifAir to extend the value of Dustlight beyond the practical range and workflow limitations of a phone-connected Bluetooth wearable.",
    sections: [
      {
        title: "From personal alerting to site-wide visibility",
        paragraphs: [
          "Dustlight remains the trusted sensing and local alerting device. VerifAir adds fixed connectivity, edge processing, automated redundancy, failover, dashboards, alerts and reporting.",
          "The result is real-time monitoring across selected zones without relying on a worker remembering to carry, switch on, pair or sync a device.",
        ],
        points: [
          "Always-on monitoring",
          "Automated redundancy and failover",
          "Local buffering during connectivity interruptions",
          "Customer-branded, project-specific dashboards",
          "Authorised access from remotely where an authorised internet connection is available",
        ],
      },
    ],
  },
  {
    slug: "december-2026-workplace-exposure-limits",
    image: "/assets/reports.webp",
    updated: "2026-08-05",
    readingMinutes: 5,
    category: "Policy readiness",
    title: "Is your site ready for 1 December 2026?",
    summary:
      "A practical readiness guide for Australia's transition to workplace exposure limits for airborne contaminants.",
    intro:
      "From 1 December 2026 Australia adopts workplace exposure limits for airborne contaminants. Project teams should review how monitoring, escalation, records and specialist assessment fit into their existing risk controls.",
    sections: [
      {
        title: "Readiness questions",
        paragraphs: [
          "Use the transition as a prompt to check whether current monitoring arrangements provide timely information, clear responsibilities and reviewable records.",
        ],
        points: [
          "Are monitoring locations aligned with current work and sensitive interfaces?",
          "Are alert owners and backup recipients documented?",
          "Can authorised leaders access current conditions remotely?",
          "Are data gaps and connectivity interruptions visible?",
          "Can reports be reviewed alongside occupational hygiene advice and other controls?",
        ],
      },
      {
        title: "Use official guidance",
        paragraphs: [
          "Confirm current duties and applicable limits with Safe Work Australia and the relevant state or territory regulator. VerifAir supports real-time monitoring and evidence generation but does not replace competent exposure assessment.",
        ],
      },
    ],
  },

];

export function getResource(slug: string) {
  return verifAirResources.find((resource) => resource.slug === slug);
}
