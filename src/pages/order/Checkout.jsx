// Vị trí: src/pages/order/Checkout.jsx
import React, { useState } from "react";
import useOrders from "../../hooks/useOrders";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../../components/layout/AppNavbar";
import Footer from "../../components/layout/Footer";
import "./OrderPage.css";

export default function Checkout() {
  const { createOrder, loading, error } = useOrders();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    shippingAddress: "",
    phone: "",
    note: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newOrder = await createOrder(formData);
      alert("Đặt hàng thành công!");
      navigate(`/orders/${newOrder.id}`); 
    } catch (err) {
      console.error(err);
      alert("Bạn chưa đăng nhập hoặc còn thiếu thông tin!");
    }
  };

  return (
    <div className="order-page">
      <AppNavbar />
      <div className="order-container">
        <div className="order-header">
           <h1 className="order-title">Thanh toán đơn hàng</h1>
        </div>

        {error && <div className="order-error">⚠️ {error}</div>}

        <div className="checkout-card">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Địa chỉ giao hàng (*)</label>
              <input 
                type="text" 
                placeholder="Nhập địa chỉ nhà..."
                required
                value={formData.shippingAddress}
                onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại (*)</label>
              <input 
                type="text" 
                placeholder="0911223344"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Ghi chú (tùy chọn)</label>
              <textarea 
                placeholder="Giao hàng buổi sáng..."
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
              />
            </div>

            <button type="submit" className="checkout-btn" disabled={loading}>
              {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
