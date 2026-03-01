import { useEffect, useState } from "react";
import profileApi from "../api/profileApi";
import { ROUTES } from "../constants/routes";

const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileApi.getProfile();
        setProfile(res.data);
      } catch {
        setError("Không thể tải thông tin hồ sơ.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return { profile, loading, error };
};

export default useProfile;