# Implementation Plan: Emoji Footer Status

**Branch**: `master` | **Date**: 2026-05-25 | **Spec**: `specs/009-emoji-footer-status/spec.md`

**Input**: Feature specification from `specs/009-emoji-footer-status/spec.md`

## Summary

Refresh the footer so Talk-Pi always presents a friendly leading phrase, a status label, and an emoji that clearly communicates whether the app is Ready, Listen, Thinking, Talking, Muted, Error, or No speech detected.

## Technical Context

**Language/Version**: TypeScript / Node.js 24

**Primary Dependencies**: Existing TUI rendering, voice capture state, transcription status formatting, spoken reply status formatting, mute state, playback queue

**Storage**: N/A

**Testing**: Existing unit and integration test stack for the TUI/voice flow

**Target Platform**: Desktop terminal app on Windows, macOS, Linux

**Project Type**: Desktop app / single-project TypeScript

**Performance Goals**: Status updates should appear immediately when app mode changes

**Constraints**: Must stay readable in narrow terminals, must preserve existing voice workflows, must use consistent user-facing wording, must reflect additional states like Muted, Error, and No speech detected

**Scale/Scope**: Single-user local TUI session with one visible footer status area

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
specs/009-emoji-footer-status/
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
│   ├── spoken-reply-status.ts
│   ├── transcription-status.ts
│   ├── recording_status.ts
│   └── footer-status.ts
├── voice/
│   └── voice-capture.ts
└── tts/
    └── playback-queue.ts

talk-pi.ts

tests/
├── unit/
└── integration/
```

**Structure Decision**: Keep the single-project TypeScript layout and add a shared footer-status formatter used by the TUI and related status renderers.

## Complexity Tracking

No constitution exceptions required.
