import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Redes.css';

const RedesConMapa = () => {
  const [activeTab, setActiveTab] = useState('antioquia');
  const [networkData, setNetworkData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [showConnections, setShowConnections] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    loadNetwork(activeTab);
  }, [activeTab]);

  const loadNetwork = async (region) => {
    setLoading(true);
    try {
      const filename = region === 'antioquia' 
        ? 'final_Antioquia_network_paper.gexf'
        : 'final_Colombia_network_paper.gexf';
      
      const response = await fetch(`${process.env.PUBLIC_URL}/${filename}`);
      const gexfText = await response.text();
      
      const data = parseGEXF(gexfText);
      setNetworkData(data);
      calculateStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading network:', error);
      setLoading(false);
    }
  };

  const parseGEXF = (gexfText) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(gexfText, 'text/xml');
    
    const nodes = [];
    const edges = [];
    const nodeMap = {};
    
    // Parse nodes
    const nodeElements = xmlDoc.querySelectorAll('node');
    nodeElements.forEach(node => {
      const id = node.getAttribute('id');
      const label = node.getAttribute('label');
      
      // Get position (these are projected coordinates)
      const position = node.querySelector('viz\\:position, position');
      const x = parseFloat(position?.getAttribute('x') || 0);
      const y = parseFloat(position?.getAttribute('y') || 0);
      
      // Convert from projected coordinates to lat/lng
      // Approximate conversion for Colombia (Web Mercator to WGS84)
      const lng = x / 111320; // meters to degrees longitude
      const lat = (180 / Math.PI) * (2 * Math.atan(Math.exp(y / 6378137)) - Math.PI / 2);
      
      // Get color
      const color = node.querySelector('viz\\:color, color');
      const r = parseInt(color?.getAttribute('r') || 228);
      const g = parseInt(color?.getAttribute('g') || 26);
      const b = parseInt(color?.getAttribute('b') || 28);
      
      // Get size
      const size = node.querySelector('viz\\:size, size');
      const nodeSize = parseFloat(size?.getAttribute('value') || 5);
      
      // Get attributes
      const attvalues = node.querySelectorAll('attvalue');
      const attributes = {};
      attvalues.forEach(att => {
        const forId = att.getAttribute('for');
        const value = att.getAttribute('value');
        
        const attrMap = {
          '1': 'departamento',
          '2': 'municipio',
          '3': 'vereda',
          '5': 'Tomato',
          '7': 'pimenton',
          '8': 'betweenness',
          '0': 'pagerank',
          '9': 'louvain'
        };
        
        if (attrMap[forId]) {
          attributes[attrMap[forId]] = value === 'true' ? true : 
                                        value === 'false' ? false : value;
        }
      });
      
      const nodeData = {
        id,
        label: attributes.vereda || label,
        lat,
        lng,
        size: Math.log(nodeSize + 1) * 3,
        color: `rgb(${r}, ${g}, ${b})`,
        ...attributes
      };
      
      nodes.push(nodeData);
      nodeMap[id] = nodeData;
    });
    
    // Parse edges
    const edgeElements = xmlDoc.querySelectorAll('edge');
    edgeElements.forEach((edge, index) => {
      const source = edge.getAttribute('source');
      const target = edge.getAttribute('target');
      const weight = parseFloat(edge.getAttribute('weight') || 1);
      
      if (nodeMap[source] && nodeMap[target]) {
        edges.push({
          id: index,
          source: nodeMap[source],
          target: nodeMap[target],
          weight: weight,
          opacity: Math.min(Math.log(weight + 1) / 10, 0.8)
        });
      }
    });
    
    return { nodes, edges };
  };

  const calculateStats = (data) => {
    if (!data || !data.nodes) return;
    
    let TomatoCount = 0;
    let pimentonCount = 0;
    let bothCount = 0;
    
    data.nodes.forEach(node => {
      const hasTomato = node.Tomato === true || node.Tomato === 'true';
      const hasPimenton = node.pimenton === true || node.pimenton === 'true';
      
      if (hasTomato) TomatoCount++;
      if (hasPimenton) pimentonCount++;
      if (hasTomato && hasPimenton) bothCount++;
    });
    
    setStats({
      totalNodes: data.nodes.length,
      totalEdges: data.edges.length,
      TomatoNodes: TomatoCount,
      pimentonNodes: pimentonCount,
      bothNodes: bothCount
    });
  };

  const getFilteredData = () => {
    if (!networkData) return { nodes: [], edges: [] };
    
    let filteredNodes = networkData.nodes;
    
    if (filterType === 'Tomato') {
      filteredNodes = filteredNodes.filter(n => n.Tomato === true || n.Tomato === 'true');
    } else if (filterType === 'pimenton') {
      filteredNodes = filteredNodes.filter(n => n.pimenton === true || n.pimenton === 'true');
    }
    
    // Filter edges to only include those between visible nodes
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredEdges = networkData.edges.filter(
      e => nodeIds.has(e.source.id) && nodeIds.has(e.target.id)
    );
    
    return { nodes: filteredNodes, edges: filteredEdges };
  };

  const getMapCenter = () => {
    if (activeTab === 'antioquia') {
      return [6.5, -75.5]; // Centro de Antioquia
    }
    return [4.5, -74]; // Centro de Colombia
  };

  const getMapZoom = () => {
    return activeTab === 'antioquia' ? 9 : 6;
  };

  const { nodes, edges } = getFilteredData();

  return (
    <section className="redes-mapa-section">
      <div className="redes-mapa-container">
        <h2 className="redes-mapa-title">VIRUS TRANSMISSION NETWORKS</h2>
        
        <p className="redes-mapa-description">
          Geographic visualization of the ToBRFV transmission networks.
Each point represents a path, and the lines show transmission risk connections.
        </p>

        {/* Tabs */}
        <div className="redes-mapa-tabs">
          <button 
            className={activeTab === 'antioquia' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('antioquia')}
          >
            ANTIOQUIA
          </button>
          <button 
            className={activeTab === 'colombia' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('colombia')}
          >
            COLOMBIA
          </button>
        </div>

        {/* Controls */}
        <div className="redes-mapa-controls">
          <div className="filter-buttons">
            <button 
              className={filterType === 'all' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilterType('all')}
            >
              Todos
            </button>
            <button 
              className={filterType === 'Tomato' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilterType('Tomato')}
            >
              🍅 Tomato
            </button>
            <button 
              className={filterType === 'pimenton' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilterType('pimenton')}
            >
              🌶️ Pepper
            </button>
          </div>
          
          <div className="connection-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showConnections}
                onChange={(e) => setShowConnections(e.target.checked)}
              />
              <span>Mostrar Network connections</span>
            </label>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="redes-mapa-stats">
            <div className="stat-card">
              <div className="stat-value">{stats.totalNodes}</div>
              <div className="stat-label">Sidewalks</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalEdges}</div>
              <div className="stat-label">Network connections</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.TomatoNodes}</div>
              <div className="stat-label">🍅 Tomato</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.pimentonNodes}</div>
              <div className="stat-label">🌶️ Pepper</div>
            </div>
          </div>
        )}

        {/* Map */}
        <div className="map-network-wrapper">
          {loading ? (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p>Cargando red de {activeTab}...</p>
            </div>
          ) : (
            <MapContainer
              ref={mapRef}
              center={getMapCenter()}
              zoom={getMapZoom()}
              style={{ height: '700px', width: '100%' }}
              key={activeTab} // Force re-render on tab change
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              
              {/* Draw connections first (so they appear behind nodes) */}
              {showConnections && edges.slice(0, 5000).map((edge, idx) => (
                <Polyline
                  key={`edge-${idx}`}
                  positions={[
                    [edge.source.lat, edge.source.lng],
                    [edge.target.lat, edge.target.lng]
                  ]}
                  color="#E67E22"
                  weight={1}
                  opacity={edge.opacity * 0.3}
                />
              ))}
              
              {/* Draw nodes */}
              {nodes.map((node, idx) => (
                <CircleMarker
                  key={`node-${idx}`}
                  center={[node.lat, node.lng]}
                  radius={node.size}
                  fillColor={node.color}
                  color="#fff"
                  weight={2}
                  opacity={1}
                  fillOpacity={0.8}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                    <div className="node-tooltip-simple">
                      <strong>{node.label}</strong>
                    </div>
                  </Tooltip>
                  
                  <Popup maxWidth={280}>
                    <div className="node-popup">
                      <h3>{node.label}</h3>
                      <div className="popup-info">
                        <div className="info-row">
                          <span className="label">📍 Municipio:</span>
                          <span className="value">{node.municipio}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">🏛️ Departamento:</span>
                          <span className="value">{node.departamento}</span>
                        </div>
                        {node.Tomato && (
                          <div className="info-row">
                            <span className="badge Tomato">🍅 Cultivo de Tomato</span>
                          </div>
                        )}
                        {node.pimenton && (
                          <div className="info-row">
                            <span className="badge pimenton">🌶️ Cultivo de Pepper</span>
                          </div>
                        )}
                        {node.pagerank && (
                          <div className="info-row">
                            <span className="label">📊 PageRank:</span>
                            <span className="value">{parseFloat(node.pagerank).toExponential(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* Legend */}
        <div className="redes-mapa-legend">
          <h4>Label</h4>
          <div className="legend-grid">
            <div className="legend-item">
              <div className="legend-node" style={{ backgroundColor: '#E74C3C' }}></div>
              <span>Rural district with crops</span>
            </div>
            <div className="legend-item">
              <div className="legend-line"></div>
              <span>Risk connection</span>
            </div>
            <div className="legend-item">
              <span className="legend-info">Size = Importance in the network
</span>
            </div>
            <div className="legend-item">
              <span className="legend-info">Opacity = Connection strength</span>
            </div>
          </div>
        </div>

        <div className="redes-mapa-info">
          <p>
            <strong>💡 Note:</strong> This visualization shows the spatial structure of the transmission risk network.
The network connections represent potential routes of virus spread between cultivating sidewalks.
            {!showConnections && " Activa 'Mostrar Network connections' para ver las rutas de transmisión."}
          </p>
        </div>
      </div>
    </section>
  );
};

export default RedesConMapa;
