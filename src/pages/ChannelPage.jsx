import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { User, Bell, BellOff, PlaySquare, Grid, AlertCircle, CheckCircle } from "lucide-react";
import { authApi } from "../api/auth";
import { videoApi } from "../api/video";
import { subscriptionApi } from "../api/subscription";
import { useAuth } from "../context/AuthContext";
import { formatNumber, formatViews, timeAgo } from "../utils/helpers";

export function ChannelPage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [subscribing, setSubscribing] = useState(false);
  const [activeTab, setActiveTab] = useState("videos");
  const [subscribeMsg, setSubscribeMsg] = useState(null);

  useEffect(() => {
    if (!username) {
      setError("No channel username provided");
      setLoading(false);
      return;
    }
    fetchChannel();
  }, [username]);

  useEffect(() => {
    if (channel?._id) {
      fetchChannelVideos(channel._id);
    }
  }, [channel]);

  const fetchChannel = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching channel for username:", username);
      const response = await authApi.getUserChannelProfile(username);
      console.log("Channel response:", response);
      if (response.success) {
        setChannel(response.data);
        setIsSubscribed(response.data.isSubscribed || false);
        setSubscribersCount(response.data.subscribersCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch channel:", err);
      setError(err.response?.data?.message || "Channel not found");
    } finally {
      setLoading(false);
    }
  };

  const fetchChannelVideos = async (userId) => {
    try {
      setVideosLoading(true);
      const response = await videoApi.getUserVideos(userId);
      if (response.success) {
        const data = response.data;
        if (Array.isArray(data)) {
          setVideos(data);
        } else if (data?.docs) {
          setVideos(data.docs);
        } else {
          setVideos([]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch channel videos:", err);
      setVideos([]);
    } finally {
      setVideosLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!channel?._id) return;

    try {
      setSubscribing(true);
      const response = await subscriptionApi.toggleSubscription(channel._id);
      const newSubscribed = !isSubscribed;
      setIsSubscribed(newSubscribed);
      setSubscribersCount((prev) => (newSubscribed ? prev + 1 : prev - 1));
      setSubscribeMsg(newSubscribed ? "Subscribed!" : "Unsubscribed");
      setTimeout(() => setSubscribeMsg(null), 2000);
    } catch (err) {
      console.error("Subscribe failed:", err);
      // If subscription route doesn't exist yet
      if (err.response?.status === 404) {
        setSubscribeMsg("⚠️ Subscription route not set up in backend yet");
        setTimeout(() => setSubscribeMsg(null), 3000);
      }
    } finally {
      setSubscribing(false);
    }
  };

  const isOwnChannel = user?.username === username;

  // Loading state
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-48 bg-zinc-800 rounded-xl mb-6" />
        <div className="flex items-center gap-4 mb-8 px-4">
          <div className="w-24 h-24 rounded-full bg-zinc-800" />
          <div className="space-y-3 flex-1">
            <div className="h-6 bg-zinc-800 rounded w-48" />
            <div className="h-4 bg-zinc-800 rounded w-32" />
            <div className="h-4 bg-zinc-800 rounded w-24" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-video bg-zinc-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error || !channel) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h2 className="text-xl font-semibold text-white">Channel Not Found</h2>
        <p className="text-zinc-400 text-center max-w-md">
          {error || `The channel "@${username}" does not exist or could not be loaded.`}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Subscribe toast message */}
      {subscribeMsg && (
        <div className="fixed top-20 right-4 z-50 bg-zinc-800 border border-zinc-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>{subscribeMsg}</span>
        </div>
      )}

      {/* Cover Image */}
      <div className="h-40 sm:h-56 rounded-xl overflow-hidden bg-gradient-to-r from-zinc-800 to-zinc-700 mb-0">
        {channel.coverImage ? (
          <img
            src={channel.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-red-900/40 via-zinc-800 to-zinc-900" />
        )}
      </div>

      {/* Channel Info */}
      <div className="px-4 sm:px-6 py-6 border-b border-zinc-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Avatar */}
          <div className="-mt-12 sm:-mt-16 relative z-10">
            {channel.avatar ? (
              <img
                src={channel.avatar}
                alt={channel.fullName}
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-zinc-900"
              />
            ) : (
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-zinc-700 border-4 border-zinc-900 flex items-center justify-center">
                <User className="w-10 h-10 text-zinc-400" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{channel.fullName}</h1>
            <p className="text-zinc-400 text-sm mt-1">@{channel.username}</p>
            <div className="flex items-center gap-3 mt-1 text-sm text-zinc-500">
              <span>{formatNumber(subscribersCount)} subscribers</span>
              <span>•</span>
              <span>{videos.length} videos</span>
              {channel.channelsSubscribedToCount !== undefined && (
                <>
                  <span>•</span>
                  <span>{formatNumber(channel.channelsSubscribedToCount)} subscriptions</span>
                </>
              )}
            </div>
          </div>

          {/* Subscribe / Edit Button */}
          <div className="flex items-center gap-2">
            {isOwnChannel ? (
              <Link
                to="/settings"
                className="px-5 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-full text-sm font-medium transition"
              >
                Edit Channel
              </Link>
            ) : (
              <button
                onClick={handleSubscribe}
                disabled={subscribing}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  isSubscribed
                    ? "bg-zinc-700 hover:bg-zinc-600 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {subscribing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Loading...
                  </span>
                ) : isSubscribed ? (
                  <>
                    <BellOff className="w-4 h-4" />
                    Subscribed
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    Subscribe
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 px-4 sm:px-6 mt-2">
        {["videos", "about"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-white text-white"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6 px-2">
        {activeTab === "videos" && (
          <>
            {videosLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-video bg-zinc-800 rounded-xl" />
                    <div className="mt-3 space-y-2">
                      <div className="h-4 bg-zinc-800 rounded w-full" />
                      <div className="h-3 bg-zinc-800 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {videos.map((video) => (
                  <Link
                    key={video._id}
                    to={`/watch/${video._id}`}
                    className="group block"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800">
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PlaySquare className="w-12 h-12 text-zinc-600" />
                        </div>
                      )}
                      {video.duration && (
                        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                          {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, "0")}
                        </span>
                      )}
                      {!video.isPublished && (
                        <span className="absolute top-2 left-2 bg-yellow-600 text-white text-xs px-2 py-0.5 rounded">
                          Private
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1">
                        {formatViews(video.views)} • {timeAgo(video.createdAt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <PlaySquare className="w-16 h-16 text-zinc-600" />
                <p className="text-zinc-400 text-lg">No videos yet</p>
                {isOwnChannel && (
                  <Link
                    to="/upload"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
                  >
                    Upload your first video
                  </Link>
                )}
              </div>
            )}
          </>
        )}

        {activeTab === "about" && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-zinc-900 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Channel Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-zinc-400" />
                  <div>
                    <p className="text-xs text-zinc-500">Full Name</p>
                    <p className="text-white">{channel.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-400 text-lg">@</span>
                  <div>
                    <p className="text-xs text-zinc-500">Username</p>
                    <p className="text-white">@{channel.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-zinc-400" />
                  <div>
                    <p className="text-xs text-zinc-500">Subscribers</p>
                    <p className="text-white">{formatNumber(subscribersCount)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
