# Contract: Voice Recording Interaction

## Purpose
Define the user-facing behavior for push-to-talk voice capture.

## Contract
- Left control press MUST start recording.
- Left control release MUST stop recording.
- Active recording state MUST be visible to the user.
- Failure to access microphone MUST present a clear error state.
- Only audio captured while the key is held MAY be included in the session output.

## Acceptance Signals
- Recording state changes to active on key-down.
- Recording state returns to idle or completed on key-up.
- Failure state appears when mic access is unavailable.
