# Contract: TUI Input Insertion

## Purpose
Define behavior for inserting recognized transcript into active Pi input.

## Contract
- Recognized text MUST be inserted into active input buffer.
- Existing input text MUST remain intact.
- Transcript insertion MUST not send message automatically.
- Empty or failed recognition MUST not insert junk text.
- UI MUST show success or error feedback after recognition.

## Acceptance Signals
- Input area contains transcript after recognition.
- User can continue editing before sending.
- No auto-send occurs on recognition completion.
