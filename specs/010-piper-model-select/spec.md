# Feature Specification: Voice Language Selection

**Feature Branch**: `[010-piper-model-select]`  
**Created**: 2026-05-25  
**Status**: Draft  
**Input**: User description: "I’d like to create a feature in /talk-pi to select other Piper models. I’d like to implement an English output option selectable in the /talk-pi menu."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Choose Voice Language from Menu (Priority: P1)

As a user, I want to choose a voice language from the `/talk-pi` menu so I can switch the assistant voice without editing configuration manually.

**Why this priority**: Voice model choice is the core value of the feature and unlocks the new menu workflow.

**Independent Test**: Open `/talk-pi`, select a different voice language, and confirm the chosen language becomes the active voice for future replies.

**Acceptance Scenarios**:

1. **Given** multiple voice languages are available, **When** the user opens `/talk-pi` and selects a language, **Then** the selected language becomes the active voice for assistant speech.
2. **Given** a voice language was selected previously, **When** the user returns to `/talk-pi`, **Then** the current selection is shown as the active choice.

---

### User Story 2 - Choose English Voice (Priority: P2)

As a user, I want an English voice option in the `/talk-pi` menu so I can make the assistant speak in English when I need it.

**Why this priority**: English output is a common use case and should be available as a clear menu choice.

**Independent Test**: Open `/talk-pi`, choose English voice, and confirm future spoken replies use the English option.

**Acceptance Scenarios**:

1. **Given** the user opens `/talk-pi`, **When** they choose English voice, **Then** the menu shows English as the selected voice language.
2. **Given** English voice is selected, **When** the assistant speaks again, **Then** the spoken voice uses the English option consistently.

---

### User Story 3 - Preserve Current Voice Language Across Sessions (Priority: P3)

As a user, I want my voice language choice to remain available the next time I use Talk-Pi so I do not need to reselect it every session.

**Why this priority**: Remembering the previous choice reduces repeated setup work and makes the feature feel complete.

**Independent Test**: Select a voice language, restart Talk-Pi, and confirm the same choice is still available or already active.

**Acceptance Scenarios**:

1. **Given** a voice language was made earlier, **When** the app is restarted, **Then** the previous selection is still available.
2. **Given** the user selects a different language later, **When** the app is restarted again, **Then** the updated selection remains available.

---

### Edge Cases

- What happens when no English Piper model is installed?
- What happens when the selected model is unavailable at runtime?
- How does the menu behave if only one model is installed?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The `/talk-pi` menu MUST let the user select a voice language.
- **FR-002**: The `/talk-pi` menu MUST show which voice language is currently active.
- **FR-003**: The `/talk-pi` menu MUST provide an English voice option.
- **FR-004**: The selected voice language MUST remain visible in the menu so the user can confirm the current setting.
- **FR-005**: The active voice language MUST be applied to future assistant speech and Whisper transcription after selection.
- **FR-006**: The system MUST handle the case where the requested English voice is unavailable by presenting a usable fallback or a clear error.
- **FR-007**: The selected voice language SHOULD remain available in future sessions.

### Key Entities *(include if data involved)*

- **Voice Language**: The user-facing language/voice selection shown in `/talk-pi`, such as Portuguese or English.
- **Piper Model**: The voice model mapped to the selected voice language.
- **Voice Preference**: The user’s saved selection for voice language and model behavior.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can switch voice languages from `/talk-pi` without editing configuration files.
- **SC-002**: Users can select English voice from `/talk-pi` in a single menu flow.
- **SC-003**: At least 95% of users in testing can identify the active voice choice from the menu before confirming it.
- **SC-004**: A previously selected voice choice remains available in the next session for at least 90% of users in testing.

## Assumptions

- The app may have more than one Piper model available on disk.
- English voice means the assistant should speak using an English voice option when available.
- Existing `/talk-pi` menu behavior remains the place where voice options are managed.
- If a preferred voice is missing, the app should present a safe fallback rather than fail silently.
- Whisper transcription language follows selected Voice Language.
