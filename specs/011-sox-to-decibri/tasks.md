# Tasks: Recorder-Free Voice Capture

**Input**: Design documents from `/specs/011-sox-to-decibri/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Behavior change requires tests. Add unit and integration coverage for capture swap, repeatability, and failure handling.

**Organization**: Tasks grouped by user story so each story can be implemented and tested independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project dependency update

- [X] T001 Add `decibri` to `package.json` and refresh `package-lock.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared capture plumbing that all stories depend on

- [X] T002 [P] Create decibri microphone capture adapter in `src/voice/decibri-capture.ts` to expose stream start/stop behavior for `startMicCapture`
- [X] T003 Refactor `src/voice/offline-recorder.ts` to consume the new adapter and keep temporary WAV lifecycle intact
- [X] T004 [P] Remove recorder bootstrap dependency from `src/tools-bootstrap.ts` and prune SoX startup checks in `src/voice/voice-capture.ts`

**Checkpoint**: Recorder-free capture foundation ready; story work can begin.

---

## Phase 3: User Story 1 - Record Without Separate Recorder Setup (Priority: P1) 🎯 MVP

**Goal**: User records voice in Talk-Pi without installing or configuring separate recorder software.

**Independent Test**: Start voice input, speak, stop, and confirm a usable WAV is produced with no SoX/rec/arecord setup step.

### Tests for User Story 1 (REQUIRED)

- [X] T005 [P] [US1] Add unit test in `tests/unit/offline-recorder.test.ts` for decibri-backed capture producing a temp WAV path without SoX
- [X] T006 [P] [US1] Add integration test in `tests/integration/push_to_talk_flow.test.ts` for record → stop → transcript flow when SoX/rec/arecord are unavailable

### Implementation for User Story 1

- [X] T007 [US1] Implement decibri-backed temp capture in `src/voice/offline-recorder.ts` so microphone audio is written to WAV without shelling out to SoX
- [X] T008 [US1] Update `src/voice/voice-capture.ts` to stop calling `ensureRecorderTool` and rely on recorder-free capture startup

**Checkpoint**: User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Keep Voice Flow Working Across Supported Platforms (Priority: P2)

**Goal**: Same voice recording flow works on supported desktop platforms with no extra setup.

**Independent Test**: Run two back-to-back recordings in one session on a supported desktop platform and confirm both succeed without extra setup.

### Tests for User Story 2 (REQUIRED)

- [X] T009 [P] [US2] Add unit test in `tests/unit/offline-recorder.test.ts` for back-to-back capture sessions using fresh decibri instances
- [X] T010 [P] [US2] Add integration test in `tests/integration/voice-capture-repeatability.test.ts` for two consecutive recordings in one session without extra setup

### Implementation for User Story 2

- [X] T011 [US2] Harden repeated session cleanup in `src/voice/offline-recorder.ts` so each recording closes its capture stream cleanly
- [X] T012 [US2] Update `src/voice/voice-capture.ts` stop/dispose flow so the next recording attempt starts from a clean idle state on all supported platforms

**Checkpoint**: User Stories 1 and 2 should both work independently.

---

## Phase 5: User Story 3 - Show Clear Capture Failures (Priority: P3)

**Goal**: User gets clear error when voice capture cannot start or finish.

**Independent Test**: Simulate missing microphone access and confirm Talk-Pi shows a clear error and stays ready for retry.

### Tests for User Story 3 (REQUIRED)

- [X] T013 [P] [US3] Add unit test in `tests/unit/offline-recorder-cleanup.test.ts` for capture-start failure returning a recoverable error
- [X] T014 [P] [US3] Add integration test in `tests/integration/voice-capture-failure.test.ts` for unavailable microphone access showing a clear error and allowing retry

### Implementation for User Story 3

- [X] T015 [US3] Map capture failures to user-facing messages in `src/voice/voice-capture.ts`
- [X] T016 [US3] Preserve retry-ready state after capture failures in `src/voice/offline-recorder.ts` and `src/voice/voice-capture.ts`

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup shared docs and obsolete recorder code

- [X] T017 [P] Update `README.md` and `.env.example` to remove SoX recorder setup wording and describe recorder-free capture
- [X] T018 Remove obsolete SoX bootstrap logic and dead recorder-specific constants from `src/tools-bootstrap.ts` and `src/voice/offline-recorder.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational - no dependency on other stories
- **US2 (P2)**: Can start after Foundational - should stay testable on its own
- **US3 (P3)**: Can start after Foundational - should stay testable on its own

### Parallel Opportunities

- **Foundational**: T002 and T004 can run in parallel
- **US1**: T005 and T006 can run in parallel
- **US2**: T009 and T010 can run in parallel
- **US3**: T013 and T014 can run in parallel
- **Polish**: T017 can run alongside code cleanup planning

---

## Parallel Example: User Story 1

```bash
Task: "Add unit test in tests/unit/offline-recorder.test.ts for decibri-backed capture producing a temp WAV path without SoX"
Task: "Add integration test in tests/integration/push_to_talk_flow.test.ts for record → stop → transcript flow when SoX/rec/arecord are unavailable"
```

## Parallel Example: User Story 2

```bash
Task: "Add unit test in tests/unit/offline-recorder.test.ts for back-to-back capture sessions using fresh decibri instances"
Task: "Add integration test in tests/integration/voice-capture-repeatability.test.ts for two consecutive recordings in one session without extra setup"
```

## Parallel Example: User Story 3

```bash
Task: "Add unit test in tests/unit/offline-recorder-cleanup.test.ts for capture-start failure returning a recoverable error"
Task: "Add integration test in tests/integration/voice-capture-failure.test.ts for unavailable microphone access showing a clear error and allowing retry"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate record → stop → transcript flow without SoX
5. Stop and demo if ready

### Incremental Delivery

1. Setup + Foundational → recorder-free capture base
2. Add US1 → first usable MVP
3. Add US2 → repeatable, platform-stable recording flow
4. Add US3 → clear failure and retry behavior
5. Finish with docs and cleanup

### Parallel Team Strategy

- One developer handles decibri adapter + recorder swap
- One developer handles repeatability tests and cleanup
- One developer handles failure-path tests and user-facing errors

---

## Notes

- [P] tasks = different files, no dependency on incomplete work
- [Story] labels map tasks to specific user stories for traceability
- Every behavior change includes tests before implementation
- Keep story increments independently testable
