import { useState, useEffect, useCallback } from "react";
import { getAdminUsers, getAdminUserById, deleteAdminUser } from "../api/adminApi";

const PAGE_SIZE = 10;

export default function useAdminUsers() {
  /* ── State danh sách ── */
  const [users,       setUsers]       = useState([]);
  const [totalPages,  setTotalPages]  = useState(0);
  const [totalItems,  setTotalItems]  = useState(0);
  const [page,        setPage]        = useState(0);
  const [search,      setSearch]      = useState("");
  const [loadingList, setLoadingList] = useState(false);

  /* ── State modal xem chi tiết ── */
  const [viewUser,    setViewUser]    = useState(null); // null | "loading" | object
  const [loadingView, setLoadingView] = useState(false);

  /* ── State modal xác nhận xóa ── */
  const [deleteTarget,  setDeleteTarget]  = useState(null); // null | { id, username }
  const [loadingDelete, setLoadingDelete] = useState(false);

  /* ──────────────────────────────────────────
     Load danh sách user
     Chạy lại mỗi khi page hoặc search thay đổi
  ────────────────────────────────────────── */
  const fetchUsers = useCallback(async () => {
    setLoadingList(true);
    try {
      const { data } = await getAdminUsers(page, PAGE_SIZE, search);
      // BE trả về Page<AdminUserResponse>
      setUsers(data.content);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalElements);
    } catch (err) {
      console.error("Lỗi load danh sách user:", err);
    } finally {
      setLoadingList(false);
    }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  /* ──────────────────────────────────────────
     Tìm kiếm — reset về trang 0 khi đổi keyword
  ────────────────────────────────────────── */
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  /* ──────────────────────────────────────────
     Xem chi tiết 1 user theo id
     Gọi API GET /admin/users/{id}
  ────────────────────────────────────────── */
  const handleView = async (id) => {
    setViewUser("loading");
    setLoadingView(true);
    try {
      const { data } = await getAdminUserById(id);
      setViewUser(data);
    } catch {
      setViewUser(null);
    } finally {
      setLoadingView(false);
    }
  };

  /* ──────────────────────────────────────────
     Xóa user theo id
     Gọi API DELETE /admin/users/{id}
     Sau khi xóa: nếu hết trang thì lùi 1 trang
  ────────────────────────────────────────── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setLoadingDelete(true);
    try {
      await deleteAdminUser(deleteTarget.id);
      setDeleteTarget(null);
      if (users.length === 1 && page > 0) {
        setPage((p) => p - 1); // lùi trang, useEffect tự fetch lại
      } else {
        fetchUsers();
      }
    } catch (err) {
      console.error("Lỗi xóa user:", err);
    } finally {
      setLoadingDelete(false);
    }
  };

  return {
    // Danh sách
    users, totalPages, totalItems, page, search,
    loadingList, setPage, handleSearch,

    // Modal xem chi tiết
    viewUser, loadingView,
    openView:  handleView,
    closeView: () => setViewUser(null),

    // Modal xóa
    deleteTarget, loadingDelete,
    openDelete:   (user) => setDeleteTarget(user),
    closeDelete:  () => setDeleteTarget(null),
    confirmDelete: handleDelete,
  };
}