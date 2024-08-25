const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const { execSync } = require('child_process');

let isDev;
let mainWindow;
let repoPath;

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
}

async function handleDirectorySelect() {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  if (canceled) {
    return undefined;
  } else {
    repoPath = filePaths[0];
    return getGitRepoInfo(repoPath)
  }
}

function getGitRepoInfo(repoPath) {
    try {
        // Get current branch
        const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: repoPath, encoding: 'utf8' }).trim();

        // Get remote names
        const remotes = execSync('git remote', { cwd: repoPath, encoding: 'utf8' })
            .split('\n')
            .filter(Boolean);

        // Get remote URLs and extract repo name
        let remoteUrls = {};
        let repoName = '';
        if (remotes.length > 0) {
            const firstRemoteUrl = execSync(`git remote get-url ${remotes[0]}`, { cwd: repoPath, encoding: 'utf8' }).trim();
            remoteUrls[remotes[0]] = firstRemoteUrl;
            
            // Extract the repo name (last part of the URL)
            repoName = firstRemoteUrl.split('/').pop().replace('.git', '');
        }

        return {
            repoPath,
            currentBranch,
            remotes,
            remoteUrls,
            repoName
        };
    } catch (error) {
        console.error('Error retrieving Git repository information:', error.message);
        return null;
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