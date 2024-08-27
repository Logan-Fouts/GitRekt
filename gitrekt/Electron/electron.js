const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs').promises;
const url = require('url');


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

async function modifyEnvFile(key, value) {
  try {
    const envPath = path.join(app.getAppPath(), '.env');
    let envContent = '';

    try {
      envContent = await fs.readFile(envPath, 'utf8');
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    const envLines = envContent.split('\n');
    const keyIndex = envLines.findIndex(line => line.startsWith(`${key}=`));

    if (keyIndex !== -1) {
      envLines[keyIndex] = `${key}=${value}`;
    } else {
      envLines.push(`${key}=${value}`);
    }

    const updatedEnvContent = envLines.join('\n');
    await fs.writeFile(envPath, updatedEnvContent, 'utf8');

    console.log(`Successfully updated ${key} in .env file`);
    return true;
  } catch (error) {
    console.error('Error modifying .env file:', error);
    return false;
  }
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

    let remoteUrls = {};
    let repoName = '';
    let ownerName = '';
    let githubUrl = '';

    if (remotes.length > 0) {
      let firstRemoteUrl = execSync(`git remote get-url ${remotes[0]}`, { cwd: repoPath, encoding: 'utf8' }).trim();
      remoteUrls[remotes[0]] = firstRemoteUrl;

      // Handle SSH URLs
      if (firstRemoteUrl.startsWith('git@github.com:')) {
        firstRemoteUrl = 'https://github.com/' + firstRemoteUrl.slice('git@github.com:'.length);
      }

      // Parse the remote URL
      const parsedUrl = url.parse(firstRemoteUrl);
      const pathParts = parsedUrl.path.split('/').filter(Boolean);

      if (pathParts.length >= 2) {
        ownerName = pathParts[pathParts.length - 2];
        repoName = pathParts[pathParts.length - 1].replace('.git', '');

        githubUrl = `https://github.com/${ownerName}/${repoName}`;
      }
    }

    return {
      repoPath,
      currentBranch,
      remotes,
      remoteUrls,
      repoName,
      ownerName,
      githubUrl
    };
  } catch (error) {
    console.error('Error retrieving Git repository information:', error.message);
    return null;
  }
}

function getGitStatus(repoPath) {
  try {
    const status = execSync('git status --porcelain', { cwd: repoPath, encoding: 'utf8' }).trim();
    return status;
  } catch (error) {
    console.error('Error getting Git status:', error.message);
    return null;
  }
}


function gitAdd(repoPath) {
  try {
    execSync('git add .', { cwd: repoPath, encoding: 'utf8' }).trim();
  } catch (error) {
    console.error('Error getting Git status:', error.message);
    return null;
  }
}

function gitCommit(repoPath, message) {
  try {
    const escapedMessage = message.replace(/"/g, '\\"');
    const result = execSync(`git commit -m "${escapedMessage}"`, { cwd: repoPath, encoding: 'utf8' });
    console.log('Commit successful:', result);
    return result;
  } catch (error) {
    console.error('Error committing changes:', error.message);
    return null;
  }
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle('dialog:selectDirectory', handleDirectorySelect);
  ipcMain.handle('git:getStatus', async (event, repoPath) => {
    return getGitStatus(repoPath);
  });
  ipcMain.handle('git:gitAdd', async (event, repoPath) => {
    return gitAdd(repoPath);
  });
  ipcMain.handle('git:gitCommit', async (event, repoPath, message) => {
    return gitCommit(repoPath, message);
  });
  ipcMain.handle('env:modify', async (event, key, value) => {
    return await modifyEnvFile(key, value);
  });
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