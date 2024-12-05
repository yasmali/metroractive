export const mapStyle = [
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [
      { color: "#4A4A4A" }, // Yazılar için açık gri renk
      { lightness: 40 }, // Daha ince görünüm için açıklık
      { visibility: "off" },
    ],
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [
      { color: "#ffffff" }, // Yazıların çevresindeki gölge
      { weight: 0.5 }, // Daha ince stroke
      { visibility: "off" },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text",
    stylers: [
      { color: "#333333" }, // Yol etiketleri koyu gri
      { fontWeight: "300" }, // Hafif ince yazı
      { visibility: "off" },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text",
    stylers: [
      { visibility: "on" },
      { color: "#555555" }, // POI (ilgi çekici noktalar) yazıları
      { fontWeight: "300" },
      { visibility: "off" },
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
      { visibility: "off" },
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

export default mapStyle;
