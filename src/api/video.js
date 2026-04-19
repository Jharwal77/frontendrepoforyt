// import api from "./config";

// // Get all videos with optional filters
// export const getAllVideos = async (params = {}) => {
//   const response = await api.get("/videos", { params });
//   return response.data;
// };

// // Get single video by ID
// export const getVideoById = async (videoId) => {
//   const response = await api.get(`/videos/${videoId}`);
//   return response.data;
// };

// // Upload a new video with progress tracking
// export const uploadVideo = async (formData, onUploadProgress) => {
//   const response = await api.post("/videos", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//     onUploadProgress: (progressEvent) => {
//       if (onUploadProgress && progressEvent.total) {
//         const percent = Math.round(
//           (progressEvent.loaded * 100) / progressEvent.total
//         );
//         onUploadProgress(percent);
//       }
//     },
//     timeout: 300000, // 5 minutes timeout for large videos
//   });
//   return response.data;
// };

// // Update video details
// export const updateVideo = async (videoId, data) => {
//   const response = await api.patch(`/videos/${videoId}`, data, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   return response.data;
// };

// // Delete video
// export const deleteVideo = async (videoId) => {
//   const response = await api.delete(`/videos/${videoId}`);
//   return response.data;
// };

// // Toggle publish/unpublish
// export const togglePublishStatus = async (videoId) => {
//   const response = await api.patch(`/videos/toggle/publish/${videoId}`);
//   return response.data;
// };

// // Get videos by user ID
// export const getUserVideos = async (userId, params = {}) => {
//   const response = await api.get(`/videos/user/${userId}`, { params });
//   return response.data;
// };

// // Update thumbnail only
// export const updateThumbnail = async (videoId, formData) => {
//   const response = await api.patch(`/videos/thumbnail/${videoId}`, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   return response.data;
// };

// // Search videos
// export const searchVideos = async (query, params = {}) => {
//   const response = await api.get("/videos", {
//     params: { query, ...params },
//   });
//   return response.data;
// };

// // Backward compatibility export
// export const videoApi = {
//   getAllVideos,
//   getVideoById,
//   uploadVideo,
//   updateVideo,
//   deleteVideo,
//   togglePublishStatus,
//   getUserVideos,
//   updateThumbnail,
//   searchVideos,
// };


import api from "./config";

// Get all videos (returns ONLY array)
export const getAllVideos = async (params = {}) => {
  const response = await api.get("/videos", { params });
  return response.data.data.docs;   // ✅ FIXED
};

// Get single video
export const getVideoById = async (videoId) => {
  const response = await api.get(`/videos/${videoId}`);
  return response.data.data;   // assuming backend returns single video in data
};

// Upload video
export const uploadVideo = async (formData, onUploadProgress) => {
  const response = await api.post("/videos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress && progressEvent.total) {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onUploadProgress(percent);
      }
    },
    timeout: 300000,
  });
  return response.data;
};

// Update video
export const updateVideo = async (videoId, data) => {
  const response = await api.patch(`/videos/${videoId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Delete video
export const deleteVideo = async (videoId) => {
  const response = await api.delete(`/videos/${videoId}`);
  return response.data;
};

// Toggle publish
export const togglePublishStatus = async (videoId) => {
  const response = await api.patch(`/videos/toggle/publish/${videoId}`);
  return response.data;
};

// Get user videos
export const getUserVideos = async (userId, params = {}) => {
  const response = await api.get(`/videos/user/${userId}`, { params });
  return response.data.data.docs;
};

// Update thumbnail
export const updateThumbnail = async (videoId, formData) => {
  const response = await api.patch(`/videos/thumbnail/${videoId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Search videos
export const searchVideos = async (query, params = {}) => {
  const response = await api.get("/videos", {
    params: { query, ...params },
  });
  return response.data.data.docs;
};