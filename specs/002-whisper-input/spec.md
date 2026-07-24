# Feature Specification: Whisper Text Input

**Feature Branch**: `002-whisper-input`

**Created**: 2026-05-24

**Status**: Draft

**Input**: User description: "Excelente. Agora, eu quero que o .wav tenha um reconhecimento e transfomado em input no tui. Considere utilizar o OpenAi Whisper de forma gratuita."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Auto Transcribe Recording (Priority: P1)

As a user, I want a finished voice recording to be recognized and inserted into the TUI input area so I can review or edit it before sending.

**Why this priority**: This is the main value of voice capture; it turns audio into usable text inside the app.

**Independent Test**: Record a short phrase, finish the recording, and confirm the recognized text appears in the active TUI input buffer.

**Acceptance Scenarios**:

1. **Given** a voice recording has finished successfully, **When** recognition completes, **Then** the recognized text appears in the active TUI input area.
2. **Given** the active TUI input already contains text, **When** a new recording is recognized, **Then** the new text is inserted without sending the message automatically.

---

### User Story 2 - Recognition Feedback and Recovery (Priority: P2)

As a user, I want clear feedback when recognition succeeds or fails so I know whether the text was inserted.

**Why this priority**: Clear feedback helps users trust the flow and recover when audio or recognition fails.

**Independent Test**: Trigger successful and failed recognition paths and verify the UI shows the correct result message.

**Acceptance Scenarios**:

1. **Given** recognition succeeds, **When** the transcript is inserted, **Then** the UI shows a success message.
2. **Given** recognition fails or audio is empty, **When** processing ends, **Then** the UI shows a clear error or no-speech message and does not insert garbage text.

### Edge Cases

- What happens when audio is silent or too short to recognize?
- What happens when recognition returns partial or low-confidence text?
- What happens when the TUI already contains user-typed text at the cursor?
- How does the system behave when recognition takes longer than expected?
- What happens when the recording file cannot be read?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST recognize a completed voice recording and convert it into text.
- **FR-002**: System MUST insert recognized text into the active TUI input buffer.
- **FR-003**: System MUST keep the message unsent so the user can review and edit it before sending.
- **FR-004**: System MUST preserve existing input text when inserting recognized text.
- **FR-005**: System MUST show a clear success message when recognition is inserted into input.
- **FR-006**: System MUST show a clear no-speech or error message when recognition produces no usable text.
- **FR-007**: System MUST avoid inserting junk text when recognition fails.
- **FR-008**: System MUST use a free speech recognition approach with no required per-use payment.

### Key Entities *(include if feature involves data)*

- **Voice Recording**: Finished audio content captured from the microphone and ready for recognition.
- **Transcript**: Text recognized from the audio recording.
- **TUI Input Buffer**: Active text area where the user edits the message before sending.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can turn a finished recording into editable input in under 10 seconds for 90% of successful runs.
- **SC-002**: At least 95% of successful recognition runs place text into the correct TUI input area.
- **SC-003**: 90% of test users can continue editing recognized text before sending without losing existing input.
- **SC-004**: Failed or silent audio never inserts unreadable junk text in acceptance testing.

## Assumptions

- Speech recognition uses a free Whisper-compatible approach with no per-use fee.
- Recognition can run locally or with a free model download, but no paid API is required.
- The user wants transcription inserted into the current TUI input area, not auto-sent.
- Existing keyboard and microphone capture flow already provides a finished audio file.
