# Data Model: Spoken Reply Playback

## Entities

### LLMReply
- **Purpose**: Text answer produced by the assistant.
- **Fields**:
  - `id`: unique reply id
  - `text`: reply text
  - `createdAt`: creation time
  - `status`: pending | complete | failed
- **Rules**:
  - Empty text MUST not enter playback queue.
  - Reply text remains visible even if playback fails.

### SpeechJob
- **Purpose**: One synthesized audio task derived from a reply.
- **Fields**:
  - `replyId`: linked reply
  - `text`: text to speak
  - `audioPath`: generated WAV location
  - `status`: queued | synthesizing | ready | playing | failed | skipped
- **Rules**:
  - Jobs MUST preserve arrival order.
  - Jobs created during recording MUST wait until recording ends.

### PlaybackQueue
- **Purpose**: Ordered list of speech jobs waiting to play.
- **Fields**:
  - `items`: ordered jobs
  - `isPlaying`: whether audio is active
  - `isMutedForRecording`: whether recording currently blocks playback
- **Rules**:
  - Only one job may play at a time.
  - Queue MUST not overlap jobs.

### RecordingState
- **Purpose**: Whether mic capture is currently active.
- **Fields**:
  - `phase`: idle | recording | stopping
- **Rules**:
  - Recording phase blocks playback start.
  - End of recording may release queued jobs.

## State Transitions
- `queued` → `synthesizing` when speech generation starts
- `synthesizing` → `ready` when WAV exists
- `ready` → `playing` when audio starts
- `playing` → `complete` when audio finishes
- any state → `failed` on unrecoverable generation/playback error
- `playing` or `ready` → `queued`/held when recording becomes active
