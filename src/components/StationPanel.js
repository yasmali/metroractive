import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

const categories = [
  { label: "Ulaşım", value: "bus_station" },
  { label: "Alışveriş", value: "shopping_mall" },
  { label: "Eğitim", value: "school" },
  { label: "Hastane", value: "hospital" },
  { label: "Restoran", value: "restaurant" },
  { label: "Eğlence", value: "night_club" },
  { label: "Kültür Sanat", value: "museum" },
  { label: "Dini Tesisler", value: "mosque" },
];

export default function StationPanel({
  selectedStation,
  findLinesForStation,
  fetchNearbyPlaces,
  nearbyPlaces,
  selectedCategories,
  setSelectedCategories,
  isPanelLoading,
}) {
  const handleCategoryChange = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((cat) => cat !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedCategories);
    fetchNearbyPlaces(selectedStation.location, updatedCategories);
  };

  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        width: "300px",
        padding: "20px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        zIndex: 1,
      }}
    >
      {/* Panel Aç/Kapa Butonu */}
      {selectedStation && (
        <button
          onClick={togglePanel}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "transparent",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
            transform: isPanelOpen ? "rotate(0deg)" : "rotate(180deg)",
            transition: "transform 0.3s ease",
          }}
          title={isPanelOpen ? "Paneli Kapat" : "Paneli Aç"}
        >
          <FontAwesomeIcon
            icon={isPanelOpen ? faChevronUp : faChevronDown}
            style={{ color: "#333" }}
          />
        </button>
      )}

      {isPanelOpen ? (
        selectedStation ? (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center", // Yatayda hizalama
                gap: "10px", // Durak ismi ve buton arasında boşluk
              }}
            >
              <h3
                style={{
                  margin: "0",
                  fontSize: "18px",
                  color: "#333",
                }}
              >
                {selectedStation.name} Durağı
              </h3>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedStation.location.lat},${selectedStation.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  padding: "5px 10px",
                  backgroundColor: "#007BFF",
                  color: "white",
                  borderRadius: "5px",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.3)",
                  display: "flex",
                  alignItems: "center", // Simge ve metni dikeyde hizalar
                  cursor: "pointer",
                }}
                title="Yol Tarifi Al"
              >
                <i
                  className="fas fa-directions"
                  style={{ fontSize: "16px" }}
                ></i>
                <span style={{ fontSize: "14px" }}></span>
              </a>
            </div>
            <p
              style={{
                margin: "5px 0",
                fontSize: "14px",
                color: "#555",
              }}
            >
              Hatlar: {findLinesForStation(selectedStation).join(", ")}
            </p>
            <p style={{ margin: "0 0 10px", fontSize: "14px", color: "#555" }}>
              Bu durak {selectedStation.name} durağıdır. Aşağıdan sosyal alan
              kategorilerini seçerek yakındaki yerleri filtreleyebilirsiniz:
            </p>

            {/* Checkbox listesi */}
            <div
              style={{
                marginBottom: "10px",
                overflowY: "auto",
                maxHeight: "100px",
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              {categories.map((category) => (
                <div key={category.value} style={{ marginBottom: "5px" }}>
                  <input
                    type="checkbox"
                    id={category.value}
                    checked={selectedCategories.includes(category.value)}
                    onChange={() => handleCategoryChange(category.value)}
                  />
                  <label
                    htmlFor={category.value}
                    style={{
                      marginLeft: "10px",
                      fontSize: "14px",
                      color: "#555",
                      cursor: "pointer",
                    }}
                  >
                    {category.label}
                  </label>
                </div>
              ))}
            </div>

            {/* Loader */}
            {isPanelLoading && (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <div className="loader"></div>
                <p style={{ fontSize: "14px", color: "#666" }}>Yükleniyor...</p>
              </div>
            )}

            {!isPanelLoading && (
              <ul
                style={{
                  paddingLeft: "20px",
                  margin: "0", // Margin sıfırlandı
                  maxHeight: "350px", // Liste için maksimum yükseklik ayarlandı
                  overflowY: "auto", // Dikey kaydırma özelliği eklendi
                  overflowX: "hidden", // Yatay kaydırmayı engellemek için
                  border: "1px solid #ddd", // Liste kutusu çevresine kenarlık eklendi
                  borderRadius: "5px", // Kenarlar yuvarlatıldı
                  padding: "10px", // İçerik için iç boşluk
                }}
              >
                {nearbyPlaces.map((place, index) => (
                  <li
                    key={index}
                    style={{
                      fontSize: "14px",
                      color: "#007BFF",
                      marginBottom: "5px",
                    }}
                  >
                    {place.name} ({place.distance} km)
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <p
            style={{
              fontSize: "14px",
              color: "#666",
              textAlign: "center",
            }}
          >
            Bir durak seçin, bilgileri burada görün.
          </p>
        )
      ) : (
        <p style={{ fontSize: "12px", textAlign: "center" }}>
          Durak bilgilerini görüntülemek için paneli açınız.
        </p>
      )}
    </div>
  );
}
