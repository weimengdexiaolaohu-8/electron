import { app, BrowserWindow } from "electron";
import { fileURLToPath, format } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let parent: BrowserWindow | null = null;
let children: BrowserWindow | null = null;

const createWindow = (config: any, parent?: any) => {
  const win = new BrowserWindow({
    width: config.width,
    height: config.height,
    icon: "public/favicon.ico",
    parent: parent ? parent : null,
    alwaysOnTop: parent ? false : true,
    webPreferences: {
      nodeIntegration: true, // 允许在渲染进程（在窗口）里面使用 node.js
      contextIsolation: false, // 关闭上下文隔离
      webviewTag: true, // 允许使用 <webview> 标签
    },
  });

  win.loadFile(config.file);

  return win;
};

app.whenReady().then(() => {
  // 拼接 url
  const url1 = format({
    pathname: join(__dirname, "window1/window1.html"),
  });

  const url2 = format({
    pathname: join(__dirname, "window2/window2.html"),
  });

  parent = createWindow({
    width: 800,
    height: 600,
    file: url1,
  });
  children = createWindow(
    {
      width: 400,
      height: 200,
      file: url2,
    },
    parent,
  );

  const { x, y, width } = parent?.getBounds()

  children.setPosition(x+width+15, y)
  children.show()

  parent.setAlwaysOnTop(true, 'pop-up-menu')
});
