'use strict';

const jwt = require('jsonwebtoken');

/**
 * AuthController provides endpoints for user registration and login.
 */
class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  // PUBLIC_INTERFACE
  /**
   * Register a user.
   * Body: { username, password }
   * Returns: public user object.
   */
  async register(req, res) {
    try {
      const { username, password } = req.body || {};
      const user = await this.authService.register({ username, password });
      return res.status(201).json(user);
    } catch (e) {
      const status = e.code === 'USERNAME_TAKEN' || e.code === 'VALIDATION_ERROR' ? 400 : 500;
      return res.status(status).json({ message: e.message });
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Login a user.
   * Body: { username, password }
   * Returns: { token, user }
   */
  async login(req, res) {
    try {
      const { username, password } = req.body || {};
      const result = await this.authService.login({ username, password });
      return res.status(200).json(result);
    } catch (e) {
      const status = e.code === 'INVALID_CREDENTIALS' ? 401 : 500;
      return res.status(status).json({ message: e.message });
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Utility endpoint to validate token and return current user.
   */
  async me(req, res) {
    try {
      const header = req.headers['authorization'] || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;
      if (!token) {
        return res.status(200).json({ user: null });
      }
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
      return res.status(200).json({ user: { id: payload.sub, username: payload.username } });
    } catch {
      return res.status(200).json({ user: null });
    }
  }
}

module.exports = AuthController;
