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
    /\.vercel\.app$/
  ],
  credentials: true
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
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 1, // Reduced for serverless
        minPoolSize: 0,
        maxIdleTimeMS: 30000,
        bufferCommands: false,
        bufferMaxEntries: 0
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
    res.status(500).json({ message: 'Database connection failed' });
  }
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
