import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { resolvePiperConfig } from "../../src/tts/piper-config.ts";
import { defaultTemporaryWavRoot } from "../../src/tts/temp-wav.ts";
import { createToolPathFixture } from "./tools-test-utils.ts";

function run(): void {
  const config = resolvePiperConfig({
    env: {
      PI_LISTENER_PIPER_BIN: "  /opt/piper/bin/piper  ",
      PI_LISTENER_PIPER_MODEL_PATH: "  /opt/piper/voices/voice.onnx  ",
      PI_LISTENER_TTS_OUTPUT_DIR: "  /tmp/talk-pi-tts  ",
    } as NodeJS.ProcessEnv,
  });

  assert.equal(config.binaryPath, "/opt/piper/bin/piper");
  assert.equal(config.modelPath, "/opt/piper/voices/voice.onnx");
  assert.equal(config.outputDir, "/tmp/talk-pi-tts");

  const localFixture = createToolPathFixture();
  const defaults = resolvePiperConfig({
    env: {
      ...localFixture.env,
      PI_LISTENER_PIPER_MODEL_PATH: "/opt/piper/voices/voice.onnx",
    } as NodeJS.ProcessEnv,
  });

  assert.equal(defaults.binaryPath, path.join(process.cwd(), "tools", "piper", process.platform === "win32" ? "piper.exe" : "piper"));
  assert.equal(defaults.modelPath, "/opt/piper/voices/voice.onnx");
  assert.equal(defaults.outputDir, defaultTemporaryWavRoot());
  assert.equal(defaults.outputDir, path.join(os.homedir(), ".pi", "agent", "extensions", "pi-listener", "tts"));

  const toolsDir = fs.mkdtempSync(path.join(os.tmpdir(), "talk-pi-tools-"));
  const fallback = resolvePiperConfig({ env: { ...localFixture.env, PI_LISTENER_TOOLS_DIR: toolsDir } as NodeJS.ProcessEnv });
  assert.equal(
    fallback.binaryPath,
    path.join(toolsDir, "piper", process.platform === "win32" ? "piper.exe" : "piper"),
  );
  assert.equal(
    fallback.modelPath,
    path.join(toolsDir, "piper", "models", "en_US-lessac-medium.onnx"),
  );

  const fixture = createToolPathFixture({ withHomePi: true });
  const userDefaults = resolvePiperConfig({ env: fixture.env });
  assert.equal(
    userDefaults.binaryPath,
    path.join(fixture.homeToolsDir, "piper", process.platform === "win32" ? "piper.exe" : "piper"),
  );
  assert.equal(
    userDefaults.modelPath,
    path.join(fixture.homeToolsDir, "piper", "models", "en_US-lessac-medium.onnx"),
  );
}

run();
