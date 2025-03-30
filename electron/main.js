import { app, BrowserWindow, ipcMain, dialog, shell } from "electron";
import path from "path";
import fs from "fs";
import os from "os";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import express from "express";
import ffmpeg from "@ffmpeg-installer/ffmpeg";
import ffprobe from "@ffprobe-installer/ffprobe";

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Dynamically reference bundled FFmpeg binaries
const ffmpegPath = ffmpeg.path;
const ffprobePath = ffprobe.path;

let mainWindow = null;
let selectedVideoPath = null;

app.disableHardwareAcceleration();

// ✅ Create an Express server to serve videos dynamically
const videoServer = express();
const VIDEO_PORT = 3001; // ✅ Ensure this does not conflict with Vite

videoServer.get("/video", (_req, res) => {
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

  mainWindow.loadURL("http://localhost:5173"); // ✅ Ensure this matches Vite's port

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

    mainWindow.loadURL("http://localhost:5173");
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

// ✅ Render Video & Open Output Folder
ipcMain.handle(
  "render-remotion-video",
  async (_event, videoUrl, overlayText, startAt, duration) => {
    const downloadsDir = path.join(os.homedir(), "Downloads");
    const tempDir = os.tmpdir();

    const overlayOutput = path.join(tempDir, "overlay_output.mp4");
    const finalOutputFile = path.join(downloadsDir, "final_output.mp4");
    const finalOutputWithThumb = finalOutputFile.replace(".mp4", "_thumb.mp4");
    const thumbnailFile = path.join(tempDir, "thumbnail.jpg");
    const remotionEntry = path.join(__dirname, "../remotion/index.ts");

    const overlayDurationSec = Math.max(1, duration);
    const durationInFrames = overlayDurationSec * 30;
    const overlayEndTime = startAt + overlayDurationSec;

    // ✅ Write props to temporary file
    const props = {
      videoSrc: videoUrl,
      overlayText,
      startAt,
      durationInFrames,
    };
    console.log("Render props:", props);

    const propsFilePath = path.join(tempDir, "remotion_props.json");
    await fs.promises.writeFile(propsFilePath, JSON.stringify(props), "utf-8");

    // ✅ Run Remotion using spawn (cross-platform safe)
    await new Promise((resolve, reject) => {
      // ✅ Cross-platform command detection
      const command = process.platform === "win32" ? "npx.cmd" : "npx";
      console.log("Using command for Remotion render:", command);

      const renderProcess = spawn(
        command,
        [
          "remotion",
          "render",
          remotionEntry,
          "MyVideo",
          overlayOutput,
          "--props",
          propsFilePath,
          "--duration-in-frames",
          durationInFrames.toString(),
          "--fps",
          "30",
          "--concurrency",
          "1",
        ],
        { shell: true },
      );

      renderProcess.stdout.on("data", (data) => {
        const match = data.toString().match(/Rendered (\d+)\/(\d+)/);
        if (match && mainWindow) {
          const progress = (parseInt(match[1]) / parseInt(match[2])) * 50;
          mainWindow.webContents.send("render-progress", Math.floor(progress));
        }
      });

      renderProcess.stderr.on("data", (data) =>
        console.error("Remotion stderr:", data.toString()),
      );

      renderProcess.on("close", (code) => {
        code === 0 ? resolve() : reject("Remotion render failed");
      });
    });

    // ✅ Get original video duration
    const videoDuration = await new Promise((resolve, reject) => {
      let output = "";
      const probeProcess = spawn(ffprobePath, [
        "-i",
        selectedVideoPath,
        "-show_entries",
        "format=duration",
        "-v",
        "quiet",
        "-of",
        "csv=p=0",
      ]);

      probeProcess.stdout.on("data", (data) => (output += data));
      probeProcess.stderr.on("data", (data) =>
        console.error("FFprobe stderr:", data.toString()),
      );

      probeProcess.on("close", (code) => {
        code === 0
          ? resolve(parseFloat(output.trim()))
          : reject("FFprobe failed");
      });
    });

    // ✅ Get original video resolution
    const originalResolution = await new Promise((resolve, reject) => {
      let output = "";
      const probeProcess = spawn(ffprobePath, [
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-show_entries",
        "stream=width,height",
        "-of",
        "csv=s=x:p=0",
        selectedVideoPath,
      ]);

      probeProcess.stdout.on("data", (data) => (output += data));
      probeProcess.stderr.on("data", (data) =>
        console.error("FFprobe stderr:", data.toString()),
      );

      probeProcess.on("close", (code) => {
        code === 0 ? resolve(output.trim()) : reject("FFprobe failed");
      });
    });

    // ✅ Extract thumbnail (cover art) from original video
    await new Promise((resolve) => {
      const thumbnailProcess = spawn(ffmpegPath, [
        "-y",
        "-i",
        selectedVideoPath,
        "-vf",
        "thumbnail",
        "-frames:v",
        "1",
        thumbnailFile,
      ]);

      thumbnailProcess.stderr.on("data", (data) =>
        console.error("FFmpeg stderr:", data.toString()),
      );

      thumbnailProcess.on("close", (code) => {
        if (code !== 0) {
          console.warn(
            "Thumbnail extraction failed. Proceeding without thumbnail.",
          );
        }
        resolve();
      });
    });

    // ✅ FFmpeg merge videos in temp directory
    const mergedTempOutput = path.join(tempDir, "merged_output.mp4");
    const ffmpegArgs = [
      "-y",
      "-i",
      overlayOutput,
      "-i",
      selectedVideoPath,
      "-filter_complex",
      `[0:v]scale=${originalResolution}[v0]; [1:v]trim=start=${overlayEndTime},setpts=PTS-STARTPTS[v1]; [1:a]atrim=start=${overlayEndTime},asetpts=PTS-STARTPTS[a1]; [v0][0:a][v1][a1]concat=n=2:v=1:a=1[v][a]`,
      "-map",
      "[v]",
      "-map",
      "[a]",
      "-c:v",
      "libx264",
      "-crf",
      "18",
      "-preset",
      "veryfast",
      "-c:a",
      "aac",
      "-b:a",
      "320k",
      mergedTempOutput,
    ];

    console.log("Executing FFmpeg with arguments:", ffmpegArgs);

    await new Promise((resolve, reject) => {
      const ffmpegProcess = spawn(ffmpegPath, ffmpegArgs, { shell: false });

      ffmpegProcess.stderr.on("data", (data) => {
        console.error("FFmpeg stderr:", data.toString());

        // ✅ Update progress bar based on FFmpeg time processing
        const match = data.toString().match(/time=(\d+):(\d+):(\d+\.\d+)/);
        if (match && mainWindow) {
          const hours = parseInt(match[1]);
          const minutes = parseInt(match[2]);
          const seconds = parseFloat(match[3]);
          const currentTime = hours * 3600 + minutes * 60 + seconds;
          const progress = 50 + (currentTime / videoDuration) * 50;
          mainWindow.webContents.send(
            "render-progress",
            Math.min(100, Math.floor(progress)),
          );
        }
      });

      ffmpegProcess.on("close", (code) => {
        code === 0
          ? resolve(mergedTempOutput)
          : reject(`FFmpeg merge failed (code: ${code})`);
      });
    });

    // ✅ Reattach thumbnail (if available)
    const thumbnailExists = fs.existsSync(thumbnailFile);

    if (thumbnailExists) {
      await new Promise((resolve) => {
        const thumbnailProcess = spawn(ffmpegPath, [
          "-y",
          "-i",
          mergedTempOutput,
          "-i",
          thumbnailFile,
          "-map",
          "0",
          "-map",
          "1",
          "-c",
          "copy",
          "-disposition:v:1",
          "attached_pic",
          finalOutputWithThumb,
        ]);

        thumbnailProcess.stderr.on("data", (data) =>
          console.error("FFmpeg stderr:", data.toString()),
        );

        thumbnailProcess.on("close", (code) => {
          if (code !== 0) {
            console.warn(
              "Thumbnail embedding failed. Exporting without thumbnail.",
            );
            fs.copyFileSync(mergedTempOutput, finalOutputFile);
            shell.showItemInFolder(finalOutputFile);
          } else {
            shell.showItemInFolder(finalOutputWithThumb);
          }
          resolve();
        });
      });
    } else {
      fs.copyFileSync(mergedTempOutput, finalOutputFile);
      shell.showItemInFolder(finalOutputFile);
    }

    // ✅ Clean up temporary files
    [overlayOutput, mergedTempOutput, thumbnailFile].forEach((file) => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });

    return thumbnailExists ? finalOutputWithThumb : finalOutputFile;
  },
);
