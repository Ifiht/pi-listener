import assert from "node:assert/strict";
import { createMuteState } from "../../src/ui/mute-state.ts";

const muteState = createMuteState();

assert.equal(muteState.isMuted(), false);
assert.equal(muteState.mute(), true);
assert.equal(muteState.isMuted(), true);
assert.equal(muteState.toggle(), false);
assert.equal(muteState.isMuted(), false);
assert.equal(muteState.unmute(), false);
assert.equal(muteState.isMuted(), false);
