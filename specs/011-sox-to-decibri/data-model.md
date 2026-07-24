# Data Model: Recorder-Free Voice Capture

## Entities

### VoiceRecordingSession
- **Purpose**: One user recording attempt from start to stop.
- **Fields**:
  - `id`: unique session identifier
  - `state`: idle | recording | completed | failed
  - `startedAt`: start timestamp
  - `endedAt`: end timestamp, if finished
  - `audioPath`: location of produced recording, if successful
  - `errorMessage`: user-facing error, if failed
- **Validation rules**:
  - `audioPath` must exist only for completed sessions.
  - `errorMessage` must exist only for failed sessions.
  - `startedAt` must be set before `endedAt`.

### Capture Source
- **Purpose**: Microphone input used by the current session.
- **Fields**:
  - `deviceLabel`: selected input name or default input
  - `sampleRate`: recorded sample rate
  - `channels`: number of channels captured
- **Validation rules**:
  - Capture source must be available before recording can enter `recording` state.
  - Capture source must remain consistent for one active session.

### Recording Error
- **Purpose**: Recoverable failure that blocks capture.
- **Fields**:
  - `code`: short failure category
  - `message`: user-facing explanation
  - `recoverable`: boolean
- **Validation rules**:
  - Error message must be clear enough for a retry decision.
  - Failed sessions must preserve the last error until a new attempt starts.

## State Transitions

- `idle` → `recording` when user starts capture
- `recording` → `completed` when user ends capture successfully
- `recording` → `failed` when capture cannot start or finish
- `completed` → `idle` when downstream voice flow accepts the recording
- `failed` → `idle` when user retries or dismisses the error

## Relationships

- One `VoiceRecordingSession` uses one `Capture Source`.
- A `VoiceRecordingSession` may produce one `Recording Error`.
- A completed `VoiceRecordingSession` feeds the existing transcription step.