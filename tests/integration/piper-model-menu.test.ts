import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { discoverPiperModels, setPiperOutputKind, setPiperVoiceModel } from "../../src/tts/piper-preferences.ts";

async function run() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "talk-pi-piper-menu-"));
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

  const models = await discoverPiperModels({ env });
  await setPiperVoiceModel(models[1]!.id, { env });
  await setPiperOutputKind("english", { env });

  const updated = await discoverPiperModels({ env });
  assert.equal(updated.some((model) => model.id.includes("en_US-lessac-medium")), true);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
