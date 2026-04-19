import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  X,
  Video,
  Image,
  CheckCircle,
  AlertCircle,
  Loader,
  FileVideo,
  ChevronRight,
} from "lucide-react";
import { uploadVideo } from "../api/video";
import { useAuth } from "../context/AuthContext";

export function UploadPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [dragOverVideo, setDragOverVideo] = useState(false);
  const [dragOverThumb, setDragOverThumb] = useState(false);

  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  // ─── Not logged in ────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Video className="w-20 h-20 text-zinc-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Sign in to Upload</h2>
        <p className="text-zinc-400 mb-6">You need to be logged in to upload videos</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-full transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  // ─── File handlers ─────────────────────────────────────────────────
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleVideoDrop = (e) => {
    e.preventDefault();
    setDragOverVideo(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleThumbnailDrop = (e) => {
    e.preventDefault();
    setDragOverThumb(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // ─── Submit ────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("❌ Title is required");
    if (!description.trim()) return setError("❌ Description is required");
    if (!videoFile) return setError("❌ Please select a video file");
    if (!thumbnail) return setError("❌ Please select a thumbnail image");

    try {
      setUploading(true);
      setUploadProgress(5);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("videoFile", videoFile);
      formData.append("thumbnail", thumbnail);

      const response = await uploadVideo(formData, (percent) => {
        setUploadProgress(percent);
      });

      setUploadProgress(100);
      setSuccess(true);

      setTimeout(() => {
        const videoId =
          response?.data?._id ||
          response?.data?.data?._id ||
          response?._id;
        if (videoId) {
          navigate(`/watch/${videoId}`);
        } else {
          navigate("/");
        }
      }, 2000);

    } catch (err) {
      setUploadProgress(0);
      console.error("Upload error full details:", err);

      if (!err.response) {
        setError(
          "🔴 Cannot connect to backend! Make sure your backend server is running on http://localhost:8000 and video routes are added."
        );
      } else if (err.response?.status === 401) {
        setError("🔴 Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else if (err.response?.status === 404) {
        setError(
          "🔴 Video upload endpoint NOT FOUND! You need to create video.routes.js and add: app.use('/api/v1/videos', videoRouter) in your backend app.js"
        );
      } else if (err.response?.status === 413) {
        setError(
          "🔴 File too large! Increase the limit in your backend: app.use(express.json({limit: '100mb'})) and configure multer for large files."
        );
      } else if (err.response?.status === 500) {
        setError(
          `🔴 Server Error: ${err.response?.data?.message || "Internal server error. Check your backend console for details."}`
        );
      } else {
        setError(
          `🔴 Error ${err.response?.status}: ${err.response?.data?.message || "Upload failed. Check backend console."}`
        );
      }
    } finally {
      setUploading(false);
    }
  };

  // ─── Success screen ────────────────────────────────────────────────
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-14 h-14 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Upload Successful! 🎉</h2>
        <p className="text-zinc-400 mb-4">Your video has been uploaded and is being processed.</p>
        <div className="flex items-center gap-2 text-zinc-500 text-sm">
          <Loader className="w-4 h-4 animate-spin" />
          <span>Redirecting to your video...</span>
        </div>
      </div>
    );
  }

  // ─── Main Upload Form ──────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Upload Video</h1>
            <p className="text-zinc-400 text-sm">
              Uploading as{" "}
              <span className="text-white font-semibold">@{user?.username}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-950 border border-red-500 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-300 font-semibold mb-1">Upload Failed</p>
            <p className="text-red-400 text-sm">{error}</p>

            {/* Show backend setup steps if 404 */}
            {error.includes("NOT FOUND") && (
              <div className="mt-4 bg-zinc-900 rounded-lg p-4 border border-zinc-700">
                <p className="text-yellow-400 font-semibold mb-3 text-sm">
                  📋 Steps to fix - Add these to your BACKEND:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <div>
                      <p className="text-zinc-300 text-xs font-semibold">Create: src/controllers/video.controller.js</p>
                      <p className="text-zinc-500 text-xs">With publishAVideo, getAllVideos, getVideoById functions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <div>
                      <p className="text-zinc-300 text-xs font-semibold">Create: src/routes/video.routes.js</p>
                      <code className="text-green-400 text-xs block bg-black rounded p-1 mt-1">
                        router.route("/").get(getAllVideos).post(upload.fields([...]), publishAVideo)
                      </code>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <div>
                      <p className="text-zinc-300 text-xs font-semibold">In src/app.js add:</p>
                      <code className="text-green-400 text-xs block bg-black rounded p-1 mt-1">
                        import videoRouter from "./routes/video.routes.js"<br />
                        app.use("/api/v1/videos", videoRouter)
                      </code>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                    <div>
                      <p className="text-zinc-300 text-xs font-semibold">Restart backend:</p>
                      <code className="text-green-400 text-xs block bg-black rounded p-1 mt-1">npm run dev</code>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Server error - show backend console tip */}
            {error.includes("Server Error") && (
              <div className="mt-3 bg-zinc-900 rounded-lg p-3 border border-zinc-700">
                <p className="text-yellow-400 text-xs font-semibold">💡 Check your backend terminal for error details</p>
                <p className="text-zinc-500 text-xs mt-1">Common causes: Cloudinary not configured, multer field name mismatch, MongoDB not connected</p>
              </div>
            )}
          </div>
          <button onClick={() => setError("")} className="text-zinc-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Video + Thumbnail Upload Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Video File */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Video File <span className="text-red-500">*</span>
              <span className="text-zinc-500 text-xs font-normal ml-2">(MP4, MOV, AVI, etc.)</span>
            </label>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="hidden"
            />
            {!videoPreview ? (
              <div
                onClick={() => videoInputRef.current?.click()}
                onDrop={handleVideoDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOverVideo(true); }}
                onDragLeave={() => setDragOverVideo(false)}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  dragOverVideo
                    ? "border-red-500 bg-red-500/10"
                    : "border-zinc-700 hover:border-red-500 hover:bg-zinc-800/50"
                }`}
              >
                <FileVideo className="w-12 h-12 text-zinc-500 mx-auto mb-3" />
                <p className="text-white font-semibold mb-1">Click or drag video here</p>
                <p className="text-zinc-500 text-sm">MP4, MOV, AVI, MKV supported</p>
                <p className="text-zinc-600 text-xs mt-2">Large files supported (100MB+)</p>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700">
                <video
                  src={videoPreview}
                  controls
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-3 flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-semibold truncate max-w-[200px]">
                      {videoFile?.name}
                    </p>
                    <p className="text-zinc-400 text-xs">{formatFileSize(videoFile?.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeVideo}
                    className="bg-red-600 hover:bg-red-700 rounded-full p-1.5 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Thumbnail <span className="text-red-500">*</span>
              <span className="text-zinc-500 text-xs font-normal ml-2">(JPG, PNG, etc.)</span>
            </label>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="hidden"
            />
            {!thumbnailPreview ? (
              <div
                onClick={() => thumbnailInputRef.current?.click()}
                onDrop={handleThumbnailDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOverThumb(true); }}
                onDragLeave={() => setDragOverThumb(false)}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all h-[200px] flex flex-col items-center justify-center ${
                  dragOverThumb
                    ? "border-red-500 bg-red-500/10"
                    : "border-zinc-700 hover:border-red-500 hover:bg-zinc-800/50"
                }`}
              >
                <Image className="w-12 h-12 text-zinc-500 mb-3" />
                <p className="text-white font-semibold mb-1">Click or drag image here</p>
                <p className="text-zinc-500 text-sm">JPG, PNG, WebP supported</p>
                <p className="text-zinc-600 text-xs mt-2">Recommended: 1280×720</p>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-zinc-700 h-[200px]">
                <img
                  src={thumbnailPreview}
                  alt="thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-3 flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-semibold truncate max-w-[160px]">
                      {thumbnail?.name}
                    </p>
                    <p className="text-zinc-400 text-xs">{formatFileSize(thumbnail?.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="bg-red-600 hover:bg-red-700 rounded-full p-1.5 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a catchy title for your video..."
            maxLength={100}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
          />
          <div className="flex justify-end mt-1">
            <span className="text-zinc-500 text-xs">{title.length}/100</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your video... (what is it about, tags, links, etc.)"
            rows={5}
            maxLength={5000}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
          />
          <div className="flex justify-end mt-1">
            <span className="text-zinc-500 text-xs">{description.length}/5000</span>
          </div>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Loader className="w-5 h-5 text-red-500 animate-spin" />
                <span className="text-white font-semibold">
                  {uploadProgress < 50
                    ? "Uploading files..."
                    : uploadProgress < 90
                    ? "Processing on Cloudinary..."
                    : "Saving to database..."}
                </span>
              </div>
              <span className="text-red-400 font-bold text-lg">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-600 to-red-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-zinc-500 text-xs mt-2">
              ⏳ Large videos may take several minutes. Please don't close this page.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={uploading}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white transition-all ${
              uploading
                ? "bg-zinc-700 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 hover:scale-105"
            }`}
          >
            {uploading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Uploading... {uploadProgress}%</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Upload Video</span>
              </>
            )}
          </button>

          {!uploading && (
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-full font-semibold text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 transition-all"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-400 text-sm font-semibold mb-2">📋 Before uploading make sure:</p>
          <ul className="space-y-1.5">
            {[
              { done: true, text: "You are logged in ✅" },
              { done: !!videoFile, text: videoFile ? `Video selected: ${videoFile.name}` : "Select a video file" },
              { done: !!thumbnail, text: thumbnail ? `Thumbnail selected: ${thumbnail.name}` : "Select a thumbnail image" },
              { done: !!title.trim(), text: title.trim() ? `Title: "${title}"` : "Enter a title" },
              { done: !!description.trim(), text: description.trim() ? "Description added ✅" : "Enter a description" },
              { done: false, text: "Backend running at http://localhost:8000 (check your backend terminal)" },
              { done: false, text: "Video routes added in backend app.js: app.use('/api/v1/videos', videoRouter)" },
              { done: false, text: "Cloudinary configured in backend .env file" },
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-xs">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                  item.done ? "bg-green-500/20 text-green-400" : "bg-zinc-800 text-zinc-600"
                }`}>
                  {item.done ? "✓" : "○"}
                </span>
                <span className={item.done ? "text-zinc-300" : "text-zinc-600"}>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

      </form>
    </div>
  );
}
