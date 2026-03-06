// =========================================================
// productApi.js
// Các hàm gọi public product API (không cần token admin)
// Dùng cho: trang danh mục, trang sản phẩm, tìm kiếm...
// =========================================================

import axiosInstance from "./axiosInstance";
import { ENDPOINTS } from "../constants/api";

/** Lấy tất cả sản phẩm có phân trang — GET /products
 *  @param {number} page  - trang (0-indexed)
 *  @param {number} size  - số item/trang
 *  @returns Page<ProductResponse>
 */
export const getProducts = (page = 0, size = 12) =>
    axiosInstance.get(ENDPOINTS.PRODUCTS, { params: { page, size } });

/** Tìm sản phẩm theo từ khóa — GET /products/search
 *  @param {string} keyword - từ khóa tìm kiếm
 *  @param {number} page
 *  @param {number} size
 *  @returns Page<ProductResponse>
 */
export const searchProducts = (keyword, page = 0, size = 12) =>
    axiosInstance.get(ENDPOINTS.PRODUCTS_BY_KEYWORD, {
        params: { keyword, page, size },
    });

/** Lấy sản phẩm theo danh mục — GET /products/category/{categoryId}
 *  @param {number} categoryId
 *  @param {number} page
 *  @param {number} size
 *  @returns Page<ProductResponse>
 */
export const getProductsByCategory = (categoryId, page = 0, size = 12) =>
    axiosInstance.get(ENDPOINTS.PRODUCTS_BY_CATEGORY(categoryId), {
        params: { page, size },
    });

/** Lấy chi tiết 1 sản phẩm — GET /products/{id}
 *  @param {number} id
 *  @returns ProductResponse
 */
export const getProductById = (id) =>
    axiosInstance.get(ENDPOINTS.PRODUCT_BY_ID(id));
