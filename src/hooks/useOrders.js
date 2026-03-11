// Vị trí: src/hooks/useOrders.js
import { useState, useCallback } from "react";
import { getMyOrders, getOrderById, checkoutOrder, cancelOrder } from "../api/orderApi";
import { createPayment } from "../api/paymentApi";

export default function useOrders() {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const { data } = await getMyOrders();
      setOrders(data);
    } catch (err) {
      setError("Không thể lấy danh sách đơn hàng.");
    } finally { setLoading(false); }
  }, []);

  const fetchOrderDetail = useCallback(async (id) => {
    setLoading(true); setError("");
    try {
      const { data } = await getOrderById(id);
      setCurrentOrder(data);
      return data;
    } catch (err) {
      setError("Không thể tải chi tiết đơn hàng.");
      return null;
    } finally { setLoading(false); }
  }, []);

  const createOrder = useCallback(async (orderData) => {
    setLoading(true); setError("");
    try {
      const { data } = await checkoutOrder(orderData);
      return data;
    } catch (err) {
      setError("Đặt hàng thất bại, vui lòng thử lại.");
      throw err;
    } finally { setLoading(false); }
  }, []);

  /**
   * Tạo URL thanh toán VNPay cho 1 đơn hàng
   * Trả về paymentUrl để redirect
   */
  const createVnPayPayment = useCallback(async (orderId) => {
    setLoading(true); setError("");
    try {
      const { data } = await createPayment(orderId);
      return data.paymentUrl;
    } catch (err) {
      setError("Không thể tạo liên kết thanh toán VNPay.");
      throw err;
    } finally { setLoading(false); }
  }, []);

  const handleCancelOrder = useCallback(async (id) => {
    setLoading(true); setError("");
    try {
      await cancelOrder(id);
      await fetchOrders(); // load lại sau khi hủy
      return true;
    } catch (err) {
      setError("Không thể hủy đơn hàng.");
      return false;
    } finally { setLoading(false); }
  }, [fetchOrders]);

  return {
    orders, currentOrder, loading, error,
    fetchOrders, fetchOrderDetail, createOrder,
    createVnPayPayment, handleCancelOrder,
  };
}
