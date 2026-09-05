require("./shortcut.js");
const path = require("node:path");
const { app, BrowserWindow, Tray, Menu } = require("electron");

let win = null;
let tray = null;

const createWindow = (config, parent) => {
  const win = new BrowserWindow({
    width: config.width,
    height: config.height,
    webPreferences: {
      nodeIntegration: true, // 允许在渲染进程（在窗口）里面使用 node.js
      contextIsolation: false, // 关闭上下文隔离
      webviewTag: true, // 允许使用 <webview> 标签
    },
  });

  win.loadFile(config.file);

  return win;
};

const createTray = () => {
  const trayIcon = path.resolve(__dirname, "./assets/tray.jpg");
  const tray = new Tray(trayIcon);
  tray.on("click", () => {
    win.isVisible() ? win.hide() : win.show();
  });
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "显示/隐藏",
      click: () => {
        win.isVisible() ? win.hide() : win.show();
      },
    },
    {
      label: "退出",
      click: () => {
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu)
  return tray;
};

app.whenReady().then(() => {
  win = createWindow({
    width: 600,
    height: 400,
    file: "window/index.html",
  });
  tray = createTray();
});
