import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Regression test: after an assistant reply is spoken (or playback fails),
// the native listener must receive RESUME. Previously message_end paused the
// listener without setting loopState to "processing", so onIdle never resumed.

async function waitFor(check: () => boolean, timeoutMs = 5000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (!check()) {
    if (Date.now() > deadline) throw new Error("waitFor timed out");
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

async function run() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pi-listener-resume-"));
  const commandLog = path.join(dir, "commands.log");
  const modelPath = path.join(dir, "model.bin");
  fs.writeFileSync(modelPath, "fake model");

  const binaryPath = path.join(dir, "fake-listener.sh");
  fs.writeFileSync(
    binaryPath,
    `#!/bin/sh\necho '{"type":"ready"}'\nwhile IFS= read -r line; do echo "$line" >> "${commandLog}"; done\n`,
  );
  fs.chmodSync(binaryPath, 0o755);

  process.env.PI_LISTENER_ACTIVATION_NAME = "pi";
  process.env.PI_LISTENER_BIN = binaryPath;
  process.env.PI_LISTENER_WHISPER_MODEL_PATH = modelPath;
  process.env.PI_LISTENER_PIPER_BIN = path.join(dir, "no-such-piper");

  const { default: extension } = await import("../../pi-listener.ts");

  const handlers = new Map<string, (event: any, ctx: any) => void | Promise<void>>();
  const commands = new Map<string, { handler: (args: string, ctx: any) => void | Promise<void> }>();
  const notifications: string[] = [];

  extension({
    on: (event: string, handler: (event: any, ctx: any) => void | Promise<void>) => handlers.set(event, handler),
    registerCommand: (name: string, command: { description: string; handler: (args: string, ctx: any) => void | Promise<void> }) => commands.set(name, command),
    sendUserMessage: () => {},
  });

  const ctx = {
    ui: {
      setStatus: () => {},
      notify: (message: string) => notifications.push(message),
      select: async () => undefined,
    },
  };

  await commands.get("listen")!.handler("", ctx);
  await waitFor(() => notifications.some((m) => m.includes("Listening for wake word")));

  await handlers.get("message_end")!({ message: { role: "assistant", content: "2 + 2 equals 4." } }, ctx);

  await waitFor(() => {
    if (!fs.existsSync(commandLog)) return false;
    return fs.readFileSync(commandLog, "utf8").trim().split("\n").includes("RESUME");
  });

  const sent = fs.readFileSync(commandLog, "utf8").trim().split("\n");
  assert.deepEqual(sent, ["PAUSE", "RESUME"]);

  await commands.get("listen")!.handler("", ctx); // stop loop, reap child
  fs.rmSync(dir, { recursive: true, force: true });
}

run().then(
  () => console.log("resume-after-reply: ok"),
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
