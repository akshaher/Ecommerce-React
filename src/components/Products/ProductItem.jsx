import { Link } from "react-router-dom";
import "./ProductItem.css";

export default function ProductItem({ event }) {
  
  return (
    <Link to={`/products/${event.id}`} className="product-link">
    <article className="product-card">
      <div className="product-image-wrapper">
        <img src={`http://localhost:5000/${event.image[0]}`}  loading="lazy" alt={event.title} />
      </div>

      <div className="product-content">
        <div>
          <h2>{event.title}</h2>
          <p className="product-location">${event.price}</p>
        </div>
        <button className="view-details-btn">
          View Details
        </button>
      </div>
    </article>
    </Link>
  );
}
