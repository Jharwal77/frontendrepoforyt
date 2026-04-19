import api from "./config";

const register = async (formData) => {
  const response = await api.post("/users/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const login = async (credentials) => {
  const response = await api.post("/users/login", credentials);
  if (response.data.data?.accessToken) {
    localStorage.setItem("accessToken", response.data.data.accessToken);
  }
  return response.data;
};

const logout = async () => {
  const response = await api.post("/users/logout");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  return response.data;
};

const getCurrentUser = async () => {
  const response = await api.get("/users/current-user");
  return response.data;
};

const updateAccountDetails = async (data) => {
  const response = await api.patch("/users/update-account", data);
  return response.data;
};

const changePassword = async (data) => {
  const response = await api.post("/users/change-password", data);
  return response.data;
};

const updateAvatar = async (formData) => {
  const response = await api.patch("/users/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const updateCoverImage = async (formData) => {
  const response = await api.patch("/users/cover-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const getUserChannelProfile = async (username) => {
  const response = await api.get(`/users/c/${username}`);
  return response.data;
};

const getWatchHistory = async () => {
  const response = await api.get("/users/history");
  return response.data;
};

export const authApi = {
  register,
  login,
  logout,
  getCurrentUser,
  updateAccountDetails,
  changePassword,
  updateAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
