/*
 * @Author: 曾志航
 * @Date: 2024-12-13 09:12:30
 * @LastEditors: 曾志航
 * @LastEditTime: 2024-12-13 10:24:35
 * @FilePath: \wallhaven-electron\electron\lib\Tray.js
 * @Description: 托盘配置
 * @TODO:
 */
const { Tray, Menu, nativeImage } = require('electron');
const path = require('path')
const package = require('../../package.json')
let settingWindow;




const createTray = (mainWindow, createSettingWindow) => {
  // const icon = nativeImage.createFromPath(path.resolve(__dirname, "../icon/logo.ico"))
  const icon = nativeImage.createFromPath(path.resolve(__dirname, "../icon/logo.png"))

  //实例化一个tray对象，构造函数的唯一参数是需要在托盘中显示的图标url 
  tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开壁纸程序',
      type: 'normal',
      icon: nativeImage.createFromPath(path.resolve(__dirname, "../icon/app.png")),
      click: () => {
        mainWindow.show()
      }
    },
    {
      label: '设置',
      type: 'normal',
      icon: nativeImage.createFromPath(path.resolve(__dirname, "../icon/setting.png")),
      click: () => {
        if (settingWindow) {
          settingWindow.show()
        } else {
          settingWindow = createSettingWindow()
        }
      }
    },
    {
      label: '退出',
      type: 'normal',
      icon: nativeImage.createFromPath(path.resolve(__dirname, "../icon/exit.png")),
      role: "quit"
    }
  ])

  // 设置托盘菜单
  tray.setContextMenu(contextMenu)
  //鼠标移到托盘中应用程序的图标上时，显示的文本
  tray.setToolTip(`${package.name}版本号：${package.version}`)
  //点击图标的响应事件，这里是切换主窗口的显示和隐藏
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })
}


module.exports = {
  createTray
}