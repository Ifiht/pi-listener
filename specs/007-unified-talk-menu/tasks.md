# Tasks: Unified Talk Menu

**Input**: Design docs from `specs/007-unified-talk-menu/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Required. Write tests for behavior changes.

**Organization**: Tasks are grouped by user story so each slice can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the unified menu entry point and shared menu scaffolding

- [X] T001 Create unified menu helper shells in `src/ui/unified-talk-menu.ts` and `src/ui/menu-actions.ts` for the `/talk-pi` flow
- [X] T002 Create feature-specific test shells in `tests/unit/unified-talk-menu.test.ts` and `tests/integration/unified-talk-menu-open.test.ts` for the new single-command menu flow

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core menu plumbing that MUST exist before any user story can be completed

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Implement menu action modeling in `src/ui/menu-actions.ts` for Status, Mute/Unmute, and Close options
- [X] T004 Implement unified menu state behavior in `src/ui/unified-talk-menu.ts` so the same menu can open from `/talk-pi` and render the current actions
- [X] T005 Update `src/ui/spoken-reply-status.ts` to keep status text readable when shown from the unified menu

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Open the Unified Menu (Priority: P1) 🎯 MVP

**Goal**: The user can open the extension menu with `/talk-pi` and find both status and mute controls in one place.

**Independent Test**: Run `/talk-pi` and confirm the unified menu opens and shows the available controls.

### Tests for User Story 1 (REQUIRED for story behavior) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T006 [P] [US1] Add unit test for unified menu opening from `/talk-pi` in `tests/unit/unified-talk-menu.test.ts`
- [X] T007 [P] [US1] Add integration test for `/talk-pi` opening the unified menu in `tests/integration/unified-talk-menu-open.test.ts`

### Implementation for User Story 1

- [X] T008 [P] [US1] Wire `/talk-pi` in `talk-pi.ts` to open `src/ui/unified-talk-menu.ts`
- [X] T009 [US1] Remove the separate `/talk-pi-menu` user-facing path from `talk-pi.ts`

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View Current Status from the Menu (Priority: P2)

**Goal**: The user can open the Status option from the unified menu and see the extension’s current state without leaving the menu flow.

**Independent Test**: Open `/talk-pi`, choose Status, and confirm the current state is shown clearly.

### Tests for User Story 2 (REQUIRED for story behavior) ⚠️

- [X] T010 [P] [US2] Add unit test for Status action rendering current state in `tests/unit/unified-talk-menu-status.test.ts`
- [X] T011 [P] [US2] Add integration test for selecting Status from `/talk-pi` in `tests/integration/unified-talk-menu-status.test.ts`

### Implementation for User Story 2

- [X] T012 [P] [US2] Implement Status action handling in `src/ui/menu-actions.ts` and `talk-pi.ts` so the current state is shown from the unified menu
- [X] T013 [US2] Update `src/ui/unified-talk-menu.ts` to refresh menu labels and status text when state changes

**Checkpoint**: User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Move Mute Controls Into the Unified Menu (Priority: P3)

**Goal**: The user can mute or unmute the extension from the same `/talk-pi` menu instead of needing a separate command.

**Independent Test**: Open `/talk-pi`, toggle mute, and confirm the menu reflects the new state.

### Tests for User Story 3 (REQUIRED for story behavior) ⚠️

- [X] T014 [P] [US3] Add unit test for mute/unmute action routing in `tests/unit/unified-talk-menu-mute.test.ts`
- [X] T015 [P] [US3] Add integration test for toggling mute from `/talk-pi` in `tests/integration/unified-talk-menu-mute.test.ts`

### Implementation for User Story 3

- [X] T016 [P] [US3] Move mute/unmute handling into `src/ui/menu-actions.ts` so the unified menu controls mute state
- [X] T017 [US3] Update `talk-pi.ts` so mute changes and status display stay in sync within the unified menu

**Checkpoint**: User Stories 1 AND 2 AND 3 should all work independently

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T018 Update `specs/007-unified-talk-menu/quickstart.md` with the final `/talk-pi` unified menu verification steps
- [X] T019 Verify `specs/007-unified-talk-menu/contracts/unified-talk-menu.md` matches the implemented single-command menu behavior

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
- Status before mute polish
- `/talk-pi` before retiring `/talk-pi-menu`
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
Task: "Add unit test for unified menu opening from /talk-pi in tests/unit/unified-talk-menu.test.ts"
Task: "Add integration test for /talk-pi opening the unified menu in tests/integration/unified-talk-menu-open.test.ts"

# Launch implementation pieces together:
Task: "Wire /talk-pi in talk-pi.ts to open src/ui/unified-talk-menu.ts"
Task: "Remove the separate /talk-pi-menu user-facing path from talk-pi.ts"
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
