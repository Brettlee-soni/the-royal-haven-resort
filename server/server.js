
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const path = require('path');

// Load environment variables from server/.env
require('dotenv').config({
  path: path.join(__dirname, '.env')
});

// Models
const Room = require('./models/Room');

// Routes
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookings');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Initialize Express
const app = express();

app.use(express.json());
app.use(cors());

// ==========================================
// RAZORPAY CONFIGURATION
// ==========================================

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

let razorpay = null;

if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
  try {
    razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET
    });

    console.log('✅ Razorpay Initialized Successfully');
  } catch (error) {
    console.error('❌ Razorpay Initialization Failed:', error.message);
  }
} else {
  console.warn('⚠️ Razorpay credentials missing. Payment routes are disabled.');
}

// ==========================================
// EXPRESS ROUTES
// ==========================================

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/analytics', analyticsRoutes);

// ==========================================
// RAZORPAY PAYMENT ROUTES
// ==========================================

// 1. Create Payment Order
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid amount is required'
      });
    }

    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Payment service is not configured'
      });
    }

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    console.log('✅ Razorpay Order Created:', order.id);

    return res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('❌ Razorpay Order Error:', error.message);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 2. Verify Payment Signature
app.post('/api/payment/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment details'
      });
    }

    if (!RAZORPAY_KEY_SECRET) {
      return res.status(503).json({
        success: false,
        message: 'Payment service is not configured'
      });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const signaturesMatch =
      Buffer.from(expectedSignature).length ===
        Buffer.from(razorpay_signature).length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(razorpay_signature)
      );

    if (signaturesMatch) {
      console.log('✅ Payment Verified:', razorpay_order_id);

      return res.json({
        success: true,
        message: 'Payment verified successfully'
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Invalid payment signature'
    });

  } catch (error) {
    console.error('❌ Razorpay Verification Error:', error.message);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'The Royal Haven Resort API is running',
    database:
      mongoose.connection.readyState === 1
        ? 'Connected'
        : 'Disconnected'
  });
});

// ==========================================
// MONGODB CONNECTION AND SERVER STARTUP
// ==========================================

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is missing from server/.env');
  process.exit(1);
}

async function startServer() {
  try {
    // Connect to MongoDB before accepting API requests
    await mongoose.connect(MONGO_URI);

    console.log('✅ Connected to MongoDB Successfully');
    console.log('📦 Database:', mongoose.connection.name);

    // Check existing rooms without deleting or modifying them
    const roomCount = await Room.countDocuments();

    console.log(`🏨 Total Rooms in Database: ${roomCount}`);

    // Start Express only after successful DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Server Startup Error:', error.message);
    process.exit(1);
  }
}

startServer();
