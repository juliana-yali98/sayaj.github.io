import React from "react";

const ProteinViewerPro = () => {
  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "40px 0"
      }}
    >
      <h2
        style={{
          fontSize: "28px",
          fontWeight: "600",
          marginBottom: "10px",
          textAlign: "center"
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
          marginInline: "auto"
        }}
      >
        High-resolution structural model visualized using Mol*. 
        The structure can be interactively explored in 3D.
      </p>

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
          src="/molstar-viewer.html"
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
  );
};

export default ProteinViewerPro;

