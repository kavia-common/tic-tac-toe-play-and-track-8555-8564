'use strict';

/**
 * HistoryController provides endpoints for retrieving move history.
 */
class HistoryController {
  constructor(historyService) {
    this.historyService = historyService;
  }

  // PUBLIC_INTERFACE
  /**
   * Get move history for a game the current user participates in.
   * Params: { id } - game id
   * Returns: array of moves
   */
  async getForGame(req, res) {
    try {
      const { id } = req.params;
      const moves = await this.historyService.getHistory({ userId: req.user.id, gameId: id });
      return res.status(200).json(moves);
    } catch (e) {
      const status = e.code === 'NOT_FOUND' ? 404 : e.code === 'FORBIDDEN' ? 403 : 500;
      return res.status(status).json({ message: e.message });
    }
  }
}

module.exports = HistoryController;
