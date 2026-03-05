import axiosInstance from "./axiosInstance";
import { ENDPOINTS } from "../constants/api";

/** Lấy danh sách category — GET /categories (public, không cần token) */
export const getCategories = () =>
  axiosInstance.get(ENDPOINTS.CATEGORIES);

/** Lấy 1 danh mục theo id — GET /categories/{id} */
export const getCategoryById = (id) =>
  axiosInstance.get(ENDPOINTS.CATEGORY_BY_ID(id));