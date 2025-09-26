# Quick Start Guide - NeuralLink App

## 🚀 Get Started in 5 Minutes

### 1. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in `backend` directory:
```env
MONGODB_URI=mongodb://localhost:27017/neurallink
JWT_SECRET=your_jwt_secret_here
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:5173/auth/github/callback
CLIENT_URL=http://localhost:5173
PORT=5000
```

Start backend:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd neurallink
npm install
```

Create `.env` file in `neurallink` directory:
```env
VITE_API_URL=http://localhost:5000
```

Start frontend:
```bash
npm run dev
```

### 3. GitHub OAuth Setup
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth App:
   - **Application name**: NeuralLink
   - **Homepage URL**: http://localhost:5173
   - **Authorization callback URL**: http://localhost:5173/auth/github/callback
3. Copy Client ID and Client Secret to backend `.env`

### 4. Test the App
1. Open http://localhost:5173
2. Click "Get Started"
3. Click "Continue with GitHub"
4. Authorize the app
5. You'll be redirected to dashboard with your GitHub data!

## ✅ Features Working
- ✅ GitHub OAuth authentication
- ✅ Live dashboard with GitHub data
- ✅ Real-time chat system
- ✅ User scoring and matching
- ✅ Dark theme UI

## 🔧 Troubleshooting
- **Backend not starting**: Check MongoDB is running
- **GitHub auth not working**: Verify OAuth app settings
- **Frontend not loading**: Check VITE_API_URL in .env
- **Chat not working**: Ensure backend is running on port 5000

## 📱 Usage Flow
1. **Landing Page**: Click "Get Started"
2. **Login**: Click "Continue with GitHub"
3. **Dashboard**: See your GitHub stats and data
4. **Chat**: Create rooms and chat with other users
5. **Find Teammates**: Browse and match with other developers

Your NeuralLink app is now ready! 🎉
