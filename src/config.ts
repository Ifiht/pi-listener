import path from "node:path";
import { fileURLToPath } from "node:url";
import { defaultTemporaryWavRoot } from "./tts/temp-wav.ts";
import { executableName, resolveToolPath } from "./tools.ts";

export type PiListenerListenerConfig = {
  binaryPath: string;
  wake: string | undefined;
  chimePath: string;
  extraArgs: string[];
};

export type PiListenerPiperConfig = {
  binaryPath: string;
  modelPath: string;
  outputDir: string;
};

export type PiListenerWhisperConfig = {
  modelPath: string;
  modelUrl: string;
};

export type PiListenerConfig = {
  listener: PiListenerListenerConfig;
  piper: PiListenerPiperConfig;
  whisper: PiListenerWhisperConfig;
};

const DEFAULT_WHISPER_MODEL_URL =
  "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin";

function normalizedPath(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function packageRoot(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
}

function defaultListenerBinaryPath(): string {
  return path.join(packageRoot(), "native", "listener", "build", executableName("pi-listener"));
}

function defaultChimePath(): string {
  return path.join(packageRoot(), "sound", "QuestLog.wav");
}

function defaultPiperModelPath(env: NodeJS.ProcessEnv): string {
  return resolveToolPath(["piper", "models", "en_US-lessac-medium.onnx"], { env });
}

function defaultWhisperModelPath(env: NodeJS.ProcessEnv): string {
  return resolveToolPath(["whisper", "models", "ggml-base.en.bin"], { env });
}

function parseExtraArgs(value: string | undefined): string[] {
  return value?.trim() ? value.trim().split(/\s+/) : [];
}

export function loadPiListenerConfig(env: NodeJS.ProcessEnv = process.env): PiListenerConfig {
  return {
    listener: {
      binaryPath: normalizedPath(env.PI_LISTENER_BIN) ?? defaultListenerBinaryPath(),
      wake: normalizedPath(env.PI_LISTENER_ACTIVATION_NAME),
      chimePath: normalizedPath(env.PI_LISTENER_CHIME) ?? defaultChimePath(),
      extraArgs: parseExtraArgs(env.PI_LISTENER_ARGS),
    },
    piper: {
      binaryPath: normalizedPath(env.PI_LISTENER_PIPER_BIN) ?? resolveToolPath(["piper", executableName("piper")], { env }),
      modelPath: normalizedPath(env.PI_LISTENER_PIPER_MODEL_PATH) ?? defaultPiperModelPath(env),
      outputDir: normalizedPath(env.PI_LISTENER_TTS_OUTPUT_DIR) ?? defaultTemporaryWavRoot(),
    },
    whisper: {
      modelPath: normalizedPath(env.PI_LISTENER_WHISPER_MODEL_PATH) ?? defaultWhisperModelPath(env),
      modelUrl: normalizedPath(env.PI_LISTENER_WHISPER_MODEL_URL) ?? DEFAULT_WHISPER_MODEL_URL,
    },
  };
}
