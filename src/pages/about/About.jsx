import "./About.css";
import AppNavbar from "../../components/layout/Appnavbar";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

/* ── Data ── */
const STATS = [
  { icon: "🛍️", number: "50K+",  label: "Khách Hàng" },
  { icon: "📦", number: "10K+",  label: "Sản Phẩm" },
  { icon: "🚀", number: "24h",   label: "Giao Hàng" },
  { icon: "⭐", number: "4.9/5", label: "Đánh Giá" },
];

const VALUES = [
  {
    icon: "🤝", bg: "#eef2ff",
    title: "Tận Tâm Với Khách Hàng",
    desc: "Mọi quyết định đều xuất phát từ lợi ích của khách hàng. Chúng tôi lắng nghe, thấu hiểu và nỗ lực mang đến trải nghiệm mua sắm tốt nhất.",
  },
  {
    icon: "💎", bg: "#fdf4ff",
    title: "Chất Lượng Không Thỏa Hiệp",
    desc: "100% sản phẩm được kiểm định chất lượng nghiêm ngặt trước khi đến tay khách hàng. Hàng chính hãng, nguồn gốc rõ ràng.",
  },
  {
    icon: "🔒", bg: "#f0fdf4",
    title: "Minh Bạch & Tin Cậy",
    desc: "Giá cả rõ ràng, chính sách đổi trả minh bạch. Chúng tôi xây dựng niềm tin bằng sự trung thực trong từng giao dịch.",
  },
  {
    icon: "🚀", bg: "#fff7ed",
    title: "Đổi Mới Liên Tục",
    desc: "Không ngừng cải tiến công nghệ và trải nghiệm người dùng. Chúng tôi ứng dụng công nghệ hiện đại để mua sắm trở nên dễ dàng hơn.",
  },
  {
    icon: "🌱", bg: "#f0f9ff",
    title: "Phát Triển Bền Vững",
    desc: "Cam kết hoạt động có trách nhiệm với cộng đồng và môi trường. Mỗi đơn hàng góp phần vào chương trình trồng cây xanh quốc gia.",
  },
  {
    icon: "⚡", bg: "#fef2f2",
    title: "Nhanh Chóng & Hiệu Quả",
    desc: "Từ đặt hàng đến giao hàng, mọi bước đều được tối ưu để tiết kiệm thời gian quý báu của bạn.",
  },
];

const TEAM = [
  {
    name: "Nguyễn Minh Tuấn",
    role: "CEO & Co-founder",
    desc: "10+ năm kinh nghiệm thương mại điện tử. Cựu giám đốc vận hành tại Lazada Việt Nam.",
    bg: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    initials: "MT",
  },
  {
    name: "Trần Thị Lan Anh",
    role: "CTO & Co-founder",
    desc: "Kỹ sư phần mềm với 8 năm kinh nghiệm. Tốt nghiệp Đại học Bách Khoa TP.HCM.",
    bg: "linear-gradient(135deg, #ec4899, #f43f5e)",
    initials: "LA",
  },
  {
    name: "Lê Hoàng Phúc",
    role: "Head of Product",
    desc: "Chuyên gia UX/UI với niềm đam mê tạo ra những sản phẩm người dùng yêu thích.",
    bg: "linear-gradient(135deg, #f59e0b, #ef4444)",
    initials: "HP",
  },
  {
    name: "Phạm Quỳnh Như",
    role: "Head of Operations",
    desc: "Quản lý chuỗi cung ứng và logistics với tư duy dữ liệu, đảm bảo mọi đơn hàng đúng hẹn.",
    bg: "linear-gradient(135deg, #10b981, #3b82f6)",
    initials: "QN",
  },
];

