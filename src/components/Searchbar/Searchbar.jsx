import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "../../util/http.js";
import "./SearchBar.css";

export default function SearchBar() {
  const navigate                      = useNavigate();
  const [query, setQuery]             = useState("");
  const [results, setResults]         = useState([]);
  const [isOpen, setIsOpen]           = useState(false);
  const [isLoading, setIsLoading]     = useState(false);
  const [activeIdx, setActiveIdx]     = useState(-1); // keyboard nav
  const debounceTimer                 = useRef(null);
  const wrapperRef                    = useRef(null);
  const abortRef                      = useRef(null);  // abort stale fetches

  /* ── Fetch results whenever query changes (debounced 300ms) ─────────────── */
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      // Cancel any previous in-flight request
      if (abortRef.current) abortRef.current.abort();
      const controller   = new AbortController();
      abortRef.current   = controller;

      setIsLoading(true);
      try {
        const data = await fetchEvents({
          signal:     controller.signal,
          searchTerm: query.trim(),
        });
        setResults(data || []);
        setIsOpen(true);
        setActiveIdx(-1);
      } catch (err) {
        if (err.name !== "AbortError") setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer.current);
  }, [query]);

  /* ── Close dropdown when clicking outside ───────────────────────────────── */
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ── Navigate to product detail on result click ─────────────────────────── */
  function handleSelect(productId) {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    navigate(`/products/${productId}`);
  }

  /* ── Keyboard navigation ────────────────────────────────────────────────── */
  function handleKeyDown(e) {
    if (!isOpen || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && activeIdx >= 0) {
      handleSelect(results[activeIdx].id);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  const IMAGE_BASE = "http://localhost:5000/";

  return (
    <div className="sb-wrap" ref={wrapperRef}>

      {/* ── Input ─────────────────────────────────────────────────────────── */}
      <div className={`sb-input-wrap${isOpen && results.length ? " open" : ""}`}>
        <span className="sb-icon">
          {isLoading ? (
            <span className="sb-spinner" />
          ) : (
            /* search svg */
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          )}
        </span>

        <input
          className="sb-input"
          type="text"
          placeholder="Search products…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          autoComplete="off"
          aria-label="Search products"
          aria-expanded={isOpen}
          aria-autocomplete="list"
        />

        {/* Clear button */}
        {query && (
          <button
            className="sb-clear"
            onClick={() => { setQuery(""); setResults([]); setIsOpen(false); }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Dropdown results ──────────────────────────────────────────────── */}
      {isOpen && (
        <ul className="sb-dropdown" role="listbox">
          {results.length === 0 && !isLoading ? (
            <li className="sb-no-results">No products found</li>
          ) : (
            results.map((product, i) => {
              const imgSrc = Array.isArray(product.image)
                ? `${IMAGE_BASE}${product.image[0]}`
                : `${IMAGE_BASE}${product.image}`;

              return (
                <li
                  key={product.id}
                  className={`sb-result${activeIdx === i ? " active" : ""}`}
                  role="option"
                  aria-selected={activeIdx === i}
                  onClick={() => handleSelect(product.id)}
                  onMouseEnter={() => setActiveIdx(i)}
                >
                  {/* Thumbnail */}
                  <div className="sb-result-img">
                    <img src={imgSrc} alt={product.title} />
                  </div>

                  {/* Info */}
                  <div className="sb-result-info">
                    <span className="sb-result-title">{product.title}</span>
                    <span className="sb-result-meta">
                      <span className="sb-result-cat">{product.category}</span>
                      <span className="sb-result-price">${product.price}</span>
                    </span>
                  </div>

                  {/* Arrow */}
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
