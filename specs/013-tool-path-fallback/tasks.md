# Tasks: Tool Path Fallback

**Input**: Design documents from `/specs/013-tool-path-fallback/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Required for this behavior change. Add unit coverage for path precedence, fallback creation, and failure handling.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Test scaffolding for isolated filesystem and home-directory scenarios

- [X] T001 [P] Create reusable temp-home and temp-tools helpers in `tests/unit/tools-test-utils.ts` for tool-path test setup

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared tool-root resolution behavior that all stories depend on

- [X] T002 Refactor `src/tools.ts` to centralize tool-root resolution with explicit precedence for `TALK_PI_TOOLS_DIR`, `~/.pi/tools`, and the local `./tools` fallback
- [X] T003 Update `src/tools-bootstrap.ts` to surface tool-root resolution and creation failures with a clear user-facing error instead of silently swallowing them

**Checkpoint**: Tool-path resolution is now a single, shared flow and can support story-specific behavior.

---

## Phase 3: User Story 1 - Prefer User Tools When Available (Priority: P1) 🎯 MVP

**Goal**: When `~/.pi` exists, current flows use `~/.pi/tools` even if a local `./tools` folder is also present.

**Independent Test**: With both locations present, a unit test confirms `resolveToolsRoot()` chooses `~/.pi/tools`.

### Tests for User Story 1 (REQUIRED)

- [X] T004 [P] [US1] Add unit coverage in `tests/unit/tools-root-preference.test.ts` for preferring `~/.pi/tools` over local `./tools`

### Implementation for User Story 1

- [X] T005 [US1] Update `src/tools.ts` so the resolved tools root switches to `~/.pi/tools` whenever `~/.pi` exists

**Checkpoint**: User Story 1 should be fully functional and independently verifiable.

---

## Phase 4: User Story 2 - Create Local Tools on Fresh Install (Priority: P2)

**Goal**: When `~/.pi` is absent, current flows create and use the local `./tools` folder.

**Independent Test**: With no `~/.pi` directory, a unit test confirms `./tools` is created and selected as the active tools root.

### Tests for User Story 2 (REQUIRED)

- [X] T006 [P] [US2] Add unit coverage in `tests/unit/tools-root-creation.test.ts` for creating and selecting `./tools` when `~/.pi` is absent

### Implementation for User Story 2

- [X] T007 [US2] Extend `src/tools.ts` to create the local `./tools` directory before returning it as the fallback tools root

**Checkpoint**: User Story 2 should be fully functional and independently verifiable.

---

## Phase 5: User Story 3 - Report Tool Path Failures Clearly (Priority: P3)

**Goal**: If the preferred or fallback tools folder cannot be used, current flows show a clear error instead of failing silently.

**Independent Test**: Simulate an unreadable `~/.pi/tools` or non-writable local install folder and confirm the error is visible and descriptive.

### Tests for User Story 3 (REQUIRED)

- [X] T008 [P] [US3] Add unit coverage in `tests/unit/tools-root-errors.test.ts` for inaccessible `~/.pi/tools` and failed local `./tools` creation

### Implementation for User Story 3

- [X] T009 [US3] Add descriptive error messages in `src/tools.ts` for unreadable preferred paths and failed local fallback creation
- [X] T010 [US3] Propagate tool-root errors through `src/tools-bootstrap.ts` so startup notifications surface the failure to the user

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Keep docs and baseline checks aligned with the new fallback rule

- [X] T011 [P] Update `README.md` to document the `~/.pi/tools` preference, the `./tools` fallback, and the existing `TALK_PI_TOOLS_DIR` override
- [X] T012 [P] Review `tests/unit/tools.test.ts` and align baseline assertions with the new tool-path precedence rules

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational - no dependency on other stories
- **US2 (P2)**: Can start after Foundational - no dependency on other stories
- **US3 (P3)**: Can start after Foundational - may rely on shared resolver behavior but stays independently testable

### Parallel Opportunities

- T001 can run in parallel with other setup planning tasks
- T004, T006, and T008 can be written in parallel because each targets a separate test file
- T011 and T012 can run in parallel because they touch different files
- Story implementation should remain sequential within the shared `src/tools.ts` changes to avoid conflicting edits

---

## Parallel Example: User Story 1

```bash
Task: "Add unit coverage in tests/unit/tools-root-preference.test.ts for preferring ~/.pi/tools over local ./tools"
Task: "Update src/tools.ts so the resolved tools root switches to ~/.pi/tools whenever ~/.pi exists"
```

## Parallel Example: User Story 2

```bash
Task: "Add unit coverage in tests/unit/tools-root-creation.test.ts for creating and selecting ./tools when ~/.pi is absent"
Task: "Extend src/tools.ts to create the local ./tools directory before returning it as the fallback tools root"
```

## Parallel Example: User Story 3

```bash
Task: "Add unit coverage in tests/unit/tools-root-errors.test.ts for inaccessible ~/.pi/tools and failed local ./tools creation"
Task: "Propagate tool-root errors through src/tools-bootstrap.ts so startup notifications surface the failure to the user"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Confirm `~/.pi/tools` is chosen when both paths exist
5. Demo/release if ready

### Incremental Delivery

1. Setup + Foundational → shared resolver behavior is ready
2. Add User Story 1 → precedence rule works for existing users (MVP)
3. Add User Story 2 → fresh installs create and use local `./tools`
4. Add User Story 3 → failures become visible and descriptive
5. Finish with docs and baseline test alignment

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundation is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Polish tasks can run while story code is being reviewed

---

## Notes

- [P] tasks = different files, no dependency on incomplete work
- [Story] labels map tasks to specific user stories for traceability
- Every behavior change includes tests before implementation
- Keep each story independently testable and shippable
- Confirm all task lines use the required checklist format: checkbox, ID, optional [P], optional [US#], description, and file path
