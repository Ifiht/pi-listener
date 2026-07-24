import assert from "node:assert/strict";
import { normalizeSpokenText } from "../../src/tts/spoken-text.ts";

assert.equal(normalizeSpokenText("Olá, *tudo* bem?"), "Olá, tudo bem?");
assert.equal(normalizeSpokenText("**Muito**   legal"), "Muito legal");
assert.equal(
  normalizeSpokenText("# Título\n- item 1\n- item 2\nVeja [link](https://example.com) e `código`"),
  "Título item 1 item 2 Veja link e código",
);
assert.equal(normalizeSpokenText("```js\nconsole.log('x')\n```"), "");
