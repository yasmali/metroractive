import React, { useState, useEffect, useRef } from "react";
import MetroLines from "../metroLines.js";
import { calculateDistance, calculateRoute } from "../utils/routeUtils.js";

export default function PlaceSearchModal({
  onClose,
  setPlaceA,
  setPlaceB,
  setRoute, // App.js'den rota aktarımı için prop
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
      // Başlangıç durağı için autocomplete
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
        setPlaceA(selectedPlace); // App.js'e aktarılır
        findNearestStations(selectedPlace, setNearestStationsA);
      });

      // Hedef durağı için autocomplete
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
        setPlaceB(selectedPlace); // App.js'e aktarılır
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
    if (nearestStationsA.length > 0 && nearestStationsB.length > 0) {
      const startStation = nearestStationsA[0];
      const endStation = nearestStationsB[0];

      const { route, details } = calculateRoute(startStation, endStation);
      setRoute(route); // App.js'e güzergah aktarılır
      setRouteDetails(details);
      onClose(); // Modal kapatılır
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
          return { ...station, distance: Infinity }; // Geçersiz koordinatlar için sonsuz mesafe
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

      // Geçerli mesafelere göre sıralama
      const validStations = stationsWithDistance.filter(
        (station) => station.distance !== Infinity
      );
      validStations.sort((a, b) => a.distance - b.distance); // Mesafeye göre sıralama

      // İlk 3 durağı al
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
          maxWidth: "600px",
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
          Duraklar Arası Güzergah
        </h2>

        {/* Başlangıç Durağı */}
        <div style={{ width: "100%", position: "relative" }}>
          <input
            ref={inputARef}
            type="text"
            placeholder="Başlangıç durağı ara..."
            style={{
              width: "100%",
              padding: "15px",
              paddingRight: "45px",
              border: "1px solid #dcdcdc",
              borderRadius: "20px",
              fontSize: "16px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Hedef Durağı */}
        <div style={{ width: "100%", position: "relative" }}>
          <input
            ref={inputBRef}
            type="text"
            placeholder="Hedef durağı ara..."
            style={{
              width: "100%",
              padding: "15px",
              paddingRight: "45px",
              border: "1px solid #dcdcdc",
              borderRadius: "20px",
              fontSize: "16px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Butonlar */}
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
            }}
          >
            Temizle
          </button>
          <button
            onClick={handleRouteCreate}
            style={{
              padding: "15px 30px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "15px",
              cursor: "pointer",
              fontSize: "17px",
            }}
          >
            Rota Oluştur
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
            }}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
