import { useState } from "react";
import { register } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";

const INITIAL_FORM = {
  username: "",
  password: "",
  confirmPassword: "",
  agreed: false,
};

/**
 * useRegister — handles all registration form logic.
 * Keeps the page component thin and purely presentational.
 */
export function useRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear feedback when user starts typing again
    if (error) setError("");
  };

  const validate = () => {
    if (!form.username.trim())        return "Username is required.";
    if (form.username.length < 3)     return "Username must be at least 3 characters.";
    if (form.password.length < 6)     return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    if (!form.agreed)                 return "You must agree to the Terms of Service and Privacy Policy.";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await register({
        username: form.username,
        password: form.password,
      });
      setSuccess("Account created! Redirecting to login…");
      setForm(INITIAL_FORM);
      setTimeout(() => navigate(ROUTES.LOGIN), 2000);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, error, success, handleChange, handleSubmit };
}