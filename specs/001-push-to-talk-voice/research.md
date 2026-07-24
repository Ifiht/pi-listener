# Research: Push-to-Talk Voice Recording

## Decisions

### 1) Recording model
- **Decision**: Use one active recording session per user interaction.
- **Rationale**: Matches press-and-hold semantics and avoids overlapping audio.
- **Alternatives considered**: Persistent recording toggle; multiple concurrent sessions.

### 2) State model
- **Decision**: Use simple states: idle, recording, failed.
- **Rationale**: Enough to explain UX and drive tests without extra complexity.
- **Alternatives considered**: richer state machine with pause/resume and buffering states.

### 3) Input binding
- **Decision**: Left control is the only trigger for v1 push-to-talk.
- **Rationale**: User request names left control explicitly and wants fast access.
- **Alternatives considered**: configurable hotkey, toggle mode, mouse trigger.

### 4) Error handling
- **Decision**: Fail clearly when microphone access is unavailable or recording is interrupted.
- **Rationale**: Users need to know why capture did not start or ended early.
- **Alternatives considered**: silent failure, retry loop, auto-fallback to another input.

### 5) Test strategy
- **Decision**: Verify key-down starts recording, key-up stops it, and only in-range audio is captured.
- **Rationale**: Core behavior is deterministic and easy to validate with state tests.
- **Alternatives considered**: manual-only validation, snapshot-style UI tests only.
