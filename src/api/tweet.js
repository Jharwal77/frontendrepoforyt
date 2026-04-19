import api from "./config";

const createTweet = async (content) => {
  const response = await api.post("/tweets", { content });
  return response.data;
};

const getUserTweets = async (userId) => {
  const response = await api.get(`/tweets/user/${userId}`);
  return response.data;
};

const updateTweet = async (tweetId, content) => {
  const response = await api.patch(`/tweets/${tweetId}`, { content });
  return response.data;
};

const deleteTweet = async (tweetId) => {
  const response = await api.delete(`/tweets/${tweetId}`);
  return response.data;
};

const getAllTweets = async () => {
  const response = await api.get("/tweets");
  return response.data;
};

export const tweetApi = {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
  getAllTweets,
};
