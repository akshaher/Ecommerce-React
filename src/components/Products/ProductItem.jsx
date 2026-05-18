import { Link } from "react-router-dom";
import "./ProductItem.css";

export default function ProductItem({ product }) {
  
  return (
    <Link to={`/products/${product.id}`} className="product-link">
    <article className="product-card">
      <div className="product-image-wrapper">
        <img src={`http://localhost:5000/${product.image[0]}`}  loading="lazy" alt={product.title} />
      </div>

      <div className="product-content">
        <div>
          <h2>{product.title}</h2>
          <p className="product-location">${product.price}</p>
        </div>
        <button className="view-details-btn">
          View Details
        </button>
      </div>
    </article>
    </Link>
  );
}
