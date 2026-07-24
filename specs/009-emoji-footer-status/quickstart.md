# Quickstart: Emoji Footer Status

## Verify the footer

1. Start Talk-Pi.
2. Confirm the footer follows the `| Talk-Pi: Status Emoji |` format.
3. Confirm the idle state shows a friendly Ready label with an emoji.
4. Start voice input and confirm the footer switches to a Listen-style label.
5. Finish recording and confirm the footer shows Transcribing.
6. Wait for the transcript to be processed and confirm the footer shows Thinking.
7. Trigger a spoken assistant reply and confirm the footer shows Talking.
8. Toggle mute and confirm the footer shows Muted.
9. Trigger a playback or transcription failure and confirm the footer shows Error.
10. Finish speech input with no detected speech and confirm the footer shows No speech detected.
11. Resize the terminal narrower and confirm the current state remains understandable.

## Expected outcome

- The footer is easy to scan at a glance in pipe-delimited form.
- The current app mode is visible without opening any other screen.
- The wording stays consistent across states.
