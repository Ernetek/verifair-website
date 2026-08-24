/**
 * VerifAir Demonstration Session & Controller Abstraction
 * 
 * Combines:
 * 1. Environmental replay state (ReplayPlaybackController)
 * 2. Interactive incident-response projection (IncidentState & IncidentEvents)
 * 3. Unified subscription model for React useSyncExternalStore
 * 4. Meaningful scenario marker navigation (Prev / Next event markers)
 */

import {
  publicDemonstrationScenario,
} from "@/lib/replay/demonstration-scenario";
import type { ReplayState } from "@/lib/replay/domain";
import {
  ReplayPlaybackController,
  type ReplayRate,
} from "@/lib/replay/playback-controller";
import {
  createInitialIncidentState,
  reduceIncident,
  reduceIncidentEvent,
  type IncidentEvent,
  type IncidentState,
} from "@/lib/demonstration/incident-domain";


type IncidentEventInput =
  IncidentEvent extends infer Event
    ? Event extends IncidentEvent
      ? Omit<Event, "incidentId" | "sequence" | "timestampMs"> & {
          timestampMs?: number;
        }
      : never
    : never;
export interface DemonstrationMarker {
  readonly offsetMs: number;
  readonly label: string;
  readonly description: string;
}

export const MEANINGFUL_SCENARIO_MARKERS: readonly DemonstrationMarker[] = [
  { offsetMs: 0, label: "Start monitoring", description: "Normal baseline operating conditions" },
  { offsetMs: 120_000, label: "Alert opened", description: "Fictional configured operational trigger reached at the monitored boundary" },
  { offsetMs: 240_000, label: "Investigation", description: "Response owner assigned and site investigation started" },
  { offsetMs: 360_000, label: "Verification", description: "Recorded actions and later observations reviewed" },
  { offsetMs: 480_000, label: "Closure", description: "Incident closed with evidence retained for audit" },
] as const;

export interface DemonstrationSessionSnapshot {
  readonly replayState: ReplayState;
  readonly incidentState: IncidentState;
  readonly isPlaying: boolean;
  readonly rate: ReplayRate;
  readonly currentMarkerIndex: number;
}

type Listener = (snapshot: DemonstrationSessionSnapshot) => void;

export interface DemoEvidenceAsset {
  readonly evidenceId: string;
  readonly name: string;
  readonly previewUrl: string;
}

const scenarioIncident = publicDemonstrationScenario.incidents[0];

if (!scenarioIncident?.monitorId) {
  throw new Error("The public demonstration requires one monitor-linked canonical incident.");
}

const INITIAL_SCENARIO_EVENTS: readonly IncidentEvent[] = [
  {
    type: "INCIDENT_OPENED",
    incidentId: scenarioIncident.id,
    monitorId: scenarioIncident.monitorId,
    triggerCondition: scenarioIncident.title,
    timestampMs: scenarioIncident.openedOffsetMs,
    sequence: 1,
  },
];

export class DemonstrationSession {
  readonly #playbackController: ReplayPlaybackController;
  readonly #listeners = new Set<Listener>();
  #userEvents: IncidentEvent[] = [];
  readonly #evidenceAssets = new Map<string, DemoEvidenceAsset>();
  #snapshot: DemonstrationSessionSnapshot;
  readonly #autoPlay: boolean;
  #demoTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(controller?: ReplayPlaybackController, autoPlay: boolean = false) {
    this.#playbackController =
      controller ?? new ReplayPlaybackController(publicDemonstrationScenario);
    this.#autoPlay = autoPlay;

    this.#snapshot = this.#computeSnapshot();
    this.#playbackController.subscribe(this.#onPlaybackChange);

