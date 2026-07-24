import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createPlaybackQueue } from "../../src/tts/playback-queue.ts";

async function run() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "talk-pi-mute-"));
  const played: string[] = [];
  let blocked = true;

  const queue = createPlaybackQueue({
    isRecordingBlocked: () => blocked,
    synthesize: async (text) => {
      const audioPath = path.join(dir, `${text}.wav`);
      fs.writeFileSync(audioPath, text);
      return { audioPath };
    },
    player: {
      async play(filePath: string) {
        played.push(fs.readFileSync(filePath, "utf8"));
      },
      async stop() {},
    },
  });

  await queue.enqueue("assistant reply");
  assert.deepEqual(played, []);

  blocked = false;
  await queue.setRecordingBlocked(false);
  assert.deepEqual(played, ["assistant reply"]);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
