const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  selectDirectory: () => ipcRenderer.invoke('dialog:selectDirectory'),
  getGitStatus: (repoPath) => ipcRenderer.invoke('git:getStatus', repoPath),
  gitAdd: (repoPath) => ipcRenderer.invoke('git:gitAdd', repoPath),
  gitCommit: (repoPath, message) => ipcRenderer.invoke('git:gitCommit', repoPath, message),
  getGitLog: (repoPath) => ipcRenderer.invoke('git:getGitLog', repoPath),
  gitPush: (repoPath, remote, branch) => ipcRenderer.invoke('git:push', repoPath, remote, branch),
  gitPull: (repoPath, remote, branch) => ipcRenderer.invoke('git:pull', repoPath, remote, branch),
  modifyEnv: (key, value) => ipcRenderer.invoke('env:modify', key, value),
  invoke: (channel, data) => ipcRenderer.invoke(channel, data),
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) => {
    const subscription = (_event, ...args) => func(...args)
    ipcRenderer.on(channel, subscription)
    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  }
})