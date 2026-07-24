# Research: F5 Auto Insert

## Decisions

### 1) Shortcut behavior
- **Decision**: Add F5 double-press as an alternate trigger that reuses the
  existing transcript insertion flow.
- **Rationale**: Keeps the new feature consistent with the current voice UX and
  avoids duplicating speech processing behavior.
- **Alternatives considered**: single-press F5, replacing F10, adding a new menu
  action.

### 2) Insert vs send
- **Decision**: Insert the transcript into the active input buffer without
  sending it automatically.
- **Rationale**: Matches the current review-first workflow and prevents accidental
  message submission.
- **Alternatives considered**: auto-send after recognition, prompt-before-insert.

### 3) Existing input preservation
- **Decision**: Preserve any text already in the input buffer when the transcript
  is inserted.
- **Rationale**: Users often type partial text before or after speaking; the
  feature must not wipe their work.
- **Alternatives considered**: replace current input, append only to the end with
  no cursor control.

### 4) Failure/no-speech handling
- **Decision**: Treat empty or failed recognition as a no-op and keep the input
  unchanged.
- **Rationale**: Avoids junk text and keeps the UI reliable.
- **Alternatives considered**: insert a placeholder message, auto-clear the input.
