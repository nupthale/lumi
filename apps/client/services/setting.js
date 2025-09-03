const { ipcMain, dialog } = require('electron');

const { store } = require('../store');

const registerSettingService = () => {
    ipcMain.handle('saveSetting', async (event, params) => {
        store.set(params.key, params.value);
        return true;
    });

    ipcMain.handle('getSetting', async (event, key) => {
        return store.get(key);
    });

    ipcMain.handle('selectDirectory', async (event, params) => {
        const result = await dialog.showOpenDialog({
            properties: ['openDirectory'],
            title: '选择存储目录'
          });
        
          if (!result.canceled && result.filePaths.length > 0) {
            return result.filePaths[0];
          }

          return null;
    });
}


module.exports = {
    registerSettingService,
};