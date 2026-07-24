import fs from "node:fs";
import fsp from "node:fs/promises";
import https from "node:https";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { executableName, resolveToolPath } from "./tools.ts";

export type ToolNotifyLevel = "info" | "warning" | "error";
export type ToolNotify = (message: string, level?: ToolNotifyLevel) => void;

export type ToolBootstrapOptions = {
  env?: NodeJS.ProcessEnv;
  onNotify?: ToolNotify;
};

const PIPER_WINDOWS_ZIP = "https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_windows_amd64.zip";
const PIPER_VOICE_MODEL = "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx";
const PIPER_VOICE_MODEL_JSON = "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx.json";
const PIPER_RYAN_VOICE_MODEL = "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/ryan/medium/en_US-ryan-medium.onnx";
const PIPER_RYAN_VOICE_MODEL_JSON = "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/ryan/medium/en_US-ryan-medium.onnx.json";
const PIPER_LESSAC_VOICE_MODEL = "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/lessac/medium/en_US-lessac-medium.onnx";
const PIPER_LESSAC_VOICE_MODEL_JSON = "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/lessac/medium/en_US-lessac-medium.onnx.json";

function notify(options: ToolBootstrapOptions, message: string, level: ToolNotifyLevel = "info"): void {
  options.onNotify?.(message, level);
}

function toolRoot(options: ToolBootstrapOptions): string {
  return resolveToolPath([], options);
}

function piperBinaryPath(options: ToolBootstrapOptions): string {
  return path.join(toolRoot(options), "piper", executableName("piper"));
}

function piperVoiceModelPath(options: ToolBootstrapOptions): string {
  return path.join(toolRoot(options), "piper", "models", "pt_BR-faber-medium.onnx");
}

function piperVoiceModelJsonPath(options: ToolBootstrapOptions): string {
  return path.join(toolRoot(options), "piper", "models", "pt_BR-faber-medium.onnx.json");
}

function piperRyanModelPath(options: ToolBootstrapOptions): string {
  return path.join(toolRoot(options), "piper", "models", "en_US-ryan-medium.onnx");
}

function piperRyanModelJsonPath(options: ToolBootstrapOptions): string {
  return path.join(toolRoot(options), "piper", "models", "en_US-ryan-medium.onnx.json");
}

function piperLessacModelPath(options: ToolBootstrapOptions): string {
  return path.join(toolRoot(options), "piper", "models", "en_US-lessac-medium.onnx");
}

function piperLessacModelJsonPath(options: ToolBootstrapOptions): string {
  return path.join(toolRoot(options), "piper", "models", "en_US-lessac-medium.onnx.json");
}

function whisperModelPath(options: ToolBootstrapOptions): string {
  return path.join(toolRoot(options), "whisper", "models", "ggml-base.en.bin");
}

function exists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

async function ensureDir(dir: string): Promise<void> {
  await fsp.mkdir(dir, { recursive: true });
}

