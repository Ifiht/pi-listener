# Quickstart: Persist Voice Settings

## Verify saved Voice Language and mute state

1. Open `/talk-pi`.
2. Change the Voice Language.
3. Toggle the extension to muted.
4. Close and reopen the extension.
5. Confirm the same Voice Language is selected and the extension opens muted.

## Verify first-run defaults

1. Remove the saved voice preference file.
2. Open `/talk-pi`.
3. Confirm the extension opens with default Voice Language and unmuted state.

## Verify recovery from bad saved data

1. Save an incomplete or unreadable voice preference record.
2. Open `/talk-pi`.
3. Confirm the extension still opens and falls back to safe defaults.
