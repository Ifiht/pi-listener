# Quickstart: Extension Path Migration

1. Open the project and review path references that still mention `/.pi/tools`.
2. Update the active extension root references to `/.pi/agent/extensions/talk-pi`.
3. Run the relevant automated tests for startup, path resolution, and reference consistency.
4. Confirm the extension opens successfully when only the new extension path is available.
5. Confirm no standard user flow requires manual creation of `/.pi/tools`.
6. Review the documentation to ensure it matches the new extension location.

Validation note: repository code and active documentation now use `/.pi/agent/extensions/talk-pi`; remaining `/.pi/tools` mentions are limited to migration/spec history. Targeted path-resolution and startup tests passed.
