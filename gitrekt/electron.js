const { app, BrowserWindow } = require('electron');
const path = require('path');

let isDev;

async function initializeIsDev() {
  isDev = await import('electron-is-dev').then(module => module.default);
}

async function createWindow() {
  await initializeIsDev();

  const win = new BrowserWindow({
    width: 1500,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, './build/index.html')}`
  );
}

app.whenReady().then(createWindow);

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