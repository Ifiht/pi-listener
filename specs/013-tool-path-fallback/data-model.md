# Data Model: Tool Path Fallback

## Conclusion

No new runtime entities are introduced. The feature documents how an existing flow resolves a tools directory.

## Information Blocks

- **Preferred Tool Location**: The user-scoped path at `~/.pi/tools`.
- **Fallback Tool Location**: The local install path at `./tools`.
- **Flow Resolution Result**: The selected location used for the current flow.
- **Failure State**: The visible error shown when neither location is usable.

## Relationships

- If `~/.pi` exists, the preferred tool location takes precedence.
- If `~/.pi` does not exist, the fallback tool location is created and used.
- The resolved location remains in effect for the current flow.
- Failure state applies only when the preferred or fallback location cannot be used.
