# 🎨 Frontend – Social Media Platform (YouTube + Twitter Clone)

This is the frontend of a full-stack social media application inspired by YouTube and Twitter. It provides a modern UI for video browsing, tweeting, user authentication, and content interaction.

Built using React.js with Vite, the application communicates with a backend API for all data operations.

---

## 🚀 Features

* 🔐 User Authentication (Login / Register)
* 🎥 Video Feed & Watch Page
* 🐦 Tweet (Microblogging) System
* ❤️ Like & Interaction Features
* 📺 Channel & User Pages
* 🔍 Search Functionality
* 📱 Responsive UI Design

---

## 🛠️ Tech Stack

* React.js
* JavaScript (ES6+)
* Vite
* Context API (State Management)
* Fetch API / Axios

---

## 📁 Project Structure

```id="t0tfsp"
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

## 🔗 Backend Integration

This frontend connects to a backend API (Node.js + Express).

Use environment variable for API base URL:

```id="ydp2y9"
const API_URL = import.meta.env.VITE_API_URL;
```

---

## ⚙️ Setup Instructions

### 1. Clone repository

```id="g2ahpu"
git clone https://github.com/Jharwal77/frontendrepoforyt.git
cd frontendrepoforyt
```

### 2. Install dependencies

```id="hy3p2k"
npm install
```

### 3. Create `.env` file

```id="ntfp0g"
VITE_API_URL=https://your-backend-url.onrender.com
```

### 4. Run development server

```id="3dwyq8"
npm run dev
```

---

## 🌐 Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## 📌 Important Notes

* Backend must be running for full functionality
* Do not commit `.env` file
* Replace API URL for production deployment

---

## 🚀 Future Improvements

* 💬 Comments UI improvements
* 🔔 Notifications system
* 📤 Media upload enhancements
* 🧠 Recommendation system

---

## 👨‍💻 Author

Rahul Jharwal
Full Stack Developer (MERN)

---

## ⭐ Contributing

Pull requests are welcome. For major changes, open an issue first.

---

## 📜 License

This project is licensed under the MIT License.
