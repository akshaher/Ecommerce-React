import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import ProductItem from "./ProductItem.jsx";
import SearchBar from "../Searchbar/Searchbar.jsx";
import { fetchEvents } from "../../util/http.js";
import "./ProductListingPage.css";
import { use } from "react";
import { useTranslation } from "react-i18next";

export default function ProductListingPage({ category }) {
  const navigate = useNavigate();
  const {t}=useTranslation();

 
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["products", { category }],
    queryFn: ({ queryKey }) => fetchEvents({ ...queryKey[1] }),
    staleTime: 15000,
  });

  function navigateToLogin() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  let content;

  if (isPending) {
    content = (
      <div className="plp-state">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError && error.code === 401) {
    content = (
      <div className="error-box auth-error">
        <h2 className="error-title">Session Expired</h2>
        <p className="error-message">{error.message}</p>
        <a onClick={navigateToLogin} className="error-link">
          Click here to login again
        </a>
      </div>
    );
  } else if (isError) {
    content = (
      <div className="plp-state">
        <ErrorBlock
          title="An error occurred"
          message={error.info?.message || "Failed to fetch products"}
        />
      </div>
    );
  }

  if (data) {
    content = data.length === 0 ? (
      <div className="plp-empty">
        <span className="plp-empty-icon">📭</span>
        <p>No products found in this category</p>
      </div>
    ) : (
      <ul className="plp-grid">
        {data.map((product) => (
          <li key={product.id}>
            <ProductItem product={product} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="plp-section">
      <div className="plp-body">
        <div className="plp-heading-row">
          <div className="plp-heading-left">
            <h1 className="plp-heading">
              {t("categories.all")} <span>{t("products")}</span>
            </h1>
            {data && (
              <span className="plp-item-count">{data.length} items</span>
            )}
          </div>
          <SearchBar />
        </div>

        {content}
      </div>
    </section>
  );
}
