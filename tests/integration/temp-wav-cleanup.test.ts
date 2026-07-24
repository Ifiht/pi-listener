import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createPlaybackQueue } from "../../src/tts/playback-queue.ts";

async function run() {
  const baseDir = fs.mkdtempSync(path.join(os.tmpdir(), "talk-pi-cleanup-"));
  const createdFiles: string[] = [];
  const cleanedDirs: string[] = [];
  const played: string[] = [];

  const queue = createPlaybackQueue({
    synthesize: async (text) => {
      const jobDir = fs.mkdtempSync(path.join(baseDir, "job-"));
      const audioPath = path.join(jobDir, "speech.wav");
      fs.writeFileSync(audioPath, text);
      createdFiles.push(audioPath);
      return {
        audioPath,
        cleanup: async () => {
          cleanedDirs.push(jobDir);
          fs.rmSync(jobDir, { recursive: true, force: true });
        },
      };
    },
    player: {
      async play(filePath: string) {
        played.push(fs.readFileSync(filePath, "utf8"));
      },
      async stop() {
        return;
      },
    },
  });

  await queue.enqueue("assistant reply");

  assert.deepEqual(played, ["assistant reply"]);
  assert.equal(createdFiles.every((filePath) => fs.existsSync(filePath) === false), true);
  assert.equal(cleanedDirs.every((dir) => fs.existsSync(dir) === false), true);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
