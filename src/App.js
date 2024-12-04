import React, { useState } from "react";
import Map from "./components/Map";

function App() {
  const [selectedLine, setSelectedLine] = useState(null);

  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>
        İstanbul Metro Haritası {selectedLine && ` - ${selectedLine.name}`}
      </h1>
      <Map selectedLine={selectedLine} setSelectedLine={setSelectedLine} />
    </div>
  );
}

export default App;
