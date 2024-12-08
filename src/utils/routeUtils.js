import MetroLines from "../metroLines.js";

export const calculateDistance = (lat1, lng1, lat2, lng2) => {
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

export const calculateRoute = (startStation, endStation) => {
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
        line.stations.some((station) => station.name === currentStation.name) &&
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

export const calculateDistanceFixed = (lat1, lng1, lat2, lng2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
};
