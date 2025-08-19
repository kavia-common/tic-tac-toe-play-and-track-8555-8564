'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**
 * AuthService handles user registration and login.
 * Passwords are hashed with PBKDF2 for demo purposes.
 * For production, consider Argon2/bcrypt/scrypt with proper parameters.
 */
class AuthService {
  constructor(usersRepo) {
    this.usersRepo = usersRepo;
  }

  // PUBLIC_INTERFACE
  /**
   * Register a user given username and plaintext password.
   * Returns public user object.
   */
  async register({ username, password }) {
    this._validateCredentials(username, password);

    const existing = await this.usersRepo.findByUsername(username);
    if (existing) {
      const err = new Error('Username already exists');
      err.code = 'USERNAME_TAKEN';
      throw err;
    }

    const passwordHash = await this._hashPassword(password);
    const user = await this.usersRepo.create({ username, passwordHash });
    return user;
  }

  // PUBLIC_INTERFACE
  /**
   * Login a user and return a JWT token and user info.
   */
  async login({ username, password }) {
    this._validateCredentials(username, password);

    const existing = await this.usersRepo.findByUsername(username);
    if (!existing) {
      const err = new Error('Invalid credentials');
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }

    const match = await this._verifyPassword(password, existing.passwordHash);
    if (!match) {
      const err = new Error('Invalid credentials');
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }

    const token = jwt.sign(
      { sub: existing.id, username: existing.username },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );

    return {
      token,
      user: { id: existing.id, username: existing.username },
    };
  }

  _validateCredentials(username, password) {
    if (!username || !password) {
      const err = new Error('Username and password are required');
      err.code = 'VALIDATION_ERROR';
      throw err;
    }
    if (typeof username !== 'string' || typeof password !== 'string') {
      const err = new Error('Invalid credential types');
      err.code = 'VALIDATION_ERROR';
      throw err;
    }
    if (username.length < 3 || password.length < 6) {
      const err = new Error('Username or password too short');
      err.code = 'VALIDATION_ERROR';
      throw err;
    }
  }

  async _hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const iterations = 100_000;
    const keylen = 64;
    const digest = 'sha512';
    const derived = await new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, derivedKey) => {
        if (err) return reject(err);
        resolve(derivedKey.toString('hex'));
      });
    });
    return `pbkdf2$${digest}$${iterations}$${salt}$${derived}`;
  }

  async _verifyPassword(password, stored) {
    try {
      const [scheme, digest, itersStr, salt, hash] = stored.split('$');
      if (scheme !== 'pbkdf2') return false;
      const iterations = parseInt(itersStr, 10);
      const keylen = 64;
      const derived = await new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, derivedKey) => {
          if (err) return reject(err);
          resolve(derivedKey.toString('hex'));
        });
      });
      return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'));
    } catch {
      return false;
    }
  }
}

module.exports = AuthService;
