import assert from "node:assert/strict";
import { resolveToolsRoot } from "../../src/tools.ts";
import { createToolPathFixture, seedToolMarkers } from "./tools-test-utils.ts";

const fixture = createToolPathFixture({ withHomePi: true, withHomeTools: true, withLocalTools: true });
seedToolMarkers(fixture.homeToolsDir);
seedToolMarkers(fixture.localToolsDir);

const resolved = resolveToolsRoot({
  env: { ...fixture.env, PI_LISTENER_TOOLS_DIR: fixture.localToolsDir } as NodeJS.ProcessEnv,
  cwd: fixture.cwd,
});
assert.equal(resolved, fixture.homeToolsDir);
