# Rentalhub.in - Professional Rental Website

A complete rental website built with React frontend and Node.js backend, specializing in Health & Fitness equipment and Baby Safety Gear rentals.

## 🚀 Features

### Frontend Features
- **Responsive Design**: Beautiful, mobile-first design with Material-UI components
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Product Catalog**: Browse products by categories with search and filtering
- **Inquiry System**: Contact forms for product inquiries (no pricing displayed)
- **Admin Panel**: Complete admin dashboard for managing products and inquiries

### Backend Features
- **RESTful API**: Complete API with Express.js and MongoDB
- **Authentication**: JWT-based admin authentication
- **File Uploads**: Image upload system for products using Multer
- **Data Management**: CRUD operations for products and inquiries
- **Admin Features**: Dashboard, product management, inquiry tracking

## 🛠️ Technology Stack

### Frontend
- React.js 19.1.1
- Material-UI (MUI) 7.2.0
- Framer Motion 12.23.12
- React Router Dom 7.7.1
- Axios for API calls

### Backend
- Node.js with Express.js 5.1.0
- MongoDB with Mongoose 8.17.0
- JWT Authentication
- Multer for file uploads
- bcryptjs for password hashing
- CORS for cross-origin requests

## 📁 Project Structure

```
Rentalhub/
├── client/                  # React application
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── utils/         # Utility functions and API calls
│   │   └── App.js         # Main App component
│   └── package.json
│
├── api/                    # Vercel serverless API
│   └── index.js           # API entry point for Vercel
│
├── middleware/             # Custom middleware
├── models/                # Mongoose models
├── routes/                # API routes
├── uploads/               # File upload directory
├── server.js              # Main server file (for local development)
├── package.json           # Backend dependencies
├── vercel.json            # Vercel deployment configuration
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Rentalhub
   ```

2. **Install Backend Dependencies**
   ```bash
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Configuration**
   
   The backend `.env` file is already configured with:
   ```
   MONGODB_URI=mongodb+srv://aj00ay00:rahulMongo@cluster0.gpymdgc.mongodb.net/demoCheetah?retryWrites=true&w=majority
   JWT_SECRET=rentalhub_secret_key_2024
   PORT=5000
   NODE_ENV=development
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   npm start
   # or for development with auto-restart:
   npm run dev
   ```
   The backend server will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   npm run client
   # or manually:
   cd client && npm start
   ```
   The frontend will run on `http://localhost:3000`

3. **Run Both Simultaneously (Development)**
   ```bash
   npm run dev-full
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

3. **Access the Application**
   - **Main Website**: http://localhost:3000
   - **Admin Panel**: http://localhost:3000/admin/login
   - **API Documentation**: http://localhost:5000/api/health

## 👨‍💼 Admin Access

To access the admin panel, you'll need to register an admin first:

1. **Register Admin** (POST request to `/api/admin/register`):
   ```json
   {
     "username": "admin",
     "email": "admin@rentalhub.in",
     "password": "admin123"
   }
   ```

2. **Login to Admin Panel**:
   - Go to http://localhost:3000/admin/login
   - Use the credentials you registered

## 📊 API Endpoints

### Public Routes
- `GET /api/products` - Get all active products
- `GET /api/products/:id` - Get single product
- `POST /api/inquiries` - Submit product inquiry

### Admin Routes (Authentication Required)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/register` - Admin registration
- `GET /api/admin/verify` - Verify admin token
- `GET /api/products/admin/all` - Get all products (admin)
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/inquiries` - Get all inquiries
- `PATCH /api/inquiries/:id/status` - Update inquiry status

## 🎨 Key Features

### Customer Features
- Browse products by category (Health & Fitness, Baby Safety Gear)
- Search and filter products
- View detailed product information
- Submit inquiries with contact details
- Responsive design for all devices

### Admin Features
- Secure admin authentication
- Dashboard with inquiry statistics
- Product management (CRUD operations)
- Inquiry management and tracking
- File upload for product images

## 🔧 Configuration

### Frontend Configuration
The frontend automatically connects to the backend API. You can configure the API URL by setting `REACT_APP_API_URL` environment variable:

```bash
# frontend/.env (optional)
REACT_APP_API_URL=http://localhost:5000
```

### Backend Configuration
All backend configuration is in `backend/.env`:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔒 Security Features

- JWT-based authentication for admin routes
- Password hashing with bcryptjs
- Input validation and sanitization
- CORS configuration for secure cross-origin requests
- Protected admin routes with middleware

## 🚀 Deployment

### Vercel Deployment (Recommended)
This project is optimized for Vercel deployment with the included `vercel.json` configuration.

1. **Connect to Vercel**:
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set Environment Variables in Vercel Dashboard**:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `NODE_ENV`: production

4. **The deployment will automatically**:
   - Build the React frontend
   - Deploy the serverless API functions
   - Serve static files from the build directory

### Manual Deployment

#### Frontend Deployment (Netlify/Vercel)
1. Build the frontend: `npm run build`
2. Deploy the `client/build` folder to your hosting platform
3. Set environment variables if needed

#### Backend Deployment (Heroku/Railway)
1. Ensure all dependencies are in `package.json`
2. Set environment variables on your hosting platform
3. Deploy the root folder (not the backend subfolder)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support or questions:
- Email: info@rentalhub.in
- Phone: +91 98765 43210
- WhatsApp: +91 98765 43210

## 🔮 Future Enhancements

- Payment integration
- Real-time chat support
- Email notifications
- Advanced analytics
- Mobile app (React Native)
- Inventory management
- Customer reviews and ratings

---

**Rentalhub.in** - Making quality products accessible through convenient rental solutions! 🚀
