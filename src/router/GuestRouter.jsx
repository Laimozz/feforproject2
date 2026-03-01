import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../constants/routes";

/**
 * GuestRoute — chỉ cho vào nếu CHƯA login
 * Nếu đã login → tự redirect về trang chủ
 * Dùng cho: /login, /register
 */
export default function GuestRoute({ children }) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
}