# VERIFAIR — CURRENT IMPLEMENTATION PLAN

> Master implementation direction for the VerifAir solution and public website.
> The website must represent the intended product accurately and must not imply that future capabilities are already production-complete.

## 1. PRODUCT PURPOSE

VerifAir is an operational particulate monitoring and response platform for construction/refurbishment occurring in or near occupied environments.

Core operating model:

**ASSESS → ACT → REPORT**

- **ASSESS / Monitoring** — see changing particulate conditions across sites, zones and monitoring locations.
- **ACT / Workflow** — alert, acknowledge, assign, investigate, record actions, continue monitoring, review and resolve.
- **REPORT / Reporting** — retain the connected operational history and generate reports/evidence records.

VerifAir is not simply a particulate dashboard.

---

## 2. CORE SYSTEM ARCHITECTURE

Target architecture:

**Dustlight monitors**
→ BLE/local communications
→ **VerifAir Edge**
→ resilient Australian mobile connectivity: **Telstra primary / Optus secondary**
→ **VerifAir Platform**
→ authorised browser-based users/displays

The Edge is deployed near the monitoring environment because it must communicate locally with Dustlight devices.

The Control Centre / Wallboard may be located elsewhere — another room, floor, building or remote location.

The monitoring communications path is designed to operate without relying on the customer's local LAN/Wi-Fi.

Customer-facing language should explain what the system does and why it matters without unnecessary engineering jargon. Public product language should prefer **EDGE COMPUTING & LOCAL INTELLIGENCE** and **ACCESS FROM AUTHORISED DEVICES**.

---

## 3. SENSING — DUSTLIGHT

Dustlight provides the particulate sensing layer.

Measurements presented by VerifAir:

- Respirable Dust
- PM1
- PM2.5
- PM10

Dustlight retains observations locally, providing resilience during temporary communications interruption.

VerifAir does **not** manufacture Dustlight.

Public positioning:

**VerifAir. Powered by Dustlight. Engineered by ERNE Tech.**

Do not fabricate Dustlight capabilities, hardware or specifications.

---

## 4. OPERATIONAL STATUS MODEL

Normal users should have ONE particulate operational-state model:

- 🟢 **NORMAL** — below configured attention level
- 🟠 **ATTENTION** — configured attention level reached
- 🔴 **ACTION** — configured action level reached

Configured VerifAir operational levels should align with the relevant Dustlight traffic-light trigger configuration.

Do not expose a second competing Dustlight GREEN/YELLOW/RED status to ordinary users.

Separately show system/data health:

- HEALTHY
- DEGRADED
- STALE
- OFFLINE

Operational condition and system health are different concepts.

Normal user-facing Monitoring screens must not expose a separate Dustlight Device Status. Raw Dustlight state may remain internally for diagnostics, audit or integration validation, but ordinary users should see only the particulate/operational state and system/data health.

System Health answers: **Can the operator rely on the current monitoring view?** Normal dashboards should keep it compact, for example:

**SYSTEM HEALTH — HEALTHY — 4/4 monitoring locations reporting**

Detailed diagnostics may additionally expose monitoring locations reporting, observation freshness, Edge status, Telstra status, Optus status and relevant system diagnostics. Healthy infrastructure should remain visually quiet; degraded, stale or offline infrastructure should become prominent.

Operational dashboard priority is:

1. Operational State
2. Respirable Dust
3. PM1 / PM2.5 / PM10
4. Zone / Monitoring Location
5. Observation freshness where useful
6. Concise System Health

Use progressive disclosure for secondary information. Avoid repeated labels, duplicated hierarchy, excessive badges and unnecessary technical information.

---

## 5. MONITORING / ASSESS

Monitoring supports:

**Portfolio → Site → Zone → Monitoring Location**

Primary interfaces:

- Control Centre / shared operational dashboard
- selected Monitor Detail
- historical trends
- Wallboard / Display Mode
- monitoring-room dashboard
- authorised remote/browser views

Operational colours must provide strong at-a-glance recognition.

Monitoring-location tiles must:

- use consistent dimensions
- show compact site/zone/location hierarchy
- avoid duplicated labels
- prioritise Respirable Dust
- also show PM1 / PM2.5 / PM10
- visibly communicate NORMAL / ATTENTION / ACTION

Mobile primary monitoring grid:

**2 × 2**

Do not publish arbitrary maximum sensor/display capacity until validated.

---

## 6. WORKFLOW / ACT

A configured operational condition can create an operational event.

Target workflow:

**Condition detected**
→ Alert
→ Notify
→ Acknowledge
→ Assign
→ Investigate
→ Record Action
→ Continue Monitoring
→ Review
→ Resolve

Maintain distinction between:

- SYSTEM events
- USER actions

Support lightweight operational collaboration through:

- ownership/assignment
- notes
- comments
- updates

Do not turn VerifAir into a generic project-management platform.

Do not claim a recorded action caused subsequent particulate changes.

Use:

