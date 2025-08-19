'use strict';

class MovesController {
  constructor(moveService, gamesRepo) {
    this.moveService = moveService;
    this.gamesRepo = gamesRepo;
  }

  // PUBLIC_INTERFACE
  async submit(req, res) {
    try {
      const { gameId, row, col } = req.body || {};
      const game = await this.moveService.submitMove({
        userId: req.user.id,
        gameId,
        row,
        col,
      });
      // placeholder for realtime broadcast hook
      // e.g., this.realtime.publishMove(game)
      return res.status(200).json(game);
    } catch (e) {
      const code = e.code || '';
      const status =
        code === 'NOT_FOUND' ? 404 : code === 'FORBIDDEN' || code === 'NOT_YOUR_TURN' ? 403 : 400;
      return res.status(status).json({ message: e.message, game: e.game || undefined });
    }
  }

  // PUBLIC_INTERFACE
  async get(req, res) {
    try {
      const { id } = req.params;
      const game = await this.gamesRepo.getById(id);
      if (!game) return res.status(404).json({ message: 'Game not found' });
      return res.status(200).json(game);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }
}

module.exports = MovesController;
