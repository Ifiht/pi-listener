# Tasks: Whisper Text Input

**Input**: Design docs from `specs/002-whisper-input/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Required. Write tests first for behavior changes.

**Organization**: Tasks grouped by user story to keep implementation and testing independent.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, ...)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and support for local Whisper transcription

- [ ] T001 Add local Whisper transcription dependency to `package.json` and lockfile support for offline speech recognition
- [ ] T002 Create source folders `src/transcription/`, `src/input/`, and `src/ui/`, plus test folders `tests/unit/` and `tests/integration/`
- [ ] T003 Create `specs/002-whisper-input/quickstart.md` with manual verification steps for recording, transcription, and TUI insertion

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core services that must exist before user stories can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Implement Whisper model loader/cache in `src/transcription/whisper-client.ts` to download and reuse free local model files
- [ ] T005 Implement WAV transcription service in `src/transcription/transcribe-file.ts` that returns transcript text, no-speech, or error state
- [ ] T006 Implement editor insertion helper in `src/input/editor-insert.ts` that uses `ctx.ui.pasteToEditor()` to preserve existing input
- [ ] T007 Implement recognition feedback helper in `src/ui/transcription-status.ts` for success, no-speech, and error messages

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Auto Transcribe Recording (Priority: P1) 🎯 MVP

**Goal**: Finished `.wav` becomes text in active TUI input buffer.

**Independent Test**: Record short phrase, finish recording, and confirm recognized text appears in active input without auto-send.

### Tests for User Story 1 (REQUIRED for story behavior) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T008 [P] [US1] Add unit test for transcription service returning text from WAV in `tests/unit/transcribe-file.test.ts`
- [ ] T009 [P] [US1] Add unit test for editor insertion preserving existing input in `tests/unit/editor-insert.test.ts`
- [ ] T010 [P] [US1] Add integration test for finished recording inserting transcript into TUI input in `tests/integration/whisper-input-flow.test.ts`

### Implementation for User Story 1

- [ ] T011 [P] [US1] Wire `src/voice/voice-capture.ts` to call transcription service when recording ends
- [ ] T012 [P] [US1] Update `talk-pi.ts` to paste recognized transcript into active TUI input and avoid auto-send
- [ ] T013 [US1] Keep existing input text intact when inserting transcript in `src/input/editor-insert.ts`
- [ ] T014 [US1] Use free local Whisper-compatible model path and language detection in `src/transcription/whisper-client.ts`

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Recognition Feedback and Recovery (Priority: P2)

**Goal**: Clear success/error/no-speech feedback when recognition runs.

**Independent Test**: Trigger success and failure paths and verify UI shows correct message while input stays clean.

### Tests for User Story 2 (REQUIRED for story behavior) ⚠️

- [ ] T015 [P] [US2] Add unit test for success and no-speech feedback in `tests/unit/transcription-status.test.ts`
- [ ] T016 [P] [US2] Add integration test for recognition failure not inserting junk text in `tests/integration/whisper-error-handling.test.ts`

### Implementation for User Story 2

- [ ] T017 [US2] Show success, no-speech, and error notifications in `talk-pi.ts`
- [ ] T018 [US2] Ensure recognition failures leave TUI input unchanged in `src/input/editor-insert.ts`
- [ ] T019 [US2] Surface model download and transcription errors in `src/ui/transcription-status.ts`

**Checkpoint**: User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T020 Update `specs/002-whisper-input/quickstart.md` with final user flow and validation steps
- [ ] T021 Remove debug logging from `talk-pi.ts` and verify transcript flow stays silent unless success/error occurs
- [ ] T022 Verify `package-lock.json` reflects Whisper dependency and local model support

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
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Model/service before wiring
- Wiring before feedback polish
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
Task: "Add unit test for transcription service returning text from WAV in tests/unit/transcribe-file.test.ts"
Task: "Add unit test for editor insertion preserving existing input in tests/unit/editor-insert.test.ts"
Task: "Add integration test for finished recording inserting transcript into TUI input in tests/integration/whisper-input-flow.test.ts"

# Launch foundation work together:
Task: "Implement Whisper model loader/cache in src/transcription/whisper-client.ts"
Task: "Implement editor insertion helper in src/input/editor-insert.ts"
Task: "Implement recognition feedback helper in src/ui/transcription-status.ts"
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
