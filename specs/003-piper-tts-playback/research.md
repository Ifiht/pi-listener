# Research: Spoken Reply Playback

## Decisions

### 1) Speech engine
- **Decision**: Use Piper as local TTS engine.
- **Rationale**: Free, offline, fast enough for terminal usage, and voice quality
  is much better than ultra-light system synthesizers.
- **Alternatives considered**: eSpeak NG, system TTS, cloud TTS.

### 2) Speech generation mode
- **Decision**: Generate a WAV file for each reply, then play that file locally.
- **Rationale**: Matches desired user flow, keeps output inspectable, and makes
  playback sequencing easier.
- **Alternatives considered**: stream raw PCM, send audio to browser-like player,
  emit speech directly to speakers without file stage.

### 3) Playback strategy
- **Decision**: Use a portable local audio playback helper that shells out to the
  best available OS player for WAV files.
- **Rationale**: Keeps implementation cross-platform and avoids low-level audio
  bindings.
- **Alternatives considered**: platform-specific audio APIs, bundled native audio
  addon, browser audio bridge.

### 4) Queue and mute behavior
- **Decision**: Keep one ordered playback queue and suspend playback while voice
  recording is active.
- **Rationale**: Prevents overlap and avoids the app hearing its own reply.
- **Alternatives considered**: fire-and-forget playback, concurrent audio tracks,
  manual user muting.

### 5) Failure handling
- **Decision**: On speech generation or playback failure, keep text reply visible
  and continue processing later replies.
- **Rationale**: Audio must not block main chat workflow.
- **Alternatives considered**: stop session on audio error, hide failed replies,
  retry forever.
