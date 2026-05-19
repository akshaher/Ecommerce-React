import { useNavigate } from "react-router-dom";
import "./About.css";

export default function About() {

    const navigate=useNavigate();

  return (
    <div className="about-page">

      {/* HERO SECTION */}
      <section className="about-hero">
          <button className="back-button" onClick={()=>{navigate('/home')}}>Back to Home Page</button>

        <div className="hero-overlay"></div>
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
          alt="about-banner"
        />

        <div className="hero-content">
          <span className="badge">EST. 2024</span>

          <h1>Our Journey</h1>

          <p>
            Founded on the principle of efficiency and clarity,
            ShopSmart was built to redefine the modern shopping experience.
          </p>
        </div>

      </section>

      {/* STORY SECTION */}
      <section className="story-section">

        <div className="story-image">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
            alt="team"
          />
        </div>

        <div className="story-content">

          <h2>A Vision Born in 2024</h2>

          <p>
            ShopSmart was conceived by industry veterans who
            wanted to simplify online shopping and eliminate
            cluttered experiences.
          </p>

          <p>
            Our mission is to provide premium products with
            clarity, trust, and minimalism.
          </p>

          <div className="stats">

            <div>
              <h3>100+</h3>
              <span>Quality Partners</span>
            </div>

            <div>
              <h3>24/7</h3>
              <span>Support</span>
            </div>

          </div>

        </div>

      </section>

      {/* VALUES SECTION */}
      <section className="values-section">

        <div className="section-title">
          <h2>Commitment to Excellence</h2>

          <p>
            The pillars that support every decision we make.
          </p>
        </div>

        <div className="values-grid">

          <div className="value-card large">
            <h3>Uncompromising Quality</h3>

            <p>
              Every product undergoes strict inspection
              before being listed on ShopSmart.
            </p>
          </div>

          <div className="value-card dark">
            <h3>Efficiency First</h3>

            <p>
              Streamlined shopping experience in under
              three clicks.
            </p>
          </div>

          <div className="value-card">
            <h3>Clarity of Mind</h3>

            <p>
              No unnecessary distractions — only products
              and information that matter.
            </p>
          </div>

          <div className="value-card large team-card">
            <h3>The Team Behind the Tech</h3>

            <p>
              Designers, engineers, and innovators creating
              the future of ecommerce.
            </p>

            <div className="team-images">

              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt=""
              />

              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt=""
              />

              <img
                src="https://randomuser.me/api/portraits/women/68.jpg"
                alt=""
              />

            </div>

          </div>

        </div>

      </section>

      {/* TIMELINE */}
      <section className="timeline-section">

        <h2>Our Milestones</h2>

        <div className="timeline">

          <div className="timeline-item">
            <h4>January 2024</h4>

            <h3>The Foundation</h3>

            <p>
              ShopSmart was officially launched with a vision
              to modernize ecommerce.
            </p>
          </div>

          <div className="timeline-item">
            <h4>May 2024</h4>

            <h3>Beta Launch</h3>

            <p>
              Released to early adopters with positive feedback.
            </p>
          </div>

          <div className="timeline-item">
            <h4>October 2024</h4>

            <h3>Global Reach</h3>

            <p>
              Expanded to multiple countries with thousands
              of customers.
            </p>
          </div>

        </div>

      </section>

      {/* CTA SECTION */}
      <section className="cta-section">

        <h2>Ready to experience the future?</h2>

        <p>
          Join thousands of smart shoppers worldwide.
        </p>

        <div className="cta-buttons">

          <button className="primary-btn">
            Shop Products
          </button>

          <button className="secondary-btn">
            View Lookbook
          </button>

        </div>

      </section>

    </div>
  );
}