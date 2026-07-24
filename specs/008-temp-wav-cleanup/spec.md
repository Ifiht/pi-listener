# Feature Specification: Temporary WAV Cleanup

**Feature Branch**: `008-temp-wav-cleanup`

**Created**: 2026-05-24

**Status**: Draft

**Input**: User description: "The wav files used in the process must be temporary files. Handle the life cicle of this wav files to avoid trash tmp wav files in user disk."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Temporary WAV Files Only (Priority: P1)

As a user, any WAV files created during assistant speech generation are temporary and are not meant to stay on disk after they are used.

**Why this priority**: This prevents the app from leaving behind audio files and keeps the user’s disk clean.

**Independent Test**: Trigger speech generation and confirm a temporary WAV file is created for the job, then confirm it is removed after use.

**Acceptance Scenarios**:

1. **Given** the app needs an audio file for speech, **When** the audio job is created, **Then** the file is treated as temporary.
2. **Given** the temporary audio file is no longer needed, **When** processing finishes, **Then** the file is removed from disk.

---

### User Story 2 - Clean Up After Success or Failure (Priority: P2)

As a user, temporary WAV files are removed whether speech playback succeeds, fails, or is interrupted.

**Why this priority**: Cleanup must happen in all outcomes, not only on the happy path.

**Independent Test**: Simulate successful playback, a failed playback, and an interrupted playback, and confirm no leftover WAV files remain.

**Acceptance Scenarios**:

1. **Given** speech playback completes normally, **When** the job ends, **Then** the temporary WAV file is deleted.
2. **Given** speech playback fails or is stopped early, **When** the job ends, **Then** the temporary WAV file is still deleted.

---

### User Story 3 - Avoid Temp File Buildup Over Time (Priority: P3)

As a user, repeated use of speech features does not leave behind old temporary WAV files over time.

**Why this priority**: The feature should remain safe during long sessions and frequent use.

**Independent Test**: Run multiple speech jobs in a row and confirm the temporary file count does not keep growing.

**Acceptance Scenarios**:

1. **Given** many speech jobs run in the same session, **When** they complete, **Then** no unused WAV files accumulate.
2. **Given** the app is used repeatedly across a session, **When** jobs start and finish, **Then** only active temporary files exist during processing.

### Edge Cases

- A playback job is stopped before the audio finishes: the temporary file should still be removed.
- Speech generation fails before playback starts: the temporary file should still be removed if it was created.
- Multiple speech jobs run sequentially: each temporary file should be cleaned up after its job ends.
- The app closes unexpectedly: temporary files from completed jobs should not remain as normal leftover state.

## Requirements *(mandatory)*

Every requirement MUST be testable and traceable to at least one acceptance scenario or automated test.

### Functional Requirements

- **FR-001**: System MUST treat speech WAV files as temporary files.
- **FR-002**: System MUST remove each temporary WAV file after its speech job finishes.
- **FR-003**: System MUST remove temporary WAV files when playback succeeds, fails, or is interrupted.
- **FR-004**: System MUST avoid leaving unused WAV files behind after repeated speech use.
- **FR-005**: System MUST keep audio playback and transcript behavior working while temporary files are being cleaned up.

### Key Entities *(include if data involved)*

- **Temporary WAV File**: A short-lived audio file created for one speech job.
- **Speech Job**: A single audio generation and playback attempt tied to one assistant reply.
- **Cleanup State**: The lifecycle point at which a temporary file can be safely removed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 100% of successful speech jobs, the temporary WAV file is removed after use.
- **SC-002**: In 100% of failed or interrupted speech jobs, the temporary WAV file is removed after the job ends.
- **SC-003**: After 10 consecutive speech jobs, no unused WAV files remain from completed jobs.
- **SC-004**: Temporary audio files never accumulate across normal app usage in a way that is visible to the user.
- **SC-005**: Users can run speech features repeatedly without disk clutter from leftover WAV files.

## Assumptions

- WAV files are only needed for short-lived speech generation and playback.
- Temporary files should be cleaned up as soon as their job no longer needs them.
- The user expects the app to manage file cleanup automatically without manual intervention.
- The feature applies to the current local session and does not require long-term audio storage.
