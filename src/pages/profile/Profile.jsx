import { useNavigate } from "react-router-dom";
import AppNavbar from "../../components/layout/AppNavbar";
import useProfile from "../../hooks/useProfile";
import "./Profile.css";

const Profile = () => {
  const { profile, loading, error } = useProfile();
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (loading)
    return (
      <div className="profile-page">
        <AppNavbar />
        <div className="profile-container">
          <p className="profile-loading">Đang tải...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="profile-page">
        <AppNavbar />
        <div className="profile-container">
          <p className="profile-error">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="profile-page">
      <AppNavbar />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {getInitials(profile?.fullName)}
            </div>
            <h2 className="profile-name">{profile?.fullName || "—"}</h2>
            <span className="profile-email-tag">{profile?.email || "—"}</span>
          </div>

          <ul className="profile-info-list">
            <li className="profile-info-item">
              <span className="profile-info-icon">👤</span>
              <div className="profile-info-content">
                <span className="profile-info-label">Họ và tên</span>
                <span className="profile-info-value">{profile?.fullName || "—"}</span>
              </div>
            </li>
            <li className="profile-info-item">
              <span className="profile-info-icon">📧</span>
              <div className="profile-info-content">
                <span className="profile-info-label">Email</span>
                <span className="profile-info-value">{profile?.email || "—"}</span>
              </div>
            </li>
            <li className="profile-info-item">
              <span className="profile-info-icon">📞</span>
              <div className="profile-info-content">
                <span className="profile-info-label">Số điện thoại</span>
                <span className="profile-info-value">{profile?.phoneNumber || "—"}</span>
              </div>
            </li>
            <li className="profile-info-item">
              <span className="profile-info-icon">📍</span>
              <div className="profile-info-content">
                <span className="profile-info-label">Địa chỉ</span>
                <span className="profile-info-value">{profile?.address || "—"}</span>
              </div>
            </li>
          </ul>

          <button
            className="profile-edit-btn"
            onClick={() => navigate("/profile/edit")}
          >
            ✏️ Chỉnh sửa hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;