// =========================================================
// cartApi.js
// Vị trí: src/api/cartApi.js
// Các hàm gọi Cart API cho User (cần token)
// =========================================================

import axiosInstance from "./axiosInstance";
import { ENDPOINTS } from "../constants/api";

/**
 * Lấy giỏ hàng của user hiện tại — GET /cart
 * BE tự tạo giỏ rỗng nếu chưa có
 * @returns CartResponse { id, items[], totalPrice }
 */
export const getCart = () =>
    axiosInstance.get(ENDPOINTS.CART);

/**
 * Thêm sản phẩm vào giỏ — POST /cart/items
 * Nếu sản phẩm đã có → BE tự cộng dồn quantity
 * @param {{ productId: number, quantity: number }} data
 * @returns CartResponse
 */
export const addCartItem = (data) =>
    axiosInstance.post(ENDPOINTS.CART_ITEM, data);

/**
 * Cập nhật số lượng sản phẩm — PUT /cart/items/{itemId}
 * @param {number} itemId — ID của CartItem (không phải productId)
 * @param {{ productId: number, quantity: number }} data
 * @returns CartResponse
 */
export const updateCartItem = (itemId, data) =>
    axiosInstance.put(`${ENDPOINTS.CART_ITEM}/${itemId}`, data);

/**
 * Xóa 1 sản phẩm khỏi giỏ — DELETE /cart/items/{itemId}
 * @param {number} itemId
 * @returns { message: string }
 */
export const removeCartItem = (itemId) =>
    axiosInstance.delete(`${ENDPOINTS.CART_ITEM}/${itemId}`);

/**
 * Xóa toàn bộ giỏ hàng — DELETE /cart
 * Giữ lại Cart entity, chỉ xóa items
 * @returns { message: string }
 */
export const clearCart = () =>
    axiosInstance.delete(ENDPOINTS.CART);

