import assert from "node:assert/strict";
import { createPlaybackQueue } from "../../src/tts/playback-queue.ts";

async function run() {
  const events: string[] = [];
  const queue = createPlaybackQueue({
    onStatus(message) {
      events.push(message);
    },
  });

  const stopped = await queue.stop();

  assert.equal(stopped, false);
  assert.equal(queue.isPlaying(), false);
  assert.deepEqual(events, []);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
