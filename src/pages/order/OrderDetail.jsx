// Vị trí: src/pages/order/OrderDetail.jsx
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useOrders from "../../hooks/useOrders";
import AppNavbar from "../../components/layout/Appnavbar";
import Footer from "../../components/layout/Footer";
import "./OrderPage.css";

const formatPrice = (price) => {
    if (price == null) return "0 ₫";
    return Number(price).toLocaleString("vi-VN") + " ₫";
};

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

export default function OrderDetail() {
  const { id } = useParams();
  const { currentOrder, loading, error, fetchOrderDetail } = useOrders();

  useEffect(() => {
    if (id) {
      fetchOrderDetail(id);
    }
  }, [id, fetchOrderDetail]);

  return (
    <div className="order-page">
      <AppNavbar />
      <div className="order-container">

        {loading ? (
             <div className="order-loading">Đang tải chi tiết đơn hàng...</div>
        ) : error ? (
            <div className="order-error">⚠️ {error}</div>
        ) : !currentOrder ? (
            <div className="order-error">Không tìm thấy đơn hàng.</div>
        ) : (
          <>
            <div className="order-header">
               <h1 className="order-title">Chi tiết Đơn hàng #{currentOrder.id}</h1>
            </div>

            <div className="detail-grid">
               {/* Box Thông tin đơn & giao hàng */}
               <div className="detail-left">
                  <div className="detail-card">
                     <h3>Thông tin nhận hàng</h3>
                     <div className="info-row">
                        <span className="info-label">Người nhận (SĐT)</span>
                        <span className="info-value">{currentOrder.phone}</span>
                     </div>
                     <div className="info-row">
                        <span className="info-label">Địa chỉ</span>
                        <span className="info-value" style={{textAlign:"right"}}>{currentOrder.shippingAddress}</span>
                     </div>
                     <div className="info-row">
                        <span className="info-label">Thanh toán</span>
                        <span className="info-value">
                          {currentOrder.paymentMethod === "VNPAY" ? "🏦 VNPay" : "💵 COD"}
                        </span>
                     </div>
                     <div className="info-row" style={{borderTop: "1px dashed var(--color-border)", marginTop: "12px", paddingTop: "12px"}}>
                        <span className="info-label">Ghi chú</span>
                        <span className="info-value" style={{fontWeight: "400"}}>{currentOrder.note || "Không có"}</span>
                     </div>
                  </div>

                  <Link to="/orders" className="btn-link">← Quay lại danh sách đơn hàng</Link>
               </div>

               {/* Box Sản phẩm và Tóm tắt tiền */}
               <div className="detail-right">
                  <div className="detail-card">
                     <h3>Tóm tắt đơn hàng</h3>

                     <div className="info-row">
                        <span className="info-label">Trạng thái</span>
                        <span className={`badge ${getStatusClass(currentOrder.status)}`}>
                            {getStatusLabel(currentOrder.status)}
                        </span>
                     </div>
                     <div className="info-row">
                        <span className="info-label">Ngày tạo</span>
                        <span className="info-value">{new Date(currentOrder.orderDate).toLocaleString('vi-VN')}</span>
                     </div>

                     <div style={{height: "1px", background: "var(--color-border)", margin: "16px 0"}}></div>

                     <div className="item-list">
                       {currentOrder.items?.map(item => (
                         <div className="order-item" key={item.id}>
                           <div className="item-meta">
                              <div className="item-name">{item.productName || "Sản phẩm"}</div>
                              <div className="item-qty">Số lượng: {item.quantity} x {formatPrice(item.price)}</div>
                           </div>
                           <div className="item-price">
                              {formatPrice(item.quantity * item.price)}
                           </div>
                         </div>
                       ))}
                     </div>

                     <div style={{height: "1px", background: "var(--color-border)", margin: "16px 0"}}></div>

                     <div className="info-row" style={{ fontSize: "1.1rem" }}>
                        <span className="info-label">Tổng cộng</span>
                        <span className="info-value" style={{color: "var(--color-primary)", fontSize: "1.2rem"}}>
                            {formatPrice(currentOrder.totalPrice)}
                        </span>
                     </div>
                  </div>
               </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
