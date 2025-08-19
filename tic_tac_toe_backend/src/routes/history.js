'use strict';

const express = require('express');
const { auth } = require('../middleware');
const gamesRoutes = require('./games');
const HistoryService = require('../services/history');
const HistoryController = require('../controllers/history');

const gamesRepo = gamesRoutes.gamesRepo;
const historyService = new HistoryService(gamesRepo);
const controller = new HistoryController(historyService);

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: History
 *     description: Game history retrieval
 */

/**
 * @swagger
 * /history/{id}:
 *   get:
 *     summary: Get move history for a game
 *     tags: [History]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Move list
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.get('/:id', auth(true), controller.getForGame.bind(controller));

module.exports = router;
