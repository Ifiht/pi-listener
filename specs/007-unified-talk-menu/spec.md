# Feature Specification: Unified Talk Menu

**Feature Branch**: `007-unified-talk-menu`

**Created**: 2026-05-24

**Status**: Draft

**Input**: User description: "Let´s unify /talk-pi and /talk-pi-menu. The command /talk-pi will open the menu. There will be a Status option in /talk-pi menu. The option to Mute/Unmute will be moved to this unified menu. The old /talk-pi-menu won´t be necessary anymore."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Open the Unified Menu (Priority: P1)

As a user, I can open the extension menu with `/talk-pi` and find both status and mute controls in one place.

**Why this priority**: This removes the split between two commands and gives users a single, predictable place to manage the extension.

**Independent Test**: Run `/talk-pi` and confirm the unified menu opens and shows the available controls.

**Acceptance Scenarios**:

1. **Given** the extension is available, **When** the user runs `/talk-pi`, **Then** the unified menu opens.
2. **Given** the unified menu is open, **When** the user looks at the available actions, **Then** both Status and Mute/Unmute are visible.

---

### User Story 2 - View Current Status from the Menu (Priority: P2)

As a user, I can open the Status option from the unified menu and see the extension’s current state without leaving the menu flow.

**Why this priority**: Status is the main feedback path for confirming what the extension is doing right now.

**Independent Test**: Open `/talk-pi`, choose Status, and confirm the current state is shown clearly.

**Acceptance Scenarios**:

1. **Given** the menu is open, **When** the user selects Status, **Then** the current extension state is shown.
2. **Given** the extension state changes, **When** the user opens Status again, **Then** the updated state is shown.

---

### User Story 3 - Move Mute Controls Into the Unified Menu (Priority: P3)

As a user, I can mute or unmute the extension from the same `/talk-pi` menu instead of needing a separate command.

**Why this priority**: Mute control should remain easy to reach, but it no longer needs its own standalone menu entry.

**Independent Test**: Open `/talk-pi`, toggle mute, and confirm the menu reflects the new state.

**Acceptance Scenarios**:

1. **Given** the unified menu is open, **When** the user selects Mute, **Then** the extension becomes muted.
2. **Given** the unified menu is open and the extension is muted, **When** the user selects Unmute, **Then** the extension becomes unmuted.

### Edge Cases

- The menu is opened while audio is playing: the current state should still be visible.
- The menu is opened while the extension is muted: Mute should appear as Unmute.
- The user selects Status repeatedly: the displayed state should stay current.
- The old `/talk-pi-menu` command is no longer part of the primary user flow.

## Requirements *(mandatory)*

Every requirement MUST be testable and traceable to at least one acceptance scenario or automated test.

### Functional Requirements

- **FR-001**: System MUST open the unified extension menu when the user runs `/talk-pi`.
- **FR-002**: System MUST show Status and Mute/Unmute options in the `/talk-pi` menu.
- **FR-003**: System MUST display the current extension state when the user selects Status.
- **FR-004**: System MUST let the user mute the extension from the unified menu.
- **FR-005**: System MUST let the user unmute the extension from the unified menu.
- **FR-006**: System MUST keep the mute control and status control in the same menu flow.
- **FR-007**: System MUST no longer require `/talk-pi-menu` as a separate user-facing entry point.
- **FR-008**: System MUST keep the menu labels accurate when the extension state changes.

### Key Entities *(include if data involved)*

- **Unified Talk Menu**: The single menu opened by `/talk-pi` that contains status and mute controls.
- **Status View**: The menu option that shows the extension’s current state.
- **Mute State**: The current muted or unmuted state of the extension.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can reach the menu from `/talk-pi` in one command in 95% of test runs.
- **SC-002**: In 100% of menu opens, the menu shows both Status and Mute/Unmute options.
- **SC-003**: In 100% of verification runs, the Status option shows the current extension state correctly.
- **SC-004**: In 100% of verification runs, the mute action is available from the unified menu.
- **SC-005**: Users no longer need to remember or use a separate menu command to manage the extension.

## Assumptions

- `/talk-pi` becomes the primary command for the menu.
- The old `/talk-pi-menu` command is no longer part of the user-facing workflow.
- Status is shown as a readable summary of the current extension state.
- The unified menu keeps existing mute behavior intact while changing where it is accessed.
