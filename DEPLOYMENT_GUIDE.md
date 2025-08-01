# Vercel Deployment Guide for Rentalhub.in

## Prerequisites
1. GitHub account
2. Vercel account (free)
3. MongoDB Atlas account (or any MongoDB instance)

## Step-by-Step Deployment Guide

### 1. Prepare Your Repository
```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Environment Variables Setup
Create these environment variables in Vercel dashboard:

**Required Variables:**
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A strong secret key for JWT tokens
- `NODE_ENV`: Set to `production`

**Optional Variables:**
- `REACT_APP_API_URL`: Will be auto-set by Vercel (leave empty)

### 3. Deploy on Vercel

#### Option A: Via Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect it as a Node.js project
5. Configure environment variables:
   - Go to Settings → Environment Variables
   - Add the required variables listed above
6. Click "Deploy"

#### Option B: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? [Select your account]
# - Link to existing project? N
# - Project name: rentalhub (or your choice)
# - Directory: ./
# - Want to override settings? N
```

### 4. Configure Environment Variables
After deployment, add environment variables:

```bash
# Set environment variables via CLI
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add NODE_ENV

# Or use the dashboard at vercel.com/[username]/[project]/settings/environment-variables
```

### 5. Redeploy with Environment Variables
```bash
vercel --prod
```

### 6. Setup Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Post-Deployment Checklist

### 1. Test API Endpoints
Visit `https://your-app.vercel.app/api/health` to check if API is working

### 2. Test Database Connection
Check if products and admin login work properly

### 3. Initialize Admin Account
If no admin exists, you may need to create one manually in your database or use the scripts:

```bash
# Local environment
node check-admin.js
node reset-admin.js
```

### 4. Upload Test Data (Optional)
```bash
# Local environment
node add-sample-data.js
```

## Troubleshooting

### Common Issues:

1. **API not responding**
   - Check environment variables are set correctly
   - Verify MongoDB URI is accessible from Vercel

2. **Build failures**
   - Check that all dependencies are in package.json
   - Ensure no build warnings are treated as errors

3. **Database connection issues**
   - Verify MongoDB Atlas allows connections from all IPs (0.0.0.0/0)
   - Check MongoDB URI format

4. **File upload issues**
   - Vercel has file size limits
   - Consider using external storage (Cloudinary, AWS S3) for production

### Performance Optimization:
1. Images are served from `/uploads` directory
2. API uses connection pooling for MongoDB
3. Frontend uses efficient caching strategies

## Important Notes:
- Vercel functions have a 10-second execution limit (Hobby plan)
- File uploads are limited to 5MB per file
- Database connections are optimized for serverless environment
- CORS is configured for Vercel domains

## Support
If you encounter issues:
1. Check Vercel function logs in the dashboard
2. Monitor MongoDB connection logs
3. Test API endpoints individually
4. Check browser console for frontend errors

## Success Indicators:
✅ API health check responds at `/api/health`
✅ Products load on homepage
✅ Admin login works
✅ Product submission works
✅ Inquiry system functional
