import { useSelector, useDispatch } from "react-redux";
import { createPortal } from "react-dom";
import { useMemo, useState } from "react";
import { removeFromCart, clearCart } from "../../store/cartStore";
import "./CartModal.css";

export default function CartModal({ onClose }) {
  const dispatch = useDispatch();
  const { items, count } = useSelector((state) => state.cart);


  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [items]);

  return createPortal(
    <>
      <div className="cm-backdrop" onClick={onClose} />
      <div className="cm-panel" role="dialog" aria-modal="true" aria-label="Your cart">
        <div className="cm-header">
          <div className="cm-header-left">
            <span className="cm-title">Your Cart</span>
            {count > 0 && (
              <span className="cm-count">{count} {count === 1 ? "item" : "items"}</span>
            )}
          </div>


          <button className="cm-close" onClick={onClose} aria-label="Close cart">✕</button>
        </div>
        {items.length === 0 ? (
          <div className="cm-empty">
            <span className="cm-empty-icon">🛍</span>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <ul className="cm-list">
              {items.map((item) => (
                <li key={item.id} className="cm-item">
                  {item.image && (
                    <img className="cm-item-img" src={item.image} alt={item.title} />
                  )}

                  <div className="cm-item-info">
                    <span className="cm-item-title">{item.title}</span>
                    <span className="cm-item-meta">
                      ${item.price} × {item.qty}
                    </span>
                  </div>

                  <div className="cm-item-right">
                    <span className="cm-item-total">
                      ${(item.price * item.qty).toLocaleString()}
                    </span>
                    <button
                      className="cm-remove"
                      onClick={() => dispatch(removeFromCart(item.id))}
                      aria-label={`Remove ${item.title}`}
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cm-footer">
              <div className="cm-total-row">
                <span className="cm-total-label">Total</span>
                <span className="cm-total-value">${total.toLocaleString()}</span>
              </div>
              <button className="cm-checkout" onClick={() => dispatch(clearCart())}>
                Clear Cart
              </button>
            </div>
          </>
        )}

      </div>
    </>,
    document.body
  );
}
