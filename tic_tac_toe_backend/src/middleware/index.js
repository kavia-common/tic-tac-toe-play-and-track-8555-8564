const jwt = require('jsonwebtoken');

/**
 * Simple JWT auth middleware scaffold.
 * Verifies bearer token if present and assigns req.user.
 * If required=true and token missing/invalid -> 401.
 */
function auth(required = true) {
  return (req, res, next) => {
    const header = req.headers['authorization'] || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      if (required) {
        return res.status(401).json({ message: 'Unauthorized: missing token' });
      }
      req.user = null;
      return next();
    }

    // PUBLIC_INTERFACE
    // Note: JWT_SECRET must be set in environment by the orchestrator.
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
      req.user = { id: payload.sub, username: payload.username };
      return next();
    } catch (e) {
      if (required) {
        return res.status(401).json({ message: 'Unauthorized: invalid token' });
      }
      req.user = null;
      return next();
    }
  };
}

module.exports = {
  auth,
};
