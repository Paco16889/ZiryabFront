Cte joder para para par
#!/usr/bin/env bash
# ------------------------------------------------------------------
# Hook: afterFileEdit
# Formatea automáticamente los ficheros que edita el agente.
# Fail open: si prettier/eslint no están instalados, no rompe el flujo.
# En Windows, ejecutar bajo Git Bash (los hooks requieren shell POSIX).
# ------------------------------------------------------------------

input=$(cat)

# Extrae la ruta del fichero editado (JSON desde stdin).
# Usamos grep+sed en vez de jq para no depender de jq.
file=$(echo "$input" | grep -oE '"path"[[:space:]]*:[[:space:]]*"[^"]+"' | head -n1 | sed -E 's/.*"path"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/')

if [[ -z "$file" || ! -f "$file" ]]; then
  echo '{}'
  exit 0
fi

case "$file" in
  *.ts)
    npx --no-install prettier --write "$file" >/dev/null 2>&1
    npx --no-install eslint --fix "$file" >/dev/null 2>&1
    ;;
  *.html|*.scss|*.css|*.json|*.md)
    npx --no-install prettier --write "$file" >/dev/null 2>&1
    ;;
esac

echo '{}'
exit 0
