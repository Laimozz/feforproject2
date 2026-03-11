// =========================================================
// CategoryDetail.jsx
// Trang chi tiết 1 danh mục:
//   - Lấy categoryId từ URL params (:id)
//   - Hiển thị tên + mô tả danh mục
//   - Hiển thị grid sản phẩm của danh mục đó (có phân trang)
// =========================================================

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./CategoryDetail.css";
import AppNavbar from "../../components/layout/AppNavbar";
import { getCategoryById } from "../../api/categoryApi";
import { ROUTES } from "../../constants/routes";
import useProductsByCategory from "../../hooks/useProductsByCategory";

/* ── Icon SVG: mũi tên trái / phải cho phân trang ── */
const IconPrev = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const IconNext = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/* ── Định dạng tiền Việt ── */
const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

export default function CategoryDetail() {
  const { id } = useParams(); // lấy categoryId từ URL /categories/:id

  /* ── State thông tin danh mục ── */
  const [category, setCategory] = useState(null);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [categoryError, setCategoryError] = useState("");

  /* ── Hook load sản phẩm theo category ── */
  const {
    products, totalPages, totalItems, page,
    loading: loadingProducts, error: productError,
    setPage,
  } = useProductsByCategory(id);

  /* Load thông tin category khi id thay đổi */
  useEffect(() => {
    const fetchCategory = async () => {
      setLoadingCategory(true);
      setCategoryError("");
      try {
        const { data } = await getCategoryById(id);
        setCategory(data);
      } catch {
        setCategoryError("Không tìm thấy danh mục này.");
      } finally {
        setLoadingCategory(false);
      }
    };
    if (id) fetchCategory();
  }, [id]);

  return (
    <div className="cat-detail">
      <AppNavbar />

      {/* ══════════════════════════════════════════════
          HERO — tên danh mục + breadcrumb
      ══════════════════════════════════════════════ */}
      <section className="cat-detail__hero">
        <div className="container">
          {/* Breadcrumb: ← Tất Cả Danh Mục */}
          <Link to={ROUTES.CATEGORIES} className="cat-detail__back">
            ← Tất Cả Danh Mục
          </Link>

          {loadingCategory ? (
            <div className="cat-detail__hero-loading">Đang tải...</div>
          ) : categoryError ? (
            <h1 className="cat-detail__title" style={{ color: "#ef4444" }}>
              {categoryError}
            </h1>
          ) : (
            <>
              {/* Tên danh mục */}
              <h1 className="cat-detail__title">{category?.name}</h1>
              {/* Mô tả danh mục (nếu có) */}
              {category?.description && (
                <p className="cat-detail__desc">{category.description}</p>
              )}
              {/* Số lượng sản phẩm — hiển thị khi đã load xong */}
              {!loadingProducts && (
                <div className="cat-detail__count">
                  {totalItems} sản phẩm
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PRODUCT GRID — danh sách sản phẩm
      ══════════════════════════════════════════════ */}
      <section className="cat-detail__main">
        <div className="container">

          {/* ── Trạng thái loading ── */}
          {loadingProducts && (
            <div className="cat-detail__state">
              <div className="cat-detail__state-icon">⏳</div>
              <p>Đang tải sản phẩm...</p>
            </div>
          )}

          {/* ── Lỗi khi load sản phẩm ── */}
          {!loadingProducts && productError && (
            <div className="cat-detail__state">
              <div className="cat-detail__state-icon">❌</div>
              <p style={{ color: "#ef4444" }}>{productError}</p>
            </div>
          )}

          {/* ── Không có sản phẩm ── */}
          {!loadingProducts && !productError && products.length === 0 && (
            <div className="cat-detail__state">
              <div className="cat-detail__state-icon">📦</div>
              <p>Danh mục này chưa có sản phẩm nào.</p>
              <Link to={ROUTES.CATEGORIES} className="cat-detail__back-btn">
                ← Xem danh mục khác
              </Link>
            </div>
          )}

          {/* ── Grid sản phẩm ── */}
          {!loadingProducts && !productError && products.length > 0 && (
            <>
              {/* Grid card */}
              <div className="product-grid">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="product-card"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {/* Ảnh sản phẩm */}
                    <div className="product-card__img-wrap">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="product-card__img"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="product-card__img-placeholder"
                        style={{ display: product.imageUrl ? "none" : "flex" }}
                      >
                        📦
                      </div>
                    </div>
                    {/* Nội dung card */}
                    <div className="product-card__body">
                      <h3 className="product-card__name">{product.name}</h3>
                      {product.description && (
                        <p className="product-card__desc">{product.description}</p>
                      )}
                      <div className="product-card__footer">
                        <span className="product-card__price">
                          {formatPrice(product.price)}
                        </span>
                        <span
                          className="product-card__stock"
                          style={{
                            color: product.stock === 0
                              ? "#ef4444"
                              : product.stock <= 5
                                ? "#f59e0b"
                                : "#22c55e",
                          }}
                        >
                          {product.stock === 0
                            ? "Hết hàng"
                            : product.stock <= 5
                              ? `Còn ${product.stock}`
                              : "Còn hàng"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* ── Phân trang — chỉ hiện khi có > 1 trang ── */}
              {totalPages > 1 && (
                <div className="cat-detail__pagination">
                  {/* Nút Previous */}
                  <button
                    className="cat-detail__page-btn"
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page === 0}
                  >
                    <IconPrev />
                  </button>

                  {/* Các số trang */}
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      className={`cat-detail__page-btn ${i === page ? "cat-detail__page-btn--active" : ""
                        }`}
                      onClick={() => setPage(i)}
                    >
                      {i + 1}
                    </button>
                  ))}

                  {/* Nút Next */}
                  <button
                    className="cat-detail__page-btn"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page === totalPages - 1}
                  >
                    <IconNext />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: "#f8f9fc",
        borderTop: "1px solid #e2e8f0",
        padding: "20px 0",
        textAlign: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <p style={{ color: "#94a3b8", fontSize: "0.8rem", margin: 0 }}>
          © 2024 NexusApp. Bảo lưu mọi quyền.
        </p>
      </footer>
    </div>
  );
}
