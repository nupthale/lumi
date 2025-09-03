const { ipcMain } = require('electron');
const path = require('path');
const fs = require('fs').promises;

const { success, fail } = require('./shared');

const { getStoragePath } = require('../store');

// 注册文档相关的IPC处理函数
const registerFileUploadService = () => {
    // 上传文件
    ipcMain.handle('upload', async (event, params) => {
        try {
            const { file, name } = params;
            if (!file || !name) {
                return fail('文件数据不能为空');
            }

            // 获取存储目录
            const storagePath = getStoragePath();
            const now = +new Date();
            const uniqueFileName = `${now}_${name}`;
            const targetPath = path.join(storagePath, 'resources', uniqueFileName);

            try {
                await fs.access(path.join(storagePath, 'resources'));
            } catch {
                await fs.mkdir(path.join(storagePath, 'resources'), { recursive: true });
            }

            // 处理文件数据
            const buffer = Buffer.from(file.data);

            // 保存文件
            await fs.writeFile(targetPath, buffer);

            return success({
                src: `file://${targetPath}`,
                fileName: name,
                type: file.type,
            });
        } catch (error) {
            console.error('上传文件失败:', error);
            return fail(error.message);
        }
    });
};

module.exports = {
    registerFileUploadService,
};