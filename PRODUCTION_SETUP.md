# Production Setup Guide for Baby Names App

## 🚀 Current Status
- ✅ App deployed at: https://babynames-rwwq.vercel.app/
- ✅ Google OAuth credentials configured
- ✅ Authentication system implemented
- ⚠️ MongoDB Atlas setup needed
- ⚠️ Environment variables need to be added to Vercel

## 🔧 Environment Variables Setup

### 1. Create .env.local (for local development)
```env
NEXTAUTH_URL=https://babynames-rwwq.vercel.app
NEXTAUTH_SECRET=550168a5ca134e7e92eecd253759496380b5bcd1f5abf02af67cfce82f6af02b
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/babynames?retryWrites=true&w=majority
MONGODB_DB=babynames
```

### 2. MongoDB Atlas Setup (Required for Production)

#### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project called "Baby Names"

#### Step 2: Create a Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select a region close to your users
4. Name your cluster (e.g., "babynames-cluster")
5. Click "Create Cluster"

#### Step 3: Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and strong password
5. Set privileges to "Read and write to any database"
6. Click "Add User"

#### Step 4: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

#### Step 5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `babynames`

Example connection string:
```
mongodb+srv://babynames-user:your-password@babynames-cluster.abc123.mongodb.net/babynames?retryWrites=true&w=majority
```

### 3. Google OAuth Configuration

#### Update Authorized Redirect URIs
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" → "Credentials"
3. Click on your OAuth 2.0 Client ID
4. Add these authorized redirect URIs:
   - `https://babynames-rwwq.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google`

### 4. Vercel Environment Variables

#### Add to Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `babynames` project
3. Go to "Settings" → "Environment Variables"
4. Add these variables:

| Name | Value |
|------|-------|
| `NEXTAUTH_URL` | `https://babynames-rwwq.vercel.app` |
| `NEXTAUTH_SECRET` | `550168a5ca134e7e92eecd253759496380b5bcd1f5abf02af67cfce82f6af02b` |
| `GOOGLE_CLIENT_ID` | `your-google-client-id` |
| `GOOGLE_CLIENT_SECRET` | `your-google-client-secret` |
| `MONGODB_URI` | `your-mongodb-atlas-connection-string` |
| `MONGODB_DB` | `babynames` |

### 5. Trigger New Deployment
After adding environment variables, trigger a new deployment:
1. Go to "Deployments" tab in Vercel
2. Click "Redeploy" on the latest deployment
3. Or push a new commit to trigger automatic deployment

## 🎯 Testing the Setup

### 1. Test Authentication
1. Visit https://babynames-rwwq.vercel.app/
2. Click "Sign in with Google" in the header
3. Complete Google OAuth flow
4. Verify you're signed in

### 2. Test Data Persistence
1. Add some favorite names
2. Perform some calculations
3. Clear browser cache
4. Refresh the page
5. Verify data is still there

### 3. Test Cross-Device Sync
1. Sign in on another device
2. Verify your data appears
3. Add new data on second device
4. Check it appears on first device

## 🚨 Troubleshooting

### Common Issues

#### 1. "Invalid redirect URI" Error
- Check Google OAuth redirect URIs are correct
- Ensure no trailing slashes in URLs

#### 2. "Database connection failed"
- Verify MongoDB Atlas connection string
- Check network access allows all IPs
- Ensure database user has correct permissions

#### 3. "NEXTAUTH_SECRET not set"
- Verify environment variables are added to Vercel
- Check variable names are exact (case-sensitive)

#### 4. Build Failures
- Check all environment variables are set
- Verify MongoDB URI format is correct
- Ensure Google OAuth credentials are valid

## 🎉 Success Indicators

When everything is working correctly, you should see:
- ✅ Google Sign-In button in header
- ✅ User profile appears after sign-in
- ✅ Data migration prompt for existing users
- ✅ Favorites and history persist across sessions
- ✅ Data syncs across devices
- ✅ No more data loss from cache clearing!

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Test MongoDB Atlas connection
4. Check Google OAuth configuration

Your app is now ready for production with secure, persistent user data! 🚀