export default function About() {
  return (
    <div className="about">
      <AppNavbar />

      {/* ── HERO ── */}
      <section className="about-hero">
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="about-hero__tag">✦ Câu Chuyện Của Chúng Tôi</div>
          <h1 className="about-hero__title">
            Chúng Tôi Tin Rằng Mua Sắm<br />Phải Là Niềm Vui
          </h1>
          <p className="about-hero__desc">
            NexusApp ra đời từ một ước mơ đơn giản — mang đến cho mọi người
            Việt Nam trải nghiệm mua sắm trực tuyến thông minh, tin cậy
            và thú vị nhất.
          </p>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="about-mission">
        <div className="container">
          <div className="about-mission__inner">

            {/* Nội dung trái */}
            <div>
              <div className="about-mission__tag">🎯 Sứ Mệnh</div>
              <h2 className="about-mission__title">
                Kết Nối Người Mua & Người Bán Trên Toàn Quốc
              </h2>
              <p className="about-mission__text">
                Được thành lập năm 2021 tại TP. Hồ Chí Minh, NexusApp bắt đầu
                với đội ngũ 5 người và một niềm tin mãnh liệt: thương mại điện tử
                Việt Nam xứng đáng có một nền tảng đẳng cấp thế giới.
              </p>
              <p className="about-mission__text">
                Sau 3 năm không ngừng phát triển, chúng tôi tự hào phục vụ hơn
                50.000 khách hàng trên cả nước với hơn 10.000 sản phẩm từ hàng
                trăm thương hiệu uy tín.
              </p>
              <p className="about-mission__text">
                Sứ mệnh của chúng tôi là xây dựng hệ sinh thái thương mại điện tử
                bền vững, nơi mọi giao dịch đều dựa trên sự tin tưởng và minh bạch.
              </p>
            </div>

            {/* Cards số liệu phải */}
            <div className="about-mission__visual">
              {STATS.map((s) => (
                <div key={s.label} className="about-mission__card">
                  <div className="about-mission__card-icon">{s.icon}</div>
                  <div className="about-mission__card-number">{s.number}</div>
                  <div className="about-mission__card-label">{s.label}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="about-values">
        <div className="container">
          <div className="about-values__head">
            <div className="about-values__tag">💡 Giá Trị Cốt Lõi</div>
            <h2 className="about-values__title">Những Gì Chúng Tôi Tin Tưởng</h2>
            <p className="about-values__desc">
              6 giá trị cốt lõi định hướng mọi quyết định và hành động
              của đội ngũ NexusApp mỗi ngày.
            </p>
          </div>

          <div className="about-values__grid">
            {VALUES.map((v) => (
              <div key={v.title} className="value-card">
                <div className="value-card__icon" style={{ background: v.bg }}>
                  {v.icon}
                </div>
                <div className="value-card__title">{v.title}</div>
                <p className="value-card__desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="about-team">
        <div className="container">
          <div className="about-team__head">
            <div className="about-team__tag">👥 Đội Ngũ</div>
            <h2 className="about-team__title">Những Con Người Đằng Sau NexusApp</h2>
            <p className="about-team__desc">
              Đội ngũ sáng lập giàu kinh nghiệm, đam mê và cam kết
              xây dựng nền tảng tốt nhất cho bạn.
            </p>
          </div>

          <div className="about-team__grid">
            {TEAM.map((m) => (
              <div key={m.name} className="team-card">
                <div className="team-card__avatar" style={{ background: m.bg }}>
                  {m.initials}
                </div>
                <div className="team-card__name">{m.name}</div>
                <div className="team-card__role">{m.role}</div>
                <p className="team-card__desc">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "#f8f9fc", padding: "80px 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
            fontWeight: 900, color: "#0f172a", marginBottom: 16,
          }}>
            Sẵn Sàng Trải Nghiệm?
          </h2>
          <p style={{ color: "#475569", fontSize: "1rem", marginBottom: 36, lineHeight: 1.7 }}>
            Tham gia cùng 50.000+ khách hàng đang tin dùng NexusApp mỗi ngày.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to={ROUTES.REGISTER} style={{
              padding: "13px 32px", background: "#3730a3", color: "#fff",
              borderRadius: 9999, fontWeight: 700, fontSize: "0.95rem",
              textDecoration: "none",
            }}>
              Đăng Ký Ngay →
            </Link>
            <Link to={ROUTES.CONTACT} style={{
              padding: "13px 28px", color: "#3730a3",
              border: "2px solid #3730a3", borderRadius: 9999,
              fontWeight: 600, fontSize: "0.95rem", textDecoration: "none",
            }}>
              Liên Hệ Chúng Tôi
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: "#0f172a", padding: "28px 0", textAlign: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>
          © 2024 NexusApp. Bảo lưu mọi quyền.
        </p>
      </footer>
    </div>
  );
}