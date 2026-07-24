import assert from "node:assert/strict";
import { createPlaybackQueue } from "../../src/tts/playback-queue.ts";

async function run() {
  const statuses: string[] = [];
  const queue = createPlaybackQueue({
    onStatus(message) {
      statuses.push(message);
    },
  });

  const stopped = await queue.stop();

  assert.equal(stopped, false);
  assert.equal(queue.isPlaying(), false);
  assert.equal(queue.pendingCount(), 0);
  assert.deepEqual(statuses, []);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
