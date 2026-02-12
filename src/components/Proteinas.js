import React from "react";
import VirusBackground from "./VirusBackground";

const ProteinViewerPro = () => {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "80px 0",
        backgroundColor: "#f4f6f5"
      }}
    >
      {/* Background Animation */}
      <VirusBackground virusCount={18} cellCount={10} />

      {/* Content Container */}
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
            fontSize: "28px",
            fontWeight: "600",
            marginBottom: "10px",
            textAlign: "center",
            color: "#1f2933"
          }}
        >
          Structural Model of the Viral Protein
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#555",
            marginBottom: "30px",
            maxWidth: "800px",
            marginInline: "auto",
            lineHeight: "1.6"
          }}
        >
          High-resolution structural model visualized using Mol*. 
          The structure can be interactively explored in 3D.
        </p>

        {/* Mol* Viewer Container */}
        <div
          style={{
            width: "100%",
            height: "650px",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
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
            color: "#777",
            marginTop: "20px",
            textAlign: "center"
          }}
        >
          Figure 1. Three-dimensional structural model of the viral protein.
        </p>
      </div>
    </section>
  );
};

export default ProteinViewerPro;

