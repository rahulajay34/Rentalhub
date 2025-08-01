const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const productRoutes = require('../routes/products');
const inquiryRoutes = require('../routes/inquiries');
const adminRoutes = require('../routes/admin');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://rentalhub-ten.vercel.app',
    'https://rentalhub-m983580tg-rahuls-projects-2a408d32.vercel.app',
    /^https:\/\/.*\.vercel\.app$/,
    /^https:\/\/rentalhub.*\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// MongoDB Connection (optimized for serverless)
let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    // Close existing connection if any
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    const connection = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb+srv://aj00ay00:rahulMongo@cluster0.gpymdgc.mongodb.net/demoCheetah?retryWrites=true&w=majority', 
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000, // Increased timeout
        maxPoolSize: 1, // Reduced for serverless
        minPoolSize: 0,
        maxIdleTimeMS: 30000,
        bufferCommands: false,
        bufferMaxEntries: 0,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000
      }
    );
    
    cachedConnection = connection;
    console.log('Connected to MongoDB');
    return connection;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

// Connect to database before handling requests
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

// Add request timeout middleware
app.use((req, res, next) => {
  res.setTimeout(25000, () => {
    res.status(408).json({ message: 'Request timeout' });
  });
  next();
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Rentalhub.in API Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Default route
app.get('/api', (req, res) => {
  res.json({ message: 'Rentalhub.in API Server is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Export for Vercel
module.exports = app;
