import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../../components/UI/LoadingIndicator.jsx"
import ErrorBlock from "../../components/UI/ErrorBlock.jsx"
import ProductItem from "../../components/Product/ProductItem.jsx"
import SearchBar from "../../components/Search/Searchbar.jsx"
import { fetchEvents } from "../../util/http.js";
import "./ProductListingPage.css";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../components/UI/Pagination.jsx";

export default function ProductListingPage({ category }) {
  const navigate = useNavigate();
  const {t}=useTranslation();
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [category]);
 
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["products", { category, page }],
    queryFn: ({ queryKey }) => fetchEvents({ ...queryKey[1] }),
    staleTime: 150000,
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
    content = data.products.length === 0 ? (
      <div className="plp-empty">
        <span className="plp-empty-icon">📭</span>
        <p>No products found in this category</p>
      </div>
    ) : (
      <>
        <ul className="plp-grid">
          {data.products.map((product) => (
            <li key={product.id}>
              <ProductItem product={product} />
            </li>
          ))}
        </ul>
        <Pagination 
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      </>
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
              <span className="plp-item-count">{data.totalProducts} items</span>
            )}
          </div>
          <SearchBar />
        </div>

        {content}
      </div>
    </section>
  );
}
