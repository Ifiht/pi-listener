# Implementation Plan: Unified Talk Menu

**Branch**: `007-unified-talk-menu` | **Date**: 2026-05-24 | **Spec**: `specs/007-unified-talk-menu/spec.md`

**Input**: Feature specification from `specs/007-unified-talk-menu/spec.md`

## Summary

Unify the extension entry point so `/talk-pi` opens one menu containing both status and mute controls, and retire `/talk-pi-menu` from the user-facing flow.

## Technical Context

**Language/Version**: TypeScript / Node.js 24

**Primary Dependencies**: Pi coding-agent extension API, Pi TUI menu/status UI, existing mute state, spoken playback queue, voice capture flow

**Storage**: No new persistence; menu choice and mute state remain session-scoped

**Testing**: Unit tests for menu state, status selection, and mute routing; integration tests for `/talk-pi` menu flow and `/talk-pi-menu` removal from the primary flow

**Target Platform**: Desktop TUI on Windows, macOS, Linux

**Project Type**: Desktop terminal app / single-project TypeScript

**Performance Goals**: Open the menu immediately from `/talk-pi` and keep status/mute actions responsive in the same session

**Constraints**: Must preserve existing text/chat behavior, keep mute behavior intact, keep status visible, and remove dependence on a second menu command

**Scale/Scope**: Single-user local session with one primary menu entry point and one active mute state

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
specs/007-unified-talk-menu/
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
├── ui/
│   ├── menu-actions.ts
│   ├── mute-state.ts
│   ├── spoken-reply-status.ts
│   └── unified-talk-menu.ts
├── tts/
│   └── playback-queue.ts
└── input/
    └── shortcut-config.ts

tests/
├── unit/
└── integration/
```

**Structure Decision**: Keep the current single-project TypeScript desktop TUI layout and consolidate menu behavior in `talk-pi.ts` plus the shared UI helpers already used for mute and status.

## Complexity Tracking

No constitution exceptions required.
