const Store = require('electron-store').default;
const path = require('path');
const { app } = require('electron');

const store = new Store();

const getStoragePath = () => {
    const storagePath = store.get('storagePath');
  
    console.info('#storagePath', storagePath, app.getPath('userData'));
  
    const basePath = storagePath || app.getPath('userData');

    return path.join(basePath, 'Lumi');
};
  

module.exports = {
    store,
    getStoragePath,
};