# Data Model: Whisper Text Input

## Entities

### VoiceRecording
- **Purpose**: Finished `.wav` ready for recognition.
- **Fields**:
  - `filePath`: path to WAV file
  - `durationMs`: length of capture
  - `status`: ready | transcribing | failed | completed
- **Rules**:
  - Must exist before transcription begins.
  - Must be cleaned up after processing when no longer needed.

### Transcript
- **Purpose**: Text produced from recognition.
- **Fields**:
  - `text`: recognized text
  - `confidence`: optional confidence indicator
  - `isEmpty`: whether no usable speech was found
- **Rules**:
  - Empty transcript MUST not be inserted into editor.
  - Transcript text MUST be plain text suitable for the TUI input area.

### TUIInputBuffer
- **Purpose**: Current editor content the user can review and edit.
- **Fields**:
  - `currentText`: current input content
  - `cursorPosition`: insertion position
- **Rules**:
  - Existing text MUST be preserved when transcript is inserted.
  - Transcript MUST be inserted, not auto-sent.

## State Transitions
- `ready` → `transcribing` when recognition starts
- `transcribing` → `completed` when transcript inserted
- `transcribing` → `failed` when audio/model/file error occurs
- `completed` → `ready` for next recording cycle
