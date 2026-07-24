import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";

export type TemporaryWavFile = {
  path: string;
  cleanup(): Promise<void>;
  isCleanedUp(): boolean;
};

export async function createTemporaryWavFile(baseDir = defaultTemporaryWavRoot()): Promise<TemporaryWavFile> {
  await fs.mkdir(baseDir, { recursive: true });
  const workspaceDir = await fs.mkdtemp(path.join(baseDir, "talk-pi-wav-"));
  const wavPath = path.join(workspaceDir, `${Date.now()}-${randomUUID()}.wav`);
  let cleanedUp = false;

  return {
    path: wavPath,
    isCleanedUp(): boolean {
      return cleanedUp;
    },
    async cleanup(): Promise<void> {
      if (cleanedUp) return;
      cleanedUp = true;
      await fs.rm(workspaceDir, { recursive: true, force: true }).catch(() => undefined);
    },
  };
}

export function defaultTemporaryWavRoot(): string {
  return process.env.PI_LISTENER_TTS_OUTPUT_DIR?.trim() || path.join(os.homedir(), ".pi", "agent", "extensions", "pi-listener", "tts");
}
