#!/bin/bash
cd /home/kavia/workspace/code-generation/tic-tac-toe-play-and-track-8555-8564/tic_tac_toe_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

