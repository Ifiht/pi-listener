# Research: Temporary WAV Cleanup

## Decisions

### 1) Temporary file creation
- **Decision**: Create WAV files as temporary artifacts for each speech job.
- **Rationale**: The audio file exists only to bridge synthesis and playback, so it should never be treated as durable data.
- **Alternatives considered**: Reusing a long-lived cache; keeping generated WAV files for debugging.

### 2) Cleanup timing
- **Decision**: Remove the WAV file as soon as the speech job no longer needs it.
- **Rationale**: Early cleanup prevents leftover files from accumulating across repeated use.
- **Alternatives considered**: Cleanup only on app exit; manual cleanup commands; delayed batch cleanup.

### 3) Failure and interrupt handling
- **Decision**: Clean up temporary WAV files whether playback succeeds, fails, or is interrupted.
- **Rationale**: A file should be removed regardless of outcome once the job is complete.
- **Alternatives considered**: Only delete on the happy path; preserve failed files for inspection.

### 4) Cleanup robustness
- **Decision**: Keep cleanup logic part of the speech job lifecycle so files are deleted even when unexpected errors happen.
- **Rationale**: The app must avoid disk clutter even when playback does not finish normally.
- **Alternatives considered**: Rely on later maintenance jobs or user cleanup.
