# Research: Recorder-Free Voice Capture

## Decision 1: Use decibri for microphone capture
- **Decision**: Replace SoX-based capture with decibri as microphone capture layer.
- **Rationale**: decibri provides cross-platform microphone input, ships prebuilt binaries, and removes the need for users to install or configure separate recorder software.
- **Alternatives considered**: Keep SoX wrapper; use `node-record-lpcm16-ts`; use other mic packages with system dependencies.

## Decision 2: Keep existing temporary WAV handoff
- **Decision**: Preserve the current voice-flow handoff that produces a temporary WAV file for transcription.
- **Rationale**: This minimizes churn in downstream transcription logic and keeps the feature scoped to capture replacement.
- **Alternatives considered**: Rewrite the transcription pipeline to consume raw PCM directly; change the file lifecycle model.

## Decision 3: Validate by end-to-end voice flow tests
- **Decision**: Cover the change with focused unit tests for capture setup and integration tests for record → stop → transcript readiness.
- **Rationale**: The risk is in capture behavior and failure handling, so the best proof is the existing voice flow exercised from start to finish.
- **Alternatives considered**: Unit-only coverage; manual-only verification.

## Decision 4: Keep failure handling user-facing and recoverable
- **Decision**: If capture cannot start or finish, surface a clear error and leave the app ready for another attempt.
- **Rationale**: Voice input must fail safely without breaking the rest of the terminal session.
- **Alternatives considered**: Silent failure; hard stop requiring restart.
