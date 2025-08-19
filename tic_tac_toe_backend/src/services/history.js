'use strict';

/**
 * HistoryService returns move history for games user is part of.
 */
class HistoryService {
  constructor(gamesRepo) {
    this.gamesRepo = gamesRepo;
  }

  // PUBLIC_INTERFACE
  /**
   * Get moves for a game the user belongs to.
   */
  async getHistory({ userId, gameId }) {
    const stored = this.gamesRepo.gamesById.get(gameId);
    if (!stored) {
      const err = new Error('Game not found');
      err.code = 'NOT_FOUND';
      throw err;
    }
    if (stored.players.X !== userId && stored.players.O !== userId) {
      const err = new Error('Forbidden');
      err.code = 'FORBIDDEN';
      throw err;
    }
    return stored.moves || [];
  }
}

module.exports = HistoryService;
