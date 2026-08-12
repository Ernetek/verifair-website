"use client";

import { useSyncExternalStore } from "react";

import {
  REPLAY_RATES,
  type ReplayPlaybackController,
  type ReplayRate,
} from "@/lib/replay/playback-controller";

function formatElapsed(positionMs: number): string {
  const seconds = Math.floor(positionMs / 1_000);
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

export function ReplayControls({
  controller,
}: {
  readonly controller: ReplayPlaybackController;
}) {
  const snapshot = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  );
  const { state, isPlaying, rate } = snapshot;
  const stepMs = Math.max(1_000, Math.round(controller.durationMs / 4));

  return (
    <section
      aria-label="Demonstration playback controls"
      className="border border-slate-300 bg-white p-4"
    >
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn btn-primary"
          disabled={state.isTerminal}
          onClick={() => (isPlaying ? controller.pause() : controller.play())}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => controller.restart()}
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
              controller.setRate(Number(event.currentTarget.value) as ReplayRate)
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
          max={controller.durationMs}
          step={1_000}
          value={state.offsetMs}
          onChange={(event) => controller.seek(Number(event.currentTarget.value))}
        />
      </label>
      <p aria-live="polite" className="mt-2 text-sm text-slate-700">
        {formatElapsed(state.offsetMs)} / {formatElapsed(controller.durationMs)}
        {state.isTerminal ? " · Demonstration complete" : ""}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-secondary"
          disabled={state.offsetMs === 0}
          onClick={() => controller.seek(state.offsetMs - stepMs)}
        >
          Previous step
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={state.isTerminal}
          onClick={() => controller.seek(state.offsetMs + stepMs)}
        >
          Next step
        </button>
      </div>
    </section>
  );
}
