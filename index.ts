import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath, format } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const winds: any[] = []

// 用于记录消息通道，也就是记录窗口进程要注册的事件
const messageChannelRecord: any = {};

/**
 *
 * @param {*} channel 窗口进程中要注册的事件
 * @param {*} webContentsId 窗口对应的 id
 */
function registerChannel(channel: string, webContentsId: number) {
  if (messageChannelRecord[channel] !== undefined) {
    // 如果进入到这里，说明当前这个 channel 已经被注册过了
    // 接下来我们需要判断当前窗口是否已经注册过这个 channel
    let alreadyRegister = false;
    for (let i = 0; i < messageChannelRecord[channel].length; i++) {
      if (messageChannelRecord[channel][i] === webContentsId) {
        alreadyRegister = true;
        break;
      }
    }
    // 只需要根据 alreadyRegister 的值来判断是否需要注册
    if (!alreadyRegister) {
      messageChannelRecord[channel].push(webContentsId);
    }
  } else {
    // 如果进入到这里，说明当前这个 channel 还没有被注册过
    // 最终 channel 的数据结构是这样的：
    // {
    //   action: [1],
    // }
    messageChannelRecord[channel] = [webContentsId];
  }
}

ipcMain.on("registerChannelEvent", (event, channel) => {
  try {
    registerChannel(channel, event.sender.id);
  } catch (e) {
    console.error(e);
  }
});

/**
 *
 * @param {*} channel 窗口进程注册的事件
 * @return {*} 返回一个数组，数组中存储的是窗口进程的 id
 */
function getWebContentsId(channel: string) {
  return messageChannelRecord[channel] || [];
}

/**
 *
 * @param {*} webContentsIds 注册了 channel 事件的窗口 id 的数组
 * @param {*} channel 对应的事件
 * @param {*} data 要传递的数据
 */
function transText(webContentsIds: any[], channel: string, data: any) {
  // 遍历 webContentsIds，然后根据 id 获取到对应的窗口实例对象
  for (let i = 0; i < webContentsIds.length; i++) {
    for (let j = 0; i < winds.length; j++) {
      if (winds[j].webContents.id === webContentsIds[i]) {
        // 进入此 if，说明当前窗口实例对象就是我们要找的窗口实例对象
        // 接下来我们就可以向这个窗口实例对象发送消息了
        winds[j].webContents.send(channel, data);
        break;
      }
    }
  }
}

ipcMain.on("transTextEvent", (event, channel, data) => {
  try {
    transText(getWebContentsId(channel), channel, data);
  } catch (e) {
    console.error(e);
  }
});

const createWindow = (url: string) => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // 允许在渲染进程（在窗口）里面使用 node.js
      contextIsolation: false, // 关闭上下文隔离
      webviewTag: true, // 允许使用 <webview> 标签
    },
  });

  win.loadFile(url);

  return win
};


app.whenReady().then(() => {
    // 拼接 url
  const url1 = format({
    pathname: join(__dirname, "window1/window1.html"),
  });

  const url2 = format({
    pathname: join(__dirname, "window2/window2.html"),
  });

  winds.push(createWindow(url1));
  winds.push(createWindow(url2));
});
