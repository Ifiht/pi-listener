# Contract: Mute Extension Menu

## Purpose
Define the expected user-facing behavior for muting and unmuting the extension from the terminal menu.

## Contract
- The menu MUST present a clear mute action when the extension is unmuted.
- The menu MUST present a clear unmute action when the extension is muted.
- The current mute state MUST be visible whenever the menu is opened.
- The mute menu MUST be accessible from the extension command menu.
- Muting MUST stop any currently playing spoken audio promptly.
- Muting MUST block future spoken replies until the user unmutes the extension.
- Muting and unmuting MUST NOT remove visible text replies or break typing.

## Acceptance Signals
- User can toggle mute state from the menu.
- User can open the menu from the extension command `talk-pi-menu`.
- Spoken audio stops when mute is enabled.
- Spoken audio resumes after unmute.
- Text-based chat remains available throughout.
