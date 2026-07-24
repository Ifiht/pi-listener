import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { resolveToolPath } from "../tools.ts";

export type PiperModel = {
  id: string;
  label: string;
  language: "english" | "other";
  path: string;
  available: boolean;
};

export type PiperOutputKind = "default" | "english";

export type PiperVoicePreference = {
  selectedModelId?: string;
  selectedOutputKind: PiperOutputKind;
  muted: boolean;
  updatedAt: string;
};

export type PiperPreferenceOptions = {
  env?: NodeJS.ProcessEnv;
  modelPath?: string;
};

export type PiperPreferenceResolution = {
  models: PiperModel[];
  preference: PiperVoicePreference;
  activeModel?: PiperModel;
  activeOutputKind: PiperOutputKind;
  whisperLanguage: "pt" | "en";
  modelPath: string;
  outputLabel: string;
  muted: boolean;
};

export type PiperRuntimeConfig = {
  binaryPath: string;
  modelPath: string;
  outputDir: string;
  env: NodeJS.ProcessEnv;
};

const DEFAULT_PREFERENCE: PiperVoicePreference = {
  selectedOutputKind: "default",
  muted: false,
  updatedAt: new Date(0).toISOString(),
};

function piperToolsDir(env: NodeJS.ProcessEnv): string {
  return env.PI_LISTENER_PIPER_MODELS_DIR?.trim() || resolveToolPath(["piper"], { env });
}

function preferenceFilePath(env: NodeJS.ProcessEnv): string {
  return env.PI_LISTENER_PIPER_PREFERENCES_PATH?.trim() || path.join(os.homedir(), ".pi", "tts", "piper-preferences.json");
}

function normalizeModelId(modelPath: string): string {
  return modelPath.replace(/\\/g, "/").replace(/\.onnx$/i, "");
}

function modelLabel(modelPath: string): string {
  return path.basename(modelPath).replace(/\.onnx$/i, "");
}

const FRIENDLY_LABELS: Record<string, string> = {
  "en_US-lessac-medium": "Lessac",
  "en_US-ryan-medium": "Ryan",
  "pt_BR-faber-medium": "Faber",
};

export function friendlyModelLabel(modelPath: string): string {
  const base = modelLabel(modelPath);
  if (FRIENDLY_LABELS[base]) return FRIENDLY_LABELS[base]!;
  const match = base.match(/^[a-z]{2}(?:_[A-Z]{2})?-([^-]+)/);
  return match ? match[1]! : base;
}

function detectLanguage(modelPath: string): "english" | "other" {
  const label = modelLabel(modelPath).toLowerCase();
  return /^en([_-]|$)/.test(label) || label.includes("english") ? "english" : "other";
}

async function pathExists(candidate: string): Promise<boolean> {
  try {
    await fs.access(candidate);
    return true;
  } catch {
    return false;
  }
}

async function walkOnnxFiles(root: string): Promise<string[]> {
  const entries = await fs.readdir(root, { withFileTypes: true }).catch(() => [] as import("node:fs").Dirent[]);
  const discovered: string[] = [];
  for (const entry of entries) {
    const candidate = path.join(root, entry.name);
    if (entry.isDirectory()) {
      discovered.push(...await walkOnnxFiles(candidate));
      continue;
    }
    if (entry.isFile() && candidate.toLowerCase().endsWith(".onnx")) {
      discovered.push(candidate);
    }
  }
  return discovered;
}

export async function discoverPiperModels(options: PiperPreferenceOptions = {}): Promise<PiperModel[]> {
  const env = options.env ?? process.env;
  const root = piperToolsDir(env);
  const files: string[] = await pathExists(root) ? await walkOnnxFiles(root) : [];

  return [...new Set(files)].sort((a, b) => a.localeCompare(b)).map((modelPath) => ({
    id: normalizeModelId(modelPath),
    label: modelLabel(modelPath),
    language: detectLanguage(modelPath),
    path: modelPath,
    available: true,
  }));
}

export async function loadPiperVoicePreference(options: PiperPreferenceOptions = {}): Promise<PiperVoicePreference> {
  const env = options.env ?? process.env;
  const filePath = preferenceFilePath(env);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<PiperVoicePreference>;
    return {
      selectedModelId: typeof parsed.selectedModelId === "string" ? parsed.selectedModelId : undefined,
      selectedOutputKind: parsed.selectedOutputKind === "english" ? "english" : "default",
      muted: typeof parsed.muted === "boolean" ? parsed.muted : false,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date(0).toISOString(),
    };
  } catch {
    return { ...DEFAULT_PREFERENCE };
  }
}

