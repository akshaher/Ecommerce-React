import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "../../util/http.js";
import "./SearchBar.css";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../../config.js";

export default function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const { t } = useTranslation();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const data = await fetchEvents({ searchTerm: query.trim() });
        setResults(data || []);
        setIsOpen(true);
      } catch (err) {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(productId) {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    navigate(`/products/${productId}`);
  }

  return (
    <div className="sb-wrap" ref={wrapperRef}>
      <div className={`sb-input-wrap${isOpen && results.length ? " open" : ""}`}>
        <span className="sb-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>

        <input
          className="sb-input"
          type="text"
          placeholder={t("searchProducts")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          autoComplete="off"
        />

        {query && (
          <button
            className="sb-clear"
            onClick={() => { setQuery(""); setResults([]); setIsOpen(false); }}
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && (
        <ul className="sb-dropdown">
          {results.length === 0 ? (
            <li className="sb-no-results">No products found</li>
          ) : (
            results.map((product) => {
              const imgSrc = Array.isArray(product.image)
                ? `${BASE_URL}${product.image[0]}`
                : `${BASE_URL}${product.image}`;

              return (
                <li
                  key={product.id}
                  className="sb-result"
                  onClick={() => handleSelect(product.id)}
                >
                  <div className="sb-result-img">
                    <img src={imgSrc} alt={product.title} />
                  </div>

                  <div className="sb-result-info">
                    <span className="sb-result-title">{product.title}</span>
                    <span className="sb-result-meta">
                      <span className="sb-result-cat">{product.category}</span>
                      <span className="sb-result-price">${product.price}</span>
                    </span>
                  </div>

                  <span className="sb-result-arrow">→</span>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}

