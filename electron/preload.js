const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  openVideoDialog: () => ipcRenderer.invoke("open-video-dialog"),
  renderRemotionVideo: (videoSrc, overlayText, progressCallback) => {
    ipcRenderer.on("render-progress", (_event, progress) => {
      progressCallback(progress);
    });
    return ipcRenderer.invoke("render-remotion-video", videoSrc, overlayText);
  },
});
