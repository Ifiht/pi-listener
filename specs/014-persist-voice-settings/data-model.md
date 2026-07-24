# Data Model: Persist Voice Settings

## Voice Preference Record
Represents the persisted settings used when Talk-Pi opens.

### Fields
- `selectedModelId`: identifies the currently selected voice model
- `selectedOutputKind`: indicates the user-visible Voice Language choice
- `muted`: indicates whether the extension should open muted or unmuted
- `updatedAt`: timestamp of the last successful save

### Rules
- Missing fields resolve to safe defaults.
- Invalid stored values are ignored in favor of defaults.
- The record must remain readable across restarts.

## Runtime Voice State
Represents the settings currently applied while the extension is open.

### Fields
- `voiceLanguage`: user-visible language selection shown in the menu
- `isMuted`: current mute state

### Rules
- Runtime state loads from the persisted record when the extension opens.
- Changing either setting updates runtime state and the persisted record.

## State Transitions
- `closed` → `open(defaults)` when no saved record exists
- `closed` → `open(saved)` when persisted settings load successfully
- `open` → `open(updated)` when the user changes Voice Language
- `open` → `open(mutated)` when the user toggles mute or unmute
- `open(saved)` → `open(defaults)` when saved data is missing or invalid
