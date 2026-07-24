#!/usr/bin/env bash
# Build pi-listener. Requires cmake and SDL2 (brew install cmake sdl2).
set -euo pipefail
cd "$(dirname "$0")"

cmake -B build
cmake --build build -j

MODEL=../../whisper.cpp/models/ggml-base.en.bin
if [ ! -f "$MODEL" ]; then
    ../../whisper.cpp/models/download-ggml-model.sh base.en
fi

echo
echo "Build complete. Run with:"
echo "  ./build/pi-listener -m $MODEL --wake <word>"
