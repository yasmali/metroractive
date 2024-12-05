import React, { useState } from "react";
import Map from "./components/Map";
import FeedbackModal from "./components/FeedbackModal";
import DonateModal from "./components/DonateModal";
import PlaceSearchModal from "./components/PlaceSearchModal"; // Yeni modalı import edin
import MetroLines from "./metroLines.js";
import "./App.css";

function App() {
  const [selectedLine, setSelectedLine] = useState(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false); // Geri bildirim modal kontrolü
  const [isDonateOpen, setIsDonateOpen] = useState(false); // Bağış modal kontrolü
  const [isPlaceSearchOpen, setIsPlaceSearchOpen] = useState(false); // Yeni modal için state
  const [selectedStation, setSelectedStation] = useState(null);

  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>
        İstanbul Metro Haritası {selectedLine && ` - ${selectedLine.name}`}
      </h1>
      <Map
        selectedLine={selectedLine}
        setSelectedLine={setSelectedLine}
        selectedStation={selectedStation}
        setSelectedStation={setSelectedStation}
      />
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          display: "flex",
          gap: "10px", // Butonlar arasında boşluk
        }}
      >
        <button
          onClick={() => setIsFeedbackOpen(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          Geri Bildirim
        </button>
        <button
          onClick={() => setIsDonateOpen(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          Donate Me
        </button>
        <button
          onClick={() => setIsPlaceSearchOpen(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#FFC107",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          Yer Ara
        </button>
      </div>
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
    </div>
  );
}

export default App;
