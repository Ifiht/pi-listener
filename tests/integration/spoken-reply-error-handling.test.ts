import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createPlaybackQueue } from "../../src/tts/playback-queue.ts";

async function run() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "talk-pi-error-"));
  const played: string[] = [];
  const notices: string[] = [];

  const queue = createPlaybackQueue({
    synthesize: async (text) => {
      if (text === "broken") throw new Error("boom");
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
    onNotify: (message) => notices.push(message),
  });

  await queue.enqueue("broken");
  await queue.enqueue("still works");

  assert.deepEqual(played, ["still works"]);
  assert.ok(notices.some((message) => message.includes("boom")));
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
