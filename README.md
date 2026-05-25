🚀 Frontend – Social Media Platform (YouTube + Twitter Clone)

A modern frontend application for a full-stack social media platform inspired by YouTube and Twitter.

The platform provides an interactive UI for video streaming, tweeting, user authentication, subscriptions, likes, comments, playlists, and content discovery.

Built using React.js and Vite, the frontend communicates with a scalable backend API and focuses on responsive UI design, modular architecture, reusable components, and smooth user experience.

🌐 Live Demo
Frontend Application

https://viewtube-six.vercel.app/

GitHub Repository

https://github.com/Jharwal77/frontendrepoforyt

✨ Features
🔐 Authentication System
User Registration
User Login
JWT Authentication Integration
Protected Routes
Persistent User Sessions
🎥 Video Platform Features
Video Feed
Watch Video Page
Video Cards & Grid Layout
Trending Content Display
Upload Video Interface
🐦 Tweet (Microblogging) System
Create Tweets
View Tweet Feed
User Tweet Pages
Interactive Social Feed
❤️ Social Interaction Features
Like Videos
Comment System
Subscription System
Playlist Management
Watch History
Liked Videos Section
🔍 Search Functionality
Search Videos
Search Content Feed
Dynamic Search Pages
📱 Responsive UI
Mobile Responsive Design
Sidebar Navigation
Reusable Layout Components
Clean User Interface
🛠️ Tech Stack
Frontend
React.js
JavaScript (ES6+)
Vite
State Management
Context API
API Communication
Fetch API
Axios
Styling
CSS
Responsive Layout Design
📁 Project Structure
src/
│
├── api/                    # API layer (backend communication)
│   ├── auth.js
│   ├── video.js
│   ├── tweet.js
│   ├── comment.js
│   ├── like.js
│   ├── playlist.js
│   ├── subscription.js
│   └── config.js
│
├── components/             # Reusable UI components
│   ├── layout/
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   │
│   └── video/
│       ├── VideoCard.jsx
│       └── VideoGrid.jsx
│
├── context/                # Global state
│   └── AuthContext.jsx
│
├── pages/                  # Application pages
│   ├── HomePage.jsx
│   ├── WatchPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── ChannelPage.jsx
│   ├── HistoryPage.jsx
│   ├── LikedVideosPage.jsx
│   ├── SearchPage.jsx
│   ├── TweetPage.jsx
│   ├── UploadPage.jsx
│   └── MyChannelRedirect.jsx
│
├── assets/                 # Images & icons
├── utils/                  # Helper functions
│   └── helpers.js
│
├── App.jsx
├── App.css
├── index.css
└── main.jsx
🔗 Backend Integration

This frontend communicates with a Node.js + Express backend API.

API Configuration
const API_URL = import.meta.env.VITE_API_URL;

The backend handles:

authentication
video management
tweet APIs
likes & comments
subscriptions
media uploads
⚙️ Environment Variables

Create a .env file in the project root:

VITE_API_URL=https://your-backend-url.onrender.com
🚀 Setup Instructions
1. Clone Repository
git clone https://github.com/Jharwal77/frontendrepoforyt.git
cd frontendrepoforyt
2. Install Dependencies
npm install
3. Configure Environment Variables

Create a .env file and add the backend API URL.

4. Start Development Server
npm run dev

Application runs on:

http://localhost:5173
📄 Application Pages
Page	Purpose
HomePage	Video feed & homepage
WatchPage	Video watching interface
LoginPage	User login
RegisterPage	User registration
ChannelPage	User channel/profile
SearchPage	Search results
TweetPage	Tweet feed & interactions
UploadPage	Upload new content
HistoryPage	Watch history
LikedVideosPage	User liked videos
⚡ Frontend Architecture Highlights
Component-Based Architecture

Reusable React components improve scalability and maintainability.

API Abstraction Layer

Dedicated API modules separate frontend UI from backend communication logic.

Global Authentication State

Context API manages:

user session
authentication state
protected routing
Responsive Design

Optimized layouts for:

desktop
tablet
mobile devices
🌍 Deployment
Frontend
Vercel
Backend
Render
Database
MongoDB Atlas
📌 Important Notes
Backend server must be running for full functionality
Do not commit .env files
Configure production API URLs before deployment
Ensure proper CORS setup on backend
🚀 Future Improvements

Potential future enhancements:

💬 Improved Comments UI
🔔 Notifications System
📤 Advanced Media Uploads
🧠 Recommendation Engine
🌙 Dark Mode
📡 Real-Time Features
🎯 Personalized Feed
⚡ Performance Optimization
🔍 Advanced Search Filters
👨‍💻 Author

Rahul Jharwal
Full Stack Developer (MERN)

⭐ Contributing

Pull requests are welcome.

For major changes, please open an issue first to discuss proposed updates.
