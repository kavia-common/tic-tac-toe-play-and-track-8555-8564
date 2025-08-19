'use strict';

/**
 * GameService encapsulates core game operations on top of repository.
 */
class GameService {
  constructor(gamesRepo) {
    this.gamesRepo = gamesRepo;
  }

  // PUBLIC_INTERFACE
  /**
   * Create a new game as the current user.
   */
  async createGame({ userId, as }) {
    const game = await this.gamesRepo.create({ creatorId: userId, as });
    return game;
  }

  // PUBLIC_INTERFACE
  /**
   * Join an existing game.
   */
  async joinGame({ userId, gameId }) {
    const game = await this.gamesRepo.join({ gameId, userId });
    if (!game) {
      const err = new Error('Game not found');
      err.code = 'NOT_FOUND';
      throw err;
    }
    return game;
  }

  // PUBLIC_INTERFACE
  /**
   * Get game by id.
   */
  async getGame({ gameId }) {
    const game = await this.gamesRepo.getById(gameId);
    if (!game) {
      const err = new Error('Game not found');
      err.code = 'NOT_FOUND';
      throw err;
    }
    return game;
  }

  // PUBLIC_INTERFACE
  /**
   * List games for user.
   */
  async listUserGames({ userId }) {
    return this.gamesRepo.listForUser(userId);
  }
}

module.exports = GameService;
