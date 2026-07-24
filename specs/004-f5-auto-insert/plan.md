# Implementation Plan: F5 Auto Insert

**Branch**: `004-f5-auto-insert` | **Date**: 2026-05-24 | **Spec**: `specs/004-f5-auto-insert/spec.md`

**Input**: Feature specification from `specs/004-f5-auto-insert/spec.md`

## Summary

Add an alternate F5 double-press shortcut that triggers the same voice-to-text
flow as F10, but automatically inserts the transcript into the active terminal
input buffer so the user can review it before sending.

## Technical Context

**Language/Version**: TypeScript / Node.js 24

**Primary Dependencies**: Pi coding-agent extension API, Pi TUI input handling,
existing voice capture/transcription flow, existing input insertion helper

**Storage**: No new persistence; existing voice recording/temp WAV flow remains
unchanged

**Testing**: Unit tests for shortcut handling and transcript insertion; integration
tests for F5 double-press flow and non-auto-send behavior

**Target Platform**: Desktop TUI on Windows, macOS, Linux

**Project Type**: Pi Coding Agent extension / single-project desktop TUI

**Performance Goals**: F5-triggered transcript insertion should feel immediate
and behave identically to the existing F10 flow, aside from the new shortcut

**Constraints**: Must not break F10 workflow; transcript must stay editable; must
not auto-send; must ignore empty/no-speech results

**Scale/Scope**: Single-user local session; one active terminal input buffer;
one voice capture flow at a time

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
specs/004-f5-auto-insert/
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
├── tts/
├── ui/
└── voice/

tests/
├── unit/
├── integration/
└── contract/
```

**Structure Decision**: Keep the current single-project TypeScript layout.
Add the new shortcut logic alongside the existing voice and input flow so both
F5 and F10 can share transcript insertion behavior.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
