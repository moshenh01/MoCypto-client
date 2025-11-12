# MoveoCrypto Client

A React-based cryptocurrency dashboard application that provides personalized content based on user preferences. Users can view market news, price charts, social insights, and memes, all tailored to their investment preferences.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Code Overview](#code-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)

## Features

- **User Authentication**: Sign up and login with JWT token-based authentication
- **Onboarding Flow**: Set up user preferences (crypto assets, investor type, content types)
- **Personalized Dashboard**: View content based on user preferences
  - Market News
  - Price Charts
  - Social Insights
  - Fun Memes
- **Profile Management**: Update user preferences and profile information
- **Feedback System**: Vote on content items (like/dislike)
- **Token Management**: Automatic token expiration handling and refresh
- **Dashboard Caching**: 5-minute cache to reduce API calls
- **Lazy Loading**: Code splitting for better performance

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── DashboardHeader.js
│   ├── DashboardFooter.js
│   ├── DashboardSkeleton.js
│   ├── NewsCard.js
│   ├── PricesCard.js
│   ├── InsightCard.js
│   ├── MemeCard.js
│   └── VoteButtons.js
├── context/            # React Context providers
│   └── AuthContext.js  # Authentication state management
├── pages/              # Page components
│   ├── LoginSignup.js
│   ├── Onboarding.js
│   ├── Dashboard.js
│   └── Profile.js
├── services/           # API service layer
│   └── api.js         # Axios instance and API calls
├── utils/             # Utility functions
│   ├── tokenUtils.js  # JWT token handling
│   ├── dashboardCache.js  # Dashboard data caching
│   └── contentTypeMapping.js  # Content type mappings
├── App.js             # Main app component with routing
└── index.js           # Application entry point
```

## Code Overview

### Authentication (`src/context/AuthContext.js`)

The `AuthContext` manages authentication state throughout the application:

- **Token Storage**: Stores JWT tokens in `localStorage`
- **Token Expiration**: Automatically checks token expiration every 5 minutes
- **User Profile**: Fetches and stores user data including preferences
- **Auto Logout**: Logs out users when tokens expire or become invalid
- **Event Listeners**: Listens for token expiration events from API interceptors

**Key Functions:**
- `login(token, userData)`: Stores token and user data, starts expiration checks
- `logout()`: Clears token and user data, stops expiration checks
- `useAuth()`: Hook to access auth context in components

### API Service (`src/services/api.js`)

Centralized API configuration using Axios:

- **Base URL**: Configurable via `REACT_APP_API_URL` environment variable
- **Request Interceptor**: 
  - Adds `Authorization` header with Bearer token to all requests
  - Checks token expiration before sending requests
  - Automatically logs out if token is expired
- **Response Interceptor**: 
  - Handles 401 (Unauthorized) responses
  - Triggers logout on authentication failures

**API Endpoints:**
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /onboarding` - Save user preferences
- `GET /dashboard` - Get personalized dashboard data
- `POST /feedback` - Submit feedback/votes
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

### Token Utilities (`src/utils/tokenUtils.js`)

JWT token handling without external libraries:

- **`decodeToken(token)`**: Decodes JWT payload without verification (client-side only)
  - Uses `atob()` for base64 decoding
  - Handles URL-safe base64 encoding
- **`isTokenExpired(token)`**: Checks if token expiration time has passed
- **`getTokenExpiration(token)`**: Returns expiration timestamp in milliseconds
- **`getTimeUntilExpiration(token)`**: Calculates time remaining until expiration

**Note**: These functions decode tokens without signature verification, which is acceptable for client-side expiration checks. The server always verifies the token signature.

### Routing (`src/App.js`)

React Router configuration with lazy loading:

- **Lazy Loading**: Pages are loaded on-demand for better performance
- **Private Routes**: Protected routes that require authentication
- **Smart Redirects**: 
  - Logged-in users without preferences → Onboarding
  - Logged-in users with preferences → Dashboard
  - Unauthenticated users → Login/Signup

**Routes:**
- `/` - Login/Signup (or redirects based on auth state)
- `/onboarding` - User preferences setup
- `/dashboard` - Main dashboard (requires preferences)
- `/profile` - User profile management

### Dashboard (`src/pages/Dashboard.js`)

Main dashboard page with personalized content:

- **Caching**: Uses 5-minute cache to reduce API calls
- **Content Filtering**: Shows only content types selected in user preferences
- **Vote Handling**: Manages user votes/feedback on content items
- **Error Handling**: Displays errors and provides retry functionality
- **Refresh**: Manual refresh button to force data reload

**Content Types:**
- Market News (`news`)
- Charts (`prices`)
- Social (`insight`)
- Fun (`meme`)

### Dashboard Cache (`src/utils/dashboardCache.js`)

In-memory cache for dashboard data:

- **Cache Duration**: 5 minutes (configurable)
- **Cache Management**: 
  - `getDashboardCache()`: Retrieve cached data
  - `setDashboardCache(data)`: Store data with timestamp
  - `clearDashboardCache()`: Clear cached data

### Content Type Mapping (`src/utils/contentTypeMapping.js`)

Maps user-friendly content type names to API data keys:

- Maps "Market News" → `news`
- Maps "Charts" → `prices`
- Maps "Social" → `insight`
- Maps "Fun" → `meme`

## Prerequisites

Before running this application, ensure you have:

- **Node.js**: Version 14.x or higher
- **npm**: Version 6.x or higher (comes with Node.js)
- **Backend API**: The backend server should be running (default: `http://localhost:5000/api`)

## Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

   This will install all required packages:
   - `react` & `react-dom` - React framework
   - `react-router-dom` - Routing
   - `axios` - HTTP client
   - `react-scripts` - Create React App tooling

## Running Locally

### 1. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Note**: If `REACT_APP_API_URL` is not set, it defaults to `http://localhost:5000/api`.

### 2. Start the Development Server

```bash
npm start
```

This will:
- Start the development server
- Open `http://localhost:3000` in your browser
- Enable hot-reloading (changes reflect immediately)

### 3. Verify Backend Connection

Ensure your backend API is running on the configured URL (default: `http://localhost:5000/api`).

The application will make API calls to:
- `/api/auth/signup` - User registration
- `/api/auth/login` - User login
- `/api/dashboard` - Dashboard data
- `/api/profile` - User profile
- `/api/onboarding` - Save preferences
- `/api/feedback` - Submit votes

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000/api` |

**Important**: All React environment variables must be prefixed with `REACT_APP_` to be accessible in the application.

## Available Scripts

### `npm start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

- Hot-reloading enabled
- Error overlay in browser
- Source maps for debugging

### `npm run build`

Builds the app for production to the `build` folder.

- Optimizes the build for best performance
- Minifies JavaScript and CSS
- Creates production-ready static files

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run eject`

**⚠️ Warning**: This is a one-way operation. Once you eject, you can't go back!

Ejects from Create React App, giving you full control over the build configuration.

## Deployment

### Vercel Deployment

The project includes `vercel.json` configuration for Vercel deployment:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "devCommand": "npm start",
  "installCommand": "npm install",
  "framework": "create-react-app",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Deploy to Vercel:**

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Set environment variables in Vercel dashboard:
   - `REACT_APP_API_URL` - Your production API URL

### Other Deployment Options

The `build` folder contains production-ready static files that can be deployed to:
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any static hosting service

## Troubleshooting

### Token Expiration Issues

If you're experiencing frequent logouts:
- Check token expiration time on backend
- Verify `isTokenExpired` function is working correctly
- Check browser console for token expiration logs

### API Connection Issues

If API calls are failing:
- Verify `REACT_APP_API_URL` is set correctly
- Check backend server is running
- Verify CORS is configured on backend
- Check browser console for error messages

### Build Issues

If `npm run build` fails:
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`
- Check Node.js version compatibility





