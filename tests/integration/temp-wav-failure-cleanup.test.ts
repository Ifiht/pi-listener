import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createPlaybackQueue } from "../../src/tts/playback-queue.ts";

async function testFailureCleanup() {
  const baseDir = fs.mkdtempSync(path.join(os.tmpdir(), "talk-pi-failure-cleanup-"));
  const jobDirs: string[] = [];
  const notices: string[] = [];

  const queue = createPlaybackQueue({
    synthesize: async (text) => {
      const jobDir = fs.mkdtempSync(path.join(baseDir, "job-"));
      const audioPath = path.join(jobDir, "speech.wav");
      fs.writeFileSync(audioPath, text);
      jobDirs.push(jobDir);
      return {
        audioPath,
        cleanup: async () => {
          fs.rmSync(jobDir, { recursive: true, force: true });
        },
      };
    },
    player: {
      async play() {
        throw new Error("player boom");
      },
      async stop() {
        return;
      },
    },
    onNotify: (message) => notices.push(message),
  });

  await queue.enqueue("broken");

  assert.equal(notices.some((message) => message.includes("player boom")), true);
  assert.equal(jobDirs.every((dir) => fs.existsSync(dir) === false), true);
}

async function testInterruptedCleanup() {
  const baseDir = fs.mkdtempSync(path.join(os.tmpdir(), "talk-pi-stop-cleanup-"));
  const jobDirs: string[] = [];
  let releasePlayback: (() => void) | undefined;

  const queue = createPlaybackQueue({
    synthesize: async (text) => {
      const jobDir = fs.mkdtempSync(path.join(baseDir, "job-"));
      const audioPath = path.join(jobDir, "speech.wav");
      fs.writeFileSync(audioPath, text);
      jobDirs.push(jobDir);
      return {
        audioPath,
        cleanup: async () => {
          fs.rmSync(jobDir, { recursive: true, force: true });
        },
      };
    },
    player: {
      async play() {
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

  assert.equal(jobDirs.every((dir) => fs.existsSync(dir) === false), true);
}

async function run() {
  await testFailureCleanup();
  await testInterruptedCleanup();
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
