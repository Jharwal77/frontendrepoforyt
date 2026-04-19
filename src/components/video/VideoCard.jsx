import { Link } from "react-router-dom";
import { formatNumber, timeAgo, formatViews } from "../../utils/helpers";

export function VideoCard({ video }) {
  const {
    _id,
    title,
    thumbnail,
    duration,
    views,
    createdAt,
    owner,
  } = video;

  const channelLink = owner?.username ? `/channel/${owner.username}` : null;

  return (
    <div className="group block">
      {/* Thumbnail - links to watch page */}
      <Link to={`/watch/${_id}`}>
        <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-16 h-16 text-zinc-600"
                fill="currentColor"
              >
                <path d="M10 8.64L15.27 12 10 15.36V8.64M8 5v14l11-7L8 5z" />
              </svg>
            </div>
          )}
          {duration && (
            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
              {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, "0")}
            </span>
          )}
        </div>
      </Link>

      <div className="flex gap-3 mt-3">
        {/* Avatar - links to channel */}
        <div className="flex-shrink-0">
          {channelLink ? (
            <Link to={channelLink}>
              {owner?.avatar ? (
                <img
                  src={owner.avatar}
                  alt={owner.fullName}
                  className="w-9 h-9 rounded-full object-cover hover:ring-2 hover:ring-white transition"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center hover:ring-2 hover:ring-white transition">
                  <span className="text-sm text-zinc-400">
                    {owner?.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
              )}
            </Link>
          ) : (
            <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center">
              <span className="text-sm text-zinc-400">U</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Title - links to watch page */}
          <Link to={`/watch/${_id}`}>
            <h3 className="text-sm font-medium text-white line-clamp-2 hover:text-blue-400 transition-colors">
              {title}
            </h3>
          </Link>

          {/* Channel name - links to channel page */}
          {channelLink ? (
            <Link to={channelLink}>
              <p className="text-sm text-zinc-400 mt-0.5 hover:text-white transition-colors">
                {owner?.fullName || owner?.username || "Unknown"}
              </p>
            </Link>
          ) : (
            <p className="text-sm text-zinc-400 mt-0.5">
              {owner?.fullName || "Unknown"}
            </p>
          )}

          <p className="text-xs text-zinc-500">
            {formatViews(views)} • {timeAgo(createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function VideoCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-video rounded-xl bg-zinc-800" />
      <div className="flex gap-3 mt-3">
        <div className="w-9 h-9 rounded-full bg-zinc-800" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-zinc-800 rounded w-full" />
          <div className="h-3 bg-zinc-800 rounded w-2/3" />
          <div className="h-3 bg-zinc-800 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}
