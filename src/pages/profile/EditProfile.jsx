import { useNavigate } from "react-router-dom";
import AppNavbar from "../../components/layout/AppNavbar";
import useEditProfile from "../../hooks/useEditProfile";
import "./EditProfile.css";

const EditProfile = () => {
  const {
    formData,
    loading,
    saving,
    success,
    error,
    handleChange,
    handleSubmit,
  } = useEditProfile();
  const navigate = useNavigate();

  if (loading)
    return (
      <div className="edit-profile-page">
        <AppNavbar />
        <div className="edit-profile-container">
          <p className="edit-profile-loading">Đang tải...</p>
        </div>
      </div>
    );

  return (
    <div className="edit-profile-page">
      <AppNavbar />
      <div className="edit-profile-container">
        <div className="edit-profile-card">
          <div className="edit-profile-header">
            <button
              className="edit-profile-back-btn"
              onClick={() => navigate("/profile")}
            >
              ← Quay lại hồ sơ
            </button>
            <h2 className="edit-profile-title">Chỉnh sửa hồ sơ</h2>
            <p className="edit-profile-subtitle">
              Cập nhật thông tin cá nhân của bạn
            </p>
          </div>

          {success && (
            <div className="edit-profile-alert edit-profile-alert--success">
              ✓ {success}
            </div>
          )}
          {error && (
            <div className="edit-profile-alert edit-profile-alert--error">
              ✕ {error}
            </div>
          )}

          <form className="edit-profile-form" onSubmit={handleSubmit}>
            <div className="edit-form-group">
              <label className="edit-form-label">Họ và tên</label>
              <input
                className="edit-form-input"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                required
              />
            </div>

            <div className="edit-form-group">
              <label className="edit-form-label">Email</label>
              <input
                className="edit-form-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange} 
                placeholder="Nhập email"
                required
              />
            </div>

            <div className="edit-form-group">
              <label className="edit-form-label">Số điện thoại</label>
              <input
                className="edit-form-input"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="edit-form-group">
              <label className="edit-form-label">Địa chỉ</label>
              <input
                className="edit-form-input"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ"
              />
            </div>

            <div className="edit-profile-actions">
              <button
                type="button"
                className="edit-cancel-btn"
                onClick={() => navigate("/profile")}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="edit-save-btn"
                disabled={saving}
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;