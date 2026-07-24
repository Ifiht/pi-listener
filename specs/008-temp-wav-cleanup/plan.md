# Implementation Plan: Temporary WAV Cleanup

**Branch**: `008-temp-wav-cleanup` | **Date**: 2026-05-24 | **Spec**: `specs/008-temp-wav-cleanup/spec.md`

**Input**: Feature specification from `specs/008-temp-wav-cleanup/spec.md`

## Summary

Make WAV files used for speech generation and playback temporary only, and ensure they are removed after use so no leftover tmp audio files remain on user disk.

## Technical Context

**Language/Version**: TypeScript / Node.js 24

**Primary Dependencies**: Existing Piper TTS client, WAV playback helper, Node file system utilities, current spoken reply queue

**Storage**: Temporary WAV files only; no persistent audio storage

**Testing**: Unit tests for cleanup lifecycle helpers and queue behavior; integration tests for success, failure, and interrupted playback cleanup

**Target Platform**: Desktop TUI on Windows, macOS, Linux

**Project Type**: Desktop terminal app / single-project TypeScript

**Performance Goals**: Temporary files should be created and removed without noticeable delay to the user

**Constraints**: Must not leave orphaned WAV files, must clean up on success/failure/interrupt, must keep playback flow working during cleanup

**Scale/Scope**: Single-user local session with one speech queue and one temporary audio file lifecycle per job

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
specs/008-temp-wav-cleanup/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── tts/
│   ├── piper-client.ts
│   ├── playback-queue.ts
│   └── wav-player.ts
└── ui/
    └── spoken-reply-status.ts

tests/
├── unit/
└── integration/
```

**Structure Decision**: Keep the single-project TypeScript layout and implement temporary file lifecycle handling inside the existing TTS pipeline.

## Complexity Tracking

No constitution exceptions required.
