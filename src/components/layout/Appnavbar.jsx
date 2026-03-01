import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AppNavbar.css";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants/routes";

/* ── Icons ── */
const IconUser = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const IconLogout = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
const IconEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const IconShop = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>;
const IconChevron = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>;
const IconLock = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
const IconDashboard = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

/* ── Nav items config ── */
const NAV_ITEMS = [
  { label: "Trang Chủ", to: ROUTES.HOME },
  { label: "Mặt Hàng", to: ROUTES.PRODUCTS },
  { label: "Về Chúng Tôi", to: ROUTES.ABOUT },
  { label: "Liên Hệ", to: ROUTES.CONTACT },
];

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  /* Đổi shadow khi scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Đóng dropdown khi click ngoài */
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Lấy chữ cái đầu username làm avatar */
  const avatarChar = user?.username?.[0]?.toUpperCase() || "U";

  const handleLogout = async () => {
    await logout();
    setDropOpen(false);
    navigate(ROUTES.LOGIN);
  };

  return (
    <nav className={`appnav ${scrolled ? "appnav--scrolled" : ""}`}>
      <div className="container appnav__inner">

        {/* Logo */}
        <Link to={ROUTES.HOME} className="appnav__logo">
          <div className="appnav__logo-icon">
            <IconShop />
          </div>
          <span className="appnav__logo-text">NexusApp</span>
        </Link>

        {/* Nav links */}
        <div className="appnav__links">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`appnav__link ${location.pathname === item.to ? "appnav__link--active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Auth section */}
        <div className="appnav__auth">
          {!user ? (
            /* Chưa login — hiện 2 nút */
            <>
              <Link to={ROUTES.LOGIN} className="appnav__btn-login">
                Đăng Nhập
              </Link>
              <Link to={ROUTES.REGISTER} className="appnav__btn-register">
                Đăng Ký
              </Link>
            </>
          ) : (
            /* Đã login — hiện user menu */
            <div className="appnav__user" ref={dropRef}>
              <button
                className="appnav__user-btn"
                onClick={() => setDropOpen((v) => !v)}
                aria-expanded={dropOpen}
              >
                <div className="appnav__avatar">{avatarChar}</div>
                <span className="appnav__user-name">{user.username}</span>
                <span className={`appnav__chevron ${dropOpen ? "appnav__chevron--open" : ""}`}>
                  <IconChevron />
                </span>
              </button>

              {dropOpen && (
                <div className="appnav__dropdown">
                  {/* Header */}
                  <div className="appnav__dropdown-header">
                    <div className="appnav__dropdown-name">{user.username}</div>
                    <div className="appnav__dropdown-role">
                      {user.role === "ADMIN" ? "Quản trị viên" : "Thành viên"}
                    </div>
                  </div>

                  {user.role === "USER" && (
      <>
                  {/* Xem hồ sơ */}
                  <Link
                    to={ROUTES.PROFILE}
                    className="appnav__dropdown-item"
                    onClick={() => setDropOpen(false)}
                  >
                    <IconUser /> Hồ Sơ Của Tôi
                  </Link>

                  {/* Chỉnh sửa hồ sơ */}
                  <Link
                    to={ROUTES.EDITPROFILE}
                    className="appnav__dropdown-item"
                    onClick={() => setDropOpen(false)}
                  >
                    <IconEdit /> Chỉnh Sửa Hồ Sơ
                  </Link>

                  {/* Đổi mật khẩu */}
                  <Link
                    to={ROUTES.CHANGE_PASSWORD}
                    className="appnav__dropdown-item"
                    onClick={() => setDropOpen(false)}
                  >
                    <IconLock /> Đổi Mật Khẩu
                  </Link>

                  <div className="appnav__dropdown-divider" />

                  </>)}

                  {/* ── Nếu là ADMIN → hiện nút Dashboard ── */}
                  {user.role === "ADMIN" && (
                    <>
                      <Link to={ROUTES.DASHBOARD} className="appnav__dropdown-item"
                        onClick={() => setDropOpen(false)}>
                        <IconDashboard /> Trang Quản Trị
                      </Link>
                      <div className="appnav__dropdown-divider" />
                    </>
                  )}

                  {/* Đăng xuất */}
                  <button
                    className="appnav__dropdown-item appnav__dropdown-item--danger"
                    onClick={handleLogout}
                  >
                    <IconLogout /> Đăng Xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hamburger mobile */}
        <button className="appnav__hamburger" aria-label="Menu">
          <span /><span /><span />
        </button>

      </div>
    </nav>
  );
}