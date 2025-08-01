const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  console.log('=== MongoDB Connection Test ===');
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
  
  const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://aj00ay00:rahulMongo@cluster0.gpymdgc.mongodb.net/rentalhub?retryWrites=true&w=majority';
  console.log('Using URI:', mongoUri.substring(0, 50) + '...');
  
  try {
    console.log('\nConnecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test database access
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📁 Found ${collections.length} collections:`, collections.map(c => c.name));
    
    // Test a simple query
    const Product = require('./models/Product');
    const productCount = await Product.countDocuments();
    console.log(`📦 Found ${productCount} products in database`);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 Suggestions:');
      console.log('   - Check your MongoDB username and password');
      console.log('   - Verify user permissions in MongoDB Atlas');
    }
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('timeout')) {
      console.log('\n💡 Suggestions:');
      console.log('   - Check your internet connection');
      console.log('   - Verify the cluster URL is correct');
      console.log('   - Check MongoDB Atlas Network Access settings');
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testConnection();
