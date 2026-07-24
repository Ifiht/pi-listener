import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { EventEmitter } from "node:events";
import { synthesizeSpeechToWav } from "../../src/tts/piper-client.ts";

async function run() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "talk-pi-piper-"));
  const calls: Array<{ command: string; args: string[] }> = [];

  const result = await synthesizeSpeechToWav("hello world", {
    binaryPath: "piper",
    modelPath: "voice.onnx",
    outputDir: dir,
    spawnImpl: ((command: string, args: string[]) => {
      calls.push({ command, args });
      const child = new EventEmitter() as EventEmitter & { stdin: { end(text: string): void }; stderr: EventEmitter };
      child.stderr = new EventEmitter();
      child.stdin = {
        end(text: string) {
          const outputIndex = args.indexOf("--output_file") + 1;
          fs.writeFileSync(args[outputIndex], `wav:${text}`);
          queueMicrotask(() => child.emit("close", 0));
        },
      };
      return child as never;
    }) as never,
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0]?.command, "piper");
  assert.deepEqual(calls[0]?.args.slice(0, 4), ["--model", "voice.onnx", "--output_file", result.audioPath]);
  assert.equal(fs.existsSync(result.audioPath), true);
  assert.equal(fs.readFileSync(result.audioPath, "utf8"), "wav:hello world\n");
  await result.cleanup?.();
  assert.equal(fs.existsSync(result.audioPath), false);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
