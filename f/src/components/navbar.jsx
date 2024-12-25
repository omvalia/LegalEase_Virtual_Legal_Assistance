import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const handleWorkspaceNavigation = () => {
    navigate('/workspace');
    setIsMenuOpen(false); // Close menu after navigation
  };

  const handleLawgptNavigation = () => {
    navigate('/lawgpt');
    setIsMenuOpen(false); // Close menu after navigation
  };

  const handleDocumentGenerationNavigation = () => {
    navigate('/documentgenerate');
    setIsMenuOpen(false); // Close menu after navigation
  };

  const handleNewsPageNavigation = () => {
    navigate('/news_page');
  };

  const handleLogout = () => {
    navigate("/");
    setIsMenuOpen(false); // Close menu after logout
  };


  return (
    <header className="navbar">
      <div className="logo-container">
        <img src="/images/logo.png" alt="Logo" className="logo" />
        <h1 className="site-title-navbar">LegalEase</h1>
      </div>
      <div className={`nav-buttons-navbar ${isMenuOpen ? 'open' : ''}`}>
        <button className="nav-btn-navbar" onClick={handleWorkspaceNavigation}>
          Workspace
        </button>
        <button className="nav-btn-navbar" onClick={handleLawgptNavigation}>
          LawGPT
        </button>
        <button className="nav-btn-navbar" onClick={handleDocumentGenerationNavigation}>
          Document Generation
        </button>       
        <button className="nav-btn-navbar" onClick={handleNewsPageNavigation}>
          Latest News
        </button>       
        <button className="nav-btn-navbar logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

    </header>
  );
};

export default Navbar;
