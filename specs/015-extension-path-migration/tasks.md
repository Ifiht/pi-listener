# Tasks: Extension Path Migration

**Input**: Design documents from `/specs/015-extension-path-migration/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shared test fixtures for the new extension-root layout.

- [x] T001 [P] Update `tests/unit/tools-test-utils.ts` to generate fixtures rooted at `/.pi/agent/extensions/talk-pi` for shared path tests
- [x] T002 [P] Update `tests/integration/voice-settings-test-utils.ts` to use the same new extension-root fixture conventions

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the core path-resolution behavior that all user stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Add failing regression coverage in `tests/unit/tools-root-preference.test.ts` for preferring `/.pi/agent/extensions/talk-pi` when a user-scoped `.pi` folder exists
- [x] T004 [P] Add failing regression coverage in `tests/unit/tools-root-creation.test.ts` for creating the new extension root when no user-scoped path exists
- [x] T005 [P] Add failing regression coverage in `tests/unit/piper-config.test.ts` and `tests/unit/talk-pi-config.test.ts` for default binary and model paths under the new extension root
- [x] T006 Refactor `src/tools.ts` to resolve `/.pi/agent/extensions/talk-pi` as the user-scoped root and keep the local `./tools` fallback for fresh local installs

**Checkpoint**: The extension-root path is resolved through one shared code path and the test suite describes the new behavior.

---

## Phase 3: User Story 1 - Use the new extension path (Priority: P1) 🎯 MVP

**Goal**: Make all runtime consumers load extension assets from `/.pi/agent/extensions/talk-pi`.

**Independent Test**: Open the extension with a user-scoped `.pi` folder and verify Piper, Whisper, and config paths resolve from `/.pi/agent/extensions/talk-pi`.

### Implementation for User Story 1

- [x] T007 [P] [US1] Update `src/tools-bootstrap.ts` to bootstrap Piper and Whisper assets from the new extension root
- [x] T008 [P] [US1] Update `src/config.ts` to resolve default binary, model, and Whisper paths through the new root helper
- [x] T009 [P] [US1] Update `src/tts/piper-preferences.ts` to discover Piper models from the new extension root

**Checkpoint**: The extension uses the new root consistently during startup and preference resolution.

---

## Phase 4: User Story 2 - Preserve existing upgrades (Priority: P2)

**Goal**: Keep migrated installs usable even when `/.pi/tools` is missing.

**Independent Test**: Start from a migrated environment with no `/.pi/tools` folder and confirm the extension still opens and menus load normally.

### Tests and Implementation for User Story 2

- [x] T010 [P] [US2] Add regression coverage in `tests/unit/tools-root-errors.test.ts` for missing `/.pi/tools` not blocking startup when the new root is available
- [x] T011 [P] [US2] Add integration coverage in `tests/integration/unified-talk-menu-open.test.ts` for opening the menu successfully after migration
- [x] T012 [US2] Adjust startup error messaging in `src/tools-bootstrap.ts` so fallback guidance matches the new extension-root layout

**Checkpoint**: Existing installs remain usable after the path migration.

---

## Phase 5: User Story 3 - Keep project references consistent (Priority: P3)

**Goal**: Align documentation, fixtures, and remaining references with the new extension path.

**Independent Test**: Search the repository for `/.pi/tools` and confirm only intentional legacy discussion remains.

### Implementation for User Story 3

- [x] T013 [P] [US3] Update `README.md` to document `/.pi/agent/extensions/talk-pi` instead of `/.pi/tools`
- [x] T014 [P] [US3] Update `specs/015-extension-path-migration/quickstart.md` to match the new path and verification steps
- [x] T015 [P] [US3] Replace remaining `/.pi/tools` references in `src/voice/offline-whisper.ts`, `tests/unit/piper-preferences.test.ts`, `tests/unit/talk-pi-config.test.ts`, and `tests/integration/voice-settings-test-utils.ts` with the new extension-root wording or helper usage

**Checkpoint**: Active references and supporting documentation are aligned with the new extension path.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify the migration is complete and no stale references remain.

- [x] T016 [P] Run a repository-wide search for `/.pi/tools` in `README.md`, `src/`, `tests/`, and `specs/015-extension-path-migration/` and record any intentional leftovers in `specs/015-extension-path-migration/quickstart.md`
- [x] T017 [P] Run the targeted unit and integration suites for path resolution and startup, then note any follow-up fixes in `specs/015-extension-path-migration/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Final Phase)**: Depends on the user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) and validates migration compatibility
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) and finalizes reference cleanup

### Within Each User Story

- Tests are written first and fail before implementation
- Shared helpers before runtime call-site updates
- Runtime path resolution before docs/reference cleanup
- Story complete before moving to the next priority

## Parallel Opportunities

- T001 and T002 can run in parallel because they touch different test helper files
- T003, T004, and T005 can run in parallel because they target different test files
- T007, T008, and T009 can run in parallel because they touch different runtime consumers
- T010 and T011 can run in parallel because they cover different validation paths
- T013, T014, and T015 can run in parallel because they touch different documentation/reference files

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational phases
2. Complete User Story 1
3. Stop and validate that the new extension path resolves correctly

### Incremental Delivery

1. Deliver the core path migration in User Story 1
2. Validate compatibility behavior in User Story 2
3. Clean up documentation and remaining references in User Story 3
4. Finish with repository-wide verification in the Polish phase

## Task Count Summary

- Total tasks: 17
- User Story 1: 3 tasks
- User Story 2: 3 tasks
- User Story 3: 3 tasks
- Setup/Foundation/Polish: 8 tasks

## Format Validation

All tasks follow the required checklist format: checkbox, task ID, optional parallel marker, optional story label, and an exact file path in the description.
