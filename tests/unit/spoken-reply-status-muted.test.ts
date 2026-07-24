import assert from "node:assert/strict";
import { formatSpokenReplyStatus } from "../../src/ui/spoken-reply-status.ts";

assert.equal(formatSpokenReplyStatus("muted"), "Muted");
