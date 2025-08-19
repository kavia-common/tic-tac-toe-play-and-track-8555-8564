# Tic Tac Toe Backend API (Express)

- Docs: /docs
- Health: GET /
- Auth:
  - POST /auth/register { username, password }
  - POST /auth/login { username, password } -> { token, user }
  - GET /auth/me (Bearer token)
- Games:
  - POST /games (Bearer) { as?: "X" | "O" }
  - POST /games/join (Bearer) { gameId }
  - GET /games/mine (Bearer)
  - GET /games/{id} (Bearer)
- Moves:
  - POST /moves (Bearer) { gameId, row, col }
  - GET /moves/{id} (Bearer)
- History:
  - GET /history/{id} (Bearer)
- Realtime:
  - GET /realtime/usage — placeholder guidance

Environment:
- JWT_SECRET must be provided by orchestrator. See .env.example.
