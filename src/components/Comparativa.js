import React from "react";

function Comparativa() {
  return (
    <section>
      <h2>Tomate vs Pimentón</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <div className="card">
          <h3>Tomate</h3>
          <p>Síntomas severos y alta transmisión.</p>
        </div>

        <div className="card">
          <h3>Pimentón</h3>
          <p>Variaciones sintomáticas y transmisión variable.</p>
        </div>
      </div>
    </section>
  );
}

export default Comparativa;

