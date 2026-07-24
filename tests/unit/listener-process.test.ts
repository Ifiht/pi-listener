import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createListenerProcess, type ListenerEvent } from "../../src/listener/listener-process.ts";

// Fake native listener: a CommonJS node script driven by --mode= in extraArgs.
// "normal"     -> emits ready + command, echoes PAUSE/RESUME control lines back as events.
// "crashonce"  -> emits ready, then exits(1) on first run (via marker file), stays alive after.
const FAKE = `#!/usr/bin/env node
const fs = require("node:fs");
const args = process.argv.slice(2);
const arg = (p) => { const a = args.find((x) => x.startsWith(p)); return a ? a.slice(p.length) : ""; };
const mode = arg("--mode=") || "normal";
const marker = arg("--marker=");
const emit = (o) => process.stdout.write(JSON.stringify(o) + "\\n");
if (mode === "crashonce") {
  emit({ type: "ready" });
  if (!fs.existsSync(marker)) { fs.writeFileSync(marker, "1"); process.exit(1); }
  setInterval(() => {}, 1000);
} else {
  emit({ type: "ready" });
  emit({ type: "command", text: "hello world" });
  let buf = "";
  process.stdin.on("data", (d) => {
    buf += d.toString();
    let i;
    while ((i = buf.indexOf("\\n")) >= 0) {
      const line = buf.slice(0, i).trim();
      buf = buf.slice(i + 1);
      if (line === "PAUSE" || line === "RESUME") emit({ type: "ctrl", value: line });
    }
  });
  process.stdin.on("end", () => process.exit(0));
}
`;

function writeFakeBinary(dir: string): string {
  const bin = path.join(dir, "fake-listener.cjs");
  fs.writeFileSync(bin, FAKE, { mode: 0o755 });
  return bin;
}

async function waitFor(predicate: () => boolean, timeoutMs = 5000): Promise<void> {
  const start = Date.now();
  while (!predicate()) {
    if (Date.now() - start > timeoutMs) throw new Error("waitFor timed out");
    await new Promise((r) => setTimeout(r, 20));
  }
}

async function run(): Promise<void> {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pi-listener-proc-"));
  const bin = writeFakeBinary(dir);

  // Phase A: parsing + pause/resume stdin control reaching the child.
  const events: Array<ListenerEvent & { value?: string }> = [];
  const normal = createListenerProcess({
    binaryPath: bin,
    modelPath: "model",
    wake: "wake",
    extraArgs: ["--mode=normal"],
    onEvent: (e) => events.push(e as ListenerEvent & { value?: string }),
  });
  normal.start();

  await waitFor(() => events.some((e) => e.type === "ready") && events.some((e) => e.type === "command"));
  const command = events.find((e) => e.type === "command");
  assert.equal(command && "text" in command ? command.text : undefined, "hello world");
  assert.equal(normal.isRunning(), true);

  normal.pause();
  normal.resume();
  await waitFor(() => events.filter((e) => (e as { value?: string }).value).length >= 2);
  const ctrl = events.filter((e) => (e as { value?: string }).value).map((e) => (e as { value?: string }).value);
  assert.deepEqual(ctrl, ["PAUSE", "RESUME"]);

  await normal.stop();
  assert.equal(normal.isRunning(), false);

  // Phase B: unexpected exit triggers an automatic restart (second "ready").
  const readyCounts: number[] = [];
  const crashing = createListenerProcess({
    binaryPath: bin,
    modelPath: "model",
    wake: "wake",
    extraArgs: ["--mode=crashonce", `--marker=${path.join(dir, "marker")}`],
    onEvent: (e) => { if (e.type === "ready") readyCounts.push(1); },
  });
  crashing.start();

  // First ready, crash, backoff (1s), respawn, second ready.
  await waitFor(() => readyCounts.length >= 2, 8000);
  assert.ok(readyCounts.length >= 2, "listener should restart after unexpected exit");

  await crashing.stop();
  fs.rmSync(dir, { recursive: true, force: true });
  console.log("listener-process.test.ts passed");
}

run();