**Recorded Action → Continued Monitoring → Subsequent Observations**

---

## 7. REPORTING / REPORT

The REPORT capability is the connected operational history — not merely PDF generation.

Record may connect:

- observations
- operational trigger/event
- alerts
- notifications
- acknowledgement
- assignment
- investigation
- user-recorded actions
- comments
- subsequent observations
- review
- resolution
- relevant evidence
- generated report

Support historical search/filtering by appropriate project/site/event fields.

Records and reports should support configurable retention requirements.

Do not publish a fixed retention period until commercially/technically confirmed.

Customer-facing positioning:

**VERIFAIR REPORTS SUPPORT COMPLIANCE ACTIVITIES.**

Reports support project documentation, operational review and compliance processes. Do not describe them as compliance reports or claim that they determine, certify or prove compliance, causation, exposure or control effectiveness.

Demonstration/reporting disclosure, shown once at the bottom of a complete demonstration or page and kept visually subordinate:

> Demonstration only. Sites, events, people and readings shown are fictional and are used to demonstrate VerifAir functionality.

---

## 8. VERIFAIR EDGE

Production direction is an **industrial-grade Edge gateway**, not the development Raspberry Pi proof-of-concept.

Customer-facing terminology:

**EDGE COMPUTING & LOCAL INTELLIGENCE**

VerifAir Edge provides local computing and intelligence close to the monitoring environment.

Do not use “AI Intelligence” until a genuine AI capability is implemented.

Target responsibilities:

- local Dustlight/BLE communications
- observation collection
- communications with VerifAir Platform
- connectivity management
- process/system health monitoring
- watchdog/recovery functions
- remote management
- managed software/security updates

Target connectivity:

- **TELSTRA — Primary network**
- **OPTUS — Secondary network**

Customer-facing architecture should use the actual network names. Where switching is not yet validated production functionality, say:

> VerifAir Edge is designed to use the Optus connection if the Telstra connection becomes unavailable.

Do not claim guaranteed or seamless switching, dual SIM or failover as a completed capability.

Do not publicly present unvalidated production hardware as final.

---

## 9. RESILIENCE

Customer-facing language should prefer:

- **AUTOMATIC SYSTEM RECOVERY**
- **DATA RETAINED DURING CONNECTION INTERRUPTIONS**
- **REMOTE MANAGEMENT**
- **REMOTE SOFTWARE & SECURITY UPDATES**
- **EASY TO SCALE**
- **MOVE AS THE PROJECT MOVES**
- **NO RELIANCE ON THE CUSTOMER'S LOCAL NETWORK**
- **ACCESS FROM AUTHORISED DEVICES**

Solution architecture should progressively support:

- Dustlight local data retention
- Edge process monitoring
- watchdog/recovery
- observation freshness monitoring
- primary/secondary network-provider connectivity
- store/synchronise behaviour following interruption where technically supported
- platform/system health visibility

Use:

**resilient**

not:

"failure-proof", "always connected" or "zero downtime".

Do not lead customer-facing language with watchdog, process-supervision, store-and-forward or buffering terminology where a clear outcome-focused phrase is available. Underlying technical terminology may remain in internal engineering documentation.

---

## 10. DEPLOYMENT MODEL

The solution must remain easy to:

- deploy
- relocate
- scale
- move floor-to-floor
- move zone-to-zone
- expand across a site
- expand across multiple sites

Conceptual scaling:

**Multiple monitors → Edge**
**Multiple Edges → Site**
**Multiple Sites → VerifAir Platform**

Avoid fixed public capacity claims until validated.

---

## 11. REMOTE MANAGEMENT & SUPPORT

Target service capability includes:

- remote Edge/system visibility
- communications-health visibility
- remote diagnostics
- software/service management
- security patching/update capability
- support processes
- deployment assistance

Potential future/service offerings may include:

- remote support
- onsite support
- commissioning
- calibration coordination
- maintenance
- managed service options

Do not advertise an SLA, 24/7 support, onsite calibration service or other service commitment until commercially established.

Public customer-facing service language should prefer **REMOTE MANAGEMENT** and **REMOTE SOFTWARE & SECURITY UPDATES**. Target or future service capabilities must not be presented as current implementation.

---

## 12. OCCUPATIONAL HYGIENE / PROFESSIONAL SERVICES

VerifAir supports operational particulate visibility.

It does not replace occupational hygiene expertise, personal exposure monitoring or professional assessment where required.

Potential delivery/partner model may include occupational hygienists for:

- monitoring strategy
- trigger/threshold guidance
- interpretation
- exposure assessment
- project-specific professional advice
- validation where appropriate

Keep this as a potential professional-services/partnership layer until formally established.

---

## 13. PARTNERS / TECHNOLOGY RELATIONSHIPS

### Dustlight
Core sensing technology relationship.

Website may reference Dustlight accurately and transparently.

### ERNE Tech
VerifAir is engineered by ERNE Tech.

ERNE brings 20+ years of IT/systems-engineering experience and operates within the ERNE family-business umbrella.

