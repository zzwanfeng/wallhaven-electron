/*
 * @Author: 曾志航
 * @Date: 2024-11-29 16:50:38
 * @LastEditors: 曾志航
 * @LastEditTime: 2024-12-13 10:57:15
 * @FilePath: \wallhaven-electron\electron\Main.js
 * @Description: electron 主程序
 * @TODO:
 */


// 控制应用生命周期和创建原生浏览器窗口的模组
const { app, BrowserWindow, ipcMain, Tray, Menu, screen, dialog } = require('electron')
//获取单例锁
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  const { mainWindowIpcStart } = require("./lib/ipcMain")
  const { createTray } = require('./lib/tray')
  const { createWindow, createSettingWindow } = require('./lib/window')


  app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
  // 解决报错
  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

  // 创建主窗口
  let mainWindow;


  // 这段程序将会在 Electron 结束初始化
  // 和创建浏览器窗口的时候调用
  // 部分 API 在 ready 事件触发后才能使用。
  app.whenReady().then(() => {
    mainWindow = createWindow();
    // ipc通讯
    mainWindowIpcStart(mainWindow, createSettingWindow)
    // 系统托盘
    createTray(mainWindow, createSettingWindow)
  })



  // 当运行第二个实例时,将会聚焦到myWindow这个窗口
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  app.on('quit', () => {
    app.releaseSingleInstanceLock();//释放所有的单例锁
  });

  // 在这个文件中，你可以包含应用程序剩余的所有部分的代码，
  // 也可以拆分成几个文件，然后用 require 导入。


}