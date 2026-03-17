import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CategoriesPage.css";
import AppNavbar from "../../components/layout/Appnavbar";
import { getCategories } from "../../api/categoryApi";

/* Màu nền và icon cho từng card — xoay vòng theo index */
const CARD_THEMES = [
  { bg: "linear-gradient(135deg, #eef2ff, #e0e7ff)", icon: "🛍️" },
  { bg: "linear-gradient(135deg, #f0fdf4, #dcfce7)", icon: "📱" },
  { bg: "linear-gradient(135deg, #fdf4ff, #f3e8ff)", icon: "💻" },
  { bg: "linear-gradient(135deg, #fff7ed, #fed7aa)", icon: "👗" },
  { bg: "linear-gradient(135deg, #f0f9ff, #bae6fd)", icon: "🏠" },
  { bg: "linear-gradient(135deg, #fef2f2, #fecaca)", icon: "⚡" },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Lỗi load categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="categories-page">
      <AppNavbar />

      {/* ── Hero ── */}
      <section className="categories-hero">
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="categories-hero__tag">🗂️ Danh Mục</div>
          <h1 className="categories-hero__title">Khám Phá Theo Danh Mục</h1>
          <p className="categories-hero__desc">
            Tìm kiếm sản phẩm dễ dàng hơn qua các danh mục được phân loại rõ ràng.
          </p>
        </div>
      </section>

      {/* ── Danh sách ── */}
      <section className="categories-main">
        <div className="container">

          <div className="categories-toolbar">
            <div className="categories-toolbar__title">Tất Cả Danh Mục</div>
            {!loading && (
              <div className="categories-toolbar__count">
                {categories.length} danh mục
              </div>
            )}
          </div>

          {loading ? (
            <div className="categories-loading">⏳ Đang tải danh mục...</div>
          ) : categories.length === 0 ? (
            <div className="categories-empty">
              <div className="categories-empty__icon">🗂️</div>
              Chưa có danh mục nào
            </div>
          ) : (
            <div className="categories-grid">
              {categories.map((cat, index) => {
                const theme = CARD_THEMES[index % CARD_THEMES.length];
                return (
                  // Link đến trang chi tiết category
                  <Link
                    key={cat.id}
                    to={`/categories/${cat.id}`}
                    className="cat-card"
                  >
                    {/* Header màu nền + icon */}
                    <div className="cat-card__header" style={{ background: theme.bg }}>
                      <span>{theme.icon}</span>
                    </div>

                    {/* Nội dung */}
                    <div className="cat-card__body">
                      <div className="cat-card__name">{cat.name}</div>
                      <p className="cat-card__desc">
                        {cat.description || "Khám phá các sản phẩm trong danh mục này."}
                      </p>
                      <div className="cat-card__footer">
                        <span className="cat-card__id">#{cat.id}</span>
                        <span className="cat-card__btn">Xem Sản Phẩm →</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: "#0f172a", padding: "28px 0",
        textAlign: "center", fontFamily: "'DM Sans', sans-serif",
      }}>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>
          © 2024 NexusApp. Bảo lưu mọi quyền.
        </p>
      </footer>
    </div>
  );
}