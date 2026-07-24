import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import fs from "node:fs";
import readline from "node:readline";

export type ListenerEvent =
  | { type: "ready" }
  | { type: "wake_only" }
  | { type: "command"; text: string };

export type ListenerProcessOptions = {
  binaryPath: string;
  modelPath: string;
  wake: string;
  chimePath?: string;
  extraArgs?: string[];
  onEvent: (event: ListenerEvent) => void;
  onNotify?: (message: string, level: "info" | "warning" | "error") => void;
  onExit?: () => void;
};

export type ListenerProcess = {
  start(): void;
  stop(): Promise<void>;
  pause(): void;
  resume(): void;
  isRunning(): boolean;
};

const RESTART_BACKOFF_MS = [1000, 2000, 5000, 10000];
const STOP_KILL_TIMEOUT_MS = 3000;

export function createListenerProcess(options: ListenerProcessOptions): ListenerProcess {
  let child: ChildProcessWithoutNullStreams | undefined;
  let stopping = false;
  let restartAttempt = 0;
  let restartTimer: NodeJS.Timeout | undefined;

  const notify = (message: string, level: "info" | "warning" | "error" = "info") => {
    options.onNotify?.(message, level);
  };

  const buildArgs = (): string[] => {
    const args = ["-m", options.modelPath, "--wake", options.wake, "-l", "en"];
    if (options.chimePath && fs.existsSync(options.chimePath)) {
      args.push("--chime", options.chimePath);
    }
    return args.concat(options.extraArgs ?? []);
  };

  const spawnChild = () => {
    if (!fs.existsSync(options.binaryPath)) {
      notify(`Listener binary not found: ${options.binaryPath}. Run native/listener/build.sh or set PI_LISTENER_BIN.`, "error");
      return;
    }

    const proc = spawn(options.binaryPath, buildArgs(), { stdio: ["pipe", "pipe", "pipe"] });
    child = proc;

    readline.createInterface({ input: proc.stdout }).on("line", (line) => {
      let event: ListenerEvent;
      try {
        event = JSON.parse(line);
      } catch {
        return;
      }
      if (event.type === "ready") {
        restartAttempt = 0;
      }
      options.onEvent(event);
    });

    readline.createInterface({ input: proc.stderr }).on("line", (line) => {
      console.error(`[pi-listener] ${line}`);
    });

    proc.on("error", (error) => {
      notify(`Listener failed to start: ${error.message}`, "error");
    });

    proc.on("exit", (code) => {
      if (child !== proc) return;
      child = undefined;
      if (stopping) {
        options.onExit?.();
        return;
      }

      const backoff = RESTART_BACKOFF_MS[Math.min(restartAttempt, RESTART_BACKOFF_MS.length - 1)];
      restartAttempt += 1;
      notify(`Listener exited unexpectedly (code ${code}); restarting in ${backoff / 1000}s`, "warning");
      restartTimer = setTimeout(() => {
        restartTimer = undefined;
        if (!stopping) spawnChild();
      }, backoff);
    });
  };

  const send = (command: string) => {
    child?.stdin.write(`${command}\n`);
  };

  return {
    start(): void {
      if (child) return;
      stopping = false;
      restartAttempt = 0;
      spawnChild();
    },
    async stop(): Promise<void> {
      stopping = true;
      if (restartTimer) {
        clearTimeout(restartTimer);
        restartTimer = undefined;
      }
      const proc = child;
      if (!proc) return;

      await new Promise<void>((resolve) => {
        const killTimer = setTimeout(() => proc.kill("SIGKILL"), STOP_KILL_TIMEOUT_MS);
        proc.once("exit", () => {
          clearTimeout(killTimer);
          resolve();
        });
        proc.stdin.end();
      });
      child = undefined;
    },
    pause(): void {
      send("PAUSE");
    },
    resume(): void {
      send("RESUME");
    },
    isRunning(): boolean {
      return child !== undefined;
    },
  };
}
