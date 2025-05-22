const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { checkAndUpdatePayments } = require('./checkPayments');

const TELEGRAM_BOT_TOKEN = 'توکن ربات تلگرام خودت را اینجا بگذار';

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `سلام! برای ثبت سفارش خرید اکانت لطفاً مقدار پول و شناسه تلگرام خود را ارسال کنید به شکل زیر:

مثال:
10000
`);
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.trim();

  if (!/^\d+$/.test(text)) {
    return bot.sendMessage(chatId, 'لطفاً فقط مبلغ خرید را به عدد وارد کنید.');
  }

  const amount = Number(text);

  try {
    const response = await axios.post('http://localhost:3000/order', {
      telegram_id: chatId.toString(),
      amount
    });

    const data = response.data;
    bot.sendMessage(chatId, `سفارش شما ثبت شد.

لطفاً مبلغ دقیق را به آدرس زیر واریز کنید:
${data.payTo}

${data.note}

و پس از پرداخت، منتظر دریافت اکانت باشید.`);
  } catch (err) {
    bot.sendMessage(chatId, 'خطا در ثبت سفارش، لطفاً دوباره تلاش کنید.');
  }
});

// اجرای چکر پرداخت‌ها هر 1 دقیقه
const cron = require('node-cron');
cron.schedule('*/1 * * * *', async () => {
  console.log('[🔁] بررسی خودکار پرداخت‌ها...');
  await checkAndUpdatePayments();
});

console.log('ربات تلگرام در حال اجرا است...');
