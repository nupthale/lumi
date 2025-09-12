// 预加载脚本
const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 到渲染进程
contextBridge.exposeInMainWorld('clientAPI', {
  send: (channel, ...args) => {
    ipcRenderer.send(channel, ...args);
  },
  on: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  once: (channel, func) => {
    ipcRenderer.once(channel, (event, ...args) => func(...args));
  },

  // 平台信息 - 通过 IPC 从主进程获取
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  
  // 选择目录
  selectDirectory: () => ipcRenderer.invoke('selectDirectory'),
  
  // 保存设置
  saveSetting: (data) => {
    ipcRenderer.invoke('saveSetting', data);
  },
  // 获取设置
  getSetting: (key) =>  {
    return ipcRenderer.invoke('getSetting', key);
  },

  upload: (params) => {
    return ipcRenderer.invoke('upload', params);
  },

  getMachineId: () => {
    return ipcRenderer.invoke('getMachineId');
  },

  // 更新相关 API
  checkForUpdates: () => {
    return ipcRenderer.invoke('check-for-updates');
  },
  
  getUpdateStatus: () => {
    return ipcRenderer.invoke('get-update-status');
  },

  // 窗口控制
  windowMinimize: () => ipcRenderer.send('window-minimize'),
  windowMaximize: () => ipcRenderer.send('window-maximize'),
  windowClose: () => ipcRenderer.send('window-close')
});