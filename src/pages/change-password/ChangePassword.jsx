import { useState } from "react";
import { Link } from "react-router-dom";
import "./ChangePassword.css";
import AppNavbar from "../../components/layout/Appnavbar";
import useChangePassword from "../../hooks/useChangePassword";
import { ROUTES } from "../../constants/routes";

/* ── Icon mắt show/hide password ── */
const IconEye = ({ open }) => open ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

/* ── Tính độ mạnh mật khẩu ── */
const getStrength = (pw) => {
  if (!pw) return null;
  let score = 0;
  if (pw.length >= 8)            score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;
  if (score <= 1) return { level: "weak",   label: "Yếu" };
  if (score <= 2) return { level: "medium", label: "Trung bình" };
  return                { level: "strong", label: "Mạnh" };
};

export default function ChangePassword() {
  const { form, error, success, loading, handleChange, handleSubmit } = useChangePassword();

  // State show/hide riêng cho từng field
  const [show, setShow] = useState({ oldPassword: false, newPassword: false, confirmPassword: false });
  const toggle = (field) => setShow((s) => ({ ...s, [field]: !s[field] }));

  const strength = getStrength(form.newPassword);

  return (
    <div className="cp-page">
      <AppNavbar />

      <div className="cp-page__body">
        <div className="cp-card">

          {/* Header */}
          <div className="cp-card__icon">🔐</div>
          <div className="cp-card__title">Đổi Mật Khẩu</div>
          <p className="cp-card__sub">
            Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu với người khác.
          </p>

          {/* Alert error */}
          {error && (
            <div className="cp-alert cp-alert--error" style={{ marginBottom: 20 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Alert success */}
          {success && (
            <div className="cp-alert cp-alert--success" style={{ marginBottom: 20 }}>
              ✅ {success}
            </div>
          )}

          <form className="cp-form" onSubmit={handleSubmit}>

            {/* Mật khẩu hiện tại */}
            <div className="cp-field">
              <label className="cp-field__label">Mật Khẩu Hiện Tại *</label>
              <div className="cp-field__wrap">
                <input
                  className={`cp-field__input ${error ? "cp-field__input--error" : ""}`}
                  name="oldPassword"
                  type={show.oldPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu hiện tại"
                  value={form.oldPassword}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button type="button" className="cp-field__eye" onClick={() => toggle("oldPassword")}>
                  <IconEye open={show.oldPassword} />
                </button>
              </div>
            </div>

            <div className="cp-divider" />

            {/* Mật khẩu mới */}
            <div className="cp-field">
              <label className="cp-field__label">Mật Khẩu Mới *</label>
              <div className="cp-field__wrap">
                <input
                  className="cp-field__input"
                  name="newPassword"
                  type={show.newPassword ? "text" : "password"}
                  placeholder="Ít nhất 6 ký tự"
                  value={form.newPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button type="button" className="cp-field__eye" onClick={() => toggle("newPassword")}>
                  <IconEye open={show.newPassword} />
                </button>
              </div>

              {/* Thanh độ mạnh mật khẩu */}
              {strength && (
                <div className="cp-strength">
                  <div className="cp-strength__bars">
                    {["weak", "medium", "strong"].map((lvl, i) => {
                      const active =
                        (strength.level === "weak"   && i === 0) ||
                        (strength.level === "medium" && i <= 1)  ||
                        (strength.level === "strong");
                      return (
                        <div
                          key={lvl}
                          className={`cp-strength__bar ${active ? `cp-strength__bar--${strength.level}` : ""}`}
                        />
                      );
                    })}
                  </div>
                  <span className={`cp-strength__label cp-strength__label--${strength.level}`}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Xác nhận mật khẩu mới */}
            <div className="cp-field">
              <label className="cp-field__label">Xác Nhận Mật Khẩu Mới *</label>
              <div className="cp-field__wrap">
                <input
                  className="cp-field__input"
                  name="confirmPassword"
                  type={show.confirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu mới"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button type="button" className="cp-field__eye" onClick={() => toggle("confirmPassword")}>
                  <IconEye open={show.confirmPassword} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="cp-btn" disabled={loading}>
              {loading ? (
                <><div className="cp-spinner" /> Đang Xử Lý...</>
              ) : (
                "Đổi Mật Khẩu"
              )}
            </button>

          </form>

          {/* Back link */}
          <Link to={ROUTES.PROFILE} className="cp-back">
            ← Quay lại Hồ Sơ
          </Link>

        </div>
      </div>
    </div>
  );
}