import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ensurePiperTool } from "../../src/tools-bootstrap.ts";

async function run(): Promise<void> {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pi-listener-ext-piper-"));
  const bin = path.join(dir, "piper");
  const model = path.join(dir, "custom-voice.onnx");
  fs.writeFileSync(bin, "", { mode: 0o755 });
  fs.writeFileSync(model, "");

  // External binary + model short-circuits: no extension-folder requirement, no downloads.
  const resolved = await ensurePiperTool({
    env: {
      HOME: dir,
      USERPROFILE: dir,
      PI_LISTENER_PIPER_BIN: bin,
      PI_LISTENER_PIPER_MODEL_PATH: model,
    } as NodeJS.ProcessEnv,
  });
  assert.equal(resolved.binaryPath, bin);
  assert.equal(resolved.modelPath, model);

  // A dangling PI_LISTENER_PIPER_BIN must not short-circuit (falls through to normal checks).
  await assert.rejects(
    ensurePiperTool({
      env: {
        HOME: dir,
        USERPROFILE: dir,
        PI_LISTENER_PIPER_BIN: path.join(dir, "missing"),
        PI_LISTENER_PIPER_MODEL_PATH: model,
        PI_LISTENER_TOOLS_DIR: path.join(dir, "empty-tools"),
      } as NodeJS.ProcessEnv,
    }),
    /Piper missing/,
  );

  fs.rmSync(dir, { recursive: true, force: true });
  console.log("tools-bootstrap-external-piper.test.ts passed");
}

run();
