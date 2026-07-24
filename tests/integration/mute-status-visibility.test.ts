import assert from "node:assert/strict";
import { openUnifiedTalkMenu } from "../../src/ui/unified-talk-menu.ts";

async function run() {
  const titles: string[] = [];
  let muted = true;

  const choices = ["Unmute", "Close", "Mute", "Close"];
  const ctx = {
    ui: {
      async select(title: string, options: string[]) {
        titles.push(title);
        return choices.shift();
      },
      notify: (_message: string, _level: "info" | "warning" | "error") => undefined,
    },
  };

  await openUnifiedTalkMenu(ctx, {
    isMuted: () => muted,
    setMuted: async (nextMuted) => {
      muted = nextMuted;
    },
    getStatusText: () => (muted ? "Muted" : "Ready"),
  });
  assert.ok(titles[0]?.includes("Muted"));

  muted = false;
  await openUnifiedTalkMenu(ctx, {
    isMuted: () => muted,
    setMuted: async (nextMuted) => {
      muted = nextMuted;
    },
    getStatusText: () => (muted ? "Muted" : "Ready"),
  });
  assert.ok(titles[1]?.includes("Unmuted"));
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
