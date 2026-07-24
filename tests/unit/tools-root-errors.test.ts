import assert from "node:assert/strict";
import fs from "node:fs";
import { resolveToolsRoot } from "../../src/tools.ts";
import { createToolPathFixture } from "./tools-test-utils.ts";

const failureFixture = createToolPathFixture({ localToolsAsFile: true });
assert.throws(
  () => resolveToolsRoot({ env: failureFixture.env, cwd: failureFixture.cwd }),
  /Unable to prepare local tools folder/,
);

const migratedFixture = createToolPathFixture({ withHomePi: true });
const migratedRoot = resolveToolsRoot({ env: migratedFixture.env, cwd: migratedFixture.cwd });
assert.equal(migratedRoot, migratedFixture.homeToolsDir);
assert.equal(fs.existsSync(migratedFixture.homeToolsDir), true);
