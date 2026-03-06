// =========================================================
// useProductsByCategory.js
// Hook dùng cho trang CategoryDetail:
//   - Load danh sách sản phẩm theo categoryId từ URL
//   - Hỗ trợ phân trang
//   - Tự fetch lại khi categoryId hoặc page thay đổi
// =========================================================

import { useState, useEffect, useCallback } from "react";
import { getProductsByCategory } from "../api/productApi";

const PAGE_SIZE = 12; // 12 sản phẩm mỗi trang (chia đều grid 3/4 cột)

export default function useProductsByCategory(categoryId) {
    /* ── Danh sách sản phẩm + phân trang ── */
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* useCallback: chỉ re-create khi categoryId hoặc page đổi */
    const fetchProducts = useCallback(async () => {
        // Không fetch nếu chưa có categoryId (tránh lỗi khi component mount)
        if (!categoryId) return;

        setLoading(true);
        setError("");
        try {
            const { data } = await getProductsByCategory(categoryId, page, PAGE_SIZE);
            // BE trả về Page<ProductResponse>: { content, totalPages, totalElements }
            setProducts(data.content);
            setTotalPages(data.totalPages);
            setTotalItems(data.totalElements);
        } catch (err) {
            console.error("Lỗi load sản phẩm theo category:", err);
            setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    }, [categoryId, page]); // re-fetch khi đổi category hoặc trang

    // Reset về trang 0 khi đổi sang category khác
    useEffect(() => {
        setPage(0);
    }, [categoryId]);

    // Fetch khi fetchProducts thay đổi (tức khi page hoặc categoryId đổi)
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        totalPages,
        totalItems,
        page,
        loading,
        error,
        setPage,    // dùng để component gọi chuyển trang
    };
}
