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
    'https://rentalhub4.vercel.app',
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
    // Use environment variable or fallback
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://aj00ay00:rahulMongo@cluster0.gpymdgc.mongodb.net/demoCheetah?retryWrites=true&w=majority';
    
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);
    console.log('Using URI:', mongoUri.substring(0, 50) + '...');
    
    // Close existing connection if any
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    const connection = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000, // 15 seconds
      maxPoolSize: 1, // Reduced for serverless
      minPoolSize: 0,
      maxIdleTimeMS: 30000,
      bufferCommands: false,
      bufferMaxEntries: 0,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 20000
    });
    
    cachedConnection = connection;
    console.log('Successfully connected to MongoDB');
    return connection;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error('Full error:', err);
    cachedConnection = null;
    throw err;
  }
}

// Connect to database before handling requests
app.use(async (req, res, next) => {
  try {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Checking DB connection`);
    await connectToDatabase();
    next();
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Database connection failed:`, error.message);
    res.status(500).json({ 
      message: 'Database connection failed. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
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
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    
    res.json({ 
      status: 'OK', 
      message: 'Rentalhub.in API Server is running!',
      database: dbStatus,
      environment: process.env.NODE_ENV || 'development',
      mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not Set',
      jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not Set',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Default route
app.get('/api', (req, res) => {
  res.json({ message: 'Rentalhub.in API Server is running!' });
});

// Debug route for environment variables
app.get('/api/debug', (req, res) => {
  res.json({
    environment: process.env.NODE_ENV || 'undefined',
    mongoUriExists: !!process.env.MONGODB_URI,
    jwtSecretExists: !!process.env.JWT_SECRET,
    mongoUriPrefix: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'undefined',
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('MONGO') || key.includes('JWT')),
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Export for Vercel
module.exports = app;
