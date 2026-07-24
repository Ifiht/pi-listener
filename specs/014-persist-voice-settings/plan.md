# Implementation Plan: Persist Voice Settings

**Branch**: `master` | **Date**: 2026-06-02 | **Spec**: `specs/014-persist-voice-settings/spec.md`

**Input**: Feature specification from `specs/014-persist-voice-settings/spec.md`

## Summary

Persist the user-selected Voice Language and Muted/Unmuted state in the existing voice preference configuration so `/talk-pi` restores both settings automatically whenever the extension opens.

## Technical Context

**Language/Version**: TypeScript / Node.js 24

**Primary Dependencies**: Existing Pi extension runtime, unified talk menu, Piper preference helpers, mute/playback state, filesystem persistence helpers

**Storage**: Local preference file under the user-scoped Pi configuration path, with existing environment overrides preserved; no remote storage

**Testing**: Existing unit and integration test stack for menu behavior, preference loading/saving, and startup restoration

**Target Platform**: Desktop terminal app on Windows, macOS, and Linux

**Project Type**: Single-project TypeScript desktop extension

**Performance Goals**: Voice settings should load before the menu is shown and update immediately after a user changes either setting

**Constraints**: Must remain offline-friendly, preserve current menu flow, tolerate missing or corrupt preference data, and stay backward-compatible with existing voice preference fields

**Scale/Scope**: Single-user local session with one active Voice Language selection and one mute state per installation

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
specs/014-persist-voice-settings/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md            # generated later by /speckit.tasks
```

### Source Code (repository root)

```text
src/
├── config.ts
├── tts/
│   └── piper-preferences.ts
└── ui/
    ├── mute-state.ts
    └── unified-talk-menu.ts

talk-pi.ts

tests/
├── unit/
└── integration/
```

**Structure Decision**: Keep the existing single-project TypeScript layout and extend the current voice-preference flow so the same persisted settings file stores both Voice Language and mute state.

## Complexity Tracking

No constitution exceptions required.
