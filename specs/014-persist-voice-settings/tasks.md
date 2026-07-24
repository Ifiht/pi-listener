---

description: "Task list for Persist Voice Settings"
---

# Tasks: Persist Voice Settings

**Input**: Design documents from `/specs/014-persist-voice-settings/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Required for this behavior change; write tests first for each story.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare isolated persistence test fixtures and shared helpers

- [X] T001 [P] Create a temporary voice preference file helper for isolated tests in `tests/unit/voice-settings-test-utils.ts`
- [X] T002 [P] Create an integration test helper for isolated persisted-settings startup state in `tests/integration/voice-settings-test-utils.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core persistence plumbing that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 [P] Extend persisted voice preference loading and saving in `src/tts/piper-preferences.ts` to include muted state, safe defaults, and backward-compatible parsing
- [X] T004 [P] Add startup hydration for Voice Language and muted state in `talk-pi.ts` before the `/talk-pi` menu opens
- [X] T005 [P] Add a shared way to apply and persist mute changes from the menu in `talk-pi.ts` and `src/ui/mute-state.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Restore Saved Voice Settings (Priority: P1) 🎯 MVP

**Goal**: Reopen `/talk-pi` with the last saved Voice Language and muted state already applied.

**Independent Test**: Change Voice Language and muted state, reopen the extension, and confirm both values are restored automatically.

### Tests for User Story 1 (REQUIRED) ⚠️

- [X] T006 [P] [US1] Add unit coverage for loading and saving a complete persisted voice settings record in `tests/unit/voice-settings-persistence.test.ts`
- [X] T007 [P] [US1] Add integration coverage for restarting `/talk-pi` and restoring both persisted settings in `tests/integration/voice-settings-restore.test.ts`

### Implementation for User Story 1

- [X] T008 [US1] Load persisted Voice Language and muted state before building the menu in `talk-pi.ts`
- [X] T009 [US1] Persist the selected Voice Language immediately after menu changes in `talk-pi.ts` and `src/tts/piper-preferences.ts`
- [X] T010 [US1] Persist mute and unmute changes immediately after menu actions in `talk-pi.ts` and `src/ui/mute-state.ts`

**Checkpoint**: User Story 1 should now be fully functional and independently testable

---

## Phase 4: User Story 2 - Start With Safe Defaults (Priority: P2)

**Goal**: Open successfully with default voice values when no saved settings exist or only part of the record is present.

**Independent Test**: Remove the saved preference file, open `/talk-pi`, and confirm the extension uses default Voice Language and unmuted state.

### Tests for User Story 2 (REQUIRED) ⚠️

- [X] T011 [P] [US2] Add unit coverage for missing preference files and partial records in `tests/unit/voice-settings-defaults.test.ts`
- [X] T012 [P] [US2] Add integration coverage for first-run startup with no saved settings in `tests/integration/voice-settings-defaults.test.ts`

### Implementation for User Story 2

- [X] T013 [US2] Apply default Voice Language and unmuted state when the persisted record is missing in `src/tts/piper-preferences.ts`
- [X] T014 [US2] Ensure partial preference records fill missing values with defaults before the menu opens in `talk-pi.ts`

**Checkpoint**: User Story 1 and User Story 2 should both work independently

---

## Phase 5: User Story 3 - Recover From Invalid Saved Settings (Priority: P3)

**Goal**: Keep the extension usable when the saved settings file is unreadable, corrupted, or contains unsupported values.

**Independent Test**: Provide a corrupted or incomplete saved settings file, open `/talk-pi`, and confirm the extension opens with safe fallback values.

### Tests for User Story 3 (REQUIRED) ⚠️

- [X] T015 [P] [US3] Add unit coverage for unreadable and corrupted preference records in `tests/unit/voice-settings-recovery.test.ts`
- [X] T016 [P] [US3] Add integration coverage for opening `/talk-pi` with invalid saved settings in `tests/integration/voice-settings-recovery.test.ts`

### Implementation for User Story 3

- [X] T017 [US3] Harden persisted settings parsing to ignore invalid values and fall back safely in `src/tts/piper-preferences.ts`
- [X] T018 [US3] Keep the menu usable by falling back to a supported Voice Language when the saved choice is unavailable in `talk-pi.ts`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation updates

- [X] T019 [P] Validate the final startup and recovery flow in `specs/014-persist-voice-settings/quickstart.md`
- [X] T020 [P] Update user-facing notes in `README.md` if the persisted voice settings behavior needs to be documented

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on the same persisted settings loader, but remains independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Builds on the same loader, but remains independently testable

### Within Each User Story

- Tests MUST be written and fail before implementation
- Shared persistence helpers before menu wiring
- Startup hydration before restore verification
- Story complete before moving to the next priority

### Parallel Opportunities

- Setup helpers T001 and T002 can run in parallel
- Foundational tasks T003, T004, and T005 can run in parallel after the helper setup is ready
- User Story test tasks in each phase can run in parallel
- User Story implementation tasks can often run in parallel when they touch different files

---

## Parallel Example: User Story 1

```bash
Task: "Add unit coverage for loading and saving a complete persisted voice settings record in tests/unit/voice-settings-persistence.test.ts"
Task: "Add integration coverage for restarting /talk-pi and restoring both persisted settings in tests/integration/voice-settings-restore.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate the restore flow independently

### Incremental Delivery

1. Complete Setup + Foundational
2. Add User Story 1 and verify restore behavior
3. Add User Story 2 and verify first-run defaults
4. Add User Story 3 and verify recovery from invalid saved settings
5. Finish with polish and documentation updates

### Parallel Team Strategy

With multiple developers:

1. One developer completes setup helpers
2. One developer implements persistence plumbing
3. Once foundational work is done, separate developers can tackle US1, US2, and US3 in parallel

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing each story
- Avoid vague tasks and cross-story dependencies that break independence
