import { useState, useEffect, useRef } from "react";
import { Heart, Trash2, Edit2, Send, MessageSquare, AlertCircle, RefreshCw } from "lucide-react";
import { tweetApi } from "../api/tweet";
import { likeApi } from "../api/like";
import { useAuth } from "../context/AuthContext";
import { timeAgo } from "../utils/helpers";
import { Link } from "react-router-dom";

export function TweetPage() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tweetText, setTweetText] = useState("");
  const [posting, setPosting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const { user, isAuthenticated } = useAuth();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchTweets();
    }
  }, []);

  const fetchTweets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tweetApi.getAllTweets();
      if (response.success) {
        setTweets(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Failed to fetch tweets:", error);
      if (error?.response?.status === 404) {
        setError("Tweet routes not found in backend. Please add tweet routes to your backend.");
      } else if (error?.code === "ERR_NETWORK") {
        setError("Cannot connect to backend. Make sure your backend is running on http://localhost:8000");
      } else {
        setError(error?.response?.data?.message || "Failed to fetch tweets");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTweet = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !tweetText.trim() || posting) return;
    try {
      setPosting(true);
      const response = await tweetApi.createTweet(tweetText.trim());
      if (response.success) {
        setTweets([response.data, ...tweets]);
        setTweetText("");
      }
    } catch (error) {
      console.error("Failed to create tweet:", error);
      alert(error?.response?.data?.message || "Failed to post tweet");
    } finally {
      setPosting(false);
    }
  };

  const handleEdit = async (tweetId) => {
    if (!editText.trim()) return;
    try {
      const response = await tweetApi.updateTweet(tweetId, editText.trim());
      if (response.success) {
        setTweets(tweets.map(t =>
          t._id === tweetId ? { ...t, content: editText.trim() } : t
        ));
        setEditingId(null);
        setEditText("");
      }
    } catch (error) {
      console.error("Failed to edit tweet:", error);
    }
  };

  const handleDelete = async (tweetId) => {
    if (!window.confirm("Delete this tweet?")) return;
    try {
      await tweetApi.deleteTweet(tweetId);
      setTweets(tweets.filter(t => t._id !== tweetId));
    } catch (error) {
      console.error("Failed to delete tweet:", error);
    }
  };

  const handleLike = async (tweetId) => {
    if (!isAuthenticated) return;
    try {
      await likeApi.toggleTweetLike(tweetId);
      setTweets(tweets.map(tweet =>
        tweet._id === tweetId
          ? {
            ...tweet,
            isLiked: !tweet.isLiked,
            likesCount: tweet.isLiked ? (tweet.likesCount - 1) : (tweet.likesCount + 1),
          }
          : tweet
      ));
    } catch (error) {
      console.error("Failed to like tweet:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-7 h-7 text-red-500" />
        <h1 className="text-2xl font-bold text-white">Community</h1>
      </div>

      {/* Backend Error Banner */}
      {error && (
        <div className="mb-6 bg-red-900/30 border border-red-500/50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-400 font-semibold text-sm">Backend Error</p>
              <p className="text-red-300 text-sm mt-1">{error}</p>
              {error.includes("routes") && (
                <div className="mt-3 bg-zinc-900 rounded-lg p-3 text-xs font-mono">
                  <p className="text-green-400 mb-1">// Add to your backend src/app.js:</p>
                  <p className="text-zinc-300">import tweetRouter from "./routes/tweet.routes.js"</p>
                  <p className="text-zinc-300">app.use("/api/v1/tweets", tweetRouter)</p>
                </div>
              )}
              <button
                onClick={() => { hasFetched.current = false; fetchTweets(); }}
                className="mt-3 flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
              >
                <RefreshCw className="w-4 h-4" /> Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Tweet Box */}
      {isAuthenticated ? (
        <form onSubmit={handleTweet} className="mb-6 bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <div className="flex gap-3">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.fullName}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                <span className="text-sm text-white font-bold">
                  {user?.fullName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1">
              <textarea
                value={tweetText}
                onChange={(e) => setTweetText(e.target.value)}
                placeholder="Share something with your community..."
                rows={3}
                maxLength={500}
                className="w-full bg-transparent text-white placeholder-zinc-500 resize-none focus:outline-none text-sm"
              />
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800">
                <span className="text-xs text-zinc-500">{tweetText.length}/500</span>
                <button
                  type="submit"
                  disabled={!tweetText.trim() || posting}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
                >
                  {posting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {posting ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 bg-zinc-900 rounded-xl p-6 text-center border border-zinc-800">
          <MessageSquare className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 mb-3">Login to post in the community</p>
          <Link to="/login"
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-6 py-2 rounded-full transition-colors">
            Login
          </Link>
        </div>
      )}

      {/* Tweets List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-zinc-900 rounded-xl p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-zinc-800 rounded w-1/4" />
                  <div className="h-4 bg-zinc-800 rounded w-3/4" />
                  <div className="h-4 bg-zinc-800 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : tweets.length === 0 && !error ? (
        <div className="text-center py-16">
          <MessageSquare className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-zinc-400 mb-2">No posts yet</h3>
          <p className="text-zinc-500 text-sm">Be the first to post in the community!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tweets.map(tweet => (
            <div key={tweet._id} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="flex gap-3">
                {/* Avatar */}
                <Link to={`/channel/${tweet.owner?.username}`} className="flex-shrink-0">
                  {tweet.owner?.avatar ? (
                    <img src={tweet.owner.avatar} alt={tweet.owner.fullName}
                      className="w-10 h-10 rounded-full object-cover hover:ring-2 hover:ring-red-500 transition-all" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                      <span className="text-sm text-white font-bold">
                        {tweet.owner?.fullName?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link to={`/channel/${tweet.owner?.username}`}
                      className="font-semibold text-white text-sm hover:text-red-400 transition-colors">
                      {tweet.owner?.fullName}
                    </Link>
                    <span className="text-zinc-500 text-xs">@{tweet.owner?.username}</span>
                    <span className="text-zinc-600 text-xs">·</span>
                    <span className="text-zinc-500 text-xs">{timeAgo(tweet.createdAt)}</span>
                  </div>

                  {/* Edit mode */}
                  {editingId === tweet._id ? (
                    <div className="mt-2">
                      <textarea
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        rows={3}
                        className="w-full bg-zinc-800 text-white rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleEdit(tweet._id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-full transition-colors">
                          Save
                        </button>
                        <button onClick={() => { setEditingId(null); setEditText(""); }}
                          className="bg-zinc-700 hover:bg-zinc-600 text-white text-xs px-3 py-1 rounded-full transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-zinc-200 text-sm leading-relaxed break-words">{tweet.content}</p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={() => handleLike(tweet._id)}
                      className={`flex items-center gap-1.5 text-xs transition-colors ${tweet.isLiked ? "text-red-500" : "text-zinc-500 hover:text-red-400"}`}
                    >
                      <Heart className={`w-4 h-4 ${tweet.isLiked ? "fill-red-500" : ""}`} />
                      <span>{tweet.likesCount || 0}</span>
                    </button>

                    {/* Edit & Delete for own tweets */}
                    {user && tweet.owner?._id === user._id && editingId !== tweet._id && (
                      <>
                        <button
                          onClick={() => { setEditingId(tweet._id); setEditText(tweet.content); }}
                          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-blue-400 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(tweet._id)}
                          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
