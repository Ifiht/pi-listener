# Research: Tool Path Fallback

## Decision 1: Keep the change documentation-driven

- **Decision**: Treat the feature as a documentation and workflow clarification update.
- **Rationale**: The request describes how current flows should select tool locations, and the planning output must remain aligned with the documented spec rather than inventing new runtime behavior.
- **Alternatives considered**: Adding code-level abstraction or new runtime settings. Rejected because the current planning phase is about documenting the rule and its consequences.

## Decision 2: Use an explicit precedence rule

- **Decision**: Prefer `~/.pi/tools` whenever `~/.pi` exists; otherwise create and use `./tools` in the local install folder.
- **Rationale**: This matches the requested fallback behavior and gives a deterministic, testable selection order.
- **Alternatives considered**: Prompting the user to choose a path each run. Rejected because it adds avoidable friction and weakens the fallback guarantee.

## Decision 3: Keep scope to current flows only

- **Decision**: Apply the rule only when loading tools for current flows, not globally across unrelated commands.
- **Rationale**: The request explicitly limits the rule to the current flows and avoids unnecessary side effects elsewhere.
- **Alternatives considered**: Making the path selection global for all commands. Rejected because it broadens scope beyond the feature request.

## Decision 4: Document failure behavior clearly

- **Decision**: Describe a clear error path when the preferred or fallback folder cannot be accessed or created.
- **Rationale**: Deterministic fallback logic should fail visibly when neither path is usable.
- **Alternatives considered**: Silent fallback or implicit retries. Rejected because they obscure the resolved tool location and make failures harder to diagnose.
