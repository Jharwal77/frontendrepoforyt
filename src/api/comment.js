import api from "./config";

const getVideoComments = async (videoId, params = {}) => {
  const response = await api.get(`/comments/${videoId}`, { params });
  return response.data;
};

const addComment = async (videoId, content) => {
  const response = await api.post(`/comments/${videoId}`, { content });
  return response.data;
};

const updateComment = async (commentId, content) => {
  const response = await api.patch(`/comments/c/${commentId}`, { content });
  return response.data;
};

const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/c/${commentId}`);
  return response.data;
};

export const commentApi = {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
};
