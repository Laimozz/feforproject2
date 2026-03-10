import { useState, useEffect, useCallback } from "react";
import { getAdminOrders, getAdminOrderById, updateAdminOrderStatus } from "../api/adminApi";

const PAGE_SIZE = 10;

export default function useAdminOrders() {
  /* ── State danh sách ── */
  const [orders,      setOrders]      = useState([]);
  const [totalPages,  setTotalPages]  = useState(0);
  const [totalItems,  setTotalItems]  = useState(0);
  const [page,        setPage]        = useState(0);
  const [statusFilter, setStatusFilter] = useState(""); // lọc theo status
  const [loadingList, setLoadingList] = useState(false);

  /* ── State modal chi tiết ── */
  const [viewOrder,    setViewOrder]    = useState(null);
  const [loadingView,  setLoadingView]  = useState(false);

  /* ── State modal cập nhật trạng thái ── */
  const [statusTarget,   setStatusTarget]   = useState(null); // { id, currentStatus }
  const [newStatus,      setNewStatus]      = useState("");
  const [loadingStatus,  setLoadingStatus]  = useState(false);
  const [statusError,    setStatusError]    = useState("");

  /* ──────────────────────────────────────────
     Load danh sách đơn hàng
  ────────────────────────────────────────── */
  const fetchOrders = useCallback(async () => {
    setLoadingList(true);
    try {
      const { data } = await getAdminOrders(page, PAGE_SIZE, statusFilter);
      setOrders(data.content);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalElements);
    } catch (err) {
      console.error("Lỗi load danh sách đơn hàng:", err);
    } finally {
      setLoadingList(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  /* ──────────────────────────────────────────
     Lọc theo status — reset về trang 0
  ────────────────────────────────────────── */
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setPage(0);
  };

  /* ──────────────────────────────────────────
     Xem chi tiết đơn hàng
  ────────────────────────────────────────── */
  const handleView = async (id) => {
    setViewOrder("loading");
    setLoadingView(true);
    try {
      const { data } = await getAdminOrderById(id);
      setViewOrder(data);
    } catch {
      setViewOrder(null);
    } finally {
      setLoadingView(false);
    }
  };

  /* ──────────────────────────────────────────
     Mở modal cập nhật trạng thái
  ────────────────────────────────────────── */
  const openStatusModal = (order) => {
    setStatusTarget({ id: order.id, currentStatus: order.status });
    setNewStatus("");
    setStatusError("");
  };

  /* ──────────────────────────────────────────
     Xác nhận cập nhật trạng thái
  ────────────────────────────────────────── */
  const confirmUpdateStatus = async () => {
    if (!statusTarget || !newStatus) return;
    setLoadingStatus(true);
    setStatusError("");
    try {
      await updateAdminOrderStatus(statusTarget.id, newStatus);
      setStatusTarget(null);
      fetchOrders();
    } catch (err) {
      const msg = err.response?.data?.message || "Không thể cập nhật trạng thái.";
      setStatusError(msg);
    } finally {
      setLoadingStatus(false);
    }
  };

  return {
    // Danh sách
    orders, totalPages, totalItems, page, statusFilter,
    loadingList, setPage, handleStatusFilter,

    // Modal chi tiết
    viewOrder, loadingView,
    openView: handleView,
    closeView: () => setViewOrder(null),

    // Modal cập nhật trạng thái
    statusTarget, newStatus, loadingStatus, statusError,
    setNewStatus,
    openStatusModal,
    closeStatusModal: () => setStatusTarget(null),
    confirmUpdateStatus,
  };
}
