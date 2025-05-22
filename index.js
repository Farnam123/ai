const express = require('express');
const bodyParser = require('body-parser');
const { createOrder } = require('./db');

const app = express();
app.use(bodyParser.json());

const USDT_ADDRESS = 'TSHdYVszpLUeNhtYU6VSqZBo4n246h7Ee6';

app.post('/order', (req, res) => {
  const { telegram_id, amount } = req.body;

  if (!telegram_id || !amount) {
    return res.status(400).json({ error: 'telegram_id و amount باید ارسال شود' });
  }

  const orderId = createOrder(telegram_id, amount);

  res.json({
    message: 'سفارش ثبت شد',
    orderId,
    payTo: USDT_ADDRESS,
    note: 'لطفاً دقیقاً مبلغ مورد نظر را به آدرس بالا واریز کرده و منتظر تأیید باشید.'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`سرور روی پورت ${PORT} در حال اجراست...`);
});
