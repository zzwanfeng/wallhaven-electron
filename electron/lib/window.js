/*
 * @Author: 曾志航
 * @Date: 2024-12-13 09:32:18
 * @LastEditors: 曾志航
 * @LastEditTime: 2024-12-13 10:54:00
 * @FilePath: \wallhaven-electron\electron\lib\window.js
 * @Description: 窗口
 * @TODO:
 */
const { BrowserWindow, Tray, Menu, } = require('electron')
const path = require('path')
//应用运行时的标题栏图标
const iconPath = path.join(__dirname, '../icon/logo.ico')

// 主窗口
const createWindow = () => {
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 1580,
    height: 888,
    resizable: true,      //允许用户改变窗口大小
    useContentSize: true, //设置 web 页面的尺寸不包含边框
    transparent: false,    //窗口 透明 在Windows上，仅在无边框窗口下起作用
    icon: iconPath,       //应用运行时的标题栏图标
    show: false,          //窗口是否在创建时显示
    webPreferences: {
      webSecurity: false,  //当设置为 false, 它将禁用同源策略 
      nodeIntegration: true,//是否启用Node integration 默认值为 false
      backgroundThrottling: false,   //设置应用在后台正常运行
      nodeIntegration: true,     //设置能在页面使用nodejs的API
      contextIsolation: false,//是否在独立 JavaScript 环境中运行 Electron API和指定的preload 脚本
      webviewTag: true,      //是否启用 <webview> tag标签. 默认值为 false
      preload: path.join(__dirname, './preload.js')
    },
    // frame: process.env.NODE_ENV === 'development' ? true : false,//创建一个无边框窗口
    frame: false,//创建一个无边框窗口
  })

  // 加载 index.html
  win.loadURL(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5173'
      : path.resolve(__dirname, '../dist/index.html')
  );

  // 去掉菜单栏
  win.removeMenu()
  win.on('closed', () => { mainWindow = null; })
  win.on('ready-to-show', () => { win.show() })
  // // 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
  // // 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
  // app.on('window-all-closed', function () {
  //   if (process.platform !== 'darwin') app.quit()
  // })

  // 打开开发工具
  if (process.env.NODE_ENV === "development") {
    win.webContents.openDevTools()
  }

  return win
}

// 设置功能 窗口
const createSettingWindow = () => {
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 450,
    height: 340,
    maxWidth: 450,
    maxHeight: 340,
    maximizable: false,
    icon: path.resolve(__dirname, "../icon/logo.png"),
    resizable: false,
    show: false,
    frame: false,
    transparent: true,
    backgroundColor: "#00ffffff",
    fullscreenable: false,
    webPreferences: {
      preload: path.resolve(__dirname, "./preload.js"),
    }
  })

  // 加载 index.html
  win.loadURL(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5173/config.html'
      : path.resolve(__dirname, '../dist/config.html')
  );

  // 去掉菜单栏
  win.removeMenu()
  win.on('closed', () => { mainWindow = null; })
  win.on('ready-to-show', () => { win.show() })

  // 打开开发工具
  if (process.env.NODE_ENV === "development") {
    win.webContents.openDevTools()
  }

  return win
}


module.exports = {
  createWindow,
  createSettingWindow
}