const { app, ipcMain } = require('electron');
const log = require('electron-log');

// 只在非 macOS 的生产版本中启用自动更新， mac需要signed code才行， 否则报错。
const isDev = process.env.NODE_ENV === 'development';
const isPackaged = app.isPackaged;
const isMac = process.platform === 'darwin';

if (!isDev && isPackaged && !isMac) {
  try {
    const { updateElectronApp } = require('update-electron-app');
    updateElectronApp({
      repo: 'nupthale/lumi',
      updateInterval: '5 minutes',
      logger: log,
      notifyUser: true,
    });
    log.info('Auto-updater initialized successfully');
  } catch (error) {
    log.error('Failed to initialize auto-updater:', error.message);
  }
} else {
  if (isDev) {
    log.info('Auto-updater disabled in development mode');
  } else if (!isPackaged) {
    log.info('Auto-updater disabled - not packaged');
  } else if (isMac) {
    log.info('Auto-updater disabled on macOS');
  }
}

ipcMain.handle('get-app-version', () => {
    return {
        currentVersion: app.getVersion(),
    };
});