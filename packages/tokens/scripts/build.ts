// Compiles src/tokens.json into dist/: theme.css (Tailwind v4 @theme), tokens.css, base.css, tokens.ts.
import { mkdirSync, writeFileSync } from "node:fs";

import { build } from "../src/lib/emit.ts";
import { loadTokens } from "../src/lib/tokens.ts";

const { files } = build(loadTokens(new URL("../src/tokens.json", import.meta.url)));
const dist = new URL("../dist/", import.meta.url);

mkdirSync(dist, { recursive: true });
for (const [name, content] of Object.entries(files)) {
  writeFileSync(new URL(name, dist), content);
}
console.warn(`@ngb/tokens: wrote dist/${Object.keys(files).join(", dist/")}`);
