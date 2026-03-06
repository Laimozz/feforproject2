// =========================================================
// useAdminProducts.js
// Custom hook xử lý toàn bộ logic cho trang admin sản phẩm:
//   - Danh sách có phân trang (page, size)
//   - Modal form tạo mới / chỉnh sửa
//   - Modal xác nhận xóa
//   - Load categories để dùng trong select box
// Pattern giống useAdminCategories.js nhưng thêm pagination
// =========================================================

import { useState, useEffect, useCallback } from "react";
import {
    getAdminProducts,
    createAdminProduct,
    updateAdminProduct,
    deleteAdminProduct,
    getAdminProductsByCategory,
} from "../api/adminApi";
import { getCategories } from "../api/categoryApi"; // dùng để render select category trong form

const PAGE_SIZE = 10; // số sản phẩm mỗi trang

// Giá trị mặc định của form — dùng khi mở tạo mới
const EMPTY_FORM = {
    name: "",
    description: "",
    price: "",       // string → parse sang number khi submit
    stock: "",
    imageUrl: "",
    categoryId: "",       // id của category được chọn
};

export default function useAdminProducts() {

    /* ─────────────────────────────────────────────
       STATE: Danh sách sản phẩm + phân trang
    ───────────────────────────────────────────── */
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [page, setPage] = useState(0);  // trang hiện tại (0-indexed)
    const [loadingList, setLoadingList] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState("");
    /* ─────────────────────────────────────────────
       STATE: Modal form (tạo mới / chỉnh sửa)
    ───────────────────────────────────────────── */
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);   // null = tạo mới, object = chỉnh sửa
    const [form, setForm] = useState(EMPTY_FORM);
    const [loadingSave, setLoadingSave] = useState(false);
    const [formError, setFormError] = useState("");

    /* ─────────────────────────────────────────────
       STATE: Modal xác nhận xóa
    ───────────────────────────────────────────── */
    const [deleteTarget, setDeleteTarget] = useState(null); // null | { id, name }
    const [loadingDelete, setLoadingDelete] = useState(false);

    /* ─────────────────────────────────────────────
       STATE: Danh sách categories (dùng trong <select>)
    ───────────────────────────────────────────── */
    const [categories, setCategories] = useState([]);

    /* ─────────────────────────────────────────────
       Load danh sách sản phẩm
       useCallback để tránh re-create function mỗi render
       Chạy lại khi đổi trang (page)
    ───────────────────────────────────────────── */
    const fetchProducts = useCallback(async () => {
        setLoadingList(true);
        try {
            let data;
            if (selectedCategory) {
                // Có chọn category → gọi endpoint lọc theo category
                const res = await getAdminProductsByCategory(
                    parseInt(selectedCategory, 10),
                    page,
                    PAGE_SIZE
                );
                data = res.data;
            } else {
                // Không chọn category → lấy tất cả sản phẩm
                const res = await getAdminProducts(page, PAGE_SIZE);
                data = res.data;
            }
            setProducts(data.content);
            setTotalPages(data.totalPages);
            setTotalItems(data.totalElements);
        } catch (err) {
            console.error("Lỗi load danh sách sản phẩm:", err);
        } finally {
            setLoadingList(false);
        }
    }, [page, selectedCategory]); // chỉ re-create khi page thay đổi

    // Khi page thay đổi → fetch lại
    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    /* ─────────────────────────────────────────────
       Load danh sách categories (1 lần khi mount)
       Dùng để render <select> category trong form
    ───────────────────────────────────────────── */
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const { data } = await getCategories();
                setCategories(data);
            } catch (err) {
                console.error("Lỗi load categories:", err);
            }
        };
        loadCategories();
    }, []); // [] = chỉ chạy 1 lần

    /* ─────────────────────────────────────────────
       MỞ FORM TẠO MỚI
       Reset form về EMPTY_FORM, set editTarget = null
    ───────────────────────────────────────────── */
    const openCreate = () => {
        setEditTarget(null);
        setForm(EMPTY_FORM);
        setFormError("");
        setIsFormOpen(true);
    };

    /* ─────────────────────────────────────────────
       MỞ FORM CHỈNH SỬA
       Điền sẵn data của sản phẩm vào form
       product: ProductResponse từ BE
    ───────────────────────────────────────────── */
    const openEdit = (product) => {
        setEditTarget(product);
        setForm({
            name: product.name || "",
            description: product.description || "",
            price: String(product.price),       // số → string để bind vào input
            stock: String(product.stock),
            imageUrl: product.imageUrl || "",
            categoryId: String(product.categoryId),  // id → string để bind vào select
        });
        setFormError("");
        setIsFormOpen(true);
    };

    /* ─────────────────────────────────────────────
       ĐÓNG FORM — reset hết state
    ───────────────────────────────────────────── */
    const closeForm = () => {
        setIsFormOpen(false);
        setEditTarget(null);
        setForm(EMPTY_FORM);
        setFormError("");
    };

    /* ─────────────────────────────────────────────
       XỬ LÝ THAY ĐỔI INPUT trong form
       Dùng chung cho tất cả field (controlled component)
    ───────────────────────────────────────────── */
    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (formError) setFormError(""); // xóa lỗi khi user bắt đầu sửa
    };

    /* ─────────────────────────────────────────────
       ĐỔI CATEGORY LỌC
       Reset về trang 0 khi chọn category mới
       (tránh ở trang 5 khi switch category chỉ có 2 trang)
    ───────────────────────────────────────────── */
    const handleCategoryFilter = (categoryId) => {
        setSelectedCategory(categoryId); // "" hoặc id dạng string
        setPage(0);                      // về trang đầu
    };

    /* ─────────────────────────────────────────────
       SUBMIT FORM — tạo mới hoặc cập nhật
       Validate trước khi gọi API:
         - Tên không trống
         - Giá > 0
         - Stock >= 0
         - Phải chọn category
    ───────────────────────────────────────────── */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // --- Validation ---
        if (!form.name.trim()) {
            setFormError("Tên sản phẩm không được để trống.");
            return;
        }
        const price = parseFloat(form.price);
        if (isNaN(price) || price <= 0) {
            setFormError("Giá sản phẩm phải lớn hơn 0.");
            return;
        }
        const stock = parseInt(form.stock, 10);
        if (isNaN(stock) || stock < 0) {
            setFormError("Số lượng tồn kho không hợp lệ.");
            return;
        }
        if (!form.categoryId) {
            setFormError("Vui lòng chọn danh mục.");
            return;
        }

        // --- Chuẩn bị payload đúng kiểu dữ liệu BE mong đợi ---
        const payload = {
            name: form.name.trim(),
            description: form.description.trim(),
            price: price,          // BE nhận BigDecimal → number
            stock: stock,          // BE nhận Integer → number
            imageUrl: form.imageUrl.trim(),
            categoryId: parseInt(form.categoryId, 10), // BE nhận Integer → number
        };

        setLoadingSave(true);
        setFormError("");
        try {
            if (editTarget) {
                // Chỉnh sửa: PUT /admin/products/{id}
                await updateAdminProduct(editTarget.id, payload);
            } else {
                // Tạo mới: POST /admin/products
                await createAdminProduct(payload);
            }
            closeForm();
            fetchProducts(); // refresh danh sách
        } catch (err) {
            // Hiển thị lỗi từ BE (error field trong response)
            setFormError(
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                "Có lỗi xảy ra. Vui lòng thử lại."
            );
        } finally {
            setLoadingSave(false);
        }
    };

    /* ─────────────────────────────────────────────
       XÓA SẢN PHẨM
       Sau khi xóa: nếu trang hiện tại trống thì lùi 1 trang
    ───────────────────────────────────────────── */
    const handleDelete = async () => {
        if (!deleteTarget) return;
        setLoadingDelete(true);
        try {
            await deleteAdminProduct(deleteTarget.id);
            setDeleteTarget(null);
            // Nếu xóa item cuối của trang (không phải trang 0) → lùi 1 trang
            if (products.length === 1 && page > 0) {
                setPage((p) => p - 1); // useEffect tự fetch lại do page đổi
            } else {
                fetchProducts();
            }
        } catch (err) {
            console.error("Lỗi xóa sản phẩm:", err);
        } finally {
            setLoadingDelete(false);
        }
    };

    /* ─────────────────────────────────────────────
       RETURN — export tất cả state và handler ra ngoài
    ───────────────────────────────────────────── */
    return {
        // Danh sách + phân trang
        products, totalPages, totalItems, page,
        loadingList, setPage,

        // Lọc theo category  ← THÊM 2 DÒNG NÀY
        selectedCategory, handleCategoryFilter,

        // Form
        isFormOpen, editTarget, form, loadingSave, formError,
        openCreate, openEdit, closeForm, handleFormChange, handleSubmit,

        // Xóa
        deleteTarget, loadingDelete,
        openDelete: (product) => setDeleteTarget(product),
        closeDelete: () => setDeleteTarget(null),
        confirmDelete: handleDelete,

        // Danh mục (dùng trong <select>)
        categories,
    };
}
