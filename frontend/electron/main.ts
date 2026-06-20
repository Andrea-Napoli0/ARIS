import { app, BrowserWindow, ipcMain, Menu } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(
  fileURLToPath(import.meta.url)
);

const isDev = !!process.env.VITE_DEV_SERVER_URL;

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
  width: 1920,//isDev ? 1600 : undefined,
  height: 1080,//isDev ? 900 : undefined,
  resizable: true,
  fullscreen:false,//!isDev,
  frame: false,//!isDev ? false : true,


  webPreferences: {
    preload: path.join(__dirname, "preload.mjs"),
    contextIsolation: true,
  },
  });

  Menu.setApplicationMenu(null);
  mainWindow.webContents.devToolsWebContents

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  }
}

ipcMain.on("window-minimize", () => {
  mainWindow?.minimize();
});

ipcMain.on('window-maximize', () => {
  if (!mainWindow) return;
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on('window-close', () => {
  mainWindow?.close();
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});