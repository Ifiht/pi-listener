# Quickstart: Tool Path Fallback

## Goal

Document and verify the rule for selecting the tools folder used by current flows.

## Steps

1. Confirm whether `~/.pi` exists.
2. If `~/.pi` exists, verify the flow uses `~/.pi/tools`.
3. If `~/.pi` does not exist, verify the flow creates and uses `./tools` in the local install folder.
4. Confirm the selected location stays consistent for the duration of the flow.
5. Confirm a clear error is shown if the chosen path cannot be accessed or created.

## Expected Result

Current flows resolve a single tools location using the requested fallback rule, with predictable behavior for both existing and fresh setups.
