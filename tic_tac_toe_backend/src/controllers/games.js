'use strict';

/**
 * GamesController handles creation, join, get, list.
 */
class GamesController {
  constructor(gameService) {
    this.gameService = gameService;
  }

  // PUBLIC_INTERFACE
  async create(req, res) {
    try {
      const { as } = req.body || {};
      const game = await this.gameService.createGame({ userId: req.user.id, as });
      return res.status(201).json(game);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }

  // PUBLIC_INTERFACE
  async join(req, res) {
    try {
      const { gameId } = req.body || {};
      const game = await this.gameService.joinGame({ userId: req.user.id, gameId });
      return res.status(200).json(game);
    } catch (e) {
      const status = e.code === 'NOT_FOUND' ? 404 : 500;
      return res.status(status).json({ message: e.message });
    }
  }

  // PUBLIC_INTERFACE
  async get(req, res) {
    try {
      const { id } = req.params;
      const game = await this.gameService.getGame({ gameId: id });
      return res.status(200).json(game);
    } catch (e) {
      const status = e.code === 'NOT_FOUND' ? 404 : 500;
      return res.status(status).json({ message: e.message });
    }
  }

  // PUBLIC_INTERFACE
  async listMine(req, res) {
    try {
      const games = await this.gameService.listUserGames({ userId: req.user.id });
      return res.status(200).json(games);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }
}

module.exports = GamesController;
