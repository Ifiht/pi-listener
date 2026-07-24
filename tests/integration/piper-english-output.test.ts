import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { resolvePiperVoiceSelection, setPiperOutputKind } from "../../src/tts/piper-preferences.ts";

async function run() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "talk-pi-piper-english-"));
  const modelsDir = path.join(dir, "models");
  fs.mkdirSync(modelsDir, { recursive: true });
  const english = path.join(modelsDir, "en_US-lessac-medium.onnx");
  const pt = path.join(modelsDir, "pt_BR-faber-medium.onnx");
  fs.writeFileSync(english, "english");
  fs.writeFileSync(pt, "pt");

  const env = {
    PI_LISTENER_PIPER_MODELS_DIR: modelsDir,
    PI_LISTENER_PIPER_PREFERENCES_PATH: path.join(dir, "prefs.json"),
  } as NodeJS.ProcessEnv;

  await setPiperOutputKind("english", { env });
  const selection = await resolvePiperVoiceSelection({ env });

  assert.equal(selection.outputLabel, "English - Lessac");
  assert.equal(selection.whisperLanguage, "en");
  assert.equal(selection.modelPath, english);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
