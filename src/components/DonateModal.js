import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRocket,
  faHandshake,
  faHeart,
  faBrain,
} from "@fortawesome/free-solid-svg-icons";

export default function DonateModal({ onClose }) {
  const [amount, setAmount] = useState(50); // Varsayılan bağış miktarı
  const [customAmount, setCustomAmount] = useState(""); // Özel bağış miktarı
  const [message, setMessage] = useState(""); // Mesaj
  const [showThanks, setShowThanks] = useState(false); // Teşekkür ekranı kontrolü

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalAmount = customAmount || amount; // Özel miktar seçildiyse onu kullan
    console.log("Bağış Miktarı:", finalAmount);
    console.log("Mesaj:", message);
    setShowThanks(true); // Teşekkür ekranına geç
    setTimeout(onClose, 3000); // 3 saniye sonra modal kapanır
  };

  return (
    <div
      className="modal-overlay-general"
      onClick={onClose} // Modal dışına tıklayınca kapanır
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "10px", // Ekranda taşma durumunda kaymaları azaltmak için padding eklendi
        boxSizing: "border-box", // Paddinglerin toplam boyutu etkilemesini önler
      }}
    >
      <div
        className="modal-content-general"
        onClick={(e) => e.stopPropagation()} // Modal içeriğine tıklayınca kapanmayı engeller
        style={{
          width: "100%",
          maxWidth: "450px",
          padding: "20px",
          background: "#ffffff",
          borderRadius: "15px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.4)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          position: "relative",
          overflow: "hidden", // Kısmi taşma sorunlarını önlemek için overflow eklendi
        }}
      >
        {!showThanks ? (
          <>
            {/* Proje Desteği Temalı Başlık */}
            <div
              style={{
                background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                padding: "20px",
                borderRadius: "15px 15px 0 0",
                color: "white",
                fontSize: "20px",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon icon={faRocket} size="2x" />
              <div style={{ marginLeft: "10px" }}>Projeme Destek Ol!</div>
            </div>

            <p
              style={{
                fontSize: "16px",
                color: "#555",
                margin: "10px 0",
                lineHeight: "1.5",
              }}
            >
              Bu projeyi daha da büyütmek için senin yardımına ihtiyacım var!
              Bağış yaparak projeme destek olabilirsin. Her bağış, daha iyi
              içerikler ve geliştirmeler için çok önemli!
            </p>

            {/* Hızlı Bağış Seçenekleri */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                gap: "10px",
              }}
            >
              {[200, 500, 1000].map((value, index) => {
                const icons = [faHandshake, faHeart, faBrain];
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setAmount(value);
                      setCustomAmount(""); // Özel miktarı sıfırla
                    }}
                    style={{
                      padding: "15px",
                      backgroundColor: value === amount ? "#28a745" : "#f3f3f3",
                      color: value === amount ? "white" : "#000",
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "14px",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={icons[index]}
                      size="2x"
                      style={{ color: value === amount ? "white" : "#28a745" }}
                    />
                    ₺{value}
                  </button>
                );
              })}
            </div>

            {/* Özel Bağış Miktarı */}
            <input
              type="number"
              placeholder="Özel bir miktar girin (₺)"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "14px",
                boxSizing: "border-box", // Boyut sorunlarını önlemek için eklendi
              }}
            />

            {/* Mesaj Alanı */}
            <textarea
              placeholder="Bir mesaj bırakın (isteğe bağlı)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: "100%",
                height: "100px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "14px",
                resize: "none",
                boxSizing: "border-box", // Boyut sorunlarını önlemek için eklendi
              }}
            ></textarea>

            {/* Gönder ve İptal Butonları */}
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#f3f3f3",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                    flex: 1,
                  }}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                    flex: 1,
                  }}
                >
                  Bağış Yap
                </button>
              </div>
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
            <p style={{ fontSize: "16px", color: "#555", lineHeight: "1.5" }}>
              Destek verdiğiniz için çok teşekkür ederim! Her bağış, projeme güç
              katıyor. 🙏
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
