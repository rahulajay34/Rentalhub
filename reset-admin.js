const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

async function resetAdminPassword() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Find the first admin account
    const admin = await Admin.findOne({});
    
    if (!admin) {
      console.log('No admin found. Creating default admin...');
      
      const defaultAdmin = new Admin({
        username: 'admin',
        email: 'admin@rentalhub.in',
        password: 'admin123'
      });
      
      await defaultAdmin.save();
      console.log('Default admin created successfully!');
    } else {
      console.log(`Updating password for admin: ${admin.username}`);
      
      // Update password
      admin.password = 'admin123';
      admin.email = admin.email || 'admin@rentalhub.in';
      await admin.save();
      
      console.log('Password updated successfully!');
    }
    
    console.log('\n=== ADMIN CREDENTIALS ===');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Email: admin@rentalhub.in');
    console.log('=========================');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

resetAdminPassword();
