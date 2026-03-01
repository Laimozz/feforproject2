import { useState } from "react";
import { login } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ THÊM: lấy hàm loginSuccess từ AuthContext

export default function useLogin() {
  const navigate = useNavigate();
  const { loginSuccess } = useAuth(); // ✅ THÊM: loginSuccess sẽ cập nhật user cho toàn app

  // 1️⃣ State lưu dữ liệu form
  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  // 2️⃣ State lỗi
  const [error, setError] = useState("");

  // 3️⃣ State loading
  const [loading, setLoading] = useState(false);

  // 4️⃣ Xử lý khi nhập input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    // Xóa lỗi khi user bắt đầu gõ lại
    if (error) setError("");
  };

  // 5️⃣ Validate trước khi gọi API
  const validate = () => {
    if (!form.username.trim()) return "Username is required.";
    if (!form.password)        return "Password is required.";
    return null;
  };

  // 6️⃣ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      // 7️⃣ Gọi API login
      const response = await login(form);

      const { username, role, accessToken, refreshToken } = response.data;

      // 8️⃣ Lưu accessToken (dùng cho Authorization header)
      localStorage.setItem("accessToken", accessToken);

      // 9️⃣ Lưu refreshToken (dùng để xin accessToken mới)
      localStorage.setItem("refreshToken", refreshToken);

      // 🔟 Lưu thông tin user (để hiển thị UI)
      localStorage.setItem("user", JSON.stringify({ username, role: role?.replace("ROLE_", ""), }));

      // ✅ THÊM: Báo cho AuthContext biết user đã login thành công
      // → AppNavbar sẽ tự động ẩn nút Đăng Nhập/Đăng Ký
      // → và hiện Avatar + Dropdown menu ngay lập tức
      loginSuccess({ username, role: role?.replace("ROLE_", ""), });

      // 1️⃣1️⃣ Redirect theo role
      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Invalid username or password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    error,
    loading,
    handleChange,
    handleSubmit
  };
}