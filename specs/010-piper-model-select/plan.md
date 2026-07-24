# Implementation Plan: Piper Model Selection

**Branch**: `master` | **Date**: 2026-05-25 | **Spec**: `specs/010-piper-model-select/spec.md`

**Input**: Feature specification from `specs/010-piper-model-select/spec.md`

## Summary

Add `/talk-pi` menu options so users can choose Piper voice models and switch to English output without editing config manually.

## Technical Context

**Language/Version**: TypeScript / Node.js 24

**Primary Dependencies**: Existing Piper client, unified talk menu, config loading, playback queue, local file system utilities

**Storage**: Local config/files only; no remote storage

**Testing**: Existing unit and integration test stack for menu + TTS flow

**Target Platform**: Desktop terminal app on Windows, macOS, Linux

**Project Type**: Desktop app / single-project TypeScript

**Performance Goals**: Menu selection should apply on next assistant reply without noticeable delay

**Constraints**: Must remain offline-friendly, must keep `/talk-pi` as single menu entry point, must preserve current voice flow, must handle missing English model gracefully

**Scale/Scope**: Single-user local session with a small set of available Piper voice models

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
specs/010-piper-model-select/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/           # not required for this feature
```

### Source Code (repository root)

```text
src/
├── ui/
│   ├── unified-talk-menu.ts
│   └── menu-actions.ts
├── tts/
│   ├── piper-client.ts
│   └── playback-queue.ts
├── config.ts
└── voice/
    └── voice-capture.ts

talk-pi.ts

tests/
├── unit/
└── integration/
```

**Structure Decision**: Keep the single-project TypeScript layout and extend existing menu + TTS path with selectable voice-model state.

## Complexity Tracking

No constitution exceptions required.
