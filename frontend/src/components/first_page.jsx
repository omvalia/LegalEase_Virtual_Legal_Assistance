import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/first_page.css";
import Footer from "./footer.jsx";

const FirstPage = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [newsArticles, setNewsArticles] = useState([]); // State to store news articles
  const servicesSectionRef = useRef(null);
  const navigate = useNavigate();

  const scrollToServices = () => {
    servicesSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Navigation functions for each section
  const handleWorkspaceNavigation = () => {
    navigate("/workspace");
  };

  const handleLawGptNavigation = () => {
    navigate("/lawgpt");
  };

  const handleDocumentGenerateNavigation = () => {
    navigate("/Header");
  };

  const handleLoginNavigation = () => {
    navigate("/login");
  };

  const handleAuthenticate = () => {
    navigate("/slide");
  };

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          // "https://newsapi.org/v2/everything?q=law+legal+india&apiKey=bd85a18e94ac481d9d073a9cfddf97e6"
          "https://newsapi.org/v2/everything?q=law+OR+legal+OR+court+OR+cases+india&language=en&sortBy=publishedAt&apiKey=bd85a18e94ac481d9d073a9cfddf97e6"
        );
        const data = await response.json();
        if (data.articles) {
          setNewsArticles(data.articles.slice(0, 5)); // Only take top 5 news articles
        } else {
          console.error("No articles found in the response:", data);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="main-container">
      {/* Navbar Section */}
      <header className="navbar-nav">
        <div className="logo-container">
          <img src="/images/logo.png" alt="Logo" className="logo" />
          <h1 className="site-title-first">LegalEase</h1>
        </div>
        <div className="nav-buttons-first-page">
          <button className="nav-btn-first-page" onClick={handleAuthenticate}>
            Get Started
          </button>
        </div>
      </header>

      {/* Scrollable Section 1 */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            Solving your
            <br />
            problems head-on
          </h1>
          <p className="hero-description">
            We provide you with direct and expert legal care <br />
            so that you can resolve issues early and amicably.
          </p>
          <button className="see-service-btn" onClick={scrollToServices}>
            SEE SERVICE
          </button>
        </div>
      </section>

      {/* Scrollable Section 2 */}
      <section className="info-section">
        <div className="info-content-first">
          <h2>Your Legal Partner Every Step of the Way</h2>
          <p>
            At LegalEase, we know that navigating a legal case can be
            overwhelming. That's why we're committed to being your trusted
            partner throughout the process. From your initial consultation, our
            experienced legal team will provide personalized support, explain
            your rights, and develop a strategic plan tailored to your unique
            situation. Whether you need help with documentation or
            representation in court, we are here to guide you at every step.
            With clear communication and transparency, we empower you to make
            informed decisions, ensuring your legal challenges are resolved
            efficiently so you can focus on what truly matters.
          </p>
          <button className="action-btn" onClick={handleAuthenticate}>
            Get in Touch
          </button>
        </div>
        <img
          src="/images/sec2_img.png"
          alt="Legal assistance"
          className="info-image"
        />
      </section>

      {/* Scrollable Section 3 */}
      <section className="services-section" ref={servicesSectionRef}>
        <h2 className="services-header">Services We Provide</h2>
        <div className="services-content">
          <div className="service-box">
            {/* onClick={handleWorkspaceNavigation} */}
            <h3>Management System</h3>
            <p>
              Our Case Management System allows users to select a lawyer based
              on their specific needs, ensuring a tailored legal experience.
              Once a request is made, the chosen lawyer can easily accept or
              reject it, streamlining the client-lawyer engagement process.
            </p>
          </div>

          <div className="service-box">
            {/* onClick={handleLawGptNavigation} */}
            <h3>LawGPT</h3>
            <p>
              LawGPT is an intelligent chatbot designed to assist lawyers with
              legal inquiries, providing instant responses and guidance on
              various legal matters. By leveraging advanced AI technology, it
              offers personalized support, making legal information easily
              accessible.
            </p>
          </div>

          <div className="service-box">
            {/* onClick={handleDocumentGenerateNavigation} */}
            <h3>Document Generation</h3>
            <p>
              Users can easily fill out an online form to provide essential
              details, enabling lawyers to generate legal documents quickly and
              efficiently. This digital approach streamlines the document
              creation process, reducing time and minimizing errors. By
              automating these tasks, we ensure that legal documents are
              accurate and tailored to meet individual client needs.
            </p>
          </div>

          <div className="service-box">
            <img
              src="/images/provide_lawyer_img.png"
              alt="Provide Lawyer"
              className="service-image"
            />
          </div>
        </div>
      </section>

      {/* Scrollable Section 4 */}
      {/* <section className="news-section">
        <img
          src="/images/news_page_img.png"
          alt="News"
          className="news-image"
        />
        <h2 className="news-header">Read the latest news on Law</h2>

        <div className="news-container">
          {newsArticles.map((article, index) => (
            <div key={index} className="news-item">
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
            </div>
          ))}
        </div>
      </section> */}

      {/* Sliding Menu */}
      {isMenuOpen && (
        <div className={`slide-menu ${isMenuOpen ? "open" : ""}`}>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Services</li>
            <li>Contact</li>
          </ul>
        </div>
      )}

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default FirstPage;
