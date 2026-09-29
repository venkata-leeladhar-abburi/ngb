#!/usr/bin/env bash
# Stop: before Claude ends its turn, typecheck and test the packages it changed (and their dependants).
# If anything fails, Claude keeps working (exit 2). The loop guard stops a second forced retry.
input=$(cat)
[ "$(echo "$input" | jq -r '.stop_hook_active // false')" = "true" ] && exit 0
cd "$CLAUDE_PROJECT_DIR" || exit 0
[ -x node_modules/.bin/turbo ] || exit 0
git status --porcelain 2>/dev/null | grep -qE '\.(ts|tsx|mts|cts|js|mjs|json|css)$' || exit 0

if ! out=$(node_modules/.bin/turbo run typecheck test --filter='...[HEAD]' --output-logs=errors-only 2>&1); then
  echo "Typecheck or tests failed for the changed packages. Fix these before finishing:" >&2
  echo "$out" | tail -80 >&2
  exit 2
fi
exit 0
