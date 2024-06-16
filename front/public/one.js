import {
  AxisGizmoPlugin,
  BottomBarPlugin,
  DxfViewer,
  DxfViewerToolbarPlugin,
  LayerManagerPlugin,
  LocalDxfUploader,
  MarkupType,
  MeasurementPlugin,
  ScreenshotPlugin,
  StatsPlugin,
  ToolbarMenuId,
  ViewerEvent,
} from "/gemeni.js";
import DxfComparePanel from "/dxfComparePanel.js";
import DxfSettingsPanel from "/DxfSettingsPanel.js";

// keep markup data and measurementData
const markupData = [];
const measurementData = [];
let isShowMarkup = true;

const config = {
  containerId: "myCanvas",
  enableSpinner: true,
  language: "en",
  locale: "en",
  enableProgressBar: true,
  enableLayoutBar: true,
  enableLocalCache: false,
  enableSelection: true,
};

// fix mobile markup toolbar
const isMobile = /mobile/i.test(navigator.userAgent);
if (isMobile) {
  config.toolbarMenuConfig[ToolbarMenuId.Markup] = {
    onClick: (viewer, toolbar) => {
      // decative measure
      viewer.deactivateMeasurement();
      viewer.toolbar?.updateMenu(ToolbarMenuId.Measure, {
        defaultActive: false,
      });
      viewer.deactivateZoomRect();
      viewer.toolbar?.setActive(ToolbarMenuId.ZoomToRectangle, false);

      // show all markup first
      const markups = viewer.getMarkups();
      markups.forEach((m) => viewer.setMarkupVisibility(m.id, true));
      viewer.toolbar?.setActive(ToolbarMenuId.MarkupVisibility, false);

      viewer.activateMarkup(MarkupType.CloudLineRectangle);
      // hide main toolbar
      toolbar.hide();

      // show markup toolbar
      createMarkupToolbar();
    },
  };
}

const viewer = new DxfViewer(config);
// const fontFiles = ["./demo/libs/fonts/Microsoft_YaHei_Regular.typeface.json"];
const fontFiles = [
  "./demo/libs/fonts/hztxt.shx",
  "./demo/libs/fonts/simplex.shx",
  "./demo/libs/fonts/arial.ttf",
  "./demo/libs/fonts/Microsoft_YaHei.ttf",
];
await viewer.setFont(fontFiles);

window.viewer = viewer;

const menuConfig = {
  [ToolbarMenuId.Layers]: {
    onActive: () => {
      console.log("[Toolbar]", "Activate Layers");
      if (!window.layerManager) {
        window.layerManager = new LayerManagerPlugin(window.viewer);
      }
      window.layerManager.show();
    },
    onDeactive: () => {
      console.log("[Toolbar]", "Deactivate Layers");
      window.layerManager.hide();
    },
  },
  [ToolbarMenuId.MarkupVisibility]: {
    onActive: (viewer) => {
      isShowMarkup = false;
      const markups = viewer.getMarkups();
      markups.forEach((m) => viewer.setMarkupVisibility(m.id, isShowMarkup));
    },
    onDeactive: (viewer) => {
      isShowMarkup = true;
      const markups = viewer.getMarkups();
      markups.forEach((m) => viewer.setMarkupVisibility(m.id, isShowMarkup));
    },
  },
};

new AxisGizmoPlugin(viewer, { ignoreZAxis: true });
new BottomBarPlugin(viewer);
new MeasurementPlugin(viewer);
new ScreenshotPlugin(viewer);
new StatsPlugin(viewer);
window.toolbar = new DxfViewerToolbarPlugin(viewer, { menuConfig });

const modelUploader = new LocalDxfUploader(viewer);
const pdfWorker = "./demo/libs/pdf/pdf.worker.min.js";
if (modelUploader.setPdfWorker) {
  modelUploader.setPdfWorker(pdfWorker);
}
modelUploader.onSuccess = (event) => {
  if (event && event.compare) {
    !viewer.dxfComparePanel &&
      (viewer.dxfComparePanel = new DxfComparePanel(viewer));
  }
};
document.getElementById("uploadModelFile").onClick = function () {
  modelUploader.openFileBrowserToUpload();
};
document.getElementById("loadDxf").onClick = function () {
  const url = document.getElementById("fileUrlInput").value;
  if (url) {
    viewer.loadModelAsync({ src: url, merge: true }).then(() => {
      console.log(`[Demo] Loaded model ${url}`);
    });
  }
};

viewer.addEventListener(ViewerEvent.LayoutChanged, () => {
  const layoutName = viewer.getActiveLayoutName();
  viewer.setMarkups(
    markupData.filter((markup) => markup.layoutName === layoutName)
  );
  viewer.setMeasurements(
    measurementData.filter((measure) => measure.layoutName === layoutName)
  );
});

