# Google Authentication & MongoDB Setup

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/babynames
MONGODB_DB=babynames
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy the Client ID and Client Secret to your `.env.local` file

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended for Vercel)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Get the connection string and update `MONGODB_URI` in `.env.local`

### Option 2: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use `mongodb://localhost:27017/babynames` as your `MONGODB_URI`

## Vercel Deployment

1. Add all environment variables to your Vercel project settings
2. Update `NEXTAUTH_URL` to your production domain
3. Update Google OAuth redirect URIs to include your production domain

## Features Added

- ✅ Google Sign-In authentication
- ✅ MongoDB database storage
- ✅ User data persistence (favorites, recent calculations, search history)
- ✅ Data migration from localStorage to database
- ✅ Cross-device data synchronization
- ✅ Never lose data again!

## API Endpoints

- `GET /api/user/data` - Get user data
- `PUT /api/user/data` - Update user data
- `GET /api/user/favorites` - Get favorites
- `POST /api/user/favorites` - Add favorite
- `DELETE /api/user/favorites` - Remove favorite
- `GET /api/user/recent` - Get recent calculations
- `POST /api/user/recent` - Add recent calculation
- `DELETE /api/user/recent` - Clear recent calculations
- `POST /api/user/migrate` - Migrate local data to database
