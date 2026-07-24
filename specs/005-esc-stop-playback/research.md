# Research: Esc Stop Playback

## 1) Stop action
- **Decision**: Esc should interrupt the currently playing spoken reply immediately and leave the visible assistant text intact.
- **Rationale**: The user wants control over audio without losing the conversation content.
- **Alternatives considered**: Let playback finish naturally; hide the message when audio is stopped.

## 2) Queue behavior after Esc
- **Decision**: Esc should stop the active spoken reply and prevent any queued spoken replies from continuing automatically until a new user-generated reply arrives.
- **Rationale**: This matches the expectation that pressing Esc cancels the current spoken output instead of just skipping a single sound file.
- **Alternatives considered**: Skip only the current audio and keep the queue running; clear the queue and remove visible messages.

## 3) Input handling
- **Decision**: Esc should be handled at the terminal input layer as a playback control, while the idle terminal remains usable when no audio is playing.
- **Rationale**: The feature should be immediate and not depend on extra commands or dialogs.
- **Alternatives considered**: Add a new command or button; require a modifier key.

## 4) Status feedback
- **Decision**: When playback is stopped, the UI should show a clear stopped/idle state while preserving the conversation transcript.
- **Rationale**: The user needs confirmation that audio was interrupted successfully.
- **Alternatives considered**: Silent stop with no feedback; show a destructive warning.
