# Tasks: Temporary WAV Cleanup

**Input**: Design docs from `specs/008-temp-wav-cleanup/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Required. Write tests for cleanup behavior.

**Organization**: Tasks are grouped by user story so each slice can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shared temporary-file lifecycle scaffolding

- [x] T001 [P] Create temp WAV helper shell in `src/tts/temp-wav.ts` for temporary file paths and cleanup utilities
- [x] T002 [P] Create speech-job lifecycle shell in `src/tts/speech-job.ts` for ownership of one WAV file per speech job
- [x] T003 [P] Create unit test shell in `tests/unit/temp-wav.test.ts` for temporary WAV file lifecycle coverage
- [x] T004 [P] Create integration test shell in `tests/integration/temp-wav-cleanup.test.ts` for temporary WAV cleanup coverage

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core lifecycle plumbing that MUST exist before any user story can be completed

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Implement temporary WAV file creation and deletion helpers in `src/tts/temp-wav.ts` so generated files are unique and disposable
- [x] T006 Implement speech-job lifecycle ownership in `src/tts/speech-job.ts` so each job tracks its temporary WAV path, state, and cleanup timing
- [x] T007 Update `src/tts/piper-client.ts` and `src/tts/playback-queue.ts` to route all speech output through the temporary WAV lifecycle helpers

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create Temporary WAV Files Only (Priority: P1) 🎯 MVP

**Goal**: WAV files created during assistant speech generation are temporary and are removed after use.

**Independent Test**: Trigger speech generation and confirm a temporary WAV file is created for the job, then confirm it is removed after use.

### Tests for User Story 1 (REQUIRED for story behavior) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T008 [P] [US1] Add unit test for temporary WAV file creation and removal in `tests/unit/temp-wav.test.ts`
- [x] T009 [P] [US1] Add integration test for a successful speech job leaving no WAV files behind in `tests/integration/temp-wav-cleanup.test.ts`

### Implementation for User Story 1

- [x] T010 [P] [US1] Update `src/tts/piper-client.ts` to write synthesized audio into a temporary WAV file instead of a long-lived file
- [x] T011 [US1] Update `src/tts/speech-job.ts` so the temporary WAV file is deleted when the speech job completes normally

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Clean Up After Success or Failure (Priority: P2)

**Goal**: Temporary WAV files are removed whether speech playback succeeds, fails, or is interrupted.

**Independent Test**: Simulate successful playback, a failed playback, and an interrupted playback, and confirm no leftover WAV files remain.

### Tests for User Story 2 (REQUIRED for story behavior) ⚠️

- [x] T012 [P] [US2] Add unit test for cleanup on success, failure, and interruption in `tests/unit/temp-wav-cleanup-outcomes.test.ts`
- [x] T013 [P] [US2] Add integration test for failed or interrupted playback leaving no temporary WAV files in `tests/integration/temp-wav-failure-cleanup.test.ts`

### Implementation for User Story 2

- [x] T014 [P] [US2] Update `src/tts/playback-queue.ts` to delete temporary WAV files on playback success, failure, and stop paths
- [x] T015 [US2] Update `src/tts/speech-job.ts` and `src/tts/wav-player.ts` to guarantee cleanup in finalizers when playback is interrupted or errors occur

**Checkpoint**: User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Avoid Temp File Buildup Over Time (Priority: P3)

**Goal**: Repeated use of speech features does not leave behind old temporary WAV files over time.

**Independent Test**: Run multiple speech jobs in a row and confirm the temporary file count does not keep growing.

### Tests for User Story 3 (REQUIRED for story behavior) ⚠️

- [x] T016 [P] [US3] Add unit test for repeated speech jobs not accumulating leftover files in `tests/unit/temp-wav-buildup.test.ts`
- [x] T017 [P] [US3] Add integration test for long-session cleanup stability in `tests/integration/temp-wav-reuse.test.ts`

### Implementation for User Story 3

- [x] T018 [P] [US3] Update `src/tts/speech-job.ts` to create a fresh temporary WAV file per job and prevent reuse after deletion
- [x] T019 [US3] Update `src/tts/playback-queue.ts` to clear any retained temp-file references between jobs and after cleanup

**Checkpoint**: User Stories 1 AND 2 AND 3 should all work independently

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T020 Update `specs/008-temp-wav-cleanup/quickstart.md` with the final temp WAV verification steps and expected cleanup behavior
- [ ] T021 Verify `specs/008-temp-wav-cleanup/data-model.md` and `specs/008-temp-wav-cleanup/research.md` match the implemented WAV lifecycle cleanup behavior

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
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Temporary-file creation before cleanup polish
- Cleanup on success before failure/interrupt robustness
- One temporary WAV per speech job
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch both tests for User Story 1 together:
Task: "Add unit test for temporary WAV file creation and removal in tests/unit/temp-wav.test.ts"
Task: "Add integration test for a successful speech job leaving no WAV files behind in tests/integration/temp-wav-cleanup.test.ts"

# Launch implementation pieces together:
Task: "Update src/tts/piper-client.ts to write synthesized audio into a temporary WAV file instead of a long-lived file"
Task: "Update src/tts/speech-job.ts so the temporary WAV file is deleted when the speech job completes normally"
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
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
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
