import express from 'express';
import cors from 'cors';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const app = express();
app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.VITE_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const calculateShippingCost = (state) => {
  if (!state) return 0;
  const tamilNaduVariants = ["tamil nadu", "tamil nadoo", "tamilnadu", "tn"];
  const isInTamilNadu = tamilNaduVariants.some(variant => 
    state.toLowerCase().includes(variant)
  );
  return isInTamilNadu ? 70 : 100;
};

app.post('/api/create-order', async (req, res) => {
  const { cartItems, shippingState, currency = 'INR' } = req.body;

  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty cart' });
  }

  for (const item of cartItems) {
    if (!item.productId || typeof item.productId !== 'string') {
      return res.status(400).json({ error: 'Invalid product ID in cart' });
    }
    if (typeof item.price !== 'number' || item.price <= 0 || item.price > 100000) {
      return res.status(400).json({ error: 'Invalid product price in cart' });
    }
    if (typeof item.quantity !== 'number' || item.quantity <= 0 || item.quantity > 100) {
      return res.status(400).json({ error: 'Invalid product quantity in cart' });
    }
  }

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  if (subtotal <= 0 || subtotal > 10000000) {
    return res.status(400).json({ error: 'Invalid cart total' });
  }

  const shippingCost = shippingState ? calculateShippingCost(shippingState) : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shippingCost + tax;

  const options = {
    amount: Math.round(total * 100),
    currency: currency,
    receipt: `receipt_${Date.now()}`,
    payment_capture: 1,
    notes: {
      subtotal: subtotal.toFixed(2),
      shipping: shippingCost.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      itemCount: cartItems.length
    }
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      calculatedTotal: total,
      breakdown: {
        subtotal,
        shippingCost,
        tax,
        total
      }
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ error: error.message || 'Failed to create order' });
  }
});

app.post('/api/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ status: 'failure', message: 'Missing required fields' });
  }

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    res.json({ status: 'success', message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ status: 'failure', message: 'Invalid payment signature' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Razorpay API server is running' });
});

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Razorpay API server running on port ${PORT}`);
});
