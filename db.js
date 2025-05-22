const Database = require('better-sqlite3');
const db = new Database('data.db');

// ساخت جداول در صورت عدم وجود
db.prepare(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id TEXT,
    amount REAL,
    paid INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT,
    used INTEGER DEFAULT 0
  )
`).run();

function createOrder(telegram_id, amount) {
  const stmt = db.prepare(`INSERT INTO orders (telegram_id, amount) VALUES (?, ?)`);
  const info = stmt.run(telegram_id, amount);
  return info.lastInsertRowid;
}

function markOrderPaid(orderId) {
  const stmt = db.prepare(`UPDATE orders SET paid = 1 WHERE id = ?`);
  stmt.run(orderId);
}

function getUnpaidOrders() {
  const stmt = db.prepare(`SELECT * FROM orders WHERE paid = 0`);
  return stmt.all();
}

function addAccount(username, password) {
  const stmt = db.prepare(`INSERT INTO accounts (username, password) VALUES (?, ?)`);
  stmt.run(username, password);
}

function getNextAvailableAccount() {
  const stmt = db.prepare(`SELECT * FROM accounts WHERE used = 0 LIMIT 1`);
  return stmt.get();
}

function markAccountAsUsed(id) {
  const stmt = db.prepare(`UPDATE accounts SET used = 1 WHERE id = ?`);
  stmt.run(id);
}

module.exports = {
  createOrder,
  markOrderPaid,
  getUnpaidOrders,
  addAccount,
  getNextAvailableAccount,
  markAccountAsUsed
};
