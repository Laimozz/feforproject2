import { Link } from "react-router-dom";
import "./Home.css";
import AppNavbar from "../../components/layout/AppNavbar";
import { ROUTES } from "../../constants/routes";

const FEATURES = [
  { icon: "🛍️", bg: "#eef2ff", title: "Hàng Ngàn Sản Phẩm",   desc: "Khám phá kho hàng đa dạng với hàng ngàn mặt hàng chất lượng cao từ các thương hiệu uy tín trong và ngoài nước." },
  { icon: "🚀", bg: "#fdf4ff", title: "Giao Hàng Nhanh",       desc: "Cam kết giao hàng trong 24h nội thành. Theo dõi đơn hàng realtime mọi lúc mọi nơi." },
  { icon: "🔒", bg: "#f0fdf4", title: "Thanh Toán An Toàn",    desc: "Hệ thống bảo mật chuẩn PCI DSS. Hỗ trợ thẻ, ví điện tử, COD." },
  { icon: "💎", bg: "#fff7ed", title: "Hàng Chính Hãng",       desc: "100% sản phẩm có nguồn gốc rõ ràng. Hoàn tiền nếu phát hiện hàng giả." },
  { icon: "🎯", bg: "#fef2f2", title: "Ưu Đãi Độc Quyền",      desc: "Thành viên nhận voucher, flash sale hàng ngày. Tích điểm đổi quà hấp dẫn." },
  { icon: "🤝", bg: "#f0f9ff", title: "Hỗ Trợ 24/7",           desc: "Đội ngũ tư vấn nhiệt tình, sẵn sàng hỗ trợ qua chat, hotline hoặc email." },
];

const STATS = [
  { number: "50K+", label: "Khách Hàng Tin Dùng" },
  { number: "10K+", label: "Sản Phẩm" },
  { number: "99%",  label: "Hài Lòng" },
  { number: "24/7", label: "Hỗ Trợ" },
];

export default function Home() {
  return (
    <div className="home">
      <AppNavbar />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__bg" />
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />

        <div className="hero__inner">
          {/* Trái */}
          <div className="hero__content">
            <div className="hero__badge">
              <span className="hero__badge-dot" />
              Nền tảng mua sắm #1 Việt Nam
            </div>

            <h1 className="hero__title">
              Mua Sắm Thông Minh,{" "}
              <span className="hero__title-highlight">Sống Đẳng Cấp</span>
            </h1>

            <p className="hero__desc">
              Khám phá hàng ngàn sản phẩm chất lượng cao với giá tốt nhất.
              Giao hàng nhanh, đổi trả dễ dàng, thanh toán an toàn.
            </p>

            <div className="hero__actions">
              <Link to={ROUTES.PRODUCTS} className="hero__btn-primary">
                Mua Sắm Ngay →
              </Link>
              <Link to="/about" className="hero__btn-secondary">
                Tìm Hiểu Thêm
              </Link>
            </div>
          </div>

          {/* Phải — card nổi */}
          <div className="hero__visual">
            <div className="hero__card-stack">
              <div className="hero__float-card hero__float-card--main">
                <div className="hero__card-img">🎧</div>
                <div className="hero__card-name">Tai Nghe Premium</div>
                <div>
                  <span className="hero__card-price">1.299.000₫</span>
                  <span className="hero__card-price-sub">1.999.000₫</span>
                </div>
              </div>
              <div className="hero__float-card hero__float-card--sm1">
                <div className="hero__card-img-sm">👟</div>
                <div className="hero__card-name-sm">Giày Thể Thao</div>
              </div>
              <div className="hero__float-card hero__float-card--sm2">
                <div className="hero__card-img-sm">⌚</div>
                <div className="hero__card-name-sm">Đồng Hồ Thông Minh</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats">
        <div className="stats__inner">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="stats__number">{s.number}</div>
              <div className="stats__label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features">
        <div style={{ textAlign: "center", padding: "0 24px" }}>
          <div className="features__head">
            <div className="features__tag">✦ Tại Sao Chọn Chúng Tôi</div>
            <h2 className="features__title">Trải Nghiệm Mua Sắm Vượt Trội</h2>
            <p className="features__desc">
              Chúng tôi không chỉ bán hàng — chúng tôi mang đến trải nghiệm
              mua sắm tốt nhất cho bạn.
            </p>
          </div>
        </div>

        <div className="features__grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-card__icon" style={{ background: f.bg }}>
                {f.icon}
              </div>
              <div className="feature-card__title">{f.title}</div>
              <p className="feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta">
        <div className="cta__inner">
          <div className="cta__box">
            <h2 className="cta__title">Sẵn Sàng Khám Phá?</h2>
            <p className="cta__desc">
              Đăng ký ngay để nhận ưu đãi 20% cho đơn hàng đầu tiên
              và hàng nghìn voucher độc quyền.
            </p>
            <Link to={ROUTES.REGISTER} className="cta__btn">
              Đăng Ký Miễn Phí →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="home-footer">
        <div className="home-footer__inner">
          <div className="home-footer__grid">
            <div>
              <div className="home-footer__brand-name">NexusApp</div>
              <p className="home-footer__brand-desc">
                Nền tảng thương mại điện tử hàng đầu, kết nối người mua
                và người bán trên toàn quốc.
              </p>
            </div>
            <div>
              <div className="home-footer__col-title">Khám Phá</div>
              <Link to={ROUTES.PRODUCTS} className="home-footer__link">Mặt Hàng</Link>
              <Link to="/about"          className="home-footer__link">Về Chúng Tôi</Link>
              <Link to="/contact"        className="home-footer__link">Liên Hệ</Link>
            </div>
            <div>
              <div className="home-footer__col-title">Tài Khoản</div>
              <Link to={ROUTES.LOGIN}    className="home-footer__link">Đăng Nhập</Link>
              <Link to={ROUTES.REGISTER} className="home-footer__link">Đăng Ký</Link>
              <Link to={ROUTES.PROFILE}  className="home-footer__link">Hồ Sơ</Link>
            </div>
            <div>
              <div className="home-footer__col-title">Hỗ Trợ</div>
              <a href="mailto:support@nexusapp.vn" className="home-footer__link">Email</a>
              <a href="tel:19001234"               className="home-footer__link">Hotline</a>
              <Link to="/faq"                      className="home-footer__link">FAQ</Link>
            </div>
          </div>
          <div className="home-footer__bottom">
            © 2024 NexusApp. Bảo lưu mọi quyền.
          </div>
        </div>
      </footer>
    </div>
  );
}