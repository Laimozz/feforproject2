import axiosInstance from "./axiosInstance";
import { ENDPOINTS } from "../constants/api";

/**
 * Register a new user
 * @param {{ username: string, email: string, password: string }} payload
 */
export const register = (payload) =>
  axiosInstance.post(ENDPOINTS.REGISTER, payload);

/**
 * Login
 * @param {{ username: string, password: string }} payload
 * @returns {{ accessToken, refreshToken, role }}
 */
export const login = (payload) =>
  axiosInstance.post(ENDPOINTS.LOGIN, payload);

/**
 * Refresh access token
 * @param {string} refreshToken
 */
export const refreshToken = (refreshToken) =>
  axiosInstance.post(ENDPOINTS.REFRESH_TOKEN, { refreshToken });

/**
 * Logout (invalidate refresh token on server)
 */
export const logout = (username) =>
  axiosInstance.post(ENDPOINTS.LOGOUT, null, {
    params: { username }
  });