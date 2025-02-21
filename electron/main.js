import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import fs from "fs";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;
let selectedVideoPath = null;

app.disableHardwareAcceleration();

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL("http://localhost:5173");

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

// Open video dialog
ipcMain.handle("open-video-dialog", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Videos", extensions: ["mp4", "mkv", "avi", "mov"] }],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    selectedVideoPath = result.filePaths[0];
    return selectedVideoPath;
  } else {
    return null;
  }
});

// Handle overlay data
ipcMain.on("add-overlay", (event, overlayData) => {
  if (mainWindow) {
    mainWindow.webContents.send("overlay-added", overlayData);
  }
});

// Generate unique filename in Downloads folder
function getUniqueFilePath(directory, filename) {
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);
  let counter = 0;
  let finalPath = path.join(directory, `${name}${ext}`);

  while (fs.existsSync(finalPath)) {
    counter++;
    finalPath = path.join(directory, `${name} (${counter})${ext}`);
  }

  return finalPath;
}

// Export video with overlay text
ipcMain.on("export-video", (event, overlayText) => {
  if (!mainWindow || !selectedVideoPath) {
    console.error("No video selected.");
    return;
  }

  const downloadsDir = path.join(os.homedir(), "Downloads");
  const outputFilePath = getUniqueFilePath(downloadsDir, "exported_video.mp4");

  const sanitizedText = overlayText.replace(/'/g, "\\'");
  const ffmpegCommand = `ffmpeg -i "${selectedVideoPath}" -vf "drawtext=text='${sanitizedText}':x=50:y=50:fontsize=24:fontcolor=white" -codec:a copy "${outputFilePath}"`;

  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error exporting video: ${error.message}`);
      console.error(stderr);
      return;
    }
    mainWindow.webContents.send("video-exported", outputFilePath);
  });
});

// Receive video path
ipcMain.on("video-path", (event, videoPath) => {
  selectedVideoPath = videoPath;
});
