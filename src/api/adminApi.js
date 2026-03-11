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

/* ══════════════════════════════════════════════
   Admin — Product APIs
   BE endpoints: POST/PUT/DELETE /api/admin/products
                 GET /api/products (public, dùng được trong admin)
══════════════════════════════════════════════ */

const toProductFormData = (payload) => {
  const fd = new FormData();
  fd.append("name", payload.name);
  fd.append("description", payload.description || "");
  fd.append("price", String(payload.price));
  fd.append("stock", String(payload.stock));
  fd.append("categoryId", String(payload.categoryId));

  if (payload.imageFile) {
    fd.append("imageFile", payload.imageFile);
  }

  return fd;
};

/** Lấy danh sách tất cả sản phẩm có phân trang
 *  BE trả về Page<ProductResponse>
 *  @param {number} page  - trang hiện tại (bắt đầu từ 0)
 *  @param {number} size  - số item mỗi trang
 */
export const getAdminProducts = (page = 0, size = 10) =>
  axiosInstance.get(ENDPOINTS.PRODUCTS, { params: { page, size } });

/** Tạo sản phẩm mới — POST /admin/products
 *  @param {{ name, description, price, stock, imageUrl, categoryId }} payload
 */
export const createAdminProduct = (payload) =>
  axiosInstance.post(ENDPOINTS.ADMIN_PRODUCTS, toProductFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });

/** Cập nhật sản phẩm — PUT /admin/products/{id}
 *  @param {number} id
 *  @param {{ name, description, price, stock, imageUrl, categoryId }} payload
 */
export const updateAdminProduct = (id, payload) =>
  axiosInstance.put(ENDPOINTS.ADMIN_PRODUCT_BY_ID(id), toProductFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });

/** Xóa sản phẩm — DELETE /admin/products/{id}
 *  @param {number} id
 */
export const deleteAdminProduct = (id) =>
  axiosInstance.delete(ENDPOINTS.ADMIN_PRODUCT_BY_ID(id));



/** Lấy sản phẩm theo danh mục — GET /products/category/{categoryId}
 *  BE trả về Page<ProductResponse>
 *  @param {number} categoryId
 *  @param {number} page
 *  @param {number} size
 */
export const getAdminProductsByCategory = (categoryId, page = 0, size = 10) =>
  axiosInstance.get(ENDPOINTS.PRODUCTS_BY_CATEGORY(categoryId), { params: { page, size } });


/* ══════════════════════════════════════════════
+   Admin — Order APIs
+   BE endpoints: GET/PUT /api/admin/orders
+══════════════════════════════════════════════ */

/** Lấy danh sách tất cả đơn hàng có phân trang + lọc theo status
+ *  @param {number} page
+ *  @param {number} size
+ *  @param {string} status - PENDING | CONFIRMED | SHIPPING | DELIVERED | CANCELLED
+ */
export const getAdminOrders = (page = 0, size = 10, status = "") =>
  axiosInstance.get(ENDPOINTS.ADMIN_ORDERS, {
    params: { page, size, ...(status && { status }) },
  });

/** Xem chi tiết 1 đơn hàng — GET /admin/orders/{id} */
export const getAdminOrderById = (id) =>
  axiosInstance.get(ENDPOINTS.ADMIN_ORDER_BY_ID(id));

/** Cập nhật trạng thái đơn hàng — PUT /admin/orders/{id}/status */
export const updateAdminOrderStatus = (id, status) =>
  axiosInstance.put(ENDPOINTS.ADMIN_ORDER_STATUS(id), { status });

