# Research: Unified Talk Menu

## Decisions

### 1) Single entry point
- **Decision**: Use `/talk-pi` as the only user-facing menu entry point.
- **Rationale**: A single command is easier to remember and removes duplicate navigation paths.
- **Alternatives considered**: Keep `/talk-pi-menu` alongside `/talk-pi`; add a new command name.

### 2) Combined menu content
- **Decision**: Place Status and Mute/Unmute actions in the same menu.
- **Rationale**: Status and mute are the two most common extension controls and fit naturally together.
- **Alternatives considered**: Split into separate submenus; keep mute hidden behind a second command.

### 3) Retiring the old command
- **Decision**: Remove `/talk-pi-menu` from the normal user flow.
- **Rationale**: The feature explicitly asks for a unified menu and the old command would create confusion.
- **Alternatives considered**: Keep the old command as a hidden alias; keep both commands in parallel.

### 4) Status feedback
- **Decision**: Keep the menu able to show the current extension state on demand.
- **Rationale**: Users need immediate confirmation of whether the extension is muted and what it is doing.
- **Alternatives considered**: Separate read-only status view; status only in the footer.
