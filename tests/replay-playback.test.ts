import { describe, expect, it } from "vitest";

import {
  ReplayPlaybackController,
  type ReplayPlaybackScheduler,
} from "@/lib/replay/playback-controller";
import { validateScenario } from "@/lib/replay/validation";
import { createMechanicsOnlyScenario } from "@/tests/replay-fixtures";

class FakeScheduler implements ReplayPlaybackScheduler {
  timeMs = 0;
  #nextHandle = 1;
  #callbacks = new Map<number, (timestampMs: number) => void>();

  now = () => this.timeMs;

  requestFrame = (callback: (timestampMs: number) => void): number => {
    const handle = this.#nextHandle++;
    this.#callbacks.set(handle, callback);
    return handle;
  };

  cancelFrame = (handle: number): void => {
    this.#callbacks.delete(handle);
  };

  advance(elapsedMs: number): void {
    this.timeMs += elapsedMs;
    const callbacks = [...this.#callbacks.values()];
    this.#callbacks.clear();
    callbacks.forEach((callback) => callback(this.timeMs));
  }

  get pendingFrames(): number {
    return this.#callbacks.size;
  }
}

function setup() {
  const validation = validateScenario(createMechanicsOnlyScenario());
  if (!validation.ok) throw new Error("Mechanics fixture must validate");
  const scheduler = new FakeScheduler();
  return {
    scheduler,
    controller: new ReplayPlaybackController(validation.value, scheduler),
  };
}

describe("ReplayPlaybackController", () => {
  it("plays deterministically, pauses and resumes from the held position", () => {
    const { controller, scheduler } = setup();
    controller.play();
    scheduler.advance(1_000);
    expect(controller.getSnapshot().state.offsetMs).toBe(1_000);
    controller.pause();
    scheduler.advance(500);
    expect(controller.getSnapshot().state.offsetMs).toBe(1_000);
    controller.play();
    scheduler.advance(500);
    expect(controller.getSnapshot().state.offsetMs).toBe(1_500);
  });

  it("supports approved playback rates without changing the scenario state model", () => {
    const { controller, scheduler } = setup();
    controller.setRate(2);
    controller.play();
    scheduler.advance(500);
    expect(controller.getSnapshot().state.offsetMs).toBe(1_000);
    controller.setRate(0.5);
    scheduler.advance(1_000);
    expect(controller.getSnapshot().state.offsetMs).toBe(1_500);
  });

  it("seeks backward, clamps at scenario bounds and stops at the terminal state", () => {
    const { controller, scheduler } = setup();
    controller.seek(3_000);
    expect(controller.getSnapshot().state.incidents[0]?.status).toBe("resolved");
    controller.seek(1_500);
    expect(controller.getSnapshot().state.incidents[0]?.status).toBe("open");
    controller.play();
    scheduler.advance(10_000);
    expect(controller.getSnapshot()).toMatchObject({
      isPlaying: false,
      state: { offsetMs: 4_000, isTerminal: true },
    });
    expect(scheduler.pendingFrames).toBe(0);
  });

  it("restarts while preserving playback intent and cleans up scheduled work", () => {
    const { controller, scheduler } = setup();
    controller.play();
    scheduler.advance(2_000);
    controller.restart();
    expect(controller.getSnapshot()).toMatchObject({
      isPlaying: true,
      state: { offsetMs: 0 },
    });
    expect(scheduler.pendingFrames).toBe(1);
    controller.dispose();
    expect(controller.getSnapshot().isPlaying).toBe(false);
    expect(scheduler.pendingFrames).toBe(0);
  });

  it("rejects fractional positions and unsupported rates", () => {
    const { controller } = setup();
    expect(() => controller.seek(1.5)).toThrow(TypeError);
    expect(() => controller.setRate(3 as never)).toThrow(RangeError);
  });
});
