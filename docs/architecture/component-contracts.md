# Component and Domain Ownership Contracts

## Status

The scenario, validation, replay and playback contracts below are implemented
for the public deterministic demonstration. Future provider and production
platform contracts remain target architecture unless `current-state.md`
records them as implemented.

## Ownership principles

- One canonical entity owns each fact.
- References link related entities; consumers do not duplicate measurements,
  actions, timeline events or evidence payloads.
- Scenario input is validated before replay.
- The replay engine is deterministic and presentation-independent.
- Presentation consumes replay state and never becomes the source of incident
  truth.

## ScenarioDefinition

Owns the immutable, versioned synthetic scenario input:

- stable scenario ID and version;
- scenario start as a UTC ISO-8601 timestamp;
- integer duration in milliseconds;
- explicit simulated-data label and provenance;
- canonical observations, incidents, actions and timeline references;
- declared interpolation policy, defaulting to hold-last-known-value;
- display-timezone metadata that cannot affect ordering.

Scenario validation rejects invalid IDs, offsets outside bounds, non-integer
offsets, invalid UTC timestamps, dangling references, undeclared interpolation
behaviour and ambiguous order-sensitive same-offset events.

## IncidentTimelineEvent

The canonical timeline event contains:

```ts
interface IncidentTimelineEvent {
  id: string;
  offsetMs: number;
  timestamp?: string;
  type: string;
  title: string;
  description?: string;
  severity?: string;
  category?: string;
  relatedEntityRefs: CanonicalEntityRef[];
}
```

The final unions and reference shape are M1A implementation decisions subject
to tests and human diff review. The invariant fields and semantics above are
approved. `timestamp`, where present, is UTC ISO-8601. Related entity
references point to canonical data and do not repeat it.

Canonical replay ordering is ascending integer `offsetMs`. Order-sensitive
timeline events must not share the same `offsetMs`. Same-offset events are
permitted only when their relative ordering has no semantic effect. Scenario
validation rejects ambiguous order-sensitive same-offset events. No sequence
field is introduced at this stage.

## ReplayEngine

Owns deterministic state calculation at an explicit integer `offsetMs`:

- clamps seeks to `[0, durationMs]`;
- uses start-inclusive/end-exclusive intervals except at the terminal position;
- applies validated events and observations in ascending integer `offsetMs`;
- holds the last known observation unless an approved policy says otherwise;
- never derives behaviour from UI render frequency or local timezone;
- returns a complete immutable replay-state view for consumers.

The engine does not own playback timers, React state, DOM concerns, analytics,
network calls or regulatory interpretation.

## Playback clock

A future playback clock may implement play, pause, restart, seek and approved
rates. It owns the requested current position, not incident truth. It delegates
all state derivation to `ReplayEngine`.

## Presentation consumers

Replay, environmental, incident-centre and reporting UI consumers:

- receive canonical state or selectors;
- format display timezone without mutating ordering;
- provide accessible text alternatives and reduced-motion behaviour;
- do not interpolate, invent or independently classify measurements;
- do not infer causation or regulatory compliance.

## Interactive response projection

`DemonstrationSession` is the aggregate read model consumed by interactive
demonstration surfaces. It combines engine-derived `ReplayState` with a
browser-session response projection. The response projection:

- derives incident ID, monitor ID, opening offset and trigger text from the
  validated replay incident;
- owns only user-entered acknowledgement, assignment, investigation,
  evidence-reference, verification and closure events;
- cannot mutate replay observations, scenario actions, scenario evidence,
  resolutions or timeline facts;
- is not live telemetry, persistence or evidence that the future authenticated
  Incident Centre has been delivered.

Static Workflow and Reporting timelines must project canonical scenario events.
Report previews may combine replay state and response-projection entries only
through the shared `DemonstrationSession` snapshot.

## Future provider boundaries

Weather, telemetry, lead and AI provider interfaces are target architecture.
They must be separately approved and must preserve demo/live separation. Their
names in SPEC-001 are illustrative until their implementation task defines the
actual repository contracts.

## Existing-component integration boundary

Current demonstration components remain presentation evidence only. Before UI
integration, the remaining M1 task must identify which components can consume
M1A state and which static structures should be replaced. M1A must not rewrite
those components.
