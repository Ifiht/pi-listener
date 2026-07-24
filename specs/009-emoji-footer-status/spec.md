# Feature Specification: Emoji Footer Status

**Feature Branch**: `[009-emoji-footer-status]`  
**Created**: 2026-05-25  
**Status**: Draft  
**Input**: User description: "Increase the footer status text. First it must be | Talk-Pi is ... emoji. Implement a beautiful with emoji status to represent Talk-Pi status. Don´t need to put the name of the files. But status such as Ready, Listen, Thinking, Talking is nice and important to have to facilitate"

## Clarifications

### Session 2026-05-25
- Q: Which additional footer status mappings should we show? → A: Muted, Error, and No speech detected.
- Q: What should the voice-processing status order be around Talking? → A: Use Transcribing while audio is being converted, Thinking while the LLM processes, then Talking during playback.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Clear Status at a Glance (Priority: P1)

As a user, I want the footer to begin with a clear, friendly phrase and emoji so I can immediately understand what Talk-Pi is doing.

**Why this priority**: The footer is the most visible place to communicate current app state, so this is the core user value.

**Independent Test**: Open the app and verify the footer always follows the `| Talk-Pi: Status Emoji |` format.

**Acceptance Scenarios**:

1. **Given** the app is idle, **When** the footer is shown, **Then** it shows `| Talk-Pi: Ready` with a visible emoji and closing pipe.
2. **Given** the app is in any supported mode, **When** the footer is shown, **Then** it presents a readable status label and emoji inside the pipe-delimited footer.

---

### User Story 2 - Status Changes Reflect App Mode (Priority: P2)

As a user, I want the footer status to change when I start recording, transcribing, or listening to playback so I can tell what is happening without guessing.

**Why this priority**: Mode changes are the moments users need the most feedback.

**Independent Test**: Trigger recording, transcription, processing, playback, mute, and error/no-speech flows and confirm the footer updates to Listen, Transcribing, Thinking, Talking, Muted, Error, and No speech detected at the right moments.

**Acceptance Scenarios**:

1. **Given** the user starts voice input, **When** recording begins, **Then** the footer changes to a Listen-style status with an appropriate emoji.
2. **Given** the audio has finished recording, **When** it is being transcribed, **Then** the footer shows a Transcribing-style status with an appropriate emoji.
3. **Given** the transcript is ready and the LLM is processing the reply, **When** that work is underway, **Then** the footer shows a Thinking-style status with an appropriate emoji.
4. **Given** playback is muted, **When** the footer is shown, **Then** it shows a Muted status with an appropriate emoji.
5. **Given** playback or capture encounters an error, **When** the footer is shown, **Then** it shows an Error status with an appropriate emoji.
6. **Given** speech input finishes with no detected speech, **When** the result is shown, **Then** the footer briefly shows a No speech detected status with an appropriate emoji.
7. **Given** the app is speaking a reply, **When** playback is active, **Then** the footer shows a Talking-style status with an appropriate emoji.

---

### User Story 3 - Readable in Tight Spaces (Priority: P3)

As a user with a narrow terminal or smaller window, I want the footer status to remain understandable even when space is limited.

**Why this priority**: It protects the experience on smaller screens without blocking the main value.

**Independent Test**: Resize the terminal to a narrow width and confirm the status still communicates the current state clearly.

**Acceptance Scenarios**:

1. **Given** the terminal is narrow, **When** the footer is displayed, **Then** the core phrase and current status remain understandable.
2. **Given** the footer cannot fit everything on one line, **When** space is constrained, **Then** the status still preserves the current state meaning.

---

### Edge Cases

- What happens when the app enters an unexpected or temporary error state?
- How does the footer behave when the terminal is too narrow for the full phrase?
- What happens if status changes happen quickly in succession?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The footer MUST use the phrase `Talk-Pi:` in a pipe-delimited footer format.
- **FR-002**: The footer MUST display the current status label before the emoji.
- **FR-003**: The footer MUST support at least the statuses Ready, Listen, Transcribing, Thinking, Talking, Muted, Error, and No speech detected.
- **FR-004**: The footer MUST update when the app changes state so users can see the current mode without manual refresh.
- **FR-005**: The footer MUST keep the current status readable in narrow terminal widths.
- **FR-006**: The footer MUST preserve the meaning of the current status even if the display must shorten or wrap.
- **FR-007**: The footer MUST use consistent status wording across the app for the supported states.

### Key Entities *(include if data involved)*

- **Footer Status**: The visible text shown at the bottom of the app, combining the leading phrase, status label, and emoji.
- **Status State**: The current user-facing mode of the app, such as Ready, Listen, Thinking, Talking, Muted, Error, or No speech detected.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of supported app states show a footer in the `| Talk-Pi: Status Emoji |` format.
- **SC-002**: In manual testing of the eight supported states, each state is recognizable from the footer alone within 2 seconds.
- **SC-003**: In a narrow terminal, at least 95% of testers can still identify the current app state from the footer.
- **SC-004**: Users can distinguish Ready, Listen, Thinking, Talking, Muted, Error, and No speech detected without opening any other screen.

## Assumptions

- The feature affects the visible footer/status area only and does not change the app’s core voice behavior.
- The app already knows when it is ready, listening, transcribing, thinking, talking, muted, in error, or has no speech detected.
- Existing shortcuts and workflows remain unchanged.
- A concise fallback status may be used for exceptional states if needed.
