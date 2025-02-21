const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  sendOverlayImage: (imageData) =>
    ipcRenderer.send("save-overlay-image", imageData),
  onOverlayImageSaved: (callback) => {
    ipcRenderer.on("overlay-image-saved", (_event, filePath) =>
      callback(filePath),
    );
  },
  exportVideoWithImage: (imagePath) =>
    ipcRenderer.send("export-video-with-image", imagePath),
  onVideoExported: (callback) => {
    ipcRenderer.on("video-exported", (_event, filePath) => callback(filePath));
  },
  openVideoDialog: () => ipcRenderer.invoke("open-video-dialog"),
});
