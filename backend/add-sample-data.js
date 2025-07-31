const mongoose = require('mongoose');
const Product = require('./models/Product');
const Admin = require('./models/Admin');
const Inquiry = require('./models/Inquiry');
require('dotenv').config();

const sampleProducts = [
  {
    name: 'Premium Treadmill Pro',
    description: 'High-end commercial grade treadmill perfect for home and gym use. Features advanced cushioning system, multiple preset programs, and heart rate monitoring.',
    category: 'Health & Fitness',
    features: [
      'Commercial grade motor',
      'Advanced cushioning system',
      'Heart rate monitoring',
      'Multiple preset programs',
      'Bluetooth connectivity',
      'Foldable design'
    ],
    specifications: {
      'Motor Power': '3.0 HP',
      'Maximum Speed': '18 km/h',
      'Maximum Weight': '150 kg',
      'Dimensions': '180 x 85 x 140 cm',
      'Weight': '85 kg',
      'Warranty': '2 years'
    },
    images: ['treadmill-1.jpg', 'treadmill-2.jpg'],
    isActive: true
  },
  {
    name: 'Adjustable Dumbbells Set',
    description: 'Space-saving adjustable dumbbell set with quick-change weight plates. Perfect for strength training and muscle building exercises.',
    category: 'Health & Fitness',
    features: [
      'Quick weight adjustment',
      'Space-saving design',
      'Durable construction',
      'Non-slip grip',
      'Weight range 5-50 kg',
      'Compact storage'
    ],
    specifications: {
      'Weight Range': '5-50 kg per dumbbell',
      'Material': 'Cast iron with rubber coating',
      'Adjustment': 'Quick-lock system',
      'Handle Length': '35 cm',
      'Warranty': '1 year'
    },
    images: ['dumbbells-1.jpg', 'dumbbells-2.jpg'],
    isActive: true
  },
  {
    name: 'Baby Safety Gate Premium',
    description: 'Extra wide safety gate with auto-close feature. Perfect for securing doorways and staircases to keep your little ones safe.',
    category: 'Baby Safety Gear',
    features: [
      'Auto-close mechanism',
      'Extra wide opening',
      'Easy adult operation',
      'Pressure mount installation',
      'Adjustable width',
      'Safety lock system'
    ],
    specifications: {
      'Width Range': '75-82 cm',
      'Height': '76 cm',
      'Material': 'Steel with safety coating',
      'Installation': 'Pressure mount',
      'Age Range': '6 months - 2 years',
      'Certification': 'IS 9873 approved'
    },
    images: ['safety-gate-1.jpg', 'safety-gate-2.jpg'],
    isActive: true
  },
  {
    name: 'Baby Monitor with Camera',
    description: 'Advanced baby monitor with HD camera, night vision, and smartphone app connectivity. Keep an eye on your baby from anywhere.',
    category: 'Baby Safety Gear',
    features: [
      'HD video quality',
      'Night vision',
      'Smartphone app',
      'Two-way audio',
      'Motion detection',
      'Temperature monitoring'
    ],
    specifications: {
      'Video Quality': '1080p HD',
      'Range': 'Up to 300 meters',
      'Battery Life': '12 hours',
      'Connectivity': 'WiFi + Bluetooth',
      'Storage': 'Cloud + SD card',
      'App Support': 'iOS & Android'
    },
    images: ['baby-monitor-1.jpg', 'baby-monitor-2.jpg'],
    isActive: true
  },
  {
    name: 'Exercise Bike Deluxe',
    description: 'Professional stationary bike with magnetic resistance and built-in workout programs. Ideal for cardio training at home.',
    category: 'Health & Fitness',
    features: [
      'Magnetic resistance',
      'Built-in programs',
      'Heart rate sensors',
      'Adjustable seat',
      'LCD display',
      'Quiet operation'
    ],
    specifications: {
      'Resistance Levels': '16 levels',
      'Maximum Weight': '120 kg',
      'Display': 'LCD with backlight',
      'Dimensions': '120 x 60 x 110 cm',
      'Power': 'Self-generating',
      'Warranty': '2 years'
    },
    images: ['exercise-bike-1.jpg', 'exercise-bike-2.jpg'],
    isActive: true
  },
  {
    name: 'Baby Car Seat Deluxe',
    description: 'Premium baby car seat with multiple recline positions and side impact protection. Suitable for newborns to 4 years.',
    category: 'Baby Safety Gear',
    features: [
      'Side impact protection',
      'Multiple recline positions',
      'Easy installation',
      'Washable covers',
      '5-point harness',
      'Growing with child'
    ],
    specifications: {
      'Age Range': '0-4 years',
      'Weight Range': '0-18 kg',
      'Installation': 'ISOFIX + seat belt',
      'Material': 'Flame retardant fabric',
      'Recline Positions': '4 positions',
      'Certification': 'ECE R44/04'
    },
    images: ['car-seat-1.jpg', 'car-seat-2.jpg'],
    isActive: true
  }
];

