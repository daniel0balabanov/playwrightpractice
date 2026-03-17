const { v4: uuidv4 } = require('uuid');

const CATEGORIES = ['work', 'personal', 'shopping', 'health', 'learning'];

const items = new Map();

function seed() {
  const seedData = [
    { title: 'Buy groceries', category: 'shopping', done: false },
    { title: 'Read Playwright docs', category: 'learning', done: false },
    { title: 'Morning run', category: 'health', done: true },
    { title: 'Finish project report', category: 'work', done: false },
    { title: 'Call dentist', category: 'health', done: false },
    { title: 'Learn TypeScript', category: 'learning', done: false },
    { title: 'Weekly review', category: 'work', done: true },
    { title: 'Buy birthday gift', category: 'shopping', done: false },
    { title: 'Meditate', category: 'personal', done: true },
    { title: 'Fix login bug', category: 'work', done: false },
    { title: 'Cook dinner', category: 'personal', done: false },
    { title: 'Read novel', category: 'personal', done: false },
  ];
  for (const data of seedData) {
    const id = uuidv4();
    items.set(id, { id, ...data, createdAt: new Date().toISOString(), userId: 'seed' });
  }
}

seed();

module.exports = { items, CATEGORIES };
