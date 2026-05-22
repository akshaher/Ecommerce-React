import { useState, useEffect } from "react";
import "./WishlistModal.css";
import { Link } from "react-router-dom";

const BASE_URL = "http://localhost:5000/";

export default function WishlistPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {

    async function fetchFavorites() {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`${BASE_URL}products/favorites`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch wishlist");

        const result = await res.json();

        const productRequests = result.favorites.map((id) =>
          fetch(`${BASE_URL}products/${id}`, {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }).then((r) => r.json())
        );

        const productsResponses = await Promise.all(productRequests);
        const products = productsResponses.map(res => res.product).filter(Boolean);
        setFavorites(products);
      } catch (err) {
        console.log(err);
        setError("Could not load your wishlist. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, []);

  async function handleRemove(productId) {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${BASE_URL}products/favorites`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      setFavorites((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.log("Remove failed:", err);
    }
  }

  return (

    <div className="wishlist-page">
      <div className="wishlist-container">
        <div className="wl-header">
          <h2 className="wl-title">
            <span className="wl-heart">❤️</span> My Wishlist
          </h2>
          <Link to="/products">Back to Products</Link>
        </div>

        <div className="wl-body">
          {loading && (
            <div className="wl-state">
              <span className="wl-spinner" />
              <p>Loading your wishlist...</p>
            </div>
          )}

          {!loading && error && (
            <div className="wl-state wl-error">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && favorites.length === 0 && (
            <div className="wl-state wl-empty">
              <span className="wl-empty-icon">🤍</span>
              <p>Your wishlist is empty.</p>
              <small>Tap the heart on any product to save it here.</small>
            </div>
          )}

          {!loading && !error && favorites.length > 0 && (
            <ul className="wl-list">
              {favorites.map((product) => {
                const imageUrl = product.images?.[0]
                  ? `${BASE_URL}${product.images[0]}`
                  : null;

                return (
                  <li key={product.id} className="wl-item">
                    <div className="wl-img-wrap">
                      {imageUrl ? (
                        <img src={imageUrl} alt={product.title} className="wl-img" />
                      ) : (
                        <div className="wl-img-placeholder">🖼</div>
                      )}
                    </div>

                    <div className="wl-info">
                      <p className="wl-product-title">{product.title}</p>
                      <p className="wl-product-price">${product.price}</p>
                    </div>

                    <button
                      className="wl-remove"
                      onClick={() => handleRemove(product.id)}
                      title="Remove from wishlist"
                    >
                      🗑
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
