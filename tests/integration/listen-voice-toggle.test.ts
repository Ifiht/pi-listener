import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Voice toggle: hearing the bare command "listen" stops the loop like /listen,
// and is never forwarded to the agent as a user message.

async function waitFor(check: () => boolean, timeoutMs = 5000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (!check()) {
    if (Date.now() > deadline) throw new Error("waitFor timed out");
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

async function run() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pi-listener-toggle-"));
  const modelPath = path.join(dir, "model.bin");
  fs.writeFileSync(modelPath, "fake model");

  const binaryPath = path.join(dir, "fake-listener.sh");
  fs.writeFileSync(
    binaryPath,
    `#!/bin/sh\necho '{"type":"ready"}'\necho '{"type":"command","text":"Listen."}'\nwhile IFS= read -r line; do :; done\n`,
  );
  fs.chmodSync(binaryPath, 0o755);

  process.env.PI_LISTENER_ACTIVATION_NAME = "pi";
  process.env.PI_LISTENER_BIN = binaryPath;
  process.env.PI_LISTENER_WHISPER_MODEL_PATH = modelPath;
  process.env.PI_LISTENER_PIPER_BIN = path.join(dir, "no-such-piper");

  const { default: extension } = await import("../../pi-listener.ts");

  const commands = new Map<string, { handler: (args: string, ctx: any) => void | Promise<void> }>();
  const notifications: string[] = [];
  const sentMessages: string[] = [];

  extension({
    on: () => {},
    registerCommand: (name: string, command: { description: string; handler: (args: string, ctx: any) => void | Promise<void> }) => commands.set(name, command),
    sendUserMessage: (text: string) => sentMessages.push(text),
  });

  const ctx = {
    ui: {
      setStatus: () => {},
      notify: (message: string) => notifications.push(message),
      select: async () => undefined,
    },
  };

  await commands.get("listen")!.handler("", ctx);
  await waitFor(() => notifications.some((m) => m.includes("Listener stopped")));

  assert.deepEqual(sentMessages, []);
  assert.ok(!notifications.some((m) => m.startsWith("Heard:")));

  fs.rmSync(dir, { recursive: true, force: true });
}

run().then(
  () => console.log("listen-voice-toggle: ok"),
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
