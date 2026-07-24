# Data Model: Esc Stop Playback

## Entities

### Spoken Playback Session
- **Purpose**: Represents the currently active spoken reply playback flow.
- **Fields**:
  - `state`: `idle` | `playing` | `stopping`
  - `currentReplyText`: visible assistant text currently being spoken
  - `hasQueuedReplies`: whether more spoken replies are waiting
  - `stopRequested`: whether Esc has been pressed for the active playback
- **Rules**:
  - Esc may stop playback only while `state` is `playing`.
  - Once stopped, the current spoken reply must not continue.
  - Queued spoken replies must not auto-play after a stop request.

### Playback Queue
- **Purpose**: Ordered list of spoken replies waiting to play.
- **Fields**:
  - `pendingItems`: ordered spoken reply texts
  - `blocked`: whether audio playback is temporarily prevented
- **Rules**:
  - The queue must preserve order for normal playback.
  - When Esc interrupts playback, the queue must not continue automatically.

### Conversation Message
- **Purpose**: The visible assistant message shown to the user.
- **Fields**:
  - `text`: displayed assistant reply text
  - `visible`: whether the reply remains on screen
- **Rules**:
  - Stopping playback must not remove or alter the message text.
  - The message remains visible after Esc.

## State Transitions

- `idle` → `playing` when a spoken reply starts
- `playing` → `stopping` when Esc is pressed
- `stopping` → `idle` when playback has been interrupted and the queue is no longer auto-advancing
- `playing` → `idle` when playback ends normally
