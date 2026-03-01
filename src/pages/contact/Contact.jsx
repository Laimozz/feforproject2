import "./Contact.css";
import AppNavbar from "../../components/layout/AppNavbar";

const SOCIALS = [
  {
    name: "Facebook",
    handle: "@NexusApp.vn",
    desc: "Cập nhật tin tức, ưu đãi và sản phẩm mới mỗi ngày.",
    icon: "📘",
    bg: "linear-gradient(135deg, #1877f2, #0a5dc2)",
    followers: "120K",
    label: "Followers",
    url: "https://facebook.com/nexusapp",
    btn: "Theo Dõi Ngay",
  },
  {
    name: "YouTube",
    handle: "@NexusApp",
    desc: "Review sản phẩm, hướng dẫn mua sắm và video unboxing hấp dẫn.",
    icon: "▶️",
    bg: "linear-gradient(135deg, #ff0000, #cc0000)",
    followers: "45K",
    label: "Subscribers",
    url: "https://youtube.com/@nexusapp",
    btn: "Đăng Ký Kênh",
  },
  {
    name: "Instagram",
    handle: "@nexusapp.vn",
    desc: "Hình ảnh sản phẩm đẹp mắt, lookbook và lifestyle mua sắm.",
    icon: "📸",
    bg: "linear-gradient(135deg, #f58529, #dd2a7b, #8134af)",
    followers: "87K",
    label: "Followers",
    url: "https://instagram.com/nexusapp.vn",
    btn: "Follow",
  },
  {
    name: "TikTok",
    handle: "@nexusapp.vn",
    desc: "Video ngắn vui nhộn, xu hướng mua sắm và deal hot mỗi ngày.",
    icon: "🎵",
    bg: "linear-gradient(135deg, #010101, #69c9d0)",
    followers: "210K",
    label: "Followers",
    url: "https://tiktok.com/@nexusapp.vn",
    btn: "Follow",
  },
  {
    name: "Zalo",
    handle: "NexusApp Official",
    desc: "Hỗ trợ trực tiếp, tư vấn sản phẩm và nhận thông báo đơn hàng.",
    icon: "💬",
    bg: "linear-gradient(135deg, #0068ff, #0052cc)",
    followers: "35K",
    label: "Người theo dõi",
    url: "https://zalo.me/nexusapp",
    btn: "Quan Tâm",
  },
  {
    name: "Threads",
    handle: "@nexusapp.vn",
    desc: "Thảo luận, chia sẻ trải nghiệm mua sắm và kết nối cộng đồng.",
    icon: "🧵",
    bg: "linear-gradient(135deg, #101010, #444)",
    followers: "18K",
    label: "Followers",
    url: "https://threads.net/@nexusapp.vn",
    btn: "Follow",
  },
];

const COMMUNITY = [
  { icon: "🎁", title: "Ưu Đãi Độc Quyền",     desc: "Thành viên follow nhận voucher riêng không bán ở đâu" },
  { icon: "⚡", title: "Flash Sale Sớm Nhất",   desc: "Thông báo deal hot trước 30 phút so với website" },
  { icon: "🏆", title: "Giveaway Hàng Tuần",    desc: "Quay số tặng quà cho followers trung thành mỗi tuần" },
  { icon: "📣", title: "Tin Tức Nóng Hổi",      desc: "Ra mắt sản phẩm mới, xu hướng và review chân thật" },
];

export default function Contact() {
  return (
    <div className="contact">
      <AppNavbar />

      {/* ── HERO ── */}
      <section className="contact-hero">
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="contact-hero__tag">🌐 Kết Nối Với Chúng Tôi</div>
          <h1 className="contact-hero__title">
            Theo Dõi NexusApp<br />Trên Mạng Xã Hội
          </h1>
          <p className="contact-hero__desc">
            Đừng bỏ lỡ deal hot, sản phẩm mới và ưu đãi độc quyền.
            Follow chúng tôi trên các nền tảng yêu thích của bạn!
          </p>
        </div>
      </section>

      {/* ── SOCIAL GRID ── */}
      <section className="contact-socials">
        <div className="container">
          <div className="contact-socials__grid">
            {SOCIALS.map((s) => (
              <div key={s.name} className="social-card">
                {/* Header màu nền */}
                <div className="social-card__header" style={{ background: s.bg }}>
                  <div className="social-card__icon">{s.icon}</div>
                  <div className="social-card__followers">
                    <span className="social-card__followers-num">{s.followers}</span>
                    <span className="social-card__followers-label">{s.label}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="social-card__body">
                  <div className="social-card__name">{s.name}</div>
                  <div className="social-card__handle">{s.handle}</div>
                  <p className="social-card__desc">{s.desc}</p>

                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-card__btn"
                    style={{ background: s.bg }}
                  >
                    {s.btn} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VÌ SAO NÊN FOLLOW ── */}
      <section className="contact-why">
        <div className="container">
          <div className="contact-why__head">
            <div className="contact-why__tag">🎯 Lợi Ích Khi Follow</div>
            <h2 className="contact-why__title">Tại Sao Nên Theo Dõi Chúng Tôi?</h2>
            <p className="contact-why__desc">
              Hơn 500.000 người đã theo dõi NexusApp trên các nền tảng.
              Đây là lý do họ không muốn bỏ lỡ.
            </p>
          </div>

          <div className="contact-why__grid">
            {COMMUNITY.map((c) => (
              <div key={c.title} className="why-card">
                <div className="why-card__icon">{c.icon}</div>
                <div className="why-card__title">{c.title}</div>
                <p className="why-card__desc">{c.desc}</p>
              </div>
            ))}
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