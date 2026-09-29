#!/usr/bin/env bash
# Stop: run `pnpm typecheck` before Claude ends its turn, if TypeScript files changed.
# Does nothing until package.json has a typecheck script.
input=$(cat)
[ "$(echo "$input" | jq -r '.stop_hook_active // false')" = "true" ] && exit 0
cd "$CLAUDE_PROJECT_DIR" || exit 0
[ -f package.json ] && command -v pnpm >/dev/null || exit 0
jq -e '.scripts.typecheck' package.json >/dev/null 2>&1 || exit 0
git status --porcelain 2>/dev/null | grep -qE '\.(ts|tsx|mts|cts)$' || exit 0

if ! out=$(pnpm -s typecheck 2>&1); then
  echo "Typecheck failed. Fix these errors before finishing:" >&2
  echo "$out" | tail -60 >&2
  exit 2
fi
exit 0
