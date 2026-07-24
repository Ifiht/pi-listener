# Data Model: Voice Language Selection

## Entities

### PiperModel
Represents a selectable voice model.

**Fields**:
- `id`: stable identifier for the model
- `label`: user-facing name shown in `/talk-pi`
- `language`: language of the model, including English
- `path`: local model path or reference
- `available`: whether the model can be used right now

**Rules**:
- Active model must be one of available models or a safe fallback.
- English output must map to an English-capable model when available.

### VoiceLanguage
Represents the user’s selected voice language preference.

**Fields**:
- `kind`: user-facing choice such as Portuguese or English
- `label`: display text in menu
- `modelId`: linked Piper model

**Rules**:
- Only valid choices should be shown.
- The active voice language must be clearly visible in `/talk-pi`.

### VoicePreference
Represents the stored selection used across sessions.

**Fields**:
- `selectedModelId`
- `selectedOutputKind`
- `updatedAt`

**Rules**:
- Preference should point to a valid model when available.
- Preference should fall back safely when a model is missing.

## Relationships

- VoiceLanguage references PiperModel.
- VoicePreference stores the chosen VoiceLanguage.
- `/talk-pi` reads and updates VoicePreference.
- Whisper transcription language should follow the selected VoiceLanguage.
