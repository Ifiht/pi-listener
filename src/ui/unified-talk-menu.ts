import { buildUnifiedMenuOptions, parseUnifiedMenuAction, type UnifiedMenuAction } from "./menu-actions.ts";

export type UnifiedTalkMenuContext = {
  ui: {
    select(title: string, options: string[], opts?: { overlay?: boolean }): Promise<string | undefined>;
    notify(message: string, level: "info" | "warning" | "error"): void;
  };
};

export type UnifiedTalkMenuState = {
  isMuted(): boolean;
  setMuted(nextMuted: boolean): Promise<void> | void;
  getStatusText(): string;
};

export async function openUnifiedTalkMenu(ctx: UnifiedTalkMenuContext, state: UnifiedTalkMenuState): Promise<void> {
  while (true) {
    const isMuted = state.isMuted();
    const title = `Pi-listener menu (${isMuted ? "Muted" : "Unmuted"})`;
    const options = buildUnifiedMenuOptions(isMuted);
    const choice = await ctx.ui.select(title, options, { overlay: true });
    const action = parseUnifiedMenuAction(choice, isMuted);

    if (action === "close") {
      return;
    }

    if (action === "status") {
      ctx.ui.notify(`Status: ${state.getStatusText()}`, "info");
      continue;
    }

    if (action === "mute") {
      await state.setMuted(true);
      ctx.ui.notify("Extension muted", "info");
      continue;
    }

    if (action === "unmute") {
      await state.setMuted(false);
      ctx.ui.notify("Extension unmuted", "info");
      continue;
    }
  }
}
