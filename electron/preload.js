const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  sendOverlayData: (data) => ipcRenderer.send("add-overlay", data),
  onOverlayAdded: (callback) => {
    ipcRenderer.removeAllListeners("overlay-added");
    ipcRenderer.on("overlay-added", (_event, data) => callback(data));
  },
  exportVideo: (overlayText) => ipcRenderer.send("export-video", overlayText),
  onVideoExported: (callback) => {
    ipcRenderer.removeAllListeners("video-exported");
    ipcRenderer.on("video-exported", (_event, filePath) => callback(filePath));
  },
  sendVideoPath: (videoPath) => ipcRenderer.send("video-path", videoPath),
  openVideoDialog: () => ipcRenderer.invoke("open-video-dialog"),
});