viewer.addEventListener(ViewerEvent.MarkupAdded, (data) => {
  console.log("MarkupAdded", data);
  const layoutName = viewer.getActiveLayoutName();
  // Markup and layout correlation
  data.layoutName = layoutName;
  const index = markupData.findIndex((markup) => markup.id === data.id);
  if (index > -1) {
    markupData.splice(index, 1, data);
  } else {
    markupData.push(data);
  }
});
viewer.addEventListener(ViewerEvent.MarkupUpdated, (data) => {
  const { oldData, newData } = data;
  console.log("MarkupUpdated", oldData, newData);
  const layoutName = viewer.getActiveLayoutName();
  newData.layoutName = layoutName;
  const index = markupData.findIndex((markup) => markup.id === newData.id);
  markupData.splice(index, 1, newData);
});
viewer.addEventListener(ViewerEvent.MarkupRemoved, (data) => {
  console.log("MarkupRemoved", data);
  const index = markupData.findIndex((markup) => markup.id === data.id);
  markupData.splice(index, 1);
});

viewer.addEventListener(ViewerEvent.MeasurementAdded, (data) => {
  console.log("MeasurementAdded", data);
  const layoutName = viewer.getActiveLayoutName();
  // Measurement and layout correlation
  data.layoutName = layoutName;
  const index = measurementData.findIndex(
    (measurement) => measurement.id === data.id
  );
  if (index > -1) {
    measurementData.splice(index, 1, data);
  } else {
    measurementData.push(data);
  }
});
viewer.addEventListener(ViewerEvent.MeasurementRemoved, (data) => {
  console.log("MeasurementRemoved", data);
  const index = measurementData.findIndex(
    (measurement) => measurement.id === data.id
  );
  measurementData.splice(index, 1);
});

// markup toolbar for mobile demo
function createMarkupToolbar() {
  if (document.getElementById("markup-toolbar")) {
    document.getElementById("markup-toolbar").remove();
  }
  const markupContainer = document.createElement("div");
  markupContainer.id = "markup-toolbar";
  markupContainer.classList.add("markup-toolbar");
  const type2Name = {
    [MarkupType.Arrow]: "Главная",
    [MarkupType.Rectangle]: "_",
    [MarkupType.CloudLineRectangle]: "_",
    [MarkupType.PolyLine]: "_",
    [MarkupType.Ellipse]: "_",
    [MarkupType.Circle]: "_",
    [MarkupType.Text]: "_",
    ["ClearMarkup"]: "_",
    ["QuitMarkup"]: "_",
  };
  let lastTarget;
  [
    MarkupType.Arrow,
    MarkupType.Rectangle,
    MarkupType.CloudLineRectangle,
    MarkupType.PolyLine,
    MarkupType.Ellipse,
    MarkupType.Circle,
    MarkupType.Text,
    "ClearMarkup",
    "QuitMarkup",
  ].forEach((type) => {
    const item = document.createElement("div");
    item.classList.add("toolbar-item");
    const btn = document.createElement("span");
    btn.dataset.type = type;
    btn.innerText = type2Name[type];
    if (type === MarkupType.CloudLineRectangle) {
      btn.classList.add("toolbar-item-active");
      lastTarget = btn;
    }
    item.appendChild(btn);
    markupContainer.appendChild(item);
  });
  markupContainer.addEventListener("touchend", (e) => {
    if (e.target.dataset.type === "ClearMarkup") {
      viewer.clearMarkups();
      return;
    } else if (e.target.dataset.type === "QuitMarkup") {
      viewer.deactivateMarkup();
      markupContainer.style.display = "none";
      viewer.toolbar.show();
      return;
    }
    if (lastTarget) {
      lastTarget.classList.remove("toolbar-item-active");
    }
    if (e.target instanceof HTMLSpanElement) {
      e.target.classList.add("toolbar-item-active");
    }
    lastTarget = e.target;
    viewer.activateMarkup(e.target.dataset.type);
  });
  document.body.appendChild(markupContainer);
}

// for mobile cancel measureing and markup
let exitButton;
viewer.addEventListener(ViewerEvent.MeasurementActivated, (data) => {
  if (isMobile) {
    if (!exitButton) {
      exitButton = createMobileExitButton();
    }
    exitButton.style.display = "inline-block";
  }
});

viewer.addEventListener(ViewerEvent.MeasurementDeactivated, (data) => {
  if (exitButton) {
    exitButton.style.display = "none";
  }
});

function createMobileExitButton() {
  const button = document.createElement("button");
  button.innerText = "X";
  button.style.cssText = `position: absolute;right: 5%; top: 5%;background-color: #000000;color: #ffffff;padding: 3px 10px;font-weight: bolder;`;
  viewer.widgetContainer.appendChild(button);
  button.style.display = "none";
  button.addEventListener("touchstart", () => {
    viewer.cancelMeasurement();
  });
  return button;
}
