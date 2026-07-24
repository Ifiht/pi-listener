import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const defaultCreatePlayer = createRequire(import.meta.url)("play-sound") as (opts?: Record<string, unknown>) => {
  play(filePath: string, options?: Record<string, unknown>, callback?: (error?: Error | null) => void): unknown;
};

function createWindowsWavProcess(filePath: string) {
  const script = "$path = $env:PI_LISTENER_WAV_FILE; $player = New-Object System.Media.SoundPlayer $path; $player.PlaySync()";
  return spawn("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script], {
    stdio: ["ignore", "ignore", "pipe"],
    windowsHide: true,
    env: {
      ...process.env,
      PI_LISTENER_WAV_FILE: filePath,
    },
  });
}

export type WavPlayer = {
  play(filePath: string): Promise<void>;
  stop(): Promise<void>;
};

export function createWavPlayer(createPlayer = defaultCreatePlayer): WavPlayer {
  const player = createPlayer({});
  let activeProcess: { pid?: number; kill(signal?: NodeJS.Signals | number): boolean; once(event: "close", listener: () => void): void } | undefined;

  const clear = () => {
    activeProcess = undefined;
  };

  return {
    play(filePath: string): Promise<void> {
      return new Promise((resolve, reject) => {
        if (globalThis.process.platform === "win32") {
          const child = createWindowsWavProcess(filePath);
          activeProcess = child;
          let stderr = "";
          child.stderr?.on("data", (chunk) => {
            stderr += String(chunk);
          });
          child.once("error", (error) => {
            if (activeProcess === child) clear();
            reject(error);
          });
          child.once("close", (code) => {
            if (activeProcess === child) clear();
            if (code && code !== 0) {
              reject(new Error(stderr.trim() || `Windows audio playback failed with code ${code}`));
              return;
            }
            resolve();
          });
          return;
        }

        const process = player.play(filePath, {}, (error?: Error | null) => {
          if (activeProcess === process) {
            clear();
          }
          if (error) {
            reject(error);
            return;
          }
          resolve();
        }) as typeof activeProcess;

        if (!process) {
          clear();
          reject(new Error("Unable to spawn audio player process"));
          return;
        }

        activeProcess = process;
      });
    },
    async stop(): Promise<void> {
      const childProcess = activeProcess;
      if (!childProcess) return;

      clear();
      const pid = childProcess.pid;
      if (!pid) {
        try {
          childProcess.kill("SIGKILL");
        } catch {
          // ignore stop errors; the process is being torn down
        }
        return;
      }

      if (globalThis.process.platform === "win32") {
        await new Promise<void>((resolve) => {
          const child = spawn("taskkill", ["/PID", String(pid), "/T", "/F"], {
            stdio: "ignore",
            windowsHide: true,
          });
          child.once("error", () => resolve());
          child.once("exit", () => resolve());
        });
        return;
      }

      try {
        childProcess.kill("SIGKILL");
      } catch {
        // ignore stop errors; the process is being torn down
      }
    },
  };
}
