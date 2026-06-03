#!/usr/bin/env bash
# ------------------------------------------------------------------
# Hook: beforeShellExecution (failClosed = true)
# Protege comandos peligrosos o de producción pidiendo confirmación.
# Devuelve:
#   - "ask"   -> el usuario debe aceptar en Cursor antes de ejecutar
#   - "allow" -> ejecución directa
# ------------------------------------------------------------------

input=$(cat)

# Extrae el comando desde stdin sin depender de jq.
command=$(echo "$input" | grep -oE '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | head -n1 | sed -E 's/.*"command"[[:space:]]*:[[:space:]]*"([^"]*)".*/\1/')

reason=""
decision="allow"

case "$command" in
  *"rm -rf"*|*"git push --force"*)
    decision="ask"
    reason="Comando destructivo: puede eliminar archivos o historia irrecuperablemente."
    ;;
  *"ng build --configuration production"*|*"npm publish"*)
    decision="ask"
    reason="Operación de producción: verifica que es el entorno correcto antes de continuar."
    ;;
esac

if [[ "$decision" == "ask" ]]; then
  printf '{"permission":"ask","userMessage":"%s"}\n' "$reason"
else
  echo '{"permission":"allow"}'
fi
exit 0
