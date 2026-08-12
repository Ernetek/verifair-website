# M1B-005 — Public product demonstration dataset approval

Status: approved by Niall on 13 August 2026; encoded for public integration

Scenario ID: `VERIFAIR_PUBLIC_CONSTRUCTION_DEMO`  
Version: `2026-08-13.1`  
Label: `SIMULATED DEMONSTRATION DATA`  
Timezone for display: `Australia/Sydney`  
Unit for all readings: `µg/m³`

## Metric decision

The verified Dustlight BLE payload supplies PM1, PM2.5, respirable dust and PM10. It does not supply a metric identified as PM4.0. The public demonstration will therefore display `Respirable dust` and will not relabel or infer it as PM4.0.

Evidence: supplier correspondence records the ASCII payload as `<unix_timestamp>,<PM1>,<PM2.5>,<RespirableDust>,<PM10>,...` and confirms successful parsing of all four supplied fields.

## Frozen simulated observations

These values are fictional product-demonstration records. They are not customer, workplace, reference-instrument or compliance measurements.

| Offset | Monitoring location | PM1 | PM2.5 | Respirable dust | PM10 |
| ---: | --- | ---: | ---: | ---: | ---: |
| 00:00 | Work Zone A | 8 | 12 | 10 | 18 |
| 00:00 | Occupied Interface | 4 | 7 | 6 | 12 |
| 00:00 | Shared Corridor | 3 | 5 | 4 | 9 |
| 00:00 | External Boundary | 6 | 9 | 8 | 15 |
| 02:00 | Work Zone A | 16 | 26 | 21 | 38 |
| 02:00 | Occupied Interface | 5 | 8 | 7 | 14 |
| 02:00 | Shared Corridor | 4 | 6 | 5 | 11 |
| 02:00 | External Boundary | 7 | 11 | 9 | 18 |
| 04:00 | Work Zone A | 22 | 38 | 31 | 56 |
| 04:00 | Occupied Interface | 7 | 11 | 9 | 18 |
| 04:00 | Shared Corridor | 5 | 8 | 7 | 14 |
| 04:00 | External Boundary | 8 | 13 | 11 | 21 |
| 06:00 | Work Zone A | 18 | 29 | 24 | 45 |
| 06:00 | Occupied Interface | 6 | 10 | 8 | 16 |
| 06:00 | Shared Corridor | 4 | 7 | 6 | 12 |
| 06:00 | External Boundary | 7 | 12 | 10 | 19 |
| 08:00 | Work Zone A | 11 | 17 | 14 | 27 |
| 08:00 | Occupied Interface | 5 | 8 | 7 | 13 |
| 08:00 | Shared Corridor | 3 | 6 | 5 | 10 |
| 08:00 | External Boundary | 6 | 10 | 8 | 16 |

## Frozen timeline and incident narrative

| Offset | Canonical record | Public wording |
| ---: | --- | --- |
| 00:00 | Scenario started | Simulated monitoring period started. |
| 02:00 | Incident opened | Changing particulate conditions recorded at Work Zone A; review started. |
| 04:00 | Action recorded | The demonstration response record notes that work was reviewed and local controls were checked. |
| 06:00 | Evidence recorded | Follow-up simulated readings and the response note were retained with the incident record. |
| 08:00 | Resolution recorded | The demonstration incident was closed after review. The sequence does not claim that the recorded action caused the later readings. |

## Public presentation rules

- Start paused; provide play, pause, restart, seek and 0.5×/1×/2× controls.
- Display all four captured fields: PM1, PM2.5, respirable dust and PM10.
- Label the dataset simulated wherever readings are shown.
- Use neutral reading-quality and incident-lifecycle language only.
- Do not display regulatory thresholds, compliance status, automatic breach determinations, source attribution or action-effectiveness claims.
- Charts, cards, timeline and incident state must derive from the same canonical replay position.
- No autoplay is required for users who prefer reduced motion.

## Approval record

Niall explicitly approved the numeric dataset on 13 August 2026. The approval covers every numeric observation, monitor name, metric, unit, offset, event and wording in this document.
