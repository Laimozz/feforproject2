// =========================================================
// useProductDetail.js
// Vị trí: src/hooks/useProductDetail.js
// Hook load chi tiết 1 sản phẩm theo ID
// =========================================================

import { useState, useEffect, useCallback } from "react";
import { getProductById } from "../api/productApi";

export default function useProductDetail(productId) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchProduct = useCallback(async () => {
        if (!productId) return;
        setLoading(true);
        setError("");
        try {
            const { data } = await getProductById(productId);
            setProduct(data);
        } catch (err) {
            console.error("Lỗi load chi tiết sản phẩm:", err);
            setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    return { product, loading, error };
}

