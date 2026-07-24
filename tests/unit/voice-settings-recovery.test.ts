import assert from "node:assert/strict";
import fs from "node:fs";
import { createVoiceSettingsFixture } from "./voice-settings-test-utils.ts";
import { loadPiperVoicePreference } from "../../src/tts/piper-preferences.ts";

async function run() {
  const fixture = createVoiceSettingsFixture("talk-pi-voice-recovery-");
  fs.writeFileSync(fixture.prefsPath, "{ not valid json");

  const loaded = await loadPiperVoicePreference({ env: fixture.env });
  assert.equal(loaded.selectedOutputKind, "default");
  assert.equal(loaded.muted, false);
  assert.equal(loaded.selectedModelId, undefined);

  fs.writeFileSync(fixture.prefsPath, JSON.stringify({ selectedOutputKind: "english", muted: "yes" }, null, 2));
  const partial = await loadPiperVoicePreference({ env: fixture.env });
  assert.equal(partial.selectedOutputKind, "english");
  assert.equal(partial.muted, false);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
