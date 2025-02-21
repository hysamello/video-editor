const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  openVideoDialog: () => ipcRenderer.invoke("open-video-dialog"),
  sendOverlayData: (data) => ipcRenderer.send("add-overlay", data),
  onOverlayAdded: (callback) => {
    ipcRenderer.removeAllListeners("overlay-added");
    ipcRenderer.on("overlay-added", (_event, data) => callback(data));
  },
  exportVideo: () => ipcRenderer.send("export-video"),
  onVideoExported: (callback) => {
    ipcRenderer.removeAllListeners("video-exported");
    ipcRenderer.on("video-exported", (_event, filePath) => callback(filePath));
  },
});
