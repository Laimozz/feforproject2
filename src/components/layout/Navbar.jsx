import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__logo-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <line x1="12" y1="2" x2="12" y2="5"/>
          <line x1="12" y1="19" x2="12" y2="22"/>
          <line x1="2" y1="12" x2="5" y2="12"/>
          <line x1="19" y1="12" x2="22" y2="12"/>
          <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
          <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
          <line x1="19.78" y1="4.22" x2="17.66" y2="6.34"/>
          <line x1="6.34" y1="17.66" x2="4.22" y2="19.78"/>
        </svg>
      </div>
      <span className="navbar__logo-text">NexusApp</span>
    </nav>
  );
}