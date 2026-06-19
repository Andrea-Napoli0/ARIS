import { app, BrowserWindow, Menu } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(
  fileURLToPath(import.meta.url)
);

// const isDev = !!process.env.VITE_DEV_SERVER_URL;

function createWindow() {
  const win = new BrowserWindow({
  width: 1920,//isDev ? 1600 : undefined,
  height: 1080,//isDev ? 900 : undefined,

  fullscreen:false,//!isDev,
  frame: true,//!isDev ? false : true,

  webPreferences: {
    preload: path.join(__dirname, "preload.mjs"),
  },
  });

  Menu.setApplicationMenu(null);

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  }
}

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