import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createPlaybackQueue } from "../../src/tts/playback-queue.ts";

async function run() {
  const baseDir = fs.mkdtempSync(path.join(os.tmpdir(), "talk-pi-buildup-"));
  const created: string[] = [];
  const cleaned: string[] = [];

  const queue = createPlaybackQueue({
    synthesize: async (text) => {
      const jobDir = fs.mkdtempSync(path.join(baseDir, "job-"));
      const audioPath = path.join(jobDir, `${text}.wav`);
      fs.writeFileSync(audioPath, text);
      created.push(audioPath);
      return {
        audioPath,
        cleanup: async () => {
          cleaned.push(jobDir);
          fs.rmSync(jobDir, { recursive: true, force: true });
        },
      };
    },
    player: {
      async play() {
        return;
      },
      async stop() {
        return;
      },
    },
  });

  await queue.enqueue("one");
  await queue.enqueue("two");
  await queue.enqueue("three");

  assert.equal(new Set(created).size, 3);
  assert.equal(cleaned.length, 3);
  assert.equal(cleaned.every((dir) => fs.existsSync(dir) === false), true);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
