// =========================================================
// useCart.js
// Vị trí: src/hooks/useCart.js
// Hook quản lý toàn bộ state + logic giỏ hàng
// Pattern giống useProductsByCategory.js
// =========================================================

import { useState, useEffect, useCallback } from "react";
import {
    getCart,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCart,
} from "../api/cartApi";

export default function useCart() {
    /* ── State ── */
    const [cart, setCart] = useState(null);       // CartResponse { id, items[], totalPrice }
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* ── Lấy giỏ hàng ── */
    const fetchCart = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const { data } = await getCart();
            setCart(data);
        } catch (err) {
            console.error("Lỗi load giỏ hàng:", err);
            setError("Không thể tải giỏ hàng. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    }, []);

    /* ── Thêm sản phẩm vào giỏ ── */
    const addItem = useCallback(async (productId, quantity = 1) => {
        setError("");
        try {
            const { data } = await addCartItem({ productId, quantity });
            setCart(data); // BE trả về CartResponse mới
            return true;   // để component biết thành công
        } catch (err) {
            console.error("Lỗi thêm sản phẩm:", err);
            setError("Không thể thêm sản phẩm vào giỏ.");
            return false;
        }
    }, []);

    /* ── Cập nhật số lượng ── */
    const updateQuantity = useCallback(async (itemId, productId, quantity) => {
        if (quantity < 1) return; // không cho số lượng < 1
        setError("");
        try {
            const { data } = await updateCartItem(itemId, { productId, quantity });
            setCart(data);
        } catch (err) {
            console.error("Lỗi cập nhật số lượng:", err);
            setError("Không thể cập nhật số lượng.");
        }
    }, []);

    /* ── Xóa 1 sản phẩm ── */
    const removeItem = useCallback(async (itemId) => {
        setError("");
        try {
            await removeCartItem(itemId);
            // Sau khi xóa, fetch lại giỏ để đồng bộ totalPrice
            await fetchCart();
        } catch (err) {
            console.error("Lỗi xóa sản phẩm:", err);
            setError("Không thể xóa sản phẩm.");
        }
    }, [fetchCart]);

    /* ── Xóa toàn bộ giỏ ── */
    const handleClearCart = useCallback(async () => {
        setError("");
        try {
            await clearCart();
            // Reset cart về trạng thái rỗng
            setCart((prev) => (prev ? { ...prev, items: [], totalPrice: 0 } : prev));
        } catch (err) {
            console.error("Lỗi xóa giỏ hàng:", err);
            setError("Không thể xóa giỏ hàng.");
        }
    }, []);

    /* ── Auto-fetch khi hook được dùng ── */
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    /* ── Tiện ích: đếm tổng số item ── */
    const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return {
        cart,
        loading,
        error,
        totalItems,
        fetchCart,
        addItem,
        updateQuantity,
        removeItem,
        handleClearCart,
    };
}

