import { Link } from "react-router-dom";
import "./Login.css";

import Navbar     from "../../../components/layout/Navbar";
import Footer     from "../../../components/layout/Footer";
import InputField from "../../../components/common/InputField";
import Button     from "../../../components/common/Button";
import Alert      from "../../../components/common/Alert";
import useLogin   from "../../../hooks/useLogin";
import { ROUTES } from "../../../constants/routes";

/* ── Inline SVG Icons ── */
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

export default function Login() {
  const { form, error, loading, handleChange, handleSubmit } = useLogin();

  return (
    <div className="login-page">
      <Navbar />

      <main className="login-page__body">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p className="subtitle">Please enter your details to sign in</p>

          <Alert type="error" message={error} />

          <form onSubmit={handleSubmit}>
            <InputField
              label="Username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              icon={<IconUser />}
              autoComplete="username"
            />

            <InputField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              icon={<IconLock />}
              autoComplete="current-password"
            />

            <Button type="submit" loading={loading}>
              Sign In →
            </Button>
          </form>

          <div className="bottom-text">
            Don't have an account?{" "}
            <Link to={ROUTES.REGISTER}>Create account</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}