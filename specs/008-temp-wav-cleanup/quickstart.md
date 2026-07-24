# Quickstart: Temporary WAV Cleanup

## Verify Temporary Files
1. Start the terminal session.
2. Trigger a spoken reply.
3. Confirm a WAV file is created only for the active speech job.
4. Confirm the file is removed after playback finishes.

## Verify Failure Cleanup
1. Trigger a speech job that fails before or during playback.
2. Confirm the temporary WAV file is still removed.
3. Confirm no leftover WAV files remain in the temporary folder.

## Verify Repeated Use
1. Trigger multiple speech jobs in sequence.
2. Confirm each job creates a temporary WAV file.
3. Confirm each file is cleaned up after use.
4. Confirm the temporary directory does not accumulate old WAV files.

## Expected Behavior
- WAV files are temporary only.
- Every completed speech job removes its file.
- Failed or interrupted jobs still clean up their file.
- Repeated use does not leave trash tmp audio files behind.
