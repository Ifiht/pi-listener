import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { discoverPiperModels, loadPiperVoicePreference, resolvePiperVoiceSelection, savePiperVoicePreference, setPiperOutputKind, setPiperVoiceModel } from "../../src/tts/piper-preferences.ts";

async function run() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "talk-pi-piper-prefs-"));
  const piperDir = path.join(dir, "piper");
  const modelsDir = path.join(piperDir, "models");
  fs.mkdirSync(modelsDir, { recursive: true });
  const english = path.join(modelsDir, "en_US-lessac-medium.onnx");
  const pt = path.join(modelsDir, "pt_BR-faber-medium.onnx");
  fs.writeFileSync(english, "english");
  fs.writeFileSync(pt, "pt");

  const prefPath = path.join(dir, "prefs.json");
  const env = {
    PI_LISTENER_TOOLS_DIR: dir,
    PI_LISTENER_PIPER_MODELS_DIR: modelsDir,
    PI_LISTENER_PIPER_PREFERENCES_PATH: prefPath,
  } as NodeJS.ProcessEnv;

  const models = await discoverPiperModels({ env });
  assert.equal(models.length, 2);
  assert.equal(models.some((model) => model.language === "english"), true);

  const saved = await savePiperVoicePreference({ selectedModelId: pt.replace(/\\/g, "/").replace(/\.onnx$/i, ""), selectedOutputKind: "english" }, { env });
  assert.equal(saved.selectedOutputKind, "english");

  const loaded = await loadPiperVoicePreference({ env });
  assert.equal(loaded.selectedOutputKind, "english");
  assert.equal(loaded.selectedModelId, pt.replace(/\\/g, "/").replace(/\.onnx$/i, ""));

  const englishSelection = await resolvePiperVoiceSelection({ env });
  assert.equal(englishSelection.modelPath, english);
  assert.equal(englishSelection.whisperLanguage, "en");
  assert.equal(englishSelection.outputLabel, "English - Lessac");

  await setPiperVoiceModel(pt.replace(/\\/g, "/").replace(/\.onnx$/i, ""), { env });
  await setPiperOutputKind("default", { env });
  const defaultSelection = await resolvePiperVoiceSelection({ env });
  assert.equal(defaultSelection.modelPath, pt);
  assert.equal(defaultSelection.whisperLanguage, "pt");
  assert.equal(defaultSelection.outputLabel, "Portuguese - Faber");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