export async function savePiperVoicePreference(preference: Partial<PiperVoicePreference>, options: PiperPreferenceOptions = {}): Promise<PiperVoicePreference> {
  const env = options.env ?? process.env;
  const filePath = preferenceFilePath(env);
  const next: PiperVoicePreference = {
    selectedModelId: typeof preference.selectedModelId === "string" ? preference.selectedModelId : undefined,
    selectedOutputKind: preference.selectedOutputKind === "english" ? "english" : "default",
    muted: typeof preference.muted === "boolean" ? preference.muted : false,
    updatedAt: new Date().toISOString(),
  };

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  return next;
}

function englishModel(models: PiperModel[]): PiperModel | undefined {
  return models.find((model) => model.language === "english");
}

function selectedModel(models: PiperModel[], preference: PiperVoicePreference, currentModelPath?: string): PiperModel | undefined {
  if (preference.selectedModelId) {
    const match = models.find((model) => model.id === preference.selectedModelId);
    if (match) return match;
  }
  if (currentModelPath) {
    const normalizedCurrent = normalizeModelId(currentModelPath);
    const current = models.find((model) => model.id === normalizedCurrent || model.path === currentModelPath);
    if (current) return current;
  }
  return models.find((model) => model.language !== "english") ?? models[0];
}

export async function resolvePiperVoiceSelection(options: PiperPreferenceOptions = {}): Promise<PiperPreferenceResolution> {
  const env = options.env ?? process.env;
  const models = await discoverPiperModels(options);
  const preference = await loadPiperVoicePreference(options);
  const currentModelPath = options.modelPath?.trim() || env.PI_LISTENER_PIPER_MODEL_PATH?.trim();
  const baseModel = selectedModel(models, preference, currentModelPath);
  const english = englishModel(models);
  const activeOutputKind = preference.selectedOutputKind === "english" ? "english" : "default";
  const selectedEnglish = baseModel?.language === "english" ? baseModel : english;
  const activeModel = activeOutputKind === "english" ? (selectedEnglish ?? baseModel) : baseModel;
  const whisperLanguage = activeModel?.language === "english" ? "en" : "pt";
  const outputLabel = activeOutputKind === "english"
    ? `English - ${activeModel ? friendlyModelLabel(activeModel.path) : "unknown"}`
    : `Portuguese - ${activeModel ? friendlyModelLabel(activeModel.path) : "Faber"}`;
  const muted = preference.muted;

  if (activeOutputKind === "english" && !english) {
    return {
      models,
      preference,
      activeModel: baseModel,
      activeOutputKind,
      modelPath: baseModel?.path ?? currentModelPath ?? resolveToolPath(["piper", "models", "pt_BR-faber-medium.onnx"], { env }),
      whisperLanguage,
      outputLabel,
      muted,
    };
  }

  return {
    models,
    preference,
    activeModel,
    activeOutputKind,
    modelPath: activeModel?.path ?? currentModelPath ?? resolveToolPath(["piper", "models", "pt_BR-faber-medium.onnx"], { env }),
    whisperLanguage,
    outputLabel,
    muted,
  };
}

export async function setPiperVoiceModel(modelId: string, options: PiperPreferenceOptions = {}): Promise<PiperVoicePreference> {
  const current = await loadPiperVoicePreference(options);
  return savePiperVoicePreference({ ...current, selectedModelId: modelId }, options);
}

export async function setPiperOutputKind(kind: PiperOutputKind, options: PiperPreferenceOptions = {}): Promise<PiperVoicePreference> {
  const current = await loadPiperVoicePreference(options);
  return savePiperVoicePreference({ ...current, selectedOutputKind: kind }, options);
}

export async function setPiperMuted(muted: boolean, options: PiperPreferenceOptions = {}): Promise<PiperVoicePreference> {
  const current = await loadPiperVoicePreference(options);
  return savePiperVoicePreference({ ...current, muted }, options);
}

export async function resolvePiperRuntimeConfig(
  base: { binaryPath: string; modelPath: string; outputDir: string; env?: NodeJS.ProcessEnv },
  options: PiperPreferenceOptions = {},
): Promise<PiperRuntimeConfig> {
  const env = options.env ?? process.env;
  const selection = await resolvePiperVoiceSelection({ env, modelPath: base.modelPath });
  return {
    binaryPath: base.binaryPath,
    modelPath: selection.modelPath,
    outputDir: base.outputDir,
    env: base.env ?? env,
  };
}
