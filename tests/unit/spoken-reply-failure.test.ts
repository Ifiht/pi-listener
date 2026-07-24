import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createPlaybackQueue } from "../../src/tts/playback-queue.ts";

async function run() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "talk-pi-failure-"));
  const played: string[] = [];
  const statuses: string[] = [];

  const queue = createPlaybackQueue({
    synthesize: async (text) => {
      if (text === "bad") throw new Error("synth fail");
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
    onStatus: (message) => {
      statuses.push(message);
    },
  });

  await queue.enqueue("bad");
  await queue.enqueue("good");

  assert.deepEqual(played, ["good"]);
  assert.ok(statuses.some((value) => value.includes("Error")));
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
