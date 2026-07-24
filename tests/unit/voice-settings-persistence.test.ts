import assert from "node:assert/strict";
import fs from "node:fs";
import { createVoiceSettingsFixture } from "./voice-settings-test-utils.ts";
import { loadPiperVoicePreference, resolvePiperVoiceSelection, savePiperVoicePreference, setPiperMuted } from "../../src/tts/piper-preferences.ts";

async function run() {
  const fixture = createVoiceSettingsFixture("talk-pi-voice-persist-");

  const saved = await savePiperVoicePreference({
    selectedModelId: "en_US-lessac-medium",
    selectedOutputKind: "english",
    muted: true,
  }, { env: fixture.env });

  assert.equal(saved.selectedOutputKind, "english");
  assert.equal(saved.muted, true);

  const loaded = await loadPiperVoicePreference({ env: fixture.env });
  assert.equal(loaded.selectedModelId, "en_US-lessac-medium");
  assert.equal(loaded.selectedOutputKind, "english");
  assert.equal(loaded.muted, true);

  const selection = await resolvePiperVoiceSelection({ env: fixture.env });
  assert.equal(selection.outputLabel, "English - Lessac");
  assert.equal(selection.whisperLanguage, "en");
  assert.equal(selection.muted, true);

  await setPiperMuted(false, { env: fixture.env });
  const updated = await loadPiperVoicePreference({ env: fixture.env });
  assert.equal(updated.muted, false);
  assert.equal(JSON.parse(fs.readFileSync(fixture.prefsPath, "utf8")).muted, false);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
