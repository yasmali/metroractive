// PlaceSearchModal.js
import React, { useState, useEffect, useRef } from "react";
import MetroLines from "../metroLines.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function PlaceSearchModal({ onClose, onSelectStation }) {
  const [place, setPlace] = useState(() => {
    const savedPlace = sessionStorage.getItem("savedPlace");
    return savedPlace ? JSON.parse(savedPlace) : null;
  });
  const [nearestStations, setNearestStations] = useState(() => {
    const savedStations = sessionStorage.getItem("savedStations");
    return savedStations ? JSON.parse(savedStations) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const istanbulBounds = {
    north: 41.3201, // İstanbul'un kuzey sınırı
    south: 40.8021, // İstanbul'un güney sınırı
    east: 29.4622, // İstanbul'un doğu sınırı
    west: 28.4088, // İstanbul'un batı sınırı
  };

  useEffect(() => {
    const loadAutocomplete = () => {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          bounds: istanbulBounds, // İstanbul sınırlarını belirtiyoruz
          strictBounds: true, // Sadece bu sınırlar içinde arama yapılır
          types: ["geocode", "establishment"],
        }
      );
      autocompleteRef.current.addListener("place_changed", () => {
        const selectedPlace = autocompleteRef.current.getPlace();
        setPlace(selectedPlace);
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

  useEffect(() => {
    if (place && place.geometry) {
      setIsLoading(true);
      // Seçilen yere en yakın 3 durağı bul
      const { lat, lng } = place.geometry.location;

      // Eğer lat veya lng undefined ise işlemi durdur
      if (typeof lat !== "function" || typeof lng !== "function") {
        console.error("Geçersiz yer bilgisi: latitude veya longitude eksik.");
        setIsLoading(false);
        return;
      }

      const location = { lat: lat(), lng: lng() };

      const allStations = MetroLines.flatMap((line) =>
        line.stations.map((station) => ({ ...station, line }))
      );

      const stationsWithDistance = allStations.map((station) => {
        // Eğer istasyonun koordinatları geçerli değilse mesafeyi hesaplamadan geç
        if (
          typeof station.location.lat !== "number" ||
          typeof station.location.lng !== "number"
        ) {
          console.error(
            "Geçersiz istasyon bilgisi: latitude veya longitude eksik."
          );
          return { ...station, distance: null };
        }

        return {
          ...station,
          distance: calculateDistance(
            location.lat,
            location.lng,
            station.location.lat,
            station.location.lng
          ),
        };
      });

      // Geçerli mesafeye sahip olan istasyonları filtrele
      const validStations = stationsWithDistance.filter(
        (station) => station.distance !== null
      );

      // İstasyonları isim bazında distinct hale getir
      const uniqueStations = Array.from(
        new Map(
          validStations.map((station) => [
            station.name,
            {
              ...station,
              lines: validStations
                .filter((s) => s.name === station.name)
                .map((s) => s.line.name), // Bağlı hatlar
            },
          ])
        ).values()
      );

      uniqueStations.sort((a, b) => a.distance - b.distance);

      setNearestStations(uniqueStations.slice(0, 3));
      setIsLoading(false);
    }
  }, [place]);

  useEffect(() => {
    if (place) {
      sessionStorage.setItem("savedPlace", JSON.stringify(place));
    }
    if (nearestStations.length > 0) {
      sessionStorage.setItem("savedStations", JSON.stringify(nearestStations));
    }
  }, [place, nearestStations]);

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Dünya'nın yarıçapı (km)
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Mesafe (km)
  };

  const handleClear = () => {
    setPlace(null);
    setNearestStations([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    sessionStorage.removeItem("savedPlace");
    sessionStorage.removeItem("savedStations");
  };

  return (
    <div
      className="modal-overlay-general"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        className="modal-content-general"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "30px",
          background: "#ffffff",
          borderRadius: "25px",
          boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.5)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          position: "relative",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#2c3e50",
            fontSize: "28px",
            fontWeight: "bold",
          }}
        >
          Yer Arama
        </h2>
        <div style={{ width: "100%", position: "relative" }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Bir yer arayın..."
            defaultValue={place?.name || ""} // Arama geçmişi korunuyor
            style={{
              width: "100%",
              padding: "15px",
              paddingRight: "45px", // Büyüteç simgesine yer açmak için sağ padding
              border: "1px solid #dcdcdc",
              borderRadius: "20px",
              fontSize: "16px",
              outline: "none",
              boxSizing: "border-box",
              transition: "box-shadow 0.3s ease, border-color 0.3s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow =
                "0px 8px 20px rgba(0, 123, 255, 0.5)";
              e.currentTarget.style.borderColor = "#007bff";
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "#dcdcdc";
            }}
          />
          <FontAwesomeIcon
            icon={faSearch}
            style={{
              position: "absolute",
              right: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#007bff",
              cursor: "pointer",
              fontSize: "20px",
            }}
          />
        </div>

        {isLoading ? (
          <div style={{ marginTop: "20px" }}>
            <div
              className="loader"
              style={{
                border: "6px solid #f3f3f3",
                borderTop: "6px solid #007bff",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                animation: "spin 1s linear infinite",
                margin: "0 auto",
              }}
            ></div>
            <p style={{ color: "#2c3e50", marginTop: "15px" }}>
              Duraklar aranıyor...
            </p>
          </div>
        ) : (
          nearestStations.length > 0 && (
            <div
              style={{
                backgroundColor: "#f0f4f8",
                borderRadius: "20px",
                padding: "25px",
                boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
                textAlign: "left",
                width: "100%",
              }}
            >
              <h3
                style={{
                  margin: "0 0 15px",
                  color: "#2c3e50",
                  fontSize: "22px",
                  fontWeight: "600",
                }}
              >
                En Yakın Duraklar
              </h3>
              <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                {nearestStations.map((station) => (
                  <li
                    key={station.id}
                    style={{
                      padding: "20px",
                      marginBottom: "12px",
                      borderRadius: "15px",
                      background: "#ffffff",
                      cursor: "pointer",
                      transition:
                        "background 0.3s, transform 0.3s, box-shadow 0.3s",
                      boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.08)",
                    }}
                    onClick={() => {
                      onSelectStation(station);
                      onClose();
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#e8f0fe";
                      e.currentTarget.style.transform = "scale(1.03)";
                      e.currentTarget.style.boxShadow =
                        "0px 10px 20px rgba(0, 0, 0, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#ffffff";
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow =
                        "0px 6px 18px rgba(0, 0, 0, 0.08)";
                    }}
                  >
                    <strong style={{ fontSize: "18px", color: "#2c3e50" }}>
                      {station.name}
                    </strong>
                    <br />
                    <span style={{ fontSize: "15px", color: "#7f8c8d" }}>
                      {station.distance != null
                        ? station.distance.toFixed(2)
                        : "Bilinmiyor"}{" "}
                      km uzaklıkta
                    </span>
                    <br />
                    <small style={{ fontSize: "14px", color: "#95a5a6" }}>
                      Hatlar: {station.lines.join(", ")}
                    </small>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            onClick={handleClear}
            style={{
              padding: "15px 30px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "15px",
              cursor: "pointer",
              fontSize: "17px",
              transition: "background 0.3s, transform 0.3s, box-shadow 0.3s",
              boxSizing: "border-box",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#5a6268";
              e.currentTarget.style.transform = "scale(1.07)";
              e.currentTarget.style.boxShadow =
                "0px 12px 30px rgba(0, 0, 0, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#6c757d";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Temizle
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "15px 30px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "15px",
              cursor: "pointer",
              fontSize: "17px",
              transition: "background 0.3s, transform 0.3s, box-shadow 0.3s",
              boxSizing: "border-box",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#0056b3";
              e.currentTarget.style.transform = "scale(1.07)";
              e.currentTarget.style.boxShadow =
                "0px 12px 30px rgba(0, 0, 0, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#007bff";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}

// CSS for loader animation
const loaderStyles = document.createElement("style");
loaderStyles.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(loaderStyles);
