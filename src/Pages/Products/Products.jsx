import { useState } from "react";
import ProductListingPage from "./ProductListingPage.jsx";
import CartIcon from "../../components/cart/CartIcon.jsx"
import "./products.css";
import Footer from "../../components/layout/Footer/Footer.jsx"
import LogoutModal from "../../components/layout/Logout.jsx"
import {Link} from 'react-router-dom'
import SwitchLanguage from "../../components/UI/SwitchLanguage.jsx"
import { useTranslation } from "react-i18next";

const CATEGORIES = [
  { value: "all", label: "categories.all", icon: "🛍" },
  { value: "smartphones", label: "categories.smartphones", icon: "📱" },
  { value: "laptops", label: "categories.laptops", icon: "💻" },
  { value: "headphones", label: "categories.headphones", icon: "🎧" },
  { value: "watches", label: "categories.watches", icon: "⌚" },
];

export default function Products() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const {t} =useTranslation();

  return (
    <>
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
      <main>
        <div className="category-bar">
          <div className="category-left">
            <span className="category-bar-label">{t("filter")}</span>
            <div className="category-bar-inner">
              {CATEGORIES.map((cat) => (
                <label
                  key={cat.value}
                  className={`category-pill${
                    activeCategory === cat.value ? " active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    checked={activeCategory === cat.value}
                    onChange={() => setActiveCategory(cat.value)}
                  />
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-label">{t(cat.label)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="navTabs">
            <div className="nav-actions">
              <SwitchLanguage/>
              <button
                className="plp-logout-btn"
                onClick={() => {
                  setShowLogoutModal("true");
                }}
              >
                {t("logOut")}
              </button>
              <div className="nav-cart-slot">
                <CartIcon />
              </div>
            </div>
          </div>
        </div>

        <ProductListingPage category={activeCategory} />
        <Link to="/allproducts" className="view-all-products-btn">
          View More Products..
        </Link>
        <Footer />
      </main>
    </>
  );
}
