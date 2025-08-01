# Vercel MongoDB Connection Fix Guide

## The Issue
The app works locally but fails to connect to MongoDB on Vercel because:
1. Environment variables aren't properly set in Vercel
2. MongoDB Atlas network access restrictions
3. Database name inconsistency between local and production

## Step-by-Step Fix

### 1. Set Environment Variables in Vercel

Go to your Vercel dashboard:
1. Open your project
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

```
MONGODB_URI=mongodb+srv://aj00ay00:rahulMongo@cluster0.gpymdgc.mongodb.net/rentalhub?retryWrites=true&w=majority
JWT_SECRET=rentalhub_secret_key_2024_production_secure_jwt_token_12345
NODE_ENV=production
```

**Important**: Use `rentalhub` database name for consistency.

### 2. Configure MongoDB Atlas Network Access

1. Log into [MongoDB Atlas](https://cloud.mongodb.com)
2. Go to **Network Access** in the left sidebar
3. Click **Add IP Address**
4. Select **Allow Access from Anywhere** (0.0.0.0/0)
   - This is required for Vercel since it uses dynamic IPs
   - For production, you can restrict to specific regions later

### 3. Verify Database Permissions

1. Go to **Database Access** in MongoDB Atlas
2. Make sure your user `aj00ay00` has **Read and write to any database** permissions
3. If not, edit the user and grant proper permissions

### 4. Database Structure Clarification

You asked about having 2 databases (`demoCheetah` and `rentalhub`):

✅ **This is fine!** MongoDB Atlas allows multiple databases:
- `demoCheetah` - Can be your test/development database
- `rentalhub` - Your production database

**Recommendation**: Use `rentalhub` for production deployment.

### 5. Package.json Structure Clarification

You asked about having 2 package.json files:

✅ **This is correct and standard!** Your structure:
```
/package.json          # Backend dependencies (Node.js/Express)
/client/package.json   # Frontend dependencies (React)
```

This is the **standard MERN stack structure**:
- Root package.json: Server-side dependencies
- client/package.json: Client-side dependencies

### 6. Redeploy to Vercel

After setting environment variables:

**Option A: Auto-redeploy**
- Push any change to GitHub (environment variables trigger redeploy)

**Option B: Manual redeploy**
- Go to Vercel dashboard → Deployments
- Click the three dots on latest deployment → Redeploy

### 7. Verify the Fix

Check these endpoints after deployment:

1. **Health Check**: `https://your-app.vercel.app/api/health`
   - Should return: `{"status": "OK", "message": "Rentalhub.in API Server is running!"}`

2. **Products API**: `https://your-app.vercel.app/api/products`
   - Should return product data from MongoDB

3. **Check Logs**: In Vercel dashboard → Functions → View logs
   - Look for "Successfully connected to MongoDB"

## Common Issues & Solutions

### Issue: "Database connection failed"
**Solution**: Check environment variables are properly set in Vercel

### Issue: "MongoNetworkError"
**Solution**: Add 0.0.0.0/0 to MongoDB Atlas Network Access

### Issue: "Authentication failed"
**Solution**: Verify MongoDB user permissions

### Issue: "Database not found"
**Solution**: Make sure database name matches in URI

## Testing Commands

Run these locally to verify your setup:

```bash
# Test environment variables
node -e "console.log('MONGODB_URI:', !!process.env.MONGODB_URI)"

# Test database connection
node check-admin.js

# Test API
curl http://localhost:5000/api/health
```

## Final Checklist

- [ ] Environment variables set in Vercel
- [ ] MongoDB Atlas allows 0.0.0.0/0 access
- [ ] Database user has proper permissions
- [ ] Using `rentalhub` database name consistently
- [ ] Redeployed after setting environment variables
- [ ] Health check endpoint returns OK
- [ ] Can load products from database

## Need Help?

If issues persist:
1. Check Vercel function logs
2. Verify MongoDB Atlas connection logs
3. Test the connection string locally first
