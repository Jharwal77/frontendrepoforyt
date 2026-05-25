# 🚀 Frontend – Social Media Platform (YouTube + Twitter Clone)

A production-style frontend application for a full-stack social media platform inspired by platforms like YouTube and Twitter.

The platform provides a modern user interface for video streaming, tweeting, subscriptions, likes, comments, playlists, and interactive social features.

Built using React.js and Vite, the frontend follows a scalable component-based architecture with reusable UI components, Context API state management, responsive layouts, and seamless backend API integration.

---

## 🌐 Live Frontend

### Frontend Application

https://viewtube-six.vercel.app/

### GitHub Repository

https://github.com/Jharwal77/frontendrepoforyt

---

# ✨ Features

## 🔐 Authentication & Authorization

* User Registration
* User Login
* JWT Authentication Integration
* Protected Routes
* Persistent User Sessions
* Authentication Context Management

## 🎥 Video Platform Features

* Video Feed
* Watch Video Page
* Video Upload Interface
* Video Cards & Grid Layout
* Dynamic Content Rendering
* Responsive Video Browsing Experience

## 🐦 Tweet System

* Create Tweets
* View Tweets Feed
* User Tweet Pages
* Interactive Social Posts

## ❤️ Social Interaction Features

* Like Videos
* Comment System
* Subscription System
* Playlist Management
* Watch History
* Liked Videos Section

## 🔍 Search Functionality

* Search Videos
* Search Content
* Dynamic Search Results

## 📱 Responsive UI Design

* Mobile Responsive Layout
* Sidebar Navigation
* Reusable Layout Components
* Adaptive Screen Support
* Clean User Experience

## ⚙️ Frontend Engineering Features

* Component-Based Architecture
* Context API State Management
* API Abstraction Layer
* Reusable UI Components
* Environment-Based Configuration

---

# 🛠️ Tech Stack

## Frontend

* React.js
* JavaScript (ES6+)
* Vite

## State Management

* Context API

## API Communication

* Axios
* Fetch API

## Styling

* CSS
* Responsive Layout Design

---

# 📁 Project Structure

```bash
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
```

---

# 🔗 Backend Integration

This frontend communicates with a Node.js + Express backend API.

## API Configuration

```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

The backend handles:

* authentication
* video management
* tweet APIs
* likes & comments
* subscriptions
* media uploads

---

# ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

---

# 🚀 Setup Instructions

## 1. Clone Repository

```bash
git clone https://github.com/Jharwal77/frontendrepoforyt.git
cd frontendrepoforyt
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env` file and add the backend API URL.

---

## 4. Start Development Server

```bash
npm run dev
```

Application runs on:

```bash
http://localhost:5173
```

---

# 📄 Application Pages

| Page            | Purpose                  |
| --------------- | ------------------------ |
| HomePage        | Video feed & homepage    |
| WatchPage       | Video watching interface |
| LoginPage       | User login               |
| RegisterPage    | User registration        |
| ChannelPage     | User profile/channel     |
| SearchPage      | Search results           |
| TweetPage       | Tweets & interactions    |
| UploadPage      | Upload content           |
| HistoryPage     | Watch history            |
| LikedVideosPage | User liked videos        |

---

# ⚡ Frontend Architecture Highlights

## Component-Based Architecture

Reusable React components improve scalability and maintainability.

## API Abstraction Layer

Dedicated API modules separate frontend UI from backend communication logic.

## Global Authentication State

Context API manages:

* user authentication
* session persistence
* protected routing

## Responsive User Experience

Optimized layouts for:

* desktop
* tablet
* mobile devices

---

# 🌍 Deployment

## Frontend

* Vercel

## Backend

* Render

## Database

* MongoDB Atlas

---

# 📌 Important Notes

* Backend server must be running for full functionality
* Do not commit `.env` files
* Configure production API URLs before deployment
* Ensure proper CORS setup on backend

---

# 🚀 Future Improvements

Potential future enhancements:

* 🔔 Notifications System
* 💬 Improved Comments UI
* 📤 Advanced Media Uploads
* 🧠 Recommendation Engine
* 🌙 Dark Mode
* 📡 Real-Time Features
* 🎯 Personalized Feed
* ⚡ Performance Optimization
* 🔍 Advanced Search Filters

---

# 👨‍💻 Author

Rahul Meena
Full Stack Developer (MERN)

---

# ⭐ Contributing

Pull requests are welcome.

For major changes, please open an issue first to discuss proposed updates.

