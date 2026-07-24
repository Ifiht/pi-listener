import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createPlaybackQueue } from "../../src/tts/playback-queue.ts";

async function run() {
  const baseDir = fs.mkdtempSync(path.join(os.tmpdir(), "talk-pi-reuse-"));
  const activeDirs: string[] = [];
  const played: string[] = [];

  const queue = createPlaybackQueue({
    synthesize: async (text) => {
      const jobDir = fs.mkdtempSync(path.join(baseDir, "job-"));
      const audioPath = path.join(jobDir, "speech.wav");
      fs.writeFileSync(audioPath, text);
      activeDirs.push(jobDir);
      return {
        audioPath,
        cleanup: async () => {
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

  for (const text of ["alpha", "beta", "gamma", "delta"]) {
    await queue.enqueue(text);
  }

  assert.deepEqual(played, ["alpha", "beta", "gamma", "delta"]);
  assert.equal(activeDirs.every((dir) => fs.existsSync(dir) === false), true);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
