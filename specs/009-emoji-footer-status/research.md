# Research: Emoji Footer Status

## Decision 1: Use a fixed footer phrase plus a small emoji vocabulary
- **Decision**: Standardize the footer to use the pipe-delimited `| Talk-Pi: Status Emoji |` format and pair it with a compact emoji for each core status.
- **Rationale**: This gives the user an immediate, friendly, and consistent read of the app state.
- **Alternatives considered**: Status text only; icon only; verbose sentences.

## Decision 2: Keep the user-facing statuses to Ready, Listen, Thinking, and Talking
- **Decision**: Use the four requested states as the main footer language.
- **Rationale**: The set is easy to remember and maps cleanly to the app’s voice workflow.
- **Alternatives considered**: More granular internal states; abbreviations; technical state names.

## Decision 3: Reuse the current app state sources instead of introducing a new status system
- **Decision**: Derive footer text from the existing recording, transcription, and spoken-reply state flows.
- **Rationale**: Minimizes duplication and keeps the footer aligned with real app behavior.
- **Alternatives considered**: A separate footer state store; inferred text from log messages.

## Decision 4: Design for narrow terminals with graceful readability
- **Decision**: Preserve the leading phrase and the current status meaning even when space is limited.
- **Rationale**: The footer must remain useful on smaller terminal windows.
- **Alternatives considered**: Hidden footer on narrow screens; truncating the status label entirely.

## Decision 5: Keep the feature UI-only
- **Decision**: Limit the change to visible status text and presentation.
- **Rationale**: The request is about clarity and feedback, not behavior changes.
- **Alternatives considered**: Changing voice workflows or shortcut behavior.