### Other potential partners
Do not publicly present unconfirmed organisations or service providers as VerifAir partners.

Partnership strategy can be developed separately.

---

## 14. SECURITY / COMPLIANCE

Before scaled production deployment, implementation planning must address:

- authentication/authorisation
- role-based access
- secure communications
- device/Edge hardening
- patch/update management
- credential management
- auditability
- backups/recovery
- privacy
- data hosting/residency requirements
- retention/deletion
- vulnerability management
- incident response
- supplier dependencies
- applicable Australian regulatory/customer requirements

Website must not claim certifications, standards compliance or security guarantees until achieved and evidenced.

Customer-facing language should explain what VerifAir does and why it matters for construction managers, project managers, facility/hospital representatives and monitoring-room operators. Avoid unnecessary engineering jargon on public pages while retaining precise internal engineering terminology where needed.

---

## 15. PRODUCT COMPLEXITY RULE

Build the simplest version that delivers the operational value.

Do NOT prematurely build:

- giant workflow engines
- complex workforce scheduling
- arbitrary integrations
- excessive configuration
- enterprise features without validated demand
- unnecessary status systems
- multiple applications where responsive browser views suffice

Architecture should permit future expansion without forcing those complexities into V1.

---

## 16. WEBSITE INFORMATION ARCHITECTURE

Primary navigation:

**PRODUCT**
- Monitoring — ASSESS
- Workflow — ACT
- Reporting — REPORT

**SOLUTIONS**
- deployment/use-case offerings

**HOW IT WORKS**
- Dustlight
- Edge
- BLE/local communications
- resilient connectivity
- VerifAir Platform
- remote/browser access
- system architecture

**RESOURCES**
- Knowledge Base
- educational content
- guides
- campaign/regulatory content

**ABOUT**
- VerifAir
- ERNE Tech
- engineering background
- technology relationships

**CONTACT**

---

## 17. WEBSITE PAGE RESPONSIBILITIES

### Homepage
Sell the overall proposition quickly.

Do not overload with technical architecture, disclaimers or complete product detail.

### Monitoring
Show the ASSESS product experience.

Focus on dashboards, monitoring locations, measurements, trends, Wallboard and operational visibility.

### Workflow
Show ACT.

Focus on operational events, alerts, acknowledgement, assignment, investigation, recorded actions and resolution.

### Reporting
Show REPORT.

Focus on connected history, event register, traceability, retention and generated reporting.

### How It Works
Explain the actual technology architecture and resilience model.

### Solutions
Explain where/how VerifAir is deployed.

Allow future solution categories such as indoor/occupied-environment and outdoor applications without restructuring the entire site.

### Resources
Education and deeper technical/industry information.

---

## 18. WEBSITE VISUAL RULES

Every substantive public page should have a relevant hero visual.

For Product pages:

- Monitoring → ASSESS process image
- Workflow → ACT process image
- Reporting → REPORT process image

Move detailed product UI below the hero into the relevant product section.

New imagery must:

- be realistic unless intentionally diagrammatic
- be page-specific
- support mobile and desktop
- be web optimised
- use real approved hardware imagery only

**Never fabricate Dustlight, VerifAir Edge or other product hardware.**

---

## 19. WEBSITE CLAIMS RULE

The website must distinguish between:

**Implemented/current capability**
→ may be presented as product functionality.

**Target/in-development capability**
→ use qualified language such as "designed to", "intended to", or omit from public marketing until sufficiently established.

**Future possibility**
→ do not present as existing functionality.

Avoid unsupported claims including:

- compliance achieved
- safe / unsafe
- exposure determination
- cause determination
- control effectiveness
- guaranteed connectivity
- zero downtime
- fixed device capacity
- fixed retention duration
- certifications not obtained
- unsupported security guarantees

---

## 20. CURRENT IMPLEMENTATION PRIORITY

Priority order:

1. Complete coherent public website/product UX.
2. Maintain one canonical product/data/status model.
3. Industrialise VerifAir Edge architecture.
4. Validate Dustlight ↔ Edge integration and recovery behaviour.
5. Validate dual-provider communications.
6. Implement/test remote management and system health.
7. Harden security/update architecture.
8. Validate Monitoring scalability/capacity.
9. Mature ACT workflow.
10. Mature REPORT/reporting.
11. Define support/service model.
12. Define occupational-hygiene partnership model.
13. Pilot in controlled real-world deployment.
14. Use pilot evidence to determine later features/integrations.

---

## 21. CODEX IMPLEMENTATION RULE

Before changing public-facing functionality or copy, check this plan.

The website must describe the product being built — not invent capabilities to make the website look more complete.

Do not silently turn future-state capabilities into current product claims.

Do not introduce a second:

- status taxonomy
- measurement model
- event model
- architecture model
- reporting model

Reuse canonical shared product configuration/data wherever possible.

When a requested website representation conflicts with this implementation plan, flag the conflict rather than inventing a solution.
