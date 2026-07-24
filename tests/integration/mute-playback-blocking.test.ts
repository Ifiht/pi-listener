import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createPlaybackQueue } from "../../src/tts/playback-queue.ts";

async function run() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "talk-pi-mute-integration-"));
  const played: string[] = [];
  let releasePlayback: (() => void) | undefined;

  const queue = createPlaybackQueue({
    synthesize: async (text) => {
      const audioPath = path.join(dir, `${text}.wav`);
      fs.writeFileSync(audioPath, text);
      return { audioPath };
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

  await queue.enqueue("first reply");
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(queue.isPlaying(), true);

  await queue.setMuted(true);
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(queue.isMuted(), true);
  assert.equal(queue.isPlaying(), false);

  await queue.enqueue("second reply");
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.deepEqual(played, ["first reply"]);

  await queue.setMuted(false);
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.deepEqual(played, ["first reply", "second reply"]);

  releasePlayback?.();
  await queue.drain();
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
