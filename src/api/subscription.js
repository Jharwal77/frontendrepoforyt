import api from "./config";

const toggleSubscription = async (channelId) => {
  const response = await api.post(`/subscriptions/c/${channelId}`);
  return response.data;
};

const getUserChannelSubscribers = async (channelId) => {
  const response = await api.get(`/subscriptions/u/${channelId}`);
  return response.data;
};

const getSubscribedChannels = async (subscriberId) => {
  const response = await api.get(`/subscriptions/c/${subscriberId}`);
  return response.data;
};

export const subscriptionApi = {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
};
