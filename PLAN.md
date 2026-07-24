# PLAN: Hands-Free Voice Loop for Pi

## PROGRESS (resume point)

### Done — Phase 1 (verified working by user)
- `native/listener/pi-listener.cpp` — wake-word listener, JSON stdout (`ready`/`wake_only`/`command`), stdin PAUSE/RESUME, EOF exit, follow-up window (`--follow-ms`, default 8s), SDL chime (`--chime`), `--wake` required
- `native/listener/CMakeLists.txt` + `build.sh` — builds against untouched submodule
- User verified: wake detection, follow-up command, chime, Ctrl-D exit. NOT yet verified: PAUSE/RESUME protocol

### Done — Phase 2 (written, NOT yet run/verified)
- `src/listener/listener-process.ts` — spawn/supervise, JSON parse, pause/resume, crash restart w/ backoff
- `src/listener/whisper-model.ts` — model download (base.en), extracted from offline-whisper
- `pi-listener.ts` — new entry: `/listen` toggle, half-duplex (pause on send → resume on playback-queue idle), `/pi-listener` menu, loads `.env` via `process.loadEnvFile`
- `src/config.ts` — rewritten: `PI_LISTENER_*` vars, listener config, no shortcuts
- `src/tts/playback-queue.ts` — added `onIdle` callback
- `src/ui/menu-actions.ts` + `unified-talk-menu.ts` — dropped voice-language
- `package.json` — renamed pi-listener v2.0.0, dropped decibri + whisper-cpp-node
- Env renames done in: `tools.ts` (also removed unused `hasRequiredTools`), `temp-wav.ts`, `piper-client.ts`, `wav-player.ts`, `piper-preferences.ts`, `tools-bootstrap.ts` (also base.en + Pi-listener messages)
- `.env.example` — rewritten with `PI_LISTENER_*`, placeholder wake word
- Tests updated (chooseVoiceLanguage removed): `tests/unit/unified-talk-menu.test.ts`, `tests/integration/{voice-settings-restore,voice-settings-recovery,voice-settings-defaults,unified-talk-menu-open}.test.ts`

### TODO (next session)
1. **Fix TypeScript typecheck errors** — `test.sh` now runs `npx tsc --noEmit` first; it's failing before tests reach the runtime loop. Investigate the errors from `./test.sh` and fix them.
2. README rewrite for pi-listener
3. End-to-end: copy `.env.example` → `.env`, set real wake word, `/listen`, full loop test
4. `whisperLanguage` in `piper-preferences.ts` still returns "pt" for non-english models — harmless (unused by listener) but revisit for English-only v1

### Done previous session
- **TODO #1 completed**: deleted dead files:
  `talk-pi.ts`, `src/input/`, `src/voice/`, `src/recording/`, `src/state/`, `src/ui/recording_status.ts`,
  plus 15 dead push-to-talk test files (kept: recording-gate, esc-*, piper-*, mute-*, spoken-*, temp-wav-*, tools-*, footer-status, playback-queue-* tests)

### Done this session
- **TODO #1 (env rename)**: `TALK_PI_*` → `PI_LISTENER_*` in all kept tests + fixtures (tools, piper-config, piper-preferences, voice-settings-test-utils unit+integration, 3 integration piper tests)
- **TODO #2 (extension dir)**: fixtures now use `.pi/agent/extensions/pi-listener`; piper default model expectation updated `pt_BR-faber-medium` → `en_US-lessac-medium`
- **TODO #3 (listener test)**: added `tests/unit/listener-process.test.ts` (fake child binary: JSON parse, PAUSE/RESUME stdin control, unexpected-exit restart)
- **Source fix**: `src/tts/piper-config.ts` still imported removed `loadTalkPiConfig`/`TalkPiPiperConfig` → now `loadPiListenerConfig`/`PiListenerPiperConfig` (was a hard break for every piper test)
- **TODO (piper provisioning)**: `ensurePiperTool` now respects `PI_LISTENER_PIPER_BIN` + `PI_LISTENER_PIPER_MODEL_PATH` and short-circuits external installs; `synthesizeSpeechToWav` no longer re-runs provisioning (spawns directly, remaps `ENOENT` to a friendly error)
- **TODO (fake-binary tests)**: cleaned `piper-client.test.ts` + `piper-client-path.test.ts` to remove fake executable writes; `piper-client-path` now tests `ENOENT` error remapping
- **TODO (menu tests)**: removed stale `Voice Language` option from `unified-talk-menu.test.ts` and integration menu tests (`mute-menu-toggle`, `unified-talk-menu-open`, `voice-settings-defaults`, `voice-settings-restore`)
- **TODO (static type checking)**: added `tsconfig.json`, added `typescript` as a devDependency, `test.sh` now runs `npx tsc --noEmit` before tests
- **TODO (footer-status)**: deleted dead `src/ui/footer-status.ts` and its tests (`tests/unit/footer-status.test.ts`, `tests/integration/footer-status.test.ts`)

