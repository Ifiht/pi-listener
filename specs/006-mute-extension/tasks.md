# Tasks: Mute Extension Menu

**Input**: Design docs from `specs/006-mute-extension/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Required. Write tests for behavior changes.

**Organization**: Tasks are grouped by user story so each slice can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create shared mute feature scaffolding used by all stories

- [X] T001 Create shared mute helper module shells in `src/ui/mute-state.ts` and `src/ui/mute-menu.ts` for the new menu flow
- [X] T002 Create feature-specific test file shells in `tests/unit/mute-state.test.ts` and `tests/integration/mute-menu-toggle.test.ts` so mute behavior has dedicated coverage targets

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core mute plumbing that MUST exist before any user story can be completed

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Implement current-session mute state behavior in `src/ui/mute-state.ts` with `mute()`, `unmute()`, `toggle()`, and `isMuted()` helpers
- [X] T004 Implement menu label and state rendering in `src/ui/mute-menu.ts` so the menu can show mute/unmute actions and the current state text
- [X] T005 Update `src/ui/spoken-reply-status.ts` to expose muted and unmuted status text consistently alongside playback state

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Toggle Mute from the Menu (Priority: P1) 🎯 MVP

**Goal**: The user can open the extension menu and switch between muted and unmuted states from one place.

**Independent Test**: Open the menu, choose mute, confirm the extension becomes muted, then choose unmute and confirm it becomes active again.

### Tests for User Story 1 (REQUIRED for story behavior) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T006 [P] [US1] Add unit test for mute state toggle behavior in `tests/unit/mute-state.test.ts`
- [X] T007 [P] [US1] Add integration test for opening the menu and selecting mute/unmute in `tests/integration/mute-menu-toggle.test.ts`

### Implementation for User Story 1

- [X] T008 [P] [US1] Wire the mute menu entry into `talk-pi.ts` using `src/ui/mute-menu.ts`
- [X] T009 [US1] Connect the menu action to `src/ui/mute-state.ts` so the extension toggles between muted and unmuted states

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Silent While Muted (Priority: P2)

**Goal**: When muted, spoken output stops and new spoken replies do not play until unmuted.

**Independent Test**: Mute the extension, trigger a spoken reply, and confirm no audio plays while the visible text response remains available.

### Tests for User Story 2 (REQUIRED for story behavior) ⚠️

- [X] T010 [P] [US2] Add unit test for playback queue blocking while muted in `tests/unit/playback-queue-mute.test.ts`
- [X] T011 [P] [US2] Add integration test for muting during playback and suppressing queued speech in `tests/integration/mute-playback-blocking.test.ts`

### Implementation for User Story 2

- [X] T012 [P] [US2] Extend `src/tts/playback-queue.ts` so mute blocks queued audio and stops current playback promptly
- [X] T013 [US2] Update `talk-pi.ts` to forward mute changes to the playback queue and keep text replies visible while audio is blocked

**Checkpoint**: User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Clear Mute Status (Priority: P3)

**Goal**: The user can always tell whether the extension is muted and can unmute it without guessing.

**Independent Test**: Open the menu while muted and while unmuted, and confirm the current state is clearly shown in both cases.

### Tests for User Story 3 (REQUIRED for story behavior) ⚠️

- [X] T014 [P] [US3] Add unit test for muted/unmuted status display in `tests/unit/spoken-reply-status-muted.test.ts`
- [X] T015 [P] [US3] Add integration test for menu state visibility across repeated opens in `tests/integration/mute-status-visibility.test.ts`

### Implementation for User Story 3

- [X] T016 [P] [US3] Update `src/ui/spoken-reply-status.ts` to show muted and unmuted playback state clearly
- [X] T017 [US3] Update `talk-pi.ts` so the menu always reflects the current mute state when opened

**Checkpoint**: User Stories 1 AND 2 AND 3 should all work independently

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T018 Update `specs/006-mute-extension/quickstart.md` with final mute/unmute verification steps and expected status text
- [X] T019 Verify `specs/006-mute-extension/contracts/mute-menu.md` matches the implemented mute menu behavior and status wording

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
- Menu scaffolding before menu wiring
- Mute state before playback gating
- Status visibility before polish
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
Task: "Add unit test for mute state toggle behavior in tests/unit/mute-state.test.ts"
Task: "Add integration test for opening the menu and selecting mute/unmute in tests/integration/mute-menu-toggle.test.ts"

# Launch implementation pieces together:
Task: "Wire the mute menu entry into talk-pi.ts using src/ui/mute-menu.ts"
Task: "Connect the menu action to src/ui/mute-state.ts so the extension toggles between muted and unmuted states"
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
