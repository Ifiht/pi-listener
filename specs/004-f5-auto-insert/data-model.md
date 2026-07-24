# Data Model: F5 Auto Insert

## Entities

### VoiceShortcut
- **Purpose**: Keyboard gesture that starts or completes voice capture.
- **Fields**:
  - `key`: F5 or F10
  - `pressCount`: number of presses detected in the shortcut window
  - `windowMs`: allowed interval between presses
- **Rules**:
  - F5 double-press MUST trigger the new insert path.
  - F10 double-press MUST continue to work as before.

### Transcript
- **Purpose**: Recognized speech text ready for insertion.
- **Fields**:
  - `text`: recognized text
  - `status`: ready | empty | failed
- **Rules**:
  - Empty or failed transcripts MUST not be inserted.
  - Transcript text MUST remain editable after insertion.

### TerminalInputBuffer
- **Purpose**: Current editable message content.
- **Fields**:
  - `currentText`: text currently in the input
  - `cursorPosition`: current cursor location
- **Rules**:
  - Existing input MUST be preserved on insertion.
  - Transcript MUST be inserted without auto-send.

## State Transitions
- `idle` → `capturing` when F5 or F10 voice flow starts
- `capturing` → `inserting` when recognition completes successfully
- `inserting` → `ready` when transcript is present in input buffer
- `capturing` → `ready` when recognition fails or returns no usable text
