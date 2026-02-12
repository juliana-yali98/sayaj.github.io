import React, { useState } from "react";
import "./ComparativaPro.css";

function ComparativaPro() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="comparativa-section">
      <h2 className="title">
        Comparative Pathogenesis of ToBRFV
      </h2>

      <p className="subtitle">
        Differential symptom expression and epidemiological severity of Tomato brown rugose fruit virus (ToBRFV) in tomato and pepper crops.
      </p>

      <div className="grid-container">
        
        {/* TOMATO CARD */}
        <div 
          className={`card ${hovered === "tomato" ? "active" : ""}`}
          onMouseEnter={() => setHovered("tomato")}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="image-container">
            <img src={`${process.env.PUBLIC_URL}/images/tomato_tobrfv.jpg`} alt="ToBRFV in Tomato"/>
            <span className="severity-badge high">High Severity</span>
          </div>

          <h3>Tomato (Solanum lycopersicum)</h3>

          <ul>
            <li>Severe mosaic and chlorotic mottling</li>
            <li>Fruit rugosity and brown necrotic lesions</li>
            <li>Uneven ripening and deformation</li>
            <li>Yield reduction frequently exceeding 30%</li>
          </ul>

          <div className="severity-bar">
            <div className="bar-fill tomato"></div>
          </div>
        </div>

        {/* PEPPER CARD */}
        <div 
          className={`card ${hovered === "pepper" ? "active" : ""}`}
          onMouseEnter={() => setHovered("pepper")}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="image-container">
            <img src={`${process.env.PUBLIC_URL}/images/pepper_tobrfv.jpg`} alt="ToBRFV in Pepper"/>
            <span className="severity-badge moderate">Moderate Severity</span>
          </div>

          <h3>Pepper (Capsicum annuum)</h3>

          <ul>
            <li>Mild to moderate mosaic pattern</li>
            <li>Leaf blistering and distortion</li>
            <li>Chlorotic fruit spotting</li>
            <li>Cultivar-dependent symptom variability</li>
          </ul>

          <div className="severity-bar">
            <div className="bar-fill pepper"></div>
          </div>
        </div>

      </div>

      {/* TECHNICAL TABLE */}
      <div className="metrics">
        <h3>Technical Comparative Metrics</h3>
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
              <td className="critical">Critical</td>
              <td className="significant">Significant</td>
            </tr>
          </tbody>
        </table>
      </div>

    </section>
  );
}

export default ComparativaPro;

