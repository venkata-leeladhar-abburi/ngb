#!/usr/bin/env bash
# PostToolUse (Edit/Write): format, then lint the file Claude just changed.
# ESLint and Stylelint run from the file's own package so its config applies.
path=$(jq -r '.tool_input.file_path // empty')
[ -n "$path" ] && [ -f "$path" ] || exit 0
root="$CLAUDE_PROJECT_DIR"
[ -x "$root/node_modules/.bin/prettier" ] || exit 0

"$root/node_modules/.bin/prettier" --write --log-level warn --ignore-unknown "$path" >&2

# Nearest package.json below the repo root.
pkg=$(dirname "$path")
while [ "$pkg" != "$root" ] && [ "$pkg" != "/" ] && [ ! -f "$pkg/package.json" ]; do
  pkg=$(dirname "$pkg")
done
cd "$pkg" || exit 0

report() {
  echo "$1 errors in $path (fix them now):" >&2
  echo "$2" >&2
  exit 2
}

case "$path" in
  *.ts | *.tsx | *.js | *.jsx | *.mjs | *.cjs)
    if [ -x node_modules/.bin/eslint ] && ! out=$(node_modules/.bin/eslint --fix --no-warn-ignored "$path" 2>&1); then
      report ESLint "$out"
    fi
    ;;
  *.css)
    if [ -x node_modules/.bin/stylelint ] && ! out=$(node_modules/.bin/stylelint --fix "$path" 2>&1); then
      report Stylelint "$out"
    fi
    ;;
esac
exit 0
