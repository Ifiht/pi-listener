import assert from "node:assert/strict";
import fs from "node:fs";
import { openUnifiedTalkMenu } from "../../src/ui/unified-talk-menu.ts";
import { loadVoiceSettingsStartupState, persistVoiceSettingsMute } from "../../src/voice-settings.ts";
import { createTalkPiVoiceFixture } from "./voice-settings-test-utils.ts";

async function run() {
  const fixture = createTalkPiVoiceFixture("talk-pi-restore-");
  fs.writeFileSync(fixture.prefsPath, JSON.stringify({
    selectedModelId: "en_US-lessac-medium",
    selectedOutputKind: "english",
    muted: true,
    updatedAt: new Date().toISOString(),
  }, null, 2));

  const startup = await loadVoiceSettingsStartupState({ env: fixture.env });
  assert.equal(startup.selection.outputLabel, "English - Lessac");
  assert.equal(startup.muteState.isMuted(), true);

  const titles: string[] = [];
  const optionSets: string[][] = [];
  const notifications: string[] = [];
  const choices = ["Status", "Close"];

  await openUnifiedTalkMenu({
    ui: {
      async select(title: string, options: string[]) {
        titles.push(title);
        optionSets.push(options);
        return choices.shift();
      },
      notify(message: string) {
        notifications.push(message);
      },
    },
  }, {
    isMuted: () => startup.muteState.isMuted(),
    setMuted: async (nextMuted) => {
      if (nextMuted) {
        startup.muteState.mute();
      } else {
        startup.muteState.unmute();
      }
      await persistVoiceSettingsMute(nextMuted, { env: fixture.env });
    },
    getStatusText: () => `Voice Language: ${startup.selection.outputLabel} | Muted: ${startup.muteState.isMuted() ? "yes" : "no"}`,
  });

  assert.ok(titles[0]?.includes("Muted"));
  assert.deepEqual(optionSets[0], ["Status", "Unmute", "Close"]);
  assert.ok(notifications.some((message) => message.includes("Voice Language: English - Lessac")));
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
