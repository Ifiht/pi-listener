import assert from "node:assert/strict";
import { resolveToolsRoot } from "../../src/tools.ts";
import { createToolPathFixture, seedToolMarkers } from "./tools-test-utils.ts";

const fixture = createToolPathFixture({ withLocalTools: true });
seedToolMarkers(fixture.localToolsDir);

const resolved = resolveToolsRoot({ env: fixture.env, cwd: fixture.cwd });
assert.equal(resolved, fixture.localToolsDir);
