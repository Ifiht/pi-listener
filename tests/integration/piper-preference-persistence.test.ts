import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { resolvePiperVoiceSelection, setPiperOutputKind, setPiperVoiceModel } from "../../src/tts/piper-preferences.ts";

async function run() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "talk-pi-piper-persist-"));
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

  await setPiperVoiceModel(pt.replace(/\\/g, "/").replace(/\.onnx$/i, ""), { env });
  await setPiperOutputKind("english", { env });

  const first = await resolvePiperVoiceSelection({ env });
  assert.equal(first.outputLabel, "English - Lessac");
  assert.equal(first.whisperLanguage, "en");
  assert.equal(first.modelPath, english);

  const second = await resolvePiperVoiceSelection({ env });
  assert.equal(second.outputLabel, "English - Lessac");
  assert.equal(second.whisperLanguage, "en");
  assert.equal(second.modelPath, english);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
