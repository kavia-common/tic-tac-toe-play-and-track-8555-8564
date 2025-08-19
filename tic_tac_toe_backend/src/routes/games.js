'use strict';

const express = require('express');
const { auth } = require('../middleware');
const { GamesRepository } = require('../repositories/memory');
const GameService = require('../services/game');
const GamesController = require('../controllers/games');

// Single shared in-memory repo instance for the app runtime
const gamesRepo = new GamesRepository();
const gameService = new GameService(gamesRepo);
const controller = new GamesController(gameService);

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Games
 *     description: Game creation, joining, and retrieval
 */

/**
 * @swagger
 * /games:
 *   post:
 *     summary: Create a new game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGameRequest'
 *     responses:
 *       201:
 *         description: Game created
 */
router.post('/', auth(true), controller.create.bind(controller));

/**
 * @swagger
 * /games/join:
 *   post:
 *     summary: Join an existing game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JoinGameRequest'
 *     responses:
 *       200:
 *         description: Joined game
 *       404:
 *         description: Game not found
 */
router.post('/join', auth(true), controller.join.bind(controller));

/**
 * @swagger
 * /games/mine:
 *   get:
 *     summary: List games for current user
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of games
 */
router.get('/mine', auth(true), controller.listMine.bind(controller));

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     summary: Get a game by ID
 *     tags: [Games]
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
 *         description: Game object
 *       404:
 *         description: Not found
 */
router.get('/:id', auth(true), controller.get.bind(controller));

// Export the repo so moves/history can share same instance
router.gamesRepo = gamesRepo;

module.exports = router;
