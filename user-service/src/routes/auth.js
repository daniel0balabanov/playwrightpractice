const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { hashPassword, comparePassword, signToken } = require('../auth');
const { tokenBlacklist } = require('../store');
const { users } = require('../store');
const { requireAuth } = require('../middleware');

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email and password are required' });
  }
  const existing = [...users.values()].find(u => u.email === email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }
  const id = uuidv4();
  const passwordHash = await hashPassword(password);
  const user = { id, name, email, passwordHash, createdAt: new Date().toISOString() };
  users.set(id, user);
  const token = signToken({ userId: id });
  const { passwordHash: _, ...safeUser } = user;
  res.status(201).json({ token, user: safeUser });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }
  const user = [...users.values()].find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = signToken({ userId: user.id });
  const { passwordHash: _, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

router.post('/logout', requireAuth, (req, res) => {
  tokenBlacklist.add(req.token);
  res.status(204).send();
});

module.exports = router;
