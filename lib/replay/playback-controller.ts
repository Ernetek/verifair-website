import type { ReplayState } from "@/lib/replay/domain";
import { evaluateAt } from "@/lib/replay/engine";
import type { ValidatedScenario } from "@/lib/replay/validation";

export const REPLAY_RATES = [0.5, 1, 2] as const;
const REPLAY_RENDER_INTERVAL_MS = 100;
export type ReplayRate = (typeof REPLAY_RATES)[number];

export interface ReplayPlaybackSnapshot {
  readonly state: ReplayState;
  readonly isPlaying: boolean;
  readonly rate: ReplayRate;
}

export interface ReplayPlaybackScheduler {
  now(): number;
  requestFrame(callback: (timestampMs: number) => void): number;
  cancelFrame(handle: number): void;
}

const browserScheduler: ReplayPlaybackScheduler = {
  now: () => performance.now(),
  requestFrame: (callback) => requestAnimationFrame(callback),
  cancelFrame: (handle) => cancelAnimationFrame(handle),
};

type Listener = (snapshot: ReplayPlaybackSnapshot) => void;

export class ReplayPlaybackController {
  readonly #scenario: ValidatedScenario;
  readonly #scheduler: ReplayPlaybackScheduler;
  readonly #listeners = new Set<Listener>();
  #snapshot: ReplayPlaybackSnapshot;
  #frameHandle: number | null = null;
  #lastFrameTimestampMs: number | null = null;
  #fractionalPositionMs = 0;

  constructor(
    scenario: ValidatedScenario,
    scheduler: ReplayPlaybackScheduler = browserScheduler,
  ) {
    this.#scenario = scenario;
    this.#scheduler = scheduler;
    this.#snapshot = {
      state: this.#evaluate(0),
      isPlaying: false,
      rate: 1,
    };
  }

  getSnapshot = (): ReplayPlaybackSnapshot => this.#snapshot;

  get durationMs(): number {
    return this.#scenario.durationMs;
  }

  subscribe = (listener: Listener): (() => void) => {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  };

  play(): void {
    if (this.#snapshot.isPlaying || this.#snapshot.state.isTerminal) return;
    this.#lastFrameTimestampMs = this.#scheduler.now();
    this.#setSnapshot({ ...this.#snapshot, isPlaying: true });
    this.#scheduleFrame();
  }

  pause(): void {
    if (!this.#snapshot.isPlaying) return;
    this.#cancelFrame();
    this.#lastFrameTimestampMs = null;
    this.#setSnapshot({ ...this.#snapshot, isPlaying: false });
  }

  restart(): void {
    const wasPlaying = this.#snapshot.isPlaying;
    this.#cancelFrame();
    this.#fractionalPositionMs = 0;
    this.#lastFrameTimestampMs = wasPlaying ? this.#scheduler.now() : null;
    this.#setSnapshot({
      ...this.#snapshot,
      state: this.#evaluate(0),
      isPlaying: wasPlaying,
    });
    if (wasPlaying) this.#scheduleFrame();
  }

  seek(positionMs: number): void {
    if (!Number.isSafeInteger(positionMs)) {
      throw new TypeError("Replay position must be a safe integer number of milliseconds.");
    }
    const state = this.#evaluate(positionMs);
    const isPlaying = this.#snapshot.isPlaying && !state.isTerminal;
    this.#fractionalPositionMs = state.offsetMs;
    this.#lastFrameTimestampMs = isPlaying ? this.#scheduler.now() : null;
    if (!isPlaying) this.#cancelFrame();
    this.#setSnapshot({ ...this.#snapshot, state, isPlaying });
  }

  setRate(rate: ReplayRate): void {
    if (!REPLAY_RATES.includes(rate)) {
      throw new RangeError(`Unsupported replay rate: ${rate}`);
    }
    this.#lastFrameTimestampMs = this.#snapshot.isPlaying
      ? this.#scheduler.now()
      : null;
    this.#setSnapshot({ ...this.#snapshot, rate });
  }

  dispose(): void {
    this.#cancelFrame();
    this.#listeners.clear();
    this.#lastFrameTimestampMs = null;
    if (this.#snapshot.isPlaying) {
      this.#snapshot = { ...this.#snapshot, isPlaying: false };
    }
  }

  #scheduleFrame(): void {
    if (this.#frameHandle !== null) return;
    this.#frameHandle = this.#scheduler.requestFrame(this.#onFrame);
  }

  #onFrame = (timestampMs: number): void => {
    this.#frameHandle = null;
    if (!this.#snapshot.isPlaying) return;

    const previousTimestamp = this.#lastFrameTimestampMs ?? timestampMs;
    const elapsedMs = Math.max(0, timestampMs - previousTimestamp);
    this.#lastFrameTimestampMs = timestampMs;
    this.#fractionalPositionMs += elapsedMs * this.#snapshot.rate;

    const requestedPositionMs = Math.round(this.#fractionalPositionMs);
    const shouldPublish =
      requestedPositionMs >= this.#scenario.durationMs ||
      requestedPositionMs - this.#snapshot.state.offsetMs >=
        REPLAY_RENDER_INTERVAL_MS;

    if (!shouldPublish) {
      this.#scheduleFrame();
      return;
    }

    const state = this.#evaluate(requestedPositionMs);
    this.#fractionalPositionMs = state.offsetMs;
    const isPlaying = !state.isTerminal;
    this.#setSnapshot({ ...this.#snapshot, state, isPlaying });

    if (isPlaying) this.#scheduleFrame();
    else this.#lastFrameTimestampMs = null;
  };

  #cancelFrame(): void {
    if (this.#frameHandle === null) return;
    this.#scheduler.cancelFrame(this.#frameHandle);
    this.#frameHandle = null;
  }

  #evaluate(positionMs: number): ReplayState {
    const result = evaluateAt(this.#scenario, positionMs);
    if (!result.ok) {
      throw new TypeError("Replay position must be a safe integer number of milliseconds.");
    }
    return result.state;
  }

  #setSnapshot(snapshot: ReplayPlaybackSnapshot): void {
    this.#snapshot = snapshot;
    for (const listener of this.#listeners) listener(snapshot);
  }
}
