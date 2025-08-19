'use strict';

const express = require('express');
const { auth } = require('../middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Realtime
 *     description: Real-time updates (structure only)
 */

/**
 * @swagger
 * /realtime/usage:
 *   get:
 *     summary: Real-time updates usage
 *     description: >
 *       Placeholder endpoint describing future real-time integration (WebSocket or SSE).
 *       For now, clients should poll GET /moves/{id} to fetch latest game state and
 *       GET /history/{id} for history.
 *     tags: [Realtime]
 *     responses:
 *       200:
 *         description: Usage information
 */
router.get('/usage', auth(false), (req, res) => {
  return res.status(200).json({
    message:
      'Real-time updates are not yet implemented. Poll /moves/{id} for state and /history/{id} for moves. Planned: WebSocket channel /ws/games/{id}.',
  });
});

module.exports = router;
