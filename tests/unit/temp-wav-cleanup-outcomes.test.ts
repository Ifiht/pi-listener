import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createPlaybackQueue } from "../../src/tts/playback-queue.ts";

async function testFailureCleanup() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "talk-pi-failure-"));
  let cleaned = 0;

  const queue = createPlaybackQueue({
    synthesize: async () => {
      const jobDir = fs.mkdtempSync(path.join(dir, "job-"));
      const audioPath = path.join(jobDir, "speech.wav");
      fs.writeFileSync(audioPath, "broken");
      return {
        audioPath,
        cleanup: async () => {
          cleaned += 1;
          fs.rmSync(jobDir, { recursive: true, force: true });
        },
      };
    },
    player: {
      async play() {
        throw new Error("playback failed");
      },
      async stop() {
        return;
      },
    },
  });

  await queue.enqueue("broken");

  assert.equal(cleaned, 1);
}

async function testStopCleanup() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "talk-pi-stop-cleanup-"));
  const played: string[] = [];
  let releasePlayback: (() => void) | undefined;
  let cleaned = 0;

  const queue = createPlaybackQueue({
    synthesize: async (text) => {
      const jobDir = fs.mkdtempSync(path.join(dir, "job-"));
      const audioPath = path.join(jobDir, "speech.wav");
      fs.writeFileSync(audioPath, text);
      return {
        audioPath,
        cleanup: async () => {
          cleaned += 1;
          fs.rmSync(jobDir, { recursive: true, force: true });
        },
      };
    },
    player: {
      async play(filePath: string) {
        played.push(fs.readFileSync(filePath, "utf8"));
        await new Promise<void>((resolve) => {
          releasePlayback = resolve;
        });
      },
      async stop() {
        releasePlayback?.();
      },
    },
  });

  const active = queue.enqueue("assistant reply");
  await new Promise((resolve) => setTimeout(resolve, 0));
  await queue.stop();
  await active;

  assert.deepEqual(played, ["assistant reply"]);
  assert.equal(cleaned, 1);
}

async function run() {
  await testFailureCleanup();
  await testStopCleanup();
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
