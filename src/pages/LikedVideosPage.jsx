import { useState, useEffect } from "react";
import { VideoGrid } from "../components/video/VideoGrid";
import { likeApi } from "../api/like";

export function LikedVideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikedVideos();
  }, []);

  const fetchLikedVideos = async () => {
    try {
      setLoading(true);
      const response = await likeApi.getLikedVideos();
      if (response.success) {
        setVideos(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch liked videos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Liked Videos</h1>
      <VideoGrid videos={videos} loading={loading} />
    </div>
  );
}
