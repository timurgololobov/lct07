import {
  AxisGizmoPlugin,
  AxisType,
  BimViewer,
  BimViewerToolbarPlugin,
  MeasurementPlugin,
  SectionPlugin,
  SectionType,
  ViewCubePlugin,
} from "/gemeni.js";
import * as dat from "/dat.gui.module.js";
const gui = new dat.GUI();

const project = {
  id: "building1",
  name: "building1",
  models: [
    {
      name: "building1",
      src: "/gltf/building1.gltf",
      edges: true,
      visible: true,
    },
    {
      id: "building1_dxf",
      name: "building1 plan drawing",
      src: "/dxf/building1.dxf",
      matrix: [
        0.001,
        0,
        0,
        0, // the dxf is in "mm", and gltf is in "meter", so need to set scale 0.001
        0,
        0,
        -0.001,
        0,
        0,
        0.001,
        0,
        0,
        -1831.34,
        0,
        456.91,
        1, // also need to consider the base point
      ],
      edges: true,
      visible: true,
    },
  ],
};
const viewer = new BimViewer({
  containerId: "myCanvas",
  language: "en",
});

new AxisGizmoPlugin(viewer);
new BimViewerToolbarPlugin(viewer);
new MeasurementPlugin(viewer);
new ViewCubePlugin(viewer);
const sectionPlugin = new SectionPlugin(viewer);

// font file is needed for loading dxf
// const fontFiles = ["./demo/libs/fonts/Microsoft_YaHei_Regular.typeface.json"];
const fontFiles = [
  "./demo/libs/fonts/hztxt.shx",
  "./demo/libs/fonts/simplex.shx",
];
await viewer.setFont(fontFiles);

// draco decoder path is needed to load draco encoded models.
// gemini-viewer js sdk user maintains draco decoder code somewhere, and provides the path here.
const decoderPath = "/draco/gltf/";
viewer.setDracoDecoderPath(decoderPath);

project.models.forEach((modelCfg) => {
  if (modelCfg.visible === false) {
    // visible is true by default
    return; // only load visible ones
  }
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

      const bothModelsLoaded = viewer.loadedModels.length > 1;
      if (controls.enableSection && bothModelsLoaded) {
        updateDxfAndSectionPlane(controls.dxfElevation, true);
      }
    });
});

const updateDxfAndSectionPlane = (dxfElevation, enableSection) => {
  const model = viewer.loadedModels.find((model) =>
    model.modelId.endsWith(".dxf")
  );
  if (!model) {
    return; // dxf may not being loaded yet.
  }
  const object = model.getModelObject();
  object.position.setY(dxfElevation);
  object.updateMatrix();
  //   const axisPlaneSection = sectionPlugin.sections[SectionType.AxisPlaneSection];
  //   if (enableSection) {
  //     if (!sectionPlugin.isActive()) {
  //       const sectionPlaneOffset = 0.01; // to avoid cliping the dxf
  //       axisPlaneSection.activate(AxisType.Y, dxfElevation + sectionPlaneOffset);
  //       axisPlaneSection.setSectionPlaneVisible(false);
  //     } else {
  //       axisPlaneSection.setActiveAxis(AxisType.Y, dxfElevation);
  //     }
  //   } else {
  //     axisPlaneSection.deactivate();
  //   }
  viewer.enableRender();
};

// dat.gui controls
const controls = {
  dxfElevation: 17,
  enableSection: true,
};
// update dxf elevation between -2 to 30, default value is 17.
gui
  .add(controls, "dxfElevation", -2.0, 30.0, 0.1)
  .name("Dxf elevation")
  .setValue(controls.dxfElevation) // the origin value is 17
  .onChange((val) => {
    controls.dxfElevation = val;
    updateDxfAndSectionPlane(controls.dxfElevation, controls.enableSection);
  });
gui
  .add(controls, "enableSection", controls.enableSection)
  .name("Enable Section")
  .setValue(controls.enableSection)
  .onChange((val) => {
    controls.enableSection = val;
    updateDxfAndSectionPlane(controls.dxfElevation, controls.enableSection);
  });
