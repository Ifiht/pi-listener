# Feature Specification: Recorder-Free Voice Capture

**Feature Branch**: `011-sox-to-decibri`

**Created**: 2026-05-26

**Status**: Draft

**Input**: User description: "Vamos trocar o sox pelo decibri"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Record Without Separate Recorder Setup (Priority: P1)

As a user, I can start and finish voice recording in Talk-Pi without installing or configuring separate recorder software first.

**Why this priority**: This removes the main setup blocker and makes voice input usable out of the box.

**Independent Test**: On a supported desktop machine, start voice input, speak a short phrase, stop recording, and confirm a usable audio recording is produced with no separate recorder setup step.

**Acceptance Scenarios**:

1. **Given** Talk-Pi is installed on a supported desktop platform, **When** the user starts voice input, **Then** recording begins without requiring separate recorder software.
2. **Given** a recording is in progress, **When** the user stops it, **Then** Talk-Pi produces a usable audio recording for the next step in the voice flow.

---

### User Story 2 - Keep Voice Flow Working Across Supported Platforms (Priority: P2)

As a user, I can use the same voice recording flow on supported desktop platforms without extra platform-specific setup.

**Why this priority**: Users should get the same voice experience on each supported desktop system.

**Independent Test**: Run the record-and-stop flow on each supported desktop platform and confirm the app captures microphone audio successfully.

**Acceptance Scenarios**:

1. **Given** Talk-Pi is running on a supported desktop platform, **When** the user records a short phrase, **Then** the app captures the audio successfully.
2. **Given** the user completes one recording, **When** they start another recording in the same session, **Then** the app is ready to capture again without extra setup.

---

### User Story 3 - Show Clear Capture Failures (Priority: P3)

As a user, I get a clear message when voice capture cannot start or finish, so I can try again.

**Why this priority**: Clear failure handling prevents confusion and keeps the voice flow recoverable.

**Independent Test**: Simulate missing microphone access or an unavailable input device and confirm Talk-Pi shows a clear error and remains usable.

**Acceptance Scenarios**:

1. **Given** microphone access is unavailable, **When** the user tries to record, **Then** Talk-Pi shows a clear error message.
2. **Given** a recording attempt fails, **When** the user tries again, **Then** the app is still ready for a new recording attempt.

### Edge Cases

- Microphone permission is denied before recording starts.
- Input device is missing, busy, or disconnected while recording is requested.
- User starts and stops recording very quickly.
- User performs many recordings in one session.
- Recording completes, but the next transcription step still needs a valid audio file.

## Requirements *(mandatory)*

Every requirement MUST be testable and traceable to at least one acceptance scenario or automated test.

### Functional Requirements

- **FR-001**: System MUST let users start voice recording without requiring separate recorder software to be installed.
- **FR-002**: System MUST stop voice recording when the user ends the capture action.
- **FR-003**: System MUST produce a usable audio recording for the next voice-flow step after each successful recording.
- **FR-004**: System MUST support the same voice recording flow on each supported desktop platform without user-specific setup.
- **FR-005**: System MUST show a clear, user-facing error when microphone access is unavailable or recording cannot start.
- **FR-006**: System MUST remain ready for a new recording attempt after a failed capture.
- **FR-007**: System MUST preserve existing voice-input behavior outside recording setup, including the normal handoff to transcription.

### Key Entities *(include if feature involves data)*

- **Voice Recording Session**: One user recording attempt, from start to stop.
- **Capture Source**: The microphone input used for a recording session.
- **Recording Error**: A user-visible failure that prevents capture from starting or completing.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In test runs on each supported desktop platform, 100% of normal record-and-stop flows work without any separate recorder installation step.
- **SC-002**: At least 95% of short voice recordings complete successfully on the first attempt in a controlled test run.
- **SC-003**: In all tested microphone-failure cases, users see a clear error and can attempt a new recording without restarting the app.
- **SC-004**: After 10 consecutive recordings in one session, each completed recording remains usable for the next voice-flow step.

## Assumptions

- Supported desktop platforms remain Windows, macOS, and Linux.
- Users still trigger voice recording with the existing Talk-Pi voice control flow.
- The transcription and playback steps after recording stay in place.
- The goal is to remove user-managed recorder setup, not to change the overall voice experience.
