import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Mapa.css';

// Coordenadas de países (puedes expandir esto)
const COUNTRY_COORDS = {
  'Jordan': [31.9454, 35.9284],
  'Israel': [31.0461, 34.8516],
  'Mexico': [23.6345, -102.5528],
  'USA': [37.0902, -95.7129],
  'Spain': [40.4637, -3.7492],
  'Italy': [41.8719, 12.5674],
  'Turkey': [38.9637, 35.2433],
  'China': [35.8617, 104.1954],
  'Germany': [51.1657, 10.4515],
  'Netherlands': [52.1326, 5.2913],
  'United Kingdom': [55.3781, -3.4360],
  'France': [46.2276, 2.2137],
  'Greece': [39.0742, 21.8243],
  'Japan': [36.2048, 138.2529],
  'South Korea': [35.9078, 127.7669],
  'Brazil': [-14.2350, -51.9253],
  'Argentina': [-38.4161, -63.6167],
  'Chile': [-35.6751, -71.5430],
  'Peru': [-9.1900, -75.0152],
  'Colombia': [4.5709, -74.2973],
  'Ecuador': [-1.8312, -78.1834],
  'India': [20.5937, 78.9629],
  'Australia': [-25.2744, 133.7751],
  'South Africa': [-30.5595, 22.9375],
  'Egypt': [26.8206, 30.8025],
  'Morocco': [31.7917, -7.0926],
  'Tunisia': [33.8869, 9.5375],
  'Iran': [32.4279, 53.6880],
  'Saudi Arabia': [23.8859, 45.0792],
  'United Arab Emirates': [23.4241, 53.8478],
  'Canada': [56.1304, -106.3468],
  'Poland': [51.9194, 19.1451],
  'Belgium': [50.5039, 4.4699],
  'Switzerland': [46.8182, 8.2275],
  'Austria': [47.5162, 14.5501],
  'Sweden': [60.1282, 18.6435],
  'Norway': [60.4720, 8.4689],
  'Denmark': [56.2639, 9.5018],
  'Finland': [61.9241, 25.7482],
  'Portugal': [39.3999, -8.2245],
  'Czech Republic': [49.8175, 15.4730],
  'Hungary': [47.1625, 19.5033],
  'Romania': [45.9432, 24.9668],
  'Bulgaria': [42.7339, 25.4858],
  'Serbia': [44.0165, 21.0059],
  'Croatia': [45.1, 15.2],
  'Slovenia': [46.1512, 14.9955],
  'Slovakia': [48.6690, 19.6990],
  'Lithuania': [55.1694, 23.8813],
  'Latvia': [56.8796, 24.6032],
  'Estonia': [58.5953, 25.0136],
  'Ukraine': [48.3794, 31.1656],
  'Russia': [61.5240, 105.3188],
  'Belarus': [53.7098, 27.9534],
  'Kazakhstan': [48.0196, 66.9237],
  'Uzbekistan': [41.3775, 64.5853],
  'Thailand': [15.8700, 100.9925],
  'Vietnam': [14.0583, 108.2772],
  'Indonesia': [-0.7893, 113.9213],
  'Philippines': [12.8797, 121.7740],
  'Malaysia': [4.2105, 101.9758],
  'Singapore': [1.3521, 103.8198],
  'New Zealand': [-40.9006, 174.8860],
  'Pakistan': [30.3753, 69.3451],
  'Bangladesh': [23.6850, 90.3563],
  'Sri Lanka': [7.8731, 80.7718],
  'Nepal': [28.3949, 84.1240],
  'Myanmar': [21.9162, 95.9560],
  'Cambodia': [12.5657, 104.9910],
  'Laos': [19.8563, 102.4955],
  'Mongolia': [46.8625, 103.8467],
  'Taiwan': [23.6978, 120.9605],
  'Hong Kong': [22.3193, 114.1694],
};

