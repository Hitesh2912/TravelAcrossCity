// Footer.js
import './App.css';

function Footer() {
  return (
    <footer className="App-footer">
      <p className="footer-text">
        🌍 Discover amazing places and plan your journey with us! 🚗 ✈️ 🚌 🚂
      </p>

      <div className="footer-links">
        <a href="https://facebook.com" target="_blank" rel="noreferrer">
          Facebook
        </a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">
          Instagram
        </a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer">
          Twitter
        </a>
      </div>

      <p className="footer-copy">
        © {new Date().getFullYear()} <strong>PlanMyJourney</strong>. All Rights Reserved.
      </p>
    </footer>
  );
}

export default Footer;
