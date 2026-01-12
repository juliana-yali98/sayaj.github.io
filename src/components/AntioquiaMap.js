import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  LayersControl,
  LayerGroup,
  Marker,
  Popup,
  GeoJSON,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { parseTsv } from "../utils/parseTsv";

const { BaseLayer, Overlay } = LayersControl;

const virusIcon = L.icon({
  iconUrl: "/farm.svg",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const redesGeojson = [
  {
    label: "Dirigida - Distritos - 2km",
    base: "directed_Pperuviana_2km_10steps_10reps_districts_network",
  },
  {
    label: "Dirigida - Municipios - 2km",
    base: "directed_Pperuviana_2km_10steps_10reps_mun_network",
  },
  {
    label: "Dirigida - Municipios - 5km",
    base: "directed_Pperuviana_5km_10steps_10reps_mun_network",
  },
  {
    label: "No dirigida - Distritos - 2km",
    base: "undirected_Pperuviana_2km_10steps_10reps_districts_network",
  },
  {
    label: "No dirigida - Municipios - 2km",
    base: "undirected_Pperuviana_2km_10steps_10reps_mun_network",
  },
  {
    label: "No dirigida - Municipios - 5km",
    base: "undirected_Pperuviana_5km_10steps_10reps_mun_network",
  },
];

export default function AntioquiaMap() {
  const [data, setData] = useState([]);
  const [mode, setMode] = useState("puntos");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [geoNodes, setGeoNodes] = useState(null);
  const [geoEdges, setGeoEdges] = useState(null);
  const [networkVersion, setNetworkVersion] = useState(0); // fuerza actualización

  useEffect(() => {
    fetch("/data/data.tsv")
      .then((res) => res.text())
      .then((text) => {
        const parsed = parseTsv(text);
        const valid = parsed.filter(
          (d) =>
            !isNaN(d.latitude) &&
            !isNaN(d.longitude) &&
            !isNaN(d.alt_temp_prob)
        );
        setData(valid);
      });
  }, []);

  useEffect(() => {
    if (mode === "red" && selectedNetwork) {
      const base = selectedNetwork;

      const fetchGeoJson = async () => {
        try {
          const [nodesRes, edgesRes] = await Promise.all([
            fetch(`/geojson/${base}_nodes.geojson`),
            fetch(`/geojson/${base}_edges.geojson`)
          ]);

          if (!nodesRes.ok || !edgesRes.ok) {
            throw new Error("Error al cargar uno o ambos archivos GeoJSON");
          }

          const [nodes, edges] = await Promise.all([
            nodesRes.json(),
            edgesRes.json()
          ]);

          if (!nodes.features || !edges.features) {
            throw new Error("GeoJSON inválido: faltan features");
          }

          setGeoNodes(nodes);
          setGeoEdges(edges);
          setNetworkVersion(v => v + 1); // fuerza nueva clave y render
        } catch (error) {
          console.error("Fallo al cargar la red:", error);
          setGeoNodes(null);
          setGeoEdges(null);
          alert("No se pudo cargar la red. Verifica los archivos.");
        }
      };

      fetchGeoJson();
    } else {
      setGeoNodes(null);
      setGeoEdges(null);
    }
  }, [mode, selectedNetwork]);

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
      {/* Panel lateral */}
      <div style={{
        width: "280px",
        padding: "20px",
        backgroundColor: "#ffffff",
        boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
        zIndex: 1000,
        fontFamily: "Arial, sans-serif"
      }}>
        <h3 style={{ marginTop: 0 }}>Visualización</h3>

        <label style={{ display: "block", marginBottom: "12px" }}>
          <strong>Modo:</strong>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{
              width: "100%",
              marginTop: "4px",
              padding: "6px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="puntos">Puntos</option>
            <option value="red">Red</option>
          </select>
        </label>

        {mode === "red" && (
          <label style={{ display: "block", marginBottom: "12px" }}>
            <strong>Red:</strong>
            <select
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
              style={{
                width: "100%",
                marginTop: "4px",
                padding: "6px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Seleccione una red</option>
              {redesGeojson.map((r) => (
                <option key={r.base} value={r.base}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {/* Mapa */}
      <div style={{ flex: 1, border: "2px solid #ddd", borderRadius: "12px", margin: "10px" }}>
        <MapContainer center={[7.342, -75.5]} zoom={11} style={{ height: "100%", width: "100%" }}>
          <LayersControl position="topright">
            <BaseLayer checked name="Topográfico (Relieve)">
              <TileLayer
                attribution="Tiles &copy; Esri &mdash; Source: Esri, USGS, NOAA"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}"
              />
            </BaseLayer>
            <BaseLayer name="Calles (OpenStreetMap)">
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </BaseLayer>

            {mode === "puntos" && (
              <Overlay checked name="Puntos de probabilidad">
                <LayerGroup>
                  {data.map((point, i) => (
                    <CircleMarker
                      key={i}
                      center={[point.latitude, point.longitude]}
                      radius={6}
                      fillOpacity={0.4}
                      fillColor={getColor(parseFloat(point.alt_temp_prob))}
                      stroke={false}
                    >
                      <Tooltip>
                        <div>
                          <strong>Municipio:</strong> {point.municipality}<br />
                          <strong>Vereda:</strong> {point.vereda}<br />
                          <strong>Probabilidad:</strong> {parseFloat(point.alt_temp_prob).toFixed(2)}
                        </div>
                      </Tooltip>
                    </CircleMarker>
                  ))}
                </LayerGroup>
              </Overlay>
            )}

            <Overlay checked name="Punto especial (PP62)">
              <LayerGroup>
                <Marker position={[5.70972, -75.310555]} icon={virusIcon}>
                  <Popup>
                    <strong>PP62</strong>
                    <br />
                    Virus: PVX, PVY, Nepovirus, PMTV
                  </Popup>
                </Marker>
              </LayerGroup>
            </Overlay>

            {mode === "red" && geoNodes && geoEdges && (
              <>
                <Overlay checked name="Red - Nodos">
                  <GeoJSON
                    key={`nodes-${networkVersion}`}
                    data={geoNodes}
                    pointToLayer={(feature, latlng) =>
                      L.circleMarker(latlng, {
                        radius: 5,
                        fillColor: "#2c7fb8",
                        color: "#045a8d",
                        weight: 1,
                        fillOpacity: 0.9,
                      })
                    }
                    onEachFeature={(feature, layer) => {
                      const { municipality, district, id } = feature.properties;
                      layer.bindTooltip(
                        `<strong>${district}</strong><br/>${municipality}<br/>ID: ${id}`,
                        { permanent: false }
                      );
                    }}
                  />
                </Overlay>

                <Overlay checked name="Red - Aristas">
                  <GeoJSON
                    key={`edges-${networkVersion}`}
                    data={geoEdges}
                    style={{
                      color: "#525252",
                      weight: 1,
                      opacity: 0.7,
                    }}
                  />
                </Overlay>
              </>
            )}
          </LayersControl>
        </MapContainer>
      </div>
    </div>
  );
}

function getColor(prob) {
  return prob > 0.9
    ? "#08306b"
    : prob > 0.75
    ? "#2171b5"
    : prob > 0.5
    ? "#4292c6"
    : prob > 0.25
    ? "#6baed6"
    : "#c6dbef";
}
