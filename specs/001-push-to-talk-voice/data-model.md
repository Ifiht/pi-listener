# Data Model: Push-to-Talk Voice Recording

## Entities

### RecordingSession
- **Purpose**: Represents one push-to-talk capture.
- **Fields**:
  - `id`: unique session identifier
  - `startedAt`: timestamp when left control is pressed
  - `endedAt`: timestamp when left control is released or interrupted
  - `state`: idle | recording | failed | completed
  - `audioBufferRef`: reference to captured audio for current session
  - `failureReason`: optional message for failed capture
- **Rules**:
  - Must start only on left control press.
  - Must end on left control release or interruption.
  - Must never contain audio outside active press window.

### RecordingState
- **Purpose**: User-visible status of push-to-talk.
- **Values**:
  - `idle`
  - `recording`
  - `failed`
- **Rules**:
  - `idle` before capture starts and after clean completion.
  - `recording` only while left control remains pressed.
  - `failed` when microphone access or capture is not available.

## State Transitions
- `idle` → `recording` on left control press
- `recording` → `completed` on left control release
- `recording` → `failed` on interruption or capture error
- `failed` → `idle` after user recovers or dismisses error
