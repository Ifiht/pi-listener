# Feature Specification: Mute Extension Menu

**Feature Branch**: `006-mute-extension`

**Created**: 2026-05-24

**Status**: Draft

**Input**: User description: "implement a menu where I can mute and unmute the extension."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Toggle Mute from the Menu (Priority: P1)

As a user, I can open the extension menu and switch the extension between muted and unmuted states from one place.

**Why this priority**: This is the core user need: a simple, visible control to silence or restore the extension without leaving the terminal session.

**Independent Test**: Open the menu, choose mute, confirm the extension becomes muted, then choose unmute and confirm the extension becomes active again.

**Acceptance Scenarios**:

1. **Given** the extension is active, **When** the user opens the menu and selects mute, **Then** the extension switches to muted mode.
2. **Given** the extension is muted, **When** the user opens the menu and selects unmute, **Then** the extension switches back to active mode.

---

### User Story 2 - Silent While Muted (Priority: P2)

When the extension is muted, spoken output stops and new spoken replies do not play until the user unmutes it.

**Why this priority**: Muting only matters if it reliably silences the extension while preserving normal text-based work.

**Independent Test**: Mute the extension, trigger a spoken reply, and confirm no audio plays while the visible text response remains available.

**Acceptance Scenarios**:

1. **Given** the extension is muted, **When** a spoken reply is produced, **Then** no new audio is heard.
2. **Given** spoken audio is already playing, **When** the user mutes the extension, **Then** playback stops promptly and later replies remain silent until unmuted.

---

### User Story 3 - Clear Mute Status (Priority: P3)

The user can tell whether the extension is currently muted and can unmute it without guessing.

**Why this priority**: A mute control is only useful if the current state is easy to recognize and recover from.

**Independent Test**: Open the menu while muted and while unmuted, and confirm the current state is clearly shown in both cases.

**Acceptance Scenarios**:

1. **Given** the extension is muted, **When** the user opens the menu, **Then** the muted state is clearly visible.
2. **Given** the extension is active, **When** the user opens the menu, **Then** the unmuted state is clearly visible.

### Edge Cases

- The user mutes the extension while audio is already playing: playback should stop promptly.
- The user opens the menu repeatedly: the mute state shown should always match the current state.
- The user unmutes the extension after a long muted period: new spoken replies should resume normally.
- Muting should not affect text replies, typing, or transcript insertion.

## Requirements *(mandatory)*

Every requirement MUST be testable and traceable to at least one acceptance scenario or automated test.

### Functional Requirements

- **FR-001**: System MUST provide a menu control that allows the user to mute the extension.
- **FR-002**: System MUST provide a menu control that allows the user to unmute the extension.
- **FR-003**: System MUST clearly show whether the extension is currently muted or unmuted.
- **FR-004**: System MUST suppress spoken output while the extension is muted.
- **FR-005**: System MUST stop any currently playing spoken output when the user mutes the extension.
- **FR-006**: System MUST keep text responses, typing, and other non-audio behaviors available while muted.
- **FR-007**: System MUST resume spoken output for future replies after the user unmutes the extension.
- **FR-008**: System MUST keep the mute state consistent across menu openings during the same session.

### Key Entities *(include if feature involves data)*

- **Mute State**: The current audio state of the extension, either muted or unmuted.
- **Extension Menu**: The user-facing menu that exposes mute and unmute actions.
- **Spoken Output**: Audio produced by the extension in response to assistant replies.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can mute or unmute the extension from the menu in no more than 2 menu interactions.
- **SC-002**: In 100% of muted test cases, new spoken replies produce no audible output.
- **SC-003**: In 100% of mute actions during playback, the current audio stops within 1 second.
- **SC-004**: In 100% of sessions, the current mute state is visible whenever the menu is opened.
- **SC-005**: After unmuting, spoken replies resume for the next eligible assistant response in the same session.

## Assumptions

- The menu is available within the existing terminal interface during a normal session.
- Muting affects spoken audio only and does not disable text responses or transcript insertion.
- The mute state applies to the current session and does not need to persist after the app closes.
- The user expects mute to silence ongoing playback promptly, not only future replies.
