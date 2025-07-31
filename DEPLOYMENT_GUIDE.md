# Deployment Guide for Rentalhub

## ✅ Project Restructure Completed

The project has been successfully restructured for easier Vercel deployment. The previous multi-folder approach with separate `backend/` and `frontend/` folders has been consolidated into a single-root structure.

## 📁 New Project Structure

```
Rentalhub/                   # Main project root
├── client/                  # React frontend application
├── api/                     # Serverless API for Vercel
├── middleware/              # Express middleware
├── models/                  # MongoDB models
├── routes/                  # API routes
├── uploads/                 # File uploads directory
├── server.js               # Local development server
├── package.json            # Backend dependencies
├── vercel.json             # Vercel configuration
└── .vercelignore           # Files to ignore in deployment
```

## 🚀 Deployment Instructions

### Option 1: Vercel Deployment (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project root**:
   ```bash
   cd c:\Users\masai\Desktop\Rentalhub
   vercel
   ```

4. **Set Environment Variables in Vercel Dashboard**:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `NODE_ENV`: production

### Option 2: Manual Build and Deploy

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy the build files** to any static hosting service

## 📋 What Was Changed

### ✅ Removed
- `backend/` folder (duplicate)
- `frontend/` folder (duplicate)

### ✅ Updated
- Root `package.json` now handles both frontend and backend
- `vercel.json` properly configured for single-root deployment
- Updated README.md with correct project structure
- Created proper `.vercelignore` file

### ✅ Maintained
- `client/` folder for React frontend
- `api/` folder for Vercel serverless functions
- All existing functionality intact

## 🔧 Available Scripts

From the project root:

```bash
# Start backend server (development)
npm start

# Start backend with auto-reload
npm run dev

# Start frontend
npm run client

# Build frontend for production
npm run build

# Start both frontend and backend
npm run dev-full

# Install frontend dependencies
npm run install-deps
```

## ✅ Verification Checklist

- [x] Removed duplicate backend and frontend folders
- [x] Updated package.json scripts
- [x] Verified vercel.json configuration
- [x] Updated README.md
- [x] Created .vercelignore file
- [x] Tested build process
- [x] Backend server starts successfully
- [x] Frontend builds successfully

## 🌐 Environment Configuration

### Local Development
- Backend runs on: `http://localhost:5000`
- Frontend runs on: `http://localhost:3000`
- API base URL: `http://localhost:5000/api`

### Production (Vercel)
- Frontend served from root domain
- API available at: `/api/*`
- Static files served automatically

## 📝 Notes

1. The project now follows a monorepo structure suitable for Vercel
2. All dependencies are properly configured
3. The build process works correctly
4. Environment variables are properly set up
5. The API routes are configured for both local and production environments

Your project is now ready for seamless Vercel deployment! 🎉
