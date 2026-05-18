import "./Hero.css";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">

      {/* 🎥 Video Background */}
      <video
        className="hero-video"
        autoPlay
        loop
        muted
        playsInline
        fetchPriority="high"
      >
        <source src="/hero.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay for readability */}
      <div className="overlay"></div>

      {/* Content */}
      <div className="hero-content">
        <h1>Elevate Your Everyday Shopping</h1>

        <p>
          Discover premium products designed for the modern consumer.
        </p>

        <div className="hero-buttons">
          <button
            className="primary-btn"
            onClick={() => navigate("/login")}
          >
            Sign Up To Explore Products
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/about")}
          >
            Our Story
          </button>
        </div>
      </div>

    </section>
  );
}