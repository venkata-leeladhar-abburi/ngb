# @ngb/tokens

The only place design values live. **Filled in Phase 3** (see `docs/strategy/build-playbook.md`).

Phase 3 will:

1. Move `docs/design/tokens.json` to `src/tokens.json` (three tiers: primitive, semantic, component).
2. Add a `tokens:build` script that compiles it to CSS variables plus a Tailwind v4 `@theme`, reset so only token utilities exist.
3. Export the CSS for `apps/web` and `packages/ui` to import.

Lint blocks raw hex, colour functions, px, shadows and z-index everywhere except this package.
