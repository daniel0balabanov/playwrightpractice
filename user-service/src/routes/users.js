const router = require('express').Router();
const { requireAuth } = require('../middleware');
const { hashPassword, comparePassword } = require('../auth');
const { users, tokenBlacklist } = require('../store');

router.get('/me', requireAuth, (req, res) => {
  const { passwordHash: _, ...safeUser } = req.user;
  res.json(safeUser);
});

router.put('/me', requireAuth, async (req, res) => {
  const { name, email } = req.body;
  const user = req.user;
  if (email && email !== user.email) {
    const existing = [...users.values()].find(u => u.email === email && u.id !== user.id);
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }
    user.email = email;
  }
  if (name) user.name = name;
  users.set(user.id, user);
  const { passwordHash: _, ...safeUser } = user;
  res.json(safeUser);
});

router.put('/me/password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'currentPassword and newPassword are required' });
  }
  const valid = await comparePassword(currentPassword, req.user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }
  req.user.passwordHash = await hashPassword(newPassword);
  users.set(req.user.id, req.user);
  res.json({ message: 'Password updated' });
});

router.delete('/me', requireAuth, (req, res) => {
  tokenBlacklist.add(req.token);
  users.delete(req.user.id);
  res.status(204).send();
});

module.exports = router;
