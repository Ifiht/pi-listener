import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createPlaybackQueue } from "../../src/tts/playback-queue.ts";

async function run() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "talk-pi-stop-"));
  const played: string[] = [];
  let releasePlayback: (() => void) | undefined;
  let stopCalls = 0;

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
        stopCalls += 1;
        releasePlayback?.();
      },
    },
  });

  const first = queue.enqueue("first reply");
  const second = queue.enqueue("second reply");

  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(queue.isPlaying(), true);

  const stopped = await queue.stop();
  assert.equal(stopped, true);

  await Promise.allSettled([first, second]);
  assert.deepEqual(played, ["first reply"]);
  assert.equal(stopCalls, 1);
  assert.equal(queue.pendingCount(), 0);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
