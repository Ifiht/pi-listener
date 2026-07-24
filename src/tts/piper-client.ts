import fs from "node:fs/promises";
import { spawn } from "node:child_process";
import { createTemporaryWavFile } from "./temp-wav.ts";
import { resolvePiperConfig, type PiperConfigInput } from "./piper-config.ts";

export type PiperClientOptions = PiperConfigInput & {
  spawnImpl?: typeof spawn;
};

export type PiperSynthesisResult = {
  audioPath: string;
  cleanup?: () => Promise<void>;
};

export async function synthesizeSpeechToWav(
  text: string,
  options: PiperClientOptions = {},
): Promise<PiperSynthesisResult> {
  const replyText = String(text ?? "").trim();
  if (!replyText) {
    throw new Error("Cannot synthesize empty text");
  }

  const config = resolvePiperConfig(options);
  const binaryPath = config.binaryPath;
  const modelPath = config.modelPath;
  const tempFile = await createTemporaryWavFile(config.outputDir);

  try {
    await new Promise<void>((resolve, reject) => {
      const spawnImpl = options.spawnImpl ?? spawn;
      const child = spawnImpl(binaryPath, ["--model", modelPath, "--output_file", tempFile.path], {
        env: config.env,
        stdio: ["pipe", "pipe", "pipe"],
      });

      let stderr = "";
      child.stderr.on("data", (chunk) => {
        stderr += String(chunk);
      });

      child.stdin.on?.("error", () => undefined);
      child.on("error", (error) => {
        reject((error as NodeJS.ErrnoException).code === "ENOENT"
          ? new Error(`Piper binary not found: ${binaryPath}. Put it in the extension folder or set PI_LISTENER_PIPER_BIN.`)
          : error);
      });
      child.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(stderr.trim() || `Piper failed with code ${code}`));
          return;
        }
        resolve();
      });

      child.stdin.end(`${replyText}\n`);
    });

    const stats = await fs.stat(tempFile.path);
    if (!stats.size) {
      throw new Error("Piper produced empty WAV file");
    }

    return {
      audioPath: tempFile.path,
      cleanup: () => tempFile.cleanup(),
    };
  } catch (error) {
    await tempFile.cleanup().catch(() => undefined);
    throw error;
  }
}