    // Auto-play deterministic scenario internally
    if (this.#autoPlay) {
      // Delay start to allow React hydration
      setTimeout(() => {
        this.#playbackController.play();
      }, 100);
    }
  }

  getSnapshot = (): DemonstrationSessionSnapshot => this.#snapshot;

  start(): void {
    if (this.#snapshot.replayState.isTerminal) return;
    this.play();
    if (this.#demoTimer === null && typeof window !== "undefined") {
      // Fast-forward to the alert trigger within ~3s, then settle into a steady cadence.
      const alertOffsetMs = MEANINGFUL_SCENARIO_MARKERS[1]?.offsetMs ?? 120_000;
      const tick = () => {
        const currentOffset = this.#snapshot.replayState.offsetMs;
        const isBeforeAlert = currentOffset < alertOffsetMs;
        const step = isBeforeAlert ? 50_000 : 30_000;
        const delay = isBeforeAlert ? 900 : 3_000;
        const nextOffset = currentOffset + step;
        if (nextOffset >= this.#playbackController.durationMs) {
          this.#playbackController.seek(this.#playbackController.durationMs);
          this.#clearDemoTimer();
          return;
        }
        this.#playbackController.seek(nextOffset);
        this.#demoTimer = setTimeout(tick, delay);
      };
      this.#demoTimer = setTimeout(tick, 900);
    }
    this.#updateSnapshot();
  }

  setRate(rate: ReplayRate): void {
    this.#playbackController.setRate(rate);
    this.#updateSnapshot();
  }

  subscribe = (listener: Listener): (() => void) => {
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  };

  play(): void {
    this.#playbackController.play();
  }

  pause(): void {
    this.#playbackController.pause();
    this.#clearDemoTimer();
    this.#updateSnapshot();
  }

  restart(): void {
    this.#userEvents = [];
    this.#playbackController.restart();
    this.#updateSnapshot();
  }

  seek(offsetMs: number): void {
    this.#playbackController.seek(offsetMs);
  }

  seekToMarker(direction: "prev" | "next"): void {
    const currentOffset = this.#snapshot.replayState.offsetMs;
    if (direction === "next") {
      const nextMarker = MEANINGFUL_SCENARIO_MARKERS.find(
        (m) => m.offsetMs > currentOffset + 1_000,
      );
      this.seek(nextMarker?.offsetMs ?? this.#playbackController.durationMs);
      return;
    }

    const previousMarkers = MEANINGFUL_SCENARIO_MARKERS.filter(
      (m) => m.offsetMs < currentOffset - 1_000,
    );
    this.seek(
      previousMarkers.length > 0
        ? previousMarkers[previousMarkers.length - 1].offsetMs
        : 0,
    );
  }

  registerEvidenceAsset(asset: DemoEvidenceAsset): void {
    this.#evidenceAssets.set(asset.evidenceId, asset);
  }

  getEvidenceAsset(evidenceId: string): DemoEvidenceAsset | undefined {
    return this.#evidenceAssets.get(evidenceId);
  }

  /** @internal For testing only */
  _testOnlyPlay(): void {
    this.play();
  }

  /** @internal For testing only */
  _testOnlyPause(): void {
    this.pause();
  }

  /** @internal For testing only */
  _testOnlyRestart(): void {
    this.restart();
  }

  /** @internal For testing only */
  _testOnlySeek(offsetMs: number): void {
    this.seek(offsetMs);
  }

  /** @internal For testing only */
  _testOnlySetRate(rate: ReplayRate): void {
    this.#playbackController.setRate(rate);
  }

  /** @internal For testing only */
  _testOnlySeekToMarker(direction: "prev" | "next"): void {
    this.seekToMarker(direction);
  }

  dispatchIncidentEvent(
    eventInput: IncidentEventInput,
  ): { ok: true } | { ok: false; error: string } {
    const currentOffset = this.#snapshot.replayState.offsetMs;
    const timestampMs = eventInput.timestampMs ?? currentOffset;
    const incidentId = scenarioIncident.id;

    const nextSeq =
      INITIAL_SCENARIO_EVENTS.length + this.#userEvents.length + 1;

    const fullEvent = {
      ...eventInput,
      incidentId,
      timestampMs,
      sequence: nextSeq,
    } as IncidentEvent;

    // Validate event against current effective incident state
    const validationResult = reduceIncidentEvent(
      this.#snapshot.incidentState,
      fullEvent,
    );

    if (!validationResult.ok) {
      return { ok: false, error: validationResult.error };
    }

    this.#userEvents.push(fullEvent);
    this.#updateSnapshot();
    return { ok: true };
  }

  #computeSnapshot(): DemonstrationSessionSnapshot {
    const pbSnap = this.#playbackController.getSnapshot();
    const currentOffset = pbSnap.state.offsetMs;

    // Filter events at or before current replay timestamp
    const activeEvents = [
      ...INITIAL_SCENARIO_EVENTS,
      ...this.#userEvents,
    ].filter((e) => e.timestampMs <= currentOffset);

    const incidentState = reduceIncident(
      activeEvents,
      createInitialIncidentState(
        scenarioIncident.id,
        scenarioIncident.monitorId,
        scenarioIncident.title,
      ),
    );

    // Compute marker index
    let currentMarkerIndex = 0;
    for (let i = 0; i < MEANINGFUL_SCENARIO_MARKERS.length; i++) {
      if (currentOffset >= MEANINGFUL_SCENARIO_MARKERS[i].offsetMs) {
        currentMarkerIndex = i;
      }
    }

    return {
      replayState: pbSnap.state,
      incidentState,
      isPlaying: pbSnap.isPlaying,
      rate: pbSnap.rate,
      currentMarkerIndex,
    };
  }

  #onPlaybackChange = (): void => {
    this.#updateSnapshot();
  };

  #updateSnapshot(): void {
    this.#snapshot = this.#computeSnapshot();
    for (const listener of this.#listeners) {
      listener(this.#snapshot);
    }
  }

  get playbackController(): ReplayPlaybackController {
    return this.#playbackController;
  }

  get durationMs(): number {
    return this.#playbackController.durationMs;
  }

  get currentOffsetMs(): number {
    return this.#snapshot.replayState.offsetMs;
  }

  get isTerminal(): boolean {
    return this.#snapshot.replayState.isTerminal;
  }

  #clearDemoTimer(): void {
    if (this.#demoTimer !== null) {
      clearTimeout(this.#demoTimer);
      this.#demoTimer = null;
    }
  }
}

// Global shared session singleton for unified view state across routes
let sharedSessionInstance: DemonstrationSession | null = null;

export function getSharedDemonstrationSession(): DemonstrationSession {
  if (!sharedSessionInstance) {
    sharedSessionInstance = new DemonstrationSession(undefined, false);
  }
  return sharedSessionInstance;
}
