import React, { useState } from "react";
import Map from "./components/Map";
import FeedbackModal from "./components/FeedbackModal";
import DonateModal from "./components/DonateModal";
import PlaceSearchModal from "./components/PlaceSearchModal";
import Logo from "./assets/durak360-logo.svg";
import SocialLinksModal from "./components/SocialLinksModal";
import "./App.css";

function App() {
  const [selectedLine, setSelectedLine] = useState(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isPlaceSearchOpen, setIsPlaceSearchOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);

  return (
    <div>
      {/* Header Bölümü */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          backgroundColor: "#f8f9fa",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={Logo}
            alt="Durak360 Logo"
            style={{
              height: "50px",
              cursor: "pointer",
            }}
            onClick={() => setIsSocialModalOpen(true)}
          />
        </div>
        <h2
          style={{
            fontSize: "20px",
            margin: 0,
            color: "#2c3e50",
            flex: 1,
            textAlign: "center",
          }}
        >
          İstanbul Metro Haritası {selectedLine && ` - ${selectedLine.name}`}
        </h2>
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={() => setIsFeedbackOpen(true)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              fontSize: "16px",
            }}
          >
            Geri Bildirim
          </button>
          <button
            onClick={() => setIsDonateOpen(true)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              fontSize: "16px",
            }}
          >
            Donate Me
          </button>
          <button
            onClick={() => setIsPlaceSearchOpen(true)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#FFC107",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              fontSize: "16px",
            }}
          >
            Yer Ara
          </button>
        </div>
      </div>
      {/* Map ve Diğer İçerikler */}
      <Map
        selectedLine={selectedLine}
        setSelectedLine={setSelectedLine}
        selectedStation={selectedStation}
        setSelectedStation={setSelectedStation}
      />
      {isFeedbackOpen && (
        <FeedbackModal onClose={() => setIsFeedbackOpen(false)} />
      )}
      {isDonateOpen && <DonateModal onClose={() => setIsDonateOpen(false)} />}
      {isPlaceSearchOpen && (
        <PlaceSearchModal
          onClose={() => setIsPlaceSearchOpen(false)}
          onSelectStation={(station) => {
            setSelectedStation(station);
            setSelectedLine(station.line);
          }}
        />
      )}
      {isSocialModalOpen && (
        <SocialLinksModal onClose={() => setIsSocialModalOpen(false)} />
      )}
    </div>
  );
}

export default App;