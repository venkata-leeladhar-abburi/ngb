#!/usr/bin/env bash
# PreToolUse (Edit/Write): block edits the playbook forbids (section 8):
# secrets (.env*, except examples), the lockfile, and applied database migrations.
path=$(jq -r '.tool_input.file_path // .tool_input.notebook_path // empty')
[ -n "$path" ] || exit 0

block() {
  echo "Blocked: $path. $1" >&2
  exit 2
}

case "$(basename "$path")" in
  .env.example | .env.sample) ;;
  .env | .env.*) block "It holds secrets. Tell the user what to change and let them edit it by hand." ;;
  pnpm-lock.yaml) block "Never edit the lockfile by hand. Change package.json and run pnpm install." ;;
esac

case "$path" in
  */apps/web/db/migrations/*)
    [ -e "$path" ] && block "Applied migrations are immutable. Change db/schema.ts and run pnpm db:generate."
    ;;
esac
exit 0
