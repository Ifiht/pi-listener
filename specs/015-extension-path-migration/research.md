# Research: Extension Path Migration

## Decision 1: Standardize on the new extension root
- **Decision**: Use `/.pi/agent/extensions/talk-pi` as the active extension location everywhere the project resolves extension files.
- **Rationale**: This matches the current Pi extension layout described by the user and removes reliance on the outdated tools directory.
- **Alternatives considered**:
  - Keep `/.pi/tools` as the default: rejected because it preserves the old layout.
  - Support both paths equally: rejected because it leaves the active location ambiguous.

## Decision 2: Update project references consistently
- **Decision**: Replace active references in code, tests, examples, and documentation that describe the extension root.
- **Rationale**: Consistency reduces regressions and prevents future changes from reintroducing the old path.
- **Alternatives considered**:
  - Change runtime code only: rejected because docs and tests would still advertise the wrong path.

## Decision 3: Keep the feature simple and localized
- **Decision**: Treat the change as a path migration only, without introducing extra abstraction layers.
- **Rationale**: The scope is limited to where the extension looks for its files, so a small change is easier to verify and maintain.
- **Alternatives considered**:
  - Add a configurable path system: rejected as unnecessary for this request.

## Outcome

No unresolved technical unknowns remain for planning. The feature can proceed with a straightforward path update and reference cleanup.
