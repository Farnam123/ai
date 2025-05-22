const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const {
  getUnpaidOrders,
  markOrderPaid,
  getNextAvailableAccount,
  markAccountAsUsed
} = require('./db');

const TELEGRAM_BOT_TOKEN = 'توکن ربات تلگرام خودت را اینجا بگذار';
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

async function checkAndUpdatePayments() {
  const unpaidOrders = getUnpaidOrders();

  for (const order of unpaidOrders) {
    try {
      // اینجا باید به API ترون یا کیف پول تتر وصل بشی و پرداخت را چک کنی
      // برای نمونه فرض می‌کنیم پرداخت تایید شده است (در عمل باید اتصال به API واقعی داشته باشی)
      const isPaid = await mockCheckPayment(order.amount);

      if (isPaid) {
        markOrderPaid(order.id);

        const account = getNextAvailableAccount();

        if (account) {
          markAccountAsUsed(account.id);

          const message = `✅ پرداخت شما تأیید شد.

🧾 اطلاعات اکانت:
🔑 Username: ${account.username}
🔐 Password: ${account.password}

سپاس از خرید شما! 🌟`;

          await bot.sendMessage(order.telegram_id, message);
        } else {
          await bot.sendMessage(order.telegram_id, '❌ پرداخت شما تأیید شد، اما فعلاً اکانتی در دسترس نیست. لطفاً با پشتیبانی تماس بگیرید.');
        }
      }
    } catch (err) {
      console.error('خطا در بررسی پرداخت:', err);
    }
  }
}

async function mockCheckPayment(amount) {
  // این تابع را با منطق واقعی بررسی پرداخت جایگزین کن
  // فعلاً برای تست همیشه true برمی‌گرداند
  return true;
}

module.exports = { checkAndUpdatePayments };
