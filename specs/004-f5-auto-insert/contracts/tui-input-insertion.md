# Contract: TUI Input Insertion for F5 Auto Insert

## Purpose
Define the expected behavior when a voice transcript is inserted into the active
terminal input using the F5 double-press shortcut.

## Contract
- F5 double-press MUST trigger the same transcript insertion outcome as the
  existing voice flow.
- Recognized text MUST be inserted into the active input buffer.
- Existing typed text MUST remain intact.
- The transcript MUST remain editable before send.
- Empty or failed recognition MUST not change the input buffer.
- The message MUST not be sent automatically.

## Acceptance Signals
- Transcript appears after F5 double-press.
- User can edit the text before sending.
- Input remains unchanged on no-speech or error.
- F10 behavior stays available.
