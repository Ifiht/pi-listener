# Data Model: Extension Path Migration

## Entities

### Extension Root
- **Purpose**: The active filesystem location the extension uses to load and store its files.
- **Key attributes**:
  - `currentPath`: `/.pi/agent/extensions/talk-pi`
  - `isAvailable`: whether the directory can be accessed when the extension starts
- **Rules**:
  - The active root must resolve to the new extension location.
  - The extension should continue to open when the active root is the only available location.

### Legacy Path Reference
- **Purpose**: The old `/.pi/tools` path that may still appear in older environments or references.
- **Key attributes**:
  - `path`: `/.pi/tools`
  - `presence`: whether the legacy directory exists
- **Rules**:
  - The legacy path is not the preferred active location.
  - Existing references must not be required for normal operation.

### Path Reference Record
- **Purpose**: Any documented or coded reference that points to an extension location.
- **Key attributes**:
  - `locationText`: the string used in code, tests, or documentation
  - `target`: active or legacy extension root
- **Rules**:
  - Active references must point to the new extension root.
  - References in supporting materials must stay aligned with the active root.

## Relationships
- The **Extension Root** is the primary target for all extension file access.
- The **Legacy Path Reference** may coexist during transition but must not govern active behavior.
- **Path Reference Records** should map to the Extension Root used by the project.

## Validation Rules
- The active extension path must be consistent across startup behavior, tests, and documentation.
- The extension must not depend on `/.pi/tools` being present to function.
