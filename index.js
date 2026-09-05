const path = require("node:path");
const { app, BrowserWindow, Tray, Menu } = require("electron");

let win = null;
let tray = null;
const width = 340
const height= 470

const createWindow = (config, parent) => {
  const win = new BrowserWindow({
    width: config.width,
    height: config.height,
    frame: false,
    resizable: false,
    show: false,
    movable: false,
    minimizable: false,
    maximizable: false,
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
  const trayIcon = path.resolve(__dirname, "./assets/tray.png");
  const tray = new Tray(trayIcon);
  const trayBounds = tray.getBounds()

  const showWin = () => {
    win.setPosition(
      trayBounds.x + trayBounds.width / 2 - width / 2,
      trayBounds.height
    );
    win.isVisible() ? win.hide() : win.show();
  }

  // showWin()

  tray.on("click", () => {
    showWin()
  });

  return tray;
};

app.whenReady().then(() => {
  win = createWindow({
    width,
    height,
    file: "window/index.html",
  });
  tray = createTray();
});
