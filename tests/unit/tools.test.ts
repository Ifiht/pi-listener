import assert from "node:assert/strict";
import path from "node:path";
import { executableName, resolveToolPath, resolveToolsRoot } from "../../src/tools.ts";
import { createToolPathFixture, seedToolMarkers } from "./tools-test-utils.ts";

const fixture = createToolPathFixture({ withLocalTools: true });
seedToolMarkers(fixture.localToolsDir);

const packageRootTools = resolveToolsRoot({ env: fixture.env, cwd: fixture.cwd });
assert.equal(packageRootTools, fixture.localToolsDir);
assert.equal(
  resolveToolPath(["piper", executableName("piper")], { env: fixture.env, cwd: fixture.cwd }),
  path.join(fixture.localToolsDir, "piper", executableName("piper")),
);
assert.equal(
  resolveToolsRoot({ env: { PI_LISTENER_TOOLS_DIR: "/custom/tools", HOME: fixture.homeDir, USERPROFILE: fixture.homeDir } as NodeJS.ProcessEnv, cwd: fixture.cwd }),
  "/custom/tools",
);
