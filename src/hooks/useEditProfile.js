import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profileApi from "../api/ProfileApi";
import { ROUTES } from "../constants/routes";

const useEditProfile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileApi.getProfile();
        const { fullName, email, phoneNumber, address } = res.data;
        setFormData({ fullName, email, phoneNumber, address });
      } catch {
        setError("Không thể tải thông tin hồ sơ.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");
    try {
      await profileApi.updateProfile(formData);
      setSuccess("Cập nhật hồ sơ thành công!");
      setTimeout(() => navigate(ROUTES.PROFILE), 1200);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại."
      );
    } finally {
      setSaving(false);
    }
  };

  return {
    formData,
    loading,
    saving,
    success,
    error,
    handleChange,
    handleSubmit,
  };
};

export default useEditProfile;