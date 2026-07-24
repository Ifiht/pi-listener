import assert from "node:assert/strict";
import fs from "node:fs";
import { createVoiceSettingsFixture } from "./voice-settings-test-utils.ts";
import { loadPiperVoicePreference, savePiperVoicePreference } from "../../src/tts/piper-preferences.ts";

async function run() {
  const fixture = createVoiceSettingsFixture("talk-pi-voice-defaults-");

  const loaded = await loadPiperVoicePreference({ env: fixture.env });
  assert.equal(loaded.selectedOutputKind, "default");
  assert.equal(loaded.muted, false);
  assert.equal(loaded.selectedModelId, undefined);

  await savePiperVoicePreference({ selectedOutputKind: "english" }, { env: fixture.env });
  const saved = await loadPiperVoicePreference({ env: fixture.env });
  assert.equal(saved.selectedOutputKind, "english");
  assert.equal(saved.muted, false);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
