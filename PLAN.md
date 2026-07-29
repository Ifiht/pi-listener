# PLAN: Hands-Free Voice Loop for Pi

## Status

Working end-to-end (user verified): `/listen` → wake word + instruction →
agent reply spoken via Piper → listening resumes. Typecheck + full test suite
green (`./test.sh`).

### Done this session
- **Resume bug**: `message_end` paused the listener without setting
  `loopState = "processing"`, so `onIdle` never resumed after the reply.
  Fixed + regression test `tests/integration/resume-after-reply.test.ts`
- **Persistent paths**: `.env` and the native listener binary now live in
  `~/.pi/agent/extensions/pi-listener/` (survives `pi update --extensions`;
  the git checkout under `~/.pi/agent/git/` is wiped). `build.sh` installs
  the binary to `<tools>/listener/pi-listener`; docs updated
- **Voice toggle**: hearing bare "listen" stops the loop like `/listen`
  (never forwarded to the agent) + test `tests/integration/listen-voice-toggle.test.ts`

### TODO
1. `whisperLanguage` in `piper-preferences.ts` still returns "pt" for
   non-english models — harmless (unused by listener) but revisit for
   English-only v1
2. Distribution: build-on-install vs prebuilt per-platform binaries — decide
   before publishing

### Notes
- Nothing loads `.env` for tests; entry loads it at import from
  `~/.pi/agent/extensions/pi-listener/.env`. Wake word required: extension
  errors on `/listen` if `PI_LISTENER_ACTIVATION_NAME` unset
- Listener binary default: `<tools>/listener/pi-listener`; chime default
  `<pkg>/sound/alert.wav`
- `message_end` handler: if muted, resumes listening immediately instead of
  enqueueing TTS

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
2. **Control**: `/listen` toggles the loop on/off; saying bare "listen" while active also stops it. No other UI needed.
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
