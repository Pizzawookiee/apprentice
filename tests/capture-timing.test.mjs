import assert from "node:assert/strict";
import test from "node:test";
import { shouldAskCaptureQuestion } from "../lib/capture-timing.ts";

const base = {
  now: 1000,
  queuedAt: 0,
  busyUntil: 0,
  typing: false,
  speechActive: false,
  agentSpeaking: false,
  micLevel: 0,
};

test("asks after a short pause instead of the old multi-second delay", () => {
  assert.equal(shouldAskCaptureQuestion({ ...base, now: 999 }), false);
  assert.equal(shouldAskCaptureQuestion(base), true);
});

test("typing and clear speech defer the question", () => {
  assert.equal(shouldAskCaptureQuestion({ ...base, now: 5000, typing: true }), false);
  assert.equal(shouldAskCaptureQuestion({ ...base, now: 5000, agentSpeaking: true }), false);
  assert.equal(shouldAskCaptureQuestion({ ...base, now: 5000, speechActive: true, micLevel: 0.2 }), false);
});

test("low microphone noise cannot defer the question indefinitely", () => {
  assert.equal(shouldAskCaptureQuestion({ ...base, now: 3900, busyUntil: 4700, speechActive: true, micLevel: 0.09 }), false);
  assert.equal(shouldAskCaptureQuestion({ ...base, now: 4000, busyUntil: 4800, speechActive: true, micLevel: 0.09 }), true);
});
