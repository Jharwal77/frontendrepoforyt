import api from "./config";

const toggleVideoLike = async (videoId) => {
  const response = await api.post(`/likes/toggle/v/${videoId}`);
  return response.data;
};

const toggleCommentLike = async (commentId) => {
  const response = await api.post(`/likes/toggle/c/${commentId}`);
  return response.data;
};

const toggleTweetLike = async (tweetId) => {
  const response = await api.post(`/likes/toggle/t/${tweetId}`);
  return response.data;
};

const getLikedVideos = async () => {
  const response = await api.get("/likes/videos");
  return response.data;
};

export const likeApi = {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos,
};
