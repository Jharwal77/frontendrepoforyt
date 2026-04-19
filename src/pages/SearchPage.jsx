import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { VideoGrid } from "../components/video/VideoGrid";
import { videoApi } from "../api/video";

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      searchVideos();
    }
  }, [query]);

  const searchVideos = async () => {
    try {
      setLoading(true);
      const response = await videoApi.getAllVideos({ query });
      if (response.success) {
        setVideos(response.data || []);
      }
    } catch (error) {
      console.error("Failed to search videos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">
        Search results for "{query}"
      </h1>
      <p className="text-zinc-400 mb-6">
        {videos.length} results found
      </p>
      <VideoGrid videos={videos} loading={loading} />
    </div>
  );
}
