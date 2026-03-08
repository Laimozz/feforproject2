// =========================================================
// ProductDetail.jsx
// Vị trí: src/pages/products/ProductDetail.jsx
// Trang chi tiết sản phẩm + nút thêm vào giỏ hàng
// =========================================================

import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AppNavbar from "../../components/layout/AppNavbar";
import Footer from "../../components/layout/Footer";
import useProductDetail from "../../hooks/useProductDetail";
import useCart from "../../hooks/useCart";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants/routes";
import "./ProductDetail.css";

/* ── Icons ── */
const IconMinus = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
);
const IconPlus = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);
const IconCart = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
);
const IconCheck = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

/* ── Format tiền VND ── */
const formatPrice = (price) => {
    if (price == null) return "0 ₫";
    return Number(price).toLocaleString("vi-VN") + " ₫";
};

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { product, loading, error } = useProductDetail(id);
    const { addItem } = useCart();

    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);
    const [addError, setAddError] = useState("");

    /* ── Tăng / Giảm số lượng ── */
    const onDecrease = () => setQuantity((q) => Math.max(1, q - 1));
    const onIncrease = () => {
        // Không cho vượt quá tồn kho
        if (product && quantity < product.stock) {
            setQuantity((q) => q + 1);
        }
    };

    /* ── Thêm vào giỏ hàng ── */
    const onAddToCart = async () => {
        // Nếu chưa đăng nhập → chuyển qua login
        if (!user) {
            navigate(ROUTES.LOGIN);
            return;
        }

        setAdding(true);
        setAddError("");
        const success = await addItem(product.id, quantity);

        if (success) {
            setAdded(true);
            // Tự ẩn thông báo sau 3 giây
            setTimeout(() => setAdded(false), 3000);
        } else {
            setAddError("Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
        }
        setAdding(false);
    };

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="pd-page">
                <AppNavbar />
                <div className="pd-container">
                    <div className="pd-loading">
                        <div className="pd-spinner" />
                        <p>Đang tải sản phẩm...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    /* ── Error ── */
    if (error) {
        return (
            <div className="pd-page">
                <AppNavbar />
                <div className="pd-container">
                    <div className="pd-error">
                        <p>⚠️ {error}</p>
                        <Link to={ROUTES.CATEGORIES} className="pd-back-btn">
                            ← Quay lại danh mục
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) return null;

    const outOfStock = product.stock === 0;

    return (
        <div className="pd-page">
            <AppNavbar />

            <div className="pd-container">
                {/* ── Breadcrumb ── */}
                <nav className="pd-breadcrumb">
                    <Link to={ROUTES.CATEGORIES}>Danh Mục</Link>
                    <span className="pd-breadcrumb__sep">›</span>
                    {product.categoryId && (
                        <>
                            <Link to={`/categories/${product.categoryId}`}>
                                {product.categoryName || "Danh mục"}
                            </Link>
                            <span className="pd-breadcrumb__sep">›</span>
                        </>
                    )}
                    <span className="pd-breadcrumb__current">{product.name}</span>
                </nav>

                {/* ── Main content: image + info ── */}
                <div className="pd-main">
                    {/* Ảnh sản phẩm */}
                    <div className="pd-image">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="pd-image__img"
                            />
                        ) : (
                            <div className="pd-image__placeholder">📦</div>
                        )}
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="pd-info">
                        {/* Badge danh mục */}
                        {product.categoryName && (
                            <Link
                                to={`/categories/${product.categoryId}`}
                                className="pd-info__category"
                            >
                                {product.categoryName}
                            </Link>
                        )}

                        <h1 className="pd-info__name">{product.name}</h1>

                        <div className="pd-info__price">{formatPrice(product.price)}</div>

                        {/* Tồn kho */}
                        <div className={`pd-info__stock ${outOfStock ? "pd-info__stock--out" : ""}`}>
                            {outOfStock
                                ? "❌ Hết hàng"
                                : product.stock <= 5
                                    ? `⚠️ Chỉ còn ${product.stock} sản phẩm`
                                    : `✅ Còn hàng (${product.stock})`}
                        </div>

                        {/* Mô tả */}
                        {product.description && (
                            <div className="pd-info__desc">
                                <h3 className="pd-info__desc-title">Mô tả sản phẩm</h3>
                                <p>{product.description}</p>
                            </div>
                        )}

                        <div className="pd-info__divider" />

                        {/* Chọn số lượng + Nút thêm giỏ */}
                        {!outOfStock && (
                            <div className="pd-actions">
                                {/* Quantity selector */}
                                <div className="pd-actions__qty">
                                    <span className="pd-actions__qty-label">Số lượng</span>
                                    <div className="pd-actions__qty-control">
                                        <button
                                            className="pd-actions__qty-btn"
                                            onClick={onDecrease}
                                            disabled={quantity <= 1}
                                        >
                                            <IconMinus />
                                        </button>
                                        <span className="pd-actions__qty-value">{quantity}</span>
                                        <button
                                            className="pd-actions__qty-btn"
                                            onClick={onIncrease}
                                            disabled={quantity >= product.stock}
                                        >
                                            <IconPlus />
                                        </button>
                                    </div>
                                </div>

                                {/* Nút thêm vào giỏ */}
                                <button
                                    className={`pd-actions__add-btn ${added ? "pd-actions__add-btn--success" : ""}`}
                                    onClick={onAddToCart}
                                    disabled={adding}
                                >
                                    {adding ? (
                                        "Đang thêm..."
                                    ) : added ? (
                                        <><IconCheck /> Đã thêm vào giỏ</>
                                    ) : (
                                        <><IconCart /> Thêm Vào Giỏ Hàng</>
                                    )}
                                </button>

                                {/* Link xem giỏ hàng (hiện sau khi thêm thành công) */}
                                {added && (
                                    <Link to={ROUTES.CART} className="pd-actions__view-cart">
                                        Xem giỏ hàng →
                                    </Link>
                                )}

                                {/* Lỗi khi thêm */}
                                {addError && (
                                    <p className="pd-actions__error">{addError}</p>
                                )}
                            </div>
                        )}

                        {/* Hết hàng — disable */}
                        {outOfStock && (
                            <div className="pd-actions">
                                <button className="pd-actions__add-btn pd-actions__add-btn--disabled" disabled>
                                    Hết hàng
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

