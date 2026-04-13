#!/bin/sh
# Auto-detect SAIP environment from git branch and apply the right .env.{env} file.
#
# Usage:
#   ./set-env.sh            # auto-detect from git branch
#   ./set-env.sh staging    # explicit environment
#
# Called automatically via: npm run build:auto

ENV="${1}"

if [ -z "$ENV" ]; then
  BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
  case "$BRANCH" in
    development|dev)                       ENV="development" ;;
    test|testing)                          ENV="test" ;;
    staging|stage)                         ENV="staging" ;;
    production|prod|main|master)           ENV="production" ;;
    *)                                     ENV="test" ;;
  esac
  echo "[set-env] Branch: $BRANCH → Environment: $ENV"
else
  echo "[set-env] Explicit environment: $ENV"
fi

ENV_FILE=".env.${ENV}"

if [ ! -f "$ENV_FILE" ]; then
  echo "[set-env] ERROR: $ENV_FILE not found!"
  exit 1
fi

# Set the variable for the current build process
export NEXT_PUBLIC_SAIP_ENV="$ENV"
echo "[set-env] NEXT_PUBLIC_SAIP_ENV=$ENV (from $ENV_FILE)"
