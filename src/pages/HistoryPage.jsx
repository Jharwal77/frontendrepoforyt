import { useState, useEffect } from "react";
import { VideoGrid } from "../components/video/VideoGrid";
import { authApi } from "../api/auth";

export function HistoryPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await authApi.getWatchHistory();
      if (response.success) {
        setVideos(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Watch History</h1>
      <VideoGrid videos={videos} loading={loading} />
    </div>
  );
}
