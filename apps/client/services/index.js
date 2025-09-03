
const { registerSettingService } = require('./setting');
const { registerFileUploadService } = require('./fileUpload');
const { registerMachineIdService } = require('./machineId');

module.exports = {
    registerService: () => {
        registerSettingService();
        registerFileUploadService();
        registerMachineIdService();
    }
};