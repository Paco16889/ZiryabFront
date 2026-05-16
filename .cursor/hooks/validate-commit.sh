#!/usr/bin/env bash
# ------------------------------------------------------------------
# Hook: beforeShellExecution (matcher = "git commit")
# Valida el mensaje según .cursor/commit-format.conf
# Preferido: [CURSO-XX] descripción
# Alternativo: tipo(CURSO-XX): descripción (conventional)
# ------------------------------------------------------------------

input=$(cat)

command=$(echo "$input" | grep -oE '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | head -n1 | sed -E 's/.*"command"[[:space:]]*:[[:space:]]*"([^"]*)".*/\1/')

if ! echo "$command" | grep -qE 'git[[:space:]]+commit'; then
  echo '{"permission":"allow"}'
  exit 0
fi

message=$(echo "$command" | sed -nE 's/.*-m[[:space:]]+"([^"]+)".*/\1/p')
if [[ -z "$message" ]]; then
  message=$(echo "$command" | sed -nE "s/.*-m[[:space:]]+'([^']+)'.*/\1/p")
fi

if [[ -z "$message" ]]; then
  echo '{"permission":"allow"}'
  exit 0
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG="${SCRIPT_DIR}/../commit-format.conf"

PREFERRED_REGEX='^\[[A-Z]+-[0-9]+\][[:space:]]+.+'
ALT_REGEX='^(feat|fix|refactor|docs|style|test|chore|perf|build|ci)\([A-Z]+-[0-9]+\):[[:space:]]+.+'
PREFERRED_EXAMPLE='[CURSO-59] descripción breve'
ALT_EXAMPLE='feat(CURSO-59): descripción breve'

if [[ -f "$CONFIG" ]]; then
  # shellcheck disable=SC1090
  source "$CONFIG"
fi

if echo "$message" | grep -qE "$PREFERRED_REGEX" || echo "$message" | grep -qE "$ALT_REGEX"; then
  echo '{"permission":"allow"}'
else
  reason="El mensaje de commit no cumple el formato.\\nPreferido: ${PREFERRED_EXAMPLE}\\nAlternativo: ${ALT_EXAMPLE}\\nRecibido: ${message}"
  printf '{"permission":"deny","userMessage":"%s"}\n' "$reason"
fi
exit 0
