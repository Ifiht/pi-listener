export type SpeechJobState = "queued" | "synthesizing" | "ready" | "playing" | "complete" | "failed" | "interrupted";

export type SpeechJob = {
  text: string;
  state: SpeechJobState;
  audioPath?: string;
  attachAudio(audioPath: string, cleanup?: () => Promise<void> | void): void;
  setState(nextState: SpeechJobState): void;
  finalize(nextState: SpeechJobState): Promise<void>;
};

export function createSpeechJob(text: string): SpeechJob {
  let state: SpeechJobState = "queued";
  let audioPath: string | undefined;
  let cleanup: (() => Promise<void> | void) | undefined;
  let finalized = false;

  return {
    text,
    get state() {
      return state;
    },
    get audioPath() {
      return audioPath;
    },
    attachAudio(nextAudioPath: string, nextCleanup?: () => Promise<void> | void): void {
      audioPath = nextAudioPath;
      cleanup = nextCleanup;
      state = "ready";
    },
    setState(nextState: SpeechJobState): void {
      state = nextState;
    },
    async finalize(nextState: SpeechJobState): Promise<void> {
      state = nextState;
      if (finalized) return;
      finalized = true;
      await Promise.resolve(cleanup?.()).catch(() => undefined);
      audioPath = undefined;
      cleanup = undefined;
    },
  };
}
