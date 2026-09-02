import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath, format } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const createWindow = (config: any, parent?: any) => {
  const win = new BrowserWindow({
    width: config.width,
    height: config.height,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true, // 允许在渲染进程（在窗口）里面使用 node.js
      contextIsolation: false, // 关闭上下文隔离
      webviewTag: true, // 允许使用 <webview> 标签
    },
  });

  win.setAlwaysOnTop(true, "pop-up-menu")
  // win.setIgnoreMouseEvents(true); // 设置鼠标事件可以穿透

  win.loadFile(config.file);

  return win;
};

app.whenReady().then(() => {
  // 拼接 url
  const url1 = format({
    pathname: join(__dirname, "window/index.html"),
  });

  createWindow({
    width: 600,
    height: 400,
    file: url1,
  });
});

ipcMain.on("setIgnoreMouseEvent", (e, ingore, options?: { forward: boolean }) => {
  console.log(ingore, options);
  
  // 通过 BrowserWindow.fromWebContents(e.sender) 拿到当前的窗口
  // 等同于上面的 win
  console.log(BrowserWindow.fromWebContents(e.sender));
  
  BrowserWindow.fromWebContents(e.sender)?.setIgnoreMouseEvents(ingore, options);
});
