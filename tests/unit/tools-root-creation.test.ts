import assert from "node:assert/strict";
import fs from "node:fs";
import { resolveToolsRoot } from "../../src/tools.ts";
import { createToolPathFixture } from "./tools-test-utils.ts";

const fixture = createToolPathFixture();

const resolved = resolveToolsRoot({ env: fixture.env, cwd: fixture.cwd });
assert.equal(resolved, fixture.localToolsDir);
assert.equal(fs.existsSync(fixture.localToolsDir), true);
