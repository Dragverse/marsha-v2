#!/bin/bash

# Ceramic Network Setup Script for Dragverse
# This script helps set up Ceramic and ComposeDB for the project

set -e

echo "🎭 Dragverse - Ceramic Network Setup"
echo "====================================="
echo ""

# Use local ComposeDB CLI
COMPOSEDB="npx composedb"

echo "✅ Using local ComposeDB CLI"

# Check for admin seed
if [ -z "$CERAMIC_ADMIN_SEED" ]; then
    echo ""
    echo "🔑 No CERAMIC_ADMIN_SEED found in environment."
    echo "Generating a new admin seed..."
    echo ""

    SEED=$($COMPOSEDB did:generate-private-key)

    echo "Generated seed: $SEED"
    echo ""
    echo "⚠️  IMPORTANT: Add this to your .env.local file:"
    echo "CERAMIC_ADMIN_SEED=$SEED"
    echo ""

    read -p "Press enter to continue once you've saved the seed..."

    export CERAMIC_ADMIN_SEED=$SEED
fi

# Set Ceramic URL (default to Clay testnet)
CERAMIC_URL=${NEXT_PUBLIC_CERAMIC_URL:-"https://ceramic-clay.3boxlabs.com"}

echo ""
echo "📝 Using Ceramic URL: $CERAMIC_URL"
echo ""

# Create output directory
mkdir -p composites/__generated__
mkdir -p src/lib/ceramic/__generated__

echo "1️⃣  Merging GraphQL schemas..."
cat ./composites/00-creator.graphql \
    ./composites/01-video.graphql \
    ./composites/02-follow.graphql \
    ./composites/03-like.graphql \
    ./composites/04-comment.graphql \
    ./composites/05-livestream.graphql \
    ./composites/06-transaction.graphql \
    > ./composites/__generated__/merged-schema.graphql

echo "✅ Schemas merged"
echo ""

echo "2️⃣  Creating composite from merged schema..."
$COMPOSEDB composite:create \
  ./composites/__generated__/merged-schema.graphql \
  --output=./composites/__generated__/definition.json \
  --did-private-key=$CERAMIC_ADMIN_SEED \
  --ceramic-url=$CERAMIC_URL

echo "✅ Composite created"
echo ""

echo "3️⃣  Deploying composite to Ceramic Network..."
$COMPOSEDB composite:deploy \
  ./composites/__generated__/definition.json \
  --ceramic-url=$CERAMIC_URL \
  --did-private-key=$CERAMIC_ADMIN_SEED

echo "✅ Composite deployed"
echo ""

echo "4️⃣  Compiling runtime composite..."
$COMPOSEDB composite:compile \
  ./composites/__generated__/definition.json \
  ./src/lib/ceramic/__generated__/definition.js

echo "✅ Runtime composite compiled"
echo ""

echo "✅ Setup complete (TypeScript types generated with runtime composite)"
echo ""

echo "🎉 Ceramic setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure your .env.local has:"
echo "   NEXT_PUBLIC_CERAMIC_URL=$CERAMIC_URL"
echo "   CERAMIC_ADMIN_SEED=<your_seed>"
echo ""
echo "2. Import the runtime composite in your client code"
echo "3. Start using Ceramic for data storage!"
echo ""
