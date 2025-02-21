import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;
let selectedVideoPath = null; // Store the selected video path

app.disableHardwareAcceleration();

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // Allow access to file paths
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
    const videoPath = result.filePaths[0];
    selectedVideoPath = videoPath;
    return videoPath;
  } else {
    return null;
  }
});

// Handle overlay data
ipcMain.on("add-overlay", async (event, overlayData) => {
  if (mainWindow) {
    mainWindow.webContents.send("overlay-added", overlayData);
  }
});

// Export video with overlay text
ipcMain.on("export-video", async (event, overlayText) => {
  console.log("Exporting video...");

  if (!mainWindow || !selectedVideoPath) {
    console.error("No video selected.");
    return;
  }

  const outputPath = path.join(__dirname, "output.mp4");

  // Sanitize text input
  const sanitizedText = overlayText.replace(/'/g, "\\'");
  const ffmpegCommand = `ffmpeg -i "${selectedVideoPath}" -vf "drawtext=text='${sanitizedText}':x=50:y=50:fontsize=24:fontcolor=white" -codec:a copy "${outputPath}"`;

  console.log("outputPath");
  console.log(outputPath);
  console.log("sanitizedText");
  console.log(sanitizedText);
  console.log("ffmpegCommand");
  console.log(ffmpegCommand);

  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error exporting video: ${error.message}`);
      console.error(stderr);
      return;
    }
    mainWindow.webContents.send("video-exported", outputPath);
  });
});

// Receive video path
ipcMain.on("video-path", (event, videoPath) => {
  selectedVideoPath = videoPath;
});
