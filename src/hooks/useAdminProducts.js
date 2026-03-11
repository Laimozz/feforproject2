import { useState, useEffect, useCallback } from "react";
import {
    getAdminProducts,
    createAdminProduct,
    updateAdminProduct,
    deleteAdminProduct,
    getAdminProductsByCategory,
} from "../api/adminApi";
import { getCategories } from "../api/categoryApi";

const PAGE_SIZE = 8;

const EMPTY_FORM = {
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
};

export default function useAdminProducts() {
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [page, setPage] = useState(0);
    const [loadingList, setLoadingList] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState("");

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [loadingSave, setLoadingSave] = useState(false);
    const [formError, setFormError] = useState("");

    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const [categories, setCategories] = useState([]);

    const fetchProducts = useCallback(async () => {
        setLoadingList(true);
        try {
            let data;
            if (selectedCategory) {
                const res = await getAdminProductsByCategory(
                    parseInt(selectedCategory, 10),
                    page,
                    PAGE_SIZE
                );
                data = res.data;
            } else {
                const res = await getAdminProducts(page, PAGE_SIZE);
                data = res.data;
            }
            setProducts(data.content);
            setTotalPages(data.totalPages);
            setTotalItems(data.totalElements);
        } catch (err) {
            console.error("Load products failed:", err);
        } finally {
            setLoadingList(false);
        }
    }, [page, selectedCategory]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const { data } = await getCategories();
                setCategories(data);
            } catch (err) {
                console.error("Load categories failed:", err);
            }
        };
        loadCategories();
    }, []);

    const openCreate = () => {
        setEditTarget(null);
        setForm(EMPTY_FORM);
        setSelectedImageFile(null);
        setImagePreviewUrl("");
        setFormError("");
        setIsFormOpen(true);
    };

    const openEdit = (product) => {
        setEditTarget(product);
        setForm({
            name: product.name || "",
            description: product.description || "",
            price: String(product.price),
            stock: String(product.stock),
            categoryId: String(product.categoryId),
        });
        setSelectedImageFile(null);
        setImagePreviewUrl(product.imageUrl || "");
        setFormError("");
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditTarget(null);
        setForm(EMPTY_FORM);
        setSelectedImageFile(null);
        setImagePreviewUrl("");
        setFormError("");
    };

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (formError) setFormError("");
    };

    const handleImageChange = (file) => {
        if (!file) return;

        const allowed = ["image/jpeg", "image/png", "image/webp"];
        if (!allowed.includes(file.type)) {
            setFormError("Chỉ hỗ trợ ảnh JPG, PNG, WEBP.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setFormError("Ảnh vượt quá 5MB.");
            return;
        }

        setSelectedImageFile(file);
        setImagePreviewUrl(URL.createObjectURL(file));
        if (formError) setFormError("");
    };

    const handleCategoryFilter = (categoryId) => {
        setSelectedCategory(categoryId);
        setPage(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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

        const payload = {
            name: form.name.trim(),
            description: form.description.trim(),
            price,
            stock,
            categoryId: parseInt(form.categoryId, 10),
            imageFile: selectedImageFile || null, // optional on update
        };

        setLoadingSave(true);
        setFormError("");

        try {
            if (editTarget) {
                await updateAdminProduct(editTarget.id, payload);
            } else {
                await createAdminProduct(payload);
            }

            closeForm();
            fetchProducts();
        } catch (err) {
            setFormError(
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                "Có lỗi xảy ra. Vui lòng thử lại."
            );
        } finally {
            setLoadingSave(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setLoadingDelete(true);
        try {
            await deleteAdminProduct(deleteTarget.id);
            setDeleteTarget(null);

            if (products.length === 1 && page > 0) {
                setPage((p) => p - 1);
            } else {
                fetchProducts();
            }
        } catch (err) {
            console.error("Delete failed:", err);
        } finally {
            setLoadingDelete(false);
        }
    };

    return {
        products,
        totalPages,
        totalItems,
        page,
        loadingList,
        setPage,

        selectedCategory,
        handleCategoryFilter,

        isFormOpen,
        editTarget,
        form,
        loadingSave,
        formError,
        openCreate,
        openEdit,
        closeForm,
        handleFormChange,
        handleSubmit,

        selectedImageFile,
        imagePreviewUrl,
        handleImageChange,

        deleteTarget,
        loadingDelete,
        openDelete: (product) => setDeleteTarget(product),
        closeDelete: () => setDeleteTarget(null),
        confirmDelete: handleDelete,

        categories,
    };
}
