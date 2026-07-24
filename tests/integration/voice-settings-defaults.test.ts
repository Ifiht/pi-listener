import assert from "node:assert/strict";
import fs from "node:fs";
import { openUnifiedTalkMenu } from "../../src/ui/unified-talk-menu.ts";
import { loadVoiceSettingsStartupState } from "../../src/voice-settings.ts";
import { createTalkPiVoiceFixture } from "./voice-settings-test-utils.ts";

async function run() {
  const fixture = createTalkPiVoiceFixture("talk-pi-defaults-");
  fs.rmSync(fixture.prefsPath, { force: true });

  const startup = await loadVoiceSettingsStartupState({ env: fixture.env });
  assert.equal(startup.selection.outputLabel, "Portuguese - Faber");
  assert.equal(startup.muteState.isMuted(), false);

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
    },
    getStatusText: () => `Voice Language: ${startup.selection.outputLabel} | Muted: ${startup.muteState.isMuted() ? "yes" : "no"}`,
  });

  assert.ok(titles[0]?.includes("Unmuted"));
  assert.deepEqual(optionSets[0], ["Status", "Mute", "Close"]);
  assert.ok(notifications.some((message) => message.includes("Voice Language: Portuguese - Faber")));
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
