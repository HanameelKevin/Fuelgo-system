import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://your-username:your-password@cluster0.mongodb.net/fuelgo';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  vehicleType: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceType: { 
    type: String, 
    required: true,
    enum: ['fuel', 'battery', 'mechanic', 'vehicle']
  },
  details: {
    liters: { type: Number },
    batteryType: { type: String },
    vehicleBrand: { type: String },
    vehicleModel: { type: String },
    problemDescription: { type: String },
    requestedVehicle: { type: String }
  },
  location: {
    address: { type: String, required: true },
    coordinates: { type: String }
  },
  payment: {
    method: { type: String, enum: ['mpesa', 'paypal'], required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: 'pending' }
  },
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled']
  },
  assignedMechanic: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  feedback: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Rating Schema
const ratingSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ratingType: { type: String, enum: ['mechanic', 'delivery'], required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Rating = mongoose.model('Rating', ratingSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'fuelgo-secret-key';

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'FUELGO API is running!', timestamp: new Date().toISOString() });
});

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, phone, vehicleType } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      vehicleType
    });

    await user.save();

    // Create JWT token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        vehicleType: user.vehicleType
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        vehicleType: user.vehicleType
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Order
app.post('/api/orders', authMiddleware, async (req, res) => {
  try {
    const {
      serviceType,
      details,
      location,
      paymentMethod
    } = req.body;

    // Calculate amount based on service type
    let amount = 0;
    const FUEL_PRICE = 185;

    if (serviceType === 'fuel' && details.liters) {
      amount = details.liters * FUEL_PRICE;
    } else if (serviceType === 'battery') {
      amount = 15000; // Example battery price
    } else if (serviceType === 'mechanic') {
      amount = 2000; // Example mechanic service price
    } else if (serviceType === 'vehicle') {
      amount = 50000; // Example vehicle rental price
    }

    const order = new Order({
      userId: req.user.id,
      serviceType,
      details,
      location,
      payment: {
        method: paymentMethod,
        amount: amount,
        status: 'pending'
      },
      status: 'pending'
    });

    await order.save();
    
    // Populate user details in response
    await order.populate('userId', 'name email phone');

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get User Orders
app.get('/api/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email phone');
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit Rating
app.post('/api/ratings', authMiddleware, async (req, res) => {
  try {
    const { orderId, ratingType, rating, comment } = req.body;

    const newRating = new Rating({
      orderId,
      userId: req.user.id,
      ratingType,
      rating,
      comment
    });

    await newRating.save();
    res.status(201).json(newRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get User Profile
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get User Ratings
app.get('/api/ratings', authMiddleware, async (req, res) => {
  try {
    const ratings = await Rating.find({ userId: req.user.id })
      .populate('orderId')
      .sort({ createdAt: -1 });
    res.json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 FUELGO Server running on port ${PORT}`);
  console.log(`📊 MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
});