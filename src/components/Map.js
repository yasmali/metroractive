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

// Harita stil ayarları
const mapContainerStyle = {
  width: "100%",
  height: "90vh",
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
  strokeWeight: isSelected ? 10 : 8, // Daha kalın çizgi
  geodesic: true,
  zIndex: isSelected ? 10 : 5, // Seçilen hattı ön planda göstermek için zIndex artırıldı
  icons: isSelected
    ? [
        {
          icon: {
            path: "M 0,-1 0,1", // Glow efekti
            strokeOpacity: 0.8,
            strokeWeight: 22, // Parlak alanın genişliği
            strokeColor: `rgba(${hexToRgb(color)}, 0.3)`,
          },
          offset: "0",
          repeat: "10px",
        },
      ]
    : [],
});

const restrictedBounds = {
  north: 41.5, // En kuzeydeki koordinat daha yukarıya çekildi
  south: 40.5, // En güneydeki koordinat daha aşağıya çekildi
  east: 29.9, // En doğudaki koordinat daha doğuya çekildi
  west: 27.8, // En batıdaki koordinat daha batıya çekildi
};

export default function Map({
  selectedLine,
  setSelectedLine,
  selectedStation,
  setSelectedStation,
}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const mapRef = useRef(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [mapZoom, setMapZoom] = useState(6);
  const [trainPosition, setTrainPosition] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]); // State taşındı
  const [isPanelLoading, setIsPanelLoading] = useState(false); // Loader için state

  const handleZoomChanged = () => {
    if (mapRef.current) {
      setMapZoom(mapRef.current.getZoom());
      console.log(mapZoom);
    }
  };

  const animateTrainOnLine = (line) => {
    const path = line.stations.map((station) => station.location); // Polyline koordinatları
    let currentIndex = 0; // Başlangıç noktası
    let t = 0; // İki nokta arasındaki ilerleme yüzdesi (0-1 arası değer)

    const moveTrain = () => {
      const start = path[currentIndex];
      const end = path[currentIndex + 1];

      if (!start || !end) return;

      // Tren pozisyonunu interpolasyon ile hesapla
      t += 0.04; // Adım boyutu (hız)

      if (t >= 1) {
        // Hedefe ulaşıldığında
        t = 0; // İlerleme sıfırlanır
        currentIndex++; // Bir sonraki durağa geç

        if (currentIndex >= path.length - 1) {
          // Son durağa ulaşıldığında geri dön
          path.reverse(); // Koordinatları ters çevir
          currentIndex = 0; // İlk durağa dön
        }

        return;
      }

      // Tren iki nokta arasında hareket eder
      const newLat = start.lat + t * (end.lat - start.lat);
      const newLng = start.lng + t * (end.lng - start.lng);

      setTrainPosition({ lat: newLat, lng: newLng });
    };

    const interval = setInterval(moveTrain, 50); // 50ms güncelleme ile akıcı hareket
    return () => clearInterval(interval); // Hat değiştirildiğinde animasyonu temizle
  };

  useEffect(() => {
    if (selectedLine) {
      setTrainPosition(selectedLine.stations[0].location); // Treni ilk durağa yerleştir
      const clearAnimation = animateTrainOnLine(selectedLine); // Animasyonu başlat
      return () => clearAnimation(); // Hat değiştiğinde animasyonu durdur
    }
  }, [selectedLine]);

  const handleLineSelect = (lineId) => {
    const line = MetroLines.find((line) => line.id === Number(lineId));
    setSelectedLine(line);

    if (line && mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds();
      line.stations.forEach((station) => bounds.extend(station.location));
      mapRef.current.fitBounds(bounds); // Seçilen hattı ekrana sığdırır
      setSelectedStation(null);
      setNearbyPlaces([]);
      setSelectedCategories([]);
      setNearbyPlaces([]);
    }
  };

  const resetMap = () => {
    debugger;
    mapRef.current.panTo(center);
    mapRef.current.setZoom(6);
    setSelectedStation(null);
    setNearbyPlaces([]);
    setSelectedLine(null);
    setTrainPosition(null);
    setSelectedCategories([]);
    setNearbyPlaces([]);
  };

  const findLinesForStation = (station) => {
    return MetroLines.filter((line) =>
      line.stations.some((lineStation) => lineStation.name === station.name)
    ).map((line) => line.name); // Hattın adını döndürür
  };

  const fetchNearbyPlaces = async (location, categories) => {
    if (categories.length === 0) {
      setNearbyPlaces([]); // Eğer kategori seçilmezse temizle
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
            type, // Tek bir type gönderilir
          };

          return new Promise((resolve, reject) => {
            service.nearbySearch(request, (results, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                resolve(results);
              } else {
                resolve([]); // Hata durumunda boş array döndür
              }
            });
          });
        })
      );

      // Gelen tüm sonuçları birleştir ve tekrarlananları kaldır
      const mergedResults = allResults.flat();
      const uniqueResults = Array.from(
        new Set(mergedResults.map((place) => place.place_id))
      ).map((id) => mergedResults.find((place) => place.place_id === id));

      // Mesafeleri hesapla ve sıralama yap
      const updatedResults = uniqueResults.map((place) => ({
        ...place,
        distance: calculateDistance(
          location.lat,
          location.lng,
          place.geometry.location.lat(),
          place.geometry.location.lng()
        ),
      }));

      updatedResults.sort((a, b) => a.distance - b.distance); // Mesafeye göre sıralama

      setNearbyPlaces(updatedResults);
      setIsPanelLoading(false);
    } catch (error) {
      console.error("API isteği sırasında bir hata oluştu:", error);
      setNearbyPlaces([]);
      setIsPanelLoading(false);
    }
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2); // Distance in km
  };

  if (loadError) return <div>Harita yüklenirken bir hata oluştu</div>;
  if (!isLoaded) return <div>Harita yükleniyor...</div>;

  return (
    <div style={{ position: "relative" }}>
      {/* Sol üstteki panel */}
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
            strictBounds: true, // Kullanıcının sınırların dışına çıkmasını engeller
          },
        }}
        onLoad={(map) => (mapRef.current = map)}
        onZoomChanged={handleZoomChanged} // Zoom değişikliği olayı
      >
        {/* Metro Durak Marker'ları */}
        {MetroLines.map((line) => (
          <React.Fragment key={line.id}>
            {line.stations.map((station) => (
              <Marker
                key={station.id}
                position={station.location}
                title={station.name}
                onClick={() => {
                  setSelectedStation(station);
                  mapRef.current.panTo(station.location);
                  mapRef.current.setZoom(15);
                  //   if (selectedCategories.length > 0){
                  //     fetchNearbyPlaces(selectedStation.location, selectedCategories); // Parent'a seçili kategorileri gönder
                  //   } else {
                  setSelectedCategories([]);
                  setNearbyPlaces([]);
                  //   }
                }}
                label={{
                  text: station.name,
                  fontSize: "12px",
                  fontWeight: "500",
                  color:
                    selectedStation?.id === station.id ? "#FF0000" : "#333", // Seçili durak için kırmızı
                }}
                icon={{
                  url:
                    selectedStation?.id === station.id
                      ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png" // Seçili durak için kırmızı pin
                      : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Diğer duraklar için mavi pin
                  scaledSize:
                    selectedStation?.id === station.id
                      ? new window.google.maps.Size(30, 30) // Seçili durak için büyük pin
                      : new window.google.maps.Size(20, 20), // Diğer duraklar için küçük pin
                  labelOrigin: new window.google.maps.Point(10, -10),
                }}
                animation={
                  selectedStation?.id === station.id
                    ? window.google.maps.Animation.BOUNCE // Seçili durak için animasyon
                    : null
                }
              />
            ))}

            {/* Metro hattı Polyline */}
            <Polyline
              path={line.stations.map((station) => station.location)}
              options={polylineOptions(
                line.color,
                line.id === selectedLine?.id
              )}
            />
          </React.Fragment>
        ))}

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
              scaledSize: new window.google.maps.Size(40, 40), // Marker boyutu,
              zIndex: 10,
            }}
            title="Tren"
          />
        )}
      </GoogleMap>

      {/* ComboBox ve Reset Butonu */}
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
          }}
          value={selectedLine ? selectedLine.id : ""}
        >
          <option value="">Hat Seçiniz</option>
          {MetroLines.map((line) => (
            <option key={line.id} value={line.id}>
              {line.name}
            </option>
          ))}
        </select>

        <button
          onClick={resetMap}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
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
