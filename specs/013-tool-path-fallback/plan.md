# Implementation Plan: Tool Path Fallback

**Branch**: `015-tool-path-fallback` | **Date**: 2026-05-31 | **Spec**: `specs/013-tool-path-fallback/spec.md`

**Input**: Feature specification from `/specs/013-tool-path-fallback/spec.md`

## Summary

Update the tool-loading flow so current runs prefer `~/.pi/tools` when `~/.pi` exists, and create/use `./tools` in the local install folder when `~/.pi` is absent.

## Technical Context

**Language/Version**: Markdown documentation in a Node.js 24 repository

**Primary Dependencies**: Existing Spec Kit docs, repository metadata, Git-based feature workflow

**Storage**: Repository files only; no runtime data store

**Testing**: Manual documentation review against the spec and checklist

**Target Platform**: Repository documentation for Windows, macOS, and Linux users

**Project Type**: npm package / documentation-driven project

**Performance Goals**: Readers can understand the tool-path rule and locate setup guidance in under 60 seconds

**Constraints**: Preserve current product behavior outside the documented tool-location rule; keep wording clear and scannable

**Scale/Scope**: Single README/workflow documentation update plus supporting spec artifacts

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
specs/013-tool-path-fallback/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

### Source Code (repository root)

```text
README.md
.specify/
specs/
```

**Structure Decision**: Documentation-only change; update README and related Spec Kit planning artifacts without touching runtime source code.

## Complexity Tracking

None. No constitution exceptions required.
