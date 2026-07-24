# Tasks: Esc Stop Playback

**Input**: Design documents from `/specs/005-esc-stop-playback/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Required for this behavior change. Write failing tests first for each user story.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Shared test scaffolding for playback-stop behavior

- [X] T001 [P] Create shared playback-stop test fixtures and mocks in `tests/helpers/playback-stop-fixtures.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core playback interruption capability required before any user story work can land

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Add interruptible playback support to `src/tts/wav-player.ts` and `src/tts/playback-queue.ts` so a current spoken reply can be stopped safely and idle stop requests return cleanly

**Checkpoint**: Playback interruption is available and user stories can now be implemented independently

---

## Phase 3: User Story 1 - Stop Spoken Reply Playback (Priority: P1) 🎯 MVP

**Goal**: Pressing Esc while a spoken reply is playing stops the current audio immediately, prevents queued spoken replies from continuing, and leaves the assistant text visible.

**Independent Test**: Start spoken reply playback, press Esc, and confirm audio stops while the visible assistant message remains on screen.

### Tests for User Story 1 (REQUIRED for story behavior) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T003 [P] [US1] Add unit test for stopping active spoken playback and clearing queued speech in `tests/unit/playback-queue-stop.test.ts`
- [X] T004 [P] [US1] Add integration test for pressing Esc during spoken reply playback in `tests/integration/esc-stop-playback.test.ts`

### Implementation for User Story 1

- [X] T005 [US1] Wire Esc handling in `talk-pi.ts` so the editor stops spoken playback only when a spoken reply is active
- [X] T006 [US1] Update `src/tts/playback-queue.ts` so the current spoken reply is interrupted, queued replies do not continue automatically, and visible assistant text is left untouched
- [X] T007 [US1] Update `src/ui/spoken-reply-status.ts` and `talk-pi.ts` to show a stopped/idle playback state after Esc without altering the conversation history

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Ignore Esc When Nothing Is Playing (Priority: P2)

**Goal**: Pressing Esc when no spoken reply is active does not cause errors, text loss, or unintended message sending.

**Independent Test**: Press Esc while no assistant audio is playing and confirm nothing visible changes except normal terminal behavior.

### Tests for User Story 2 (REQUIRED for story behavior) ⚠️

- [X] T008 [P] [US2] Add unit test for idle Esc stop requests being a no-op in `tests/unit/playback-queue-stop-idle.test.ts`
- [X] T009 [P] [US2] Add integration test for pressing Esc with no active playback in `tests/integration/esc-idle-noop.test.ts`

### Implementation for User Story 2

- [X] T010 [US2] Guard Esc handling in `talk-pi.ts` so the key falls back to normal editor behavior when no spoken playback is active

**Checkpoint**: User Stories 1 and 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup across both user stories

- [X] T011 [P] Validate `specs/005-esc-stop-playback/quickstart.md` against the implemented Esc stop flow and update any steps that no longer match
- [X] T012 Run focused playback interruption tests in `tests/unit/playback-queue-stop.test.ts`, `tests/unit/playback-queue-stop-idle.test.ts`, `tests/integration/esc-stop-playback.test.ts`, and `tests/integration/esc-idle-noop.test.ts`
- [X] T013 [P] Update F9/F10 voice shortcut handling to stop active playback before starting capture in `src/input/voice-shortcut-interrupt.ts` and `talk-pi.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of User Story 1 for testing and behavior

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Core stop behavior before status/UX polish
- Story complete before moving to next priority

### Parallel Opportunities

- T001 can run in parallel with T002
- T003 and T004 can run in parallel
- T008 and T009 can run in parallel
- T011 and T012 can run in parallel with final validation once code is ready
- After Phase 2, User Stories 1 and 2 can proceed in parallel if needed

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Add unit test for stopping active spoken playback and clearing queued speech in tests/unit/playback-queue-stop.test.ts"
Task: "Add integration test for pressing Esc during spoken reply playback in tests/integration/esc-stop-playback.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Demo the Esc-stop behavior if ready

### Incremental Delivery

1. Complete Setup + Foundational → playback interruption ready
2. Add User Story 1 → test independently → MVP behavior delivered
3. Add User Story 2 → test independently → idle Esc safety validated
4. Run Polish checks and quickstart verification

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
3. Finish with polish and validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Avoid combining user-story work into a single task when separate files are involved
