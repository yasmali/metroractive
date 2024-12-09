import React, { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";
import trainIcon from "../assets/train.png";
import StationPanel from "./StationPanel";
import MetroLines from "../metroLines.js";
import MapStyle from "../mapStyle.js";
import { calculateDistanceFixed } from "../utils/routeUtils.js";

// Harita stil ayarları
const mapContainerStyle = {
  width: "100%",
  height: "94vh",
  borderRadius: "15px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
};

const libraries = ["places"];

// İstanbul merkez konumu
const center = { lat: 41.02937035599793, lng: 29.030050422002546 };

const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};

// Polyline seçenekleri
const polylineOptions = (color, isSelected) => ({
  strokeColor: isSelected ? `rgba(${hexToRgb(color)}, 1)` : color,
  strokeOpacity: isSelected ? 1 : 0.8,
  strokeWeight: isSelected ? 10 : 8,
  geodesic: true,
  zIndex: isSelected ? 10 : 5,
  icons: isSelected
    ? [
        {
          icon: {
            path: "M 0,-1 0,1",
            strokeOpacity: 0.8,
            strokeWeight: 22,
            strokeColor: `rgba(${hexToRgb(color)}, 0.3)`,
          },
          offset: "0",
          repeat: "10px",
        },
      ]
    : [],
});

const routePolylineOptions = {
  strokeColor: "rgba(255, 165, 0, 0.8)", // Altın rengi
  strokeWeight: 8, // Çizgi kalınlığı
  strokeOpacity: 1, // Çizgi opaklığı
  zIndex: 30, // Çizgi önceliği
  icons: [
    {
      icon: {
        path: "M 0 0 m -2, 0 a 2,2 0 1,0 4,0 a 2,2 0 1,0 -4,0", // Çember SVG path
        fillOpacity: 1,
        fillColor: "rgba(255, 215, 0, 0.9)", // Çemberin dolgu rengi
        strokeOpacity: 1,
        strokeColor: "rgba(255, 165, 0, 1)", // Çember kenar rengi
        scale: 2, // Çember büyüklüğü
      },
      offset: "0", // İlk sembolün başlangıç noktası
      repeat: "20px", // Semboller arasındaki mesafe
    },
  ],
};

const restrictedBounds = {
  north: 41.5,
  south: 40.5,
  east: 29.9,
  west: 27.8,
};

