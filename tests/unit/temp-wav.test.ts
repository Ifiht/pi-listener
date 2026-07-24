import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createTemporaryWavFile } from "../../src/tts/temp-wav.ts";

async function run() {
  const baseDir = fs.mkdtempSync(path.join(os.tmpdir(), "talk-pi-temp-wav-"));
  const tempWav = await createTemporaryWavFile(baseDir);

  assert.equal(tempWav.path.endsWith(".wav"), true);
  assert.equal(fs.existsSync(path.dirname(tempWav.path)), true);

  fs.writeFileSync(tempWav.path, "wav");
  await tempWav.cleanup();

  assert.equal(fs.existsSync(tempWav.path), false);
  assert.equal(fs.existsSync(path.dirname(tempWav.path)), false);
  assert.equal(tempWav.isCleanedUp(), true);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
