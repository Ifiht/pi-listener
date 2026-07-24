# Tasks: Piper Model Selection

**Input**: Design documents from `/specs/010-piper-model-select/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Required. Add coverage for model selection, English output, and saved preference behavior.

**Organization**: Tasks are grouped by user story so each slice can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shared Piper voice-preference scaffolding

- [x] T001 [P] Create Piper voice preference helper shell in `src/tts/piper-preferences.ts` for model listing, active choice, and fallback resolution
- [x] T002 [P] Create unit test shell in `tests/unit/piper-preferences.test.ts` for model discovery and selection coverage
- [x] T003 [P] Create integration test shell in `tests/integration/piper-model-menu.test.ts` for `/talk-pi` model menu coverage

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core Piper preference plumbing that MUST exist before any user story can be completed

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Implement Piper model discovery and active-model resolution in `src/tts/piper-preferences.ts` so the app can enumerate available models and identify the selected one
- [ ] T005 Implement preference application plumbing in `src/config.ts` and `src/tts/piper-client.ts` so future replies can use the selected Piper model path

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Choose Piper Model from Menu (Priority: P1) 🎯 MVP

**Goal**: Users can choose a Piper voice model from `/talk-pi` and see which model is active.

**Independent Test**: Open `/talk-pi`, select a different Piper model, and confirm future replies use that model and the menu shows it as active.

### Tests for User Story 1 (REQUIRED for story behavior) ⚠️

- [x] T006 [P] [US1] Add unit coverage in `tests/unit/piper-preferences.test.ts` for active-model display, menu selection, and fallback behavior
- [x] T007 [P] [US1] Add integration coverage in `tests/integration/piper-model-menu.test.ts` for selecting a Piper model through `/talk-pi`

### Implementation for User Story 1

- [x] T008 [US1] Update `src/ui/menu-actions.ts` and `src/ui/unified-talk-menu.ts` to expose Piper model choices in `/talk-pi`
- [x] T009 [US1] Update `talk-pi.ts` to pass the selected Piper model into playback configuration and show the active model in menu status

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Choose English Output (Priority: P2)

**Goal**: Users can choose an English output option in `/talk-pi` and use it for future speech.

**Independent Test**: Open `/talk-pi`, choose English output, and confirm future spoken replies use the English option.

### Tests for User Story 2 (REQUIRED for story behavior) ⚠️

- [x] T010 [P] [US2] Add unit coverage in `tests/unit/piper-preferences.test.ts` for English output mapping and fallback selection
- [x] T011 [P] [US2] Add integration coverage in `tests/integration/piper-english-output.test.ts` for choosing English output from `/talk-pi`

### Implementation for User Story 2

- [x] T012 [US2] Update `src/ui/menu-actions.ts`, `src/ui/unified-talk-menu.ts`, and `talk-pi.ts` to expose English output as a first-class menu choice
- [x] T013 [US2] Update `src/tts/piper-client.ts`, `src/tts/piper-preferences.ts`, and `src/voice/offline-whisper.ts` to apply English model fallback or clear error handling when needed

**Checkpoint**: User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Preserve Current Choice Across Sessions (Priority: P3)

**Goal**: Piper model and output choice remain available after restarting Talk-Pi.

**Independent Test**: Select a model and English output, restart Talk-Pi, and confirm the previous choice is still available or active.

### Tests for User Story 3 (REQUIRED for story behavior) ⚠️

- [x] T014 [P] [US3] Add unit coverage in `tests/unit/piper-preferences.test.ts` for saving and restoring voice preference across sessions
- [x] T015 [P] [US3] Add integration coverage in `tests/integration/piper-preference-persistence.test.ts` for restarting Talk-Pi with the same voice choice available

### Implementation for User Story 3

- [x] T016 [US3] Implement preference persistence in `src/tts/piper-preferences.ts`, `src/config.ts`, and `talk-pi.ts` so selected voice language survives future sessions and Whisper follows it
- [x] T017 [US3] Update `specs/010-piper-model-select/quickstart.md` and `specs/010-piper-model-select/data-model.md` with final voice-language persistence and fallback verification steps

**Checkpoint**: User Stories 1 AND 2 AND 3 should all work independently

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T018 Update `specs/010-piper-model-select/research.md` and `specs/010-piper-model-select/plan.md` to reflect the final voice-language behavior
- [ ] T019 Verify `package.json` and `README.md` mention available voice-model selection guidance for publish/install users

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
- Model discovery before menu wiring
- Menu wiring before persistence polish
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
Task: "Add unit coverage in tests/unit/piper-preferences.test.ts for active-model display, menu selection, and fallback behavior"
Task: "Add integration coverage in tests/integration/piper-model-menu.test.ts for selecting a Piper model through /talk-pi"

# Launch implementation pieces together:
Task: "Update src/ui/menu-actions.ts and src/ui/unified-talk-menu.ts to expose Piper model choices in /talk-pi"
Task: "Update talk-pi.ts to pass the selected Piper model into playback configuration and show the active model in menu status"
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
