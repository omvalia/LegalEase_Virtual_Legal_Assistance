import React from "react";
import "../css/first_page.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h3>LegalEase</h3>
          <p>
            Simplifying your legal journey with expert solutions tailored to
            your needs.
          </p>
        </div>

        <div className="footer-section contact">
          <h4>Contact Us</h4>
          <p>Phone: +1 234 567 890</p>
          <p>Email: support@legalease.com</p>
          <p>1234 Legal Street, Lawtown, LA 56789</p>
        </div>

        <div className="footer-section social">
          <h4>Follow Us</h4>
          <div className="icons-container">
            <img
              src="/images/linkedin_logo.png"
              alt="LinkedIn"
              className="social-icon"
            />
            <img
              src="/images/instagram_logo.png"
              alt="Instagram"
              className="social-icon"
            />
            <img
              src="/images/twitter_logo.png"
              alt="Twitter"
              className="social-icon"
            />
          </div>
        </div>

        <div className="footer-section newsletter">
          <h4>Newsletter Signup</h4>
          <form>
            <input
              type="email"
              className="newsletter-input"
              placeholder="Enter your email"
              required
            />
            <button type="submit" className="newsletter-button">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 LegalEase. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
