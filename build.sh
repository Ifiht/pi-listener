#!/usr/bin/env bash
# One-shot setup: whisper.cpp submodule, node deps, native listener, piper binary.
# Prerequisites: git, curl, cmake, SDL2 (apt: build-essential cmake libsdl2-dev / brew: cmake sdl2)
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

# Piper binary: the extension only auto-downloads it on Windows, so fetch the
# prebuilt release here for Linux/macOS if it is missing.
if [ -d "$HOME/.pi" ]; then
    TOOLS_ROOT="$HOME/.pi/agent/extensions/pi-listener"
else
    TOOLS_ROOT="./tools"
fi
PIPER_BIN="$TOOLS_ROOT/piper/piper"
if [ ! -x "$PIPER_BIN" ]; then
    case "$(uname -s)-$(uname -m)" in
        Linux-x86_64)   ASSET=piper_linux_x86_64.tar.gz ;;
        Linux-aarch64)  ASSET=piper_linux_aarch64.tar.gz ;;
        Linux-armv7l)   ASSET=piper_linux_armv7l.tar.gz ;;
        Darwin-x86_64)  ASSET=piper_macos_x64.tar.gz ;;
        Darwin-arm64)   ASSET=piper_macos_aarch64.tar.gz ;;
        *) echo "No prebuilt piper for $(uname -s)-$(uname -m); set PI_LISTENER_PIPER_BIN in .env" >&2; exit 1 ;;
    esac
    echo "Downloading piper ($ASSET) into $TOOLS_ROOT ..."
    mkdir -p "$TOOLS_ROOT"
    curl -fL "https://github.com/rhasspy/piper/releases/download/2023.11.14-2/$ASSET" | tar -xz -C "$TOOLS_ROOT"
fi

echo
echo "Build complete."
echo "  Listener binary: native/listener/build/pi-listener"
echo "  Piper binary:    $PIPER_BIN"
echo "Next: cp .env.example .env, set PI_LISTENER_ACTIVATION_NAME, then run 'pi' and /listen"
