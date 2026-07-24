# Feature Specification: Tool Path Fallback

**Feature Branch**: `[015-tool-path-fallback]`

**Created**: 2026-05-31

**Status**: Draft

**Input**: User description: "There is a ./tools install rule. First, check if there is a ~/.pi folder. If this folder exists, then use the tools folder in ~/.pi/tools. If the folder ~/.pi is not present, then create the ./tools folder in the current local install folder. Use this tool fallback rule to load the tools in the current flows."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Prefer User Tools When Available (Priority: P1)

Existing users can keep using their personal tools location automatically when a ~/.pi folder is already present.

**Why this priority**: This preserves the expected tools setup for existing users and avoids unnecessary duplicate local setup.

**Independent Test**: On a machine where ~/.pi exists, start a current flow and confirm it uses the tools from ~/.pi/tools.

**Acceptance Scenarios**:

1. **Given** a ~/.pi folder exists, **When** a current flow starts, **Then** tools are loaded from ~/.pi/tools.
2. **Given** both ~/.pi/tools and a local ./tools folder are available, **When** a current flow starts, **Then** the ~/.pi/tools location is chosen.

---

### User Story 2 - Create Local Tools on Fresh Install (Priority: P2)

New users can run current flows without creating a user-scoped tools folder first.

**Why this priority**: Fresh installs need a reliable fallback so the flow can start without extra setup.

**Independent Test**: On a machine without ~/.pi, start a current flow and confirm ./tools is created and used.

**Acceptance Scenarios**:

1. **Given** ~/.pi is absent, **When** a current flow starts, **Then** ./tools is created in the current local install folder.
2. **Given** ./tools has been created for the current install, **When** the flow continues, **Then** the flow uses that local tools location.

---

### User Story 3 - Report Tool Path Failures Clearly (Priority: P3)

Users get a clear failure message when neither the preferred nor fallback tool location can be used.

**Why this priority**: Clear failures are better than silent misconfiguration and make the flow recoverable.

**Independent Test**: Simulate an inaccessible tools location or a non-writable install folder and confirm the flow reports a clear error.

**Acceptance Scenarios**:

1. **Given** ~/.pi exists but ~/.pi/tools cannot be accessed, **When** a current flow starts, **Then** the flow reports a clear error.
2. **Given** the local install folder cannot create ./tools, **When** the fallback is needed, **Then** the flow reports a clear error.

### Edge Cases

- ~/.pi exists but ~/.pi/tools is missing or empty.
- Both ~/.pi/tools and ./tools exist; the user-scoped path still takes precedence.
- The local install folder is read-only when ./tools must be created.
- The resolved tools location should remain stable for the duration of one flow run.
- The presence of ~/.pi changes between separate runs.

## Requirements *(mandatory)*

Every requirement MUST be testable and traceable to at least one acceptance
scenario or automated test.

### Functional Requirements

- **FR-001**: The system MUST check whether the user's ~/.pi folder exists before loading tools for a current flow.
- **FR-002**: The system MUST load tools from ~/.pi/tools when ~/.pi exists and the tools location is usable.
- **FR-003**: The system MUST create ./tools in the current local install folder when ~/.pi does not exist.
- **FR-004**: The system MUST load tools from ./tools after creating it in the no-~/.pi case.
- **FR-005**: The system MUST prefer ~/.pi/tools over ./tools when both locations are available.
- **FR-006**: The system MUST keep using the resolved tools location for the duration of the current flow.
- **FR-007**: The system MUST show a clear, user-facing error when the chosen tools location cannot be accessed or created.

### Key Entities *(include if feature involves data)*

- **Tool Source Location**: The folder selected for loading tools during a flow.
- **Current Flow**: One active run that resolves and uses a tools location.
- **Tools Folder**: The directory containing the tools used by the flow.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 100% of test runs where ~/.pi exists, current flows load tools from ~/.pi/tools without manual path selection.
- **SC-002**: In 100% of first-run test environments without ~/.pi, ./tools is created automatically before the flow proceeds.
- **SC-003**: At least 95% of test users can start a current flow without needing to know which tools folder is being used.
- **SC-004**: In all simulated access-failure cases, users receive a clear failure message instead of a silent fallback or crash.

## Assumptions

- "Current local install folder" refers to the repository or application root where the flow runs.
- The selected tools location already contains the expected tool set for the current flows.
- Tool selection is evaluated when a flow starts, not continuously while the flow is running.
- No changes are required to the tools themselves; only the location used to load them changes.
