import React, { useState, useEffect, useRef } from "react";
import MetroLines from "../metroLines.js";
import { calculateDistanceFixed } from "../utils/routeUtils.js";
import "./PlaceFinderModal.css";

export default function PlaceFinderModal({ onClose }) {
  const [nearestStations, setNearestStations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const istanbulBounds = {
    north: 41.3201,
    south: 40.8021,
    east: 29.4622,
    west: 28.4088,
  };

  useEffect(() => {
    // Load previous search data from sessionStorage
    const previousSearch = sessionStorage.getItem("searchInput");
    const previousStations = sessionStorage.getItem("nearestStations");

    if (previousSearch) {
      setSearchInput(previousSearch);
    }
    if (previousStations) {
      setNearestStations(JSON.parse(previousStations));
    }

    const loadAutocomplete = () => {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          bounds: istanbulBounds,
          strictBounds: true,
          types: ["geocode", "establishment"],
        }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const selectedPlace = autocompleteRef.current.getPlace();
        findNearestStations(selectedPlace);
      });
    };

    if (window.google) {
      loadAutocomplete();
    } else {
      window.initMap = () => {
        loadAutocomplete();
      };
    }
  }, []);

  const findNearestStations = (place) => {
    if (!place || !place.geometry) {
      alert("Geçersiz yer seçimi. Lütfen doğru bir yer seçin.");
      return;
    }

    setIsLoading(true);
    const { lat, lng } = place.geometry.location;

    const location = { lat: lat(), lng: lng() };
    const allStations = MetroLines.flatMap((line) =>
      line.stations.map((station) => ({
        ...station,
        lineName: line.name,
        lineColor: line.color,
      }))
    );

    const stationsWithDistance = allStations.map((station) => ({
      ...station,
      distance: calculateDistanceFixed(
        location.lat,
        location.lng,
        station.location.lat,
        station.location.lng
      ),
    }));

    const sortedStations = stationsWithDistance.sort(
      (a, b) => a.distance - b.distance
    );

    // Group stations by name, merging line names and colors
    const groupedStations = sortedStations.reduce((acc, station) => {
      const existing = acc.find((s) => s.name === station.name);
      if (existing) {
        existing.lines.push({
          lineName: station.lineName,
          lineColor: station.lineColor,
        });
      } else {
        acc.push({
          ...station,
          lines: [{ lineName: station.lineName, lineColor: station.lineColor }],
        });
      }
      return acc;
    }, []);

    const closestStations = groupedStations.slice(0, 3);

    // Save search input and results to sessionStorage
    sessionStorage.setItem("searchInput", place.name);
    sessionStorage.setItem("nearestStations", JSON.stringify(closestStations));

    setSearchInput(place.name);
    setNearestStations(closestStations);
    setIsLoading(false);
  };
  const handleClear = () => {
    if (inputRef.current) inputRef.current.value = "";
    setSearchInput("");
    setNearestStations([]);
    sessionStorage.removeItem("searchInput");
    sessionStorage.removeItem("nearestStations");
  };

  return (
    <div className="modal-overlay-place" onClick={onClose}>
      <div
        className="modal-content-place"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90%",
          maxWidth: "500px",
          background: "#fff",
          borderRadius: "20px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
          padding: "30px",
          textAlign: "center",
          animation: "slideIn 0.4s ease-in-out",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2
          style={{ color: "#2c3e50", fontSize: "28px", marginBottom: "10px" }}
        >
          Yer Ara
        </h2>
        <p style={{ fontSize: "16px", color: "#555", marginBottom: "20px" }}>
          Bir yer seçin ve en yakın metro istasyonlarını öğrenin.
        </p>

        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            placeholder="Bir yer arayın..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              fontSize: "16px",
              boxSizing: "border-box",
              outline: "none",
            }}
          />
          {searchInput && (
            <button
              className="clear-btn"
              onClick={() => setSearchInput("")}
              aria-label="Temizle"
            >
              ✖
            </button>
          )}
        </div>

        {isLoading && <p>En yakın istasyonlar hesaplanıyor...</p>}
        {!isLoading && nearestStations.length > 0 && (
          <div>
            <h3>En Yakın İstasyonlar:</h3>
            <ul style={{ textAlign: "left", paddingLeft: "20px" }}>
              {nearestStations.map((station) => (
                <li key={station.id}>
                  {station.name} - {station.distance} km
                  <div style={{ maxWidth: "50%" }}>
                    {station.lines.map((line, index) => (
                      <span
                        key={index}
                        style={{
                          color: line.lineColor,
                          fontWeight: "bold",
                          marginRight: "10px",
                        }}
                      >
                        {line.lineName}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            onClick={handleClear}
            style={{
              background: "#6c757d",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#5a6268")}
            onMouseLeave={(e) => (e.target.style.background = "#6c757d")}
          >
            Temizle
          </button>
          <button
            onClick={onClose}
            style={{
              background: "#ff5a5f",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#e94e4b")}
            onMouseLeave={(e) => (e.target.style.background = "#ff5a5f")}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
