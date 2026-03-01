import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, ENDPOINTS } from "../constants/api";
import { logout as logoutApi } from "../api/authApi";

/* ══════════════════════════════════════════════
   AuthContext
   Quản lý trạng thái đăng nhập toàn app.
   Bất kỳ component nào cũng dùng được qua:
     const { user, logout, loginSuccess } = useAuth();
══════════════════════════════════════════════ */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);  // { username, role } hoặc null
  const [loading, setLoading] = useState(true);  // true khi đang kiểm tra token lúc app khởi động

  /* ──────────────────────────────────────────
     Hàm giải mã JWT để đọc thời hạn hết hạn
     JWT gồm 3 phần: header.payload.signature
     Payload được mã hóa base64 → decode ra object
  ────────────────────────────────────────── */
  const decodeToken = (token) => {
    try {
      const payload = token.split(".")[1];            // lấy phần giữa
      const decoded = atob(payload);                  // giải mã base64
      return JSON.parse(decoded);                     // parse thành object { exp, sub, ... }
    } catch {
      return null;
    }
  };

  /* ──────────────────────────────────────────
     Hàm kiểm tra token còn hạn không
     exp trong JWT tính bằng giây → nhân 1000 ra milliseconds
  ────────────────────────────────────────── */
  const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;        // không decode được → coi như hết hạn
    return decoded.exp * 1000 < Date.now();           // so sánh với thời gian hiện tại
  };

  /* ──────────────────────────────────────────
     Hàm xin AccessToken mới bằng RefreshToken
     Gọi khi accessToken hết hạn nhưng refreshToken còn hạn
  ────────────────────────────────────────── */
  const tryRefreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return false;                  // không có refreshToken → thất bại

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}${ENDPOINTS.REFRESH_TOKEN}`,
        { refreshToken }
      );

      // Lưu accessToken mới vào localStorage
      localStorage.setItem("accessToken", data.accessToken);

      // Nếu backend trả về refreshToken mới thì lưu luôn (Refresh Token Rotation)
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      return true;  // refresh thành công
    } catch {
      return false; // refreshToken hết hạn hoặc không hợp lệ
    }
  };

  /* ──────────────────────────────────────────
     Chạy 1 lần khi app khởi động (F5, mở tab mới)
     Kiểm tra token trong localStorage và quyết định
     có tự động đăng nhập lại không
  ────────────────────────────────────────── */
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?.role) {
        storedUser.role = storedUser.role.replace("ROLE_", "");
      }
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      // Không có dữ liệu gì → chưa đăng nhập bao giờ
      if (!storedUser || !accessToken) {
        setLoading(false);
        return;
      }

      // ── TRƯỜNG HỢP 1: accessToken còn hạn ──
      if (!isTokenExpired(accessToken)) {
        // Đăng nhập bình thường, không cần làm gì thêm
        setUser(storedUser);
        setLoading(false);
        return;
      }

      // ── TRƯỜNG HỢP 2: accessToken hết hạn, thử refresh ──
      if (refreshToken && !isTokenExpired(refreshToken)) {
        const refreshed = await tryRefreshToken();

        if (refreshed) {
          // Refresh thành công → vẫn giữ đăng nhập, user không hay biết
          setUser(storedUser);
        } else {
          // Refresh thất bại (server lỗi, token bị thu hồi...) → buộc logout
          clearSession();
        }
      } else {
        // ── TRƯỜNG HỢP 3: cả 2 token đều hết hạn → logout ──
        clearSession();
      }

      setLoading(false);
    };

    initAuth();
  }, []); // [] = chỉ chạy 1 lần khi component mount

  /* ──────────────────────────────────────────
     Xóa toàn bộ dữ liệu session khỏi localStorage
     Dùng nội bộ — không export ra ngoài
  ────────────────────────────────────────── */
  const clearSession = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  /* ──────────────────────────────────────────
     Gọi sau khi login thành công (từ useLogin.js)
     Cập nhật state để toàn app re-render ngay lập tức:
       - AppNavbar ẩn nút Đăng Nhập/Đăng Ký
       - Hiện Avatar + Dropdown menu
  ────────────────────────────────────────── */
  const loginSuccess = (userData) => {
    setUser(userData);
  };

  /* ──────────────────────────────────────────
     Gọi khi người dùng bấm "Đăng Xuất"
     Xóa hết localStorage + reset state
     → AppNavbar sẽ hiện lại nút Đăng Nhập/Đăng Ký
  ────────────────────────────────────────── */
  const logout = async () => {
    try {
      await logoutApi(user.username); // gọi POST /auth/logout → BE xóa refreshToken trong DB
    } catch {
      // Dù API có lỗi vẫn phải xóa session phía FE
      // Tránh user bị kẹt không logout được
    } finally {
      clearSession(); // luôn chạy dù API thành công hay thất bại
    }
  };

  /* ──────────────────────────────────────────
     Trong khi đang kiểm tra token (loading = true)
     không render gì cả để tránh UI bị nhấp nháy:
       → Lúc đầu hiện nút Đăng Nhập
       → 0.1s sau đổi thành Avatar (xấu)
     Thay vào đó giữ màn hình trắng cho đến khi biết chắc
  ────────────────────────────────────────── */
  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, loginSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ──────────────────────────────────────────
   Hook tiện lợi — dùng ở bất kỳ component nào
   Thay vì: const { user } = useContext(AuthContext)
   Chỉ cần: const { user } = useAuth()
────────────────────────────────────────── */
export function useAuth() {
  return useContext(AuthContext);
}










// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext(null);

// /**
//  * AuthProvider — bọc toàn app, cung cấp thông tin user + hàm logout
//  * Dùng: const { user, logout } = useAuth();
//  */
// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);

//   // Khi app khởi động, đọc user từ localStorage (nếu đã login trước đó)
//   useEffect(() => {
//     const stored = localStorage.getItem("user");
//     if (stored) {
//       try {
//         setUser(JSON.parse(stored));
//       } catch {
//         localStorage.removeItem("user");
//       }
//     }
//   }, []);

//   const logout = () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   // Hàm này được gọi sau khi login thành công để cập nhật context
//   const loginSuccess = (userData) => {
//     setUser(userData);
//   };

//   return (
//     <AuthContext.Provider value={{ user, logout, loginSuccess }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // Hook tiện lợi — dùng ở bất kỳ component nào
// export function useAuth() {
//   return useContext(AuthContext);
// }

// */