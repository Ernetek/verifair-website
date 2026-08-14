"use client";

import { useSyncExternalStore } from "react";

import {
  DemonstrationSession,
  getSharedDemonstrationSession,
  MEANINGFUL_SCENARIO_MARKERS,
} from "@/lib/demonstration/session";
import { REPLAY_RATES, type ReplayRate } from "@/lib/replay/playback-controller";

function formatElapsed(positionMs: number): string {
  const seconds = Math.floor(positionMs / 1_000);
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

export function ReplayControls({
  session: sessionProp,
}: {
  readonly session?: DemonstrationSession;
}) {
  const session = sessionProp ?? getSharedDemonstrationSession();
  const snapshot = useSyncExternalStore(
    session.subscribe,
    session.getSnapshot,
    session.getSnapshot,
  );
  const { replayState, isPlaying, rate, currentMarkerIndex } = snapshot;

  return (
    <section
      aria-label="Demonstration playback controls"
      className="border border-slate-300 bg-white p-4"
    >
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn btn-primary"
          disabled={replayState.isTerminal}
          onClick={() => (isPlaying ? session._testOnlyPause() : session._testOnlyPlay())}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => session._testOnlyRestart()}
        >
          Restart
        </button>
        <label className="ml-auto flex min-h-11 items-center gap-2 text-sm font-bold text-slate-800">
          Playback speed
          <select
            aria-label="Playback speed"
            className="min-h-11 border border-slate-300 bg-white px-3"
            value={rate}
            onChange={(event) =>
              session._testOnlySetRate(Number(event.currentTarget.value) as ReplayRate)
            }
          >
            {REPLAY_RATES.map((availableRate) => (
              <option key={availableRate} value={availableRate}>
                {availableRate}×
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block text-sm font-bold text-slate-800">
        Scenario position
        <input
          aria-label="Scenario position"
          className="mt-2 block min-h-11 w-full accent-blue-600"
          type="range"
          min={0}
          max={session.durationMs}
          step={1_000}
          value={replayState.offsetMs}
          onChange={(event) => session._testOnlySeek(Number(event.currentTarget.value))}
        />
      </label>
      <div aria-live="polite" className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-700">
        <span>
          {formatElapsed(replayState.offsetMs)} / {formatElapsed(session.durationMs)}
          {replayState.isTerminal ? " · Demonstration complete" : ""}
        </span>
        <span className="font-semibold text-blue-700">
          Marker {currentMarkerIndex + 1} of {MEANINGFUL_SCENARIO_MARKERS.length}: {MEANINGFUL_SCENARIO_MARKERS[currentMarkerIndex]?.label}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="btn btn-secondary"
          disabled={replayState.offsetMs === 0}
          onClick={() => session._testOnlySeekToMarker("prev")}
        >
          ← Previous scenario marker
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={replayState.isTerminal || replayState.offsetMs >= session.durationMs}
          onClick={() => session._testOnlySeekToMarker("next")}
        >
          Next scenario marker →
        </button>
      </div>
    </section>
  );
}
