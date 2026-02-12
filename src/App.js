import React from "react";
import "./App.css";
import 'leaflet/dist/leaflet.css'; // ← IMPORTANTE: CSS de Leaflet
import Hero from "./components/Hero";
import Abstract from "./components/Abstract";
import Mapa from "./components/Mapa";
import Redes from "./components/Redes";
import Proteinas from "./components/Proteinas";
import Comparativa from "./components/Comparativa";

function App() {
  return (
    <div className="app">
      <Hero />
      <Abstract />
      <Mapa />
      <Redes />
      <Proteinas />
      <Comparativa />
    </div>
  );
}

export default App;

