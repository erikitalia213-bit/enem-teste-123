#!/usr/bin/env bash
# Testa as migrations + RLS num Postgres local descartável.
# Uso: PGHOST=... PGPORT=... PGUSER=postgres ./supabase/testes/rodar.sh
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
DB="teste_protocolo_42_$$"
createdb "$DB"
trap 'dropdb --if-exists "$DB"' EXIT
PGOPTIONS="-c client_min_messages=warning" psql -q -o /dev/null -v ON_ERROR_STOP=1 -d "$DB" -f "$DIR/00_stub_auth.sql"
for f in "$DIR"/../migrations/*.sql; do
  PGOPTIONS="-c client_min_messages=warning" psql -q -v ON_ERROR_STOP=1 -d "$DB" -f "$f"
done
PGOPTIONS="-c client_min_messages=warning" psql -q -o /dev/null -v ON_ERROR_STOP=1 -d "$DB" -f "$DIR/10_rls.sql" && echo "✔ Migrations e RLS OK"