const sampleInquiries = [
  {
    customerName: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    phone: '9876543210',
    whatsappNumber: '9876543210',
    companyName: 'Fitness First Gym',
    location: 'Mumbai, Maharashtra',
    productName: 'Premium Treadmill Pro',
    message: 'Looking to rent 2 treadmills for our new gym branch. Need them for 6 months initially.',
    rentalDuration: '6 months',
    status: 'new'
  },
  {
    customerName: 'Priya Patel',
    email: 'priya.patel@yahoo.com',
    phone: '8765432109',
    whatsappNumber: '8765432109',
    location: 'Ahmedabad, Gujarat',
    productName: 'Baby Safety Gate Premium',
    message: 'Need safety gates for my home. Have a 1-year-old baby who is starting to walk.',
    rentalDuration: '1 year',
    status: 'contacted'
  },
  {
    customerName: 'Amit Kumar',
    email: 'amit.k@hotmail.com',
    phone: '7654321098',
    whatsappNumber: '7654321098',
    companyName: 'Home Fitness Solutions',
    location: 'Delhi, NCR',
    productName: 'Adjustable Dumbbells Set',
    message: 'Interested in renting dumbbells for personal training clients. Need 5 sets.',
    rentalDuration: '3 months',
    status: 'converted'
  },
  {
    customerName: 'Sneha Reddy',
    email: 'sneha.reddy@gmail.com',
    phone: '6543210987',
    whatsappNumber: '6543210987',
    location: 'Bangalore, Karnataka',
    productName: 'Baby Monitor with Camera',
    message: 'Looking for a reliable baby monitor. First-time parents and want to ensure baby safety.',
    rentalDuration: '2 years',
    status: 'new'
  },
  {
    customerName: 'Vikash Singh',
    email: 'vikash.singh@outlook.com',
    phone: '5432109876',
    whatsappNumber: '5432109876',
    companyName: 'Corporate Wellness Center',
    location: 'Pune, Maharashtra',
    productName: 'Exercise Bike Deluxe',
    message: 'Setting up wellness center for employees. Need 10 exercise bikes for rental.',
    rentalDuration: '1 year',
    status: 'contacted'
  }
];

async function addSampleData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await Product.deleteMany({});
    await Inquiry.deleteMany({});
    
    // Add sample products
    console.log('Adding sample products...');
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Added ${createdProducts.length} sample products`);
    
    // Add sample inquiries with productId references
    console.log('Adding sample inquiries...');
    const inquiriesWithProductIds = sampleInquiries.map((inquiry, index) => {
      // Find corresponding product for the inquiry
      const product = createdProducts.find(p => p.name === inquiry.productName);
      return {
        ...inquiry,
        productId: product ? product._id : createdProducts[0]._id // fallback to first product
      };
    });
    
    const createdInquiries = await Inquiry.insertMany(inquiriesWithProductIds);
    console.log(`Added ${createdInquiries.length} sample inquiries`);
    
    console.log('\n=== SAMPLE DATA ADDED SUCCESSFULLY ===');
    console.log('Products added:');
    createdProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.category})`);
    });
    
    console.log('\nInquiries added:');
    createdInquiries.forEach((inquiry, index) => {
      console.log(`${index + 1}. ${inquiry.customerName} - ${inquiry.productName} (${inquiry.status})`);
    });
    
    console.log('\nYou can now:');
    console.log('1. Browse products on the website');
    console.log('2. Manage products from admin panel');
    console.log('3. View and manage inquiries from admin panel');
    console.log('4. Submit new inquiries from product pages');
    
  } catch (error) {
    console.error('Error adding sample data:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

addSampleData();
