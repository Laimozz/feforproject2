// Vị trí: src/pages/order/OrderHistory.jsx
import React, { useEffect } from "react";
import useOrders from "../../hooks/useOrders";
import { Link } from "react-router-dom";
import AppNavbar from "../../components/layout/Appnavbar";
import Footer from "../../components/layout/Footer";
import "./OrderPage.css";

// Hàm hỗ trợ format tiền tệ
const formatPrice = (price) => {
    if (price == null) return "0 ₫";
    return Number(price).toLocaleString("vi-VN") + " ₫";
};

// Đổi màu badge status
const getStatusClass = (status) => {
  switch (status?.toUpperCase()) {
    case 'PENDING':          return 'pending';
    case 'AWAITING_PAYMENT': return 'awaiting';
    case 'CONFIRMED':        return 'processing';
    case 'SHIPPING':         return 'processing';
    case 'DELIVERED':        return 'completed';
    case 'CANCELLED':        return 'cancelled';
    default:                 return 'pending';
  }
};

const getStatusLabel = (status) => {
  switch (status?.toUpperCase()) {
    case 'PENDING':          return 'Chờ xác nhận';
    case 'AWAITING_PAYMENT': return 'Chờ thanh toán';
    case 'CONFIRMED':        return 'Đã xác nhận';
    case 'SHIPPING':         return 'Đang giao';
    case 'DELIVERED':        return 'Đã giao';
    case 'CANCELLED':        return 'Đã hủy';
    default:                 return status;
  }
};

export default function OrderHistory() {
  const { orders, loading, error, fetchOrders, handleCancelOrder } = useOrders();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const onCancelClick = async (id) => {
    if (window.confirm('Bạn chắc chắn muốn hủy đơn hàng này?')) {
        await handleCancelOrder(id);
    }
  }

  return (
    <div className="order-page">
      <AppNavbar />
      <div className="order-container">
        <div className="order-header">
           <h1 className="order-title">Lịch sử Đơn hàng</h1>
        </div>

        {loading ? (
           <div className="order-loading">Đang tải danh sách đơn hàng...</div>
        ) : error ? (
           <div className="order-error">⚠️ {error}</div>
        ) : orders.length === 0 ? (
           <div className="checkout-card" style={{ textAlign: "center" }}>
               <p>Bạn chưa có đơn hàng nào.</p>
               <br/>
               <Link to="/products" className="btn-link">← Đi mua sắm ngay</Link>
           </div>
        ) : (
          <div className="order-history-card">
            <table className="order-table">
              <thead>
                <tr>
                  <th>Mã Đơn</th>
                  <th>Ngày đặt</th>
                  <th>Tổng tiền</th>
                  <th>Thanh toán</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: "700" }}>#{order.id}</td>
                    <td>{new Date(order.orderDate).toLocaleString('vi-VN')}</td>
                    <td style={{ color: "var(--color-primary)", fontWeight: "600" }}>
                        {formatPrice(order.totalPrice)}
                    </td>
                    <td>
                      <span className={`badge ${order.paymentMethod === "VNPAY" ? "vnpay" : "cod"}`}>
                        {order.paymentMethod === "VNPAY" ? "VNPay" : "COD"}
                      </span>
                    </td>
                    <td>
                        <span className={`badge ${getStatusClass(order.status)}`}>
                            {getStatusLabel(order.status)}
                        </span>
                    </td>
                    <td>
                      <div className="action-links">
                          <Link to={`/orders/${order.id}`} className="btn-link">Xem chi tiết</Link>
                          {(order.status === "PENDING" || order.status === "AWAITING_PAYMENT") && (
                            <button className="btn-cancel" onClick={() => onCancelClick(order.id)}>
                                Hủy Đơn
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
