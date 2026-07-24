import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createPlaybackQueue } from "../../src/tts/playback-queue.ts";

async function run() {
  const order: string[] = [];
  const synthPaths: string[] = [];
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "talk-pi-playback-"));
  let blocked = false;

  const queue = createPlaybackQueue({
    isRecordingBlocked: () => blocked,
    synthesize: async (text) => {
      synthPaths.push(text);
      const audioPath = path.join(dir, `${synthPaths.length}.wav`);
      fs.writeFileSync(audioPath, text);
      return { audioPath };
    },
    player: {
      async play(filePath: string) {
        order.push(fs.readFileSync(filePath, "utf8"));
      },
      async stop() {},
    },
  });

  blocked = true;
  await queue.enqueue("first");
  await queue.enqueue("second");
  assert.equal(queue.pendingCount(), 2);
  assert.deepEqual(order, []);

  blocked = false;
  await queue.setRecordingBlocked(false);
  assert.deepEqual(order, ["first", "second"]);
  assert.deepEqual(synthPaths, ["first", "second"]);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
