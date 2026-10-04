export type CaptureQuestionTiming = {
  now: number;
  queuedAt: number;
  busyUntil: number;
  typing: boolean;
  speechActive: boolean;
  agentSpeaking: boolean;
  micLevel: number;
};

export function shouldAskCaptureQuestion(state: CaptureQuestionTiming): boolean {
  if (state.typing || state.agentSpeaking) return false;
  const quietPause = state.now >= Math.max(state.queuedAt + 1000, state.busyUntil) && !state.speechActive;
  const noiseFallback = state.now - state.queuedAt >= 4000 && state.micLevel < 0.12;
  return quietPause || noiseFallback;
}
