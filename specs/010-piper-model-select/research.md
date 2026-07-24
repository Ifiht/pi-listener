# Research: Piper Model Selection

## Decision 1: Reuse `/talk-pi` as single entry point
- **Decision**: Add Voice Language choice inside existing `/talk-pi` menu.
- **Rationale**: Keeps voice settings in one place and avoids another command path.
- **Alternatives considered**: Separate command for model selection; config-file-only workflow.

## Decision 2: Treat English as selectable voice language
- **Decision**: English is a user-visible Voice Language choice that maps to an English Piper model when available and uses matching Whisper transcription language.
- **Rationale**: Matches user expectation and keeps selection simple.
- **Alternatives considered**: Automatic language detection; forcing all voices into one default model.

## Decision 3: Surface active selection in menu
- **Decision**: Show current Voice Language and mapped Piper model in `/talk-pi` menu.
- **Rationale**: Prevents uncertainty and supports quick confirmation before changing.
- **Alternatives considered**: Hidden state; separate settings screen.

## Decision 4: Fallback on missing language model
- **Decision**: If requested English model is unavailable, show clear fallback or error instead of silent failure.
- **Rationale**: User must know why selection cannot apply.
- **Alternatives considered**: Silent fallback; blocking selection entirely.

## Decision 5: Persist preference when practical
- **Decision**: Remember Voice Language choice for future sessions when existing config supports it.
- **Rationale**: Reduces repeat setup and makes feature feel complete.
- **Alternatives considered**: Session-only selection; ask every startup.