### Notes
- Nothing loads `.env` for tests; entry loads it at import. Wake word required: extension errors on `/listen` if `PI_LISTENER_ACTIVATION_NAME` unset
- Listener binary default path: `<pkg>/native/listener/build/pi-listener`; chime default `<pkg>/sound/QuestLog.wav` (user's file, ~200KB — trim if follow-up feels sluggish)
- `message_end` handler: if muted, resumes listening immediately instead of enqueueing TTS

## Goal

Replace talk-pi's push-to-talk with a fully hands-free loop:

1. User runs `/listen` once.
2. A long-running `pi-listener` child process (compiled C, forked from `whisper.cpp/examples/command`) listens continuously with VAD + wake-word detection.
3. On an utterance containing the configured wake word, the instruction (text after the wake word) is sent to the pi agent as a user message.
4. Half-duplex: while the listener speaks it does not listen, and while listening it does not speak.
5. Pi's reply is spoken via Piper TTS (existing playback queue).
6. Listening resumes automatically. Loop until stopped.

## Decisions (locked)

0. **Rename**: the whole extension becomes `pi-listener` — `package.json` name, main entry `talk-pi.ts` → `pi-listener.ts`, `/talk-pi` menu command, and `TALK_PI_*` env vars → `PI_LISTENER_*`. Repo/submodule folders can stay; this is the npm package + user-facing rename.
1. **Wake word**: configured via `PI_LISTENER_ACTIVATION_NAME` in `.env` (gitignored, so the real name stays private). Matched loosely — any utterance where the word appears (bare, or prefixed with "Hey", "Hello", "OK", ...) triggers. Everything after the wake word is the instruction. This plan and all committed code use a generic placeholder; no real wake word is committed.
2. **Control**: `/listen` toggles the loop on/off. No other UI needed.
3. **Native code lives in `native/listener/`** — a copy of `command.cpp` + `CMakeLists.txt` building against the submodule's libwhisper. The `whisper.cpp/` submodule is never patched.
4. **Half-duplex, no barge-in**: listener is paused for the entire speak phase (send → generate → TTS drain), resumed after. v1 has no interrupt-while-speaking.
5. **English only for v1**: whisper `-l en`, English Piper voice. Drop pt default and language selection to simplify. Multi-language can return later.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│ talk-pi extension (Node/TS)                             │
│                                                          │
│  /listen command ──► ListenerProcess (spawn)             │
│                        │  stdout: transcribed commands   │
│                        │  stdin:  PAUSE / RESUME         │
│                        ▼                                 │
│  pi.sendUserMessage(transcript)                          │
│                        │                                 │
│  message_end ──► pause listener ──► Piper TTS playback   │
│                  ──► resume listener                     │
└─────────────────────────────────────────────────────────┘
        │ spawns
        ▼
┌─────────────────────────────────────────────────────────┐
│ pi-listener (C++, fork of command.cpp)                  │
│  SDL2 mic capture ─► VAD ─► wake-word scan               │
│  ─► transcribe command ─► print JSON line to stdout      │
│  stdin control: PAUSE (audio.pause) / RESUME             │
└─────────────────────────────────────────────────────────┘
```

**Why child process over `whisper-cpp-node`:** `command.cpp` already bundles SDL2 capture, energy-based VAD (`vad_simple`), and the model kept hot in memory — one continuous loop in fast compiled code. We swap its prompt-similarity check for a loose wake-word scan. The Node side stays a thin supervisor.

## Phase 1: `native/listener/` (fork of command.cpp)

Copy `whisper.cpp/examples/command/command.cpp` → `native/listener/pi-listener.cpp` and add a `native/listener/CMakeLists.txt` that links the submodule's built libwhisper + common-sdl. The submodule stays pristine.

Start from `always_prompt_transcription` (it already does VAD → transcribe a single utterance → look for a prompt), then change the matching:

1. **Loose wake-word scan**: replace the length/similarity prompt check with a case-insensitive substring/word scan for the wake word (passed via `--wake` arg; no default baked into the binary). On match, the command is the trimmed text *after* the first wake-word occurrence, so bare or "Hey/Hello/OK &lt;wake&gt;" prefixes all work. If the wake word is the whole utterance (no trailing text), emit nothing (or a `wake_only` status) and keep listening. `similarity()` in `common.cpp` is no longer needed for this path.
2. **Machine-readable output**: one JSON line per event on stdout — `{"type":"ready"}` after model load, `{"type":"command","text":"..."}` on a matched instruction. Human logs stay on stderr.
3. **stdin control protocol**: a thread reading stdin lines: `PAUSE` → `audio.pause()` + `audio.clear()`, `RESUME` → `audio.clear()` + `audio.resume()`. Keeps the mic from hearing Piper's TTS (self-trigger). Node drives this for half-duplex.
4. **Headless operation**: verify `sdl_poll_events` runs cleanly without a window/display. Exit gracefully on stdin EOF (parent died).

Build: `cmake -B build -DWHISPER_SDL2=ON && cmake --build build` in `native/listener/`. Requires SDL2 (`brew install sdl2` / `apt install libsdl2-dev`) and the whisper.cpp submodule built first.

## Phase 2: Extension rewrite

### New code

- **`src/listener/listener-process.ts`** — spawn/supervise the binary:
  - Resolve binary + model path via existing `src/tools.ts` conventions (`tools/whisper/pi-listener`, `tools/whisper/models/ggml-base.en.bin`; model download logic in `offline-whisper.ts` is reusable, switched to the `.en` model).
  - Pass `--wake` (from `PI_LISTENER_ACTIVATION_NAME` in `.env`; required, no hardcoded fallback) and `-l en`.
  - Parse stdout JSON lines → `onCommand(text)` callback.
  - `pause()` / `resume()` writing to stdin.
  - Restart with backoff on crash; kill on dispose.
- **`/listen` command** in `talk-pi.ts`:
  - Toggle: start loop if stopped, stop if running.
  - `onCommand` → `pi.sendUserMessage(text, ...)` (follow-up if not idle, as today).
  - Footer status: `listening` / `speaking` / `stopped`.

### Loop sequencing (echo avoidance)

- Pause listener on send; keep paused while pi generates.
- `message_end` → enqueue TTS → on playback-queue drain → `listener.resume()`.
- `playback-queue.ts` needs a drain/idle callback (small addition; `pendingCount()` already exists).

### Deletions (scrap push-to-talk)

- `PushToTalkEditor` / `setEditorComponent` block in `talk-pi.ts`
- `src/voice/voice-capture.ts`, `src/voice/offline-recorder.ts`, `src/voice/decibri-capture.ts`
- `src/input/` (f5-shortcut, voice-shortcut-interrupt, keyboard_listener, shortcut-config, editor-insert)
- Deps: `decibri`, `whisper-cpp-node` (model download in `offline-whisper.ts` is plain https — keep that part)
- Env vars `TALK_PI_SEND_TRANSCRIPT_KEY` / `TALK_PI_INSERT_TRANSCRIPT_KEY`, related tests
- Language selection UI in the menu and pt Piper default (English only for v1)

### `.env` / secrets

- `PI_LISTENER_ACTIVATION_NAME` holds the real wake word; `.env` is already gitignored.
- `.env.example` ships a generic placeholder (e.g. `PI_LISTENER_ACTIVATION_NAME=assistant`).
- The wake word never appears in committed source, tests, or docs.

### Keep

- Piper TTS chain: `playback-queue.ts`, `piper-client.ts`, `piper-preferences.ts`, `wav-player.ts`, `spoken-text.ts`, `speech-job.ts`
- `extractAssistantReplyText`, mute state, unified menu (trimmed), `config.ts` (trimmed), `tools.ts`, `tools-bootstrap.ts`
- Whisper model download from `offline-whisper.ts` (moves into listener bootstrap)

## Phase 3: Distribution / build

- The binary is platform-specific. Options: build-on-install script (needs cmake + SDL2 on user machine) vs. prebuilt binaries per platform bundled like Piper is today. Decide before publishing; for development, a `scripts/build-listener.sh` that builds the whisper.cpp submodule then `native/listener/` is enough.
- New env vars: `PI_LISTENER_BIN`, `PI_LISTENER_ACTIVATION_NAME` (required, from `.env`), `PI_LISTENER_ARGS` (threads, capture device, vad-thold passthrough).

## Verification

- **C side**: run `pi-listener` standalone with a test `--wake` word; speak "&lt;wake&gt;, &lt;command&gt;", assert JSON line on stdout; verify "Hey &lt;wake&gt;" / "Hello &lt;wake&gt;" variants all trigger; send `PAUSE`, speak, assert silence; `RESUME`, assert detection.
- **Node side**: unit test `listener-process.ts` against a fake child (script echoing canned JSON) covering parse, pause/resume writes, crash restart.
- **End-to-end**: manual — `/listen`, speak instruction, hear reply, speak follow-up without touching keyboard.

## Open Questions

All resolved — see **Decisions (locked)** above.
