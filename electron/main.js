import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;
let selectedVideoPath = null; // Armazenar o caminho do vídeo selecionado

app.disableHardwareAcceleration();

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false, // Melhor segurança
      contextIsolation: true,
      webSecurity: false, // Permitir acesso ao caminho dos arquivos
      enableRemoteModule: true, // Ativar acesso remoto (necessário para acessar o caminho do arquivo)
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

// Novo evento IPC para abrir o diálogo de seleção de vídeo
ipcMain.handle("open-video-dialog", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Videos", extensions: ["mp4", "mkv", "avi", "mov"] }],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const videoPath = result.filePaths[0];
    selectedVideoPath = videoPath; // Armazenar o caminho do vídeo
    return videoPath;
  } else {
    return null;
  }
});

// Overlay Support
ipcMain.on("add-overlay", async (event, overlayData) => {
  if (mainWindow) {
    mainWindow.webContents.send("overlay-added", overlayData);
  }
});

// Exportar o vídeo com sobreposição
ipcMain.on("export-video", async () => {
  console.log("export-video");

  if (!mainWindow || !selectedVideoPath) {
    console.error("Nenhum vídeo selecionado.");
    return;
  }

  const outputPath = path.join(__dirname, "output.mp4");

  console.log("outputPath");
  console.log(outputPath);

  // Substituir pelo caminho correto
  const ffmpegCommand = `ffmpeg -i "${selectedVideoPath}" -vf "drawtext=text='Example':x=50:y=50:fontsize=24:fontcolor=white" -codec:a copy "${outputPath}"`;

  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao exportar vídeo: ${error.message}`);
      console.error(stderr);
      return;
    }
    mainWindow.webContents.send("video-exported", outputPath);
  });
});
