# Feature Specification: Spoken Reply Playback

**Feature Branch**: `003-spoken-reply-playback`

**Created**: 2026-05-24

**Status**: Draft

**Input**: User description: "implementa a integração com o Pipe para que a resposta do LLM seja convertida em o WAV e seja tocado na sequência pela própria interface do terminal user interface."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Automatic Spoken Replies (Priority: P1)

When the LLM finishes a reply, the app turns that reply into speech and plays it automatically inside the terminal experience.

**Why this priority**: This is core value. User gets spoken answer without leaving terminal or triggering extra steps.

**Independent Test**: Send a prompt and confirm the LLM reply is spoken automatically, in order, without manual export or external player.

**Acceptance Scenarios**:

1. **Given** a normal LLM reply, **When** the reply arrives, **Then** the app starts spoken playback automatically.
2. **Given** a spoken reply is already playing, **When** the reply finishes, **Then** playback stops cleanly and the text reply remains available in UI.

---

### User Story 2 - No Feedback Loop During Recording (Priority: P2)

When user is recording voice input, spoken replies are held back so app does not speak over active microphone capture.

**Why this priority**: Prevents the app from hearing itself and turning spoken output into new input.

**Independent Test**: Start recording, receive a response, and confirm no playback starts until recording ends.

**Acceptance Scenarios**:

1. **Given** microphone capture is active, **When** an LLM reply arrives, **Then** playback is paused or queued instead of speaking immediately.
2. **Given** recording ends, **When** a queued reply exists, **Then** playback resumes automatically in order.

---

### User Story 3 - Graceful Audio Failures (Priority: P3)

If speech generation or playback fails, user still sees text reply and the app keeps working.

**Why this priority**: Audio must not block text workflow or crash terminal session.

**Independent Test**: Simulate audio generation failure and confirm text reply still appears and next replies can still be processed.

**Acceptance Scenarios**:

1. **Given** speech generation fails, **When** the LLM reply finishes, **Then** the text response remains visible and no broken audio is played.
2. **Given** playback device is unavailable, **When** a reply arrives, **Then** app reports failure clearly and continues functioning.

### Edge Cases

- Response is empty or whitespace only: do not generate silent audio job.
- Response is very long: speak it in order without overlapping chunks.
- Multiple replies arrive quickly: queue them, do not overlap playback.
- Playback is interrupted by new recording: suspend speech until recording is done.
- Audio output is unavailable: keep text reply visible and skip playback safely.

## Requirements *(mandatory)*

Every requirement MUST be testable and traceable to at least one acceptance scenario or automated test.

### Functional Requirements

- **FR-001**: System MUST automatically convert each completed LLM text reply into spoken audio.
- **FR-002**: System MUST play spoken reply in the terminal experience without requiring a manual export step.
- **FR-003**: System MUST preserve text reply visibility while audio playback occurs.
- **FR-004**: System MUST prevent spoken playback from starting while microphone recording is active.
- **FR-005**: System MUST queue or defer spoken output that arrives during active recording and resume in arrival order after recording ends.
- **FR-006**: System MUST ignore empty or whitespace-only replies for spoken playback.
- **FR-007**: System MUST handle speech generation or playback failures without stopping text response flow.
- **FR-008**: System MUST surface a clear user-facing notice when spoken playback cannot start.
- **FR-009**: System MUST keep following replies processable after a failed speech attempt.

### Key Entities *(include if feature involves data)*

- **LLM Reply**: Text answer produced by the assistant and eligible for spoken playback.
- **Spoken Reply**: Audio version of an LLM reply that is ready for playback.
- **Playback Queue**: Ordered set of spoken replies waiting to be played.
- **Recording State**: Whether microphone capture is active, paused, or idle for the purpose of speech blocking.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 95% of short replies, spoken audio starts automatically within 3 seconds after reply completion.
- **SC-002**: 100% of replies generated during active recording are withheld until recording ends.
- **SC-003**: 95% of users can complete a prompt-and-hear flow without any manual audio action.
- **SC-004**: In test runs with 10 consecutive replies, no two spoken outputs overlap.
- **SC-005**: After an audio failure, text replies continue to appear and the next reply can still be processed in the same session.

## Assumptions

- Users want spoken output for every normal assistant reply unless reply is empty.
- Local sound output is available on the machine running the terminal app.
- A local speech engine is available or installable on the user machine.
- Text reply remains the source of truth even when speech playback fails.
- First version targets a single active session and one playback queue per session.
