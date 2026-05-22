import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductItem from "./ProductItem";
import { fetchEvents } from "../../util/http";
import "./ProductsByCategory.css";

export default function ProductsByCategory({ category }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);


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

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["products", category],
    queryFn: () =>
      fetchEvents({
        category,
      }),
    enabled: isVisible, 
    staleTime: 15000,
  });

  const {products} =data;  

  return (
    <div ref={sectionRef} className="category-section">
      <h2 className="category-title">{category}</h2>

      {isPending && isVisible && <p>Loading {category}...</p>}

      {isError && (
        <p style={{ color: "red" }}>
          {error?.message || "Something went wrong"}
        </p>
      )}

      <div className="products-row">
        {(Array.isArray(products) ? products : []).map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}