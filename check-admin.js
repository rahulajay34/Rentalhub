const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

async function checkAdmins() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Get all admin accounts
    const admins = await Admin.find({}).select('-password');
    
    console.log('Existing admin accounts:');
    console.log(JSON.stringify(admins, null, 2));
    
    if (admins.length === 0) {
      console.log('\nNo admin accounts found. Creating default admin...');
      
      const defaultAdmin = new Admin({
        username: 'admin',
        email: 'admin@rentalhub.in',
        password: 'admin123'
      });
      
      await defaultAdmin.save();
      console.log('Default admin created successfully!');
      console.log('Username: admin');
      console.log('Password: admin123');
    } else {
      console.log('\nFound existing admin accounts. Try logging in with:');
      admins.forEach(admin => {
        console.log(`Username: ${admin.username} or Email: ${admin.email}`);
      });
      console.log('\nIf you forgot the password, you can reset it by running the reset script.');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

checkAdmins();