const Mapa = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('GLOBAL');
  const [countryData, setCountryData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar el archivo TSV
    fetch(`${process.env.PUBLIC_URL}/data.tsv`) // Asegúrate de poner tu archivo aquí
      .then(response => response.text())
      .then(text => {
        const rows = text.split('\n');
        const headers = rows[0].split('\t');
        
        const parsedData = rows.slice(1)
          .filter(row => row.trim())
          .map(row => {
            const values = row.split('\t');
            const entry = {};
            headers.forEach((header, index) => {
              entry[header] = values[index];
            });
            return entry;
          });

        setData(parsedData);
        processCountryData(parsedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading TSV:', error);
        setLoading(false);
      });
  }, []);

  const processCountryData = (rawData) => {
    const grouped = {};
    
    rawData.forEach(entry => {
      const country = entry.Country;
      const host = entry.Host;
      const year = entry.Collection_Date ? entry.Collection_Date.split('-')[0] : 'Unknown';
      
      if (!grouped[country]) {
        grouped[country] = {
          total: 0,
          hosts: new Set(),
          years: new Set(),
          tomate: 0,
          pimenton: 0,
          isolates: []
        };
      }
      
      grouped[country].total++;
      grouped[country].hosts.add(host);
      grouped[country].years.add(year);
      grouped[country].isolates.push(entry.Isolate || 'Unknown');
      
      // Clasificar por tipo de huésped
      if (host && host.toLowerCase().includes('lycopersicum')) {
        grouped[country].tomate++;
      } else if (host && host.toLowerCase().includes('capsicum')) {
        grouped[country].pimenton++;
      }
    });

    // Convertir Sets a Arrays
    Object.keys(grouped).forEach(country => {
      grouped[country].hosts = Array.from(grouped[country].hosts);
      grouped[country].years = Array.from(grouped[country].years).sort();
    });

    setCountryData(grouped);
  };

  const getFilteredCountries = () => {
    if (filter === 'GLOBAL') return Object.keys(countryData);
    if (filter === 'TOMATE') return Object.keys(countryData).filter(c => countryData[c].tomate > 0);
    if (filter === 'PIMENTÓN') return Object.keys(countryData).filter(c => countryData[c].pimenton > 0);
    return [];
  };

  const getMarkerColor = (country) => {
    const total = countryData[country].total;
    if (total >= 50) return '#E74C3C'; // Rojo oscuro
    if (total >= 20) return '#E67E22'; // Naranja
    if (total >= 10) return '#F39C12'; // Naranja claro
    return '#F8B739'; // Amarillo
  };

  const getMarkerSize = (country) => {
    const total = countryData[country].total;
    if (total >= 50) return 15;
    if (total >= 20) return 12;
    if (total >= 10) return 10;
    return 8;
  };

  if (loading) {
    return (
      <section className="mapa-section">
        <div className="loading">Cargando datos del mapa...</div>
      </section>
    );
  }

  return (
    <section className="mapa-section">
      <div className="mapa-container">
        <h2 className="mapa-title">DISTRIBUCIÓN GLOBAL DEL ToBRFV</h2>
        
        <div className="mapa-tabs">
          <button 
            className={filter === 'GLOBAL' ? 'tab active' : 'tab'}
            onClick={() => setFilter('GLOBAL')}
          >
            GLOBAL
          </button>
          <button 
            className={filter === 'TOMATE' ? 'tab active' : 'tab'}
            onClick={() => setFilter('TOMATE')}
          >
            TOMATE
          </button>
          <button 
            className={filter === 'PIMENTÓN' ? 'tab active' : 'tab'}
            onClick={() => setFilter('PIMENTÓN')}
          >
            PIMENTÓN
          </button>
        </div>

        <div className="map-wrapper">
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: '500px', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            
            {getFilteredCountries().map(country => {
              const coords = COUNTRY_COORDS[country];
              if (!coords) return null;

              const info = countryData[country];
              const firstYear = info.years[0];
              const lastYear = info.years[info.years.length - 1];

              return (
                <CircleMarker
                  key={country}
                  center={coords}
                  radius={getMarkerSize(country)}
                  fillColor={getMarkerColor(country)}
                  color="#fff"
                  weight={2}
                  opacity={1}
                  fillOpacity={0.8}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                    <div className="country-tooltip">
                      <strong>{country}</strong>
                      <div>Detecciones: {info.total}</div>
                    </div>
                  </Tooltip>
                  
                  <Popup maxWidth={300}>
                    <div className="country-popup">
                      <h3>{country}</h3>
                      <div className="popup-stats">
                        <div className="stat">
                          <span className="label">📍 Detecciones:</span>
                          <span className="value">{info.total}</span>
                        </div>
                        <div className="stat">
                          <span className="label">📅 Detección:</span>
                          <span className="value">{firstYear}</span>
                        </div>
                        <div className="stat">
                          <span className="label">🌱 Hospederos:</span>
                          <span className="value">{info.hosts.join(', ')}</span>
                        </div>
                        {info.tomate > 0 && (
                          <div className="stat">
                            <span className="label">🍅 Tomate:</span>
                            <span className="value">{info.tomate}</span>
                          </div>
                        )}
                        {info.pimenton > 0 && (
                          <div className="stat">
                            <span className="label">🌶️ Pimentón:</span>
                            <span className="value">{info.pimenton}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        <div className="mapa-legend">
          <h4>Leyenda</h4>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#E74C3C' }}></div>
              <span>50+ detecciones</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#E67E22' }}></div>
              <span>20-49 detecciones</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#F39C12' }}></div>
              <span>10-19 detecciones</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#F8B739' }}></div>
              <span>1-9 detecciones</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mapa;
