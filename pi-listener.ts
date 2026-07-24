import path from "node:path";
import { createMuteState } from "./src/ui/mute-state.ts";
import { openUnifiedTalkMenu } from "./src/ui/unified-talk-menu.ts";
import { extractAssistantReplyText } from "./src/tts/assistant-reply.ts";
import { createPlaybackQueue } from "./src/tts/playback-queue.ts";
import { resolvePiperRuntimeConfig, resolvePiperVoiceSelection, type PiperPreferenceResolution } from "./src/tts/piper-preferences.ts";
import { createListenerProcess, type ListenerProcess } from "./src/listener/listener-process.ts";
import { ensureWhisperModel } from "./src/listener/whisper-model.ts";
import { loadPiListenerConfig } from "./src/config.ts";
import { loadVoiceSettingsStartupState, persistVoiceSettingsMute } from "./src/voice-settings.ts";
import { ensurePiperTool } from "./src/tools-bootstrap.ts";

try {
  process.loadEnvFile(path.join(path.dirname(new URL(import.meta.url).pathname), ".env"));
} catch {
  // no .env file; rely on the process environment
}

type ExtensionContext = {
  ui: {
    setStatus(id: string, value: string): void;
    notify(message: string, level: "info" | "warning" | "error"): void;
    select(title: string, options: string[], opts?: { overlay?: boolean }): Promise<string | undefined>;
    isIdle?: () => boolean;
  };
  isIdle?: () => boolean;
};

type ExtensionAPI = {
  on(event: string, handler: (event: any, ctx: ExtensionContext) => void | Promise<void>): void;
  registerCommand?(name: string, command: { description: string; handler: (args: string, ctx: ExtensionContext) => void | Promise<void> }): void;
  sendUserMessage(text: string, opts?: { deliverAs: "followUp" }): void;
};

type LoopState = "stopped" | "starting" | "listening" | "processing";

export default function (pi: ExtensionAPI) {
  let activeCtx: ExtensionContext | undefined;
  const config = loadPiListenerConfig();
  let muteState = createMuteState();
  let piperSelection: PiperPreferenceResolution | undefined;
  let listener: ListenerProcess | undefined;
  let loopState: LoopState = "stopped";

  const notify = (message: string, level: "info" | "warning" | "error" = "info") => {
    activeCtx?.ui.notify(message, level);
  };

  const footerText = (): string => {
    if (loopState === "stopped") return "| Pi-Listener: ⏹ stopped — /listen to start";
    if (loopState === "starting") return "| Pi-Listener: ⏳ starting";
    if (loopState === "processing") return "| Pi-Listener: 🗣 speaking";
    return muteState.isMuted() ? "| Pi-Listener: 🎤 listening (🔇 muted)" : "| Pi-Listener: 🎤 listening";
  };

  const syncStatus = (ctx?: ExtensionContext) => {
    (ctx ?? activeCtx)?.ui.setStatus("pi-listener", footerText());
  };

  const resumeListening = () => {
    if (loopState === "stopped") return;
    loopState = "listening";
    listener?.resume();
    syncStatus();
  };

  const playbackQueue = createPlaybackQueue({
    onNotify: (message, level) => notify(message, level),
    onStatus: () => syncStatus(),
    onIdle: () => {
      if (loopState === "processing") {
        resumeListening();
      }
    },
    piper: async () => resolvePiperRuntimeConfig({
      ...config.piper,
      modelPath: piperSelection?.modelPath ?? config.piper.modelPath,
      env: process.env,
    }),
  });

  const handleCommand = (text: string) => {
    if (loopState === "stopped") return;
    loopState = "processing";
    listener?.pause();
    syncStatus();
    const deliverAs = activeCtx?.isIdle?.() === false ? { deliverAs: "followUp" as const } : undefined;
    pi.sendUserMessage(text, deliverAs);
    notify(`Heard: ${text}`, "info");
  };

  const startLoop = async () => {
    if (!config.listener.wake) {
      notify("Set PI_LISTENER_ACTIVATION_NAME in .env to use the listener", "error");
      return;
    }

    loopState = "starting";
    syncStatus();

    const modelPath = await ensureWhisperModel({
      ...config.whisper,
      onNotify: (message, level) => notify(message, level ?? "info"),
    }).catch((error) => {
      notify(error instanceof Error ? error.message : "Whisper model download failed", "error");
      return undefined;
    });
    if (!modelPath) {
      loopState = "stopped";
      syncStatus();
      return;
    }

    listener = createListenerProcess({
      binaryPath: config.listener.binaryPath,
      modelPath,
      wake: config.listener.wake,
      chimePath: config.listener.chimePath,
      extraArgs: config.listener.extraArgs,
      onEvent: (event) => {
        if (event.type === "ready") {
          loopState = "listening";
          notify("Listening for wake word", "info");
          syncStatus();
        } else if (event.type === "command") {
          handleCommand(event.text);
        }
      },
      onNotify: (message, level) => notify(message, level),
      onExit: () => {
        loopState = "stopped";
        syncStatus();
      },
    });
    listener.start();
  };

  const stopLoop = async () => {
    loopState = "stopped";
    await playbackQueue.stop().catch(() => undefined);
    await listener?.stop();
    listener = undefined;
    syncStatus();
  };

  const setMuteState = async (muted: boolean): Promise<void> => {
    if (muted) {
      muteState.mute();
    } else {
      muteState.unmute();
    }
    await persistVoiceSettingsMute(muted);
    await playbackQueue.setMuted(muted);
    if (muted && loopState === "processing") {
      resumeListening();
    }
    syncStatus();
  };

  pi.on("session_start", async (_event, ctx) => {
    activeCtx = ctx;
    const startupState = await loadVoiceSettingsStartupState();
    piperSelection = startupState.selection;
    muteState = startupState.muteState;
    await playbackQueue.setMuted(muteState.isMuted());
    syncStatus(ctx);

    void ensurePiperTool({
      env: process.env,
      onNotify: (message, level) => ctx.ui.notify(message, level ?? "info"),
    }).then(async () => {
      piperSelection = await resolvePiperVoiceSelection();
    }).catch((error) => {
      const message = error instanceof Error ? error.message : String(error);
      ctx.ui.notify(message, "error");
      console.error(error);
    });
  });

  pi.on("session_end", async () => {
    await stopLoop();
  });

  pi.on("message_end", async (event) => {
    if (loopState === "stopped") return;
    const text = extractAssistantReplyText(event?.message);
    if (text && !muteState.isMuted()) {
      listener?.pause();
      void playbackQueue.enqueue(text);
    } else if (loopState === "processing" && playbackQueue.pendingCount() === 0) {
      resumeListening();
    }
  });

  pi.registerCommand?.("listen", {
    description: "Toggle the hands-free wake-word listening loop",
    handler: async (_args, ctx) => {
      activeCtx = ctx;
      if (loopState === "stopped") {
        await startLoop();
      } else {
        await stopLoop();
        notify("Listener stopped", "info");
      }
    },
  });

  pi.registerCommand?.("pi-listener", {
    description: "Open the pi-listener menu",
    handler: async (_args, ctx) => {
      activeCtx = ctx;
      syncStatus(ctx);
      await openUnifiedTalkMenu(ctx, {
        isMuted: () => muteState.isMuted(),
        setMuted: async (nextMuted) => {
          await setMuteState(nextMuted);
        },
        getStatusText: () => footerText(),
      });
      syncStatus(ctx);
    },
  });
}
