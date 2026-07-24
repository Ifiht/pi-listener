export type TranscriptionStatus = "idle" | "recording" | "transcribing" | "inserting" | "ready" | "no-speech" | "error";

export function formatTranscriptionStatus(status: TranscriptionStatus, detail?: string): string {
  switch (status) {
    case "idle":
    case "ready":
      return `Ready${detail ? `: ${detail}` : ""}`;
    case "recording":
      return `Listen${detail ? `: ${detail}` : ""}`;
    case "transcribing":
    case "inserting":
      return `Thinking${detail ? `: ${detail}` : ""}`;
    case "no-speech":
      return `No speech detected${detail ? `: ${detail}` : ""}`;
    case "error":
      return `Error${detail ? `: ${detail}` : ""}`;
  }
}
