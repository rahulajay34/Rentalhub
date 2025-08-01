# Rentalhub.in

A professional rental website built with React frontend and Node.js backend, focusing on Health & Fitness and Baby Safety Gear rentals.

## 🚀 Live Demo
- **Website**: [Deployed on Vercel](https://your-app.vercel.app)
- **Admin Panel**: [Admin Dashboard](https://your-app.vercel.app/admin)

## ✨ Features

- **No Pricing Display** - Inquiry-based system
- **Professional Design** - Responsive with smooth animations
- **Admin Panel** - Complete product and inquiry management
- **WhatsApp Integration** - Direct customer communication
- **JWT Authentication** - Secure admin access
- **MongoDB Storage** - Reliable data persistence

## 🛠 Tech Stack

- **Frontend**: React.js, Material-UI, Framer Motion
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT tokens
- **Deployment**: Vercel (Frontend + API)
- **Database**: MongoDB Atlas

## 📋 Prerequisites

- Node.js (v22.x)
- MongoDB (local or Atlas)
- Git

## 🔧 Local Development

### 1. Clone the repository
```bash
git clone https://github.com/your-username/rentalhub.git
cd rentalhub
```

### 2. Install dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values:
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key
# PORT=5000
# NODE_ENV=development
```

### 4. Initialize Database
```bash
# Create admin account
node check-admin.js

# Add sample data (optional)
node add-sample-data.js
```

### 5. Start Development Servers
```bash
# Option 1: Start both servers
npm run dev-full

# Option 2: Start separately
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm run client
```

## 🚀 Deployment on Vercel

Follow the detailed [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for step-by-step instructions.

### Quick Deploy:
1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy!

## 📱 Admin Panel

- **URL**: `/admin`
- **Default Credentials**: 
  - Username: `admin`
  - Password: `admin123`

### Admin Features:
- Product Management (CRUD)
- Inquiry Management
- Status Updates
- Admin Profile Management

## 🗂 Project Structure

```
Rentalhub/
├── api/                    # Vercel serverless API
│   └── index.js           # Main API entry point
├── client/                # React frontend
│   ├── public/
│   └── src/
│       ├── components/    # Reusable components
│       ├── pages/         # Page components
│       ├── context/       # React context
│       └── utils/         # Utilities
├── models/                # MongoDB models
├── routes/                # API routes
├── middleware/            # Custom middleware
├── uploads/               # File uploads
├── vercel.json           # Vercel configuration
└── server.js             # Local development server
```

## 🔒 Environment Variables

### Required for Production:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
```

### Optional:
```env
REACT_APP_API_URL=https://your-domain.vercel.app
```

## 📦 Available Scripts

### Backend:
- `npm start` - Start production server
- `npm run dev` - Start development server
- `npm run build` - Build client application

### Frontend:
- `npm run client` - Start React development server
- `npm run build-client` - Build for production

### Database:
- `node check-admin.js` - Check/create admin account
- `node reset-admin.js` - Reset admin password
- `node add-sample-data.js` - Add sample products and inquiries

## 🎯 API Endpoints

### Public Routes:
- `GET /api/products` - Get all active products
- `GET /api/products/:id` - Get single product
- `POST /api/inquiries` - Submit inquiry

### Admin Routes:
- `POST /api/admin/login` - Admin login
- `GET /api/admin/verify` - Verify token
- `GET /api/products/admin/all` - Get all products
- `GET /api/inquiries` - Get all inquiries

## 🔧 Configuration

### Vercel Configuration (`vercel.json`):
- Serverless functions for API
- Static site generation for frontend
- Optimized for performance

### Database Connection:
- Optimized for serverless environment
- Connection pooling enabled
- Automatic reconnection handling

## 🐛 Troubleshooting

### Common Issues:
1. **API not responding**: Check environment variables
2. **Database connection**: Verify MongoDB URI and network access
3. **Build failures**: Check dependencies and build scripts
4. **Admin login**: Run `node check-admin.js` to create admin

### Development Tips:
- Use `npm run dev-full` for full development environment
- Check browser console for frontend errors
- Monitor Vercel function logs for API issues

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and queries:
- Create an issue on GitHub
- Check the [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- Review the troubleshooting section

---

Built with ❤️ for the rental industry
