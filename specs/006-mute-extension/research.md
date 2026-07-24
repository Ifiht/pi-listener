# Research: Mute Extension Menu

## Decisions

### 1) Mute state ownership
- **Decision**: Keep a single session-scoped mute flag alongside the spoken playback flow.
- **Rationale**: The mute choice affects audio behavior for the current session only and should be easy to inspect and reset.
- **Alternatives considered**: Persisting mute across restarts; spreading mute checks across unrelated UI code.

### 2) Menu interaction model
- **Decision**: Expose mute and unmute as menu actions in the existing terminal UI, with the current state shown clearly.
- **Rationale**: The feature request asks for a menu, and a visible toggle is easier to discover than a hidden command.
- **Alternatives considered**: Command-only control; a dedicated modal; keyboard-only toggle without a menu.

### 3) Audio gating behavior
- **Decision**: Muting should stop any active spoken playback and block queued spoken replies from starting until unmuted.
- **Rationale**: Users expect mute to silence the extension immediately, not merely prevent new sounds.
- **Alternatives considered**: Let the current audio finish; pause only future replies; clear the queue permanently.

### 4) User feedback
- **Decision**: Show the current mute state clearly so users can confirm whether audio is currently suppressed.
- **Rationale**: A mute control is only useful if the state is obvious and reversible.
- **Alternatives considered**: Silent toggle with no status; relying on remembered state only.
