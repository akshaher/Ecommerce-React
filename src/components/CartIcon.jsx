import { useState } from "react";
import { useSelector } from "react-redux";
import CartModal from "./CartModal";
import "./CartIcon.css";

export default function CartIcon() {
  const count = useSelector((state) => state.cart.count);
  const [open, setOpen]  = useState(false);
  
  return (
    <>
      <button
        className="cart-icon-btn"
        onClick={() => setOpen(true)}
        aria-label={`Cart, ${count} items`}
      >
        {/* Bag icon */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>

        {/* Count badge — only shown when count > 0 */}
        {count > 0 && (
          <span className="cart-icon-badge" aria-hidden="true">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>


      {open && <CartModal onClose={() => setOpen(false)} />}
    </>
  );
}
