'use strict';

/**
 * MoveService applies moves with user checks.
 */
class MoveService {
  constructor(gamesRepo) {
    this.gamesRepo = gamesRepo;
  }

  // PUBLIC_INTERFACE
  /**
   * Submit a move for gameId at row,col by userId.
   */
  async submitMove({ userId, gameId, row, col }) {
    const game = await this.gamesRepo.getById(gameId);
    if (!game) {
      const err = new Error('Game not found');
      err.code = 'NOT_FOUND';
      throw err;
    }

    // Determine player's side
    const stored = this.gamesRepo.gamesById.get(gameId); // internal for side lookup
    const side = stored.players.X === userId ? 'X' : stored.players.O === userId ? 'O' : null;
    if (!side) {
      const err = new Error('User is not a player in this game');
      err.code = 'FORBIDDEN';
      throw err;
    }

    const result = await this.gamesRepo.applyMove({ gameId, playerSide: side, row, col });
    if (result && result.error) {
      const err = new Error(result.error);
      err.code = result.error;
      err.game = result.game;
      throw err;
    }
    return result.game;
  }
}

module.exports = MoveService;
