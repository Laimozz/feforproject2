// Vị trí: src/pages/payment/PaymentResult.jsx
import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import AppNavbar from "../../components/layout/Appnavbar";
import Footer from "../../components/layout/Footer";
import "../order/OrderPage.css";

export default function PaymentResult() {
  const [searchParams] = useSearchParams();

  const responseCode = searchParams.get("vnp_ResponseCode");
  const orderId = searchParams.get("orderId");
  const txnRef = searchParams.get("vnp_TxnRef");

  const isSuccess = responseCode === "00";

  return (
    <div className="order-page">
      <AppNavbar />
      <div className="order-container">
        <div className="checkout-card" style={{ textAlign: "center", maxWidth: 560, margin: "40px auto" }}>

          {/* Icon */}
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: isSuccess ? "#d1fae5" : "#fef2f2",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2.5rem", margin: "0 auto 20px",
          }}>
            {isSuccess ? "✅" : "❌"}
          </div>

          {/* Tiêu đề */}
          <h1 style={{
            fontSize: "1.5rem", fontWeight: 700,
            color: isSuccess ? "#065f46" : "#dc2626",
            marginBottom: 8,
          }}>
            {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại"}
          </h1>

          {/* Mô tả */}
          <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: 24 }}>
            {isSuccess
              ? "Đơn hàng của bạn đã được thanh toán thành công qua VNPay. Chúng tôi sẽ xử lý đơn hàng sớm nhất."
              : "Giao dịch thanh toán không thành công hoặc đã bị hủy. Đơn hàng của bạn đã được hủy tự động."}
          </p>

          {/* Chi tiết */}
          <div style={{
            background: "#f8fafc", borderRadius: 12, padding: 16, marginBottom: 24,
            textAlign: "left", fontSize: "0.9rem",
          }}>
            {orderId && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <span style={{ color: "#64748b" }}>Mã đơn hàng</span>
                <span style={{ fontWeight: 600 }}>#{orderId}</span>
              </div>
            )}
            {txnRef && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <span style={{ color: "#64748b" }}>Mã giao dịch</span>
                <span style={{ fontWeight: 600 }}>{txnRef}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
              <span style={{ color: "#64748b" }}>Trạng thái</span>
              <span style={{ fontWeight: 600, color: isSuccess ? "#16a34a" : "#dc2626" }}>
                {isSuccess ? "Thành công" : `Thất bại (mã: ${responseCode})`}
              </span>
            </div>
          </div>

          {/* Nút hành động */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {isSuccess && orderId && (
              <Link
                to={`/orders/${orderId}`}
                style={{
                  padding: "12px 24px", background: "var(--color-primary)", color: "#fff",
                  borderRadius: 10, fontWeight: 600, fontSize: "0.9rem", textDecoration: "none",
                }}
              >
                Xem đơn hàng
              </Link>
            )}
            <Link
              to="/orders"
              style={{
                padding: "12px 24px",
                background: isSuccess ? "#f1f5f9" : "var(--color-primary)",
                color: isSuccess ? "#475569" : "#fff",
                borderRadius: 10, fontWeight: 600, fontSize: "0.9rem", textDecoration: "none",
              }}
            >
              Lịch sử đơn hàng
            </Link>
            <Link
              to="/"
              style={{
                padding: "12px 24px", background: "#f1f5f9", color: "#475569",
                borderRadius: 10, fontWeight: 600, fontSize: "0.9rem", textDecoration: "none",
              }}
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
