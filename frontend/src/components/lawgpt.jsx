import React, { useState } from "react";
import "../css/lawgpt.css";
import Navbar from "./navbar";

const Lawgpt = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = { sender: "user", text: question };
    setMessages([...messages, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const result = await fetch("http://localhost:5005/ask-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userMessage.text }),
      });

      const data = await result.json();
      const botMessage = { sender: "bot", text: data.answer };
      setMessages((prevMessages) => [...prevMessages, botMessage]); // Add only bot's response
    } catch (error) {
      const errorMessage = { sender: "bot", text: "Error fetching response" };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
      <div className="lawgpt-container">
        <h2 className="text-center title">LawGPT</h2>
        <p className="description">
          Your AI legal assistant, ready to answer questions.
        </p>

        <div className="chat-window">
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <div className="message-content">{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="message bot">
                <div className="message-content typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="chat-input">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a legal question..."
            className="form-control input-dark"
            required
          />
          <button
            type="submit"
            className="send-btn"
            disabled={loading || !question.trim()}
          >
            {loading ? "Generating..." : "Send"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Lawgpt;
