import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;

app.disableHardwareAcceleration();

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false, // Melhor segurança
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL("http://localhost:5173"); // Vite default port

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    app.whenReady().then(() => {
      mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          preload: path.join(__dirname, "preload.js"),
        },
      });

      mainWindow.loadURL("http://localhost:5173");
    });
  }
});

// Video Player Component
ipcMain.on("select-video", async (event, videoPath) => {
  if (mainWindow) {
    mainWindow.webContents.send("load-video", videoPath);
  }
});

// Overlay Support
ipcMain.on("add-overlay", async (event, overlayData) => {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send("overlay-added", overlayData);
  }
});
