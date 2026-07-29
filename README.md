# pi-listener

Hands-free voice loop for [pi](https://github.com/badlogic/pi-mono): a native
wake-word listener (whisper.cpp) plus spoken replies (Piper TTS).

Say your wake word, speak an instruction, hear the assistant answer, speak a
follow-up — no keyboard.

## How it works

- A native binary (`native/listener/pi-listener`, forked from whisper.cpp's
  `command` example) continuously captures mic audio, detects the wake word,
  and emits JSON events.
- The extension supervises it: on a command it pauses the listener, sends the
  text to pi, speaks the reply through Piper, then resumes listening.
- `/listen` toggles the loop. `/pi-listener` opens the menu (mute, status).

## Install

```bash
pi install https://github.com/Ifiht/pi-listener
cd ~/.pi/agent/git/github.com/Ifiht/pi-listener
./build.sh
cp .env.example ~/.pi/agent/extensions/pi-listener/.env   # then set PI_LISTENER_ACTIVATION_NAME
```

`build.sh` initializes the whisper.cpp submodule, installs node deps, builds
the native listener, downloads the base.en Whisper model, and fetches a
prebuilt Piper binary for your platform.

## Requirements

- Node.js 24+
- git, curl, cmake, and SDL2
  - Debian/Raspberry Pi OS: `sudo apt install build-essential cmake libsdl2-dev alsa-utils`
  - macOS: `brew install cmake sdl2`
- A microphone and speaker

Piper voice models (Ryan, Lessac) and the Whisper model are auto-downloaded on
first use into `~/.pi/agent/extensions/pi-listener` (or `./tools` without `~/.pi`).
`build.sh` installs the native listener binary there too, so it survives
`pi update --extensions`. Re-run `./build.sh` after an update only if the
native sources changed.

## Configuration

All settings live in `~/.pi/agent/extensions/pi-listener/.env` (copy from
`.env.example`). This directory persists across `pi update --extensions`; the
git checkout under `~/.pi/agent/git/` is overwritten on every update, so don't
keep your `.env` there.

| Variable | Default / Note |
| --- | --- |
| `PI_LISTENER_ACTIVATION_NAME` | **required** — the wake word |
| `PI_LISTENER_BIN` | `<tools>/listener/pi-listener` |
| `PI_LISTENER_CHIME` | `./sound/alert.wav` |
| `PI_LISTENER_ARGS` | extra listener args, e.g. `-vth 0.7 -c 1 -fms 10000` |
| `PI_LISTENER_TOOLS_DIR` | tools root override |
| `PI_LISTENER_PIPER_BIN` | `<tools>/piper/piper` |
| `PI_LISTENER_PIPER_MODEL_PATH` | `<tools>/piper/models/en_US-lessac-medium.onnx` |
| `PI_LISTENER_TTS_OUTPUT_DIR` | temp directory |
| `PI_LISTENER_WHISPER_MODEL_PATH` | `<tools>/whisper/models/ggml-base.en.bin` |
| `PI_LISTENER_WHISPER_MODEL_URL` | base.en on Hugging Face |

## Usage

1. Start `pi`.
2. Run `/listen` — wait for the "Listening for wake word" notice.
3. Say `<wake word>, <instruction>` in one breath, or just the wake word and
   speak the instruction after the chime.
4. The reply is spoken; listening resumes automatically.
5. Run `/listen` again to stop. `/pi-listener` opens the mute/status menu.

## Standalone listener test

```bash
./native/listener/build/pi-listener \
  -m whisper.cpp/models/ggml-base.en.bin \
  --wake <word> --chime sound/alert.wav
```

Speak the wake word plus a command and watch for
`{"type":"command","text":"..."}` on stdout. Ctrl+C to quit.

## Development

```bash
./test.sh   # typecheck + unit + integration tests
```

