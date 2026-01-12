import React from "react";
import AntioquiaMap from "./AntioquiaMap";

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "Georgia, serif", padding: "2rem" }}>
      {/* Encabezado */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        {/* Texto */}
        <div style={{ flex: "1 1 600px", minWidth: "300px" }}>
          <h1 style={{ fontSize: "5rem", marginBottom: "0.5rem" }}>
            Título del artículo
          </h1>
          <p
            style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "#555" }}
          >
            Autor1 – Autor2 – Autor3 - Autor4 – Autor5
          </p>
          <div
            style={{
              backgroundColor: "#f9f9f9",
              padding: "1rem",
              borderRadius: "8px",
              maxWidth: "100%",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Abstract</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut non
              vehicula nisi. Nulla venenatis augue cursus, egestas nulla id,
              hendrerit dui. Aenean in rutrum odio. Nunc vulputate accumsan
              metus ac egestas. Curabitur euismod justo ut eros feugiat
              ultricies in vitae tortor. Aenean nec ex hendrerit, posuere tortor
              ut, molestie ante. Suspendisse blandit fringilla hendrerit. Nullam
              diam ex, convallis ut placerat at, egestas quis purus. Phasellus
              interdum dignissim ligula, ut tempor arcu viverra sit amet.
              Aliquam posuere justo id volutpat ullamcorper. Integer tincidunt
              lobortis eros, sed accumsan risus congue et.
            </p>
          </div>
        </div>

        {/* Imagen */}
        <div style={{ flex: "0 0 auto" }}>
          <img
            src="/uchuva.jpg"
            alt="Foto uchuva"
            style={{
              width: "280px",
              borderRadius: "8px",
              objectFit: "cover",
              marginTop: "10px",
            }}
          />
        </div>
      </div>

      {/* Separador */}
      <hr style={{ margin: "2rem 0" }} />

      {/* Mapa */}
      <AntioquiaMap />
    </div>
  );
}
