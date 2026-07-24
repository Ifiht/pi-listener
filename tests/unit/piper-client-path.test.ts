import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { EventEmitter } from "node:events";
import { synthesizeSpeechToWav } from "../../src/tts/piper-client.ts";

async function run() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "talk-pi-path-"));

  // A missing binary surfaces as spawn ENOENT, remapped to an actionable error.
  await assert.rejects(
    synthesizeSpeechToWav("hello", {
      modelPath: "voice.onnx",
      outputDir: dir,
      binaryPath: "/nonexistent/piper",
      spawnImpl: (() => {
        const child = new EventEmitter() as EventEmitter & { stdin: { end(text: string): void }; stderr: EventEmitter };
        child.stderr = new EventEmitter();
        child.stdin = {
          end() {
            queueMicrotask(() => {
              const error = new Error("spawn /nonexistent/piper ENOENT") as Error & { code: string };
              error.code = "ENOENT";
              child.emit("error", error);
            });
          },
        };
        return child as never;
      }) as never,
    }),
    /Piper binary not found: \/nonexistent\/piper.*PI_LISTENER_PIPER_BIN/,
  );

  // Temp wav workspace is cleaned up on failure.
  assert.deepEqual(fs.readdirSync(dir), []);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
