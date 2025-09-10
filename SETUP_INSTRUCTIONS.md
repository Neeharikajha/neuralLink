# NeuralLink Setup Instructions

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Create a `.env` file in the backend directory with the following variables:

```env
# Database
MONGO_URI=mongodb://localhost:27017/neurallink

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 3. GitHub OAuth Setup
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to: `http://localhost:5000/auth/github/callback`
4. Copy the Client ID and Client Secret to your `.env` file

### 4. Start Backend Server
```bash
npm run dev
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd neurallink
npm install
```

### 2. Environment Variables
Create a `.env` file in the neurallink directory:

```env
VITE_API_URL=http://localhost:5000
```

### 3. Start Frontend Server
```bash
npm run dev
```

## Features Implemented

### 1. GitHub Authentication
- GitHub OAuth integration
- User GitHub profile data extraction and storage
- GitHub repositories information
- Automatic user creation on first GitHub login

### 2. Chat System
- Real-time chat using Socket.IO
- User-specific chat rooms based on authentication tokens
- Message history persistence
- Typing indicators
- Room creation and management
- User presence tracking

### 3. Database Models
- **Auth**: User authentication with support for local and GitHub auth
- **GitHub**: GitHub profile and repository data
- **ChatRoom**: Chat room management with participants
- **Message**: Individual chat messages with metadata

## API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/github/callback` - GitHub OAuth callback
- `GET /auth/github/profile` - Get user's GitHub profile
- `POST /auth/github/sync` - Sync GitHub data

### Chat
- `POST /chat/rooms` - Create chat room
- `GET /chat/rooms` - Get user's chat rooms
- `GET /chat/rooms/:roomId/messages` - Get room messages
- `POST /chat/rooms/:roomId/join` - Join chat room
- `POST /chat/rooms/:roomId/leave` - Leave chat room

## Socket.IO Events

### Client to Server
- `join_room` - Join a chat room
- `leave_room` - Leave a chat room
- `send_message` - Send a message
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator

### Server to Client
- `new_message` - New message received
- `user_typing` - User typing indicator
- `joined_room` - Successfully joined room
- `user_joined` - User joined the room
- `user_left` - User left the room
- `error` - Error message

## Usage

1. Start both backend and frontend servers
2. Navigate to the chat page
3. Create or join chat rooms
4. Start chatting with real-time messaging
5. GitHub users can authenticate via GitHub OAuth for enhanced profile data
