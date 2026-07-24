import assert from "node:assert/strict";
import { openUnifiedTalkMenu } from "../../src/ui/unified-talk-menu.ts";

async function run() {
  const choices = ["Status", "Mute", "Close"];
  const titles: string[] = [];
  const optionSets: string[][] = [];
  let muted = false;
  const notifications: string[] = [];

  const ctx = {
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
  };

  await openUnifiedTalkMenu(ctx, {
    isMuted: () => muted,
    setMuted: async (nextMuted) => {
      muted = nextMuted;
    },
    getStatusText: () => muted ? "Muted | F9 sends directly | F10 inserts into editor" : "Ready | F9 sends directly | F10 inserts into editor",
  });

  assert.ok(titles[0]?.includes("Unmuted"));
  assert.deepEqual(optionSets[0], ["Status", "Mute", "Close"]);
  assert.ok(notifications.includes("Status: Ready | F9 sends directly | F10 inserts into editor"));
  assert.ok(notifications.includes("Extension muted"));
  assert.equal(muted, true);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
