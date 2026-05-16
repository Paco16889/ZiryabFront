#!/usr/bin/env bash
# ------------------------------------------------------------------
# Hook: beforeShellExecution (matcher = "git commit")
# Valida el mensaje según .cursor/commit-format.conf
# Preferido: [CURSO-XX] descripción
# Alternativo: tipo(CURSO-XX): descripción (conventional)
# ------------------------------------------------------------------

input=$(cat)

# El JSON del hook puede incluir comillas escapadas dentro de "command"
command=$(echo "$input" | sed -E 's/^\{[[:space:]]*"command"[[:space:]]*:[[:space:]]*"//' | sed -E 's/"[[:space:]]*\}[[:space:]]*$//' | sed 's/\\"/"/g')

if ! echo "$command" | grep -qE 'git[[:space:]]+commit'; then
  echo '{"permission":"allow"}'
  exit 0
fi

message=$(echo "$command" | sed -nE 's/.*-m[[:space:]]+"([^"]+)".*/\1/p')
if [[ -z "$message" ]]; then
  message=$(echo "$command" | sed -nE "s/.*-m[[:space:]]+'([^']+)'.*/\1/p")
fi
if [[ -z "$message" ]] && echo "$command" | grep -qE -- '-m[[:space:]]+'; then
  message=$(echo "$command" | sed -E 's/.*-m[[:space:]]+//' | sed -E 's/^\\?"//' | sed -E 's/\\?"$//')
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
