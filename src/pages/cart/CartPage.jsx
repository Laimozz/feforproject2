// =========================================================
// CartPage.jsx
// Vị trí: src/pages/cart/CartPage.jsx
// Trang giỏ hàng — dành cho User đã đăng nhập
// =========================================================

import { useState } from "react";
import { Link } from "react-router-dom";
import AppNavbar from "../../components/layout/AppNavbar";
import Footer from "../../components/layout/Footer";
import useCart from "../../hooks/useCart";
import { ROUTES } from "../../constants/routes";
import "./CartPage.css";

/* ── Icons ── */
const IconTrash = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const IconMinus = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
);

const IconPlus = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);

const IconCart = () => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
);

/* ── Format tiền VND ── */
const formatPrice = (price) => {
    if (price == null) return "0 ₫";
    return Number(price).toLocaleString("vi-VN") + " ₫";
};

export default function CartPage() {
    const {
        cart,
        loading,
        error,
        totalItems,
        updateQuantity,
        removeItem,
        handleClearCart,
    } = useCart();

    const [removingId, setRemovingId] = useState(null); // track item đang bị xóa (animation)
    const [clearing, setClearing] = useState(false);

    /* ── Xử lý xóa 1 item ── */
    const onRemove = async (itemId) => {
        setRemovingId(itemId);
        await removeItem(itemId);
        setRemovingId(null);
    };

    /* ── Xử lý xóa toàn bộ ── */
    const onClearAll = async () => {
        if (!window.confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) return;
        setClearing(true);
        await handleClearCart();
        setClearing(false);
    };

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="cart-page">
                <AppNavbar />
                <div className="cart-container">
                    <div className="cart-loading">
                        <div className="cart-spinner" />
                        <p>Đang tải giỏ hàng...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    /* ── Error ── */
    if (error) {
        return (
            <div className="cart-page">
                <AppNavbar />
                <div className="cart-container">
                    <div className="cart-error">
                        <p>⚠️ {error}</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const items = cart?.items || [];
    const isEmpty = items.length === 0;

    return (
        <div className="cart-page">
            <AppNavbar />

            <div className="cart-container">
                {/* ── Header ── */}
                <div className="cart-header">
                    <h1 className="cart-title">🛒 Giỏ Hàng Của Tôi</h1>
                    {!isEmpty && (
                        <span className="cart-count">{totalItems} sản phẩm</span>
                    )}
                </div>

                {isEmpty ? (
                    /* ── Giỏ trống ── */
                    <div className="cart-empty">
                        <div className="cart-empty__icon">
                            <IconCart />
                        </div>
                        <h2 className="cart-empty__title">Giỏ hàng trống</h2>
                        <p className="cart-empty__text">
                            Bạn chưa thêm sản phẩm nào vào giỏ hàng.
                        </p>
                        <Link to={ROUTES.CATEGORIES} className="cart-empty__btn">
                            ← Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : (
                    /* ── Có sản phẩm ── */
                    <div className="cart-content">
                        {/* Danh sách items */}
                        <div className="cart-items">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className={`cart-item ${removingId === item.id ? "cart-item--removing" : ""}`}
                                >
                                    {/* Ảnh sản phẩm */}
                                    <div className="cart-item__img-wrap">
                                        {item.productImageUrl ? (
                                            <img
                                                src={item.productImageUrl}
                                                alt={item.productName}
                                                className="cart-item__img"
                                            />
                                        ) : (
                                            <div className="cart-item__img-placeholder">📦</div>
                                        )}
                                    </div>

                                    {/* Thông tin */}
                                    <div className="cart-item__info">
                                        <h3 className="cart-item__name">{item.productName}</h3>
                                        <p className="cart-item__price">
                                            {formatPrice(item.productPrice)}
                                        </p>
                                    </div>

                                    {/* Số lượng */}
                                    <div className="cart-item__quantity">
                                        <button
                                            className="cart-item__qty-btn"
                                            onClick={() =>
                                                updateQuantity(item.id, item.productId, item.quantity - 1)
                                            }
                                            disabled={item.quantity <= 1}
                                            title="Giảm"
                                        >
                                            <IconMinus />
                                        </button>
                                        <span className="cart-item__qty-value">{item.quantity}</span>
                                        <button
                                            className="cart-item__qty-btn"
                                            onClick={() =>
                                                updateQuantity(item.id, item.productId, item.quantity + 1)
                                            }
                                            title="Tăng"
                                        >
                                            <IconPlus />
                                        </button>
                                    </div>

                                    {/* Thành tiền */}
                                    <div className="cart-item__subtotal">
                                        {formatPrice(item.productPrice * item.quantity)}
                                    </div>

                                    {/* Nút xóa */}
                                    <button
                                        className="cart-item__remove"
                                        onClick={() => onRemove(item.id)}
                                        title="Xóa"
                                    >
                                        <IconTrash />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="cart-summary">
                            <div className="cart-summary__card">
                                <h2 className="cart-summary__title">Tóm Tắt Đơn Hàng</h2>

                                <div className="cart-summary__row">
                                    <span>Số lượng sản phẩm</span>
                                    <span>{totalItems}</span>
                                </div>

                                <div className="cart-summary__divider" />

                                <div className="cart-summary__row cart-summary__row--total">
                                    <span>Tổng cộng</span>
                                    <span className="cart-summary__total-price">
                                        {formatPrice(cart?.totalPrice)}
                                    </span>
                                </div>

                                {/* Nút xóa toàn bộ */}
                                <button
                                    className="cart-summary__clear-btn"
                                    onClick={onClearAll}
                                    disabled={clearing}
                                >
                                    {clearing ? "Đang xóa..." : "🗑️ Xóa toàn bộ giỏ hàng"}
                                </button>

                                {/* Link tiếp tục mua sắm */}
                                <Link to={ROUTES.CATEGORIES} className="cart-summary__continue">
                                    ← Tiếp tục mua sắm
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

