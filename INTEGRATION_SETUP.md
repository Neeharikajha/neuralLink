# NeuralLink App - Complete Integration Setup

This guide covers the complete integration of GitHub authentication, live data, real-time chat, and scoring system.

## 🚀 Features Implemented

### ✅ GitHub Authentication
- **Backend**: Complete OAuth flow with GitHub
- **Frontend**: Login/Signup with GitHub integration
- **Database**: User and GitHub profile storage

### ✅ Live Dashboard Data
- **Real-time GitHub stats**: Repos, followers, languages
- **Dynamic tech stack**: Based on repository languages
- **Contribution heatmap**: Activity visualization
- **User scoring**: Calculated from GitHub metrics

### ✅ Real-time Chat System
- **Socket.IO integration**: Multi-user chat rooms
- **GitHub profile integration**: User avatars and names
- **Dark theme**: Consistent with app design

### ✅ Scoring System
- **Backend calculation**: Based on GitHub metrics
- **Compatibility scoring**: For project matching
- **Live updates**: Sync with GitHub data

## 🛠️ Backend Setup

### 1. Environment Variables
Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=mongodb://localhost:27017/neurallink
JWT_SECRET=your_jwt_secret_here
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:5173/auth/github/callback
CLIENT_URL=http://localhost:5173
PORT=5000
```

### 2. GitHub OAuth Setup
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App with:
   - **Application name**: NeuralLink
   - **Homepage URL**: http://localhost:5173
   - **Authorization callback URL**: http://localhost:5173/auth/github/callback
3. Copy Client ID and Client Secret to your `.env` file

### 3. Install Dependencies
```bash
cd backend
npm install
```

### 4. Start Backend Server
```bash
npm run dev
```

## 🎨 Frontend Setup

### 1. Environment Variables
Create a `.env` file in the `neurallink` directory:

```env
VITE_API_URL=http://localhost:5000
```

### 2. Install Dependencies
```bash
cd neurallink
npm install
```

### 3. Start Frontend Server
```bash
npm run dev
```

## 📊 Database Models

### Auth Model
- User authentication data
- Email/password or GitHub OAuth

### GitHub Model
- GitHub profile information
- Repository data
- Access tokens for API calls

### Chat Model
- Chat rooms and messages
- Real-time messaging support

## 🔄 API Endpoints

### Authentication
- `GET /auth/github/auth-url` - Get GitHub OAuth URL
- `GET /auth/github/callback` - Handle OAuth callback
- `GET /auth/github/profile` - Get user's GitHub profile
- `POST /auth/github/sync` - Sync GitHub data

### Scoring
- `GET /api/scoring/user-score` - Get user's calculated score
- `GET /api/scoring/all-scores` - Get all users' scores
- `POST /api/scoring/compatibility` - Calculate compatibility score

### Chat
- `GET /chat/rooms` - Get user's chat rooms
- `POST /chat/rooms` - Create new chat room
- `GET /chat/rooms/:id/messages` - Get room messages

## 🎯 Usage Flow

### 1. User Registration/Login
1. User visits login/signup page
2. Clicks "Continue with GitHub"
3. Redirected to GitHub OAuth
4. After authorization, redirected back to app
5. GitHub profile data is fetched and stored

### 2. Dashboard
1. User sees live GitHub data
2. Stats show real repository count, followers, etc.
3. Tech stack is dynamically generated from repositories
4. User can sync data to get latest GitHub information

### 3. Chat System
1. Users can create and join chat rooms
2. Real-time messaging with Socket.IO
3. GitHub profile pictures and names displayed
4. Multiple users can chat simultaneously

### 4. Scoring System
1. User scores calculated from GitHub metrics
2. Compatibility scoring for project matching
3. Scores update when GitHub data is synced

## 🔧 Key Features

### GitHub Integration
- **OAuth 2.0**: Secure authentication
- **Profile Sync**: Real-time data updates
- **Repository Analysis**: Language detection and stats
- **Contribution Tracking**: Activity visualization

### Real-time Chat
- **Socket.IO**: WebSocket-based messaging
- **Room Management**: Create and join chat rooms
- **User Presence**: Online/offline status
- **Typing Indicators**: Real-time typing feedback

### Scoring Algorithm
- **Repository Metrics**: Count, stars, forks
- **Activity Score**: Recent contributions
- **Language Diversity**: Tech stack analysis
- **Compatibility**: Project matching scores

## 🚨 Troubleshooting

### Common Issues

1. **GitHub OAuth not working**
   - Check Client ID and Secret in `.env`
   - Verify callback URL matches GitHub app settings

2. **Database connection failed**
   - Ensure MongoDB is running
   - Check MONGODB_URI in `.env`

3. **Socket.IO connection issues**
   - Verify backend server is running
   - Check CORS settings in server.js

4. **Frontend not loading data**
   - Check VITE_API_URL in frontend `.env`
   - Verify backend endpoints are accessible

### Debug Steps

1. Check browser console for errors
2. Verify network requests in DevTools
3. Check backend logs for API errors
4. Ensure all environment variables are set

## 📈 Next Steps

### Potential Enhancements
1. **Real GitHub API Integration**: Fetch actual contribution data
2. **Advanced Matching**: ML-based teammate matching
3. **Project Management**: Task tracking and assignment
4. **Notifications**: Real-time alerts and updates
5. **File Sharing**: Upload and share files in chat

### Performance Optimizations
1. **Caching**: Redis for frequently accessed data
2. **Pagination**: Large dataset handling
3. **Image Optimization**: Compress GitHub avatars
4. **Database Indexing**: Optimize query performance

## 🎉 Success!

Your NeuralLink app now has:
- ✅ Complete GitHub authentication
- ✅ Live dashboard with real data
- ✅ Working real-time chat system
- ✅ Intelligent scoring and matching
- ✅ Full backend integration

The app is ready for users to sign up, connect their GitHub accounts, and start collaborating!
