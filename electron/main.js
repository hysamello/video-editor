import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import fs from "fs";
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

  mainWindow.loadURL("http://localhost:5174"); // ✅ Ensure this matches your Vite port

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

// ✅ Select Video Without Copying
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

// ✅ Use the Absolute Path for Rendering (No Copying)
ipcMain.handle(
  "render-remotion-video",
  async (_event, videoUrl, overlayText) => {
    const outputDir = path.join(os.homedir(), "Downloads");
    const outputFile = path.join(outputDir, "remotion_output.mp4");

    return new Promise((resolve, reject) => {
      const remotionEntry = path.join(__dirname, "../remotion/index.ts");

      const renderCommand = `npx remotion render "${remotionEntry}" MyVideo "${outputFile}" --props '${JSON.stringify(
        {
          videoSrc: videoUrl, // ✅ Use the dynamic URL
          overlayText,
        },
      )}'`;

      console.log("🚀 Executing render command:", renderCommand);

      exec(renderCommand, (error, stdout, stderr) => {
        if (error) {
          console.error("❌ Error rendering video:", stderr);
          reject(stderr);
        } else {
          console.log("✅ Render successful!", stdout);
          resolve(outputFile);
        }
      });
    });
  },
);
