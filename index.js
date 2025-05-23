import { Telegraf } from 'telegraf';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// DB setup
const db = new Database('signals.db');

// Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS signals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol TEXT,
    signal TEXT,
    score REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Example command
bot.command('start', ctx => {
  ctx.reply('ربات سیگنال طلا فعال است!');
});

// Example sending last signal
bot.command('signal', ctx => {
  const row = db.prepare('SELECT * FROM signals ORDER BY created_at DESC LIMIT 1').get();
  if (row) {
    ctx.reply(`📈 سیگنال اخیر برای ${row.symbol}:\n\n🔔 ${row.signal} (امتیاز: ${row.score})`);
  } else {
    ctx.reply('هنوز هیچ سیگنالی ثبت نشده.');
  }
});

// Launch bot
bot.launch().then(() => {
  console.log('📡 Bot is running...');
});
