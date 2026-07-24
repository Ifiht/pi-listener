# Implementation Plan: Whisper Text Input

**Branch**: `002-whisper-input` | **Date**: 2026-05-24 | **Spec**: `specs/002-whisper-input/spec.md`

**Input**: Feature specification from `specs/002-whisper-input/spec.md`

## Summary

Recognize finished `.wav` audio with free local Whisper, then paste transcript
into active TUI input so user can review before send.

## Technical Context

**Language/Version**: TypeScript / Node.js 24

**Primary Dependencies**: Pi coding-agent extension API, Pi TUI key/input APIs,
local microphone recorder, local Whisper runtime/model loader

**Storage**: Temp WAV file for each recording; cached Whisper model under user
home directory; no transcript persistence required

**Testing**: Unit tests for transcription, insertion, and feedback; integration
tests for record → recognize → paste flow

**Target Platform**: Desktop TUI on Windows, macOS, Linux

**Project Type**: Pi Coding Agent extension / single-project desktop TUI

**Performance Goals**: Short recordings should transcribe and appear in input in
under 10 seconds for most runs

**Constraints**: No paid API required; recognized text MUST not auto-send; existing
TUI input MUST remain intact on insert or failure

**Scale/Scope**: Single-user local session; one active recording/transcription
flow at a time

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
specs/002-whisper-input/
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
├── input/
├── transcription/
├── voice/
└── ui/

tests/
├── unit/
├── integration/
└── contract/
```

**Structure Decision**: Keep single-project TypeScript layout. Put recording,
transcription, editor insertion, and UI feedback in separate modules so each can
be tested independently.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
