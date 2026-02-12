import React, { useState, useEffect, useRef } from 'react';
import Graph from 'graphology';
import Sigma from 'sigma';
import './Redes.css';

const Redes = () => {
  const [activeTab, setActiveTab] = useState('antioquia');
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, tomate, pimenton
  const containerRef = useRef(null);
  const sigmaRef = useRef(null);

  useEffect(() => {
    loadGraph(activeTab);
  }, [activeTab]);

  const loadGraph = async (region) => {
    setLoading(true);
    try {
      const filename = region === 'antioquia' 
        ? 'final_Antioquia_network_paper.gexf'
        : 'final_Colombia_network_paper.gexf';
      
      const response = await fetch(`${process.env.PUBLIC_URL}/${filename}`);
      const gexfText = await response.text();
      
      const graph = parseGEXF(gexfText);
      setGraphData(graph);
      calculateStats(graph);
      renderGraph(graph);
      setLoading(false);
    } catch (error) {
      console.error('Error loading graph:', error);
      setLoading(false);
    }
  };

  const parseGEXF = (gexfText) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(gexfText, 'text/xml');
    
    const graph = new Graph();
    
    // Parse nodes
    const nodes = xmlDoc.querySelectorAll('node');
    nodes.forEach(node => {
      const id = node.getAttribute('id');
      const label = node.getAttribute('label');
      
      // Get position
      const position = node.querySelector('viz\\:position, position');
      const x = parseFloat(position?.getAttribute('x') || 0);
      const y = parseFloat(position?.getAttribute('y') || 0);
      
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
        
        // Map attribute IDs to names (based on GEXF structure)
        const attrMap = {
          '1': 'departamento',
          '2': 'municipio',
          '3': 'vereda',
          '5': 'tomate',
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
      
      graph.addNode(id, {
        label: attributes.vereda || label,
        x: x / 100000, // Scale down for better visualization
        y: y / 100000,
        size: Math.log(nodeSize + 1) * 2,
        color: `rgb(${r}, ${g}, ${b})`,
        ...attributes
      });
    });
    
    // Parse edges
    const edges = xmlDoc.querySelectorAll('edge');
    edges.forEach((edge, index) => {
      const source = edge.getAttribute('source');
      const target = edge.getAttribute('target');
      const weight = parseFloat(edge.getAttribute('weight') || 1);
      
      if (graph.hasNode(source) && graph.hasNode(target)) {
        graph.addEdge(source, target, {
          weight: weight,
          size: Math.log(weight + 1) * 0.5
        });
      }
    });
    
    return graph;
  };

  const calculateStats = (graph) => {
    const nodes = graph.nodes();
    let tomateCount = 0;
    let pimentonCount = 0;
    let bothCount = 0;
    
    nodes.forEach(node => {
      const attrs = graph.getNodeAttributes(node);
      const hasTomate = attrs.tomate === true || attrs.tomate === 'true';
      const hasPimenton = attrs.pimenton === true || attrs.pimenton === 'true';
      
      if (hasTomate) tomateCount++;
      if (hasPimenton) pimentonCount++;
      if (hasTomate && hasPimenton) bothCount++;
    });
    
    setStats({
      totalNodes: nodes.length,
      totalEdges: graph.edges().length,
      tomateNodes: tomateCount,
      pimentonNodes: pimentonCount,
      bothNodes: bothCount
    });
  };

  const renderGraph = (graph) => {
    if (!containerRef.current || !graph) return;
    
    // Clear previous instance
    if (sigmaRef.current) {
      sigmaRef.current.kill();
    }
    
    // Apply filters
    const filteredGraph = applyFilters(graph);
    
    // Create new Sigma instance
    const sigma = new Sigma(filteredGraph, containerRef.current, {
      renderLabels: true,
      labelSize: 12,
      labelWeight: 'bold',
      defaultNodeColor: '#E74C3C',
      defaultEdgeColor: '#ddd',
      minCameraRatio: 0.1,
      maxCameraRatio: 10,
    });
    
    // Add hover effects
    sigma.on('enterNode', ({ node }) => {
      const nodeData = filteredGraph.getNodeAttributes(node);
      const tooltip = document.getElementById('graph-tooltip');
      if (tooltip && nodeData) {
        tooltip.innerHTML = `
          <strong>${nodeData.label || nodeData.vereda}</strong><br/>
          Municipio: ${nodeData.municipio || 'N/A'}<br/>
          ${nodeData.tomate ? '🍅 Tomate' : ''} 
          ${nodeData.pimenton ? '🌶️ Pimentón' : ''}
        `;
        tooltip.style.display = 'block';
      }
    });
    
    sigma.on('leaveNode', () => {
      const tooltip = document.getElementById('graph-tooltip');
      if (tooltip) tooltip.style.display = 'none';
    });
    
    sigmaRef.current = sigma;
  };

  const applyFilters = (graph) => {
    if (filterType === 'all' && !searchTerm) return graph;
    
    const filteredGraph = graph.copy();
    const nodesToRemove = [];
    
    filteredGraph.forEachNode((node, attrs) => {
      let shouldRemove = false;
      
      // Filter by type
      if (filterType === 'tomate' && !attrs.tomate) shouldRemove = true;
      if (filterType === 'pimenton' && !attrs.pimenton) shouldRemove = true;
      
      // Filter by search
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matches = 
          (attrs.vereda && attrs.vereda.toLowerCase().includes(searchLower)) ||
          (attrs.municipio && attrs.municipio.toLowerCase().includes(searchLower));
        if (!matches) shouldRemove = true;
      }
      
      if (shouldRemove) nodesToRemove.push(node);
    });
    
    nodesToRemove.forEach(node => filteredGraph.dropNode(node));
    
    return filteredGraph;
  };

  useEffect(() => {
    if (graphData) {
      renderGraph(graphData);
    }
  }, [filterType, searchTerm, graphData]);

  return (
    <section className="redes-section">
      <div className="redes-container">
        <h2 className="redes-title">REDES DE TRANSMISIÓN DEL VIRUS</h2>
        
        <p className="redes-description">
          Explora las redes de transmisión del ToBRFV basadas en el modelo de gravedad log-transformado.
          Cada nodo representa una vereda, y las conexiones muestran el riesgo de transmisión entre cultivos.
        </p>

        {/* Tabs */}
        <div className="redes-tabs">
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
        <div className="redes-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar vereda o municipio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-buttons">
            <button 
              className={filterType === 'all' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilterType('all')}
            >
              Todos
            </button>
            <button 
              className={filterType === 'tomate' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilterType('tomate')}
            >
              🍅 Tomate
            </button>
            <button 
              className={filterType === 'pimenton' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilterType('pimenton')}
            >
              🌶️ Pimentón
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="redes-stats">
            <div className="stat-card">
              <div className="stat-value">{stats.totalNodes}</div>
              <div className="stat-label">Veredas</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalEdges}</div>
              <div className="stat-label">Conexiones</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.tomateNodes}</div>
              <div className="stat-label">🍅 Tomate</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.pimentonNodes}</div>
              <div className="stat-label">🌶️ Pimentón</div>
            </div>
          </div>
        )}

        {/* Graph Container */}
        <div className="graph-wrapper">
          {loading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p>Cargando red de {activeTab}...</p>
            </div>
          )}
          <div ref={containerRef} className="graph-container"></div>
          <div id="graph-tooltip" className="graph-tooltip"></div>
        </div>

        {/* Legend */}
        <div className="redes-legend">
          <h4>Leyenda</h4>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-node" style={{ backgroundColor: '#E74C3C' }}></div>
              <span>Nodo de cultivo</span>
            </div>
            <div className="legend-item">
              <div className="legend-line"></div>
              <span>Conexión de riesgo</span>
            </div>
            <div className="legend-item">
              <span className="legend-badge">Tamaño = Importancia (PageRank)</span>
            </div>
          </div>
        </div>

        <div className="redes-info">
          <p>
            <strong>Cómo navegar:</strong> Usa la rueda del mouse para zoom, arrastra para mover,
            y pasa el cursor sobre los nodos para ver información detallada.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Redes;
