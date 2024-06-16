import { BimViewer } from "/gemeni.js";

const filename = "Duplex.gltf";
const modelCfg = {
  modelId: filename,
  name: filename,
  // src: `./demo/models/gltf/${filename}`,
  src: `./gltf/Duplex.gltf`,
  edges: false,
};
const viewerCfg = {
  containerId: "myCanvas",
  language: "en",
  enableProgressBar: false,
  enableSpinner: false,
  locale: "en",
  enableSelection: false,
};
const viewer = new BimViewer(viewerCfg);
viewer
  .loadModel(
    modelCfg,
    (event) => {
      const progress = ((event.loaded * 100) / event.total).toFixed(1);
      console.log(
        `[Demo] Loading '${
          modelCfg.id || modelCfg.name
        }' progress: ${progress}%`
      );
    },
    (event) => {
      console.error(
        "[Demo] Failed to load " + modelCfg.src + ". " + event.message
      );
    }
  )
  .then(() => {
    console.log(`[Demo] Loaded model ${modelCfg.src}`);
  });
