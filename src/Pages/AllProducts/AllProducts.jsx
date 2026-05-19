import ProductsByCategory from "../../components/Product/ProductsByCategory"
import "./AllProducts.css";
import {useEffect} from 'react'

export default function AllProducts() {
  const categories = ["laptops", "smartphones", "watches", "headphones"];

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

      {categories.map((cat) => (
        <ProductsByCategory key={cat} category={cat} />
      ))}
    </div>
  );
}