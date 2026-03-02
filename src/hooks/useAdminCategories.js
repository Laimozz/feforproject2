import { useState, useEffect } from "react";
import {
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from "../api/adminApi";
import { getCategories } from "../api/categoryApi";

export default function useAdminCategories() {
  const [categories,  setCategories]  = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  /* ── State kiểm soát modal form ── */
  const [isFormOpen,  setIsFormOpen]  = useState(false); // true/false — mở hay đóng modal
  const [editTarget,  setEditTarget]  = useState(null);  // null = tạo mới | object = chỉnh sửa
  const [form,        setForm]        = useState({ name: "", description: "" });
  const [loadingSave, setLoadingSave] = useState(false);
  const [formError,   setFormError]   = useState("");

  /* ── State modal xóa ── */
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  /* ── Load danh sách ── */
  const fetchCategories = async () => {
    setLoadingList(true);
    try {
      const { data } = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Lỗi load category:", err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  /* ── Mở form TẠO MỚI ── */
  const openCreate = () => {
    setEditTarget(null);
    setForm({ name: "", description: "" });
    setFormError("");
    setIsFormOpen(true); // ← mở modal
  };

  /* ── Mở form CHỈNH SỬA — điền sẵn data cũ ── */
  const openEdit = (category) => {
    setEditTarget(category);
    setForm({ name: category.name, description: category.description || "" });
    setFormError("");
    setIsFormOpen(true); // ← mở modal
  };

  /* ── Đóng form ── */
  const closeForm = () => {
    setIsFormOpen(false); // ← đóng modal
    setEditTarget(null);
    setForm({ name: "", description: "" });
    setFormError("");
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (formError) setFormError("");
  };

  /* ── Submit form ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setFormError("Tên danh mục không được để trống."); return; }

    setLoadingSave(true);
    setFormError("");
    try {
      if (editTarget) {
        await updateAdminCategory(editTarget.id, form);
      } else {
        await createAdminCategory(form);
      }
      closeForm();
      fetchCategories();
    } catch (err) {
      setFormError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setLoadingSave(false);
    }
  };

  /* ── Xóa category ── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setLoadingDelete(true);
    try {
      await deleteAdminCategory(deleteTarget.id);
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      console.error("Lỗi xóa category:", err);
    } finally {
      setLoadingDelete(false);
    }
  };

  return {
    categories, loadingList,
    isFormOpen, editTarget, form, loadingSave, formError,
    openCreate, openEdit, closeForm, handleFormChange, handleSubmit,
    deleteTarget, loadingDelete,
    openDelete:    (cat) => setDeleteTarget(cat),
    closeDelete:   () => setDeleteTarget(null),
    confirmDelete: handleDelete,
  };
}