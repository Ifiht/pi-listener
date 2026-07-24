# Feature Specification: F5 Auto Insert

**Feature Branch**: `004-f5-auto-insert`

**Created**: 2026-05-24

**Status**: Draft

**Input**: User description: "É possível criar uma funcionalidade que seria como se eu eu apertar o f10 pela segunda vez que o texto transcrito já seja inserido no terminal automaticamente sem precisar apertar o enter? A funcionalidade do f10, pode manter, mas eu queria o input após transcrição automático se eu apertasse a tecla f5 duas vezes como a f10."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - F5 Double Press Inserts Transcript (Priority: P1)

When the user double-presses F5 after speaking, the recognized text is inserted into the terminal input automatically so it can be reviewed before sending.

**Why this priority**: This is the main user goal: a faster path from speech to editable text without extra confirmation.

**Independent Test**: Double-press F5, finish speaking, and confirm the transcript appears in the active input buffer without sending the message.

**Acceptance Scenarios**:

1. **Given** the terminal is ready for voice input, **When** the user double-presses F5 and finishes speaking, **Then** the transcript appears in the active input buffer.
2. **Given** the transcript was inserted, **When** the user reviews the text, **Then** the message remains unsent until the user chooses to send it.

---

### User Story 2 - Keep F10 Behavior Unchanged (Priority: P2)

The existing F10 voice flow continues to work the same way while the new F5 path is added.

**Why this priority**: Users already rely on F10, so the new feature must not break the current workflow.

**Independent Test**: Use F10 exactly as before and confirm the same voice capture and transcript insertion behavior still happens.

**Acceptance Scenarios**:

1. **Given** a user is using the current voice workflow, **When** they double-press F10, **Then** the same transcript insertion behavior continues to work.
2. **Given** both keys are available, **When** the user chooses F5 instead of F10, **Then** the transcript insertion outcome is the same.

---

### User Story 3 - No Accidental Send or Junk Text (Priority: P3)

If speech recognition fails or produces no useful text, nothing extra is inserted and the message is not sent automatically.

**Why this priority**: The terminal input must stay clean and editable even when recognition is empty or fails.

**Independent Test**: Trigger a no-speech or error case and confirm the input buffer stays unchanged and unsent.

**Acceptance Scenarios**:

1. **Given** speech recognition returns no usable text, **When** processing finishes, **Then** no junk text appears in the input buffer.
2. **Given** recognition fails, **When** processing ends, **Then** the input buffer stays unchanged and the user can keep typing.

### Edge Cases

- Double-press happens too slowly: treat it as a normal keypress sequence, not a voice command.
- F5 and F10 are pressed close together: only one voice action should be taken.
- Recognition returns whitespace or punctuation only: do not insert it.
- Existing typed text is already in the input: keep it intact when inserting transcript.
- User sends the message manually after editing: the feature must not auto-send on its own.

## Requirements *(mandatory)*

Every requirement MUST be testable and traceable to at least one acceptance scenario or automated test.

### Functional Requirements

- **FR-001**: System MUST start voice capture when the user double-presses F5.
- **FR-002**: System MUST insert the recognized transcript into the active terminal input after capture completes.
- **FR-003**: System MUST keep the transcript editable in the input buffer and MUST NOT send it automatically.
- **FR-004**: System MUST preserve any existing typed input when inserting a transcript.
- **FR-005**: System MUST keep the existing F10 voice workflow available.
- **FR-006**: System MUST treat F5 and F10 as separate shortcuts that lead to the same transcript insertion outcome.
- **FR-007**: System MUST ignore empty, whitespace-only, or failed recognition results.
- **FR-008**: System MUST keep the input buffer unchanged when recognition produces no usable text.
- **FR-009**: System MUST provide a clear user-facing status during voice capture and after transcript insertion.

### Key Entities *(include if feature involves data)*

- **Voice Shortcut**: A keyboard action that starts or completes voice capture.
- **Transcript**: The recognized text produced from recorded speech.
- **Terminal Input Buffer**: The current editable message area shown to the user.
- **Capture Result**: The outcome of speech processing, including success, no-speech, or failure.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can trigger transcript insertion with F5 double-press in 95% of test runs.
- **SC-002**: In 100% of successful transcriptions, the text appears in the input buffer without sending the message.
- **SC-003**: In 100% of no-speech or failure cases, no junk text is inserted.
- **SC-004**: The existing F10 voice workflow remains available and unchanged in user-visible outcome.
- **SC-005**: Users can edit the inserted transcript before sending in every successful run.

## Assumptions

- Users want an alternate shortcut for the same voice-to-text workflow already available on F10.
- The transcript should be inserted for review, not auto-sent.
- Existing typed content must remain intact when transcript text is inserted.
- The feature targets the current terminal session and one active input buffer at a time.
