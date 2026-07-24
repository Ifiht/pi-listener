# Tasks: Spoken Reply Playback

**Input**: Design docs from `specs/003-piper-tts-playback/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Required for behavior changes. Write tests first for each user story.

**Organization**: Tasks grouped by user story so each story can be built and verified independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and local speech playback support

- [x] T001 Add local WAV playback dependency to `package.json` and `package-lock.json` for terminal audio output
- [x] T002 Create `src/tts/` plus ensure `tests/unit/` and `tests/integration/` exist for new speech modules and tests
- [x] T003 Update `specs/003-piper-tts-playback/quickstart.md` with Piper install, voice model path, and local speaker verification steps

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core services that must exist before user stories can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Implement Piper speech synthesis client in `src/tts/piper-client.ts` to resolve binary/model paths, generate WAV files, and report synthesis errors
- [x] T005 Implement local WAV playback adapter in `src/tts/wav-player.ts` to play synthesized audio and surface playback failures
- [x] T006 Implement ordered playback queue in `src/tts/playback-queue.ts` to serialize speech jobs, skip empty replies, and defer while recording is active
- [x] T007 Implement spoken reply status helper in `src/ui/spoken-reply-status.ts` for queued, playing, deferred, success, and failure notices

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Automatic Spoken Replies (Priority: P1) 🎯 MVP

**Goal**: Finished LLM reply becomes spoken audio and plays automatically inside terminal flow.

**Independent Test**: Send a prompt and confirm reply is spoken automatically in order without manual export or external player.

### Tests for User Story 1 (REQUIRED for story behavior) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T008 [P] [US1] Add unit test for Piper synthesis producing WAV output in `tests/unit/piper-client.test.ts`
- [x] T009 [P] [US1] Add unit test for ordered speech playback queue in `tests/unit/playback-queue.test.ts`
- [x] T010 [P] [US1] Add integration test for completed reply triggering spoken playback in `tests/integration/spoken-reply-flow.test.ts`

### Implementation for User Story 1

- [x] T011 [P] [US1] Wire `src/tts/piper-client.ts` into reply-to-speech flow so completed assistant text becomes a WAV job
- [x] T012 [P] [US1] Wire `src/tts/wav-player.ts` into reply playback flow so generated WAV is played locally
- [x] T013 [US1] Update `talk-pi.ts` to enqueue completed LLM replies for spoken playback while keeping text reply visible

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - No Feedback Loop During Recording (Priority: P2)

**Goal**: Spoken replies pause or queue while microphone recording is active, then resume after recording ends.

**Independent Test**: Start recording, receive a reply, and confirm no playback starts until recording ends.

### Tests for User Story 2 (REQUIRED for story behavior) ⚠️

- [x] T014 [P] [US2] Add unit test for recording gate deferring speech jobs in `tests/unit/recording-gate.test.ts`
- [x] T015 [P] [US2] Add integration test for active recording pausing spoken playback in `tests/integration/spoken-reply-recording-mute.test.ts`

### Implementation for User Story 2

- [x] T016 [P] [US2] Update `src/voice/voice-capture.ts` to publish recording start and stop state for spoken playback gating
- [x] T017 [P] [US2] Update `src/tts/playback-queue.ts` to suspend queued speech while recording is active and resume when recording ends
- [x] T018 [US2] Update `talk-pi.ts` to sync recording state with spoken playback and avoid audio overlap with microphone capture

**Checkpoint**: User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Graceful Audio Failures (Priority: P3)

**Goal**: Speech generation or playback failure does not break text flow or block later replies.

**Independent Test**: Simulate audio failure and confirm text reply still appears and next replies still process.

### Tests for User Story 3 (REQUIRED for story behavior) ⚠️

- [x] T019 [P] [US3] Add unit test for synthesis and playback failure handling in `tests/unit/spoken-reply-failure.test.ts`
- [x] T020 [P] [US3] Add integration test for audio failure preserving text flow in `tests/integration/spoken-reply-error-handling.test.ts`

### Implementation for User Story 3

- [x] T021 [US3] Surface Piper and playback failures through `src/ui/spoken-reply-status.ts` while keeping reply text visible
- [x] T022 [US3] Ensure later replies continue processing after a failed speech job in `src/tts/playback-queue.ts`

**Checkpoint**: User Stories 1 AND 2 AND 3 should all work independently

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T023 Update `specs/003-piper-tts-playback/quickstart.md` with final install, playback, and mute-while-recording validation steps
- [x] T024 Verify `package-lock.json` reflects local playback dependency and remove any stray debug logging from `talk-pi.ts`

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
- Speech synthesis before playback
- Playback before status polish
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
# Launch all tests for User Story 1 together:
Task: "Add unit test for Piper synthesis producing WAV output in tests/unit/piper-client.test.ts"
Task: "Add unit test for ordered speech playback queue in tests/unit/playback-queue.test.ts"
Task: "Add integration test for completed reply triggering spoken playback in tests/integration/spoken-reply-flow.test.ts"

# Launch core speech pieces together:
Task: "Wire src/tts/piper-client.ts into reply-to-speech flow so completed assistant text becomes a WAV job"
Task: "Wire src/tts/wav-player.ts into reply playback flow so generated WAV is played locally"
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
