import { Routes, Route } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import GuestRoute from "./GuestRouter";
import ProtectedRoute from "./ProtectedRouter";

import Home from "../pages/home/Home";
import Register from "../pages/auth/Register/Register";
import Login from "../pages/auth/Login/Login";
import About from "../pages/about/About";
import Contact from "../pages/contact/Contact";
import Profile from "../pages/profile/Profile";
import EditProfile from "../pages/profile/EditProfile";

import ChangePassword from "../pages/change-password/ChangePassword";
import AdminDashboard from "../pages/admin/AdminDashboard";

import AppNavbar from "../components/layout/Appnavbar";

/* ── Placeholder — trang chưa xây dựng ── */
const PlaceholderPage = ({ title }) => (
  <div>
    <AppNavbar />
    <div style={{
      minHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      gap: 16,
    }}>
      <div style={{
        width: 64, height: 64,
        background: "#eef2ff",
        borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.75rem",
      }}>🚧</div>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
        {title}
      </h1>
      <p style={{ color: "#475569", margin: 0 }}>
        Trang này đang được xây dựng, vui lòng quay lại sau.
      </p>
      <a href="/" style={{
        marginTop: 8,
        padding: "10px 28px",
        background: "#3730a3",
        color: "#fff",
        borderRadius: 999,
        fontWeight: 600,
        fontSize: "0.875rem",
        textDecoration: "none",
      }}>
        ← Về Trang Chủ
      </a>
    </div>
  </div>
);

const NotFound = () => <PlaceholderPage title="404 — Không Tìm Thấy Trang" />;

export default function AppRouter() {
  return (
    <Routes>

      {/* ── Public — ai cũng vào được ── */}
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.PRODUCTS} element={<PlaceholderPage title="Mặt Hàng" />} />
      <Route path={ROUTES.ABOUT} element={<About title="Về Chúng Tôi" />} />
      <Route path={ROUTES.CONTACT} element={<Contact title="Liên Hệ" />} />

      {/* ── Guest only — chỉ cho vào nếu CHƯA login ── */}
      <Route path={ROUTES.LOGIN}
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route path={ROUTES.REGISTER}
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />

      {/* ── Protected — chỉ cho vào nếu ĐÃ login ── */}
      <Route path={ROUTES.PROFILE}
        element={
          <ProtectedRoute requiredRole="USER">
            <Profile title="Hồ Sơ Của Tôi" />
          </ProtectedRoute>
        }
      />
      <Route path={ROUTES.EDITPROFILE}
        element={
          <ProtectedRoute requiredRole="USER">
            <EditProfile title="Chỉnh Sửa Hồ Sơ" />
          </ProtectedRoute>
        }
      />
      <Route path={ROUTES.CHANGE_PASSWORD}
        element={
          <ProtectedRoute requiredRole="USER">
            <ChangePassword />
          </ProtectedRoute>
        }
      />


      <Route path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ── 404 ── */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}