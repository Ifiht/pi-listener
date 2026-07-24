# Tasks: F5 Auto Insert

**Input**: Design docs from `specs/004-f5-auto-insert/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Required. Write tests first for behavior changes.

**Organization**: Tasks grouped by user story to keep implementation and testing independent.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and support for F5 shortcut and transcript insertion

- [ ] T001 Add or verify shortcut handling support in `talk-pi.ts` for F5 double-press detection alongside the existing F10 flow
- [ ] T002 Create or verify test folders `tests/unit/`, `tests/integration/`, and `tests/contract/` for F5 shortcut coverage
- [ ] T003 Update `specs/004-f5-auto-insert/quickstart.md` with the F5 double-press verification flow and F10 preservation check

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core services that must exist before user stories can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Implement F5 shortcut state helper in `src/input/f5-shortcut.ts` to detect double-press timing and separate it from F10
- [X] T005 Implement transcript insertion helper in `src/input/editor-insert.ts` to preserve existing input text and avoid auto-send
- [ ] T006 Implement voice result normalization in `src/tts/spoken-text.ts` to keep inserted transcript clean and editable
- [X] T007 Implement status messaging helper in `src/ui/transcription-status.ts` for capture, insert, no-speech, and error feedback

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - F5 Double Press Inserts Transcript (Priority: P1) 🎯 MVP

**Goal**: Double-pressing F5 starts the existing voice flow and inserts the transcript into the active input automatically.

**Independent Test**: Double-press F5, finish speaking, and confirm the transcript appears in the active input buffer without sending the message.

### Tests for User Story 1 (REQUIRED for story behavior) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T008 [P] [US1] Add unit test for F5 double-press detection in `tests/unit/f5-shortcut.test.ts`
- [X] T009 [P] [US1] Add unit test for transcript insertion preserving existing input in `tests/unit/editor-insert.test.ts`
- [X] T010 [P] [US1] Add integration test for F5 double-press inserting transcript into the input buffer in `tests/integration/f5-auto-insert-flow.test.ts`

### Implementation for User Story 1

- [X] T011 [P] [US1] Wire `src/input/f5-shortcut.ts` into `talk-pi.ts` so F5 double-press triggers the same voice capture flow as F10
- [X] T012 [P] [US1] Wire `src/input/editor-insert.ts` into `talk-pi.ts` so recognized transcript is inserted into the active input automatically
- [X] T013 [US1] Update `talk-pi.ts` to keep the transcript unsent and editable after F5-triggered recognition completes

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Keep F10 Behavior Unchanged (Priority: P2)

**Goal**: Existing F10 voice behavior remains available and unchanged while F5 is added.

**Independent Test**: Use F10 exactly as before and confirm the same voice capture and transcript insertion behavior still happens.

### Tests for User Story 2 (REQUIRED for story behavior) ⚠️

- [ ] T014 [P] [US2] Add unit test for F10 shortcut still working in `tests/unit/f10-shortcut-compatibility.test.ts`
- [ ] T015 [P] [US2] Add integration test for F10 voice flow remaining unchanged in `tests/integration/f10-compatibility-flow.test.ts`

### Implementation for User Story 2

- [X] T016 [P] [US2] Preserve the current F10 handling path in `talk-pi.ts` while sharing the transcript insertion helper with the new F5 path
- [X] T017 [US2] Update `src/input/f5-shortcut.ts` and `talk-pi.ts` so F5 and F10 remain separate shortcuts with the same transcript outcome

**Checkpoint**: User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - No Accidental Send or Junk Text (Priority: P3)

**Goal**: Failed or empty recognition leaves the input buffer unchanged and never auto-sends.

**Independent Test**: Trigger a no-speech or error case and confirm the input buffer stays unchanged and unsent.

### Tests for User Story 3 (REQUIRED for story behavior) ⚠️

- [ ] T018 [P] [US3] Add unit test for empty and failed recognition producing no insert in `tests/unit/transcript-empty-noop.test.ts`
- [ ] T019 [P] [US3] Add integration test for recognition failure leaving input unchanged in `tests/integration/f5-error-handling.test.ts`

### Implementation for User Story 3

- [ ] T020 [US3] Update `src/input/editor-insert.ts` to ignore empty or whitespace-only transcript results
- [ ] T021 [US3] Update `src/ui/transcription-status.ts` and `talk-pi.ts` to show no-speech or error feedback without changing the input buffer

**Checkpoint**: User Stories 1 AND 2 AND 3 should all work independently

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T022 Update `specs/004-f5-auto-insert/quickstart.md` with final F5 and F10 validation steps
- [ ] T023 Verify `package-lock.json` and `talk-pi.ts` reflect the new F5 path without removing existing F10 behavior

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
- Shortcut detection before insertion
- Insertion before compatibility polish
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
Task: "Add unit test for F5 double-press detection in tests/unit/f5-shortcut.test.ts"
Task: "Add unit test for transcript insertion preserving existing input in tests/unit/editor-insert.test.ts"
Task: "Add integration test for F5 double-press inserting transcript into the input buffer in tests/integration/f5-auto-insert-flow.test.ts"

# Launch core implementation pieces together:
Task: "Wire src/input/f5-shortcut.ts into talk-pi.ts so F5 double-press triggers the same voice capture flow as F10"
Task: "Wire src/input/editor-insert.ts into talk-pi.ts so recognized transcript is inserted into the active input automatically"
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
