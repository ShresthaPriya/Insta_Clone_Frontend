import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, removeTokens } from "./auth";

const api = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        removeTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          "http://localhost:4000/api/v1/refresh-token",
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const { accessToken, refreshToken: newRefreshToken } = res.data;

        if (!accessToken || !newRefreshToken) {
          throw new Error("Invalid refresh token response");
        }

        setTokens(accessToken, newRefreshToken);

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return axios(originalRequest);
      } catch (err) {
        removeTokens();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
