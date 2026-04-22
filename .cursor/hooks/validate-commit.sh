#!/usr/bin/env bash
# ------------------------------------------------------------------
# Hook: beforeShellExecution (matcher = "git commit")
# Valida que el mensaje de commit siga el formato:
#   tipo(CLAVE-XX): descripción
# donde tipo ∈ {feat,fix,refactor,docs,style,test,chore,perf,build,ci}
# y CLAVE-XX es una clave Jira (ej. CURSO-12).
# ------------------------------------------------------------------

input=$(cat)

command=$(echo "$input" | grep -oE '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | head -n1 | sed -E 's/.*"command"[[:space:]]*:[[:space:]]*"([^"]*)".*/\1/')

# Solo validar si es realmente un git commit con -m
if ! echo "$command" | grep -qE 'git[[:space:]]+commit'; then
  echo '{"permission":"allow"}'
  exit 0
fi

# Extrae el mensaje después de -m "..." o -m '...'
message=$(echo "$command" | sed -nE 's/.*-m[[:space:]]+"([^"]+)".*/\1/p')
if [[ -z "$message" ]]; then
  message=$(echo "$command" | sed -nE "s/.*-m[[:space:]]+'([^']+)'.*/\1/p")
fi

if [[ -z "$message" ]]; then
  # No hay mensaje inline (-m); se abrirá el editor — lo dejamos pasar.
  echo '{"permission":"allow"}'
  exit 0
fi

regex='^(feat|fix|refactor|docs|style|test|chore|perf|build|ci)\([A-Z]+-[0-9]+\):[[:space:]]+.+'

if echo "$message" | grep -qE "$regex"; then
  echo '{"permission":"allow"}'
else
  reason="El mensaje de commit no cumple el formato requerido.\\nFormato esperado: tipo(CURSO-XX): descripción\\nEjemplos:\\n  feat(CURSO-4): añadir feature de productos\\n  fix(CURSO-12): corregir memory leak\\nMensaje recibido: ${message}"
  printf '{"permission":"deny","userMessage":"%s"}\n' "$reason"
fi
exit 0
