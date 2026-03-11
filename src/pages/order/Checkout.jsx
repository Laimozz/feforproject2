// Vị trí: src/pages/order/Checkout.jsx
import React, { useState } from "react";
import useOrders from "../../hooks/useOrders";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../../components/layout/AppNavbar";
import Footer from "../../components/layout/Footer";
import "./OrderPage.css";

export default function Checkout() {
  const { createOrder, createVnPayPayment, loading, error } = useOrders();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    shippingAddress: "",
    phone: "",
    note: "",
    paymentMethod: "COD", // mặc định COD
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Tạo đơn hàng (COD hoặc VNPAY)
      const newOrder = await createOrder(formData);

      if (formData.paymentMethod === "VNPAY") {
        // 2. Nếu VNPay → lấy URL thanh toán rồi redirect
        const paymentUrl = await createVnPayPayment(newOrder.id);
        window.location.href = paymentUrl;
      } else {
        // COD → chuyển thẳng tới trang chi tiết đơn
        alert("Đặt hàng thành công!");
        navigate(`/orders/${newOrder.id}`);
      }
    } catch (err) {
      console.error(err);
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

            {/* ── Chọn phương thức thanh toán ── */}
            <div className="form-group">
              <label>Phương thức thanh toán (*)</label>
              <div className="payment-methods">
                <label className={`payment-option ${formData.paymentMethod === "COD" ? "payment-option--active" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === "COD"}
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  />
                  <span className="payment-option__icon">💵</span>
                  <span className="payment-option__text">
                    <strong>Thanh toán khi nhận hàng (COD)</strong>
                    <small>Trả tiền mặt khi nhận hàng</small>
                  </span>
                </label>

                <label className={`payment-option ${formData.paymentMethod === "VNPAY" ? "payment-option--active" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="VNPAY"
                    checked={formData.paymentMethod === "VNPAY"}
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  />
                  <span className="payment-option__icon">🏦</span>
                  <span className="payment-option__text">
                    <strong>Thanh toán qua VNPay</strong>
                    <small>ATM / Visa / MasterCard / QR Code</small>
                  </span>
                </label>
              </div>
            </div>

            <button type="submit" className="checkout-btn" disabled={loading}>
              {loading
                ? "Đang xử lý..."
                : formData.paymentMethod === "VNPAY"
                  ? "Thanh toán qua VNPay"
                  : "Xác nhận đặt hàng"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
