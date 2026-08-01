export type VerifAirResource = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  intro: string;
  sections: Array<{
    title: string;
    paragraphs: string[];
    points?: string[];
  }>;
};

export const verifAirResources: VerifAirResource[] = [
  {
    slug: "pm-particle-size-guide",
    category: "Technical explainer",
    title: "PM1, PM2.5 and PM10 explained",
    summary:
      "A plain-language guide to the particulate-size readings used in environmental monitoring.",
    intro:
      "PM1, PM2.5 and PM10 describe particle-size fractions measured by particulate monitors. They provide useful information about changing conditions, but they do not identify the chemical or mineral composition of airborne material.",
    sections: [
      {
        title: "What the numbers mean",
        paragraphs: [
          "The number refers to an aerodynamic particle-size fraction measured in micrometres. PM10 includes coarser particles, while PM2.5 and PM1 describe progressively smaller fractions.",
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
          "PM1, PM2.5 and PM10 trends",
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
];

export function getResource(slug: string) {
  return verifAirResources.find((resource) => resource.slug === slug);
}
