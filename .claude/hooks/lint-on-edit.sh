#!/usr/bin/env bash
# PostToolUse (Edit/Write): format and lint the file Claude just changed.
# Does nothing until the monorepo tooling (prettier, eslint) is installed.
path=$(jq -r '.tool_input.file_path // empty')
[ -n "$path" ] && [ -f "$path" ] || exit 0
cd "$CLAUDE_PROJECT_DIR" || exit 0
bin=node_modules/.bin

case "$path" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs|*.json|*.css|*.md|*.mdx|*.yml|*.yaml)
    [ -x "$bin/prettier" ] && "$bin/prettier" --write --log-level warn --ignore-unknown "$path" >&2 ;;
esac

case "$path" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs)
    if [ -x "$bin/eslint" ] && ! out=$("$bin/eslint" --fix --no-warn-ignored "$path" 2>&1); then
      echo "ESLint errors in $path (fix them now):" >&2
      echo "$out" >&2
      exit 2
    fi ;;
esac
exit 0
