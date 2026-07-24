# Tasks: README Enhancement

**Input**: Design documents from `/specs/012-improve-readme/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not requested; this is docs-only work.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare source material and confirm factual inputs for README rewrite

- [X] T001 Review `README.md`, `package.json`, and `specs/012-improve-readme/research.md` to confirm current facts, install steps, config names, and publish details

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish README structure and shared wording that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Rebuild `README.md` outline with clear sections for overview, install, requirements, setup, configuration, defaults, platform notes, and publish info
- [X] T003 Tighten opening summary and requirements wording in `README.md` so new readers understand Talk-Pi purpose and prerequisites quickly

**Checkpoint**: README structure and core framing ready - story-specific content can now be refined

---

## Phase 3: User Story 1 - Understand Project Fast (Priority: P1) 🎯 MVP

**Goal**: New visitors can understand what Talk-Pi does, what they need, and how to begin

**Independent Test**: A first-time reader can state Talk-Pi purpose, install path, and required tools after reading top sections of `README.md`

### Implementation for User Story 1

- [X] T004 [US1] Rewrite the top of `README.md` to state Talk-Pi value, main flow, and first-step install guidance in plain language
- [X] T005 [US1] Update `README.md` requirements and setup sections to clearly list Node.js version, bundled tools, and required model locations

**Checkpoint**: User Story 1 should be fully understandable on its own

---

## Phase 4: User Story 2 - Find Usage Details (Priority: P2)

**Goal**: Existing users can quickly find commands, configuration, and defaults

**Independent Test**: A returning user can locate the main voice workflow, environment variables, and default values without scanning the whole file

### Implementation for User Story 2

- [X] T006 [US2] Add a clear usage flow section in `README.md` covering `/talk-pi`, push-to-talk, transcription, and spoken replies
- [X] T007 [US2] Replace the configuration and defaults sections in `README.md` with a readable variable list and defaults table

**Checkpoint**: User Story 2 should be independently readable and useful

---

## Phase 5: User Story 3 - Publish or Maintain Package (Priority: P3)

**Goal**: Maintainers and platform users can find release and OS-specific guidance fast

**Independent Test**: A maintainer can find publish steps, and Windows or Linux/macOS users can find their platform notes in `README.md`

### Implementation for User Story 3

- [X] T008 [US3] Revise `README.md` platform notes so Windows and Linux/macOS guidance are separated and easy to scan
- [X] T009 [US3] Add or refine `README.md` publish instructions and maintainer notes so release steps are easy to find

**Checkpoint**: User Story 3 should complete maintainer and platform guidance

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, consistency pass, and verification of documentation quality

- [X] T010 Review `README.md` for consistency, concise wording, section order, and matching defaults across all sections
- [X] T011 Validate `README.md` against `specs/012-improve-readme/checklists/requirements.md` criteria and record any remaining gaps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after User Story 1 if file rewrite is sequential
- **User Story 3 (P3)**: Can start after User Story 2 if file rewrite is sequential

### Within Each User Story

- Story content should follow section order already established in Phase 2
- Keep wording aligned with research.md decisions
- Each story must remain readable on its own after the rewrite

### Parallel Opportunities

- Setup review task can be done alone before editing
- If split into separate docs later, platform notes and publish text could be drafted independently
- In current single-file README scope, most edit tasks are sequential to avoid conflicts

---

## Parallel Example: User Story 1

```bash
Task: "Rewrite the top of README.md to state Talk-Pi value, main flow, and first-step install guidance in plain language"
Task: "Update README.md requirements and setup sections to clearly list Node.js version, bundled tools, and required model locations"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Verify first-time reader can understand Talk-Pi quickly
5. If ready, continue with remaining stories

### Incremental Delivery

1. Complete Setup + Foundational → README structure ready
2. Add User Story 1 → Test independently → Share MVP
3. Add User Story 2 → Test independently → Improve day-to-day findability
4. Add User Story 3 → Test independently → Improve maintainer and platform guidance
5. Finish with Polish phase and checklist review

### Parallel Team Strategy

With multiple contributors:

1. One contributor reviews factual inputs in `README.md` and `package.json`
2. One contributor drafts section structure in `README.md`
3. One contributor refines usage/config wording in `README.md`
4. One contributor polishes platform and publish notes in `README.md`

