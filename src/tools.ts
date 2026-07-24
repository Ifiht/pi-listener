import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export type ToolPathOptions = {
  env?: NodeJS.ProcessEnv;
  cwd?: string;
};

function normalizedPath(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function homeDirectory(env: NodeJS.ProcessEnv): string {
  return normalizedPath(env.HOME) ?? normalizedPath(env.USERPROFILE) ?? os.homedir();
}

function userPiRoot(env: NodeJS.ProcessEnv): string {
  return path.join(homeDirectory(env), ".pi");
}

function isDirectory(dirPath: string): boolean {
  return fs.statSync(dirPath).isDirectory();
}

function prepareToolDirectory(dirPath: string, label: string): string {
  try {
    fs.mkdirSync(dirPath, { recursive: true });
    return dirPath;
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    throw new Error(`[pi-listener] Unable to prepare ${label} at ${dirPath}: ${details}`);
  }
}

function resolveUserToolsRoot(env: NodeJS.ProcessEnv): string {
  const piRoot = userPiRoot(env);
  if (!fs.existsSync(piRoot)) {
    throw new Error(`[pi-listener] Expected user configuration root to exist at ${piRoot}`);
  }

  try {
    if (!isDirectory(piRoot)) {
      throw new Error(`not a directory`);
    }
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    throw new Error(`[pi-listener] Unable to access user configuration root at ${piRoot}: ${details}`);
  }

  return prepareToolDirectory(path.join(piRoot, "agent", "extensions", "pi-listener"), "user extension folder");
}

function resolveLocalToolsRoot(cwd: string): string {
  return prepareToolDirectory(path.join(cwd, "tools"), "local tools folder");
}

export function resolveToolsRoot(options: ToolPathOptions = {}): string {
  const env = options.env ?? process.env;
  const cwdRoot = options.cwd ?? process.cwd();
  const piRoot = userPiRoot(env);

  if (fs.existsSync(piRoot)) {
    return resolveUserToolsRoot(env);
  }

  const explicit = normalizedPath(env.PI_LISTENER_TOOLS_DIR);
  if (explicit) return explicit;

  return resolveLocalToolsRoot(cwdRoot);
}

export function resolveToolPath(segments: string[], options: ToolPathOptions = {}): string {
  return path.join(resolveToolsRoot(options), ...segments);
}

export function executableName(baseName: string): string {
  return process.platform === "win32" ? `${baseName}.exe` : baseName;
}
