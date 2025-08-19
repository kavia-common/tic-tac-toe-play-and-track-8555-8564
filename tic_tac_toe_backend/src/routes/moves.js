'use strict';

const express = require('express');
const { auth } = require('../middleware');
const gamesRoutes = require('./games'); // to access shared repo instance
const MoveService = require('../services/move');
const MovesController = require('../controllers/moves');

const gamesRepo = gamesRoutes.gamesRepo;
const moveService = new MoveService(gamesRepo);
const controller = new MovesController(moveService, gamesRepo);

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Moves
 *     description: Submit and get game moves/state
 */

/**
 * @swagger
 * /moves:
 *   post:
 *     summary: Submit a move
 *     tags: [Moves]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MoveRequest'
 *     responses:
 *       200:
 *         description: Updated game state
 *       400:
 *         description: Invalid move
 *       403:
 *         description: Not your turn or not a player
 *       404:
 *         description: Game not found
 */
router.post('/', auth(true), controller.submit.bind(controller));

/**
 * @swagger
 * /moves/{id}:
 *   get:
 *     summary: Get game state by ID
 *     tags: [Moves]
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
 *         description: Current game state
 *       404:
 *         description: Not found
 */
router.get('/:id', auth(true), controller.get.bind(controller));

module.exports = router;
