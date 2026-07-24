# Research: Persist Voice Settings

## Decision 1: Reuse the existing voice preference file
- **Decision**: Store Voice Language and muted state in the current persisted voice preference file used by Talk-Pi.
- **Rationale**: It keeps all voice-related startup preferences in one place and avoids adding another user-facing settings file.
- **Alternatives considered**: A separate mute-settings file; session-only mute state.

## Decision 2: Restore settings during startup before the menu is shown
- **Decision**: Load persisted voice settings as part of extension startup so the menu opens with the correct Voice Language and mute state already applied.
- **Rationale**: Users should see the current state immediately and avoid a visible state mismatch.
- **Alternatives considered**: Load settings after the menu opens; lazy-load settings only when a voice action occurs.

## Decision 3: Treat missing or partial data as recoverable
- **Decision**: If the settings file is missing, incomplete, or unreadable, fall back to safe defaults and continue opening the extension.
- **Rationale**: Preference storage should never block the main voice workflow.
- **Alternatives considered**: Show an error and stop; require manual repair before opening.

## Decision 4: Save changes immediately when the user changes a setting
- **Decision**: Persist the new Voice Language or mute state as soon as the user changes it.
- **Rationale**: Immediate persistence prevents loss of the latest choice if the extension closes unexpectedly.
- **Alternatives considered**: Batch-save on exit; save only after a confirmation step.

## Decision 5: Keep the schema backward-compatible
- **Decision**: Preserve existing voice preference fields and add mute state in a way that older or partial records still resolve safely.
- **Rationale**: Existing users may already have a saved voice preference file.
- **Alternatives considered**: Replace the file format entirely; require migration prompts.
