import React, { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";
import trainIcon from "../assets/train.png";

// Harita stil ayarları
const mapContainerStyle = {
  width: "100%",
  height: "90vh",
  borderRadius: "15px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
};

const libraries = ["places"];

// İstanbul merkez konumu
const center = { lat: 41.0600, lng: 28.9784 };

// Metro hatları ve istasyonları
const metroLines = [
    {
        id: 1,
        name: "M1A Hattı",
        color: "#e72419",
        stations: [
          { id: 1, name: "Yenikapı", location: { lat: 41.00557755694778, lng: 28.950457563563546 } },
          { id: 2, name: "Aksaray", location: { lat: 41.01207799449946, lng: 28.94815235769824 } },
          { id: 3, name: "Emniyet-Fatih", location: { lat: 41.01786033824504, lng: 28.93918062825805 } },
          { id: 4, name: "Topkapı-Ulubatlı", location: { lat: 41.02472287530622, lng: 28.93018681223749 } },
          { id: 5, name: "Bayrampaşa - Maltepe", location: { lat: 41.03436259003804, lng: 28.92140057669758 } },
          { id: 6, name: "Sağmalcılar", location: { lat: 41.041122697635736, lng: 28.9074375129944 } },
          { id: 7, name: "Kocatepe", location: { lat: 41.048496211637314, lng: 28.895543112963935 } },
          { id: 8, name: "Otogar", location: { lat: 41.04024561976906, lng: 28.89452945263826 }, crossStation: true },
          { id: 9, name: "Terazidere", location: { lat: 41.030546454049336, lng: 28.897786957713883 } },
          { id: 10, name: "Davutpaşa-YTÜ", location: { lat: 41.02048319631843, lng: 28.90032973146628 } },
          { id: 11, name: "Merter", location: { lat: 41.007388105458915, lng: 28.896315225325452 } }, //Bakılacak
          { id: 12, name: "Zeytinburnu", location: { lat: 41.001822401263226, lng: 28.889962669949902 } },
          { id: 13, name: "Bakırköy-İncirli", location: { lat: 40.99675052992498, lng: 28.8753070967955 } }, //Bakılacak
          { id: 14, name: "Bahçelievler", location: { lat: 40.99581581332061, lng: 28.86356697781565 } },
          { id: 15, name: "Ataköy-Şirinevler", location: { lat: 40.99144440508425, lng: 28.845761024473973 } },
          { id: 16, name: "Yenibosna", location: { lat: 40.98943130021033, lng: 28.83687142715354 } },
          { id: 17, name: "DTM - İstanbul Fuar Merkezi", location: { lat: 40.98704468593208, lng: 28.828527002515752 } },
          { id: 18, name: "Atatürk Havalimani", location: { lat: 40.97962420690618, lng: 28.821169212897438 } },
        ],
      },
      {
        id: 2,
        name: "M1B Hattı",
        color: "#e72419",
        stations: [
          { id: 1, name: "Yenikapı", location: { lat: 41.00557755694778, lng: 28.950457563563546 } },
          { id: 2, name: "Aksaray", location: { lat: 41.01207799449946, lng: 28.94815235769824 } },
          { id: 3, name: "Emniyet-Fatih", location: { lat: 41.01786033824504, lng: 28.93918062825805 } },
          { id: 4, name: "Topkapı-Ulubatlı", location: { lat: 41.02472287530622, lng: 28.93018681223749 } },
          { id: 5, name: "Bayrampaşa - Maltepe", location: { lat: 41.03436259003804, lng: 28.92140057669758 } },
          { id: 6, name: "Sağmalcılar", location: { lat: 41.041122697635736, lng: 28.9074375129944 } },
          { id: 7, name: "Kocatepe", location: { lat: 41.048496211637314, lng: 28.895543112963935 } },
          { id: 8, name: "Otogar", location: { lat: 41.04024561976906, lng: 28.89452945263826 } },
          { id: 9, name: "Esenler", location: { lat: 41.03765397073063, lng: 28.88855430913355 } },
          { id: 10, name: "Menderes", location: { lat: 41.0428518039887, lng: 28.878636276716435 } },
          { id: 11, name: "Üçyüzlü", location: { lat: 41.03657503697282, lng: 28.87062608907891 } },
          { id: 12, name: "Bağcılar Meydan", location: { lat: 41.03470656200058, lng: 28.856407024201 } },
          { id: 13, name: "Kirazlı-Bağcılar", location: { lat: 41.03220179623386, lng: 28.842883877488486 } },
        ],
      },
  {
    id: 3,
    name: "M2 Hattı",
    color: "#009944",
    stations: [
      { id: 1, name: "Yenikapı", location: { lat: 41.00557755694778, lng: 28.950457563563546 } },
      { id: 2, name: "Vezneciler - İstanbul Üniversitesi", location: { lat: 41.01250175063931, lng: 28.959629568128946 } },
      { id: 3, name: "Haliç", location: { lat: 41.023000597582715, lng: 28.96672176052353 } },
      { id: 4, name: "Şişhane", location: { lat: 41.0283537695122, lng: 28.972951108638327 } },
      { id: 5, name: "Taksim", location: { lat: 41.03701843550389, lng: 28.98576738358649 } },
      { id: 6, name: "Osmanbey", location: { lat: 41.05307578745314, lng: 28.987476848823874 } },
      { id: 7, name: "Şişli-Mecidiyeköy", location: { lat: 41.064655177627216, lng: 28.99272945136874 } },
      { id: 8, name: "Gayrettepe", location: { lat: 41.069272129217936, lng: 29.011439886906075 } },
      { id: 9, name: "Levent", location: { lat: 41.07583868512707, lng: 29.01435110229876 } },
      { id: 10, name: "4. Levent", location: { lat: 41.08610924396391, lng: 29.00703785678138 } },
      { id: 11, name: "Sanayi Mahallesi", location: { lat: 41.094387527883406, lng: 29.005146736207966 } },
      { id: 12, name: "Seyrantepe", location: { lat: 41.101116545756796, lng: 28.99552464310417 } },
      { id: 13, name: "İTÜ-Ayazağa", location: { lat: 41.10837043366006, lng: 29.021223477275825 } },
      { id: 14, name: "Atatürk Oto Sanayi", location: { lat: 41.118693162089144, lng: 29.024587026893094 } },
      { id: 15, name: "Darüşşafaka", location: { lat: 41.12921786526191, lng: 29.02538481888793 } },
      { id: 16, name: "Hacıosman", location: { lat: 41.13992845190866, lng: 29.030714704177818 } },
    ],
  },
  {
    id: 4,
    name: "M2 Hattı",
    color: "#00a8e2",
    stations: [
      { id: 4, name: "Üsküdar", location: { lat: 41.0258, lng: 29.0150 } },
      { id: 5, name: "Kadıköy", location: { lat: 40.9917, lng: 29.0258 } },
      { id: 6, name: "Bostancı", location: { lat: 40.9575, lng: 29.0971 } },
    ],
  },
];

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

const mapStyle = [
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [
        { color: "#4A4A4A" }, // Yazılar için açık gri renk
        { lightness: 40 }, // Daha ince görünüm için açıklık
        { visibility: "off" }
      ],
    },
    {
      featureType: "all",
      elementType: "labels.text.stroke",
      stylers: [
        { color: "#ffffff" }, // Yazıların çevresindeki gölge
        { weight: 0.5 }, // Daha ince stroke
        { visibility: "off" }
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text",
      stylers: [
        { color: "#333333" }, // Yol etiketleri koyu gri
        { fontWeight: "300" }, // Hafif ince yazı
        { visibility: "off" }
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.text",
      stylers: [
        { visibility: "on" },
        { color: "#555555" }, // POI (ilgi çekici noktalar) yazıları
        { fontWeight: "300" },
        { visibility: "off" }
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }], // POI simgelerini kaldır
    },
    {
      featureType: "water",
      elementType: "labels.text",
      stylers: [
        { color: "#1a73e8" }, // Su alanları için hafif mavi yazı
        { fontWeight: "300" }, // Daha ince yazı
        { visibility: "off" }
      ],
    },
    {
      featureType: "administrative",
      elementType: "labels.text",
      stylers: [
        { color: "#666666" }, // Yönetim sınırları yazıları
        { visibility: "off" },
        { fontWeight: "300" },
      ],
    },
    {
      featureType: "landscape",
      elementType: "labels",
      stylers: [{ visibility: "off" }], // Arazi isimlerini kaldır
    },
  ];
  
const restrictedBounds = {
    north: 41.3201, // En kuzeydeki koordinat
    south: 40.8021, // En güneydeki koordinat
    east: 29.4622,  // En doğudaki koordinat
    west: 28.4088,  // En batıdaki koordinat
  };
  
export default function Map({ selectedLine, setSelectedLine }) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyCIGAdr7-swS3vx_cj0pJAMKmMEKk14Wj4",
        libraries,
      });

  const mapRef = useRef(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [mapZoom, setMapZoom] = useState(12);
  const [trainPosition, setTrainPosition] = useState(null);
  const [isMovingForward, setIsMovingForward] = useState(true); // Tren yönü

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
    const line = metroLines.find((line) => line.id === Number(lineId));
    setSelectedLine(line);

    if (line && mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds();
      line.stations.forEach((station) => bounds.extend(station.location));
      mapRef.current.fitBounds(bounds); // Seçilen hattı ekrana sığdırır
      setSelectedStation(null);
      setNearbyPlaces([]);
    }
  };

  const resetMap = () => {
    mapRef.current.panTo(center);
    mapRef.current.setZoom(12);
    setSelectedStation(null);
    setNearbyPlaces([]);
    setSelectedLine(null);
    setTrainPosition(null);
  };

  const findLinesForStation = (station) => {
    return metroLines
      .filter((line) =>
        line.stations.some((lineStation) => lineStation.name === station.name)
      )
      .map((line) => line.name); // Hattın adını döndürür
  };

  const fetchNearbyPlaces = (location) => {
    const service = new window.google.maps.places.PlacesService(mapRef.current);
  
    const request = {
      location,
      radius: 1000,
      type: ["restaurant", "cafe", "museum", "hospital", "park"],
    };
  
    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const updatedResults = results.map((place) => {
          const distance = calculateDistance(
            location.lat,
            location.lng,
            place.geometry.location.lat(),
            place.geometry.location.lng()
          );
          return { ...place, distance };
        });
  
        // Mesafeye göre sıralama
        updatedResults.sort((a, b) => a.distance - b.distance);
  
        setNearbyPlaces(updatedResults);
      } else {
        setNearbyPlaces([]);
      }
    });
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
        {selectedStation ? (
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
              Bu durak {selectedStation.name} durağıdır. Yakındaki sosyal alanlar
              aşağıda listelenmiştir.
            </p>
            <ul style={{ paddingLeft: "20px" }}>
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
        )}
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
        options={{
          styles: mapStyle,
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
        {metroLines.map((line) => (
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
      fetchNearbyPlaces(station.location);
    }}
    label={{
      text: station.name,
      fontSize: "12px",
      fontWeight: "500",
      color: selectedStation?.id === station.id ? "#FF0000" : "#333", // Seçili durak için kırmızı
    }}
    icon={{
      url:
        selectedStation?.id === station.id
          ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png" // Seçili durak için kırmızı pin
          : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Diğer duraklar için mavi pin
      scaledSize: selectedStation?.id === station.id
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
              options={polylineOptions(line.color, line.id === selectedLine?.id)}
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
      zIndex: 10
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
            borderRadius: "5px",
            border: "1px solid #ccc",
            background: "white",
            fontSize: "14px",
          }}
          value={selectedLine ? selectedLine.id : ""}
        >
          <option value="">Hat Seçiniz</option>
          {metroLines.map((line) => (
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
