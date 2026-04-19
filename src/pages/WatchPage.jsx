import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bell,
  User,
  Send,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { videoApi } from "../api/video";
import { likeApi } from "../api/like";
import { commentApi } from "../api/comment";
import { subscriptionApi } from "../api/subscription";
import { useAuth } from "../context/AuthContext";
import { formatNumber, formatViews, timeAgo } from "../utils/helpers";

export function WatchPage() {
  const { videoId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [addingComment, setAddingComment] = useState(false);
  const commentInputRef = useRef(null);

  useEffect(() => {
    fetchVideo();
    fetchComments();
    fetchRecommended();
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const response = await videoApi.getVideoById(videoId);
      if (response.success) {
        setVideo(response.data);
        setIsLiked(response.data.isLiked || false);
        setLikesCount(response.data.likesCount || 0);
        setIsSubscribed(response.data.owner?.isSubscribed || false);
        setSubscribersCount(response.data.owner?.subscribersCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch video:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      setCommentsError(null);
      const response = await commentApi.getVideoComments(videoId);
      if (response.success) {
        // handle paginated or direct array
        const data = response.data;
        if (Array.isArray(data)) {
          setComments(data);
        } else if (data?.docs) {
          setComments(data.docs);
        } else {
          setComments([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      if (error?.response?.status === 404) {
        setCommentsError("404");
      } else {
        setCommentsError("error");
      }
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const fetchRecommended = async () => {
    try {
      const response = await videoApi.getAllVideos({ limit: 10 });
      if (response.success) {
        const data = response.data;
        const videos = Array.isArray(data)
          ? data
          : data?.docs || [];
        setRecommendedVideos(videos.filter((v) => v._id !== videoId));
      }
    } catch (error) {
      console.error("Failed to fetch recommended:", error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) return;
    try {
      await likeApi.toggleVideoLike(videoId);
      if (isLiked) {
        setLikesCount((prev) => prev - 1);
      } else {
        setLikesCount((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Failed to like video:", error);
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated || !video?.owner?._id) return;
    try {
      await subscriptionApi.toggleSubscription(video.owner._id);
      if (isSubscribed) {
        setSubscribersCount((prev) => prev - 1);
      } else {
        setSubscribersCount((prev) => prev + 1);
      }
      setIsSubscribed(!isSubscribed);
    } catch (error) {
      console.error("Failed to subscribe:", error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !commentText.trim()) return;
    try {
      setAddingComment(true);
      const response = await commentApi.addComment(videoId, commentText);
      if (response.success) {
        const newComment = {
          ...response.data,
          owner: {
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            avatar: user.avatar,
          },
        };
        setComments([newComment, ...comments]);
        setCommentText("");
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setAddingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="aspect-video bg-zinc-800 rounded-xl mb-4" />
            <div className="h-6 bg-zinc-800 rounded w-3/4 mb-3" />
            <div className="h-4 bg-zinc-800 rounded w-1/2 mb-4" />
            <div className="h-16 bg-zinc-800 rounded-xl mb-4" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-2">
                <div className="w-40 h-24 bg-zinc-800 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-zinc-800 rounded" />
                  <div className="h-3 bg-zinc-800 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-16 h-16 text-zinc-500 mb-4" />
        <p className="text-xl text-zinc-400">Video not found</p>
        <Link to="/" className="mt-4 text-blue-400 hover:underline">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── Main Content ─── */}
        <div className="lg:col-span-2">
          {/* Video Player */}
          <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
            {video.videoFile ? (
              <video
                src={video.videoFile}
                controls
                autoPlay
                className="w-full h-full"
                poster={video.thumbnail}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-zinc-500">Video not available</p>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-xl font-semibold text-white mb-2">
            {video.title}
          </h1>

          {/* Views & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <p className="text-sm text-zinc-400">
              {formatViews(video.views)} views •{" "}
              {timeAgo(video.createdAt)}
            </p>

            <div className="flex items-center gap-2">
              {/* Like */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                  isLiked
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-white hover:bg-zinc-700"
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{formatNumber(likesCount)}</span>
              </button>

              {/* Dislike */}
              <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-full text-white hover:bg-zinc-700 transition-colors">
                <ThumbsDown className="w-4 h-4" />
              </button>

              {/* Share */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied!");
                }}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-full text-white hover:bg-zinc-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          {/* Channel Info */}
          <div className="flex items-center gap-4 p-4 bg-zinc-900 rounded-xl mb-4">
            <Link
              to={`/channel/${video.owner?.username}`}
              className="flex-shrink-0"
            >
              {video.owner?.avatar ? (
                <img
                  src={video.owner.avatar}
                  alt={video.owner.fullName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-zinc-700"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">
                  <User className="w-6 h-6 text-zinc-400" />
                </div>
              )}
            </Link>

            <div className="flex-1">
              <Link to={`/channel/${video.owner?.username}`}>
                <h3 className="font-semibold text-white hover:text-blue-400 transition-colors">
                  {video.owner?.fullName}
                </h3>
              </Link>
              <p className="text-sm text-zinc-400">
                {formatNumber(subscribersCount)} subscribers
              </p>
            </div>

            {isAuthenticated && user?._id !== video.owner?._id && (
              <button
                onClick={handleSubscribe}
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all ${
                  isSubscribed
                    ? "bg-zinc-700 text-white hover:bg-zinc-600"
                    : "bg-white text-zinc-900 hover:bg-zinc-200"
                }`}
              >
                {isSubscribed && <Bell className="w-4 h-4" />}
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            )}
          </div>

          {/* Description */}
          <div className="p-4 bg-zinc-900 rounded-xl mb-6">
            <div className="flex items-center gap-4 text-sm text-zinc-400 mb-2">
              <span>{formatViews(video.views)} views</span>
              <span>{timeAgo(video.createdAt)}</span>
            </div>
            <p
              className={`text-zinc-300 text-sm whitespace-pre-wrap ${
                showDescription ? "" : "line-clamp-3"
              }`}
            >
              {video.description}
            </p>
            {video.description?.length > 150 && (
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="flex items-center gap-1 text-white mt-2 text-sm font-medium hover:text-blue-400"
              >
                {showDescription ? (
                  <>
                    <ChevronUp className="w-4 h-4" /> Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" /> Show more
                  </>
                )}
              </button>
            )}
          </div>

          {/* ─── Comments Section ─── */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              {commentsError === "404" ? (
                <span className="flex items-center gap-2">
                  Comments
                  <span className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-0.5 rounded-full font-normal">
                    Backend route missing
                  </span>
                </span>
              ) : (
                `${comments.length} Comments`
              )}
            </h3>

            {/* Comment backend not ready notice */}
            {commentsError === "404" && (
              <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-400 font-medium text-sm">
                      Comments backend not set up yet
                    </p>
                    <p className="text-zinc-400 text-xs mt-1">
                      Add these to your backend:
                    </p>
                    <div className="mt-2 space-y-1">
                      <code className="block text-xs bg-zinc-800 px-2 py-1 rounded text-green-400">
                        src/controllers/comment.controller.js
                      </code>
                      <code className="block text-xs bg-zinc-800 px-2 py-1 rounded text-green-400">
                        src/routes/comment.routes.js
                      </code>
                      <code className="block text-xs bg-zinc-800 px-2 py-1 rounded text-blue-400">
                        app.use("/api/v1/comments", commentRouter)
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add Comment Box */}
            {isAuthenticated && commentsError !== "404" && (
              <form onSubmit={handleComment} className="flex gap-3 mb-6">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-zinc-400" />
                  </div>
                )}
                <div className="flex-1 flex items-end gap-2">
                  <input
                    ref={commentInputRef}
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-transparent border-b-2 border-zinc-700 px-1 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim() || addingComment}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Comments List */}
            {commentsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-zinc-800 rounded w-1/4" />
                      <div className="h-4 bg-zinc-800 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : comments.length === 0 && commentsError !== "404" ? (
              <div className="text-center py-10 text-zinc-500">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              <div className="space-y-5">
                {comments.map((comment) => (
                  <div key={comment._id} className="flex gap-3">
                    {comment.owner?.avatar ? (
                      <img
                        src={comment.owner.avatar}
                        alt={comment.owner.fullName}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-zinc-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white text-sm">
                          @{comment.owner?.username || "Unknown"}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {timeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-zinc-300 text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── Recommended Videos ─── */}
        <div>
          <h3 className="text-base font-semibold text-white mb-3">
            Recommended
          </h3>
          {recommendedVideos.length === 0 ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-2 animate-pulse">
                  <div className="w-40 h-24 bg-zinc-800 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 bg-zinc-800 rounded" />
                    <div className="h-3 bg-zinc-800 rounded w-2/3" />
                    <div className="h-3 bg-zinc-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {recommendedVideos.map((rec) => (
                <Link
                  key={rec._id}
                  to={`/watch/${rec._id}`}
                  className="flex gap-2 group hover:bg-zinc-800/50 rounded-lg p-1 transition-colors"
                >
                  <div className="w-40 h-24 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0 relative">
                    {rec.thumbnail ? (
                      <img
                        src={rec.thumbnail}
                        alt={rec.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-700">
                        <User className="w-6 h-6 text-zinc-500" />
                      </div>
                    )}
                    {rec.duration && (
                      <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                        {Math.floor(rec.duration / 60)}:
                        {String(Math.floor(rec.duration % 60)).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <p className="text-white text-sm font-medium line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
                      {rec.title}
                    </p>
                    <p className="text-zinc-400 text-xs mt-1">
                      {rec.owner?.fullName}
                    </p>
                    <p className="text-zinc-500 text-xs">
                      {formatViews(rec.views)} views •{" "}
                      {timeAgo(rec.createdAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
