import React from "react";

function Mapa() {
  return (
    <section>
      <h2>Distribución global del ToBRFV</h2>

      <div className="card">
        <p>
          Mapa interactivo de la presencia del virus en tomate y pimentón.
        </p>

        <div
          style={{
            height: "300px",
            background: "#e5e7eb",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <span>[Mapa aquí]</span>
        </div>
      </div>
    </section>
  );
}

export default Mapa;

