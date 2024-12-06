import React from "react";
import "./SocialLinksModal.css";

const SocialLinksModal = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal-title">🌐 Bizi Takip Edin</h2>
        <p className="modal-subtitle">
          Sosyal medya hesaplarımızı keşfedin ve bağlantıda kalın!
        </p>
        <div className="social-links">
          <a
            href="https://www.linkedin.com/in/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link linkedin"
          >
            <i className="fab fa-linkedin"></i>
            LinkedIn
          </a>
          <a
            href="https://twitter.com/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link twitter"
          >
            <i className="fab fa-twitter"></i>X (Twitter)
          </a>
          <a
            href="https://www.instagram.com/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link instagram"
          >
            <i className="fab fa-instagram"></i>
            Instagram
          </a>
        </div>
      </div>
    </div>
  );
};

export default SocialLinksModal;
