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

// Save the overlay image
ipcMain.on("save-overlay-image", (event, imageData) => {
  const downloadsDir = path.join(os.homedir(), "Downloads");
  const overlayPath = path.join(downloadsDir, "overlay.png");

  const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
  fs.writeFileSync(overlayPath, base64Data, "base64");

  event.sender.send("overlay-image-saved", overlayPath);
});

// Generate unique filename
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

// Export video with overlay image
ipcMain.on("export-video-with-image", (event, imagePath) => {
  if (!mainWindow || !selectedVideoPath) {
    console.error("No video selected.");
    return;
  }

  const downloadsDir = path.join(os.homedir(), "Downloads");
  const outputFilePath = getUniqueFilePath(
    downloadsDir,
    "exported_video_with_overlay.mp4",
  );

  const ffmpegCommand = `ffmpeg -i "${selectedVideoPath}" -i "${imagePath}" -filter_complex "[1][0]scale2ref=w=iw:h=ih[overlay][base];[base][overlay]overlay=10:10" -codec:a copy "${outputFilePath}"`;

  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error exporting video: ${error.message}`);
      console.error(stderr);
      return;
    }
    mainWindow.webContents.send("video-exported", outputFilePath);
  });
});
