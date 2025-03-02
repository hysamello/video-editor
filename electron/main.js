import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import express from "express"; // ✅ Import Express

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;
let selectedVideoPath = null;

app.disableHardwareAcceleration();

// ✅ Create an Express server to serve videos dynamically
const videoServer = express();
const VIDEO_PORT = 3001; // ✅ Ensure this does not conflict with Vite

videoServer.get("/video", (req, res) => {
  if (!selectedVideoPath) {
    return res.status(404).send("No video selected");
  }

  res.sendFile(selectedVideoPath);
});

videoServer.listen(VIDEO_PORT, () => {
  console.log(
    `📽️ Video server running at http://localhost:${VIDEO_PORT}/video`,
  );
});

// ✅ Electron App Initialization
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

  mainWindow.loadURL("http://localhost:5174"); // ✅ Ensure this matches Vite's port

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
    mainWindow = new BrowserWindow({
      width: 1280,
      height: 720,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js"),
      },
    });

    mainWindow.loadURL("http://localhost:5174");
  }
});

// ✅ Select Video & Stream via Express
ipcMain.handle("open-video-dialog", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Videos", extensions: ["mp4", "mkv", "avi", "mov"] }],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    selectedVideoPath = result.filePaths[0]; // ✅ Store the absolute path
    console.log("✅ Selected video:", selectedVideoPath);
    return `http://localhost:${VIDEO_PORT}/video`; // ✅ Return URL for Remotion
  }
  return null;
});

// ✅ Render Video Using Remotion with Progress Tracking
ipcMain.handle(
  "render-remotion-video",
  async (_event, videoUrl, overlayText) => {
    const outputDir = path.join(os.homedir(), "Downloads");
    const outputFile = path.join(outputDir, "remotion_output.mp4");
    const remotionEntry = path.join(__dirname, "../remotion/index.ts");

    return new Promise((resolve, reject) => {
      const renderCommand = `npx remotion render "${remotionEntry}" MyVideo "${outputFile}" --props '${JSON.stringify(
        { videoSrc: videoUrl, overlayText },
      )}'`;

      console.log("🚀 Executing render command:", renderCommand);

      const process = exec(renderCommand);

      process.stdout.on("data", (data) => {
        console.log(data);
        const match = data.match(/Rendered (\d+)\/(\d+)/);
        if (match && mainWindow) {
          const progress = (parseInt(match[1]) / parseInt(match[2])) * 100;
          mainWindow.webContents.send("render-progress", progress);
        }
      });

      process.stderr.on("data", (data) => {
        console.error("Error:", data);
      });

      process.on("close", (code) => {
        if (code === 0) {
          console.log("✅ Render successful!");
          resolve(outputFile);
        } else {
          reject("Render failed.");
        }
      });
    });
  },
);
