# Implementation Plan: Recorder-Free Voice Capture

**Branch**: `011-sox-to-decibri` | **Date**: 2026-05-26 | **Spec**: `specs/011-sox-to-decibri/spec.md`

**Input**: Feature specification from `/specs/011-sox-to-decibri/spec.md`

## Summary

Replace SoX-based microphone capture with decibri-backed capture so Talk-Pi can record voice input without separate recorder software while preserving the existing voice-to-transcription flow.

## Technical Context

**Language/Version**: TypeScript / Node.js 24

**Primary Dependencies**: Existing voice input flow, Whisper transcription pipeline, temp WAV helpers, decibri microphone capture

**Storage**: Local temporary WAV files and existing local voice-recording paths

**Testing**: Existing unit and integration test stack for recording, transcription, and playback flows

**Target Platform**: Desktop terminal app on Windows, macOS, Linux

**Project Type**: Desktop-app extension / single-project TypeScript

**Performance Goals**: Recording should start and stop immediately for normal user interaction; capture should stay stable across repeated sessions

**Constraints**: Must stay offline-friendly, cross-platform, and compatible with the existing Whisper handoff; must not require SoX, rec, or arecord

**Scale/Scope**: Single-user local session with one active recording stream at a time

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Every behavior change has failing tests defined before implementation
- [x] Design stays simple; no speculative abstractions or hidden coupling
- [x] Domain logic uses small, testable objects with clear responsibilities
- [x] Breaking changes include versioning, migration, or rollback notes
- [x] Docs, specs, and templates are updated when workflow or behavior changes

## Project Structure

### Documentation (this feature)

```text
specs/011-sox-to-decibri/
├── plan.md
├── research.md
├── data-model.md
└── quickstart.md
```

### Source Code (repository root)

```text
src/
├── voice/
├── recording/
├── state/
├── tts/
├── input/
└── ui/

tests/
├── unit/
└── integration/
```

**Structure Decision**: Keep current single-project TypeScript layout. Replace recorder-specific capture logic under `src/voice/` while leaving transcription, playback, and UI flow in place.

## Complexity Tracking

None. No constitution exceptions required.
