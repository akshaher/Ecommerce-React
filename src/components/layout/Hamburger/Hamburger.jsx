import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./Hamburger.css";

const MENU_ITEMS = [
  { icon: "🏠", label: "Home", href: "/" },
  { icon: "🛍", label: "Products", href: "/allproducts" }
];

export default function HamburgerMenu() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  return (
    <>
      <button
        className={`hm-trigger ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen((prev) => !prev)}

      >
        <span className="hm-bar" />
        <span className="hm-bar" />
        <span className="hm-bar" />
      </button>

      {createPortal(
        <>
          {sidebarOpen && (
            <div
              className="hm-backdrop"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <aside className={`hm-sidebar ${sidebarOpen ? "hm-sidebar--open" : ""}`}>
            <div className="hm-sidebar-header">
              <span className="hm-logo">🛍 MyShop</span>
              <button
                className="hm-sidebar-close"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <nav className="hm-nav">
              <p className="hm-nav-label">Menu</p>

              {MENU_ITEMS.map((item) => (
                <a key={item.label} href={item.href} className="hm-nav-item">
                  <span className="hm-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              ))}

              <p className="hm-nav-label hm-nav-label--mt">My Account</p>

              <a href="/wishlist" className="hm-nav-item">
                <span className="hm-nav-icon">❤️</span>
                <span>Wishlist</span>
              </a>
            </nav>

            <div className="hm-sidebar-footer">
              <button
                className="hm-logout"
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
              >
                🚪 Logout
              </button>
            </div>
          </aside>
        </>,
        document.body
      )}
    </>
  );
}


