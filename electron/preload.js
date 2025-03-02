const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  openVideoDialog: () => ipcRenderer.invoke("open-video-dialog"),
  copyVideoToPublic: (videoPath) =>
    ipcRenderer.invoke("copy-video-to-public", videoPath),
  renderRemotionVideo: (videoPath, overlayText) =>
    ipcRenderer.invoke("render-remotion-video", videoPath, overlayText),
});
