# Feature Specification: Extension Path Migration

**Feature Branch**: `[015-extension-path-migration]`

**Created**: 2026-06-02

**Status**: Draft

**Input**: User description: "The adequate folder for extensions in .pi is in /.pi/agent/extensions. Is it possible to change all the codes that is using /.pi/tools to /.pi/agent/extensions/talk-pi folder?"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Use the new extension path (Priority: P1)

As a maintainer, I want the extension to resolve its files from `/.pi/agent/extensions/talk-pi` so the project works with the current Pi extension layout.

**Why this priority**: This is the core change the request asks for, and it unblocks the extension from using the correct folder.

**Independent Test**: Start the extension in a clean environment and confirm it reads and writes its extension files from the new location without needing `/.pi/tools`.

**Acceptance Scenarios**:

1. **Given** a fresh setup with only `/.pi/agent/extensions/talk-pi` available, **When** the extension starts, **Then** it loads its required files from the new path.
2. **Given** a user changes an extension setting or file, **When** the extension saves it, **Then** the change is stored under the new path.

---

### User Story 2 - Preserve existing upgrades (Priority: P2)

As an existing user, I want current installations to continue working after the path change so upgrading does not break my setup.

**Why this priority**: Users may already have local files or older references, and the migration should not interrupt their workflow.

**Independent Test**: Run the extension in an environment that still contains legacy references and confirm it continues to open and operate normally while using the new path as the primary location.

**Acceptance Scenarios**:

1. **Given** a system that still contains the old `/.pi/tools` folder, **When** the extension starts, **Then** it continues working and uses the new location for active operations.
2. **Given** the old folder is missing, **When** the extension starts, **Then** the extension still opens successfully.

---

### User Story 3 - Keep project references consistent (Priority: P3)

As a maintainer, I want repository references, examples, and tests to point to the same extension path so future changes do not reintroduce the old location.

**Why this priority**: Consistent references reduce regressions and make the active path easy to understand.

**Independent Test**: Review the repository for extension-path references and confirm they consistently use the new folder in active code and supporting materials.

**Acceptance Scenarios**:

1. **Given** the repository is scanned for extension path references, **When** the active code is reviewed, **Then** it points to `/.pi/agent/extensions/talk-pi` instead of `/.pi/tools`.
2. **Given** documentation or tests mention the extension location, **When** they are reviewed, **Then** they match the new folder naming.

### Edge Cases

- The new folder exists but the legacy folder does not.
- Both the new and old folders exist at the same time.
- A path reference appears in code, tests, or documentation rather than runtime logic.
- The extension runs on a system where the target folder is not yet created.
- File access is blocked by permissions or an unavailable user configuration path.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST resolve extension-related file access to `/.pi/agent/extensions/talk-pi` as the primary location.
- **FR-002**: The system MUST stop using `/.pi/tools` as the default location for extension assets and settings.
- **FR-003**: The system MUST continue to open and operate when `/.pi/tools` is absent.
- **FR-004**: The system MUST prefer `/.pi/agent/extensions/talk-pi` when both the new and legacy locations are available.
- **FR-005**: The repository MUST update active references, examples, and tests so they describe the same extension location.
- **FR-006**: The extension MUST preserve its existing user-visible behavior apart from the folder location used for extension files.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In validated startup tests, the extension loads successfully from `/.pi/agent/extensions/talk-pi` in 100% of supported environment scenarios.
- **SC-002**: In compatibility tests, existing setups continue to open and complete the primary extension workflow with zero blocked launches.
- **SC-003**: After the change, no standard user action requires manual creation of `/.pi/tools` to use the extension.
- **SC-004**: Repository checks confirm that active path references for the extension consistently point to the new location.

## Assumptions

- The change applies to the `talk-pi` extension and its related files only.
- Existing user-facing behavior should remain the same except for the folder location used to store and load extension files.
- A legacy `/.pi/tools` folder may still exist on some systems during transition, but it is not the primary location.
- Documentation and tests should be updated wherever they describe the active extension path.
