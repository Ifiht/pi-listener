# Quickstart: Unified Talk Menu

## Verify the Unified Menu
1. Start the terminal session.
2. Run `/talk-pi`.
3. Confirm the menu opens.
4. Confirm the menu shows Status, Mute/Unmute, and Close.
5. Select Status and confirm the current extension state is shown, along with the F9/F10 key usage hint.
6. Select Mute or Unmute and confirm the state changes.

## Verify Old Menu Is No Longer Needed
1. Use `/talk-pi` for the menu flow.
2. Confirm there is no need to open a separate `/talk-pi-menu` command for normal use.
3. Confirm the same menu exposes both status and mute controls.

## Expected Behavior
- `/talk-pi` is the single menu entry point.
- Status is available from the same menu.
- Mute/Unmute is available from the same menu.
- The menu reflects the current state when reopened.
