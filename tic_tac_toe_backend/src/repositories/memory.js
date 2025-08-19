'use strict';

/**
 * In-memory repositories for users and games.
 * This is a placeholder for later replacement with tic_tac_toe_database.
 * All methods return Promises to preserve async DB-like behavior.
 */

const crypto = require('crypto');

function genId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

class UsersRepository {
  constructor() {
    this.usersById = new Map();
    this.usersByUsername = new Map();
  }

  async create({ username, passwordHash }) {
    const id = genId('usr');
    const user = { id, username, passwordHash, createdAt: new Date().toISOString() };
    this.usersById.set(id, user);
    this.usersByUsername.set(username, user);
    return { id, username, createdAt: user.createdAt };
  }

  async findByUsername(username) {
    return this.usersByUsername.get(username) || null;
  }

  async findById(id) {
    const u = this.usersById.get(id);
    if (!u) return null;
    return { id: u.id, username: u.username, createdAt: u.createdAt };
  }
}

class GamesRepository {
  constructor() {
    this.gamesById = new Map();
  }

  async create({ creatorId, as }) {
    const id = genId('game');
    const now = new Date().toISOString();
    const players = { X: null, O: null };
    const side = as === 'O' ? 'O' : 'X';
    players[side] = creatorId;

    const game = {
      id,
      board: [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ],
      players,
      nextTurn: 'X',
      status: 'WAITING',
      moves: [],
      createdAt: now,
      updatedAt: now,
    };
    this.gamesById.set(id, game);
    return this._public(game);
  }

  async getById(id) {
    const g = this.gamesById.get(id);
    return g ? this._public(g) : null;
  }

  async listForUser(userId) {
    const items = [];
    for (const g of this.gamesById.values()) {
      if (g.players.X === userId || g.players.O === userId) {
        items.push(this._public(g));
      }
    }
    items.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    return items;
  }

  async join({ gameId, userId }) {
    const g = this.gamesById.get(gameId);
    if (!g) return null;

    if (g.players.X === userId || g.players.O === userId) {
      return this._public(g);
    }

    if (!g.players.X) {
      g.players.X = userId;
    } else if (!g.players.O) {
      g.players.O = userId;
    } else {
      return this._public(g);
    }

    if (g.players.X && g.players.O) {
      g.status = 'IN_PROGRESS';
    } else {
      g.status = 'WAITING';
    }
    g.updatedAt = new Date().toISOString();
    return this._public(g);
  }

  async applyMove({ gameId, playerSide, row, col }) {
    const g = this.gamesById.get(gameId);
    if (!g) return null;

    // Basic validations
    if (g.status !== 'IN_PROGRESS') {
      return { error: 'GAME_NOT_IN_PROGRESS', game: this._public(g) };
    }
    if (g.nextTurn !== playerSide) {
      return { error: 'NOT_YOUR_TURN', game: this._public(g) };
    }
    if (row < 0 || row > 2 || col < 0 || col > 2) {
      return { error: 'OUT_OF_BOUNDS', game: this._public(g) };
    }
    if (g.board[row][col] !== '') {
      return { error: 'CELL_TAKEN', game: this._public(g) };
    }

    g.board[row][col] = playerSide;
    g.moves.push({ row, col, player: playerSide, at: new Date().toISOString() });

    // Compute status
    const status = this._computeStatus(g.board);
    if (status === 'X' || status === 'O') {
      g.status = status === 'X' ? 'X_WON' : 'O_WON';
    } else if (status === 'DRAW') {
      g.status = 'DRAW';
    } else {
      g.status = 'IN_PROGRESS';
      g.nextTurn = playerSide === 'X' ? 'O' : 'X';
    }

    g.updatedAt = new Date().toISOString();
    return { game: this._public(g) };
  }

  _computeStatus(board) {
    const lines = [
      // rows
      [board[0][0], board[0][1], board[0][2]],
      [board[1][0], board[1][1], board[1][2]],
      [board[2][0], board[2][1], board[2][2]],
      // cols
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][2], board[2][2]],
      // diagonals
      [board[0][0], board[1][1], board[2][2]],
      [board[0][2], board[1][1], board[2][0]],
    ];

    for (const line of lines) {
      if (line[0] && line[0] === line[1] && line[1] === line[2]) {
        return line[0]; // 'X' or 'O'
      }
    }

    // Draw if board is full
    const isFull = board.every((row) => row.every((c) => c !== ''));
    if (isFull) return 'DRAW';

    return 'IN_PROGRESS';
  }

  _public(g) {
    return JSON.parse(
      JSON.stringify({
        id: g.id,
        board: g.board,
        players: g.players,
        nextTurn: g.nextTurn,
        status: g.status,
        moves: g.moves,
        createdAt: g.createdAt,
        updatedAt: g.updatedAt,
      })
    );
  }
}

module.exports = {
  UsersRepository,
  GamesRepository,
};
