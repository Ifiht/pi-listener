import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createPlaybackQueue } from "../../src/tts/playback-queue.ts";
import { extractAssistantReplyText } from "../../src/tts/assistant-reply.ts";

async function run() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "talk-pi-flow-"));
  const spoken: string[] = [];

  const queue = createPlaybackQueue({
    synthesize: async (text) => {
      const audioPath = path.join(dir, `${spoken.length}.wav`);
      fs.writeFileSync(audioPath, text);
      return { audioPath };
    },
    player: {
      async play(filePath: string) {
        spoken.push(fs.readFileSync(filePath, "utf8"));
      },
      async stop() {},
    },
  });

  const text = extractAssistantReplyText({ role: "assistant", content: "respota pronta" });
  await queue.enqueue(text);

  assert.deepEqual(spoken, ["respota pronta"]);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
