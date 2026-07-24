# Implementation Plan: Spoken Reply Playback

**Branch**: `003-spoken-reply-playback` | **Date**: 2026-05-24 | **Spec**: `specs/003-piper-tts-playback/spec.md`

**Input**: Feature specification from `specs/003-piper-tts-playback/spec.md`

## Summary

Turn completed LLM replies into local Piper speech, queue playback inside
terminal session, and pause speech while mic recording is active so audio does
not feed back into transcription.

## Technical Context

**Language/Version**: TypeScript / Node.js 24

**Primary Dependencies**: Pi coding-agent extension API, Pi TUI input/status APIs,
local Piper CLI or binary, local WAV playback helper, existing recording flow

**Storage**: Temp WAV files for synthesized speech; cached Piper voice model and
binary under user home or configured path; no transcript persistence required

**Testing**: Unit tests for speech job creation, playback queue, and mute-while-
recording behavior; integration tests for reply → synthesize → play flow

**Target Platform**: Desktop TUI on Windows, macOS, Linux

**Project Type**: Pi Coding Agent extension / single-project desktop TUI

**Performance Goals**: Spoken reply should begin within a few seconds for short
responses and queue cleanly for consecutive replies without overlap

**Constraints**: Free/local only; no cloud TTS; text reply must stay visible;
recording must silence or defer playback; playback failures must not block text
flow

**Scale/Scope**: Single-user local session; one active recording state and one
playback queue per session

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
specs/003-piper-tts-playback/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

### Source Code (repository root)

```text
talk-pi.ts
src/
├── input/
├── recording/
├── tts/
├── voice/
└── ui/

tests/
├── unit/
├── integration/
└── contract/
```

**Structure Decision**: Keep same single-project TypeScript layout. Add local TTS
and playback modules beside existing voice/recording code so synthesis, queueing,
and UI feedback remain independently testable.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
