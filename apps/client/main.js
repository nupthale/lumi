const { app, BrowserWindow, screen, Menu, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

const { registerService } = require('./services/index');

require('./update');

app.setName('Lumi');

let mainWindow = null;

const createWindow = () => {
  // 获取主屏幕的尺寸
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width,
    height,
    // mac下需要隐藏， windows不能隐藏
    ...(process.platform === 'darwin' ? { titleBarStyle: 'hidden' } : {}),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false, // 开发环境可以禁用，生产环境应启用
    },
    icon: path.join(__dirname, 'public/icon.png'),
    show: false, // 初始时不显示窗口
  })

  // 当窗口准备好时显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  })

  if (process.platform === 'darwin') {
     app.dock.setIcon(path.join(__dirname, 'public/icon.png'));
  }

  // 隐藏 Windows 下的菜单栏
  if (process.platform !== 'darwin') {
    mainWindow.setMenuBarVisibility(false);
  }

  // 根据环境加载不同的资源
  if (isDev) {
    // 开发环境：加载开发服务器地址
    mainWindow.loadURL('http://localhost:5173');

    // 自动打开开发者工具
    mainWindow.webContents.openDevTools()
  } else {
    // 生产环境：加载预渲染的HTML文件
    mainWindow.loadFile(path.join(__dirname, 'web', 'index.html'));
    // mainWindow.webContents.openDevTools()
  }
}

const createMenu = () => {
  const template = [
    {
      label: app.name,
      submenu: [
        {
          label: '设置',
          accelerator: 'Cmd+,',
          click: () => {
            const win = BrowserWindow.getFocusedWindow();
            if (win) {
              win.webContents.send('open-setting');
            }
          }
        },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ]
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        // { role: 'resetZoom' },
        // { role: 'zoomIn' },
        // { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: '窗口',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ]
    },
    // 在菜单中添加版本信息
    {
      label: '关于 Lumi',
      submenu: [
        {
          label: `版本 ${app.getVersion()}`,
          enabled: false
        },
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

app.whenReady().then(() => {
  // 调整 IndexedDB 配额限制（单位：字节）
  // 示例：设置为 20GB（20 * 1024^3 字节）
  app.commandLine.appendSwitch('indexed-db-quota', '20737418240');
  
  // 可选：调整整体缓存上限（单位：字节）
  app.commandLine.appendSwitch('disk-cache-size', '20737418240');

  createWindow();

  // mac显示菜单， windoow不要
  if (process.platform === 'darwin') {
    createMenu();
  }

  registerService();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

 // 添加 IPC 处理程序
ipcMain.on('reload-window', () => {
  if (mainWindow) {
    mainWindow.reload();
  }
});