export default function Map({
  selectedLine,
  setSelectedLine,
  selectedStation,
  setSelectedStation,
  placeA,
  placeB,
  route,
  routeDetails,
  setRouteDetails,
  setPlaceA,
  setPlaceB,
}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCIGAdr7-swS3vx_cj0pJAMKmMEKk14Wj4",
    libraries,
  });

  const mapRef = useRef(null);
  const [routePolyline, setRoutePolyline] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [mapZoom, setMapZoom] = useState(6);
  const [trainPosition, setTrainPosition] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isPanelLoading, setIsPanelLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);

  const dashedLineOptions = {
    strokeOpacity: 0, // Ana çizgi görünmez yapılır
    strokeWeight: 4, // Çizgi kalınlığı
    icons: [
      {
        icon: {
          path: "M 0,-1 0,1", // Kesikli çizgi sembolü
          strokeOpacity: 1,
          scale: 4,
        },
        offset: "0",
        repeat: "20px", // Kesikler arasındaki boşluk
      },
    ],
  };

  // Başlangıç noktasından en yakın metro durağına çizgi
  const startLine =
    placeA?.geometry?.location && route.length > 0
      ? [
          {
            lat: placeA.geometry.location.lat(),
            lng: placeA.geometry.location.lng(),
          },
          { lat: route[0].location.lat, lng: route[0].location.lng },
        ]
      : null;

  // Bitiş noktasından en yakın metro durağına çizgi
  const endLine =
    placeB?.geometry?.location && route.length > 0
      ? [
          {
            lat: placeB.geometry.location.lat(),
            lng: placeB.geometry.location.lng(),
          },
          {
            lat: route[route.length - 1].location.lat,
            lng: route[route.length - 1].location.lng,
          },
        ]
      : null;

  const handleZoomChanged = () => {
    if (mapRef.current) {
      setMapZoom(mapRef.current.getZoom());
      console.log(mapZoom);
    }
  };

  const animateTrainOnLine = (line) => {
    const path = line.stations.map((station) => station.location);
    let currentIndex = 0;
    let t = 0;

    const moveTrain = () => {
      const start = path[currentIndex];
      const end = path[currentIndex + 1];

      if (!start || !end) return;

      t += 0.04;

      if (t >= 1) {
        t = 0;
        currentIndex++;

        if (currentIndex >= path.length - 1) {
          path.reverse();
          currentIndex = 0;
        }

        return;
      }

      const newLat = start.lat + t * (end.lat - start.lat);
      const newLng = start.lng + t * (end.lng - start.lng);

      setTrainPosition({ lat: newLat, lng: newLng });
    };

    const interval = setInterval(moveTrain, 50);
    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (selectedLine) {
      setTrainPosition(selectedLine.stations[0].location);
      const clearAnimation = animateTrainOnLine(selectedLine);
      return () => clearAnimation();
    }
  }, [selectedLine]);

  const handleLineSelect = (lineId) => {
    const line = MetroLines.find((line) => line.id === Number(lineId));
    setSelectedLine(line);

    if (line && mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds();
      line.stations.forEach((station) => bounds.extend(station.location));
      mapRef.current.fitBounds(bounds);
      setSelectedStation(null);
      setNearbyPlaces([]);
      setSelectedCategories([]);
      setNearbyPlaces([]);
    }
  };

  const resetMap = () => {
    mapRef.current.panTo(center);
    mapRef.current.setZoom(6);
    setSelectedStation(null);
    setNearbyPlaces([]);
    setSelectedLine(null);
    setTrainPosition(null);
    setSelectedCategories([]);
    setNearbyPlaces([]);
    setRoutePolyline(null);
    setRouteDetails([]);
    setPlaceA(null);
    setPlaceB(null);
  };

  const findLinesForStation = (station) => {
    return MetroLines.filter((line) =>
      line.stations.some((lineStation) => lineStation.name === station.name)
    ).map((line) => line.name);
  };

  useEffect(() => {
    if (placeA && placeB) {
      setRoutePolyline(route);
      if (mapRef.current && route.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        route.forEach((station) => bounds.extend(station.location));
        mapRef.current.fitBounds(bounds);
      }
    }
  }, [placeA, placeB, route]);

  const fetchNearbyPlaces = async (location, categories) => {
    if (categories.length === 0) {
      setNearbyPlaces([]);
      return;
    }

    const service = new window.google.maps.places.PlacesService(mapRef.current);

    try {
      setIsPanelLoading(true);
      const allResults = await Promise.all(
        categories.map(async (type) => {
          const request = {
            location,
            radius: 1000,
            type,
          };

          return new Promise((resolve, reject) => {
            service.nearbySearch(request, (results, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                resolve(results);
              } else {
                resolve([]);
              }
            });
          });
        })
      );

      const mergedResults = allResults.flat();
      const uniqueResults = Array.from(
        new Set(mergedResults.map((place) => place.place_id))
      ).map((id) => mergedResults.find((place) => place.place_id === id));

      const updatedResults = uniqueResults.map((place) => ({
        ...place,
        distance: calculateDistanceFixed(
          location.lat,
          location.lng,
          place.geometry.location.lat(),
          place.geometry.location.lng()
        ),
      }));

      updatedResults.sort((a, b) => a.distance - b.distance);

      setNearbyPlaces(updatedResults);
      setIsPanelLoading(false);
    } catch (error) {
      console.error("API isteği sırasında bir hata oluştu:", error);
      setNearbyPlaces([]);
      setIsPanelLoading(false);
    }
  };

  if (loadError) return <div>Harita yüklenirken bir hata oluştu</div>;
  if (!isLoaded) return <div>Harita yükleniyor...</div>;

  return (
    <div style={{ position: "relative" }}>
      <StationPanel
        selectedStation={selectedStation}
        findLinesForStation={findLinesForStation}
        fetchNearbyPlaces={fetchNearbyPlaces}
        nearbyPlaces={nearbyPlaces}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        isPanelLoading={isPanelLoading}
      />

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={6}
        center={center}
        options={{
          styles: MapStyle,
          mapTypeControl: false,
          fullscreenControl: false,
          restriction: {
            latLngBounds: restrictedBounds,
            strictBounds: true,
          },
        }}
        onLoad={(map) => (mapRef.current = map)}
        onZoomChanged={handleZoomChanged}
      >
        {MetroLines.filter((line) => {
          // Eğer route doluysa, sadece route içindeki duraklara sahip hatları dahil et
          if (routePolyline) {
            const routeStationNames = routePolyline.map(
              (station) => station.name
            ); // Route içindeki durak isimlerini alın
            return (
              line.railwayType !== "Marmaray" &&
              line.stations.some((station) =>
                routeStationNames.includes(station.name)
              )
            );
          }
          // Route boşsa tüm Marmaray olmayan hatları dahil et
          return line.railwayType !== "Marmaray";
        }).map((line) => (
          <React.Fragment key={line.id}>
            {line.stations
              .filter((station) => {
                // Sadece route içinde olan durakları filtrele
                if (routePolyline) {
                  const routeStationNames = routePolyline.map(
                    (station) => station.name
                  );
                  return routeStationNames.includes(station.name);
                }
                return true; // Route boşsa tüm durakları göster
              })
              .map((station) => (
                <Marker
                  key={station.id}
                  position={station.location}
                  title={station.name}
                  onClick={() => {
                    setSelectedStation(station);
                    mapRef.current.panTo(station.location);
                    mapRef.current.setZoom(15);
                    setSelectedCategories([]);
                    setNearbyPlaces([]);
                  }}
                  label={
                    mapZoom > 12 || selectedLine || routePolyline
                      ? {
                          text: station.name,
                          fontSize: "12px",
                          fontWeight: "500",
                          color:
                            selectedStation?.id === station.id
                              ? "#FF0000"
                              : "#333",
                        }
                      : null
                  }
                  icon={{
                    url:
                      selectedStation?.id === station.id
                        ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                        : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    scaledSize:
                      selectedStation?.id === station.id
                        ? new window.google.maps.Size(30, 30)
                        : new window.google.maps.Size(20, 20),
                    labelOrigin: new window.google.maps.Point(10, -10),
                  }}
                  animation={
                    selectedStation?.id === station.id
                      ? window.google.maps.Animation.BOUNCE
                      : null
                  }
                />
              ))}

            {!routePolyline && (
              <Polyline
                path={line.stations.map((station) => station.location)}
                options={polylineOptions(
                  line.color,
                  line.id === selectedLine?.id
                )}
              />
            )}
          </React.Fragment>
        ))}

        {/* Kesikli Çizgiler */}
        {startLine && <Polyline path={startLine} options={dashedLineOptions} />}
        {endLine && <Polyline path={endLine} options={dashedLineOptions} />}

        {routePolyline && (
          <Polyline
            path={routePolyline.map((station) => {
              if (!station || !station.location) {
                console.error("Eksik veya geçersiz istasyon:", station);
                return null; // Geçersiz istasyonu atla
              }
              return station.location;
            })}
            options={routePolylineOptions}
          />
        )}

        {/* Başlangıç Noktası Marker */}
        {placeA?.geometry?.location && (
          <Marker
            position={{
              lat: placeA.geometry.location.lat(),
              lng: placeA.geometry.location.lng(),
            }}
            label={{
              text: placeA?.name,
              color: "#da6161",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png", // Başlangıç için yeşil pin
              labelOrigin: new window.google.maps.Point(10, -10),
            }}
          />
        )}

        {/* Bitiş Noktası Marker */}
        {placeB?.geometry?.location && (
          <Marker
            position={{
              lat: placeB.geometry.location.lat(),
              lng: placeB.geometry.location.lng(),
            }}
            label={{
              text: placeB?.name,
              color: "#da6161",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // Bitiş için kırmızı pin
              labelOrigin: new window.google.maps.Point(10, -10),
            }}
          />
        )}

        {/* Nearby Places Marker'ları */}
        {nearbyPlaces.map((place, index) => (
          <Marker
            key={`${index}-${mapZoom}`} // Zoom seviyesi değiştiğinde yeniden render
            position={place.geometry.location}
            title={place.name}
            label={
              mapZoom > 15 // Zoom seviyesi 14'ten büyükse etiket görünür
                ? {
                    text: place.name,
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#333",
                  }
                : null // Daha düşük zoom seviyelerinde etiket gizlenir
            }
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
              scaledSize: new window.google.maps.Size(20, 20),
              labelOrigin: new window.google.maps.Point(10, -10),
            }}
          />
        ))}

        {trainPosition && (
          <Marker
            position={trainPosition}
            icon={{
              url: trainIcon,
              scaledSize: new window.google.maps.Size(40, 40),
              zIndex: 10,
            }}
            title="Tren"
          />
        )}
        {routeDetails.length > 0 && (
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              width: "300px", // Genişlik StationPanel ile aynı yapıldı
              padding: "20px", // StationPanel ile uyumlu padding
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              zIndex: 10,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 20px",
                cursor: "pointer",
                backgroundColor: "#f1f1f1",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
              onClick={() => setModalOpen(!modalOpen)}
            >
              <span style={{ fontWeight: "bold" }}>Güzergah Detayları</span>
              <span style={{ marginLeft: "auto" }}>
                {modalOpen ? "⬇️" : "⬆️"}
              </span>{" "}
              {/* Ok en sağa alındı */}
            </div>
            <div
              style={{
                maxHeight: modalOpen ? "300px" : "0", // Animasyon için yükseklik değişimi
                overflowY: modalOpen ? "auto" : "hidden", // Kapandığında içeriği gizle
                padding: modalOpen ? "10px" : "0", // Kapandığında padding'i sıfırla
                transition: "all 0.3s ease", // Geçiş animasyonu
              }}
            >
              {modalOpen && (
                <>
                  <p>
                    <strong>A Noktası:</strong> {placeA?.name || "Belirtilmedi"}
                    <br />
                    <strong>B Noktası:</strong> {placeB?.name || "Belirtilmedi"}
                  </p>
                  <ul style={{ padding: 0, listStyleType: "none" }}>
                    {routeDetails.map((detail, index) => (
                      <li key={index} style={{ marginBottom: "10px" }}>
                        <strong>{detail.lineName} Hattı:</strong>
                        <br />
                        {detail.start} → {detail.end}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        )}
      </GoogleMap>

      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 2,
          display: "flex",
          gap: "10px",
        }}
      >
        <select
          onChange={(e) => handleLineSelect(e.target.value)}
          style={{
            padding: "5px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            background: "white",
            fontSize: "15px",
            maxWidth: "280px", // Select genişliği
          }}
          value={selectedLine ? selectedLine.id : ""}
        >
          <option value="">Hat Seçiniz</option>
          {MetroLines.map((line) => (
            <option
              key={line.id}
              value={line.id}
              title={line.name} // Uzun metinler için tooltip
            >
              {line.name.length > 26
                ? `${line.name.substring(0, 24)}..` // Uzun metinleri kes
                : line.name}
            </option>
          ))}
        </select>

        <button
          onClick={resetMap}
          style={{
            padding: "10px 20px",
            backgroundColor: "#e72419",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.3)",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
