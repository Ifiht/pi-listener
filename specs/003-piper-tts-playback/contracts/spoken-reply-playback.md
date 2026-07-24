# Contract: Spoken Reply Playback

## Purpose
Define behavior for converting assistant replies to spoken WAV output and
playing it inside terminal session.

## Contract
- Completed assistant replies MUST be eligible for spoken playback.
- Empty replies MUST not produce audio.
- Playback MUST be ordered.
- Active recording MUST block playback start.
- Failure to synthesize or play audio MUST not remove visible text reply.

## Acceptance Signals
- Spoken audio starts after reply completes.
- Later replies do not overlap earlier ones.
- Recording prevents audio feedback.
- Text flow remains usable after audio failure.
