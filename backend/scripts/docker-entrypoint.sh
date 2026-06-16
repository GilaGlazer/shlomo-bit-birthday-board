#!/bin/sh
set -e

echo "🔄 Pushing schema to database..."
npx prisma db push --accept-data-loss

echo "🌱 Seeding database..."
npx ts-node prisma/seed.ts || echo "⚠️  Seed skipped (already seeded or error)"

echo "🚀 Starting server..."
exec "$@"
