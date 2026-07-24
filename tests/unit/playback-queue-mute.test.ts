import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createPlaybackQueue } from "../../src/tts/playback-queue.ts";

async function run() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "talk-pi-mute-queue-"));
  const events: string[] = [];
  let releasePlay: (() => void) | undefined;

  const queue = createPlaybackQueue({
    synthesize: async (text) => {
      const audioPath = path.join(dir, `${text}.wav`);
      fs.writeFileSync(audioPath, text);
      return { audioPath };
    },
    player: {
      async play(filePath: string) {
        events.push(`play:${fs.readFileSync(filePath, "utf8")}`);
        await new Promise<void>((resolve) => {
          releasePlay = resolve;
        });
      },
      async stop() {
        events.push("stop");
        releasePlay?.();
      },
    },
  });

  await queue.enqueue("one");
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(queue.isPlaying(), true);

  await queue.setMuted(true);
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(queue.isMuted(), true);
  assert.equal(queue.isPlaying(), false);
  assert.ok(events.includes("stop"));

  await queue.enqueue("two");
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.ok(!events.includes("play:two"));

  await queue.setMuted(false);
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.ok(events.includes("play:two"));

  releasePlay?.();
  await queue.drain();
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
