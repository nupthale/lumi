const { ipcMain } = require('electron');
const { machineIdSync } = require('node-machine-id');

const { store } = require('../store');

const registerMachineIdService = () => {
    ipcMain.handle('getMachineId', async () => {
        let machineId = store.get('machineId');

        if (!machineId) {
            machineId = machineIdSync({ origin: true });

            store.set('machineId', machineId);
        }

        return machineId;
    });
}


module.exports = {
    registerMachineIdService,
};