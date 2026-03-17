const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET = process.env.JWT_SECRET || 'playwright-dev-secret';

function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '1h' });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = { signToken, verifyToken, hashPassword, comparePassword };
