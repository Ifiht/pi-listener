# Feature Specification: Esc Stop Playback

**Feature Branch**: `[005-esc-stop-playback]`

**Created**: 2026-05-24

**Status**: Draft

**Input**: User description: "Stop the response playback when the user press esc."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Stop Spoken Reply Playback (Priority: P1)

As a user listening to a spoken assistant response, I can press Esc to stop the current playback immediately so I can continue reading or working without audio.

**Why this priority**: This is the core value of the feature and gives the user direct control over unwanted or overly long playback.

**Independent Test**: Start spoken reply playback, press Esc, and confirm the audio stops while the visible assistant message stays on screen.

**Acceptance Scenarios**:

1. **Given** a spoken reply is currently playing, **When** the user presses Esc, **Then** the audio stops and no more speech from that reply is heard.
2. **Given** a spoken reply was stopped with Esc, **When** the user looks at the conversation, **Then** the assistant text remains visible.
3. **Given** more spoken replies are waiting to play, **When** the user presses Esc, **Then** the current playback stops and the remaining queued spoken replies do not continue automatically.

---

### User Story 2 - Ignore Esc When Nothing Is Playing (Priority: P2)

As a user, I can press Esc when no spoken response is active without causing errors or disrupting the current terminal work.

**Why this priority**: Esc should feel safe and predictable when playback is not active.

**Independent Test**: Press Esc while no assistant audio is playing and confirm nothing visible changes except normal terminal behavior.

**Acceptance Scenarios**:

1. **Given** no spoken reply is playing, **When** the user presses Esc, **Then** the current conversation stays unchanged and no error is shown.
2. **Given** the user is typing in the terminal and no spoken reply is playing, **When** Esc is pressed, **Then** the feature does not remove text or send a message.

### Edge Cases

- Esc is pressed multiple times while playback is stopping: only the first press should matter.
- Esc is pressed while playback is paused or already finished: no visible disruption should occur.
- Esc is pressed while a reply is queued but not yet audible: the queued spoken reply should not start automatically.
- The user presses F9 or F10 while spoken playback is active: the current audio should stop before voice capture continues.
- The visible assistant message must remain even if speech output is stopped.
- If playback stops due to Esc, the user should still be able to continue using the terminal immediately.

## Requirements *(mandatory)*

Every requirement MUST be testable and traceable to at least one acceptance scenario or automated test.

### Functional Requirements

- **FR-001**: System MUST stop the currently playing spoken assistant response when the user presses Esc.
- **FR-002**: System MUST prevent any remaining queued spoken assistant responses from continuing automatically after Esc stops playback.
- **FR-003**: System MUST keep the assistant message visible after spoken playback is stopped.
- **FR-004**: System MUST ignore Esc for this feature when no spoken assistant response is playing.
- **FR-005**: System MUST leave the terminal input usable immediately after playback is stopped.
- **FR-006**: System MUST not remove, modify, or resend the visible assistant text when playback is stopped.
- **FR-007**: System MUST stop the current spoken response before starting voice capture when the user presses F9 or F10.

### Key Entities *(include if feature involves data)*

- **Spoken Response**: The audible version of an assistant reply that may be playing to the user.
- **Playback Queue**: The ordered set of spoken replies waiting to be heard.
- **Conversation Message**: The visible assistant text shown in the terminal.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In at least 95% of test runs, spoken playback stops within 1 second of the user pressing Esc.
- **SC-002**: In 100% of stop cases, the visible assistant message remains on screen.
- **SC-003**: In 100% of stop cases, queued spoken replies do not continue automatically.
- **SC-004**: In 100% of idle cases, pressing Esc causes no playback-related error or visible disruption.
- **SC-005**: At least 90% of users can stop a spoken reply on the first attempt without needing help.

## Assumptions

- Esc is used to stop spoken assistant playback only when audio is active.
- Stopping playback should halt the current audio and any remaining queued spoken output for that turn.
- The visible assistant message stays in the conversation history and is not deleted.
- If no spoken playback is active, Esc has no playback-related effect.
