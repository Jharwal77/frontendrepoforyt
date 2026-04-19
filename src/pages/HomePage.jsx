import { useState, useEffect } from "react";
import { VideoGrid } from "../components/video/VideoGrid";
import { videoApi   } from "../api/video";

const categories = [
  "All",
  "Music",
  "Gaming",
  "News",
  "Sports",
  "Education",
  "Entertainment",
  "Technology",
  "Travel",
  "Cooking",
];

// Mock data for testing when backend is not available
const mockVideos = [
  {
    _id: "1",
    title: "Learn React in 1 Hour - Full Tutorial for Beginners",
    description: "A complete React tutorial for beginners",
    thumbnail: "https://picsum.photos/seed/video1/640/360",
    videoFile: "https://example.com/video1.mp4",
    duration: 3600,
    views: 125000,
    createdAt: "2024-01-15T10:00:00Z",
    owner: {
      _id: "user1",
      username: "codecraft",
      fullName: "Code Craft",
      avatar: "https://picsum.photos/seed/user1/100/100",
    },
  },
  {
    _id: "2",
    title: "Node.js Crash Course - Build Your First Server",
    description: "Learn Node.js basics and build a server",
    thumbnail: "https://picsum.photos/seed/video2/640/360",
    videoFile: "https://example.com/video2.mp4",
    duration: 2400,
    views: 85000,
    createdAt: "2024-01-14T08:30:00Z",
    owner: {
      _id: "user2",
      username: "techmaster",
      fullName: "Tech Master",
      avatar: "https://picsum.photos/seed/user2/100/100",
    },
  },
  {
    _id: "3",
    title: "JavaScript Tips & Tricks 2024",
    description: "Amazing JavaScript tips you need to know",
    thumbnail: "https://picsum.photos/seed/video3/640/360",
    videoFile: "https://example.com/video3.mp4",
    duration: 1200,
    views: 250000,
    createdAt: "2024-01-13T14:20:00Z",
    owner: {
      _id: "user3",
      username: "jsninja",
      fullName: "JS Ninja",
      avatar: "https://picsum.photos/seed/user3/100/100",
    },
  },
  {
    _id: "4",
    title: "Build a Full Stack App with MERN Stack",
    description: "Complete MERN stack tutorial with project",
    thumbnail: "https://picsum.photos/seed/video4/640/360",
    videoFile: "https://example.com/video4.mp4",
    duration: 5400,
    views: 180000,
    createdAt: "2024-01-12T09:15:00Z",
    owner: {
      _id: "user4",
      username: "fullstackdev",
      fullName: "Full Stack Dev",
      avatar: "https://picsum.photos/seed/user4/100/100",
    },
  },
  {
    _id: "5",
    title: "CSS Flexbox & Grid Masterclass",
    description: "Master CSS layouts with Flexbox and Grid",
    thumbnail: "https://picsum.photos/seed/video5/640/360",
    videoFile: "https://example.com/video5.mp4",
    duration: 2700,
    views: 95000,
    createdAt: "2024-01-11T16:45:00Z",
    owner: {
      _id: "user5",
      username: "csswizard",
      fullName: "CSS Wizard",
      avatar: "https://picsum.photos/seed/user5/100/100",
    },
  },
  {
    _id: "6",
    title: "TypeScript for React Developers",
    description: "Learn TypeScript with React projects",
    thumbnail: "https://picsum.photos/seed/video6/640/360",
    videoFile: "https://example.com/video6.mp4",
    duration: 4200,
    views: 145000,
    createdAt: "2024-01-10T11:30:00Z",
    owner: {
      _id: "user6",
      username: "tsmaster",
      fullName: "TS Master",
      avatar: "https://picsum.photos/seed/user6/100/100",
    },
  },
  {
    _id: "7",
    title: "Docker & Kubernetes for Beginners",
    description: "Learn containerization and orchestration",
    thumbnail: "https://picsum.photos/seed/video7/640/360",
    videoFile: "https://example.com/video7.mp4",
    duration: 4800,
    views: 110000,
    createdAt: "2024-01-09T13:00:00Z",
    owner: {
      _id: "user7",
      username: "devopspro",
      fullName: "DevOps Pro",
      avatar: "https://picsum.photos/seed/user7/100/100",
    },
  },
  {
    _id: "8",
    title: "MongoDB Complete Guide",
    description: "Everything you need to know about MongoDB",
    thumbnail: "https://picsum.photos/seed/video8/640/360",
    videoFile: "https://example.com/video8.mp4",
    duration: 3300,
    views: 78000,
    createdAt: "2024-01-08T10:20:00Z",
    owner: {
      _id: "user8",
      username: "dbexpert",
      fullName: "DB Expert",
      avatar: "https://picsum.photos/seed/user8/100/100",
    },
  },
];

export function HomePage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await videoApi.getAllVideos();
      
      // Handle backend response structure
      // Backend returns: { statusCode, data: { docs: [...], totalDocs, ... }, message, success }
      if (response.success && response.data) {
        // Check if data is paginated (has docs) or direct array
        const videoList = response.data.docs || response.data;
        setVideos(Array.isArray(videoList) ? videoList : []);
      } else {
        // Use mock data if response is not successful
        console.log("Using mock data");
        setVideos(mockVideos);
      }
    } catch (error) {
      console.error("Failed to fetch videos:", error);
      setError("Failed to load videos. Showing sample content.");
      // Use mock data when backend is not available
      setVideos(mockVideos);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Category chips */}
      <div className="mb-6 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? "bg-white text-zinc-900"
                  : "bg-zinc-800 text-white hover:bg-zinc-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-200 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Videos grid */}
      <VideoGrid videos={videos} loading={loading} />
    </div>
  );
}
