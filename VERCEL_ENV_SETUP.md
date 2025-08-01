# Vercel Environment Variables Setup Guide

## The Problem
Your app works locally but fails on Vercel with database connection errors because environment variables are not set in Vercel.

## Solution: Set Environment Variables in Vercel Dashboard

### Step 1: Go to Vercel Dashboard
1. Visit [vercel.com](https://vercel.com)
2. Sign in to your account
3. Click on your `rentalhub4` project

### Step 2: Navigate to Environment Variables
1. Click on **Settings** tab
2. Click on **Environment Variables** in the left sidebar

### Step 3: Add Required Environment Variables

Add these **three** environment variables exactly as shown:

#### Variable 1: MONGODB_URI
- **Name**: `MONGODB_URI`
- **Value**: `mongodb+srv://aj00ay00:rahulMongo@cluster0.gpymdgc.mongodb.net/rentalhub?retryWrites=true&w=majority`
- **Environment**: Select **Production**, **Preview**, and **Development** (all three)

#### Variable 2: JWT_SECRET
- **Name**: `JWT_SECRET`
- **Value**: `rentalhub_secret_key_2024`
- **Environment**: Select **Production**, **Preview**, and **Development** (all three)

#### Variable 3: NODE_ENV
- **Name**: `NODE_ENV`
- **Value**: `production`
- **Environment**: Select **Production** only

### Step 4: Redeploy Your Application

After adding the environment variables:

**Option A: Automatic Redeploy**
- Make any small change to your code (e.g., add a comment)
- Push to GitHub: `git add . && git commit -m "Trigger redeploy" && git push`

**Option B: Manual Redeploy**
1. Go to **Deployments** tab in Vercel
2. Find your latest deployment
3. Click the three dots (⋯) next to it
4. Click **Redeploy**

### Step 5: Verify the Fix

After redeployment, test these URLs:

1. **Health Check**: https://rentalhub4.vercel.app/api/health
   - Should return: `{"status": "OK", "message": "..."}`

2. **Debug Info**: https://rentalhub4.vercel.app/api/debug
   - Should show environment variables are loaded

3. **Products API**: https://rentalhub4.vercel.app/api/products
   - Should return product data

## Common Issues & Solutions

### Issue: Still getting "Database connection failed"
**Check**: 
- Environment variables are saved correctly in Vercel
- You've redeployed after adding them
- MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

### Issue: "Authentication failed"
**Check**: 
- MongoDB username/password in the URI are correct
- User has proper permissions in MongoDB Atlas

### Issue: "Variables not showing up"
**Check**:
- Variables are set for the correct environment (Production)
- No typos in variable names (case-sensitive)
- App has been redeployed after adding variables

## MongoDB Atlas Network Access

Make sure MongoDB Atlas allows Vercel connections:

1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
2. Select your cluster
3. Click **Network Access** in left sidebar
4. Click **Add IP Address**
5. Select **Allow Access from Anywhere** (0.0.0.0/0)
6. Click **Confirm**

## Expected Success Response

After fixing, your health check should return:
```json
{
  "status": "OK",
  "message": "Rentalhub.in API Server is running!",
  "timestamp": "2025-08-01T18:30:00.000Z"
}
```

## Need Help?

If you're still having issues:
1. Check Vercel Function logs: Project → Functions → View logs
2. Look for MongoDB connection messages
3. Verify environment variables in /api/debug endpoint
