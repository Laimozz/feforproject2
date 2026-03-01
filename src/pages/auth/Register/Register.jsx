import { Link } from "react-router-dom";
import "./Register.css";

import Navbar    from "../../../components/layout/Navbar";
import Footer    from "../../../components/layout/Footer";
import InputField from "../../../components/common/InputField";
import Button    from "../../../components/common/Button";
import Alert     from "../../../components/common/Alert";
import { useRegister } from "../../../hooks/useRegister";
import { ROUTES } from "../../../constants/routes";

/* ── Inline SVG icons ────────────────────────────── */
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const IconUserPlus = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <line x1="19" y1="8" x2="19" y2="14"/>
    <line x1="22" y1="11" x2="16" y2="11"/>
  </svg>
);

/* ── Component ───────────────────────────────────── */
export default function Register() {
  const { form, loading, error, success, handleChange, handleSubmit } = useRegister();

  return (
    <div className="register-page">
      <Navbar />

      <main className="register-page__body">
        <div className="register-card">

          {/* Avatar */}
          <div className="register-card__avatar">
            <IconUserPlus />
          </div>

          <h1 className="register-card__title">Create Account</h1>
          <p className="register-card__subtitle">
            Join our vibrant community of creators and<br />professionals today.
          </p>

          {/* Fields */}
          <div className="register-card__fields">
            <InputField
              label="Username"
              name="username"
              type="text"
              placeholder="Choose a unique username"
              value={form.username}
              onChange={handleChange}
              icon={<IconUser />}
              autoComplete="username"
            />

            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              icon={<IconLock />}
              autoComplete="new-password"
            />

            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={handleChange}
              icon={<IconShield />}
              autoComplete="new-password"
            />

            {/* Agree checkbox */}
            <div className="register-card__agree">
              <input
                type="checkbox"
                id="agreed"
                name="agreed"
                checked={form.agreed}
                onChange={handleChange}
              />
              <label htmlFor="agreed" className="register-card__agree-text">
                I agree to the{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>
              </label>
            </div>

            {/* Feedback */}
            <Alert type="error"   message={error} />
            <Alert type="success" message={success} />

            {/* Submit */}
            <Button variant="primary" loading={loading} onClick={handleSubmit}>
              CREATE ACCOUNT →
            </Button>
          </div>

          {/* Back to login */}
          <p className="register-card__footer-link">
            Already have an account?{" "}
            <Link to={ROUTES.LOGIN}>Back to Login</Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}