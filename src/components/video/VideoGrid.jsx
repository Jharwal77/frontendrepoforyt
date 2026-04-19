import { VideoCard, VideoCardSkeleton } from "./VideoCard";

export function VideoGrid({ videos, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <VideoCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <svg
          viewBox="0 0 24 24"
          className="w-24 h-24 text-zinc-700 mb-4"
          fill="currentColor"
        >
          <path d="M10 8.64L15.27 12 10 15.36V8.64M8 5v14l11-7L8 5z" />
        </svg>
        <h3 className="text-xl font-medium text-zinc-400 mb-2">No videos found</h3>
        <p className="text-zinc-500">
          Be the first to upload a video!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
}
