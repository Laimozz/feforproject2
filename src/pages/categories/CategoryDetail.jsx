import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./CategoryDetail.css";
import AppNavbar from "../../components/layout/AppNavbar";
import { getCategoryById } from "../../api/categoryApi";
import { ROUTES } from "../../constants/routes";

export default function CategoryDetail() {
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getCategoryById(id);
        setCategory(data);
      } catch {
        setError("Không tìm thấy danh mục này.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]); // chạy lại khi id trên URL thay đổi

  return (
    <div className="cat-detail">
      <AppNavbar />

      {/* ── Header gọn — không màu ── */}
      <section className="cat-detail__hero">
        <div className="container">
          <Link to={ROUTES.CATEGORIES} className="cat-detail__back">
            ← Tất Cả Danh Mục
          </Link>
          {!loading && !error && (
            <h1 className="cat-detail__title">{category?.name}</h1>
          )}
        </div>
      </section>

      {/* ── Danh sách sản phẩm ── */}
      {!loading && !error && (
        <section className="cat-detail__main">
          <div className="container">
            {/* Placeholder — chờ API product
                Sau khi có API: thay block này bằng grid product */}
            <div className="cat-detail__placeholder">
              <div className="cat-detail__placeholder-icon">🚧</div>
              <div className="cat-detail__placeholder-title">
                Sản Phẩm Đang Được Cập Nhật
              </div>
              <p className="cat-detail__placeholder-desc">
                Danh sách sản phẩm sẽ hiển thị tại đây sau khi API product được tích hợp.
              </p>
            </div>
          </div>
        </section>
      )}

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