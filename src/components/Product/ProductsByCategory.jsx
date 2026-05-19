import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductItem from "./ProductItem";
import { fetchEvents } from "../../util/http";
import "./ProductsByCategory.css";

export default function ProductsByCategory({ category }) {
  const sectionRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);

  // 👁️ Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {

          setIsVisible(true);
        }
      },
      {
        root: null,
        threshold: 0.15,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // 📡 React Query (only runs when visible becomes true)
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["products", category],
    queryFn: ({ signal }) =>
      fetchEvents({
        signal,
        category,
      }),
    enabled: isVisible, // 🔥 IMPORTANT: lazy load trigger
    staleTime: 15000,
  });

  return (
    <div ref={sectionRef} className="category-section">
      <h2 className="category-title">{category}</h2>

      {/* LOADING */}
      {isPending && isVisible && <p>Loading {category}...</p>}

      {/* ERROR */}
      {isError && (
        <p style={{ color: "red" }}>
          {error?.message || "Something went wrong"}
        </p>
      )}

      {/* PRODUCTS */}
      <div className="products-row">
        {(Array.isArray(data) ? data : []).map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}