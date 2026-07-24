# Data Model: Mute Extension Menu

## Entities

### Mute State
- **Purpose**: Tracks whether spoken audio is currently allowed.
- **Fields**:
  - `isMuted`: boolean
  - `changedAt`: timestamp of the last toggle
  - `source`: menu action that changed the state
- **Rules**:
  - When muted, spoken playback must not start.
  - When unmuted, future spoken playback may resume normally.

### Extension Menu Item
- **Purpose**: Represents the user-facing action used to toggle mute.
- **Fields**:
  - `label`: current action text shown to the user
  - `enabled`: whether the item can be selected
  - `stateLabel`: visible indicator of muted or unmuted state
- **Rules**:
  - The menu must always show the current mute state.
  - The action label should switch between mute and unmute based on state.

### Spoken Playback Gate
- **Purpose**: Controls whether spoken audio may play.
- **Fields**:
  - `blockedByMute`: boolean
  - `activePlaybackStopped`: boolean
- **Rules**:
  - Active playback must stop when mute is turned on.
  - Queued spoken output must remain blocked until mute is turned off.
  - Text replies are not affected by this gate.

## State Transitions

- `unmuted` → `muted` when the user selects mute
- `muted` → `unmuted` when the user selects unmute
- `muted` → `muted` when the user repeats mute with no change
- `unmuted` → `unmuted` when the user repeats unmute with no change
