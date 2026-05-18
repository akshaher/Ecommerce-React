import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div>
          <h2>ShopSmart</h2>
          <p>Your trusted shopping partner.</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <p>Privacy Policy</p>
          <p>Contact</p>
        </div>

        <div>
          <h4>Newsletter</h4>

          <div className="newsletter">
            <input type="email" placeholder="Email" />
            <button>Join</button>
          </div>
        </div>

      </div>

    </footer>
  );
}