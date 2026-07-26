#!/bin/bash
# Script to deploy Supabase database migrations

if [ -z "$1" ]; then
  echo "Usage: ./scripts/deploy-database.sh <db-password>"
  echo "Alternative: Run 'npx supabase login', 'npx supabase link --project-ref dtbhipqvkknbapjsbrlx', then 'npx supabase db push'"
  exit 1
fi

DB_PASSWORD=$1
DB_URL="postgresql://postgres:${DB_PASSWORD}@db.dtbhipqvkknbapjsbrlx.supabase.co:5432/postgres"

echo "Applying migrations to Supabase project 'dtbhipqvkknbapjsbrlx'..."
npx supabase db push --db-url "${DB_URL}"

if [ $? -eq 0 ]; then
  echo "Migrations applied successfully!"
else
  echo "Failed to apply migrations. Please verify your database password."
fi
