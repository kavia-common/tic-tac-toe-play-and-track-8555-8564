'use strict';

const express = require('express');
const { auth: authMw } = require('../middleware');
const { UsersRepository } = require('../repositories/memory');
const AuthService = require('../services/auth');
const AuthController = require('../controllers/auth');

const usersRepo = new UsersRepository();
const authService = new AuthService(usersRepo);
const controller = new AuthController(authService);

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: User registration and login
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegisterRequest'
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Validation error or username taken
 */
router.post('/register', controller.register.bind(controller));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLoginRequest'
 *     responses:
 *       200:
 *         description: JWT token with user info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', controller.login.bind(controller));

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user by token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user or null
 */
router.get('/me', authMw(false), controller.me.bind(controller));

module.exports = router;
