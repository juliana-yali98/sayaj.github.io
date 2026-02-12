import React, { useState } from "react";
import "./Comparativa.css";

function Comparativa() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section className="comparative-section">

      <div className="section-header">
        <h2>Comparative Pathogenesis of ToBRFV</h2>
        <p>
          Differential symptom expression and epidemiological severity of 
          Tomato brown rugose fruit virus (ToBRFV) in tomato and pepper crops.
        </p>
      </div>

      <div className="comparison-grid">

        {/* TOMATO */}
        <div className="comparison-card">
          <div className="image-wrapper">
            <img
              src={`${process.env.PUBLIC_URL}/images/tobrfv-tomato.jpg`}
              alt="ToBRFV symptoms in tomato"
              onClick={() =>
                setSelectedImage(`${process.env.PUBLIC_URL}/images/tobrfv-tomato.jpg`)
              }
            />
            <div className="severity severe">High Severity</div>
          </div>

          <div className="card-content">
            <h3>Tomato (Solanum lycopersicum)</h3>

            <ul>
              <li>Severe mosaic and chlorotic mottling</li>
              <li>Fruit rugosity and brown necrotic patches</li>
              <li>Uneven ripening and deformation</li>
              <li>Significant yield reduction (&gt;30%)</li>
            </ul>

            <div className="severity-bar">
              <div className="bar-fill tomato"></div>
            </div>
          </div>
        </div>

        {/* PEPPER */}
        <div className="comparison-card">
          <div className="image-wrapper">
            <img
              src={`${process.env.PUBLIC_URL}/images/tobrfv-pepper.jpg`}
              alt="ToBRFV symptoms in pepper"
              onClick={() =>
                setSelectedImage(`${process.env.PUBLIC_URL}/images/tobrfv-pepper.jpg`)
              }
            />
            <div className="severity moderate">Moderate Severity</div>
          </div>

          <div className="card-content">
            <h3>Pepper (Capsicum annuum)</h3>

            <ul>
              <li>Mild to moderate mosaic pattern</li>
              <li>Leaf blistering and distortion</li>
              <li>Chlorotic fruit spotting</li>
              <li>Variable cultivar-dependent expression</li>
            </ul>

            <div className="severity-bar">
              <div className="bar-fill pepper"></div>
            </div>
          </div>
        </div>

      </div>

      {/* Technical Table */}
      <div className="technical-table">
        <h4>Technical Comparative Metrics</h4>
        <table>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Tomato</th>
              <th>Pepper</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Transmission Efficiency</td>
              <td>Very High</td>
              <td>High</td>
            </tr>
            <tr>
              <td>Fruit Market Impact</td>
              <td>Severe</td>
              <td>Moderate</td>
            </tr>
            <tr>
              <td>Symptom Variability</td>
              <td>Low</td>
              <td>High</td>
            </tr>
            <tr>
              <td>Economic Risk Level</td>
              <td>Critical</td>
              <td>Significant</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="figure-caption">
        Figure 2. Comparative symptom expression and epidemiological severity of ToBRFV in tomato and pepper.
      </p>

      {selectedImage && (
        <div className="modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Zoomed symptom" />
        </div>
      )}

    </section>
  );
}

export default Comparativa;

