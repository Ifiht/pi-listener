import { loadPiListenerConfig, type PiListenerPiperConfig } from "../config.ts";

export type PiperConfigInput = {
  binaryPath?: string;
  modelPath?: string;
  outputDir?: string;
  env?: NodeJS.ProcessEnv;
};

export type PiperConfig = PiListenerPiperConfig & {
  env: NodeJS.ProcessEnv;
};

function normalized(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function resolvePiperConfig(options: PiperConfigInput = {}): PiperConfig {
  const env = options.env ?? process.env;
  const base = loadPiListenerConfig(env).piper;

  return {
    binaryPath: normalized(options.binaryPath) ?? base.binaryPath,
    modelPath: normalized(options.modelPath) ?? base.modelPath,
    outputDir: normalized(options.outputDir) ?? base.outputDir,
    env,
  };
}
