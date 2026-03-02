import axiosInstance from "./axiosInstance";
import { ENDPOINTS } from "../constants/api";

/** Lấy danh sách category — GET /categories (public, không cần token) */
export const getCategories = () =>
  axiosInstance.get(ENDPOINTS.CATEGORIES);