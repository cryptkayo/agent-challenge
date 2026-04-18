#!/bin/sh

echo "Starting Mastra agent..."
npx mastra dev --dir src/mastra --host 0.0.0.0 &

echo "Starting Next.js..."
node server.js