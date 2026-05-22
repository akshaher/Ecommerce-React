import { useState, useOptimistic, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cartStore";
import "./ProductDetail.css";
import {Swiper, SwiperSlide} from "swiper/react";
import { Pagination,Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const IMAGE_BASE_URL = "http://localhost:5000/";

const TRUST_BADGES = [
  { icon: "🚚", label: "Free delivery" },
  { icon: "🛡", label: "2-year warranty" },
  { icon: "↩", label: "30-day returns" },
  { icon: "🔒", label: "Secure checkout" },
];

export default function ProductDetail({ data }) {
  const dispatch = useDispatch();

  const [swiperInstance, setSwiperInstance] = useState(null);
  const [productIdx, setProductIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const [favorite, setFavorite] = useState(data?.isFavorite || false);
  const [optimisticFavorite, toggleFavorite] = useOptimistic(
    favorite,
    (current) => !current,
  );

  useEffect(() => {
    if (!data?.id) return;
    async function loadFavorites() {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${IMAGE_BASE_URL}products/favorites`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch favorites");
        }

        const result = await res.json();
        const isFav = result.favorites.includes(data.id);

        setFavorite(isFav);
      } catch (err) {
        console.log("Failed to load favorites:", err);
      }
    }

    loadFavorites();
  }, [data?.id]);

  if (!data) return null;

  const { id, title, price, description, badge, images = [] } = data;

  const imageUrls = images.map((src) => `${IMAGE_BASE_URL}${src}`);

  function handleAddToCart() {
    if (added) return;

    dispatch(
      addToCart({
        id,
        title,
        price,
        image: imageUrls[0],
      }),
    );
    setAdded(true);
  }

  async function handleFavorite() {
    toggleFavorite();

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${IMAGE_BASE_URL}products/favorites`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: id,
        }),
      });

      if (!res.ok) {
        throw new Error("Favorite update failed");
      }

      const result = await res.json();
      setFavorite(result.isFavorite);
    } catch (err) {
      console.log("Favorite update failed:", err);
      setFavorite((prev) => !prev);
    }
  }

  return (
    <article className="pd-root" id="product-details">
      <div className="pd-layout">
        <div className="pd-img-wrap">
          <div className="pd-hero-wrap">
            <Swiper
              onSwiper={setSwiperInstance}
              modules={[Pagination, Autoplay]}
              slidesPerView={1}
              spaceBetween={20}
              pagination={{ clickable: true }}
              autoplay={{
                delay: 1000,
                disableOnInteraction: false,
              }}
              loop={true}
              onSlideChange={(swiper) => {
                setProductIdx(swiper.realIndex);
              }}
              className="pd-swiper"
            >
              {imageUrls.map((src, index) => (
                <SwiperSlide key={index}>
                  <img
                    className="pd-main-img"
                    src={src}
                    alt={`${title} ${index + 1}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {badge && <div className="pd-new-badge">{badge}</div>}
          </div>

          {imageUrls.length > 1 && (
            <div className="pd-thumbs">
              {imageUrls.map((src, i) => (
                <div
                  key={i}
                  className={`pd-thumb ${productIdx === i ? "active" : ""}`}
                  onClick={() => {
                    setProductIdx(i);
                    if (swiperInstance) {
                      swiperInstance.slideToLoop(i);
                    }
                  }}
                >
                  <img src={src} alt={`${title} view ${i + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pd-info">
          <button
            className={`pd-fav-btn ${optimisticFavorite ? "active" : ""}`}
            onClick={handleFavorite}
          >
            {optimisticFavorite ? "❤️" : "🤍"}
          </button>

          {badge && <div className="pd-badge">{badge}</div>}

          <h1 className="pd-title">{title}</h1>
          <div className="pd-price">${price}</div>
          <p className="pd-desc">{description}</p>
          <button
            className={`pd-btn-cart ${added ? "added" : "idle"}`}
            onClick={handleAddToCart}
          >
            {added ? "✓ Added to Cart" : "Add to Cart"}
          </button>
          <div className="pd-badges">
            {TRUST_BADGES.map((b, i) => (
              <div key={i} className="pd-trust">
                <span className="pd-trust-icon">{b.icon}</span>

                <span className="pd-trust-txt">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
