import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { executableName } from "../../src/tools.ts";

export type ToolPathFixture = {
  root: string;
  homeDir: string;
  cwd: string;
  piDir: string;
  homeToolsDir: string;
  localToolsDir: string;
  env: NodeJS.ProcessEnv;
};

export type ToolPathFixtureOptions = {
  withHomePi?: boolean;
  withHomeTools?: boolean;
  withLocalTools?: boolean;
  homeToolsAsFile?: boolean;
  localToolsAsFile?: boolean;
};

function createFile(filePath: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, "");
}

export function createToolPathFixture(options: ToolPathFixtureOptions = {}): ToolPathFixture {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "talk-pi-tool-path-"));
  const homeDir = path.join(root, "home");
  const cwd = path.join(root, "install");
  const piDir = path.join(homeDir, ".pi");
  const homeToolsDir = path.join(piDir, "agent", "extensions", "pi-listener");
  const localToolsDir = path.join(cwd, "tools");

  fs.mkdirSync(homeDir, { recursive: true });
  fs.mkdirSync(cwd, { recursive: true });

  if (options.withHomePi) {
    fs.mkdirSync(piDir, { recursive: true });
  }

  if (options.withHomeTools) {
    fs.mkdirSync(homeToolsDir, { recursive: true });
  } else if (options.homeToolsAsFile) {
    createFile(homeToolsDir);
  }

  if (options.withLocalTools) {
    fs.mkdirSync(localToolsDir, { recursive: true });
  } else if (options.localToolsAsFile) {
    createFile(localToolsDir);
  }

  const env = {
    HOME: homeDir,
    USERPROFILE: homeDir,
  } as NodeJS.ProcessEnv;

  return { root, homeDir, cwd, piDir, homeToolsDir, localToolsDir, env };
}

export function seedToolMarkers(toolsDir: string): void {
  fs.mkdirSync(path.join(toolsDir, "piper"), { recursive: true });
  fs.mkdirSync(path.join(toolsDir, "sox"), { recursive: true });
  fs.mkdirSync(path.join(toolsDir, "whisper", "models"), { recursive: true });
  fs.writeFileSync(path.join(toolsDir, "piper", executableName("piper")), "");
  fs.writeFileSync(path.join(toolsDir, "sox", executableName("sox")), "");
  fs.writeFileSync(path.join(toolsDir, "whisper", "models", "ggml-base.bin"), "");
}
