# Research: Whisper Text Input

## Decisions

### 1) Whisper implementation
- **Decision**: Use local Whisper-compatible model runtime in TypeScript.
- **Rationale**: Free, offline, no per-use API cost.
- **Alternatives considered**: Cloud OpenAI API, manual transcription, other STT vendors.

### 2) Text insertion method
- **Decision**: Paste transcript into active TUI editor instead of sending it.
- **Rationale**: User can review and edit text before send.
- **Alternatives considered**: auto-send transcript, replace editor contents.

### 3) Error handling
- **Decision**: Treat silence, model errors, and file read failures as no-speech/error states.
- **Rationale**: Avoid junk text and keep editor clean.
- **Alternatives considered**: silent failure, retry loop without user feedback.

### 4) Model storage
- **Decision**: Cache Whisper model in user home directory and reuse between runs.
- **Rationale**: Avoid repeated downloads and keep startup predictable.
- **Alternatives considered**: download each time, vendor model into repo.

### 5) Test strategy
- **Decision**: Test transcription service, editor insertion, and end-to-end record-to-input flow separately.
- **Rationale**: Each story stays independently verifiable.
- **Alternatives considered**: manual testing only, monolithic integration tests only.
