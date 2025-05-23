const { Telegraf } = require('telegraf');
const express = require('express');

// تنظیمات ربات
const BOT_TOKEN = process.env.BOT_TOKEN || '8038925678:AAG4rhHxVOgp2fiRFFUF3QF7Av50cFNKfXE'; // توکن خودتو وارد کن اگه از ENV استفاده نمی‌کنی
const bot = new Telegraf(BOT_TOKEN);

// فرمان‌های ربات
bot.start((ctx) => ctx.reply('سلام فرنام! ربات روشنه ✅'));
bot.help((ctx) => ctx.reply('از دستور /start استفاده کن برای شروع.'));

bot.command('ping', (ctx) => ctx.reply('pong 🏓'));

// راه‌اندازی ربات با polling
bot.launch();
console.log('🤖 ربات با polling راه‌اندازی شد.');

// پورت ساختگی برای Render (اجباری!)
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('ربات روشنه و با polling کار می‌کنه ✅');
});

app.listen(PORT, () => {
  console.log(`🌐 Server listening on port ${PORT}`);
});

// جلوگیری از بسته شدن با CTRL+C
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
