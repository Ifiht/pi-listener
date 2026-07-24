# Tasks: Emoji Footer Status

**Input**: Design documents from `/specs/009-emoji-footer-status/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Required. Add coverage for footer text, status transitions, and narrow-terminal readability.

**Organization**: Tasks are grouped by user story so each slice can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shared footer-status scaffolding

- [x] T001 [P] Create shared footer status formatter shell in `src/ui/footer-status.ts` for prefix, emoji, and state mapping
- [x] T002 [P] Create unit test shell in `tests/unit/footer-status.test.ts` for footer prefix and status coverage
- [x] T003 [P] Create integration test shell in `tests/integration/footer-status.test.ts` for footer rendering and mode-change coverage

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core footer-status plumbing that MUST exist before any user story can be completed

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Implement shared footer status formatter and status-to-emoji mapping in `src/ui/footer-status.ts` so the footer can render `| Talk-Pi: Status Emoji |` for Ready/Listen/Transcribing/Thinking/Talking/Muted/Error/No speech detected
- [x] T005 Update `talk-pi.ts` to route footer rendering through the shared footer status formatter instead of the current concatenated status text

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Clear Status at a Glance (Priority: P1) 🎯 MVP

**Goal**: The footer always starts with a friendly Talk-Pi prefix and a visible emoji status.

**Independent Test**: Start the app and verify the footer follows the `| Talk-Pi: Status Emoji |` format and shows the idle Ready state with an emoji.

### Tests for User Story 1 (REQUIRED for story behavior) ⚠️

- [x] T006 [P] [US1] Add unit coverage in `tests/unit/footer-status.test.ts` for the Talk-Pi prefix, Ready label, and emoji pairing
- [x] T007 [P] [US1] Add integration coverage in `tests/integration/footer-status.test.ts` for the initial footer text shown at app start

### Implementation for User Story 1

- [x] T008 [US1] Update `talk-pi.ts` so the footer always displays the current status label and emoji in the pipe-delimited footer format

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Status Changes Reflect App Mode (Priority: P2)

**Goal**: The footer changes to Listen, Thinking, Talking, Muted, Error, and No speech detected as the app moves through voice capture, playback, and error states.

**Independent Test**: Trigger recording, transcription, assistant playback, mute, and error/no-speech flows and confirm the footer updates to the right status label and emoji at each step.

### Tests for User Story 2 (REQUIRED for story behavior) ⚠️

- [x] T009 [P] [US2] Extend unit coverage in `tests/unit/footer-status.test.ts` for Listen, Transcribing, Thinking, Talking, Muted, Error, and No speech detected label/emoji mappings
- [x] T010 [P] [US2] Extend integration coverage in `tests/integration/footer-status.test.ts` for footer changes during recording, transcribing, processing, playback, mute, and error/no-speech flows

### Implementation for User Story 2

- [x] T011 [US2] Update `src/voice/voice-capture.ts` and `src/tts/playback-queue.ts` to publish the app mode that drives the footer status transitions (Listen → Transcribing → Thinking → Talking)
- [x] T012 [US2] Update `src/ui/spoken-reply-status.ts` and `src/ui/transcription-status.ts` to provide user-facing labels that align with the footer status vocabulary

**Checkpoint**: User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Readable in Tight Spaces (Priority: P3)

**Goal**: The footer remains understandable even when the terminal is narrow.

**Independent Test**: Resize the terminal to a narrow width and confirm the footer still communicates the current app state clearly.

### Tests for User Story 3 (REQUIRED for story behavior) ⚠️

- [x] T013 [P] [US3] Add unit coverage in `tests/unit/footer-status.test.ts` for compact footer output when space is limited
- [x] T014 [P] [US3] Add integration coverage in `tests/integration/footer-status.test.ts` for narrow-terminal readability

### Implementation for User Story 3

- [x] T015 [US3] Implement compact footer rendering in `src/ui/footer-status.ts` and apply it from `talk-pi.ts` when the footer cannot fit on one line

**Checkpoint**: User Stories 1 AND 2 AND 3 should all work independently

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T016 Update `specs/009-emoji-footer-status/quickstart.md` with the final footer verification steps for Ready, Listen, Thinking, Talking, Muted, Error, and No speech detected
- [x] T017 Verify `specs/009-emoji-footer-status/data-model.md` and `specs/009-emoji-footer-status/research.md` match the implemented footer behavior and compact fallback rules

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
- Shared footer formatter before app wiring
- App wiring before compact fallback polish
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- The unit and integration test shells can be created in parallel
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch both tests for User Story 1 together:
Task: "Add unit coverage in tests/unit/footer-status.test.ts for the pipe-delimited footer format, Ready label, and emoji pairing"
Task: "Add integration coverage in tests/integration/footer-status.test.ts for the initial footer text shown at app start"

# Launch implementation pieces together:
Task: "Update talk-pi.ts so the footer always displays the current status label and emoji in the pipe-delimited footer format"
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
