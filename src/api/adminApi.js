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