import { useNavigate } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="nf-main">
      <div className="nf-container">
        {/* ── Two column layout ───────────────────────────────────────────── */}
        <div className="nf-grid">
          {/* Left — text content */}
          <div className="nf-content">
            <p className="nf-label">Error 404</p>

            <h1 className="nf-heading">
              Lost in the <span className="nf-accent">Aisles?</span>
            </h1>

            <p className="nf-desc">
              The page you're looking for has checked out permanently or moved
              to a new shelf. Let's get you back to your shopping journey.
            </p>

            <div className="nf-actions">
              <button className="nf-btn-primary" onClick={() => navigate("/")}>
                Go Home
              </button>
              <button className="nf-btn-secondary" onClick={() => navigate(-1)}>
                Go Back
              </button>
            </div>

            {/* Popular destinations */}
            <div className="nf-shortcuts">
              <p className="nf-shortcuts-label">Popular Destinations</p>
              <div className="nf-shortcuts-list">
                <a href="/" className="nf-shortcut-link">
                  🛍 New Arrivals
                </a>
                <a href="/" className="nf-shortcut-link">
                  📈 Best Sellers
                </a>
                <a href="/" className="nf-shortcut-link">
                  ❓ Help Center
                </a>
              </div>
            </div>
          </div>

          {/* Right — visual */}
          <div className="nf-visual">
            <div className="nf-card">
              {/* Background glow */}
              <div className="nf-glow" />

              {/* Watermark */}
              <span className="nf-watermark">404</span>

              {/* Icon */}
              <div className="nf-icon-wrap">
                <span className="nf-icon">🛒</span>
              </div>

              <p className="nf-card-text">Page not found</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
