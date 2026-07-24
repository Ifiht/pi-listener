# Data Model: Temporary WAV Cleanup

## Entities

### Temporary WAV File
- **Purpose**: Short-lived audio file created for one speech job.
- **Fields**:
  - `path`: location on disk
  - `createdAt`: creation time
  - `deletedAt`: time removed from disk, if removed
  - `state`: created | in-use | ready | deleted | failed
- **Rules**:
  - Must be temporary only.
  - Must be removed after the speech job ends.

### Speech Job
- **Purpose**: One synthesis/playback attempt for a spoken reply.
- **Fields**:
  - `text`: reply text to speak
  - `audioPath`: temporary WAV file path
  - `status`: queued | synthesizing | playing | complete | failed | interrupted
- **Rules**:
  - Every job must release its temporary file.
  - Cleanup must occur on success, failure, or interruption.

### Cleanup Lifecycle
- **Purpose**: Tracks when a temporary file can be safely deleted.
- **Fields**:
  - `canDelete`: boolean
  - `reason`: cleanup trigger or blocking reason
- **Rules**:
  - A file can be deleted when playback is finished or aborted.
  - No completed job should leave a file behind.

## State Transitions

- `created` → `in-use` when synthesis starts
- `in-use` → `ready` when audio is generated
- `ready` → `deleted` after playback or cleanup
- `in-use` → `deleted` after failure or interruption
- `ready`/`in-use` → `failed` when cleanup cannot complete and must be reported
