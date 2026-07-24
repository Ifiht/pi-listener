# Quickstart: Spoken Reply Playback

## Setup
1. Install Piper binary and one voice model.
2. Set `TALK_PI_PIPER_BIN` if Piper binary is not on `PATH`.
3. Set `TALK_PI_PIPER_MODEL_PATH` to local `.onnx` voice file.
4. Start Pi terminal session.

## Verify Flow
1. Send a prompt that produces a normal assistant reply.
2. Confirm reply is converted into spoken audio automatically.
3. Confirm audio plays in order inside terminal flow.
4. Start voice recording and confirm speech playback pauses or queues.
5. Stop recording and confirm queued speech resumes.
6. Trigger an audio failure and confirm text reply still remains visible.

## Expected Behavior
- Replies become local WAV speech.
- Speech plays without manual export.
- Existing text reply stays visible.
- Recording blocks playback to avoid feedback.
- Playback failures do not break chat flow.
