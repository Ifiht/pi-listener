# Implementation Plan: Esc Stop Playback

**Branch**: `005-esc-stop-playback` | **Date**: 2026-05-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-esc-stop-playback/spec.md`

## Summary

Add Esc as an interrupt for spoken assistant playback so the current audio stops immediately, queued spoken replies do not continue, and the visible assistant text remains in place.

## Technical Context

**Language/Version**: TypeScript / Node.js 24

**Primary Dependencies**: Pi coding-agent extension API, Pi TUI input handling, existing spoken-reply playback queue, local WAV playback helper

**Storage**: No new persistence; spoken audio still uses temporary WAV files

**Testing**: Direct TypeScript test files executed with `tsx` and Node.js assertions (`node:test`-style unit/integration coverage)

**Target Platform**: Desktop TUI on Windows, macOS, Linux

**Project Type**: Desktop terminal app / single-project TypeScript

**Performance Goals**: Playback should stop within about 1 second of Esc in normal use

**Constraints**: Must not delete visible assistant text, must not break idle terminal input, must stop current playback and prevent queued speech from continuing automatically

**Scale/Scope**: Single-user local session with one active playback queue and one terminal input buffer

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
specs/005-esc-stop-playback/
├── plan.md
├── research.md
├── data-model.md
└── quickstart.md
```

### Source Code (repository root)

```text
talk-pi.ts
src/
├── tts/
│   ├── playback-queue.ts
│   ├── wav-player.ts
│   └── spoken-text.ts
├── ui/
│   └── spoken-reply-status.ts
└── voice/
    └── voice-capture.ts

tests/
├── unit/
└── integration/
```

**Structure Decision**: Keep the current single-project TypeScript layout and implement Esc stop behavior in the spoken playback queue and editor/input flow, reusing the existing UI and TTS modules.

## Complexity Tracking

No constitution exceptions required.
