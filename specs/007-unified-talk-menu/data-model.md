# Data Model: Unified Talk Menu

## Entities

### Unified Menu State
- **Purpose**: Tracks the current state of the single `/talk-pi` menu flow.
- **Fields**:
  - `isOpen`: boolean
  - `selectedOption`: current menu choice
  - `sourceCommand`: the command that opened the menu
- **Rules**:
  - The menu opens from `/talk-pi`.
  - The visible options must reflect the current session state.

### Menu Option
- **Purpose**: Represents an action available inside the unified menu.
- **Fields**:
  - `label`: the user-visible text
  - `kind`: status | mute | unmute | close
  - `enabled`: whether the option can be chosen
- **Rules**:
  - Status must always be available.
  - Mute/Unmute must reflect the current mute state.

### Mute State
- **Purpose**: Indicates whether audio output is currently silenced.
- **Fields**:
  - `isMuted`: boolean
- **Rules**:
  - When muted, the label shown in the menu must switch to Unmute.
  - When unmuted, the label shown in the menu must switch to Mute.

### Status View
- **Purpose**: Captures the current extension state shown from the menu.
- **Fields**:
  - `statusText`: readable state summary
  - `updatedAt`: when the status was last shown
- **Rules**:
  - Status must reflect the current state at the time the user opens it.

## State Transitions

- `closed` → `open` when `/talk-pi` runs
- `open` → `open(status)` when the user selects Status
- `open` → `open(muted)` when the user selects Mute
- `open` → `open(unmuted)` when the user selects Unmute
- `open` → `closed` when the user closes the menu
