import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';

const NewsPage = () => {
    const [newsArticles, setNewsArticles] = useState([]);

    // Fetch news from API
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(
                    "https://newsapi.org/v2/everything?q=law+OR+legal+OR+court+OR+cases+india&language=en&sortBy=publishedAt&apiKey=bd85a18e94ac481d9d073a9cfddf97e6"
                );
                const data = await response.json();
                if (data.articles) {
                    setNewsArticles(data.articles.slice(0, 10)); // Take the top 10 news articles
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
        <>
            <Navbar />
            <section className="news-section">
                <h2 className="news-header">Read the latest news on Law</h2>

                <div className="news-container">
                    {newsArticles.map((article, index) => (
                        <div key={index} className="news-item">
                            <img
                                className="news-image"
                                src={article.urlToImage}
                                alt="news image not loaded"
                            />
                            <h3>{article.title}</h3>
                            <p className="news-author">
                                <strong>Author:</strong> {article.author || "Unknown"}
                            </p>
                            <p className="news-date">
                                <strong>Published on:</strong> {new Date(article.publishedAt).toLocaleDateString()}
                            </p>
                            <p className="news-description">{article.description}</p>
                            <a href={article.url} target="_blank" rel="noopener noreferrer">
                                Read more
                            </a>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default NewsPage;
