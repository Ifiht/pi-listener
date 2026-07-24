# Data Model: Emoji Footer Status

## Entities

### FooterStatus
Represents the visible footer text shown to the user.

**Fields**:
- `prefix`: fixed leading phrase shown first
- `label`: user-facing state name
- `emoji`: visual indicator paired with the label
- `detail`: optional short helper text for temporary states

**Rules**:
- The footer prefix must use the `Talk-Pi:` form inside pipe delimiters.
- The label must be one of the supported status names.
- The emoji must match the current status.
- The footer must remain understandable when space is limited.

### StatusState
Represents the current user-facing mode of the app.

**Values**:
- `Ready`
- `Listen`
- `Transcribing`
- `Thinking`
- `Talking`
- `Muted`
- `Error`
- `No speech detected`

**Transitions**:
- Ready → Listen when the user starts voice input
- Listen → Transcribing when the audio has finished recording and is being converted
- Transcribing → Thinking when the transcript is ready and the LLM is processing a response
- Thinking → Talking when assistant playback begins
- Talking → Ready when playback ends
- Muted → Ready when mute is turned off and the app becomes idle again
- Error → Ready when the error is cleared and the app becomes idle again
- No speech detected → Ready after the brief notice is shown
- Any active mode → Ready when the app becomes idle again

## Relationships

- FooterStatus is derived from StatusState.
- StatusState is derived from existing voice and reply activity.
