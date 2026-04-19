import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { WatchPage } from "./pages/WatchPage";
import { ChannelPage } from "./pages/ChannelPage";
import { HistoryPage } from "./pages/HistoryPage";
import { LikedVideosPage } from "./pages/LikedVideosPage";
import { TweetPage } from "./pages/TweetPage";
import { SearchPage } from "./pages/SearchPage";
import { UploadPage } from "./pages/UploadPage";
import { MyChannelRedirect } from "./pages/MyChannelRedirect";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/watch/:videoId" element={<WatchPage />} />
                  <Route path="/channel/:username" element={<ChannelPage />} />
                  {/* My Channel redirect - uses logged in user's username */}
                  <Route path="/channel" element={<MyChannelRedirect />} />
                  <Route path="/my-channel" element={<MyChannelRedirect />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/liked" element={<LikedVideosPage />} />
                  <Route path="/community" element={<TweetPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/explore" element={<HomePage />} />
                  <Route path="/shorts" element={<HomePage />} />
                  <Route path="/playlists" element={<HomePage />} />
                  <Route path="/upload" element={<UploadPage />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
