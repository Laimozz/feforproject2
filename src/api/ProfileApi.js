import axiosInstance from "./axiosInstance";
import { ENDPOINTS } from "../constants/api";

const profileApi = {
  getProfile: () => {
    return axiosInstance.get(ENDPOINTS.PROFILE);
  },

  updateProfile: (data) => {
    return axiosInstance.put(ENDPOINTS.PROFILE, data);
  },
};

export default profileApi;

export const changePassword = (payload) =>
  axiosInstance.put(ENDPOINTS.CHANGE_PASSWORD, payload);