async function downloadFile(url: string, targetPath: string): Promise<void> {
  await ensureDir(path.dirname(targetPath));
  await fsp.unlink(targetPath).catch(() => undefined);

  await new Promise<void>((resolve, reject) => {
    const file = fs.createWriteStream(targetPath);
    const cleanup = () => void fsp.unlink(targetPath).catch(() => undefined);
    const request = https.get(url, (response) => {
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        const nextUrl = new URL(response.headers.location, url).toString();
        response.resume();
        file.close(cleanup);
        downloadFile(nextUrl, targetPath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        file.close(cleanup);
        reject(new Error(`Download failed: HTTP ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.once("finish", () => {
        file.close((error) => {
          if (error) {
            cleanup();
            reject(error);
            return;
          }
          resolve();
        });
      });
    });

    request.on("error", (error) => {
      file.close(cleanup);
      reject(error);
    });

    file.on("error", (error) => {
      request.destroy(error);
      cleanup();
      reject(error);
    });
  });
}

async function extractZip(zipPath: string, destination: string): Promise<void> {
  if (process.platform !== "win32") {
    throw new Error("Auto-download zip extraction only supported on Windows.");
  }

  await ensureDir(destination);
  const command = [
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-Command",
    `Expand-Archive -LiteralPath ${JSON.stringify(zipPath)} -DestinationPath ${JSON.stringify(destination)} -Force`,
  ];
  const result = spawnSync("powershell.exe", command, { stdio: "ignore" });
  if (result.status !== 0) {
    throw new Error(`Archive extraction failed for ${path.basename(zipPath)}`);
  }
}

async function flattenSingleChild(source: string): Promise<string> {
  const entries = await fsp.readdir(source, { withFileTypes: true }).catch(() => [] as import("node:fs").Dirent[]);
  if (entries.length !== 1) return source;
  const only = entries[0];
  if (only?.isDirectory()) return path.join(source, only.name);
  return source;
}

async function copyTree(source: string, destination: string): Promise<void> {
  await ensureDir(destination);
  await fsp.cp(source, destination, { recursive: true, force: true });
}

async function bootstrapWindowsZip(url: string, targetDir: string): Promise<void> {
  const tempRoot = await fsp.mkdtemp(path.join(os.tmpdir(), "pi-listener-tools-"));
  const zipPath = path.join(tempRoot, "archive.zip");
  const extractDir = path.join(tempRoot, "extract");
  try {
    await downloadFile(url, zipPath);
    await extractZip(zipPath, extractDir);
    const sourceRoot = await flattenSingleChild(extractDir);
    await copyTree(sourceRoot, targetDir);
  } finally {
    await fsp.rm(tempRoot, { recursive: true, force: true }).catch(() => undefined);
  }
}

export async function ensurePiperTool(options: ToolBootstrapOptions = {}): Promise<{ binaryPath: string; modelPath: string }> {
  const env = options.env ?? process.env;
  const explicitBinary = env.PI_LISTENER_PIPER_BIN?.trim();
  const externalBinary = explicitBinary && exists(explicitBinary) ? explicitBinary : undefined;
  const explicitModel = env.PI_LISTENER_PIPER_MODEL_PATH?.trim();

  if (externalBinary && explicitModel && exists(explicitModel)) {
    return { binaryPath: externalBinary, modelPath: explicitModel };
  }

  let binary: string;
  let model: string;
  let modelJson: string;
  let ryan: string;
  let ryanJson: string;

  try {
    binary = piperBinaryPath(options);
    model = piperVoiceModelPath(options);
    modelJson = piperVoiceModelJsonPath(options);
    ryan = piperRyanModelPath(options);
    ryanJson = piperRyanModelJsonPath(options);
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    throw new Error(`[pi-listener] Unable to resolve Piper extension path: ${details}`);
  }

  if (!externalBinary && (!exists(binary) || !exists(model) || !exists(modelJson))) {
    if (process.platform !== "win32") {
      throw new Error("Piper missing. Put it in the extension folder, or set PI_LISTENER_PIPER_BIN / PI_LISTENER_TOOLS_DIR.");
    }

    notify(options, "Pi-listener: Downloading 📥 Piper", "info");
    await bootstrapWindowsZip(PIPER_WINDOWS_ZIP, path.join(toolRoot(options), "piper"));
    if (!exists(model) || !exists(modelJson)) {
      notify(options, "Pi-listener: Downloading 📥 Piper voice model", "info");
      await ensureDir(path.dirname(model));
      await downloadFile(PIPER_VOICE_MODEL, model);
      await downloadFile(PIPER_VOICE_MODEL_JSON, modelJson);
    }
  }

  if (!exists(ryan) || !exists(ryanJson)) {
    notify(options, "Pi-listener: Downloading 📥 Piper English voice (Ryan)", "info");
    await ensureDir(path.dirname(ryan));
    await downloadFile(PIPER_RYAN_VOICE_MODEL, ryan);
    await downloadFile(PIPER_RYAN_VOICE_MODEL_JSON, ryanJson);
  }

  const lessac = piperLessacModelPath(options);
  const lessacJson = piperLessacModelJsonPath(options);
  if (!exists(lessac) || !exists(lessacJson)) {
    notify(options, "Pi-listener: Downloading 📥 Piper English voice (Lessac)", "info");
    await ensureDir(path.dirname(lessac));
    await downloadFile(PIPER_LESSAC_VOICE_MODEL, lessac);
    await downloadFile(PIPER_LESSAC_VOICE_MODEL_JSON, lessacJson);
  }

  return { binaryPath: externalBinary ?? binary, modelPath: model };
}

export async function ensureWhisperToolModel(options: ToolBootstrapOptions = {}): Promise<string> {
  let model: string;

  try {
    model = whisperModelPath(options);
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    throw new Error(`[pi-listener] Unable to resolve Whisper model path: ${details}`);
  }

  if (exists(model)) return model;

  notify(options, "Pi-listener: Downloading 📥 Whisper model", "info");
  await ensureDir(path.dirname(model));
  await downloadFile("https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin", model);
  return model;
}
