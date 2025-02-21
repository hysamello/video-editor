const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  sendOverlayData: (data) => ipcRenderer.send("add-overlay", data),
  onOverlayAdded: (callback) => {
    ipcRenderer.removeAllListeners("overlay-added");
    ipcRenderer.on("overlay-added", (_event, data) => callback(data));
  },
  exportVideo: () => ipcRenderer.send("export-video"),
});
