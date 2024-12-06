import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function FeedbackModal({ onClose }) {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [showThanks, setShowThanks] = useState(false); // Teşekkür ekranı için state

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Geri Bildirim:", feedback);
    console.log("Puan:", rating);
    setShowThanks(true); // Teşekkür ekranına geçiş
    setTimeout(onClose, 2000); // 2 saniye sonra modal kapanır
  };

  return (
    <div
      className="modal-overlay-general"
      onClick={onClose} // Modal dışında bir yere tıklandığında kapanır
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content-general"
        onClick={(e) => e.stopPropagation()} // Modal içeriğine tıklandığında kapanmayı engelle
        style={{
          width: "450px",
          padding: "30px",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {!showThanks ? (
          <>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#007BFF",
              }}
            >
              <FontAwesomeIcon
                icon={faCommentDots}
                style={{ marginRight: "10px" }}
              />
              Geri Bildirim
            </h2>
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Görüşlerinizi buraya yazın..."
                style={{
                  width: "100%",
                  height: "100px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  fontSize: "14px",
                  resize: "none",
                }}
                required
              ></textarea>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                  Puan Verin
                </p>
                <div style={{ display: "flex", gap: "5px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setRating(star)}
                      style={{
                        fontSize: "24px",
                        cursor: "pointer",
                        color: star <= rating ? "#FFD700" : "#ccc",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007BFF",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
                Gönder
              </button>
            </form>
          </>
        ) : (
          <div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#28a745",
              }}
            >
              🎉 Teşekkürler!
            </h2>
            <p style={{ fontSize: "16px", color: "#555" }}>
              Geri bildiriminiz için teşekkür ederiz. Görüşleriniz bizim için
              çok değerli!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
