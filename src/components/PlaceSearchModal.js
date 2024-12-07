import React, { useState, useEffect, useRef } from "react";
import MetroLines from "../metroLines.js";

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

  const calculateRoute = (startStation, endStation) => {
    debugger;
    const graph = buildGraph(MetroLines, startStation, endStation);

    const path = dijkstra(graph, startStation.name, endStation.name);

    if (!path || path.length === 0) {
      console.log("Route not found!");
      return;
    }

    // Detayları oluştur
    const details = buildRouteDetails(path);

    // Güzergah için durakları bulun ve hat bilgisi ekleyin
    const route = path.map((stationName) => {
      const station = MetroLines.flatMap((line) => line.stations).find(
        (station) => station.name === stationName
      );

      // İlgili hattı bulun
      const line = MetroLines.find((line) =>
        line.stations.some((s) => s.name === stationName)
      );

      return {
        ...station,
        line: line ? { id: line.id, name: line.name, color: line.color } : null, // Hat bilgisi
      };
    });

    debugger;
    return { route, details };
  };

  function buildGraph(lines) {
    const graph = {};

    lines.forEach((line) => {
      line.stations.forEach((station, index) => {
        if (!graph[station.name]) {
          graph[station.name] = {};
        }

        // Önceki istasyon bağlantısı
        if (index > 0) {
          const prevStation = line.stations[index - 1];
          graph[station.name][prevStation.name] = calculateDistance(
            station.location.lat,
            station.location.lng,
            prevStation.location.lat,
            prevStation.location.lng
          );
        }

        // Sonraki istasyon bağlantısı
        if (index < line.stations.length - 1) {
          const nextStation = line.stations[index + 1];
          graph[station.name][nextStation.name] = calculateDistance(
            station.location.lat,
            station.location.lng,
            nextStation.location.lat,
            nextStation.location.lng
          );
        }
      });
    });

    return graph;
  }

  // Dijkstra algoritması
  function dijkstra(graph, start, end) {
    const distances = {};
    const previous = {};
    const queue = new Set(Object.keys(graph));

    // Başlangıç noktaları başlatılıyor
    Object.keys(graph).forEach((node) => {
      distances[node] = Infinity;
      previous[node] = null;
    });
    distances[start] = 0;

    while (queue.size > 0) {
      const current = Array.from(queue).reduce((minNode, node) =>
        distances[node] < distances[minNode] ? node : minNode
      );

      if (current === end) break;

      queue.delete(current);

      Object.entries(graph[current]).forEach(([neighbor, weight]) => {
        const alt = distances[current] + weight;
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = current;
        }
      });
    }

    // Path oluşturuluyor
    const path = [];
    let currentNode = end;

    while (currentNode) {
      path.unshift(currentNode);
      currentNode = previous[currentNode];
    }

    return path.length ? path : null; // Eğer path boşsa null döndür
  }

  function buildRouteDetails(path) {
    if (!Array.isArray(path) || path.length < 2) {
      return [];
    }

    const details = [];
    let currentLine = null;
    let segmentStart = path[0];

    for (let i = 1; i < path.length; i++) {
      const currentStationName = path[i - 1];
      const nextStationName = path[i];

      const currentStation = MetroLines.flatMap((line) => line.stations).find(
        (station) => station.name === currentStationName
      );
      const nextStation = MetroLines.flatMap((line) => line.stations).find(
        (station) => station.name === nextStationName
      );

      if (!currentStation || !nextStation) continue;

      const line = MetroLines.find(
        (line) =>
          line.stations.some(
            (station) => station.name === currentStation.name
          ) &&
          line.stations.some((station) => station.name === nextStation.name)
      );

      if (!line) {
        // İki istasyon arasında doğrudan bir hat yoksa kesikli çizgi
        details.push({
          type: "dash",
          start: currentStation.name,
          end: nextStation.name,
          startLocation: currentStation.location,
          endLocation: nextStation.location,
        });
        segmentStart = nextStation.name; // Geçici bağlantı tamamlandı
        currentLine = null; // Yeni hat için sıfırla
        continue;
      }

      // Eğer aynı hat üzerinde devam ediliyorsa
      if (currentLine === line.name) {
        continue;
      }

      // Yeni bir hat başlıyor
      if (currentLine) {
        details.push({
          type: "line",
          lineName: currentLine,
          start: segmentStart,
          end: currentStation.name,
          startLocation: MetroLines.flatMap((line) => line.stations).find(
            (station) => station.name === segmentStart
          )?.location,
          endLocation: currentStation.location,
        });
      }

      currentLine = line.name;
      segmentStart = currentStation.name;
    }

    // Son segmenti ekle
    const finalStation = path[path.length - 1];
    const finalStationObject = MetroLines.flatMap((line) => line.stations).find(
      (station) => station.name === finalStation
    );

    if (currentLine && finalStationObject) {
      details.push({
        type: "line",
        lineName: currentLine,
        start: segmentStart,
        end: finalStation,
        startLocation: MetroLines.flatMap((line) => line.stations).find(
          (station) => station.name === segmentStart
        )?.location,
        endLocation: finalStationObject.location,
      });
    }

    return details;
  }

  const findTransferPoints = (lines, startStation, endStation) => {
    const transferPoints = [];
    lines.forEach((line) => {
      if (line.stations.some((station) => station.name === startStation.name)) {
        line.stations.forEach((station) => {
          lines.forEach((otherLine) => {
            if (
              otherLine !== line &&
              otherLine.stations.some(
                (otherStation) => otherStation.name === endStation.name
              )
            ) {
              otherLine.stations.forEach((otherStation) => {
                if (station.name === otherStation.name) {
                  transferPoints.push({
                    name: station.name,
                    location: station.location,
                  });
                }
              });
            }
          });
        });
      }
    });
    return transferPoints;
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
