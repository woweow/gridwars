#!/bin/bash
set -e

RED=0
BLUE=0

while [[ $# -gt 0 ]]; do
  case $1 in
    --red)
      RED="$2"
      shift 2
      ;;
    --blue)
      BLUE="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: ./scripts/update-scores.sh --red <number> --blue <number>"
      exit 1
      ;;
  esac
done

echo "Setting scores: RED=$RED, BLUE=$BLUE"
npx convex run --prod scores:updateScores "{\"red\": $RED, \"blue\": $BLUE}"
