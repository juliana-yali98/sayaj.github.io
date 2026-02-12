import React, { useEffect, useRef } from "react";
import { createPlugin } from "molstar/lib/mol-plugin";
import { DefaultPluginSpec } from "molstar/lib/mol-plugin/spec";
import { PluginConfig } from "molstar/lib/mol-plugin/config";

const ProteinViewerPro = () => {
  const viewerRef = useRef(null);

  useEffect(() => {
    async function init() {
      const plugin = await createPlugin({
        target: viewerRef.current,
        spec: DefaultPluginSpec(),
        config: [
          [PluginConfig.General.DisableAntialiasing, false],
        ]
      });

      const data = await plugin.builders.data.download(
        { url: "/fold_2025_01_27_10_23_model_0.cif" },
        { state: { isGhost: true } }
      );

      const trajectory = await plugin.builders.structure.parseTrajectory(data, "mmcif");
      const model = await plugin.builders.structure.createModel(trajectory);
      const structure = await plugin.builders.structure.createStructure(model);

      // Cartoon representation
      await plugin.builders.structure.representation.addRepresentation(structure, {
        type: "cartoon",
        color: "chain-id"
      });

      // Surface semi-transparente
      await plugin.builders.structure.representation.addRepresentation(structure, {
        type: "molecular-surface",
        typeParams: { alpha: 0.2 },
        color: "uniform",
        colorParams: { value: 0xcccccc }
      });

      plugin.canvas3d.setProps({
        renderer: { backgroundColor: 0xffffff }
      });

      plugin.managers.camera.reset();
    }

    init();
  }, []);

  return (
    <div
      ref={viewerRef}
      style={{ width: "100%", height: "650px", borderRadius: "12px" }}
    />
  );
};

export default ProteinViewerPro;

