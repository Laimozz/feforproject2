import { useState } from "react";
import { changePassword } from "../api/ProfileApi";

export default function useChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error)   setError("");
    if (success) setSuccess("");
  };

  const validate = () => {
    if (!form.oldPassword)                          return "Vui lòng nhập mật khẩu hiện tại.";
    if (!form.newPassword)                          return "Vui lòng nhập mật khẩu mới.";
    if (form.newPassword.length < 6)                return "Mật khẩu mới phải có ít nhất 6 ký tự.";
    if (form.newPassword === form.oldPassword)      return "Mật khẩu mới phải khác mật khẩu hiện tại.";
    if (form.newPassword !== form.confirmPassword)  return "Xác nhận mật khẩu không khớp.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Chỉ gửi oldPassword + newPassword — BE lấy username từ token
      await changePassword({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

      setSuccess("Đổi mật khẩu thành công!");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });

    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Đổi mật khẩu thất bại. Vui lòng thử lại.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return { form, error, success, loading, handleChange, handleSubmit };
}