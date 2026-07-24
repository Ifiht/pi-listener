# Implementation Plan: Extension Path Migration

**Branch**: `master` | **Date**: 2026-06-02 | **Spec**: `specs/015-extension-path-migration/spec.md`

**Input**: Feature specification from `specs/015-extension-path-migration/spec.md`

## Summary

Update the extension's file-path references so active code, examples, tests, and documentation use `/.pi/agent/extensions/talk-pi` instead of `/.pi/tools`, while keeping behavior consistent for existing users during the transition.

## Technical Context

**Language/Version**: TypeScript / Node.js 24

**Primary Dependencies**: Existing Pi extension runtime, filesystem path helpers, menu and settings flow, unit/integration test stack

**Storage**: Local user-scoped Pi configuration and extension files on disk; no remote storage

**Testing**: Existing unit and integration tests for path resolution, startup loading, and docs/reference consistency

**Target Platform**: Desktop terminal app on Windows, macOS, and Linux

**Project Type**: Single-project TypeScript desktop extension

**Performance Goals**: Path resolution should complete before the extension UI is shown and remain invisible to the user

**Constraints**: Must remain offline-friendly, preserve current user-facing behavior, tolerate missing legacy paths, and keep the extension usable when the new directory is the only available location

**Scale/Scope**: Single-user local extension installation with one active extension root per installation

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
specs/015-extension-path-migration/
├── plan.md
├── research.md
├── data-model.md
└── quickstart.md
```

### Source Code (repository root)

```text
README.md
src/
└── ... existing extension source files ...
tests/
└── ... existing unit and integration tests ...
```

**Structure Decision**: Keep the current single-project TypeScript layout and update the path-resolution points, tests, and documentation that still reference `/.pi/tools`.

## Complexity Tracking

No constitution exceptions required.
