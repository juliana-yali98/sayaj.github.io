import React from "react";
import VirusBackground from "./VirusBackground";

const ProteinViewerPro = () => {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "80px 0"
      }}
    >
      {/* Fondo igual al Hero */}
      <VirusBackground />

      {/* Contenido */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 20px"
        }}
      >
        <h2
  style={{
    fontSize: "2.5rem",              // Igual que GLOBAL DISTRIBUTION
    fontWeight: "700",             // Mismo grosor
    marginBottom: "40px",          // Igual separación
    textAlign: "center",
    color: "#ffffff",
    textTransform: "uppercase",    // Todo en mayúsculas
    textShadow: "0 2px 8px rgba(0,0,0,0.6)",
    letterSpacing: "1px"           // Opcional: un poquito de espacio entre letras
  }}
>
  Structural Model of the Viral Protein
</h2>



        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.85)",
            marginBottom: "30px",
            maxWidth: "800px",
            marginInline: "auto",
            lineHeight: "1.6",
            textShadow: "0 2px 8px rgba(0,0,0,0.6)"
          }}
        >
          High-resolution structural model visualized using Mol*. 
          The structure can be interactively explored in 3D.
        </p>

        {/* Mol* Viewer */}
        <div
          style={{
            width: "100%",
            height: "650px",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            backgroundColor: "#ffffff"
          }}
        >
          <iframe
            src={`${process.env.PUBLIC_URL}/molstar-viewer.html`}
            title="Protein Structure Viewer"
            style={{
              width: "100%",
              height: "100%",
              border: "none"
            }}
          />
        </div>

        <p
          style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.7)",
            marginTop: "20px",
            textAlign: "center",
            textShadow: "0 2px 8px rgba(0,0,0,0.6)"
          }}
        >
          Figure 1. Three-dimensional structural model of the viral protein.
        </p>
      </div>
    </section>
  );
};

export default ProteinViewerPro;

