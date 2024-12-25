// Navbar.jsx
import React from 'react';
import './first_page.css'; // Ensure to create and import a CSS file for styling if needed

const Navbar = ({ isLoggedIn, handleLoginNavigation, handleSignupNavigation, toggleMenu }) => {
  return (
    <header className="navbar">
      <div className="logo-container">
        <img src="/images/logo.png" alt="Logo" className="logo" />
        <h1 className="site-title">LegalEase</h1>
      </div>
      <div className="nav-buttons">
        <button className="nav-btn" onClick={handleLoginNavigation}>Login</button>
        <button className="nav-btn" onClick={handleSignupNavigation}>Sign Up</button>

        {isLoggedIn && (
          <button className="menu-btn" onClick={toggleMenu}>
            &#9776;
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;