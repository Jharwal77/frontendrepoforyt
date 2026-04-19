import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  ListVideo,
  User,
  Menu,
  X,
  Upload,
  MessageSquare,
  LogIn,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../utils/helpers";
import { useAuth } from "../../context/AuthContext";

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const isActive = (path) => location.pathname === path;

  const mainMenu = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Compass, label: "Explore", path: "/explore" },
    { icon: PlaySquare, label: "Shorts", path: "/shorts" },
    { icon: ListVideo, label: "Playlists", path: "/playlists" },
  ];

  const libraryMenu = [
    { icon: Clock, label: "History", path: "/history" },
    { icon: ThumbsUp, label: "Liked Videos", path: "/liked" },
    { icon: MessageSquare, label: "Community", path: "/community" },
  ];

  // My Channel path - uses username if logged in
  const myChannelPath = isAuthenticated && user?.username
    ? `/channel/${user.username}`
    : "/login";

  const handleMyChannel = (e) => {
    e.preventDefault();
    setIsExpanded(false);
    if (isAuthenticated && user?.username) {
      navigate(`/channel/${user.username}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed top-3 left-4 z-50 lg:hidden p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors"
      >
        {isExpanded ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Menu className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-zinc-950 border-r border-zinc-800 z-40 transition-transform duration-300",
          isExpanded ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "w-64 lg:w-60 xl:w-64"
        )}
      >
        <div className="h-full overflow-y-auto pt-16 pb-4 px-3 flex flex-col">

          {/* UPLOAD BUTTON */}
          <div className="mb-4">
            <Link
              to={isAuthenticated ? "/upload" : "/login"}
              onClick={() => setIsExpanded(false)}
              className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Video</span>
            </Link>
          </div>

          <div className="h-px bg-zinc-800 mb-4" />

          {/* Main Menu */}
          <div className="mb-2">
            {mainMenu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsExpanded(false)}
                className={cn(
                  "flex items-center gap-4 px-3 py-2.5 rounded-lg transition-colors mb-0.5",
                  isActive(item.path)
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="h-px bg-zinc-800 my-3" />

          {/* Library */}
          <div className="mb-2">
            <h3 className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Library
            </h3>
            {libraryMenu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsExpanded(false)}
                className={cn(
                  "flex items-center gap-4 px-3 py-2.5 rounded-lg transition-colors mb-0.5",
                  isActive(item.path)
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}

            {/* My Channel - Special handling with username */}
            <a
              href={myChannelPath}
              onClick={handleMyChannel}
              className={cn(
                "flex items-center gap-4 px-3 py-2.5 rounded-lg transition-colors mb-0.5 cursor-pointer",
                isAuthenticated && user?.username && isActive(`/channel/${user.username}`)
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              )}
            >
              {isAuthenticated && user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <User className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm font-medium">My Channel</span>
              {isAuthenticated && user?.username && (
                <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
              )}
            </a>
          </div>

          <div className="h-px bg-zinc-800 my-3" />

          {/* Subscriptions */}
          <div className="flex-1">
            <h3 className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Subscriptions
            </h3>
            {isAuthenticated ? (
              <p className="px-3 text-zinc-600 text-xs">
                Your subscriptions will appear here
              </p>
            ) : (
              <div className="px-3">
                <p className="text-zinc-500 text-xs mb-3">
                  Sign in to see your subscriptions
                </p>
                <Link
                  to="/login"
                  onClick={() => setIsExpanded(false)}
                  className="flex items-center gap-2 border border-blue-500 text-blue-400 hover:bg-blue-500/10 px-3 py-2 rounded-full transition-colors text-sm font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* User Info at bottom if logged in */}
          {isAuthenticated && user && (
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <a
                href={`/channel/${user.username}`}
                onClick={(e) => {
                  e.preventDefault();
                  setIsExpanded(false);
                  navigate(`/channel/${user.username}`);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">
                      {user.fullName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-medium truncate">{user.fullName}</p>
                  <p className="text-zinc-400 text-xs truncate">@{user.username}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 flex-shrink-0" />
              </a>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
