import React from "react";

function Proteinas() {
  return (
    <section>
      <h2>Proteínas virales</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
        <div className="card">
          <h3 style={{ color: "#3a7bd5" }}>Replicasa RNA</h3>
          <p>Participa en la replicación viral.</p>
        </div>

        <div className="card">
          <h3 style={{ color: "#4f8f6f" }}>Proteína de movimiento</h3>
          <p>Facilita el transporte celular.</p>
        </div>

        <div className="card">
          <h3 style={{ color: "#f28c28" }}>Cápside (CP)</h3>
          <p>Ensamblaje y protección del genoma.</p>
        </div>
      </div>
    </section>
  );
}

export default Proteinas;

