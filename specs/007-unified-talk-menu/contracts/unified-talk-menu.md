# Contract: Unified Talk Menu

## Purpose
Define the expected user-facing behavior for the single `/talk-pi` menu flow.

## Contract
- `/talk-pi` MUST open the unified menu.
- The unified menu MUST include Status, Mute/Unmute, and Close actions.
- Status MUST show the current extension state and can include usage guidance for the F9/F10 transcript keys.
- Mute MUST be available when the extension is unmuted.
- Unmute MUST be available when the extension is muted.
- `/talk-pi-menu` MUST not be required for the normal user flow.

## Acceptance Signals
- Running `/talk-pi` opens the menu.
- Status is reachable from the same menu.
- Mute/Unmute is reachable from the same menu.
- The old separate menu command is no longer needed.
