import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { ROUTES } from "../constants/routes";

/**
 * ProtectedRoute — chỉ cho vào nếu ĐÃ login
 * Nếu chưa login → tự redirect về /login
 * Dùng cho: /profile, /cart, /orders
 */

export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();

  // Chưa login → về trang login
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;

  // Có yêu cầu role cụ thể → kiểm tra
  if (requiredRole) {
    // Chuẩn hóa role: "ROLE_USER" → "USER", "USER" → "USER"
    const userRole = user.role?.replace("ROLE_", "");
    if (userRole !== requiredRole) {
      // Sai role → về trang chủ
      return <Navigate to={ROUTES.HOME} replace />;
    }
  }

  return children;
}





// export default function ProtectedRoute({ children }) {
//   const { user } = useAuth();

//   if (!user) {
//     return <Navigate to={ROUTES.LOGIN} replace />;
//   }

//   return children;
// }