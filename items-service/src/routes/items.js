const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { items, CATEGORIES } = require('../store');
const { requireAuth } = require('../middleware');

router.get('/categories', requireAuth, (req, res) => {
  res.json(CATEGORIES);
});

router.get('/', requireAuth, (req, res) => {
  let result = [...items.values()];

  const { category, done, search, page = '1', limit = '10', sortBy = 'createdAt', order = 'desc' } = req.query;

  if (category) {
    result = result.filter(i => i.category === category);
  }
  if (done !== undefined) {
    result = result.filter(i => i.done === (done === 'true'));
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(i => i.title.toLowerCase().includes(q));
  }

  result.sort((a, b) => {
    const aVal = a[sortBy] ?? '';
    const bVal = b[sortBy] ?? '';
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return order === 'asc' ? cmp : -cmp;
  });

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const total = result.length;
  const totalPages = Math.ceil(total / limitNum);
  const data = result.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  res.json({ data, meta: { page: pageNum, limit: limitNum, total, totalPages } });
});

router.post('/', requireAuth, (req, res) => {
  const { title, category, done = false } = req.body;
  if (!title || !category) {
    return res.status(400).json({ error: 'title and category are required' });
  }
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `category must be one of: ${CATEGORIES.join(', ')}` });
  }
  const id = uuidv4();
  const item = { id, title, category, done, createdAt: new Date().toISOString(), userId: req.user.userId };
  items.set(id, item);
  res.status(201).json(item);
});

router.get('/:id', requireAuth, (req, res) => {
  const item = items.get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

router.put('/:id', requireAuth, (req, res) => {
  const item = items.get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  const { title, category, done } = req.body;
  if (category && !CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `category must be one of: ${CATEGORIES.join(', ')}` });
  }
  if (title !== undefined) item.title = title;
  if (category !== undefined) item.category = category;
  if (done !== undefined) item.done = done;
  items.set(item.id, item);
  res.json(item);
});

router.delete('/:id', requireAuth, (req, res) => {
  if (!items.has(req.params.id)) return res.status(404).json({ error: 'Item not found' });
  items.delete(req.params.id);
  res.status(204).send();
});

router.post('/:id/toggle', requireAuth, (req, res) => {
  const item = items.get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  item.done = !item.done;
  items.set(item.id, item);
  res.json(item);
});

module.exports = router;
