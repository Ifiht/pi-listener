# Implementation Plan: Mute Extension Menu

**Branch**: `006-mute-extension` | **Date**: 2026-05-24 | **Spec**: `specs/006-mute-extension/spec.md`

**Input**: Feature specification from `specs/006-mute-extension/spec.md`

## Summary

Add a visible menu control to mute and unmute the extension. Muting stops any current spoken playback, suppresses future spoken replies until unmuted, and leaves text-based chat behavior unchanged.

## Technical Context

**Language/Version**: TypeScript / Node.js 24

**Primary Dependencies**: Pi coding-agent extension API, Pi TUI UI/status surface, existing spoken playback queue, local WAV playback helper

**Storage**: No new persistence; mute state is session-scoped

**Testing**: Unit tests for mute state transitions and queue gating; integration tests for mute/unmute behavior during spoken playback

**Target Platform**: Desktop TUI on Windows, macOS, Linux

**Project Type**: Desktop terminal app / single-project TypeScript

**Performance Goals**: Mute should take effect immediately for the current session; active playback should stop within about 1 second

**Constraints**: Must not remove visible assistant text, must not break typing or transcript insertion, must suppress spoken output while muted, must preserve normal behavior after unmuting

**Scale/Scope**: Single-user local session with one active mute state and one spoken playback queue

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
specs/006-mute-extension/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
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

**Structure Decision**: Keep the existing single-project TypeScript desktop TUI layout and add mute state handling beside the current spoken playback and status wiring.

## Complexity Tracking

No constitution exceptions required.
