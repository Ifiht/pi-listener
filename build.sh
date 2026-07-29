#!/usr/bin/env bash
# One-shot setup: whisper.cpp submodule, node deps, native listener, piper TTS.
# Prerequisites: git, curl, cmake, SDL2, python3 (apt: build-essential cmake libsdl2-dev python3-venv / brew: cmake sdl2)
set -euo pipefail
cd "$(dirname "$0")"

# Node may be managed by nvm and not on PATH in non-interactive shells.
if ! command -v npm >/dev/null 2>&1; then
    export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 24
fi

git submodule update --init whisper.cpp
npm install
native/listener/build.sh

# Piper TTS: install the official piper-tts wheel (OHF-Voice/piper1-gpl) into a
# venv under the tools root. Wheels bundle espeak-ng and cover all platforms;
# the extension auto-downloads the old prebuilt zip on Windows instead.
if [ -d "$HOME/.pi" ]; then
    TOOLS_ROOT="$HOME/.pi/agent/extensions/pi-listener"
else
    TOOLS_ROOT="./tools"
fi
PIPER_BIN="$TOOLS_ROOT/piper-venv/bin/piper"
if [ ! -x "$PIPER_BIN" ]; then
    command -v python3 >/dev/null 2>&1 || { echo "python3 is required to install piper-tts" >&2; exit 1; }
    echo "Installing piper-tts into $TOOLS_ROOT/piper-venv ..."
    mkdir -p "$TOOLS_ROOT"
    python3 -m venv "$TOOLS_ROOT/piper-venv"
    "$TOOLS_ROOT/piper-venv/bin/pip" install --quiet --upgrade pip piper-tts
fi

echo
echo "Build complete."
echo "  Listener binary: native/listener/build/pi-listener"
echo "  Piper binary:    $PIPER_BIN"
echo "Next: cp .env.example ~/.pi/agent/extensions/pi-listener/.env, set PI_LISTENER_ACTIVATION_NAME, then run 'pi' and /listen"
