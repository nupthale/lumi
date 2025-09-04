const { app, ipcMain } = require('electron');
// auto updater
const { updateElectronApp } = require('update-electron-app');

// 启动自动更新
updateElectronApp({
    repo: 'nupthale/lumi',
    updateInterval: '5 minutes',
    logger: require('electron-log'),
    notifyUser: true,
  });

ipcMain.handle('get-app-version', () => {
    return {
        currentVersion: app.getVersion(),
    };
});