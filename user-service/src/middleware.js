const { verifyToken } = require('./auth');
const { tokenBlacklist, users } = require('./store');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }
  const token = authHeader.slice(7);
  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ error: 'Token has been revoked' });
  }
  try {
    const payload = verifyToken(token);
    if (!users.has(payload.userId)) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = users.get(payload.userId);
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { requireAuth };
