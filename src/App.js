import React from "react";
import "./App.css";
import 'leaflet/dist/leaflet.css';
import Hero from "./components/Hero";
import Abstract from "./components/Abstract";
import Mapa from "./components/Mapa";
import Redes from "./components/Redes";           // ← Versión grafo
import RedesConMapa from "./components/RedesConMapa";  // ← Versión mapa
import Proteinas from "./components/Proteinas";
import Comparativa from "./components/Comparativa";

function App() {
  return (
    <div className="app">
      <Hero />
      <Abstract />
      <Mapa />
      <Redes />          {/* Visualización de grafo interactivo */}
      <RedesConMapa />   {/* Red sobre mapa geográfico */}
      <Proteinas />
      <Comparativa />
    </div>
  );
}

export default App;
