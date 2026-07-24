import fs from "node:fs";
import fsp from "node:fs/promises";
import https from "node:https";
import path from "node:path";

export type WhisperModelOptions = {
  modelPath: string;
  modelUrl: string;
  onNotify?: (message: string, level?: "info" | "warning" | "error") => void;
};

async function downloadFile(url: string, targetPath: string): Promise<void> {
  await fsp.mkdir(path.dirname(targetPath), { recursive: true });
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
        reject(new Error(`Model download failed: HTTP ${response.statusCode}`));
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

export async function ensureWhisperModel(options: WhisperModelOptions): Promise<string> {
  try {
    const stats = await fsp.stat(options.modelPath);
    if (stats.size > 0) return options.modelPath;
  } catch {
    // download below
  }

  options.onNotify?.("Pi-listener: Downloading 📥 Whisper model", "info");
  await downloadFile(options.modelUrl, options.modelPath);
  return options.modelPath;
}
