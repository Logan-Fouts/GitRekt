const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');

let isDev;
let mainWindow;

async function initializeIsDev() {
  isDev = await import('electron-is-dev').then(module => module.default);
}

async function createWindow() {
  await initializeIsDev();

  mainWindow = new BrowserWindow({
    width: 1500,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, './build/index.html')}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

async function handleDirectorySelect() {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  if (canceled) {
    return undefined;
  } else {
    return filePaths[0];
  }
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle('dialog:selectDirectory', handleDirectorySelect);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});