// Simple test to check environment variables in Vercel
console.log('=== Environment Variables Test ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

if (process.env.MONGODB_URI) {
  console.log('MONGODB_URI (partial):', process.env.MONGODB_URI.substring(0, 20) + '...');
}

module.exports = {
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV
};
