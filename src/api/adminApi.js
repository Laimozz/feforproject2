import axiosInstance from "./axiosInstance";
import { ENDPOINTS } from "../constants/api";

/**
 * Lấy danh sách user có phân trang
 * BE trả về Page<AdminUserResponse>
 * @param {number} page  - trang hiện tại (bắt đầu từ 0)
 * @param {number} size  - số item mỗi trang
 * @param {string} search - tìm kiếm theo username/email (nếu BE hỗ trợ)
 */
export const getAdminUsers = (page = 0, size = 10, search = "") =>
  axiosInstance.get(ENDPOINTS.ADMIN_USERS, {
    params: { page, size, ...(search && { search }) },
  });

/**
 * Lấy thông tin 1 user theo id
 * BE trả về AdminUserResponse
 */
export const getAdminUserById = (id) =>
  axiosInstance.get(ENDPOINTS.ADMIN_USER_BY_ID(id));

/**
 * Xóa user theo id
 */
export const deleteAdminUser = (id) =>
  axiosInstance.delete(ENDPOINTS.ADMIN_USER_BY_ID(id));

/* ══════════════════════════════════════════════
   Admin — Category APIs
══════════════════════════════════════════════ */

/** Tạo category mới — POST /admin/categories */
export const createAdminCategory = (payload) =>
  axiosInstance.post(ENDPOINTS.ADMIN_CATEGORIES, payload);

/** Cập nhật category — PUT /admin/categories/{id} */
export const updateAdminCategory = (id, payload) =>
  axiosInstance.put(ENDPOINTS.ADMIN_CATEGORY_BY_ID(id), payload);

/** Xóa category — DELETE /admin/categories/{id} */
export const deleteAdminCategory = (id) =>
  axiosInstance.delete(ENDPOINTS.ADMIN_CATEGORY_BY_ID(id));