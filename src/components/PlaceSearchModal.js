import React, { useState, useEffect, useRef } from "react";
import MetroLines from "../metroLines.js";
import { calculateDistance, calculateRoute } from "../utils/routeUtils.js";

export default function PlaceSearchModal({
  onClose,
  setPlaceA,
  setPlaceB,
  setRoute,
  setRouteDetails,
}) {
  const [nearestStationsA, setNearestStationsA] = useState([]);
  const [nearestStationsB, setNearestStationsB] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputARef = useRef(null);
  const inputBRef = useRef(null);
  const autocompleteARef = useRef(null);
  const autocompleteBRef = useRef(null);

  const istanbulBounds = {
    north: 41.3201,
    south: 40.8021,
    east: 29.4622,
    west: 28.4088,
  };

  useEffect(() => {
    const loadAutocomplete = () => {
      autocompleteARef.current = new window.google.maps.places.Autocomplete(
        inputARef.current,
        {
          bounds: istanbulBounds,
          strictBounds: true,
          types: ["geocode", "establishment"],
        }
      );
      autocompleteARef.current.addListener("place_changed", () => {
        const selectedPlace = autocompleteARef.current.getPlace();
        setPlaceA(selectedPlace);
        findNearestStations(selectedPlace, setNearestStationsA);
      });

      autocompleteBRef.current = new window.google.maps.places.Autocomplete(
        inputBRef.current,
        {
          bounds: istanbulBounds,
          strictBounds: true,
          types: ["geocode", "establishment"],
        }
      );
      autocompleteBRef.current.addListener("place_changed", () => {
        const selectedPlace = autocompleteBRef.current.getPlace();
        setPlaceB(selectedPlace);
        findNearestStations(selectedPlace, setNearestStationsB);
      });
    };

    if (window.google) {
      loadAutocomplete();
    } else {
      window.initMap = () => {
        loadAutocomplete();
      };
    }
  }, [setPlaceA, setPlaceB]);

  const handleRouteCreate = () => {
    debugger;
    if (nearestStationsA.length > 0 && nearestStationsB.length > 0) {
      const startStation = nearestStationsA[0];
      const endStation = nearestStationsB[0];

      const { route, details } = calculateRoute(startStation, endStation);
      setRoute(route);
      setRouteDetails(details);
      onClose();
    }
  };

  const findNearestStations = (place, setStations) => {
    if (place && place.geometry) {
      setIsLoading(true);
      const { lat, lng } = place.geometry.location;
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
        if (
          typeof station.location.lat !== "number" ||
          typeof station.location.lng !== "number"
        ) {
          console.error(
            "Geçersiz istasyon bilgisi: latitude veya longitude eksik."
          );
          return { ...station, distance: Infinity };
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

      const validStations = stationsWithDistance.filter(
        (station) => station.distance !== Infinity
      );
      validStations.sort((a, b) => a.distance - b.distance);
      const closestStations = validStations.slice(0, 3);

      setStations(closestStations);
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setPlaceA(null);
    setPlaceB(null);
    setNearestStationsA([]);
    setNearestStationsB([]);
    if (inputARef.current) inputARef.current.value = "";
    if (inputBRef.current) inputBRef.current.value = "";
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
        background: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="modal-content-general"
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
          🚇 Rota Planlayıcı
        </h2>
        <p style={{ fontSize: "16px", color: "#555", marginBottom: "20px" }}>
          Başlangıç ve hedef noktalarınızı seçerek en yakın istasyonları bulun
          ve bir güzergah oluşturun.
        </p>

        <input
          ref={inputARef}
          type="text"
          placeholder="Başlangıç noktası"
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
        <input
          ref={inputBRef}
          type="text"
          placeholder="Hedef noktası"
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            fontSize: "16px",
            boxSizing: "border-box",
            outline: "none",
          }}
        />

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
            onClick={handleRouteCreate}
            style={{
              background: "#007bff",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#0056b3")}
            onMouseLeave={(e) => (e.target.style.background = "#007bff")}
          >
            Rota Oluştur
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
