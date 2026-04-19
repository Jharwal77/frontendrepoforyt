import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Mic,
  Bell,
  Upload,
  User,
  LogOut,
  LogIn,
  Settings,
  Video,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-zinc-950 border-b border-zinc-800 z-50 flex items-center justify-between px-4 gap-4">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-1 flex-shrink-0 ml-14 lg:ml-2">
        <div className="flex items-center gap-1">
          <div className="bg-red-600 rounded-lg p-1">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <path d="M10 8.64L15.27 12 10 15.36V8.64M8 5v14l11-7L8 5z" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight hidden sm:block">
            ViewTube
          </span>
        </div>
      </Link>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex items-center flex-1 max-w-2xl">
        <div className="flex items-center flex-1">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-zinc-900 border border-zinc-700 rounded-l-full px-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="h-10 px-5 bg-zinc-800 border border-l-0 border-zinc-700 rounded-r-full hover:bg-zinc-700 transition-colors"
          >
            <Search className="w-5 h-5 text-zinc-300" />
          </button>
        </div>
        <button
          type="button"
          className="ml-2 p-2.5 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors hidden sm:block"
        >
          <Mic className="w-5 h-5 text-zinc-300" />
        </button>
      </form>

      {/* Right Side */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {isAuthenticated ? (
          <>
            {/* ✅ UPLOAD BUTTON - Visible for logged in users */}
            <Link
              to="/upload"
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 hover:border-zinc-500 text-white px-4 py-2 rounded-full transition-all duration-200 font-medium text-sm"
            >
              <Upload className="w-4 h-4 text-red-400" />
              <span className="hidden sm:block">Upload</span>
            </Link>

            {/* Notification */}
            <button className="p-2 rounded-full hover:bg-zinc-800 transition-colors relative">
              <Bell className="w-5 h-5 text-zinc-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 hover:bg-zinc-800 rounded-full p-1 transition-colors"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
                <ChevronDown className="w-3 h-3 text-zinc-400 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                    {/* User Info */}
                    <div className="p-4 border-b border-zinc-700">
                      <div className="flex items-center gap-3">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.fullName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                            <span className="text-white font-bold">
                              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-white font-semibold text-sm truncate">{user?.fullName}</p>
                          <p className="text-zinc-400 text-xs truncate">@{user?.username}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <Link
                        to={`/channel/${user?.username}`}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm">Your Channel</span>
                      </Link>
                      <Link
                        to="/upload"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                      >
                        <Video className="w-4 h-4" />
                        <span className="text-sm">Upload Video</span>
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                      </Link>

                      <div className="h-px bg-zinc-700 my-2" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Upload button for non-logged in - redirects to login */}
            <Link
              to="/login"
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white px-4 py-2 rounded-full transition-all duration-200 font-medium text-sm"
            >
              <Upload className="w-4 h-4 text-red-400" />
              <span className="hidden sm:block">Upload</span>
            </Link>

            {/* Sign In Button */}
            <Link
              to="/login"
              className="flex items-center gap-2 border border-blue-500 text-blue-400 hover:bg-blue-500/10 px-4 py-2 rounded-full transition-colors font-medium text-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
