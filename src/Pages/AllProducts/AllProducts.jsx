import ProductsByCategory from "../../components/Product/ProductsByCategory"
import "./AllProducts.css";
import { useEffect } from 'react'

const CATEGORIES = ["shoes", "laptops", "smartphones", "watches", "headphones"];

export default function AllProducts() {

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="all-products-page">
      <h1 className="page-title">Products from All Category</h1>

      {CATEGORIES.map((cat) => (
        <ProductsByCategory key={cat} category={cat} />
      ))}
    </div>
  );
}