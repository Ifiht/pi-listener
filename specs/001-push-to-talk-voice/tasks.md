# Tasks: Push-to-Talk Voice Recording

**Input**: Design documents from `specs/001-push-to-talk-voice/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Required. Write tests first for every user-story behavior.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create source folders for input, recording, state, and ui in `src/`
- [x] T002 Create test folders for unit, integration, and acceptance coverage in `tests/`
- [x] T003 Create feature documentation folders in `specs/001-push-to-talk-voice/contracts/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Define `RecordingSession` and `RecordingState` domain types in `src/recording/recording_session.py` and `src/state/recording_state.py`
- [x] T005 Define keyboard press/release input boundary in `src/input/keyboard_listener.py`
- [x] T006 Define microphone capture boundary in `src/recording/microphone_capture.py`
- [x] T007 Define recording state transition controller in `src/recording/recording_controller.py`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Push to Talk (Priority: P1) 🎯 MVP

**Goal**: Start recording on left control press and stop on left control release.

**Independent Test**: Hold left control, speak, release it, and verify captured audio exists only during press window.

### Tests for User Story 1 (REQUIRED for story behavior) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T008 [P] [US1] Add unit test for left control press starting recording in `tests/unit/test_recording_controller.py`
- [x] T009 [P] [US1] Add unit test for left control release stopping recording in `tests/unit/test_recording_controller.py`
- [x] T010 [P] [US1] Add integration test for press-and-hold capture window in `tests/integration/test_push_to_talk_flow.py`

### Implementation for User Story 1

- [x] T011 [P] [US1] Implement recording start/stop behavior in `src/recording/recording_controller.py`
- [x] T012 [P] [US1] Implement audio buffer lifecycle in `src/recording/microphone_capture.py`
- [x] T013 [US1] Wire keyboard press/release events into recording controller in `src/input/keyboard_listener.py`
- [x] T014 [US1] Ensure only in-press audio is retained in `src/recording/recording_session.py`

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Clear Recording Feedback (Priority: P2)

**Goal**: Show clear recording and failure state while voice capture is active.

**Independent Test**: Start and stop a recording and verify the app visibly shows active and ended states.

### Tests for User Story 2 (REQUIRED for story behavior) ⚠️

- [x] T015 [P] [US2] Add unit test for active recording indicator in `tests/unit/test_recording_state.py`
- [x] T016 [P] [US2] Add unit test for failure state on microphone error in `tests/unit/test_recording_state.py`
- [x] T017 [P] [US2] Add integration test for visible recording feedback in `tests/integration/test_recording_feedback.py`

### Implementation for User Story 2

- [x] T018 [P] [US2] Implement recording state projection in `src/state/recording_state.py`
- [x] T019 [US2] Implement visible active/ended/failure feedback in `src/ui/recording_status.py`
- [x] T020 [US2] Connect microphone failure handling to UI state in `src/recording/recording_controller.py`

**Checkpoint**: User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T021 [P] Add interruption handling coverage in `tests/integration/test_recording_interruptions.py`
- [x] T022 Refactor domain objects for clean boundaries in `src/recording/` and `src/state/`
- [x] T023 Update quickstart validation in `specs/001-push-to-talk-voice/quickstart.md`
- [x] T024 Review contract consistency in `specs/001-push-to-talk-voice/contracts/voice-recording-contract.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models/domain types before services
- Services before UI wiring
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, both user stories can start in parallel
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Add unit test for left control press starting recording in tests/unit/test_recording_controller.py"
Task: "Add unit test for left control release stopping recording in tests/unit/test_recording_controller.py"
Task: "Add integration test for press-and-hold capture window in tests/integration/test_push_to_talk_flow.py"

# Launch all foundational domain tasks together:
Task: "Define RecordingSession and RecordingState domain types in src/recording/recording_session.py and src/state/recording_state.py"
Task: "Define keyboard press/release input boundary in src/input/keyboard_listener.py"
Task: "Define microphone capture boundary in src/recording/microphone_capture.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
