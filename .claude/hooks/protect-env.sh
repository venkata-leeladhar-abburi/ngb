#!/usr/bin/env bash
# PreToolUse (Edit/Write): block edits to secrets files. .env.example and .env.sample stay editable.
path=$(jq -r '.tool_input.file_path // .tool_input.notebook_path // empty')
case "$(basename "$path")" in
  .env.example|.env.sample) exit 0 ;;
  .env|.env.*)
    echo "Blocked: $path holds secrets. Tell the user what to change and let them edit it by hand." >&2
    exit 2 ;;
esac
exit 0
